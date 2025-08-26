"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
	Select, SelectContent, SelectItem, 
	SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
	Search, ShoppingCart, Star, Package, Eye
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product, PRODUCT_CATEGORIES } from "@/types/product"
import { getSellerProductsForFarmers } from "@/actions/(farmer)/farmer.action"

export default function FarmerProducts() {
	const [products, setProducts] = useState<Product[]>([])
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadProducts()
	}, [])

	const filterProducts = () => {
		let filtered = products

		if (searchQuery) {
			filtered = filtered.filter(product =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.category.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		if (selectedCategory !== "all") {
			filtered = filtered.filter(product => product.category === selectedCategory)
		}

		setFilteredProducts(filtered)
	}

	useEffect(() => {
		filterProducts()
	}, [searchQuery, selectedCategory, products, filterProducts])

	const loadProducts = async () => {
		try {
			setLoading(true)
			const result = await getSellerProductsForFarmers()
			if (result.success && result.products) {
				setProducts(result.products)
			} else {
				console.error("Error loading products:", result.error)
			}
		} catch (error) {
			console.error("Error loading products:", error)
		} finally {
			setLoading(false)
		}
	}

	const addToCart = (productId: string) => {
		// Add to cart functionality
		console.log("Adding product to cart:", productId)
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
				<h1 className="font-serif text-4xl font-bold">Agricultural Supplies</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Find high-quality seeds, fertilizers, tools, and equipment for your farming needs.
					All products are verified and supplied by trusted agricultural suppliers.
				</p>
			</div>

			{/* Search and Filters */}
			<div className="space-y-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search for seeds, fertilizers, tools..."
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
				</div>
			</div>

			{/* Products Grid */}
			{filteredProducts.length === 0 ? (
				<div className="text-center py-12">
					<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">No products found</h3>
					<p className="text-muted-foreground">
						Try adjusting your search or filter criteria.
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
									<div className="absolute top-3 right-3">
										<Badge className="bg-green-100 text-green-800">
											In Stock: {product.stock}
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
											<span className="text-sm">4.5</span>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
											<Image
												src={product.farmer?.image || "/placeholder-user.jpg"}
												alt={product.farmer?.name || "Seller"}
												width={32}
												height={32}
												className="object-cover"
											/>
										</div>
										<div>
											<p className="text-sm font-medium">{product.farmer?.name || "Unknown Seller"}</p>
											<p className="text-xs text-muted-foreground">Verified Supplier</p>
										</div>
									</div>

									<div className="flex items-center justify-between pt-2 border-t">
										<div>
											<p className="text-lg font-bold text-primary">
												Rs. {product.price.toLocaleString()}
											</p>
											<p className="text-xs text-muted-foreground">per {product.unit}</p>
										</div>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												asChild
												className="flex-1"
											>
												<Link href={`/products/${product.id}`}>
													<Eye className="h-4 w-4 mr-1" />
													View
												</Link>
											</Button>
											<Button
												size="sm"
												onClick={() => addToCart(product.id)}
												className="flex-1"
											>
												<ShoppingCart className="h-4 w-4 mr-1" />
												Add to Cart
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
		</div>
	)
}
