"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCartItems, updateCartItemQuantity, removeFromCart } from "@/actions/(common)/cart.action"

interface CartItem {
	id: string
	quantity: number
	userId: string
	productId: string
	product: {
		id: string
		name: string
		price: number
		images: string[]
		unit: string
		stock: number
		farmer: {
			id: string
			name: string
			location?: string | null
			district?: string | null
		}
	}
}

interface GuestCartItem {
	productId: string
	quantity: number
}

export default function CartPage() {
	const { data: session, status } = useSession()
	// const router = useRouter()
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

	const loadCartData = useCallback(async () => {
		setIsLoading(true)
		try {
			if (session?.user) {
				// Load from database for logged-in users
				const result = await getCartItems()
				if (result.success && result.items) {
					setCartItems(result.items)
				}
			} else {
				// Load from localStorage for guest users
				const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("guestCart") || "[]")
				if (localCart.length > 0) {
					// For guest users, we need to fetch product details from the server
					// This would typically be done via a server action that accepts product IDs
					// For now, we'll show a message to sign in
					setCartItems([])
				} else {
					setCartItems([])
				}
			}
		} catch (error) {
			console.error("Error loading cart:", error)
			toast.error("Failed to load cart")
		} finally {
			setIsLoading(false)
		}
	}, []);

	useEffect(() => {
		loadCartData()
	}, [session, loadCartData])

	const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return

		setUpdatingItems(prev => new Set(prev).add(itemId))
		
		try {
			if (session?.user) {
				const result = await updateCartItemQuantity(itemId, newQuantity)
				if (result.success) {
					setCartItems(prev => 
						prev.map(item => 
							item.id === itemId 
								? { ...item, quantity: newQuantity }
								: item
						)
					)
					toast.success("Cart updated")
				} else {
					toast.error("Failed to update cart")
				}
			} else {
				// Update localStorage for guest users
				const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("guestCart") || "[]")
				const updatedCart = localCart.map(item => 
					item.productId === itemId 
						? { ...item, quantity: newQuantity }
						: item
				)
				localStorage.setItem("guestCart", JSON.stringify(updatedCart))
				await loadCartData() // Reload to sync state
			}
		} catch (error) {
			console.error("Error updating cart:", error)
			toast.error("Failed to update cart")
		} finally {
			setUpdatingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(itemId)
				return newSet
			})
		}
	}

	const handleRemoveItem = async (itemId: string) => {
		setUpdatingItems(prev => new Set(prev).add(itemId))
		
		try {
			if (session?.user) {
				const result = await removeFromCart(itemId)
				if (result.success) {
					setCartItems(prev => prev.filter(item => item.id !== itemId))
					toast.success("Item removed from cart")
				} else {
					toast.error("Failed to remove item")
				}
			} else {
				// Remove from localStorage for guest users
				const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("guestCart") || "[]")
				const updatedCart = localCart.filter(item => item.productId !== itemId)
				localStorage.setItem("guestCart", JSON.stringify(updatedCart))
				await loadCartData() // Reload to sync state
			}
		} catch (error) {
			console.error("Error removing item:", error)
			toast.error("Failed to remove item")
		} finally {
			setUpdatingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(itemId)
				return newSet
			})
		}
	}

	const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	const deliveryFee = subtotal > 1000 ? 0 : 50
	const total = subtotal + deliveryFee

	if (status === "loading" || isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="container mx-auto px-4 py-16">
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
						<p>Loading your cart...</p>
					</div>
				</div>
				<Footer />
			</div>
		)
	}

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="container mx-auto px-4 py-16">
					<div className="text-center space-y-6">
						<ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
						<h1 className="font-serif text-3xl font-bold">Your cart is empty</h1>
						<p className="text-muted-foreground">
							{!session?.user 
								? "Sign in to save items to your cart and access your purchases"
								: "Discover fresh products from local farmers"
							}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" asChild>
								<Link href="/products">
									Start Shopping
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							{!session?.user && (
								<Button variant="outline" size="lg" asChild>
									<Link href="/signin">
										Sign In
									</Link>
								</Button>
							)}
						</div>
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
				<div className="mb-8">
					<h1 className="font-serif text-3xl font-bold mb-2">Shopping Cart</h1>
					<p className="text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{cartItems.map((item) => (
							<Card key={item.id}>
								<CardContent className="p-6">
									<div className="flex items-center space-x-4">
										{/* Product Image */}
										<div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden">
											{item.product.images && item.product.images.length > 0 ? (
												<Image
													src={item.product.images[0]}
													alt={item.product.name}
													fill
													className="object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400">
													<ShoppingBag className="h-8 w-8" />
												</div>
											)}
										</div>

										{/* Product Details */}
										<div className="flex-1">
											<h3 className="font-semibold">{item.product.name}</h3>
											<p className="text-sm text-muted-foreground">
												by {item.product.farmer.name}
												{item.product.farmer.district && ` • ${item.product.farmer.district}`}
											</p>
											<p className="text-lg font-bold text-primary">
												Rs. {item.product.price.toFixed(2)} / {item.product.unit}
											</p>
											<Badge variant="secondary" className="mt-1">
												{item.product.stock} {item.product.unit} available
											</Badge>
										</div>

										{/* Quantity Controls */}
										<div className="flex items-center space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
												disabled={item.quantity <= 1 || updatingItems.has(item.id)}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span className="w-8 text-center font-medium">
												{updatingItems.has(item.id) ? (
													<Loader2 className="h-4 w-4 animate-spin mx-auto" />
												) : (
													item.quantity
												)}
											</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
												disabled={item.quantity >= item.product.stock || updatingItems.has(item.id)}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>

										{/* Total Price */}
										<div className="text-right">
											<p className="font-bold text-lg">
												Rs. {(item.product.price * item.quantity).toFixed(2)}
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleRemoveItem(item.id)}
												disabled={updatingItems.has(item.id)}
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Order Summary */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>Rs. {subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Delivery fee</span>
										<span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
									</div>
									{deliveryFee === 0 && (
										<p className="text-sm text-green-600">
											🎉 Free delivery on orders over Rs. 1000
										</p>
									)}
									<Separator />
									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span>Rs. {total.toFixed(2)}</span>
									</div>
								</div>

								<Button className="w-full" size="lg" asChild>
									<Link href="/checkout">
										Proceed to Checkout
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>

								<Button variant="outline" className="w-full" asChild>
									<Link href="/products">Continue Shopping</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Delivery Info */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3 text-sm">
									<h4 className="font-medium">Delivery Information</h4>
									<div className="space-y-2 text-muted-foreground">
										<p>• Fresh products delivered directly from farmers</p>
										<p>• Delivery within 2-3 business days</p>
										<p>• Free delivery on orders over Rs. 1000</p>
										<p>• Cash on delivery available</p>
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
