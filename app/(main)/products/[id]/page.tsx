"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Heart, Share2, Star, MapPin, Truck, Shield, Plus, Minus, 
	ShoppingCart, User, Phone, Mail, Leaf, Award
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getPublicProductById, getRelatedProducts } from "@/actions/(common)/product.action"
import { ProductDetailSkeleton } from "@/components/products/product-detail-skeleton"

interface Product {
	id: string
	name: string
	description: string
	price: number
	originalPrice?: number
	rating?: number
	reviews?: number
	category: string
	stock: number
	unit: string
	images: string[]
	organicCertified: boolean
	harvestDate?: Date
	expiryDate?: Date
	farmer: {
		id: string
		name: string
		location: string
		district: string
		rating: number
		totalProducts: number
		farmingExperience?: number
		phone?: string
		email?: string
		image?: string
		verified: boolean
	}
	deliveryInfo?: {
		estimatedDays: string
		freeDeliveryAbove: number
		deliveryCharge: number
	}
}

interface RelatedProduct {
	id: string
	name: string
	price: number
	rating?: number
	images: string[]
	farmer: {
		name: string
	}
}

export default function ProductDetailPage() {
	const params = useParams()
	const productId = params.id as string
	
	const [selectedImage, setSelectedImage] = useState(0)
	const [quantity, setQuantity] = useState(1)
	const [isFavorite, setIsFavorite] = useState(false)
	const [product, setProduct] = useState<Product | null>(null)
	const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
	const [loading, setLoading] = useState(true)

	const loadProduct = useCallback(async () => {
		try {
			setLoading(true)
			const result = await getPublicProductById(productId)
			
			if (result.success && result.product) {
				const productData = result.product
				setProduct({
					id: productData.id,
					name: productData.name,
					description: productData.description,
					price: productData.price,
					originalPrice: productData.price * 1.25, // Mock original price (25% markup)
					rating: 4.8, // Mock rating
					reviews: 156, // Mock reviews
					category: productData.category,
					stock: productData.stock,
					unit: productData.unit,
					images: productData.images.length > 0 ? productData.images : ["/placeholder.svg?height=400&width=400"],
					organicCertified: productData.organicCertified,
					harvestDate: productData.harvestDate ? new Date(productData.harvestDate) : undefined,
					expiryDate: productData.expiryDate ? new Date(productData.expiryDate) : undefined,
					farmer: {
						id: productData.farmer.id,
						name: productData.farmer.name || "Unknown Farmer",
						location: productData.farmer.location || productData.location,
						district: productData.farmer.district || productData.district,
						rating: productData.farmer.rating,
						totalProducts: productData.farmer.totalProducts,
						farmingExperience: productData.farmer.farmingExperience || 0,
						phone: productData.farmer.phone || "",
						email: productData.farmer.email || "",
						image: productData.farmer.image || "/placeholder.svg?height=80&width=80",
						verified: productData.farmer.verified
					},
					deliveryInfo: {
						estimatedDays: "2-3 days",
						freeDeliveryAbove: 500,
						deliveryCharge: 50
					}
				})

				// Load related products
				const relatedResult = await getRelatedProducts(productData.id, productData.category)
				if (relatedResult.success) {
					setRelatedProducts(relatedResult.products.map(p => ({
						id: p.id,
						name: p.name,
						price: p.price,
						rating: 4.7, // Mock rating
						images: p.images.length > 0 ? p.images : ["/placeholder.svg?height=200&width=200"],
						farmer: {
							name: p.farmer.name || "Unknown Farmer"
						}
					})))
				}
			} else {
				console.error("Failed to load product:", result.error)
				// TODO: Show error state
			}
		} catch (error) {
			console.error("Error loading product:", error)
			// TODO: Show error state
		} finally {
			setLoading(false)
		}
	}, [productId])

	useEffect(() => {
		if (productId) {
			loadProduct()
		}
	}, [productId, loadProduct])

	const handleAddToCart = () => {
		if (!product) return
		console.log("Adding to cart:", { productId: product.id, quantity })
		// TODO: Implement real add to cart logic
		alert(`Added ${quantity} ${product.unit} of ${product.name} to cart!`)
	}

	const handleBuyNow = () => {
		if (!product) return
		console.log("Buy now:", { productId: product.id, quantity })
		// TODO: Implement real buy now logic - redirect to checkout
		window.location.href = "/checkout"
	}

	if (loading) {
		return <ProductDetailSkeleton />
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
					<p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
					<Link href="/products">
						<Button>Browse Products</Button>
					</Link>
				</div>
			</div>
		)
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
									{Math.round(((product?.originalPrice! - product.price) / product?.originalPrice!) * 100)}% OFF
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
						{product.organicCertified && (
							<div className="grid grid-cols-2 gap-2">
								<div className="flex items-center space-x-2 text-sm">
									<Leaf className="w-4 h-4 text-emerald-600" />
									<span>100% Organic Certified</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Leaf className="w-4 h-4 text-emerald-600" />
									<span>Direct from Farm</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Leaf className="w-4 h-4 text-emerald-600" />
									<span>No Pesticides Used</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Leaf className="w-4 h-4 text-emerald-600" />
									<span>Premium Quality</span>
								</div>
							</div>
						)}

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
									<p>Estimated delivery: {product?.deliveryInfo && product?.deliveryInfo.estimatedDays}</p>
									<p>
										Delivery charge: ₹{product?.deliveryInfo && product?.deliveryInfo.deliveryCharge} (Free above ₹
										{product?.deliveryInfo && product?.deliveryInfo.freeDeliveryAbove})
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
									<div className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium text-gray-900">Category:</span>
										<span className="text-gray-600">{product.category}</span>
									</div>
									<div className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium text-gray-900">Unit:</span>
										<span className="text-gray-600">{product.unit}</span>
									</div>
									<div className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium text-gray-900">Stock:</span>
										<span className="text-gray-600">{product.stock}</span>
									</div>
									<div className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium text-gray-900">Organic Certified:</span>
										<span className="text-gray-600">{product.organicCertified ? "Yes" : "No"}</span>
									</div>
									{product.harvestDate && (
										<div className="flex justify-between py-2 border-b border-gray-100">
											<span className="font-medium text-gray-900">Harvest Date:</span>
											<span className="text-gray-600">{product.harvestDate.toLocaleDateString()}</span>
										</div>
									)}
									{product.expiryDate && (
										<div className="flex justify-between py-2 border-b border-gray-100">
											<span className="font-medium text-gray-900">Expiry Date:</span>
											<span className="text-gray-600">{product.expiryDate.toLocaleDateString()}</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="farmer" className="mt-6">
						<Card>
							<CardContent className="p-6">							<div className="flex items-start space-x-4">
								<Image
									src={product.farmer.image || "/placeholder.svg"}
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
											<span>{product.farmer.farmingExperience} years experience</span>
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
										src={relatedProduct.images[0] || "/placeholder.svg"}
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
										<p className="text-sm text-gray-600 mt-1">by {relatedProduct.farmer.name}</p>
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