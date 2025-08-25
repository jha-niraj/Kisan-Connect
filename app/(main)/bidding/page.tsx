"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Gavel, Search, Star, MapPin } from "lucide-react"
import Image from "next/image"

// Types
interface Auction {
	id: number
	product: string
	farmer: string
	location: string
	category: string
	startPrice: number
	currentBid: number
	bidders: number
	timeLeft: string
	endTime: Date
	image: string
	description: string
	minIncrement: number
	totalBids: number
	isOrganic?: boolean
	rating?: number
}

// Mock data for live auctions
const liveAuctions = [
	{
		id: 1,
		product: "Premium Cardamom",
		farmer: "Maya Sherpa",
		location: "Ilam",
		category: "Spices",
		startPrice: 2000,
		currentBid: 2500,
		bidders: 12,
		timeLeft: "2h 15m",
		endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Premium quality cardamom from the hills of Ilam. Organically grown and hand-picked.",
		minIncrement: 50,
		totalBids: 45,
		isOrganic: true,
		rating: 4.9,
	},
	{
		id: 2,
		product: "Organic Potatoes",
		farmer: "Krishna Thapa",
		location: "Mustang",
		category: "Vegetables",
		startPrice: 40,
		currentBid: 45,
		bidders: 8,
		timeLeft: "45m",
		endTime: new Date(Date.now() + 45 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Fresh organic potatoes from high altitude farms in Mustang.",
		minIncrement: 2,
		totalBids: 23,
		isOrganic: true,
		rating: 4.7,
	},
	{
		id: 3,
		product: "Basmati Rice",
		farmer: "Ram Bahadur",
		location: "Chitwan",
		category: "Grains",
		startPrice: 100,
		currentBid: 120,
		bidders: 15,
		timeLeft: "1h 30m",
		endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Premium quality Basmati rice, aromatic and long-grain.",
		minIncrement: 5,
		totalBids: 67,
		isOrganic: false,
		rating: 4.8,
	},
	{
		id: 4,
		product: "Mountain Honey",
		farmer: "Tek Bahadur",
		location: "Mustang",
		category: "Honey",
		startPrice: 800,
		currentBid: 950,
		bidders: 6,
		timeLeft: "3h 20m",
		endTime: new Date(Date.now() + 3 * 60 * 60 * 1000 + 20 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Pure mountain honey from the high altitudes of Mustang.",
		minIncrement: 25,
		totalBids: 18,
		isOrganic: true,
		rating: 5.0,
	},
]

const upcomingAuctions = [
	{
		id: 5,
		product: "Organic Tomatoes",
		farmer: "Sita Devi",
		location: "Kavre",
		category: "Vegetables",
		startPrice: 60,
		startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Fresh organic tomatoes, perfect for cooking and salads.",
		isOrganic: true,
		rating: 4.6,
	},
	{
		id: 6,
		product: "Black Cardamom",
		farmer: "Pemba Sherpa",
		location: "Dolakha",
		category: "Spices",
		startPrice: 1500,
		startTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
		image: "/placeholder.svg?height=200&width=200",
		description: "Aromatic black cardamom from the mountains of Dolakha.",
		isOrganic: true,
		rating: 4.9,
	},
]

export default function BiddingPage() {
	const [activeTab, setActiveTab] = useState("live")
	const [searchQuery, setSearchQuery] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [sortBy, setSortBy] = useState("ending_soon")
	const [selectedAuction, setSelectedAuction] = useState<number | null>(null)

	// Timer effect for countdown
	useEffect(() => {
		const timer = setInterval(() => {
			// Force re-render to update countdown timers
			setSelectedAuction((prev) => prev)
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

	const filteredAuctions = liveAuctions.filter((auction) => {
		const matchesSearch =
			auction.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
			auction.farmer.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesCategory = categoryFilter === "all" || auction.category.toLowerCase() === categoryFilter
		return matchesSearch && matchesCategory
	})

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center space-y-4 mb-8">
					<div className="flex items-center justify-center space-x-2">
						<Gavel className="h-8 w-8 text-primary" />
						<h1 className="font-serif text-4xl font-bold">Live Bidding</h1>
					</div>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Participate in live auctions for premium products. Get the best deals directly from farmers across Nepal.
					</p>
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
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
						<TabsTrigger value="live" className="flex items-center space-x-2">
							<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
							<span>Live Auctions ({liveAuctions.length})</span>
						</TabsTrigger>
						<TabsTrigger value="upcoming">Upcoming ({upcomingAuctions.length})</TabsTrigger>
					</TabsList>

					{/* Live Auctions */}
					<TabsContent value="live" className="space-y-6">
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
												src={auction.image || "/placeholder.svg"}
												alt={auction.product}
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												height={48}
												width={48}
											/>
											<div className="absolute top-3 left-3 flex gap-2">
												{auction.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
												<Badge variant="destructive" className="animate-pulse">
													LIVE
												</Badge>
											</div>
											<div className="absolute top-3 right-3">
												<Badge variant="outline" className="bg-white/90">
													<Clock className="w-3 h-3 mr-1" />
													<span className={getTimeLeftColor(auction.endTime)}>{formatTimeLeft(auction.endTime)}</span>
												</Badge>
											</div>
										</div>

										<CardContent className="p-4">
											<div className="space-y-3">
												<div>
													<h3 className="font-semibold text-lg">{auction.product}</h3>
													<div className="flex items-center space-x-2 text-sm text-muted-foreground">
														<span>by {auction.farmer}</span>
														<span>•</span>
														<div className="flex items-center space-x-1">
															<MapPin className="w-3 h-3" />
															<span>{auction.location}</span>
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium">{auction.rating}</span>
												</div>

												<p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>

												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<span className="text-sm text-muted-foreground">Current Bid</span>
														<span className="text-xl font-bold text-primary">Rs. {auction.currentBid}</span>
													</div>
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">{auction.bidders} bidders</span>
														<span className="text-muted-foreground">{auction.totalBids} total bids</span>
													</div>
												</div>

												<Button className="w-full" onClick={() => setSelectedAuction(auction.id)}>
													<Gavel className="w-4 h-4 mr-2" />
													Place Bid
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</TabsContent>

					{/* Upcoming Auctions */}
					<TabsContent value="upcoming" className="space-y-6">
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{upcomingAuctions.map((auction, index) => (
								<motion.div
									key={auction.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card className="group hover:shadow-lg transition-all duration-300">
										<div className="relative">
											<Image
												src={auction.image || "/placeholder.svg"}
												alt={auction.product}
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												height={48}
												width={48}
											/>
											<div className="absolute top-3 left-3 flex gap-2">
												{auction.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
												<Badge variant="secondary">Upcoming</Badge>
											</div>
										</div>

										<CardContent className="p-4">
											<div className="space-y-3">
												<div>
													<h3 className="font-semibold text-lg">{auction.product}</h3>
													<div className="flex items-center space-x-2 text-sm text-muted-foreground">
														<span>by {auction.farmer}</span>
														<span>•</span>
														<div className="flex items-center space-x-1">
															<MapPin className="w-3 h-3" />
															<span>{auction.location}</span>
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium">{auction.rating}</span>
												</div>

												<p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>

												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<span className="text-sm text-muted-foreground">Starting Price</span>
														<span className="text-xl font-bold text-secondary">Rs. {auction.startPrice}</span>
													</div>
													<div className="text-sm text-muted-foreground">
														Starts: {auction.startTime.toLocaleDateString()} at {auction.startTime.toLocaleTimeString()}
													</div>
												</div>

												<Button variant="outline" className="w-full bg-transparent">
													<Clock className="w-4 h-4 mr-2" />
													Set Reminder
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
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
