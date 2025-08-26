"use client"

import { useState, useEffect } from "react"
import { 
	Card, CardContent, CardDescription, 
	CardHeader, CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
	Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs"
import {
	Package, ShoppingCart, TrendingUp, Users, Plus, DollarSign
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
	getSellerStats, getSellerProducts, 
	getSellerRecentOrders, getSellerTopProducts 
} from "@/actions/(seller)/seller.action"
import { Product } from "@/types/product"
import { SellerStats, RecentOrder, TopProduct } from "@/types/dashboard"
import { useSession } from "next-auth/react"

export default function SellerDashboard() {
	const { data: session } = useSession()
	const [products, setProducts] = useState<Product[]>([])
	const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
	const [topProducts, setTopProducts] = useState<TopProduct[]>([])
	const [stats, setStats] = useState<SellerStats>({
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		activeListings: 0,
		activeProducts: 0,
		outOfStock: 0,
		pendingOrders: 0,
		completedOrders: 0
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		try {
			setLoading(true)

			// Load seller stats
			const statsResult = await getSellerStats()
			if (statsResult.success && statsResult.stats) {
				setStats(statsResult.stats)
			}

			// Load seller products
			const productsResult = await getSellerProducts()
			if (productsResult.success && productsResult.products) {
				setProducts(productsResult.products.slice(0, 5)) // Get latest 5 products
			}

			// Load recent orders
			const ordersResult = await getSellerRecentOrders()
			if (ordersResult.success && ordersResult.orders) {
				setRecentOrders(ordersResult.orders)
			}

			// Load top products
			const topProductsResult = await getSellerTopProducts()
			if (topProductsResult.success && topProductsResult.products) {
				setTopProducts(topProductsResult.products)
			}
		} catch (error) {
			console.error("Error loading dashboard data:", error)
		} finally {
			setLoading(false)
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
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Seller Dashboard</h1>
					<p className="text-muted-foreground">Welcome back, {session?.user?.name}!</p>
				</div>
				<Button asChild>
					<Link href="/seller/products/new">
						<Plus className="h-4 w-4 mr-2" />
						Add Product
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Products</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalProducts}</div>
							<p className="text-xs text-muted-foreground">
								{stats.activeListings} active listings
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
							<ShoppingCart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalOrders}</div>
							<p className="text-xs text-muted-foreground">
								{stats.pendingOrders} pending orders
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground">
								+12% from last month
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.completedOrders}</div>
							<p className="text-xs text-muted-foreground">
								{stats.pendingOrders} pending
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Content Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="orders">Recent Orders</TabsTrigger>
					<TabsTrigger value="products">Top Products</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								<div className="space-y-4">
									<div className="flex items-center">
										<div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
										<div className="flex-1">
											<p className="text-sm font-medium">New order received</p>
											<p className="text-xs text-muted-foreground">Order #ORD-001 - ₹2,500</p>
										</div>
										<div className="text-xs text-muted-foreground">2 min ago</div>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
										<div className="flex-1">
											<p className="text-sm font-medium">Product published</p>
											<p className="text-xs text-muted-foreground">Organic Fertilizer is now live</p>
										</div>
										<div className="text-xs text-muted-foreground">1 hour ago</div>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
										<div className="flex-1">
											<p className="text-sm font-medium">Low stock alert</p>
											<p className="text-xs text-muted-foreground">Wheat Seeds - Only 5 left</p>
										</div>
										<div className="text-xs text-muted-foreground">3 hours ago</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									Manage your store efficiently
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-2">
								<Button asChild variant="outline" className="justify-start">
									<Link href="/seller/products/new">
										<Plus className="h-4 w-4 mr-2" />
										Add New Product
									</Link>
								</Button>
								<Button asChild variant="outline" className="justify-start">
									<Link href="/seller/products">
										<Package className="h-4 w-4 mr-2" />
										Manage Products
									</Link>
								</Button>
								<Button asChild variant="outline" className="justify-start">
									<Link href="/seller/orders">
										<ShoppingCart className="h-4 w-4 mr-2" />
										View Orders
									</Link>
								</Button>
								<Button asChild variant="outline" className="justify-start">
									<Link href="/seller/analytics">
										<TrendingUp className="h-4 w-4 mr-2" />
										View Analytics
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="orders" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Orders</CardTitle>
							<CardDescription>
								Your latest customer orders
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentOrders.length > 0 ? (
									recentOrders.map((order) => (
										<div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-4">
												<div>
													<p className="text-sm font-medium">{order.id}</p>
													<p className="text-sm text-muted-foreground">{order.customer}</p>
												</div>
												<div>
													<p className="text-sm font-medium">{order.product}</p>
													<p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
												</div>
											</div>
											<div className="flex items-center space-x-4">
												<div className="text-right">
													<p className="text-sm font-medium">₹{order.amount.toLocaleString()}</p>
													<p className="text-xs text-muted-foreground">{order.date}</p>
												</div>
												<Badge
													variant={
														order.status === "completed" ? "default" :
															order.status === "processing" ? "secondary" : "destructive"
													}
												>
													{order.status}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="text-center text-muted-foreground py-8">
										<ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
										<p>No recent orders found</p>
										<p className="text-sm">Orders will appear here once customers start buying your products</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="products" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Top Performing Products</CardTitle>
							<CardDescription>
								Your best-selling products this month
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{topProducts.length > 0 ? (
									topProducts.map((product, index) => (
										<div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-4">
												<div className="text-sm font-bold text-muted-foreground">#{index + 1}</div>
												<div>
													<p className="text-sm font-medium">{product.name}</p>
													<p className="text-sm text-muted-foreground">{product.sales} sales</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium">₹{product.revenue.toLocaleString()}</p>
												<p className="text-xs text-muted-foreground">Revenue</p>
											</div>
										</div>
									))
								) : (
									<div className="text-center text-muted-foreground py-8">
										<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
										<p>No product performance data yet</p>
										<p className="text-sm">Add products and start selling to see performance metrics</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
