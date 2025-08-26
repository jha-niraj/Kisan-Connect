"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building2, TrendingUp, Users, Gavel, BarChart3, Shield, Globe, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const benefits = [
	{
		icon: <Gavel className="h-8 w-8 text-orange-600" />,
		title: "Live Auctions",
		description: "Participate in live auctions and bid on high-quality agricultural products"
	},
	{
		icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
		title: "Bulk Purchasing",
		description: "Purchase large quantities directly from farmers at competitive prices"
	},
	{
		icon: <Users className="h-8 w-8 text-orange-600" />,
		title: "Farmer Network",
		description: "Build relationships with farmers and secure consistent supply chains"
	},
	{
		icon: <Globe className="h-8 w-8 text-orange-600" />,
		title: "Market Access",
		description: "Connect farmers' produce with larger markets and distribution networks"
	}
]

const features = [
	{
		title: "Smart Bidding",
		description: "Advanced bidding system with real-time market data and pricing insights",
		icon: <Gavel className="h-6 w-6" />
	},
	{
		title: "Supply Chain Management",
		description: "Manage your agricultural supply chain from farm to market efficiently",
		icon: <Truck className="h-6 w-6" />
	},
	{
		title: "Market Analytics",
		description: "Access detailed market trends, pricing data, and demand forecasting",
		icon: <BarChart3 className="h-6 w-6" />
	},
	{
		title: "Quality Assurance",
		description: "Ensure product quality with our verification and rating system",
		icon: <Shield className="h-6 w-6" />
	}
]

export default function ContractorLandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
			<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
								<span className="text-white font-bold text-sm">K</span>
							</div>
							<span className="text-xl font-bold text-gray-900">KisanConnect</span>
							<Badge variant="secondary" className="bg-orange-100 text-orange-800">For Contractors</Badge>
						</div>
						<div className="flex space-x-4">
							<Link href="/signin?ref=contractor">
								<Button variant="outline">Sign In</Button>
							</Link>
							<Link href="/signup?ref=contractor">
								<Button className="bg-orange-600 hover:bg-orange-700">
									Get Started
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">
								<Building2 className="mr-2 h-4 w-4" />
								Agricultural Contracting
							</Badge>
							<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
								Connect Markets with
								<span className="text-orange-600"> KisanConnect</span>
							</h1>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Bridge the gap between farmers and larger markets. Participate in live auctions, purchase crops in bulk, and build sustainable agricultural supply chains across Nepal.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/signup?ref=contractor">
									<Button size="lg" className="bg-orange-600 hover:bg-orange-700">
										Start Contracting
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/bidding">
									<Button size="lg" variant="outline">
										View Live Auctions
									</Button>
								</Link>
							</div>
							<div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-200">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">150+</div>
									<div className="text-sm text-gray-600">Active Contractors</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">₹2Cr+</div>
									<div className="text-sm text-gray-600">Crops Contracted</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">92%</div>
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
								<div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
									<Building2 className="h-8 w-8 text-white" />
								</div>
								<Image
									src="/placeholder.svg?height=400&width=500"
									alt="Contractor dashboard"
									width={500}
									height={400}
									className="rounded-lg w-full"
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Why Choose KisanConnect for Contracting?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Access Nepal&apos;s largest network of farmers and agricultural products
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{
							benefits.map((benefit, index) => (
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
							))
						}
					</div>
				</div>
			</section>
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Advanced Contracting Tools
						</h2>
						<p className="text-xl text-gray-600">
							Everything you need to succeed as an agricultural contractor
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{
							features.map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="flex items-start space-x-4"
								>
									<div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
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
							))
						}
					</div>
				</div>
			</section>
			<section className="py-20 bg-orange-600">
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
							Ready to Scale Your Agricultural Business?
						</h2>
						<p className="text-xl text-orange-100 mb-8">
							Join KisanConnect and start connecting farmers with markets today
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup?ref=contractor">
								<Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
									Become a Contractor
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/contact">
								<Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
									Contact Sales
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</section>
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
									<span className="text-white font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold">KisanConnect</span>
							</div>
							<p className="text-gray-400 mb-4">
								Connecting agricultural markets across Nepal
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">For Contractors</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/contractor/guide" className="hover:text-white">Contractor Guide</Link></li>
								<li><Link href="/contractor/requirements" className="hover:text-white">Requirements</Link></li>
								<li><Link href="/contractor/success" className="hover:text-white">Success Stories</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/help" className="hover:text-white">Help Center</Link></li>
								<li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
								<li><Link href="/training" className="hover:text-white">Training Programs</Link></li>
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