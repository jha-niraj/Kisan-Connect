"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Star, ShoppingCart, Heart, MapPin, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock products data
const products = [
	{
		id: 1,
		name: "Organic Basmati Rice",
		farmer: "Ram Bahadur",
		location: "Chitwan",
		category: "Grains",
		price: 120,
		originalPrice: 150,
		unit: "kg",
		stock: 50,
		rating: 4.8,
		reviews: 24,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: true,
		isFeatured: true,
		description: "Premium quality aromatic basmati rice from the fertile plains of Chitwan.",
	},
	{
		id: 2,
		name: "Fresh Tomatoes",
		farmer: "Sita Devi",
		location: "Kavre",
		category: "Vegetables",
		price: 80,
		originalPrice: 100,
		unit: "kg",
		stock: 25,
		rating: 4.9,
		reviews: 18,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: true,
		isFeatured: false,
		description: "Fresh, juicy tomatoes perfect for cooking and salads.",
	},
	{
		id: 3,
		name: "Mountain Honey",
		farmer: "Tek Bahadur",
		location: "Mustang",
		category: "Honey",
		price: 800,
		originalPrice: 1000,
		unit: "bottle",
		stock: 15,
		rating: 5.0,
		reviews: 12,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: true,
		isFeatured: true,
		description: "Pure mountain honey from the high altitudes of Mustang.",
	},
	{
		id: 4,
		name: "Green Cardamom",
		farmer: "Maya Sherpa",
		location: "Ilam",
		category: "Spices",
		price: 2500,
		originalPrice: 3000,
		unit: "kg",
		stock: 8,
		rating: 4.7,
		reviews: 15,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: true,
		isFeatured: false,
		description: "Premium quality green cardamom from the hills of Ilam.",
	},
	{
		id: 5,
		name: "Red Potatoes",
		farmer: "Krishna Thapa",
		location: "Mustang",
		category: "Vegetables",
		price: 45,
		originalPrice: 60,
		unit: "kg",
		stock: 100,
		rating: 4.6,
		reviews: 32,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: false,
		isFeatured: false,
		description: "Fresh red potatoes from high altitude farms.",
	},
	{
		id: 6,
		name: "Black Lentils",
		farmer: "Hari Prasad",
		location: "Dhading",
		category: "Grains",
		price: 180,
		originalPrice: 220,
		unit: "kg",
		stock: 40,
		rating: 4.5,
		reviews: 28,
		image: "/placeholder.svg?height=250&width=250",
		isOrganic: false,
		isFeatured: false,
		description: "High-quality black lentils rich in protein and nutrients.",
	},
]

const categories = ["All", "Vegetables", "Fruits", "Grains", "Spices", "Honey", "Dairy"]
const locations = ["All", "Chitwan", "Kavre", "Mustang", "Ilam", "Dhading", "Kathmandu"]

export default function ProductsPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [selectedLocation, setSelectedLocation] = useState("All")
	const [priceRange, setPriceRange] = useState([0, 3000])
	const [showOnlyOrganic, setShowOnlyOrganic] = useState(false)
	const [showOnlyInStock, setShowOnlyInStock] = useState(false)
	const [sortBy, setSortBy] = useState("featured")
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const [showFilters, setShowFilters] = useState(false)

	// Filter and sort products
	const filteredProducts = products
		.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.farmer.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
			const matchesLocation = selectedLocation === "All" || product.location === selectedLocation
			const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
			const matchesOrganic = !showOnlyOrganic || product.isOrganic
			const matchesStock = !showOnlyInStock || product.stock > 0

			return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesOrganic && matchesStock
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "price_low":
					return a.price - b.price
				case "price_high":
					return b.price - a.price
				case "rating":
					return b.rating - a.rating
				case "newest":
					return b.id - a.id
				case "featured":
				default:
					return b.isFeatured ? 1 : -1
			}
		})

	const addToCart = (productId: number) => {
		// Mock add to cart functionality
		console.log(`Added product ${productId} to cart`)
	}

	const toggleWishlist = (productId: number) => {
		// Mock wishlist functionality
		console.log(`Toggled wishlist for product ${productId}`)
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center space-y-4 mb-8">
					<h1 className="font-serif text-4xl font-bold">Fresh Products</h1>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Browse our selection of farm-fresh products directly from Nepali farmers. All products are tested for
						quality and freshness.
					</p>
				</div>

				{/* Search and Filters */}
				<div className="space-y-4 mb-8">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search for products, farmers..."
							className="pl-10 pr-4"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Filter Controls */}
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex flex-wrap gap-4 flex-1">
							<Select value={selectedCategory} onValueChange={setSelectedCategory}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={selectedLocation} onValueChange={setSelectedLocation}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									{locations.map((location) => (
										<SelectItem key={location} value={location}>
											{location}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="featured">Featured</SelectItem>
									<SelectItem value="price_low">Price: Low to High</SelectItem>
									<SelectItem value="price_high">Price: High to Low</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
								</SelectContent>
							</Select>

							<Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
								<Filter className="h-4 w-4 mr-2" />
								More Filters
							</Button>
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className={viewMode === "list" ? "bg-transparent" : ""}
							>
								<Grid className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}
								className={viewMode === "grid" ? "bg-transparent" : ""}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Advanced Filters */}
					{showFilters && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="border rounded-lg p-4 space-y-4 bg-muted/30"
						>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-medium">Price Range (Rs.)</label>
									<Slider
										value={priceRange}
										onValueChange={setPriceRange}
										max={3000}
										min={0}
										step={50}
										className="w-full"
									/>
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>Rs. {priceRange[0]}</span>
										<span>Rs. {priceRange[1]}</span>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<Checkbox 
											id="organic" 
											checked={showOnlyOrganic} 
											onCheckedChange={(checked) => setShowOnlyOrganic(checked === true)} 
										/>
										<label htmlFor="organic" className="text-sm font-medium">
											Organic only
										</label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox 
											id="instock" 
											checked={showOnlyInStock} 
											onCheckedChange={(checked) => setShowOnlyInStock(checked === true)} 
										/>
										<label htmlFor="instock" className="text-sm font-medium">
											In stock only
										</label>
									</div>
								</div>

								<div className="flex items-end">
									<Button
										variant="outline"
										onClick={() => {
											setSelectedCategory("All")
											setSelectedLocation("All")
											setPriceRange([0, 3000])
											setShowOnlyOrganic(false)
											setShowOnlyInStock(false)
											setSearchQuery("")
										}}
										className="bg-transparent"
									>
										Clear Filters
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</div>

				{/* Results Count */}
				<div className="flex items-center justify-between mb-6">
					<p className="text-muted-foreground">
						Showing {filteredProducts.length} of {products.length} products
					</p>
				</div>

				{/* Products Grid/List */}
				<div
					className={
						viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
					}
				>
					{filteredProducts.map((product, index) => (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							{viewMode === "grid" ? (
								<Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
									<div className="relative">
										<Link href={`/products/${product.id}`}>
											<Image
												src={product.image || "/placeholder.svg"}
												alt={product.name}
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												height={192}
												width={192}
											/>
										</Link>
										<div className="absolute top-3 left-3 flex gap-2">
											{product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
											{product.isFeatured && <Badge variant="secondary">Featured</Badge>}
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="absolute top-3 right-3 bg-white/80 hover:bg-white"
											onClick={() => toggleWishlist(product.id)}
										>
											<Heart className="h-4 w-4" />
										</Button>
										{product.stock === 0 && (
											<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
												<Badge variant="destructive">Out of Stock</Badge>
											</div>
										)}
									</div>

									<CardContent className="p-4">
										<div className="space-y-2">
											<Link href={`/products/${product.id}`}>
												<h3 className="font-semibold hover:text-primary transition-colors">{product.name}</h3>
											</Link>
											<div className="flex items-center space-x-2 text-sm text-muted-foreground">
												<span>by {product.farmer}</span>
												<span>•</span>
												<div className="flex items-center space-x-1">
													<MapPin className="w-3 h-3" />
													<span>{product.location}</span>
												</div>
											</div>
											<div className="flex items-center space-x-1">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm font-medium">{product.rating}</span>
												<span className="text-sm text-muted-foreground">({product.reviews})</span>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<span className="font-bold text-lg">Rs. {product.price}</span>
													{product.originalPrice > product.price && (
														<span className="text-sm text-muted-foreground line-through">
															Rs. {product.originalPrice}
														</span>
													)}
													<span className="text-sm text-muted-foreground">/{product.unit}</span>
												</div>
											</div>
											<Button className="w-full" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
												<ShoppingCart className="h-4 w-4 mr-2" />
												Add to Cart
											</Button>
										</div>
									</CardContent>
								</Card>
							) : (
								<Card className="hover:shadow-md transition-shadow">
									<CardContent className="p-4">
										<div className="flex items-center space-x-4">
											<Link href={`/products/${product.id}`}>
												<Image
													src={product.image || "/placeholder.svg"}
													alt={product.name}
													className="w-24 h-24 rounded-lg object-cover"
													height={96}
													width={96}
												/>
											</Link>
											<div className="flex-1 space-y-2">
												<div className="flex items-start justify-between">
													<div>
														<Link href={`/products/${product.id}`}>
															<h3 className="font-semibold text-lg hover:text-primary transition-colors">
																{product.name}
															</h3>
														</Link>
														<div className="flex items-center space-x-2 text-sm text-muted-foreground">
															<span>by {product.farmer}</span>
															<span>•</span>
															<div className="flex items-center space-x-1">
																<MapPin className="w-3 h-3" />
																<span>{product.location}</span>
															</div>
														</div>
													</div>
													<Button variant="ghost" size="sm" onClick={() => toggleWishlist(product.id)}>
														<Heart className="h-4 w-4" />
													</Button>
												</div>
												<div className="flex items-center space-x-4">
													<div className="flex items-center space-x-1">
														<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
														<span className="text-sm font-medium">{product.rating}</span>
														<span className="text-sm text-muted-foreground">({product.reviews})</span>
													</div>
													<div className="flex items-center space-x-2">
														{product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
														{product.isFeatured && <Badge variant="secondary">Featured</Badge>}
													</div>
												</div>
												<p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														<span className="font-bold text-xl">Rs. {product.price}</span>
														{product.originalPrice > product.price && (
															<span className="text-sm text-muted-foreground line-through">
																Rs. {product.originalPrice}
															</span>
														)}
														<span className="text-sm text-muted-foreground">/{product.unit}</span>
													</div>
													<Button onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
														<ShoppingCart className="h-4 w-4 mr-2" />
														Add to Cart
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</motion.div>
					))}
				</div>

				{/* No Results */}
				{filteredProducts.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
						<Button
							variant="outline"
							className="mt-4 bg-transparent"
							onClick={() => {
								setSelectedCategory("All")
								setSelectedLocation("All")
								setPriceRange([0, 3000])
								setShowOnlyOrganic(false)
								setShowOnlyInStock(false)
								setSearchQuery("")
							}}
						>
							Clear All Filters
						</Button>
					</div>
				)}
			</div>

			<Footer />
		</div>
	)
}
