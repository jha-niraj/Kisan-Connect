"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	CreditCard, Truck, MapPin, Phone, ArrowLeft, Loader2
} from "lucide-react"
import Link from "next/link"
import { getCartItems, clearCart } from "@/actions/(common)/cart.action"

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

interface Address {
	id?: string
	name: string
	phone: string
	street: string
	municipality: string
	district: string
	province: string
	isDefault?: boolean
	notes?: string
}

const nepalProvinces = [
	"Province 1",
	"Madhesh Province",
	"Bagmati Province",
	"Gandaki Province",
	"Lumbini Province",
	"Karnali Province",
	"Sudurpashchim Province"
]

export default function CheckoutPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Address form
	const [address, setAddress] = useState<Address>({
		name: "",
		phone: "",
		street: "",
		municipality: "",
		district: "",
		province: "",
		notes: ""
	})

	// Payment and terms
	const [paymentMethod, setPaymentMethod] = useState("cod")
	const [agreeTerms, setAgreeTerms] = useState(false)

	useEffect(() => {
		loadCartData()
		loadUserProfile()
	}, [session]) // eslint-disable-line react-hooks/exhaustive-deps

	const loadCartData = async () => {
		setIsLoading(true)
		try {
			if (session?.user) {
				const result = await getCartItems()
				if (result.success && result.items) {
					setCartItems(result.items)
				} else {
					toast.error("Failed to load cart")
					router.push("/cart")
				}
			} else {
				// Load from localStorage for guest users
				const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]")
				setCartItems(localCart)
			}
		} catch (error) {
			console.error("Error loading cart:", error)
			toast.error("Failed to load cart")
			router.push("/cart")
		} finally {
			setIsLoading(false)
		}
	}

	const loadUserProfile = async () => {
		if (session?.user) {
			// Pre-fill address from user profile if available
			// This would typically be loaded from the database
			// For now, we'll set some default values from session if available
			setAddress(prev => ({
				...prev,
				name: session.user.name || "",
			}))
		}
	}

	const handleAddressChange = (field: keyof Address, value: string) => {
		setAddress(prev => ({
			...prev,
			[field]: value
		}))
	}

	const validateAddress = () => {
		const required = ['name', 'phone', 'street', 'municipality', 'district', 'province']
		for (const field of required) {
			if (!address[field as keyof Address]) {
				toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
				return false
			}
		}
		return true
	}

	const handlePlaceOrder = async () => {
		if (!validateAddress()) return
		if (!agreeTerms) {
			toast.error("Please agree to the terms and conditions")
			return
		}
		if (cartItems.length === 0) {
			toast.error("Your cart is empty")
			return
		}

		setIsSubmitting(true)
		try {
			// Mock order creation - in real app this would be a server action
			const _orderData = {  // eslint-disable-line @typescript-eslint/no-unused-vars
				items: cartItems.map(item => ({
					productId: item.product.id,
					quantity: item.quantity,
					price: item.product.price
				})),
				deliveryAddress: address,
				paymentMethod,
				subtotal,
				deliveryFee,
				total
			}

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000))

			// Clear cart after successful order
			if (session?.user) {
				await clearCart()
			} else {
				localStorage.removeItem("guestCart")
			}

			toast.success("Order placed successfully!")
			router.push("/dashboard") // Redirect to dashboard/orders page
		} catch (error) {
			console.error("Error placing order:", error)
			toast.error("Failed to place order. Please try again.")
		} finally {
			setIsSubmitting(false)
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
						<p>Loading checkout...</p>
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
						<h1 className="font-serif text-3xl font-bold">Your cart is empty</h1>
						<p className="text-muted-foreground">Add some products to continue with checkout</p>
						<Button size="lg" asChild>
							<Link href="/products">Continue Shopping</Link>
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
				<div className="flex items-center space-x-4 mb-8">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/cart">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Cart
						</Link>
					</Button>
					<div>
						<h1 className="font-serif text-3xl font-bold">Checkout</h1>
						<p className="text-muted-foreground">Complete your order</p>
					</div>
				</div>
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Truck className="h-5 w-5" />
									<span>Delivery Address</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="name">Full Name *</Label>
										<Input
											id="name"
											value={address.name}
											onChange={(e) => handleAddressChange("name", e.target.value)}
											placeholder="Your full name"
										/>
									</div>
									<div>
										<Label htmlFor="phone">Phone Number *</Label>
										<Input
											id="phone"
											value={address.phone}
											onChange={(e) => handleAddressChange("phone", e.target.value)}
											placeholder="Your phone number"
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="street">Street Address *</Label>
									<Input
										id="street"
										value={address.street}
										onChange={(e) => handleAddressChange("street", e.target.value)}
										placeholder="House number, street name"
									/>
								</div>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="municipality">Municipality *</Label>
										<Input
											id="municipality"
											value={address.municipality}
											onChange={(e) => handleAddressChange("municipality", e.target.value)}
											placeholder="Municipality/City"
										/>
									</div>
									<div>
										<Label htmlFor="district">District *</Label>
										<Input
											id="district"
											value={address.district}
											onChange={(e) => handleAddressChange("district", e.target.value)}
											placeholder="District"
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="province">Province *</Label>
									<select
										id="province"
										value={address.province}
										onChange={(e) => handleAddressChange("province", e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">Select Province</option>
										{
											nepalProvinces.map(province => (
												<option key={province} value={province}>{province}</option>
											))
										}
									</select>
								</div>
								<div>
									<Label htmlFor="notes">Delivery Notes (Optional)</Label>
									<Textarea
										id="notes"
										value={address.notes || ""}
										onChange={(e) => handleAddressChange("notes", e.target.value)}
										placeholder="Any special delivery instructions"
										rows={3}
									/>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<CreditCard className="h-5 w-5" />
									<span>Payment Method</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
									<div className="flex items-center space-x-2 p-4 border rounded-lg">
										<RadioGroupItem value="cod" id="cod" />
										<Label htmlFor="cod" className="flex-1">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-medium">Cash on Delivery</p>
													<p className="text-sm text-muted-foreground">Pay when you receive your order</p>
												</div>
												<Badge variant="secondary">Recommended</Badge>
											</div>
										</Label>
									</div>
									<div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
										<RadioGroupItem value="esewa" id="esewa" disabled />
										<Label htmlFor="esewa" className="flex-1">
											<div>
												<p className="font-medium">eSewa</p>
												<p className="text-sm text-muted-foreground">Digital wallet payment (Coming Soon)</p>
											</div>
										</Label>
									</div>
									<div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
										<RadioGroupItem value="khalti" id="khalti" disabled />
										<Label htmlFor="khalti" className="flex-1">
											<div>
												<p className="font-medium">Khalti</p>
												<p className="text-sm text-muted-foreground">Digital wallet payment (Coming Soon)</p>
											</div>
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-start space-x-2">
									<Checkbox
										id="terms"
										checked={agreeTerms}
										onCheckedChange={(checked) => setAgreeTerms(checked === true)}
									/>
									<Label htmlFor="terms" className="text-sm leading-relaxed">
										I agree to the{" "}
										<Link href="/terms" className="text-primary hover:underline">
											Terms and Conditions
										</Link>{" "}
										and{" "}
										<Link href="/privacy" className="text-primary hover:underline">
											Privacy Policy
										</Link>
										. I understand that all products are sourced directly from farmers and delivery times may vary.
									</Label>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{
									cartItems.map((item) => (
										<div key={item.id} className="flex items-center justify-between">
											<div className="flex-1">
												<p className="font-medium">{item.product.name}</p>
												<p className="text-sm text-muted-foreground">
													by {item.product.farmer.name} • {item.quantity} {item.product.unit}
												</p>
											</div>
											<span className="font-medium">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
										</div>
									))
								}

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>Rs. {subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Delivery fee</span>
										<span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
									</div>
									<Separator />
									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span>Rs. {total.toFixed(2)}</span>
									</div>
								</div>
								<Button
									className="w-full"
									size="lg"
									onClick={handlePlaceOrder}
									disabled={!agreeTerms || isSubmitting}
								>
									{
										isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Placing Order...
											</>
										) : (
											"Place Order"
										)
									}
								</Button>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3 text-sm">
									<div className="flex items-center space-x-2">
										<MapPin className="h-4 w-4 text-primary" />
										<span>Delivery within Nepal only</span>
									</div>
									<div className="flex items-center space-x-2">
										<Truck className="h-4 w-4 text-primary" />
										<span>2-3 business days delivery</span>
									</div>
									<div className="flex items-center space-x-2">
										<Phone className="h-4 w-4 text-primary" />
										<span>Call support: +977-1-4444444</span>
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