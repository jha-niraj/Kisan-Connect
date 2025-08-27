"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getUserStats() {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		// Get user's total spent amount from orders
		const orders = await prisma.order.findMany({
			where: {
				userId: session.user.id,
				status: {
					in: ["CONFIRMED", "SHIPPED", "DELIVERED"]
				}
			},
			select: {
				totalAmount: true,
				status: true,
				createdAt: true
			}
		})

		const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
		const totalOrders = orders.length

		// Get user's active bids
		const activeBids = await prisma.bid.findMany({
			where: {
				id: session.user.id,
				auction: {
					status: "ACTIVE",
					endTime: {
						gt: new Date()
					}
				}
			},
			include: {
				auction: {
					include: {
						product: {
							select: {
								name: true,
								images: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			}
		})

		// Get user's won auctions
		const wonAuctions = await prisma.auction.findMany({
			where: {
				winnerId: session.user.id,
				status: "COMPLETED"
			},
			include: {
				product: {
					select: {
						name: true,
						images: true,
						price: true
					}
				}
			},
			orderBy: {
				endTime: "desc"
			},
			take: 10
		})

		return {
			success: true,
			stats: {
				totalSpent,
				totalOrders,
				activeBidsCount: activeBids.length,
				wonAuctionsCount: wonAuctions.length
			},
			activeBids,
			wonAuctions
		}
	} catch (error) {
		console.error("Error fetching user stats:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch user stats"
		}
	}
}

export async function getUserOrders() {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		const orders = await prisma.order.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								name: true,
								images: true,
								farmer: {
									select: {
										name: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			}
		})

		return {
			success: true,
			orders
		}
	} catch (error) {
		console.error("Error fetching user orders:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch user orders"
		}
	}
}

export async function getUserBidHistory() {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		const bids = await prisma.bid.findMany({
			where: {
				bidderId: session.user.id
			},
			include: {
				auction: {
					include: {
						product: {
							select: {
								name: true,
								images: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			},
			take: 20
		})

		return {
			success: true,
			bids
		}
	} catch (error) {
		console.error("Error fetching user bid history:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch bid history"
		}
	}
}
