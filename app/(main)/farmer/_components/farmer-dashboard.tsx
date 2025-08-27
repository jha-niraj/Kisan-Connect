"use client"

import { useState, useEffect } from "react"
import {
	Card, CardContent, CardDescription,
	CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Package, ShoppingCart, TrendingUp, Plus, Eye, Edit, DollarSign, Gavel, Star
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getFarmerStats, getMyFarmerProducts } from "@/actions/(farmer)/farmer.action"
import { Product } from "@/types/product"
import { FarmerStats } from "@/types/dashboard"
import { useSession } from "next-auth/react"

export default function FarmerDashboard() {
	const { data: session } = useSession()
	const [products, setProducts] = useState<Product[]>([])
	const [stats, setStats] = useState<FarmerStats>({
		totalProducts: 0,
		activeListings: 0,
		totalEarnings: 0,
		monthlyOrders: 0,
		activeBids: 0,
		avgRating: 0
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		try {
			setLoading(true)

			// Load farmer stats
			const statsResult = await getFarmerStats()
			if (statsResult.success && statsResult.stats) {
				setStats(statsResult.stats)
			}

			// Load farmer products
			const productsResult = await getMyFarmerProducts()
			if (productsResult.success && productsResult.products) {
				setProducts(productsResult.products.slice(0, 3)) // Get latest 3 products
			}
		} catch (error) {
			console.error("Error loading dashboard data:", error)
		} finally {
			setLoading(false)
		}
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return <Badge className="bg-green-100 text-green-800">Active</Badge>
			case "INACTIVE":
				return <Badge variant="secondary">Inactive</Badge>
			case "SOLD_OUT":
				return <Badge variant="destructive">Sold Out</Badge>
			case "PENDING":
				return <Badge variant="outline">Pending</Badge>
			default:
				return <Badge variant="secondary">{status}</Badge>
		}
	}

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="flex justify-between items-center">
					<div>
						<div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-64"></div>
					</div>
					<div className="h-10 bg-gray-200 rounded w-32"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{
						[...Array(4)].map((_, i) => (
							<div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
						))
					}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="font-serif text-3xl font-bold mb-2">Farmer Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session?.user?.name}! Manage your products and track your sales.
					</p>
				</div>
				<div className="flex gap-3">
					<Button asChild>
						<Link href="/farmer/products/new">
							<Plus className="h-4 w-4 mr-2" />
							Add Product
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/farmer/bidding/new">
							<Gavel className="h-4 w-4 mr-2" />
							Create Auction
						</Link>
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total Products</p>
									<p className="text-2xl font-bold">{stats.totalProducts}</p>
								</div>
								<Package className="h-8 w-8 text-primary" />
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
									<p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
									<p className="text-2xl font-bold">Rs. {stats.totalEarnings.toLocaleString()}</p>
								</div>
								<DollarSign className="h-8 w-8 text-green-600" />
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
									<p className="text-2xl font-bold">{stats.activeBids}</p>
								</div>
								<Gavel className="h-8 w-8 text-orange-600" />
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
									<p className="text-sm font-medium text-muted-foreground">Rating</p>
									<div className="flex items-center space-x-1">
										<p className="text-2xl font-bold">{stats.avgRating}</p>
										<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
									</div>
								</div>
								<TrendingUp className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="bidding">Bidding</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-6">
					<div className="grid lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									Recent Products
									<Button variant="ghost" size="sm" asChild>
										<Link href="/farmer/products">View All</Link>
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{
									products.length > 0 ? (
										products.map((product) => (
											<div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg border">
												<Image
													src={product.images[0] || "/placeholder.svg"}
													alt={product.name}
													className="rounded-lg object-cover"
													height={64}
													width={64}
												/>
												<div className="flex-1 min-w-0">
													<p className="font-medium truncate">{product.name}</p>
													<p className="text-sm text-muted-foreground">
														{product.category} • Rs. {product.price.toLocaleString()}
													</p>
												</div>
												<div className="text-right">
													{getStatusBadge(product.status)}
													<p className="text-xs text-muted-foreground mt-1">Stock: {product.stock}</p>
												</div>
											</div>
										))
									) : (
										<div className="text-center text-muted-foreground py-8">
											<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<p>No products yet</p>
											<p className="text-sm">Start by adding your first product</p>
										</div>
									)
								}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									Active Auctions
									<Button variant="ghost" size="sm" asChild>
										<Link href="/farmer/bidding">View All</Link>
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center text-muted-foreground py-8">
									<Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>No active auctions</p>
									<p className="text-sm">Create your first auction to start bidding</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="products" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								My Products
								<Button asChild>
									<Link href="/farmer/products/new">
										<Plus className="h-4 w-4 mr-2" />
										Add New Product
									</Link>
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{
									products.length > 0 ? (
										products.map((product) => (
											<div key={product.id} className="flex items-center space-x-4 p-4 rounded-lg border">
												<Image
													src={product.images[0] || "/placeholder.svg"}
													alt={product.name}
													className="w-16 h-16 rounded-lg object-cover"
													height={64}
													width={64}
												/>
												<div className="flex-1">
													<h4 className="font-medium">{product.name}</h4>
													<p className="text-sm text-muted-foreground">{product.category}</p>
													<div className="flex items-center space-x-4 mt-2 text-sm">
														<span className="font-medium">Rs. {product.price.toLocaleString()}</span>
														<span className="text-muted-foreground">Stock: {product.stock}</span>
														<span className="text-muted-foreground">Unit: {product.unit}</span>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{getStatusBadge(product.status)}
													<Button variant="ghost" size="sm" asChild>
														<Link href={`/farmer/products/${product.id}`}>
															<Eye className="h-4 w-4" />
														</Link>
													</Button>
													<Button variant="ghost" size="sm" asChild>
														<Link href={`/farmer/products/${product.id}/edit`}>
															<Edit className="h-4 w-4" />
														</Link>
													</Button>
												</div>
											</div>
										))
									) : (
										<div className="text-center text-muted-foreground py-8">
											<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<p>No products yet</p>
											<p className="text-sm">Add your first product to get started</p>
										</div>
									)
								}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="bidding" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Active Auctions</CardTitle>
							<CardDescription>Monitor your live product auctions</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-center text-muted-foreground py-8">
									<Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>No active auctions</p>
									<p className="text-sm">Create auctions to sell your products competitively</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="orders" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Recent Orders</CardTitle>
							<CardDescription>Track your product sales and deliveries</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-center text-muted-foreground py-8">
									<ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>No recent orders</p>
									<p className="text-sm">Orders will appear here when customers buy your products</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}