"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, ShieldCheck, Clock, Star, TrendingUp, Gavel } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredProducts = [
	{
		id: 1,
		name: "Organic Basmati Rice",
		farmer: "Ram Bahadur",
		location: "Chitwan",
		price: "Rs. 120",
		originalPrice: "Rs. 150",
		image: "/placeholder.svg?height=200&width=200",
		badge: "ORGANIC",
		rating: 4.8,
		inStock: true,
	},
	{
		id: 2,
		name: "Fresh Tomatoes",
		farmer: "Sita Devi",
		location: "Kavre",
		price: "Rs. 80",
		originalPrice: "Rs. 100",
		image: "/placeholder.svg?height=200&width=200",
		badge: "FRESH",
		rating: 4.9,
		inStock: true,
	},
	{
		id: 3,
		name: "Mountain Honey",
		farmer: "Tek Bahadur",
		location: "Mustang",
		price: "Rs. 800",
		originalPrice: "Rs. 1000",
		image: "/placeholder.svg?height=200&width=200",
		badge: "PREMIUM",
		rating: 5.0,
		inStock: false,
	},
	{
		id: 4,
		name: "Organic Spinach",
		farmer: "Kamala Devi",
		location: "Lalitpur",
		price: "Rs. 35",
		originalPrice: "Rs. 45",
		image: "/placeholder.svg?height=200&width=200",
		badge: "ORGANIC",
		rating: 4.7,
		inStock: true,
	},
	{
		id: 5,
		name: "Highland Potatoes",
		farmer: "Bir Bahadur",
		location: "Dolakha",
		price: "Rs. 55",
		originalPrice: "Rs. 70",
		image: "/placeholder.svg?height=200&width=200",
		badge: "PREMIUM",
		rating: 4.6,
		inStock: true,
	},
	{
		id: 6,
		name: "Fresh Cauliflower",
		farmer: "Gita Rai",
		location: "Chitwan",
		price: "Rs. 45",
		originalPrice: "Rs. 55",
		image: "/placeholder.svg?height=200&width=200",
		badge: "FRESH",
		rating: 4.5,
		inStock: true,
	},
]

const liveBids = [
	{
		id: 1,
		product: "Premium Cardamom",
		farmer: "Maya Sherpa",
		location: "Ilam",
		currentBid: "Rs. 2,500",
		timeLeft: "2h 15m",
		bidders: 12,
		image: "/placeholder.svg?height=150&width=150",
	},
	{
		id: 2,
		product: "Organic Potatoes",
		farmer: "Krishna Thapa",
		location: "Mustang",
		currentBid: "Rs. 45",
		timeLeft: "45m",
		bidders: 8,
		image: "/placeholder.svg?height=150&width=150",
	},
	{
		id: 3,
		product: "Wild Mushrooms",
		farmer: "Pemba Sherpa",
		location: "Solukhumbu",
		currentBid: "Rs. 450",
		timeLeft: "1h 30m",
		bidders: 15,
		image: "/placeholder.svg?height=150&width=150",
	},
]

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
				<div className="container mx-auto px-4 py-16 lg:py-24">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="space-y-6"
						>
							<div className="space-y-4">
								<Badge variant="secondary" className="w-fit">
									Fresh from Nepal&apos;s Farmers
								</Badge>
								<h1 className="font-serif text-4xl lg:text-6xl font-black text-foreground leading-tight">
									Fresh from
									<span className="text-primary"> #Kisan</span>
								</h1>
								<p className="text-lg text-muted-foreground max-w-md">
									Join us, elevate meals, and support 600+ local farmers with farm-fresh produce delivered to your
									doorstep. Experience authentic Nepali agriculture with transparent pricing and direct farmer
									connections.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button size="lg" className="text-base" asChild>
									<Link href="/products">
										Shop Fresh Products <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" className="text-base bg-transparent" asChild>
									<Link href="/bidding">Join Live Bidding</Link>
								</Button>
							</div>
							<div className="flex items-center space-x-6 pt-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">600+</div>
									<div className="text-sm text-muted-foreground">Farmers</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">7</div>
									<div className="text-sm text-muted-foreground">Provinces</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">100%</div>
									<div className="text-sm text-muted-foreground">Authentic</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative"
						>
							<div className="relative rounded-2xl overflow-hidden">
								<Image
									src="/placeholder.svg?height=500&width=600"
									alt="Fresh produce from Nepal"
									className="w-full h-auto object-cover"
									height={500}
									width={600}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
								<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span className="text-sm font-medium">Live from farms</span>
									</div>
								</div>
								<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
									<div className="text-sm">
										<div className="font-medium">Government Rate Based</div>
										<div className="text-muted-foreground">Fair pricing guaranteed</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
								<Users className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-semibold text-lg">Direct from Farmers</h3>
							<p className="text-muted-foreground text-sm">
								Connect directly with farmers across all 7 provinces of Nepal. No middlemen, fair prices for everyone.
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
								<Gavel className="h-8 w-8 text-accent" />
							</div>
							<h3 className="font-semibold text-lg">Smart Bidding System</h3>
							<p className="text-muted-foreground text-sm">
								Participate in live auctions with government rate-based pricing. Transparent and fair for all
								participants.
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
								<ShieldCheck className="h-8 w-8 text-secondary" />
							</div>
							<h3 className="font-semibold text-lg">Quality Guarantee</h3>
							<p className="text-muted-foreground text-sm">
								100% authentic products with pickup from farmer&apos;s location or doorstep delivery across Nepal.
							</p>
						</motion.div>
					</div>
				</div>
			</section>
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-12">
						<h2 className="font-serif text-3xl font-bold">Our Fresh Products</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Browse our selection of farm-fresh products directly from Nepali farmers. All products are tested for
							quality and freshness with government rate-based pricing.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{
							featuredProducts.map((product, index) => (
								<motion.div
									key={product.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
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
											<Badge
												className="absolute top-3 left-3"
												variant={product.badge === "ORGANIC" ? "default" : "secondary"}
											>
												{product.badge}
											</Badge>
											{
												!product.inStock && (
													<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
														<Badge variant="destructive">Out of Stock</Badge>
													</div>
												)
											}
										</div>
										<CardContent className="p-4">
											<div className="space-y-2">
												<Link href={`/products/${product.id}`}>
													<h3 className="font-semibold hover:text-primary transition-colors">{product.name}</h3>
												</Link>
												<p className="text-sm text-muted-foreground">
													by {product.farmer} • {product.location}
												</p>
												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium">{product.rating}</span>
												</div>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														<span className="font-bold text-lg">{product.price}</span>
														<span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
													</div>
													<Button size="sm" disabled={!product.inStock} asChild>
														<Link href={`/products/${product.id}`}>
															{product.inStock ? "View Details" : "Out of Stock"}
														</Link>
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))
						}
					</div>
					<div className="text-center">
						<Button variant="outline" size="lg" asChild>
							<Link href="/products">
								View All Products <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-12">
						<div className="flex items-center justify-center space-x-2">
							<Gavel className="h-6 w-6 text-primary" />
							<h2 className="font-serif text-3xl font-bold">Live Bidding</h2>
						</div>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Participate in live auctions for premium products. Get the best deals directly from farmers with
							transparent, government rate-based pricing.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{
							liveBids.map((bid, index) => (
								<motion.div
									key={bid.id}
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
										<CardContent className="p-6">
											<div className="flex items-start space-x-4">
												<Image
													src={bid.image || "/placeholder.svg"}
													alt={bid.product}
													className="w-20 h-20 rounded-lg object-cover"
													height={80}
													width={80}
												/>
												<div className="flex-1 space-y-2">
													<div className="flex items-start justify-between">
														<div>
															<h3 className="font-semibold">{bid.product}</h3>
															<p className="text-sm text-muted-foreground">
																by {bid.farmer} • {bid.location}
															</p>
														</div>
														<Badge variant="outline" className="text-xs">
															<Clock className="w-3 h-3 mr-1" />
															{bid.timeLeft}
														</Badge>
													</div>
													<div className="flex items-center justify-between">
														<div>
															<p className="text-sm text-muted-foreground">Current Bid</p>
															<p className="text-xl font-bold text-primary">{bid.currentBid}</p>
														</div>
														<div className="text-right">
															<p className="text-sm text-muted-foreground">{bid.bidders} bidders</p>
															<Button size="sm" className="mt-1" asChild>
																<Link href="/bidding">Place Bid</Link>
															</Button>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))
						}
					</div>
					<div className="text-center">
						<Button size="lg" asChild>
							<Link href="/bidding">
								View All Live Auctions <TrendingUp className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-12">
						<h2 className="font-serif text-3xl font-bold">How It Works</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Simple steps to get fresh produce from Nepal&apos;s farmers directly to your doorstep
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">1</span>
							</div>
							<h3 className="font-semibold text-lg">Browse & Select</h3>
							<p className="text-muted-foreground text-sm">
								Browse fresh products from verified farmers across Nepal. Choose from regular shopping or participate in
								live bidding.
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">2</span>
							</div>
							<h3 className="font-semibold text-lg">Order & Pay</h3>
							<p className="text-muted-foreground text-sm">
								Place your order with transparent pricing based on government rates. Pay securely with multiple payment
								options.
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center space-y-4"
						>
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">3</span>
							</div>
							<h3 className="font-semibold text-lg">Receive Fresh</h3>
							<p className="text-muted-foreground text-sm">
								Get fresh produce delivered to your doorstep or pick up directly from the farmer&apos;s location.
							</p>
						</motion.div>
					</div>
				</div>
			</section>
			<section className="py-16 bg-gradient-to-r from-primary to-accent text-primary-foreground">
				<div className="container mx-auto px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-6"
					>
						<h2 className="font-serif text-3xl lg:text-4xl font-bold">Afterall, what we eat makes us</h2>
						<p className="text-lg opacity-90 max-w-2xl mx-auto">
							We like to bring people the food they deserve. Direct from farmers, with source traceability, doorstep
							delivery and quality you can trust. Join us in creating a space where everyone can access the fresh food
							they deserve. Let&apos;s make authentic Nepali produce accessible to all.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" variant="secondary" asChild>
								<Link href="/products">Start Shopping</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
								asChild
							>
								<Link href="/auth/register">Become a Farmer Partner</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
			<Footer />
		</div>
	)
}