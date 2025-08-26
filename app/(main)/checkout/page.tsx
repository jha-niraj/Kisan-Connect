"use client"

import { useState } from "react"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddressSelector } from "@/components/address/address-selector"
import { CreditCard, Truck, MapPin, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Address interface to match AddressSelector component
interface Address {
	id: number
	label: string
	type: string
	name: string
	phone: string
	street: string
	municipality: string
	district: string
	province: string
	isDefault: boolean
	notes?: string
}

// Nepal provinces and districts data
// const nepalProvinces = {
// 	"Province 1": [
// 		"Bhojpur",
// 		"Dhankuta",
// 		"Ilam",
// 		"Jhapa",
// 		"Khotang",
// 		"Morang",
// 		"Okhaldhunga",
// 		"Panchthar",
// 		"Sankhuwasabha",
// 		"Solukhumbu",
// 		"Sunsari",
// 		"Taplejung",
// 		"Terhathum",
// 		"Udayapur",
// 	],
// 	"Madhesh Province": ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
// 	"Bagmati Province": [
// 		"Bhaktapur",
// 		"Chitwan",
// 		"Dhading",
// 		"Dolakha",
// 		"Kathmandu",
// 		"Kavrepalanchok",
// 		"Lalitpur",
// 		"Makwanpur",
// 		"Nuwakot",
// 		"Ramechhap",
// 		"Rasuwa",
// 		"Sindhuli",
// 		"Sindhupalchok",
// 	],
// 	"Gandaki Province": [
// 		"Baglung",
// 		"Gorkha",
// 		"Kaski",
// 		"Lamjung",
// 		"Manang",
// 		"Mustang",
// 		"Myagdi",
// 		"Nawalpur",
// 		"Parbat",
// 		"Syangja",
// 		"Tanahun",
// 	],
// 	"Lumbini Province": [
// 		"Arghakhanchi",
// 		"Banke",
// 		"Bardiya",
// 		"Dang",
// 		"Gulmi",
// 		"Kapilvastu",
// 		"Nawalparasi (East)",
// 		"Nawalparasi (West)",
// 		"Palpa",
// 		"Pyuthan",
// 		"Rolpa",
// 		"Rukum (East)",
// 	],
// 	"Karnali Province": [
// 		"Dailekh",
// 		"Dolpa",
// 		"Humla",
// 		"Jajarkot",
// 		"Jumla",
// 		"Kalikot",
// 		"Mugu",
// 		"Rukum (West)",
// 		"Salyan",
// 		"Surkhet",
// 	],
// 	"Sudurpashchim Province": [
// 		"Achham",
// 		"Baitadi",
// 		"Bajhang",
// 		"Bajura",
// 		"Dadeldhura",
// 		"Darchula",
// 		"Doti",
// 		"Kailali",
// 		"Kanchanpur",
// 	],
// }

// Mock cart items for checkout
const cartItems = [
	{
		id: 1,
		name: "Organic Basmati Rice",
		farmer: "Ram Bahadur",
		price: 120,
		quantity: 2,
		unit: "kg",
	},
	{
		id: 2,
		name: "Fresh Tomatoes",
		farmer: "Sita Devi",
		price: 80,
		quantity: 1,
		unit: "kg",
	},
	{
		id: 3,
		name: "Mountain Honey",
		farmer: "Tek Bahadur",
		price: 800,
		quantity: 1,
		unit: "bottle",
	},
]

// Mock saved addresses for address selector
const savedAddresses: Address[] = [
	{
		id: 1,
		label: "Home",
		type: "home",
		name: "Ram Bahadur Sharma",
		phone: "+977-9841234567",
		street: "Ward No. 5, Thamel",
		municipality: "Kathmandu Metropolitan City",
		district: "Kathmandu",
		province: "Bagmati Province",
		isDefault: true,
		notes: "Near Thamel Chowk, blue gate",
	},
	{
		id: 2,
		label: "Office",
		type: "office",
		name: "Ram Bahadur Sharma",
		phone: "+977-9841234567",
		street: "Ward No. 11, New Baneshwor",
		municipality: "Kathmandu Metropolitan City",
		district: "Kathmandu",
		province: "Bagmati Province",
		isDefault: false,
		notes: "Office building, 3rd floor",
	},
]

export default function CheckoutPage() {
	const [selectedAddress, setSelectedAddress] = useState<Address>(savedAddresses[0])
	const [paymentMethod, setPaymentMethod] = useState("cod")
	const [agreeTerms, setAgreeTerms] = useState(false)

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
	const deliveryFee = subtotal > 1000 ? 0 : 50
	const total = subtotal + deliveryFee

	const handlePlaceOrder = () => {
		if (!agreeTerms) {
			alert("Please agree to the terms and conditions")
			return
		}
		// Mock order placement
		alert("Order placed successfully!")
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
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
					{/* Checkout Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Delivery Address */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Truck className="h-5 w-5" />
									<span>Delivery Address</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<AddressSelector
									addresses={savedAddresses}
									selectedAddressId={selectedAddress?.id}
									onAddressSelect={setSelectedAddress}
									onAddNewAddress={() => {
										// Handle add new address
										console.log("Add new address")
									}}
								/>
							</CardContent>
						</Card>

						{/* Payment Method */}
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

						{/* Terms and Conditions */}
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

					{/* Order Summary */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{cartItems.map((item) => (
									<div key={item.id} className="flex items-center justify-between">
										<div className="flex-1">
											<p className="font-medium">{item.name}</p>
											<p className="text-sm text-muted-foreground">
												by {item.farmer} • {item.quantity} {item.unit}
											</p>
										</div>
										<span className="font-medium">Rs. {item.price * item.quantity}</span>
									</div>
								))}

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>Rs. {subtotal}</span>
									</div>
									<div className="flex justify-between">
										<span>Delivery fee</span>
										<span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
									</div>
									<Separator />
									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span>Rs. {total}</span>
									</div>
								</div>

								<Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={!agreeTerms}>
									Place Order
								</Button>
							</CardContent>
						</Card>

						{/* Delivery Info */}
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
