"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Heart,
	Share2,
	Star,
	MapPin,
	Truck,
	Shield,
	Plus,
	Minus,
	ShoppingCart,
	User,
	Phone,
	Mail,
	Leaf,
	Award,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock product data
const product = {
	id: "1",
	name: "Organic Basmati Rice",
	price: 120,
	originalPrice: 150,
	rating: 4.8,
	reviews: 156,
	category: "Grains",
	stock: 50,
	unit: "kg",
	images: [
		"/placeholder.svg?height=400&width=400",
		"/placeholder.svg?height=400&width=400",
		"/placeholder.svg?height=400&width=400",
		"/placeholder.svg?height=400&width=400",
	],
	description:
		"Premium quality organic basmati rice grown in the fertile valleys of Nepal. This aromatic long-grain rice is perfect for biryanis, pulavs, and everyday meals. Grown without pesticides or chemical fertilizers.",
	features: [
		"100% Organic Certified",
		"Long Grain Basmati",
		"Aromatic & Fluffy",
		"No Pesticides Used",
		"Direct from Farm",
		"Premium Quality",
	],
	farmer: {
		name: "Ram Bahadur Thapa",
		location: "Chitwan, Nepal",
		rating: 4.9,
		totalProducts: 12,
		yearsExperience: 15,
		phone: "+977-9841234567",
		email: "ram.thapa@email.com",
		avatar: "/placeholder.svg?height=80&width=80",
		verified: true,
	},
	specifications: {
		"Grain Type": "Long Grain",
		Processing: "Minimal Processing",
		"Moisture Content": "12-14%",
		Purity: "99.5%",
		"Shelf Life": "12 Months",
		Storage: "Cool & Dry Place",
	},
	deliveryInfo: {
		estimatedDays: "2-3 days",
		freeDeliveryAbove: 500,
		deliveryCharge: 50,
	},
}

const relatedProducts = [
	{
		id: "2",
		name: "Organic Red Rice",
		price: 95,
		rating: 4.6,
		image: "/placeholder.svg?height=200&width=200",
		farmer: "Sita Devi",
	},
	{
		id: "3",
		name: "Brown Rice",
		price: 85,
		rating: 4.7,
		image: "/placeholder.svg?height=200&width=200",
		farmer: "Krishna Prasad",
	},
	{
		id: "4",
		name: "Organic Quinoa",
		price: 280,
		rating: 4.9,
		image: "/placeholder.svg?height=200&width=200",
		farmer: "Maya Gurung",
	},
]

export default function ProductDetailPage() {
	const [selectedImage, setSelectedImage] = useState(0)
	const [quantity, setQuantity] = useState(1)
	const [isFavorite, setIsFavorite] = useState(false)

	const handleAddToCart = () => {
		console.log("Adding to cart:", { productId: product.id, quantity })
		// Mock add to cart logic
		alert(`Added ${quantity} ${product.unit} of ${product.name} to cart!`)
	}

	const handleBuyNow = () => {
		console.log("Buy now:", { productId: product.id, quantity })
		// Mock buy now logic - redirect to checkout
		window.location.href = "/checkout"
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
					<Link href="/" className="hover:text-emerald-600">
						Home
					</Link>
					<span>/</span>
					<Link href="/products" className="hover:text-emerald-600">
						Products
					</Link>
					<span>/</span>
					<span className="text-gray-900">{product.name}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Product Images */}
					<div className="space-y-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg"
						>
							<Image
								src={product.images[selectedImage] || "/placeholder.svg"}
								alt={product.name}
								width={500}
								height={500}
								className="w-full h-full object-cover"
							/>
						</motion.div>

						<div className="grid grid-cols-4 gap-2">
							{product.images.map((image, index) => (
								<motion.button
									key={index}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setSelectedImage(index)}
									className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-emerald-500" : "border-gray-200"
										}`}
								>
									<Image
										src={image || "/placeholder.svg"}
										alt={`${product.name} ${index + 1}`}
										width={100}
										height={100}
										className="w-full h-full object-cover"
									/>
								</motion.button>
							))}
						</div>
					</div>

					{/* Product Info */}
					<div className="space-y-6">
						<div>
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
									{product.category}
								</Badge>
								<div className="flex items-center space-x-2">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setIsFavorite(!isFavorite)}
										className={`p-2 rounded-full ${isFavorite ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
									>
										<Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className="p-2 rounded-full bg-gray-100 text-gray-600"
									>
										<Share2 className="w-5 h-5" />
									</motion.button>
								</div>
							</div>

							<h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

							<div className="flex items-center space-x-4 mb-4">
								<div className="flex items-center space-x-1">
									<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{product.rating}</span>
									<span className="text-gray-600">({product.reviews} reviews)</span>
								</div>
								<div className="flex items-center space-x-1 text-gray-600">
									<MapPin className="w-4 h-4" />
									<span>{product.farmer.location}</span>
								</div>
							</div>

							<div className="flex items-center space-x-4 mb-6">
								<span className="text-3xl font-bold text-emerald-600">₹{product.price}</span>
								<span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
								<Badge variant="destructive">
									{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
								</Badge>
							</div>
						</div>

						{/* Stock Status */}
						<div className="flex items-center space-x-2">
							<div className={`w-3 h-3 rounded-full ${product.stock > 10 ? "bg-green-500" : "bg-yellow-500"}`} />
							<span className="text-sm font-medium">
								{product.stock > 10 ? "In Stock" : "Limited Stock"} ({product.stock} {product.unit} available)
							</span>
						</div>

						{/* Features */}
						<div className="grid grid-cols-2 gap-2">
							{product.features.map((feature, index) => (
								<div key={index} className="flex items-center space-x-2 text-sm">
									<Leaf className="w-4 h-4 text-emerald-600" />
									<span>{feature}</span>
								</div>
							))}
						</div>

						{/* Quantity Selector */}
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<span className="font-medium">Quantity:</span>
								<div className="flex items-center border rounded-lg">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="p-2 hover:bg-gray-100 rounded-l-lg"
									>
										<Minus className="w-4 h-4" />
									</button>
									<span className="px-4 py-2 font-medium">{quantity}</span>
									<button
										onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
										className="p-2 hover:bg-gray-100 rounded-r-lg"
									>
										<Plus className="w-4 h-4" />
									</button>
								</div>
								<span className="text-gray-600">{product.unit}</span>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Button
									onClick={handleAddToCart}
									variant="outline"
									className="flex items-center space-x-2 bg-transparent"
								>
									<ShoppingCart className="w-4 h-4" />
									<span>Add to Cart</span>
								</Button>
								<Button onClick={handleBuyNow} className="bg-emerald-600 hover:bg-emerald-700">
									Buy Now
								</Button>
							</div>
						</div>

						{/* Delivery Info */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2 mb-2">
									<Truck className="w-5 h-5 text-emerald-600" />
									<span className="font-medium">Delivery Information</span>
								</div>
								<div className="space-y-1 text-sm text-gray-600">
									<p>Estimated delivery: {product.deliveryInfo.estimatedDays}</p>
									<p>
										Delivery charge: ₹{product.deliveryInfo.deliveryCharge} (Free above ₹
										{product.deliveryInfo.freeDeliveryAbove})
									</p>
									<p className="flex items-center space-x-1">
										<Shield className="w-4 h-4" />
										<span>100% Authentic Products Guaranteed</span>
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Product Details Tabs */}
				<Tabs defaultValue="description" className="mb-12">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="description">Description</TabsTrigger>
						<TabsTrigger value="specifications">Specifications</TabsTrigger>
						<TabsTrigger value="farmer">Farmer Info</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>

					<TabsContent value="description" className="mt-6">
						<Card>
							<CardContent className="p-6">
								<p className="text-gray-700 leading-relaxed">{product.description}</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="specifications" className="mt-6">
						<Card>
							<CardContent className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{Object.entries(product.specifications).map(([key, value]) => (
										<div key={key} className="flex justify-between py-2 border-b border-gray-100">
											<span className="font-medium text-gray-900">{key}:</span>
											<span className="text-gray-600">{value}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="farmer" className="mt-6">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-start space-x-4">
									<Image
										src={product.farmer.avatar || "/placeholder.svg"}
										alt={product.farmer.name}
										width={80}
										height={80}
										className="rounded-full"
									/>
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-2">
											<h3 className="text-xl font-bold">{product.farmer.name}</h3>
											{product.farmer.verified && (
												<Badge className="bg-blue-100 text-blue-800">
													<Award className="w-3 h-3 mr-1" />
													Verified
												</Badge>
											)}
										</div>
										<div className="space-y-2 text-sm text-gray-600">
											<div className="flex items-center space-x-2">
												<MapPin className="w-4 h-4" />
												<span>{product.farmer.location}</span>
											</div>
											<div className="flex items-center space-x-2">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span>{product.farmer.rating} rating</span>
											</div>
											<div className="flex items-center space-x-2">
												<User className="w-4 h-4" />
												<span>{product.farmer.yearsExperience} years experience</span>
											</div>
											<div className="flex items-center space-x-2">
												<Leaf className="w-4 h-4" />
												<span>{product.farmer.totalProducts} products listed</span>
											</div>
										</div>
										<div className="flex items-center space-x-4 mt-4">
											<Button variant="outline" size="sm">
												<Phone className="w-4 h-4 mr-2" />
												Contact
											</Button>
											<Button variant="outline" size="sm">
												<Mail className="w-4 h-4 mr-2" />
												Message
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="mt-6">
						<Card>
							<CardContent className="p-6">
								<div className="text-center py-8 text-gray-500">
									<Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
									<p>Reviews feature coming soon!</p>
									<p className="text-sm">Be the first to review this product.</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Related Products */}
				<div>
					<h2 className="text-2xl font-bold mb-6">Related Products</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{relatedProducts.map((relatedProduct) => (
							<motion.div
								key={relatedProduct.id}
								whileHover={{ y: -5 }}
								className="bg-white rounded-lg shadow-md overflow-hidden"
							>
								<Link href={`/products/${relatedProduct.id}`}>
									<Image
										src={relatedProduct.image || "/placeholder.svg"}
										alt={relatedProduct.name}
										width={200}
										height={200}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<h3 className="font-medium mb-2">{relatedProduct.name}</h3>
										<div className="flex items-center justify-between">
											<span className="text-lg font-bold text-emerald-600">₹{relatedProduct.price}</span>
											<div className="flex items-center space-x-1">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm">{relatedProduct.rating}</span>
											</div>
										</div>
										<p className="text-sm text-gray-600 mt-1">by {relatedProduct.farmer}</p>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}