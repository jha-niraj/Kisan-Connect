"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sprout, TrendingUp, Users, Shield, BarChart3, Leaf, Sun, Droplets } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const benefits = [
	{
		icon: <TrendingUp className="h-8 w-8 text-green-600" />,
		title: "Better Prices",
		description: "Get fair prices by selling directly to consumers and contractors"
	},
	{
		icon: <Users className="h-8 w-8 text-green-600" />,
		title: "Direct Market Access",
		description: "Connect with buyers without middlemen taking your profits"
	},
	{
		icon: <Shield className="h-8 w-8 text-green-600" />,
		title: "Secure Payments",
		description: "Get guaranteed payments for your crops with our secure platform"
	},
	{
		icon: <BarChart3 className="h-8 w-8 text-green-600" />,
		title: "Market Insights",
		description: "Access real-time market prices and demand forecasting"
	}
]

const features = [
	{
		title: "Easy Product Listing",
		description: "List your crops with photos and descriptions in minutes",
		icon: <Leaf className="h-6 w-6" />
	},
	{
		title: "Live Bidding",
		description: "Create auctions and let buyers compete for your best produce",
		icon: <TrendingUp className="h-6 w-6" />
	},
	{
		title: "Analytics Dashboard",
		description: "Track your sales, earnings, and popular products",
		icon: <BarChart3 className="h-6 w-6" />
	},
	{
		title: "Weather Updates",
		description: "Get farming advice based on local weather conditions",
		icon: <Sun className="h-6 w-6" />
	}
]

const testimonials = [
	{
		name: "Ram Bahadur Thapa",
		location: "Chitwan",
		image: "/placeholder-user.jpg",
		quote: "KisanConnect ले मेरो आम्दानी ३०% बढाएको छ। अब म सिधै ग्राहकहरूलाई बेच्न सक्छु।",
		translation: "KisanConnect has increased my income by 30%. Now I can sell directly to customers."
	},
	{
		name: "Sita Kumari Shrestha",
		location: "Kavre",
		image: "/placeholder-user.jpg",
		quote: "बिडिङ सिस्टमले मेरा उत्पादनहरूका लागि राम्रो मूल्य पाउन मद्दत गर्यो।",
		translation: "The bidding system helped me get better prices for my products."
	},
	{
		name: "Krishna Magar",
		location: "Dolakha",
		image: "/placeholder-user.jpg",
		quote: "यो प्लेटफर्म प्रयोग गर्न सजिलो छ र मेरो समय बचत गर्छ।",
		translation: "This platform is easy to use and saves my time."
	}
]

export default function FarmerLandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-gray-900 dark:to-emerald-950">
			{/* Navigation */}
			<nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-200 dark:border-green-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
								<span className="text-white font-bold text-sm">K</span>
							</div>
							<span className="text-xl font-bold text-gray-900 dark:text-white">KisanConnect</span>
							<Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
								For Farmers
							</Badge>
						</div>
						<div className="flex space-x-4">
							<Link href="/signin?ref=farmer">
								<Button variant="outline" className="border-green-200 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900">
									Sign In
								</Button>
							</Link>
							<Link href="/signup?ref=farmer">
								<Button className="bg-green-600 hover:bg-green-700">
									Get Started
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
								<Sprout className="mr-2 h-4 w-4" />
								Digital Agriculture
							</Badge>
							<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
								Grow Your Income with
								<span className="text-green-600"> KisanConnect</span>
							</h1>
							<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
								Join Nepal&apos;s largest agricultural marketplace. Sell directly to consumers, participate in live auctions, and get fair prices for your hard work. Transform your farming into a profitable business.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/signup?ref=farmer">
									<Button size="lg" className="bg-green-600 hover:bg-green-700">
										Start Selling
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/products">
									<Button size="lg" variant="outline" className="border-green-200 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900">
										See Success Stories
									</Button>
								</Link>
							</div>
							<div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">5,000+</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Active Farmers</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">₹50L+</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Earned by Farmers</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Farmer Satisfaction</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative"
						>
							<div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
								<div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
									<Sprout className="h-8 w-8 text-white" />
								</div>
								<Image
									src="/placeholder.svg?height=400&width=500"
									alt="Farmer using app"
									width={500}
									height={400}
									className="rounded-lg w-full"
								/>
							</div>
							{/* Floating elements */}
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{ duration: 3, repeat: Infinity }}
								className="absolute -top-6 -left-6 bg-green-100 dark:bg-green-900 p-3 rounded-xl shadow-lg"
							>
								<Sun className="h-6 w-6 text-green-600" />
							</motion.div>
							<motion.div
								animate={{ y: [0, 10, 0] }}
								transition={{ duration: 3, repeat: Infinity, delay: 1 }}
								className="absolute -bottom-6 -right-6 bg-blue-100 dark:bg-blue-900 p-3 rounded-xl shadow-lg"
							>
								<Droplets className="h-6 w-6 text-blue-600" />
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-white/50 dark:bg-gray-900/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Why Choose KisanConnect?
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Join thousands of farmers who have transformed their agricultural business with our platform
						</p>
					</motion.div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: index * 0.1 }}
							>
								<Card className="text-center h-full hover:shadow-lg transition-shadow">
									<CardContent className="p-6">
										<div className="flex justify-center mb-4">
											{benefit.icon}
										</div>
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
											{benefit.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-300">
											{benefit.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Powerful Features for Modern Farmers
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Everything you need to succeed in today&apos;s agricultural market
						</p>
					</motion.div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: index * 0.1 }}
							>
								<Card className="h-full hover:shadow-lg transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-center space-x-3 mb-4">
											<div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
												{feature.icon}
											</div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{feature.title}
											</h3>
										</div>
										<p className="text-gray-600 dark:text-gray-300">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-green-50 dark:bg-green-950">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Success Stories from Our Farmers
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Hear from farmers who have transformed their lives with KisanConnect
						</p>
					</motion.div>
					<div className="grid md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: index * 0.2 }}
							>
								<Card className="h-full">
									<CardContent className="p-6">
										<div className="flex items-center space-x-4 mb-4">
											<Image
												src={testimonial.image}
												alt={testimonial.name}
												width={48}
												height={48}
												className="rounded-full"
											/>
											<div>
												<h4 className="font-semibold text-gray-900 dark:text-white">
													{testimonial.name}
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{testimonial.location}
												</p>
											</div>
										</div>
										<blockquote className="text-gray-700 dark:text-gray-300 mb-2">
											&quot;{testimonial.quote}&quot;
										</blockquote>
										<p className="text-sm text-gray-500 dark:text-gray-500 italic">
											{testimonial.translation}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h2 className="text-3xl lg:text-4xl font-bold mb-4">
							Ready to Transform Your Farming Business?
						</h2>
						<p className="text-xl mb-8 max-w-2xl mx-auto">
							Join KisanConnect today and start earning better prices for your crops. 
							Setup takes less than 5 minutes.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup?ref=farmer">
								<Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
									Start Selling Today
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/products">
								<Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
									See Live Prices
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
									<span className="text-white font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold">KisanConnect</span>
							</div>
							<p className="text-gray-400">
								Empowering farmers across Nepal with digital tools and direct market access.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">For Farmers</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/signup" className="hover:text-white">Join as Farmer</Link></li>
								<li><Link href="/farmer/dashboard" className="hover:text-white">Dashboard</Link></li>
								<li><Link href="/farmer/products/new" className="hover:text-white">List Products</Link></li>
								<li><Link href="/farmer/auctions" className="hover:text-white">Start Auction</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/help" className="hover:text-white">Help Center</Link></li>
								<li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
								<li><Link href="/guides" className="hover:text-white">Farmer Guides</Link></li>
								<li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/about" className="hover:text-white">About Us</Link></li>
								<li><Link href="/blog" className="hover:text-white">Blog</Link></li>
								<li><Link href="/careers" className="hover:text-white">Careers</Link></li>
								<li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 KisanConnect. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
