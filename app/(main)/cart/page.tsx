"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock cart data
const initialCartItems = [
	{
		id: 1,
		productId: 1,
		name: "Organic Basmati Rice",
		farmer: "Ram Bahadur",
		location: "Chitwan",
		price: 120,
		originalPrice: 150,
		unit: "kg",
		quantity: 2,
		image: "/placeholder.svg?height=100&width=100",
		isOrganic: true,
		stock: 50,
	},
	{
		id: 2,
		productId: 2,
		name: "Fresh Tomatoes",
		farmer: "Sita Devi",
		location: "Kavre",
		price: 80,
		originalPrice: 100,
		unit: "kg",
		quantity: 1,
		image: "/placeholder.svg?height=100&width=100",
		isOrganic: true,
		stock: 25,
	},
	{
		id: 3,
		productId: 3,
		name: "Mountain Honey",
		farmer: "Tek Bahadur",
		location: "Mustang",
		price: 800,
		originalPrice: 1000,
		unit: "bottle",
		quantity: 1,
		image: "/placeholder.svg?height=100&width=100",
		isOrganic: true,
		stock: 15,
	},
]

export default function CartPage() {
	const [cartItems, setCartItems] = useState(initialCartItems)
	const [promoCode, setPromoCode] = useState("")
	const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

	const updateQuantity = (id: number, newQuantity: number) => {
		if (newQuantity === 0) {
			removeItem(id)
			return
		}

		setCartItems(
			cartItems.map((item) => (item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item)),
		)
	}

	const removeItem = (id: number) => {
		setCartItems(cartItems.filter((item) => item.id !== id))
	}

	const applyPromoCode = () => {
		// Mock promo code validation
		if (promoCode.toLowerCase() === "fresh10") {
			setAppliedPromo("FRESH10")
			setPromoCode("")
		} else {
			alert("Invalid promo code")
		}
	}

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
	const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
	const promoDiscount = appliedPromo === "FRESH10" ? subtotal * 0.1 : 0
	const deliveryFee = subtotal > 1000 ? 0 : 50
	const total = subtotal - promoDiscount + deliveryFee

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="container mx-auto px-4 py-16">
					<div className="text-center space-y-6">
						<div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
							<ShoppingBag className="h-12 w-12 text-muted-foreground" />
						</div>
						<div>
							<h1 className="font-serif text-3xl font-bold mb-2">Your cart is empty</h1>
							<p className="text-muted-foreground">Add some fresh products from our farmers to get started!</p>
						</div>
						<Button size="lg" asChild>
							<Link href="/products">
								Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
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
					<h1 className="font-serif text-3xl font-bold mb-2">Shopping Cart</h1>
					<p className="text-muted-foreground">{cartItems.length} items in your cart</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{cartItems.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
							>
								<Card>
									<CardContent className="p-4">
										<div className="flex items-center space-x-4">
											<Link href={`/products/${item.productId}`}>
												<Image
													src={item.image || "/placeholder.svg"}
													alt={item.name}
													className="w-20 h-20 rounded-lg object-cover"
													loading="lazy"
													height={32}
													width={32}
												/>
											</Link>

											<div className="flex-1 space-y-2">
												<div className="flex items-start justify-between">
													<div>
														<Link href={`/products/${item.productId}`}>
															<h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
														</Link>
														<p className="text-sm text-muted-foreground">
															by {item.farmer} • {item.location}
														</p>
														{item.isOrganic && <Badge className="bg-green-100 text-green-800 mt-1">Organic</Badge>}
													</div>
													<Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														<span className="font-bold">Rs. {item.price}</span>
														{item.originalPrice > item.price && (
															<span className="text-sm text-muted-foreground line-through">
																Rs. {item.originalPrice}
															</span>
														)}
														<span className="text-sm text-muted-foreground">/{item.unit}</span>
													</div>

													<div className="flex items-center space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateQuantity(item.id, item.quantity - 1)}
															disabled={item.quantity <= 1}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="w-12 text-center font-medium">{item.quantity}</span>
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateQuantity(item.id, item.quantity + 1)}
															disabled={item.quantity >= item.stock}
														>
															<Plus className="h-3 w-3" />
														</Button>
													</div>
												</div>

												<div className="flex items-center justify-between text-sm">
													<span className="text-muted-foreground">
														Stock: {item.stock} {item.unit}
													</span>
													<span className="font-semibold">Rs. {item.price * item.quantity}</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}

						{/* Continue Shopping */}
						<div className="pt-4">
							<Button variant="outline" asChild className="bg-transparent">
								<Link href="/products">Continue Shopping</Link>
							</Button>
						</div>
					</div>

					{/* Order Summary */}
					<div className="space-y-6">
						{/* Promo Code */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Promo Code</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex space-x-2">
									<Input
										placeholder="Enter promo code"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
									/>
									<Button onClick={applyPromoCode} disabled={!promoCode}>
										Apply
									</Button>
								</div>
								{appliedPromo && (
									<div className="flex items-center justify-between text-sm">
										<span className="text-green-600">✓ {appliedPromo} applied</span>
										<Button variant="ghost" size="sm" onClick={() => setAppliedPromo(null)}>
											Remove
										</Button>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Order Summary */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>Rs. {subtotal}</span>
								</div>
								{savings > 0 && (
									<div className="flex justify-between text-green-600">
										<span>You save</span>
										<span>-Rs. {savings}</span>
									</div>
								)}
								{promoDiscount > 0 && (
									<div className="flex justify-between text-green-600">
										<span>Promo discount</span>
										<span>-Rs. {promoDiscount.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between">
									<span>Delivery fee</span>
									<span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
								</div>
								<Separator />
								<div className="flex justify-between font-bold text-lg">
									<span>Total</span>
									<span>Rs. {total.toFixed(2)}</span>
								</div>

								<Button className="w-full" size="lg" asChild>
									<Link href="/checkout">
										Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Delivery Info */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3 text-sm">
									<div className="flex items-center space-x-2">
										<Truck className="h-4 w-4 text-primary" />
										<span>Free delivery on orders over Rs. 1000</span>
									</div>
									<div className="flex items-center space-x-2">
										<Clock className="h-4 w-4 text-primary" />
										<span>Delivery within 2-3 business days</span>
									</div>
									<div className="flex items-center space-x-2">
										<Shield className="h-4 w-4 text-primary" />
										<span>100% quality guarantee</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
