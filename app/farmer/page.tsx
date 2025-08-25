"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sprout, TrendingUp, Users, DollarSign, BarChart3, Tractor, Package, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const benefits = [
	{
		icon: <DollarSign className="h-8 w-8 text-green-600" />,
		title: "Direct Sales",
		description: "Sell directly to consumers and get better prices for your produce"
	},
	{
		icon: <BarChart3 className="h-8 w-8 text-green-600" />,
		title: "Market Analytics",
		description: "Get insights into market trends and pricing to maximize your profits"
	},
	{
		icon: <Globe className="h-8 w-8 text-green-600" />,
		title: "Wider Reach",
		description: "Connect with buyers across Nepal and expand your market reach"
	},
	{
		icon: <Users className="h-8 w-8 text-green-600" />,
		title: "Community Support",
		description: "Join a community of farmers and share knowledge and experiences"
	}
]

const features = [
	{
		title: "List Your Products",
		description: "Easily list your agricultural products with photos and descriptions",
		icon: <Package className="h-6 w-6" />
	},
	{
		title: "Auction System",
		description: "Participate in live auctions to get the best price for your crops",
		icon: <Tractor className="h-6 w-6" />
	},
	{
		title: "Direct Messaging",
		description: "Communicate directly with buyers and contractors",
		icon: <Users className="h-6 w-6" />
	},
	{
		title: "Payment Security",
		description: "Secure payment processing ensures you get paid on time",
		icon: <DollarSign className="h-6 w-6" />
	}
]

export default function FarmerLandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
			{/* Header */}
			<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
								<span className="text-white font-bold text-sm">K</span>
							</div>
							<span className="text-xl font-bold text-gray-900">KisanConnect</span>
							<Badge variant="secondary" className="bg-green-100 text-green-800">For Farmers</Badge>
						</div>
						<div className="flex space-x-4">
							<Link href="/signin?ref=farmer">
								<Button variant="outline">Sign In</Button>
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
							<Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
								<Sprout className="mr-2 h-4 w-4" />
								Empowering Farmers
							</Badge>
							<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
								Grow Your Farm Business with
								<span className="text-green-600"> KisanConnect</span>
							</h1>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Connect directly with buyers, participate in live auctions, and get the best prices for your agricultural products. Join thousands of farmers already growing their business with KisanConnect.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/signup?ref=farmer">
									<Button size="lg" className="bg-green-600 hover:bg-green-700">
										Start Selling Today
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/products">
									<Button size="lg" variant="outline">
										See Success Stories
									</Button>
								</Link>
							</div>
							<div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-200">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">2,500+</div>
									<div className="text-sm text-gray-600">Active Farmers</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">₹50L+</div>
									<div className="text-sm text-gray-600">Revenue Generated</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">95%</div>
									<div className="text-sm text-gray-600">Success Rate</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative"
						>
							<div className="relative bg-white rounded-2xl shadow-2xl p-8">
								<div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
									<Tractor className="h-8 w-8 text-white" />
								</div>
								<Image
									src="/placeholder.svg?height=400&width=500"
									alt="Farmer using KisanConnect"
									width={500}
									height={400}
									className="rounded-lg w-full"
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Why Choose KisanConnect?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Join the digital revolution in agriculture and take your farming business to the next level
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card className="h-full hover:shadow-lg transition-shadow">
									<CardContent className="p-6 text-center">
										<div className="flex justify-center mb-4">
											{benefit.icon}
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-2">
											{benefit.title}
										</h3>
										<p className="text-gray-600">
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
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Powerful Features for Farmers
						</h2>
						<p className="text-xl text-gray-600">
							Everything you need to manage and grow your agricultural business
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								className="flex items-start space-x-4"
							>
								<div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
									{feature.icon}
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-green-600">
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
							Ready to Transform Your Farming Business?
						</h2>
						<p className="text-xl text-green-100 mb-8">
							Join KisanConnect today and start connecting with buyers across Nepal
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup?ref=farmer">
								<Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
									Start Your Journey
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/contact">
								<Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
									Contact Support
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
							<p className="text-gray-400 mb-4">
								Connecting farmers with opportunities across Nepal
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">For Farmers</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/farmer/guide" className="hover:text-white">Getting Started</Link></li>
								<li><Link href="/farmer/pricing" className="hover:text-white">Pricing</Link></li>
								<li><Link href="/farmer/success" className="hover:text-white">Success Stories</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/help" className="hover:text-white">Help Center</Link></li>
								<li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
								<li><Link href="/tutorials" className="hover:text-white">Video Tutorials</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/about" className="hover:text-white">About Us</Link></li>
								<li><Link href="/careers" className="hover:text-white">Careers</Link></li>
								<li><Link href="/press" className="hover:text-white">Press</Link></li>
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
