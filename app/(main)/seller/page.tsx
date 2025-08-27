"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	ArrowRight, Store, TrendingUp, Users, ShoppingCart, Package, Star, BarChart3
} from "lucide-react"
import Link from "next/link"

const benefits = [
	{
		icon: <Store className="h-8 w-8 text-blue-600" />,
		title: "Easy Store Setup",
		description: "Create your online store in minutes with our intuitive platform"
	},
	{
		icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
		title: "Sales Analytics",
		description: "Track your performance with detailed analytics and insights"
	},
	{
		icon: <Users className="h-8 w-8 text-blue-600" />,
		title: "Customer Reach",
		description: "Connect with customers across Nepal and grow your business"
	},
	{
		icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
		title: "Secure Payments",
		description: "Accept payments safely with our integrated payment system"
	}
]

const features = [
	{
		title: "Product Management",
		description: "Easily add, edit, and manage your product catalog with rich media support",
		icon: <Package className="h-6 w-6" />
	},
	{
		title: "Inventory Tracking",
		description: "Keep track of your stock levels and get notified when items are running low",
		icon: <BarChart3 className="h-6 w-6" />
	},
	{
		title: "Customer Communications",
		description: "Chat directly with customers and provide excellent customer service",
		icon: <Users className="h-6 w-6" />
	},
	{
		title: "Marketing Tools",
		description: "Promote your products with built-in marketing and promotional features",
		icon: <TrendingUp className="h-6 w-6" />
	}
]

export default function SellerLanding() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-neutral-900">
			<div className="max-w-7xl mx-auto">
				<section className="pt-20 pb-16 px-6">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="space-y-8"
						>
							<div className="space-y-4">
								<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
									<Store className="h-4 w-4 mr-2" />
									For Sellers
								</Badge>
								<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
									Start Your <span className="text-blue-600">Online Store</span> Today
								</h1>
								<p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
									Build a thriving agricultural business with our comprehensive e-commerce platform. Reach more customers, increase sales, and grow your revenue with KisanConnect.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg" asChild>
									<Link href="/signup?ref=seller">
										Start Selling Free
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" className="px-8 py-4 text-lg border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
									<Link href="/signin">
										Seller Dashboard
									</Link>
								</Button>
							</div>
							<div className="grid grid-cols-3 gap-6 pt-8">
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-600">2000+</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Active Sellers</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-600">₹5M+</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Monthly Sales</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-600">95%</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative"
						>
							<div className="relative z-10">
								<div className="w-full h-96 bg-blue-100 dark:bg-blue-900 rounded-2xl shadow-2xl flex items-center justify-center">
									<div className="text-center p-8">
										<Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
										<p className="text-blue-800 dark:text-blue-200">Your Digital Storefront</p>
									</div>
								</div>
								<div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
									<div className="flex items-center space-x-3">
										<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
											<TrendingUp className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<div className="font-semibold">Average Sales Growth</div>
											<div className="text-2xl font-bold text-blue-600">+65%</div>
										</div>
									</div>
								</div>
							</div>
							<div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 -z-10"></div>
						</motion.div>
					</div>
				</section>
				<section className="py-20 px-6">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
						>
							Why Sell on KisanConnect?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
						>
							Join successful sellers who are growing their business with our platform
						</motion.p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{
							benefits.map((benefit, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card className="h-full hover:shadow-lg transition-shadow">
										<CardContent className="p-6 text-center">
											<div className="mb-4 flex justify-center">
												{benefit.icon}
											</div>
											<h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
											<p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
										</CardContent>
									</Card>
								</motion.div>
							))
						}
					</div>
				</section>
				<section className="py-20 px-6 bg-blue-50 dark:bg-blue-950/20 rounded-3xl mx-6">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
						>
							Powerful Selling Tools
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
						>
							Everything you need to run a successful online agricultural business
						</motion.p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{
							features.map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									className="flex items-start space-x-4"
								>
									<div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
										{feature.icon}
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
										<p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
									</div>
								</motion.div>
							))
						}
					</div>
				</section>
				<section className="py-20 px-6">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
						>
							Success Stories
						</motion.h2>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{
							[
								{
									name: "Aarti Enterprises",
									location: "Kathmandu",
									text: "Our online sales tripled within 6 months of joining KisanConnect. The platform is incredibly user-friendly!",
									rating: 5
								},
								{
									name: "Nepal Organic Store",
									location: "Pokhara",
									text: "Best platform for agricultural businesses. The analytics help us make better decisions.",
									rating: 5
								},
								{
									name: "Fresh Valley Products",
									location: "Biratnagar",
									text: "Customer support is amazing and the payment system is very reliable.",
									rating: 5
								}
							].map((testimonial, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card className="p-6">
										<CardContent className="space-y-4">
											<div className="flex space-x-1">
												{
													[...Array(testimonial.rating)].map((_, i) => (
														<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
													))
												}
											</div>
											<p className="text-gray-600 dark:text-gray-300">&quot;{testimonial.text}&quot;</p>
											<div>
												<p className="font-semibold">{testimonial.name}</p>
												<p className="text-sm text-gray-500">{testimonial.location}</p>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))
						}
					</div>
				</section>
				<section className="py-20 px-6">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="bg-blue-600 rounded-3xl p-12 text-center text-white"
					>
						<h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
						<p className="text-xl mb-8 opacity-90">Join thousands of successful sellers on KisanConnect</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
								<Link href="/signup?ref=seller">
									Start Selling Free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600" asChild>
								<Link href="/signin">
									Seller Login
								</Link>
							</Button>
						</div>
					</motion.div>
				</section>
			</div>
		</div>
	)
}