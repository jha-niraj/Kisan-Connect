"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
	Search, 
	Filter, 
	ShoppingCart, 
	Loader2,
	Star,
	MapPin
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { addToCart } from "@/actions/(common)/cart.action"

interface Product {
	id: string
	name: string
	description: string
	price: number
	images: string[]
	unit: string
	stock: number
	category: string
	status: string
	organicCertified: boolean
	farmer: {
		id: string
		name: string
		location?: string | null
		district?: string | null
		rating?: number
	}
}

export default function UserProducts() {
	const { data: session } = useSession()
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [sortBy, setSortBy] = useState("name")
	const [addingToCart, setAddingToCart] = useState<string | null>(null)

	useEffect(() => {
		loadProducts()
	}, [])

	const loadProducts = async () => {
		setIsLoading(true)
		try {
			// Mock API call - in real app this would be a server action
			// Simulate loading from database
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// Mock products data
			const mockProducts: Product[] = [
				{
					id: "1",
					name: "Fresh Organic Tomatoes",
					description: "Locally grown organic tomatoes, perfect for cooking and salads",
					price: 120,
					images: ["/placeholder.svg"],
					unit: "kg",
					stock: 50,
					category: "VEGETABLES",
					status: "ACTIVE",
					organicCertified: true,
					farmer: {
						id: "f1",
						name: "Ram Bahadur",
						location: "Bhaktapur",
						district: "Bhaktapur",
						rating: 4.5
					}
				},
				{
					id: "2",
					name: "Premium Basmati Rice",
					description: "High quality basmati rice from the hills of Nepal",
					price: 180,
					images: ["/placeholder.svg"],
					unit: "kg",
					stock: 100,
					category: "GRAINS",
					status: "ACTIVE",
					organicCertified: false,
					farmer: {
						id: "f2",
						name: "Sita Devi",
						location: "Chitwan",
						district: "Chitwan",
						rating: 4.8
					}
				},
				{
					id: "3",
					name: "Organic Cauliflower",
					description: "Fresh cauliflower grown without chemicals",
					price: 80,
					images: ["/placeholder.svg"],
					unit: "piece",
					stock: 25,
					category: "VEGETABLES",
					status: "ACTIVE",
					organicCertified: true,
					farmer: {
						id: "f3",
						name: "Krishna Poudel",
						location: "Lalitpur",
						district: "Lalitpur",
						rating: 4.3
					}
				}
			]
			
			setProducts(mockProducts)
		} catch (error) {
			console.error("Error loading products:", error)
			toast.error("Failed to load products")
		} finally {
			setIsLoading(false)
		}
	}

	const handleAddToCart = async (productId: string) => {
		if (!session?.user) {
			toast.error("Please sign in to add items to cart")
			return
		}

		setAddingToCart(productId)
		try {
			const result = await addToCart(productId, 1)
			if (result.success) {
				toast.success("Added to cart!")
			} else {
				toast.error(result.error || "Failed to add to cart")
			}
		} catch (error) {
			console.error("Error adding to cart:", error)
			toast.error("Failed to add to cart")
		} finally {
			setAddingToCart(null)
		}
	}

	const filteredProducts = products
		.filter(product => 
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedCategory === "all" || product.category === selectedCategory)
		)
		.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price
				case "price-high":
					return b.price - a.price
				case "rating":
					return (b.farmer.rating || 0) - (a.farmer.rating || 0)
				default:
					return a.name.localeCompare(b.name)
			}
		})

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="container mx-auto px-4 py-16">
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
						<p>Loading products...</p>
					</div>
				</div>
				<Footer />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-serif text-3xl font-bold mb-2">Fresh Products</h1>
					<p className="text-muted-foreground">Directly from local farmers</p>
				</div>

				{/* Filters */}
				<div className="grid lg:grid-cols-4 gap-4 mb-8">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger>
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							<SelectItem value="VEGETABLES">Vegetables</SelectItem>
							<SelectItem value="GRAINS">Grains</SelectItem>
							<SelectItem value="FRUITS">Fruits</SelectItem>
							<SelectItem value="DAIRY">Dairy</SelectItem>
						</SelectContent>
					</Select>

					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="price-low">Price: Low to High</SelectItem>
							<SelectItem value="price-high">Price: High to Low</SelectItem>
							<SelectItem value="rating">Rating</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline">
						<Filter className="h-4 w-4 mr-2" />
						More Filters
					</Button>
				</div>

				{/* Products Grid */}
				{filteredProducts.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-muted-foreground text-lg">No products found</p>
						<Button 
							variant="outline" 
							className="mt-4"
							onClick={() => {
								setSearchTerm("")
								setSelectedCategory("all")
							}}
						>
							Clear Filters
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredProducts.map((product, index) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
							>
								<Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
									<div className="relative">
										<Link href={`/products/${product.id}`}>
											<Image
												src={product.images[0] || "/placeholder.svg"}
												alt={product.name}
												width={300}
												height={200}
												className="w-full h-48 object-cover rounded-t-lg"
											/>
										</Link>
										{product.organicCertified && (
											<Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
												Organic
											</Badge>
										)}
									</div>

									<CardContent className="p-4 flex-1 flex flex-col">
										<div className="flex-1">
											<Link href={`/products/${product.id}`}>
												<h3 className="font-semibold mb-2 hover:text-primary transition-colors">
													{product.name}
												</h3>
											</Link>
											
											<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
												{product.description}
											</p>

											<div className="flex items-center space-x-2 mb-3">
												<MapPin className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">
													{product.farmer.name}
												</span>
												{product.farmer.location && (
													<>
														<span className="text-muted-foreground">•</span>
														<span className="text-sm text-muted-foreground">
															{product.farmer.location}
														</span>
													</>
												)}
											</div>

											{product.farmer.rating && (
												<div className="flex items-center space-x-1 mb-3">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium">{product.farmer.rating}</span>
												</div>
											)}
										</div>

										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<div>
													<span className="text-lg font-bold">Rs. {product.price}</span>
													<span className="text-sm text-muted-foreground ml-1">/{product.unit}</span>
												</div>
												<span className="text-sm text-muted-foreground">
													{product.stock} {product.unit} available
												</span>
											</div>

											<Button
												className="w-full"
												onClick={() => handleAddToCart(product.id)}
												disabled={product.stock === 0 || addingToCart === product.id}
											>
												{addingToCart === product.id ? (
													<>
														<Loader2 className="h-4 w-4 mr-2 animate-spin" />
														Adding...
													</>
												) : (
													<>
														<ShoppingCart className="h-4 w-4 mr-2" />
														Add to Cart
													</>
												)}
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				)}
			</div>

			<Footer />
		</div>
	)
}
