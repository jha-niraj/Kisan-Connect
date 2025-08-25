"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Grid3X3, List, Star, MapPin, Heart, ShoppingCart, SlidersHorizontal, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock search results
const searchResults = [
	{
		id: "1",
		name: "Organic Basmati Rice",
		price: 120,
		originalPrice: 150,
		rating: 4.8,
		reviews: 156,
		category: "Grains",
		location: "Chitwan",
		farmer: "Ram Bahadur Thapa",
		image: "/placeholder.svg?height=200&width=200",
		organic: true,
		inStock: true,
	},
	{
		id: "2",
		name: "Fresh Tomatoes",
		price: 45,
		originalPrice: 55,
		rating: 4.6,
		reviews: 89,
		category: "Vegetables",
		location: "Kavre",
		farmer: "Sita Devi",
		image: "/placeholder.svg?height=200&width=200",
		organic: true,
		inStock: true,
	},
	{
		id: "3",
		name: "Organic Potatoes",
		price: 35,
		originalPrice: 40,
		rating: 4.7,
		reviews: 234,
		category: "Vegetables",
		location: "Lalitpur",
		farmer: "Krishna Prasad",
		image: "/placeholder.svg?height=200&width=200",
		organic: true,
		inStock: true,
	},
	{
		id: "4",
		name: "Fresh Apples",
		price: 180,
		originalPrice: 200,
		rating: 4.9,
		reviews: 67,
		category: "Fruits",
		location: "Mustang",
		farmer: "Maya Gurung",
		image: "/placeholder.svg?height=200&width=200",
		organic: false,
		inStock: true,
	},
	{
		id: "5",
		name: "Organic Lentils",
		price: 95,
		originalPrice: 110,
		rating: 4.5,
		reviews: 123,
		category: "Pulses",
		location: "Banke",
		farmer: "Hari Sharma",
		image: "/placeholder.svg?height=200&width=200",
		organic: true,
		inStock: false,
	},
	{
		id: "6",
		name: "Fresh Cauliflower",
		price: 55,
		originalPrice: 65,
		rating: 4.4,
		reviews: 78,
		category: "Vegetables",
		location: "Chitwan",
		farmer: "Gita Rai",
		image: "/placeholder.svg?height=200&width=200",
		organic: true,
		inStock: true,
	},
]

const categories = ["All", "Vegetables", "Fruits", "Grains", "Pulses", "Dairy", "Spices"]
const locations = ["All Locations", "Chitwan", "Kavre", "Lalitpur", "Mustang", "Banke", "Kathmandu"]
const sortOptions = [
	{ value: "relevance", label: "Most Relevant" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "rating", label: "Highest Rated" },
	{ value: "newest", label: "Newest First" },
]

export default function SearchPage() {
	const searchParams = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "")
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const [showFilters, setShowFilters] = useState(false)
	const [favorites, setFavorites] = useState<string[]>([])

	// Filter states
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [selectedLocation, setSelectedLocation] = useState("All Locations")
	const [priceRange, setPriceRange] = useState([0, 500])
	const [organicOnly, setOrganicOnly] = useState(false)
	const [inStockOnly, setInStockOnly] = useState(false)
	const [sortBy, setSortBy] = useState("relevance")

	// Filtered results
	const [filteredResults, setFilteredResults] = useState(searchResults)

	useEffect(() => {
		let results = searchResults

		// Apply search query filter
		if (searchQuery) {
			results = results.filter(
				(product) =>
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.farmer.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		}

		// Apply category filter
		if (selectedCategory !== "All") {
			results = results.filter((product) => product.category === selectedCategory)
		}

		// Apply location filter
		if (selectedLocation !== "All Locations") {
			results = results.filter((product) => product.location === selectedLocation)
		}

		// Apply price range filter
		results = results.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

		// Apply organic filter
		if (organicOnly) {
			results = results.filter((product) => product.organic)
		}

		// Apply stock filter
		if (inStockOnly) {
			results = results.filter((product) => product.inStock)
		}

		// Apply sorting
		switch (sortBy) {
			case "price-low":
				results.sort((a, b) => a.price - b.price)
				break
			case "price-high":
				results.sort((a, b) => b.price - a.price)
				break
			case "rating":
				results.sort((a, b) => b.rating - a.rating)
				break
			default:
				break
		}

		setFilteredResults(results)
	}, [searchQuery, selectedCategory, selectedLocation, priceRange, organicOnly, inStockOnly, sortBy])

	const toggleFavorite = (productId: string) => {
		setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
	}

	const clearFilters = () => {
		setSelectedCategory("All")
		setSelectedLocation("All Locations")
		setPriceRange([0, 500])
		setOrganicOnly(false)
		setInStockOnly(false)
		setSortBy("relevance")
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Search Header */}
				<div className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
						<div className="flex-1 max-w-2xl">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									type="text"
									placeholder="Search for products, farmers, or categories..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-3 text-lg"
								/>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center space-x-2"
							>
								<SlidersHorizontal className="w-4 h-4" />
								<span>Filters</span>
							</Button>

							<div className="flex items-center border rounded-lg">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="rounded-r-none"
								>
									<Grid3X3 className="w-4 h-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="rounded-l-none"
								>
									<List className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<p className="text-gray-600">
							Showing {filteredResults.length} results
							{searchQuery && (
								<span>
									{" "}
									for &quot;<strong>{searchQuery}</strong>&quot;
								</span>
							)}
						</p>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex gap-8">
					{/* Filters Sidebar */}
					<motion.div
						initial={false}
						animate={{
							width: showFilters ? 280 : 0,
							opacity: showFilters ? 1 : 0,
						}}
						className="overflow-hidden"
					>
						<div className="w-70 space-y-6">
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold">Filters</h3>
										<Button variant="ghost" size="sm" onClick={clearFilters}>
											<X className="w-4 h-4 mr-1" />
											Clear
										</Button>
									</div>

									<div className="space-y-6">
										{/* Category Filter */}
										<div>
											<h4 className="font-medium mb-3">Category</h4>
											<div className="space-y-2">
												{categories.map((category) => (
													<button
														key={category}
														onClick={() => setSelectedCategory(category)}
														className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100"
															}`}
													>
														{category}
													</button>
												))}
											</div>
										</div>

										{/* Location Filter */}
										<div>
											<h4 className="font-medium mb-3">Location</h4>
											<Select value={selectedLocation} onValueChange={setSelectedLocation}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{locations.map((location) => (
														<SelectItem key={location} value={location}>
															{location}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Price Range */}
										<div>
											<h4 className="font-medium mb-3">Price Range</h4>
											<div className="px-2">
												<Slider
													value={priceRange}
													onValueChange={setPriceRange}
													max={500}
													min={0}
													step={10}
													className="mb-2"
												/>
												<div className="flex justify-between text-sm text-gray-600">
													<span>₹{priceRange[0]}</span>
													<span>₹{priceRange[1]}</span>
												</div>
											</div>
										</div>

										{/* Additional Filters */}
										<div className="space-y-3">
											<div className="flex items-center space-x-2">
												<Checkbox
													id="organic"
													checked={organicOnly}
													onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
												/>
												<label htmlFor="organic" className="text-sm">
													Organic Only
												</label>
											</div>

											<div className="flex items-center space-x-2">
												<Checkbox
													id="instock"
													checked={inStockOnly}
													onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
												/>
												<label htmlFor="instock" className="text-sm">
													In Stock Only
												</label>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</motion.div>

					{/* Results */}
					<div className="flex-1">
						{filteredResults.length === 0 ? (
							<div className="text-center py-12">
								<Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
								<h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
								<p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
								<Button onClick={clearFilters} variant="outline">
									Clear Filters
								</Button>
							</div>
						) : (
							<div
								className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
							>
								{filteredResults.map((product) => (
									<motion.div
										key={product.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className={
											viewMode === "grid"
												? "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
												: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
										}
									>
										{viewMode === "grid" ? (
											<div>
												<div className="relative">
													<Link href={`/products/${product.id}`}>
														<Image
															src={product.image || "/placeholder.svg"}
															alt={product.name}
															width={300}
															height={200}
															className="w-full h-48 object-cover"
														/>
													</Link>
													<button
														onClick={() => toggleFavorite(product.id)}
														className={`absolute top-3 right-3 p-2 rounded-full ${favorites.includes(product.id) ? "bg-red-100 text-red-600" : "bg-white/80 text-gray-600"
															}`}
													>
														<Heart className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
													</button>
													{product.organic && (
														<Badge className="absolute top-3 left-3 bg-green-100 text-green-800">Organic</Badge>
													)}
													{!product.inStock && (
														<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
															<Badge variant="destructive">Out of Stock</Badge>
														</div>
													)}
												</div>

												<div className="p-4">
													<Link href={`/products/${product.id}`}>
														<h3 className="font-medium mb-2 hover:text-emerald-600">{product.name}</h3>
													</Link>

													<div className="flex items-center space-x-2 mb-2">
														<div className="flex items-center space-x-1">
															<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
															<span className="text-sm">{product.rating}</span>
															<span className="text-xs text-gray-500">({product.reviews})</span>
														</div>
													</div>

													<div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
														<MapPin className="w-4 h-4" />
														<span>{product.location}</span>
														<span>•</span>
														<span>{product.farmer}</span>
													</div>

													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-2">
															<span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
															{product.originalPrice > product.price && (
																<span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
															)}
														</div>

														<Button size="sm" disabled={!product.inStock}>
															<ShoppingCart className="w-4 h-4 mr-1" />
															Add
														</Button>
													</div>
												</div>
											</div>
										) : (
											<div className="flex items-center space-x-4 p-4">
												<div className="relative">
													<Link href={`/products/${product.id}`}>
														<Image
															src={product.image || "/placeholder.svg"}
															alt={product.name}
															width={120}
															height={120}
															className="w-24 h-24 object-cover rounded-lg"
														/>
													</Link>
													{product.organic && (
														<Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs">
															Organic
														</Badge>
													)}
												</div>

												<div className="flex-1">
													<Link href={`/products/${product.id}`}>
														<h3 className="font-medium mb-1 hover:text-emerald-600">{product.name}</h3>
													</Link>

													<div className="flex items-center space-x-4 mb-2">
														<div className="flex items-center space-x-1">
															<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
															<span className="text-sm">{product.rating}</span>
															<span className="text-xs text-gray-500">({product.reviews})</span>
														</div>

														<div className="flex items-center space-x-1 text-sm text-gray-600">
															<MapPin className="w-4 h-4" />
															<span>{product.location}</span>
														</div>
													</div>

													<p className="text-sm text-gray-600 mb-2">by {product.farmer}</p>

													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-2">
															<span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
															{product.originalPrice > product.price && (
																<span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
															)}
														</div>

														<div className="flex items-center space-x-2">
															<button
																onClick={() => toggleFavorite(product.id)}
																className={`p-2 rounded-full ${favorites.includes(product.id)
																		? "bg-red-100 text-red-600"
																		: "bg-gray-100 text-gray-600"
																	}`}
															>
																<Heart className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
															</button>

															<Button size="sm" disabled={!product.inStock}>
																<ShoppingCart className="w-4 h-4 mr-1" />
																Add to Cart
															</Button>
														</div>
													</div>
												</div>
											</div>
										)}
									</motion.div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
