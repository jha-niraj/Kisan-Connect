"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Gavel, Search, MapPin, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import { getActiveAuctions } from "@/actions/(common)/auction.action"
import { Auction, AuctionStatus } from "@/types/auction"

// Transform Prisma data to match our Auction interface
interface AuctionWithTimeLeft extends Omit<Auction, 'status'> {
	timeLeft?: string
	status: AuctionStatus
}

export default function BiddingPage() {
	const { data: session } = useSession()
	const [activeTab, setActiveTab] = useState("live")
	const [searchQuery, setSearchQuery] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [sortBy, setSortBy] = useState("ending_soon")
	const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
	const [auctions, setAuctions] = useState<AuctionWithTimeLeft[]>([])
	const [loading, setLoading] = useState(true)

	const loadAuctions = useCallback(async () => {
		try {
			setLoading(true)
			const result = await getActiveAuctions()
			
			if (result.success && result.auctions) {
				const auctionsWithTimeLeft = result.auctions.map(auction => ({
					id: auction.id,
					productId: auction.productId,
					startingPrice: auction.startPrice,
					currentBid: auction.currentBid,
					highestBidderId: auction.bids[0]?.bidderId,
					startTime: auction.startTime,
					endTime: auction.endTime,
					status: auction.status as AuctionStatus,
					product: auction.product,
					farmer: auction.farmer,
					bids: auction.bids,
					createdAt: auction.createdAt,
					updatedAt: auction.updatedAt,
					description: auction.description,
					title: auction.title,
					timeLeft: formatTimeLeft(new Date(auction.endTime))
				}))
				setAuctions(auctionsWithTimeLeft)
			}
		} catch (error) {
			console.error("Error loading auctions:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadAuctions()
	}, [loadAuctions])

	// Timer effect for countdown
	useEffect(() => {
		const timer = setInterval(() => {
			setAuctions(prevAuctions => 
				prevAuctions.map(auction => ({
					...auction,
					timeLeft: formatTimeLeft(new Date(auction.endTime))
				}))
			)
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const formatTimeLeft = (endTime: Date) => {
		const now = new Date()
		const diff = endTime.getTime() - now.getTime()

		if (diff <= 0) return "Ended"

		const hours = Math.floor(diff / (1000 * 60 * 60))
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((diff % (1000 * 60)) / 1000)

		if (hours > 0) {
			return `${hours}h ${minutes}m`
		} else if (minutes > 0) {
			return `${minutes}m ${seconds}s`
		} else {
			return `${seconds}s`
		}
	}

	const getTimeLeftColor = (endTime: Date) => {
		const now = new Date()
		const diff = endTime.getTime() - now.getTime()
		const minutes = diff / (1000 * 60)

		if (minutes <= 5) return "text-red-600"
		if (minutes <= 30) return "text-orange-600"
		return "text-green-600"
	}

	const filteredAuctions = auctions.filter((auction) => {
		const matchesSearch =
			auction.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			auction.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesCategory = categoryFilter === "all" || auction.product.category.toLowerCase() === categoryFilter
		return matchesSearch && matchesCategory
	})

	const canCreateAuction = session?.user && (session.user.role === Role.FARMER || session.user.role === Role.ADMIN)
	const canBid = session?.user && (session.user.role === Role.USER || session.user.role === Role.CONTRACTOR)

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center space-y-4 mb-8">
						<div className="flex items-center justify-center space-x-2">
							<Gavel className="h-8 w-8 text-primary" />
							<h1 className="font-serif text-4xl font-bold">Live Bidding</h1>
						</div>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="text-center space-y-4 mb-8">
				<div className="flex items-center justify-center space-x-2">
					<Gavel className="h-8 w-8 text-primary" />
					<h1 className="font-serif text-4xl font-bold">Live Bidding</h1>
				</div>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Participate in live auctions for premium products. Get the best deals directly from farmers across Nepal.
				</p>
				{canCreateAuction && (
					<Button asChild>
						<Link href="/bidding/new">
							<Plus className="h-4 w-4 mr-2" />
							Create New Auction
						</Link>
					</Button>
				)}
			</div>

				{/* Filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search auctions..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="w-full md:w-48">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							<SelectItem value="vegetables">Vegetables</SelectItem>
							<SelectItem value="fruits">Fruits</SelectItem>
							<SelectItem value="grains">Grains</SelectItem>
							<SelectItem value="spices">Spices</SelectItem>
							<SelectItem value="honey">Honey</SelectItem>
						</SelectContent>
					</Select>
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-full md:w-48">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ending_soon">Ending Soon</SelectItem>
							<SelectItem value="newest">Newest First</SelectItem>
							<SelectItem value="highest_bid">Highest Bid</SelectItem>
							<SelectItem value="most_bidders">Most Bidders</SelectItem>
						</SelectContent>
					</Select>
				</div>			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<TabsList className="grid w-full grid-cols-1 max-w-md mx-auto">
					<TabsTrigger value="live" className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
						<span>Live Auctions ({filteredAuctions.length})</span>
					</TabsTrigger>
				</TabsList>

				{/* Live Auctions */}
				<TabsContent value="live" className="space-y-6">
					{filteredAuctions.length === 0 ? (
						<div className="text-center py-12">
							<Gavel className="h-16 w-16 mx-auto mb-4 text-gray-400" />
							<h3 className="text-xl font-semibold mb-2">No Active Auctions</h3>
							<p className="text-muted-foreground mb-4">
								There are currently no live auctions. Check back later or create one if you&apos;re a farmer.
							</p>
							{canCreateAuction && (
								<Button asChild>
									<Link href="/bidding/new">
										<Plus className="h-4 w-4 mr-2" />
										Create First Auction
									</Link>
								</Button>
							)}
						</div>
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredAuctions.map((auction, index) => (
								<motion.div
									key={auction.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
										<div className="relative">
											<Image
												src={auction.product.images[0] || "/placeholder.svg"}
												alt={auction.product.name}
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												height={192}
												width={192}
											/>
											<div className="absolute top-3 left-3 flex gap-2">
												<Badge className="bg-green-100 text-green-800">{auction.product.category}</Badge>
												<Badge variant="destructive" className="animate-pulse">
													LIVE
												</Badge>
											</div>
											<div className="absolute top-3 right-3">
												<Badge variant="outline" className="bg-white/90">
													<Clock className="w-3 h-3 mr-1" />
													<span className={getTimeLeftColor(new Date(auction.endTime))}>{auction.timeLeft}</span>
												</Badge>
											</div>
										</div>

										<CardContent className="p-4">
											<div className="space-y-3">
												<div>
													<h3 className="font-semibold text-lg">{auction.product.name}</h3>
													<div className="flex items-center space-x-2 text-sm text-muted-foreground">
														<span>by {auction.farmer.name}</span>
														<span>•</span>
														<div className="flex items-center space-x-1">
															<MapPin className="w-3 h-3" />
															<span>Nepal</span>
														</div>
													</div>
												</div>

												<p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>

												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<span className="text-sm text-muted-foreground">Current Bid</span>
														<span className="text-xl font-bold text-primary">Rs. {auction.currentBid}</span>
													</div>
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">{auction._count?.bids || 0} bidders</span>
														<span className="text-muted-foreground">Min: Rs. {auction.minIncrement}</span>
													</div>
												</div>

												{canBid ? (
													<Button className="w-full" onClick={() => setSelectedAuction(auction.id)}>
														<Gavel className="w-4 h-4 mr-2" />
														Place Bid
													</Button>
												) : (
													<Button variant="outline" className="w-full" disabled>
														{!session ? "Sign in to bid" : "View Only"}
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

				{/* Bidding Modal would go here */}
				{selectedAuction && (
					<BiddingModal
						auction={liveAuctions.find((a) => a.id === selectedAuction)!}
						onClose={() => setSelectedAuction(null)}
					/>
				)}
			</div>

			<Footer />
		</div>
	)
}

// Bidding Modal Component
function BiddingModal({ auction, onClose }: { auction: Auction; onClose: () => void }) {
	const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minIncrement)
	const [isPlacingBid, setIsPlacingBid] = useState(false)

	const handlePlaceBid = async () => {
		setIsPlacingBid(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))
		setIsPlacingBid(false)
		onClose()
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
			>
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-serif text-2xl font-bold">Place Your Bid</h2>
						<Button variant="ghost" size="sm" onClick={onClose}>
							×
						</Button>
					</div>

					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Image
								src={auction.image || "/placeholder.svg"}
								alt={auction.product}
								className="w-16 h-16 rounded-lg object-cover"
								height={32}
								width={32}
							/>
							<div>
								<h3 className="font-semibold">{auction.product}</h3>
								<p className="text-sm text-muted-foreground">by {auction.farmer}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
							<div>
								<p className="text-sm text-muted-foreground">Current Bid</p>
								<p className="text-lg font-bold text-primary">Rs. {auction.currentBid}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Time Left</p>
								<p className="text-lg font-bold text-red-600">{auction.timeLeft}</p>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Your Bid Amount</label>
							<Input
								type="number"
								value={bidAmount}
								onChange={(e) => setBidAmount(Number(e.target.value))}
								min={auction.currentBid + auction.minIncrement}
								step={auction.minIncrement}
							/>
							<p className="text-xs text-muted-foreground">
								Minimum bid: Rs. {auction.currentBid + auction.minIncrement} (increment: Rs. {auction.minIncrement})
							</p>
						</div>

						<div className="flex space-x-2">
							<Button
								variant="outline"
								onClick={() => setBidAmount(auction.currentBid + auction.minIncrement)}
								className="bg-transparent"
							>
								Min Bid
							</Button>
							<Button
								variant="outline"
								onClick={() => setBidAmount(auction.currentBid + auction.minIncrement * 2)}
								className="bg-transparent"
							>
								+Rs. {auction.minIncrement}
							</Button>
							<Button
								variant="outline"
								onClick={() => setBidAmount(auction.currentBid + auction.minIncrement * 5)}
								className="bg-transparent"
							>
								+Rs. {auction.minIncrement * 4}
							</Button>
						</div>

						<Button
							className="w-full"
							onClick={handlePlaceBid}
							disabled={isPlacingBid || bidAmount < auction.currentBid + auction.minIncrement}
						>
							{isPlacingBid ? "Placing Bid..." : `Place Bid - Rs. ${bidAmount}`}
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
