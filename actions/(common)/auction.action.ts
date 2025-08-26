"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, AuctionStatus, ProductCategory, ProductStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface CreateAuctionData {
	productId: string
	title: string
	description: string
	startPrice: number
	minIncrement: number
	startTime: Date
	endTime: Date
}

interface CreateProductAndAuctionData {
	title: string
	description: string
	category: ProductCategory
	images: string[]
	quantity: number
	unit: string
	isOrganic: boolean
	startingPrice: number
	currentPrice: number
	reservePrice?: number
	governmentRate: number
	minBidIncrement: number
	startTime: Date
	endTime: Date
}

export async function createAuction(data: CreateAuctionData) {
	try {
		const session = await auth()

		if (!session?.user || (session.user.role !== Role.FARMER && session.user.role !== Role.ADMIN)) {
			throw new Error("Unauthorized")
		}

		// Verify the product belongs to the farmer (unless admin)
		if (session.user.role === Role.FARMER) {
			const product = await prisma.product.findFirst({
				where: {
					id: data.productId,
					farmerId: session.user.id
				}
			})

			if (!product) {
				throw new Error("Product not found or doesn't belong to you")
			}
		}

		const auction = await prisma.auction.create({
			data: {
				productId: data.productId,
				farmerId: session.user.id,
				title: data.title,
				description: data.description,
				startPrice: data.startPrice,
				currentBid: data.startPrice,
				minIncrement: data.minIncrement,
				startTime: data.startTime,
				endTime: data.endTime,
				status: data.startTime <= new Date() ? AuctionStatus.ACTIVE : AuctionStatus.PENDING
			},
			include: {
				product: {
					select: {
						id: true,
						name: true,
						description: true,
						images: true,
						category: true,
						unit: true
					}
				},
				farmer: {
					select: {
						id: true,
						name: true,
						image: true
					}
				}
			}
		})

		revalidatePath("/bidding")
		return { success: true, auction }
	} catch (error) {
		console.error("Error creating auction:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to create auction" }
	}
}

export async function createProductAndAuction(data: CreateProductAndAuctionData) {
	try {
		const session = await auth()

		if (!session?.user || (session.user.role !== Role.FARMER && session.user.role !== Role.ADMIN)) {
			throw new Error("Unauthorized")
		}

		// Create product and auction in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create the product first
			const product = await tx.product.create({
				data: {
					name: data.title,
					description: data.description,
					category: data.category,
					images: data.images,
					stock: Math.floor(data.quantity),
					unit: data.unit,
					organicCertified: data.isOrganic,
					price: data.governmentRate, // Store government rate as base price
					farmerId: session.user.id,
					status: ProductStatus.ACTIVE,
					location: "TBD", // TODO: Get from user profile
					district: "TBD" // TODO: Get from user profile
				}
			})

			// Create the auction
			const auction = await tx.auction.create({
				data: {
					productId: product.id,
					farmerId: session.user.id,
					title: data.title,
					description: data.description,
					startPrice: data.startingPrice,
					currentBid: data.startingPrice,
					minIncrement: data.minBidIncrement,
					startTime: data.startTime,
					endTime: data.endTime,
					status: data.startTime <= new Date() ? AuctionStatus.ACTIVE : AuctionStatus.PENDING
				},
				include: {
					product: {
						select: {
							id: true,
							name: true,
							description: true,
							images: true,
							category: true,
							unit: true
						}
					},
					farmer: {
						select: {
							id: true,
							name: true,
							image: true
						}
					}
				}
			})

			return auction
		})

		revalidatePath("/bidding")
		return { success: true, data: result }
	} catch (error) {
		console.error("Error creating product and auction:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to create auction" }
	}
}

export async function getActiveAuctions() {
	try {
		const auctions = await prisma.auction.findMany({
			where: {
				status: AuctionStatus.ACTIVE,
				endTime: {
					gt: new Date()
				}
			},
			include: {
				product: {
					select: {
						id: true,
						name: true,
						description: true,
						images: true,
						category: true,
						unit: true
					}
				},
				farmer: {
					select: {
						id: true,
						name: true,
						image: true
					}
				},
				bids: {
					take: 1,
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						bidder: {
							select: {
								id: true,
								name: true,
								image: true
							}
						}
					}
				},
				_count: {
					select: {
						bids: true
					}
				}
			},
			orderBy: {
				endTime: 'asc'
			}
		})

		return { success: true, auctions }
	} catch (error) {
		console.error("Error fetching auctions:", error)
		return { success: false, error: "Failed to fetch auctions" }
	}
}

export async function getAuctionById(auctionId: string) {
	try {
		const auction = await prisma.auction.findUnique({
			where: { id: auctionId },
			include: {
				product: {
					select: {
						id: true,
						name: true,
						description: true,
						images: true,
						category: true,
						unit: true,
						stock: true
					}
				},
				farmer: {
					select: {
						id: true,
						name: true,
						image: true,
						location: true,
						district: true
					}
				},
				bids: {
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						bidder: {
							select: {
								id: true,
								name: true,
								image: true
							}
						}
					}
				}
			}
		})

		if (!auction) {
			throw new Error("Auction not found")
		}

		return { success: true, auction }
	} catch (error) {
		console.error("Error fetching auction:", error)
		return { success: false, error: "Failed to fetch auction" }
	}
}

export async function placeBid(auctionId: string, amount: number) {
	try {
		const session = await auth()

		if (!session?.user || (session.user.role !== Role.USER && session.user.role !== Role.CONTRACTOR)) {
			throw new Error("Unauthorized")
		}

		// Get the auction
		const auction = await prisma.auction.findUnique({
			where: { id: auctionId },
			include: {
				farmer: true
			}
		})

		if (!auction) {
			throw new Error("Auction not found")
		}

		// Check if auction is active
		if (auction.status !== AuctionStatus.ACTIVE) {
			throw new Error("Auction is not active")
		}

		// Check if auction has ended
		if (auction.endTime <= new Date()) {
			throw new Error("Auction has ended")
		}

		// Check if bid amount is valid
		if (amount <= auction.currentBid) {
			throw new Error(`Bid must be higher than current bid of Rs. ${auction.currentBid}`)
		}

		if (amount < auction.currentBid + auction.minIncrement) {
			throw new Error(`Minimum bid increment is Rs. ${auction.minIncrement}`)
		}

		// Check if bidder is not the farmer
		if (session.user.id === auction.farmerId) {
			throw new Error("Farmers cannot bid on their own auctions")
		}

		// Place the bid and update auction
		const result = await prisma.$transaction(async (tx) => {
			// Create the bid
			const bid = await tx.bid.create({
				data: {
					auctionId,
					bidderId: session.user.id,
					amount
				},
				include: {
					bidder: {
						select: {
							id: true,
							name: true,
							image: true
						}
					}
				}
			})

			// Update auction current bid
			await tx.auction.update({
				where: { id: auctionId },
				data: {
					currentBid: amount
				}
			})

			return bid
		})

		revalidatePath("/bidding")
		revalidatePath(`/bidding/${auctionId}`)
		return { success: true, bid: result }
	} catch (error) {
		console.error("Error placing bid:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to place bid" }
	}
}

export async function getFarmerAuctions(farmerId?: string) {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		const targetFarmerId = farmerId || session.user.id

		// Only allow farmers to see their own auctions or admins to see any
		if (session.user.role !== Role.ADMIN && session.user.id !== targetFarmerId) {
			throw new Error("Unauthorized")
		}

		const auctions = await prisma.auction.findMany({
			where: {
				farmerId: targetFarmerId
			},
			include: {
				product: {
					select: {
						id: true,
						name: true,
						description: true,
						images: true,
						category: true,
						unit: true
					}
				},
				_count: {
					select: {
						bids: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return { success: true, auctions }
	} catch (error) {
		console.error("Error fetching farmer auctions:", error)
		return { success: false, error: "Failed to fetch auctions" }
	}
}

export async function endAuction(auctionId: string) {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		const auction = await prisma.auction.findUnique({
			where: { id: auctionId },
			include: {
				bids: {
					orderBy: {
						amount: 'desc'
					},
					take: 1,
					include: {
						bidder: true
					}
				}
			}
		})

		if (!auction) {
			throw new Error("Auction not found")
		}

		// Only farmer or admin can end auction
		if (session.user.role !== Role.ADMIN && session.user.id !== auction.farmerId) {
			throw new Error("Unauthorized")
		}

		// Update auction status and set winner
		const winningBid = auction.bids[0]
		const updatedAuction = await prisma.auction.update({
			where: { id: auctionId },
			data: {
				status: AuctionStatus.COMPLETED,
				winnerId: winningBid?.bidderId || null
			}
		})

		revalidatePath("/bidding")
		return { success: true, auction: updatedAuction }
	} catch (error) {
		console.error("Error ending auction:", error)
		return { success: false, error: "Failed to end auction" }
	}
}
