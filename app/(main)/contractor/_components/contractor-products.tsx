"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
	Select, SelectContent, SelectItem, 
	SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
	Search, Filter, Gavel, Star, MapPin, Package, Eye, TrendingUp
} from "lucide-react"
import Image from "next/image"
import { Product, PRODUCT_CATEGORIES } from "@/types/product"
import { getFarmerProducts } from "@/actions/(farmer)/farmer.action"

export default function ContractorProducts() {
	const [products, setProducts] = useState<Product[]>([])
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [loading, setLoading] = useState(true)

	const loadFarmerProducts = useCallback(async () => {
		try {
			setLoading(true)
			const result = await getFarmerProducts({
				search: searchQuery,
				category: selectedCategory === "all" ? undefined : selectedCategory
			})

			if (result.success && result.products) {
				setProducts(result.products as Product[])
			}
		} catch (error) {
			console.error("Error loading farmer products:", error)
		} finally {
			setLoading(false)
		}
	}, [searchQuery, selectedCategory]);

	useEffect(() => {
		loadFarmerProducts()
	}, [loadFarmerProducts])

	const filterProducts = useCallback(() => {
		let filtered = products

		if (searchQuery) {
			filtered = filtered.filter(product =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		if (selectedCategory !== "all") {
			filtered = filtered.filter(product => product.category === selectedCategory)
		}

		setFilteredProducts(filtered)
	}, [products, searchQuery, selectedCategory]);

	useEffect(() => {
		filterProducts()
	}, [searchQuery, selectedCategory, products, filterProducts])

	const placeBid = (productId: string) => {
		// Navigate to bidding page or open bid modal
		console.log("Placing bid for product:", productId)
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-4">
				<h1 className="font-serif text-4xl font-bold">Fresh Farm Products</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Discover high-quality agricultural products directly from farmers.
					Place competitive bids and secure the best produce for your business.
				</p>
			</div>

			{/* Search and Filters */}
			<div className="space-y-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search for crops, farmers, locations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Category Filter */}
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-full md:w-48">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{PRODUCT_CATEGORIES.map((category) => (
								<SelectItem key={category} value={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button onClick={loadFarmerProducts} variant="outline">
						<Filter className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Products Grid */}
			{filteredProducts.length === 0 ? (
				<div className="text-center py-12">
					<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">No farmer products available</h3>
					<p className="text-muted-foreground">
						Check back later for new products or try different search criteria.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProducts.map((product) => (
						<Card key={product.id} className="group hover:shadow-lg transition-shadow">
							<CardHeader className="p-0">
								<div className="relative h-48 w-full">
									<Image
										src={product.images[0] || "/placeholder-product.jpg"}
										alt={product.name}
										fill
										className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute top-3 left-3">
										<Badge className="bg-green-100 text-green-800">
											Fresh
										</Badge>
									</div>
									<div className="absolute top-3 right-3">
										<Badge variant="outline" className="bg-white">
											{product.stock} {product.unit} available
										</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
											{product.name}
										</h3>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{product.description}
										</p>
									</div>

									<div className="flex items-center justify-between">
										<Badge variant="outline">{product.category}</Badge>
										<div className="flex items-center space-x-1">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="text-sm">4.8</span>
										</div>
									</div>

									{/* Farmer Info */}
									<div className="flex items-center space-x-2">
										<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
											<Image
												src={product.farmer?.image || "/placeholder-user.jpg"}
												alt={product.farmer?.name || "Farmer"}
												width={32}
												height={32}
												className="object-cover"
											/>
										</div>
										<div>
											<p className="text-sm font-medium">{product.farmer?.name}</p>
											<p className="text-xs text-muted-foreground flex items-center">
												<MapPin className="h-3 w-3 mr-1" />
												Verified Farmer
											</p>
										</div>
									</div>

									{/* Pricing and Bidding */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">Base Price</p>
												<p className="text-lg font-bold text-primary">
													Rs. {product.price.toLocaleString()}
												</p>
												<p className="text-xs text-muted-foreground">per {product.unit}</p>
											</div>
											<div className="text-right">
												<p className="text-sm text-muted-foreground">Fresh Harvest</p>
												<p className="text-sm font-medium text-green-600">
													{new Date(product.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>

										<div className="flex items-center justify-between pt-2 border-t">
											<Button
												size="sm"
												variant="outline"
												className="flex-1 mr-2"
											>
												<Eye className="h-4 w-4 mr-1" />
												View Details
											</Button>
											<Button
												size="sm"
												onClick={() => placeBid(product.id)}
												className="flex-1 bg-orange-600 hover:bg-orange-700"
											>
												<Gavel className="h-4 w-4 mr-1" />
												Place Bid
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Show more button if there are more products */}
			{filteredProducts.length > 0 && (
				<div className="text-center pt-8">
					<Button variant="outline" size="lg">
						Load More Products
					</Button>
				</div>
			)}

			{/* Info Section */}
			<div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-6 mt-8">
				<div className="text-center space-y-4">
					<h3 className="text-xl font-semibold">How Bidding Works</h3>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
								<Eye className="h-6 w-6 text-orange-600" />
							</div>
							<h4 className="font-medium">Browse Products</h4>
							<p className="text-sm text-muted-foreground">
								Explore fresh produce from verified farmers
							</p>
						</div>
						<div className="space-y-2">
							<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
								<Gavel className="h-6 w-6 text-orange-600" />
							</div>
							<h4 className="font-medium">Place Your Bid</h4>
							<p className="text-sm text-muted-foreground">
								Submit competitive bids for bulk quantities
							</p>
						</div>
						<div className="space-y-2">
							<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
								<TrendingUp className="h-6 w-6 text-orange-600" />
							</div>
							<h4 className="font-medium">Secure the Deal</h4>
							<p className="text-sm text-muted-foreground">
								Win bids and establish supply partnerships
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
