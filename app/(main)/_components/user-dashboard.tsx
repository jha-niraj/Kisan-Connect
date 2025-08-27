"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	ShoppingBag, Gavel, Trophy, TrendingUp, Clock, Package, Loader2, Eye
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import {
	getUserStats, getUserOrders, getUserBidHistory
} from "@/actions/(user)/user.action"

interface UserStats {
	totalSpent: number
	totalOrders: number
	activeBidsCount: number
	wonAuctionsCount: number
}

interface ActiveBid {
	id: string
	amount: number
	createdAt: Date
	auction: {
		id: string
		product: {
			name: string
			images: string[]
		}
		currentBid: number
		endTime: Date
	}
}

interface WonAuction {
	id: string
	finalPrice: number
	endTime: Date
	product: {
		name: string
		images: string[]
		price: number
	}
}

interface Order {
	id: string
	totalAmount: number
	status: string
	createdAt: Date
	items: Array<{
		quantity: number
		price: number
		product: {
			name: string
			images: string[]
			farmer: {
				name: string
			}
		}
	}>
}

export default function UserDashboard() {
	const [stats, setStats] = useState<UserStats | null>(null)
	const [activeBids, setActiveBids] = useState<ActiveBid[]>([])
	const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		setIsLoading(true)
		try {
			const [statsResult, ordersResult, bidHistoryResult] = await Promise.all([
				getUserStats(),
				getUserOrders(),
				getUserBidHistory()
			])

			if (statsResult.success && statsResult.stats) {
				setStats(statsResult.stats)
				setActiveBids(statsResult.activeBids || [])
				// Map won auctions to the expected format
				const mappedWonAuctions = (statsResult.wonAuctions || []).map(auction => ({
					id: auction.id,
					finalPrice: auction.currentBid || auction.startPrice,
					endTime: auction.endTime,
					product: auction.product
				}))
				setWonAuctions(mappedWonAuctions)
			}

			if (ordersResult.success) {
				setOrders(ordersResult.orders || [])
			}

			// Note: bidHistoryResult is not currently used but kept for future implementation
			if (bidHistoryResult.success) {
				// setBidHistory(bidHistoryResult.bids || [])
			}
		} catch (error) {
			console.error("Error loading dashboard data:", error)
			toast.error("Failed to load dashboard data")
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-serif text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
				<p className="text-muted-foreground">Track your orders, bids, and purchases</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total Spent</p>
									<p className="text-2xl font-bold">Rs. {stats?.totalSpent?.toFixed(2) || "0.00"}</p>
								</div>
								<div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
									<TrendingUp className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total Orders</p>
									<p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
								</div>
								<div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
									<ShoppingBag className="h-6 w-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Active Bids</p>
									<p className="text-2xl font-bold">{stats?.activeBidsCount || 0}</p>
								</div>
								<div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
									<Gavel className="h-6 w-6 text-orange-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Won Auctions</p>
									<p className="text-2xl font-bold">{stats?.wonAuctionsCount || 0}</p>
								</div>
								<div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
									<Trophy className="h-6 w-6 text-purple-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
			<Tabs defaultValue="orders" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="orders">Recent Orders</TabsTrigger>
					<TabsTrigger value="bids">Active Bids</TabsTrigger>
					<TabsTrigger value="won">Won Auctions</TabsTrigger>
				</TabsList>
				<TabsContent value="orders">
					<Card>
						<CardHeader>
							<CardTitle>Recent Orders</CardTitle>
						</CardHeader>
						<CardContent>
							{
								orders.length === 0 ? (
									<div className="text-center py-8">
										<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No orders yet</p>
										<Button asChild className="mt-4">
											<Link href="/products">Start Shopping</Link>
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{
											orders.slice(0, 5).map((order, index) => (
												<motion.div
													key={order.id}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.4, delay: index * 0.1 }}
													className="border rounded-lg p-4"
												>
													<div className="flex items-center justify-between mb-3">
														<div>
															<p className="font-medium">Order #{order.id.slice(-8)}</p>
															<p className="text-sm text-muted-foreground">
																{new Date(order.createdAt).toLocaleDateString()}
															</p>
														</div>
														<div className="text-right">
															<Badge variant={
																order.status === "DELIVERED" ? "default" :
																	order.status === "PROCESSING" ? "secondary" :
																		"outline"
															}>
																{order.status}
															</Badge>
															<p className="font-semibold mt-1">Rs. {order.totalAmount.toFixed(2)}</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														{
															order.items.slice(0, 3).map((item, idx) => (
																<div key={idx} className="flex items-center space-x-2">
																	<Image
																		src={item.product.images[0] || "/placeholder.svg"}
																		alt={item.product.name}
																		width={32}
																		height={32}
																		className="w-8 h-8 rounded object-cover"
																	/>
																	<span className="text-sm">{item.product.name}</span>
																	{idx < order.items.length - 1 && <span className="text-muted-foreground">•</span>}
																</div>
															))
														}
														{
															order.items.length > 3 && (
																<span className="text-sm text-muted-foreground">
																	+{order.items.length - 3} more
																</span>
															)
														}
													</div>
												</motion.div>
											))
										}
									</div>
								)
							}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="bids">
					<Card>
						<CardHeader>
							<CardTitle>Active Bids</CardTitle>
						</CardHeader>
						<CardContent>
							{
								activeBids.length === 0 ? (
									<div className="text-center py-8">
										<Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No active bids</p>
										<Button asChild className="mt-4">
											<Link href="/bidding">Browse Auctions</Link>
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{
											activeBids.map((bid, index) => (
												<motion.div
													key={bid.id}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.4, delay: index * 0.1 }}
													className="border rounded-lg p-4"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<Image
																src={bid.auction.product.images[0] || "/placeholder.svg"}
																alt={bid.auction.product.name}
																width={64}
																height={64}
																className="w-16 h-16 rounded-lg object-cover"
															/>
															<div>
																<h3 className="font-medium">{bid.auction.product.name}</h3>
																<p className="text-sm text-muted-foreground">
																	Your bid: Rs. {bid.amount.toFixed(2)}
																</p>
																<p className="text-sm text-muted-foreground">
																	Current highest: Rs. {bid.auction.currentBid.toFixed(2)}
																</p>
															</div>
														</div>
														<div className="text-right">
															<div className="flex items-center space-x-2 mb-2">
																<Clock className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm text-muted-foreground">
																	Ends {new Date(bid.auction.endTime).toLocaleDateString()}
																</span>
															</div>
															<Button size="sm" asChild>
																<Link href={`/bidding`}>
																	<Eye className="h-4 w-4 mr-1" />
																	View
																</Link>
															</Button>
														</div>
													</div>
												</motion.div>
											))
										}
									</div>
								)
							}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="won">
					<Card>
						<CardHeader>
							<CardTitle>Won Auctions</CardTitle>
						</CardHeader>
						<CardContent>
							{
								wonAuctions.length === 0 ? (
									<div className="text-center py-8">
										<Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No won auctions yet</p>
										<Button asChild className="mt-4">
											<Link href="/bidding">Browse Auctions</Link>
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{
											wonAuctions.map((auction, index) => (
												<motion.div
													key={auction.id}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.4, delay: index * 0.1 }}
													className="border rounded-lg p-4"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<Image
																src={auction.product.images[0] || "/placeholder.svg"}
																alt={auction.product.name}
																width={64}
																height={64}
																className="w-16 h-16 rounded-lg object-cover"
															/>
															<div>
																<h3 className="font-medium">{auction.product.name}</h3>
																<p className="text-sm text-muted-foreground">
																	Won for: Rs. {auction.finalPrice.toFixed(2)}
																</p>
																<p className="text-sm text-muted-foreground">
																	Ended: {new Date(auction.endTime).toLocaleDateString()}
																</p>
															</div>
														</div>
														<div className="text-right">
															<Badge variant="default" className="bg-green-100 text-green-800">
																<Trophy className="h-3 w-3 mr-1" />
																Won
															</Badge>
														</div>
													</div>
												</motion.div>
											))
										}
									</div>
								)
							}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}