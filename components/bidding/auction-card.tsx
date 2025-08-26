"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users, Gavel, MapPin } from "lucide-react"
import Image from "next/image"

interface AuctionCardProps {
	auction: {
		id: number
		product: string
		farmer: string
		location: string
		category: string
		startPrice: number
		currentBid: number
		bidders: number
		timeLeft: string
		endTime: Date
		image: string
		description: string
		minIncrement: number
		totalBids: number
		isOrganic: boolean
		rating: number
	}
	onBid?: (auctionId: number) => void
	variant?: "live" | "upcoming"
}

export function AuctionCard({ auction, onBid, variant = "live" }: AuctionCardProps) {
	const [timeLeft, setTimeLeft] = useState("")

	useEffect(() => {
		if (variant === "live") {
			const timer = setInterval(() => {
				const now = new Date()
				const diff = auction.endTime.getTime() - now.getTime()

				if (diff <= 0) {
					setTimeLeft("Ended")
					return
				}

				const hours = Math.floor(diff / (1000 * 60 * 60))
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
				const seconds = Math.floor((diff % (1000 * 60)) / 1000)

				if (hours > 0) {
					setTimeLeft(`${hours}h ${minutes}m`)
				} else if (minutes > 0) {
					setTimeLeft(`${minutes}m ${seconds}s`)
				} else {
					setTimeLeft(`${seconds}s`)
				}
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [auction.endTime, variant])

	const getTimeLeftColor = () => {
		if (variant !== "live") return "text-muted-foreground"

		const now = new Date()
		const diff = auction.endTime.getTime() - now.getTime()
		const minutes = diff / (1000 * 60)

		if (minutes <= 5) return "text-red-600"
		if (minutes <= 30) return "text-orange-600"
		return "text-green-600"
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			whileHover={{ y: -2 }}
		>
			<Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 overflow-hidden">
				<div className="relative">
					<Image
						src={auction.image || "/placeholder.svg"}
						alt={auction.product}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						height={192}
						width={192}
					/>
					<div className="absolute top-3 left-3 flex gap-2">
						{auction.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
						{variant === "live" && (
							<Badge variant="destructive" className="animate-pulse">
								LIVE
							</Badge>
						)}
						{variant === "upcoming" && <Badge variant="secondary">Upcoming</Badge>}
					</div>
					<div className="absolute top-3 right-3">
						<Badge variant="outline" className="bg-white/90">
							<Clock className="w-3 h-3 mr-1" />
							<span className={getTimeLeftColor()}>{variant === "live" ? timeLeft : auction.timeLeft}</span>
						</Badge>
					</div>
				</div>
				<CardContent className="p-4">
					<div className="space-y-3">
						<div>
							<h3 className="font-semibold text-lg">{auction.product}</h3>
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<span>by {auction.farmer}</span>
								<span>•</span>
								<div className="flex items-center space-x-1">
									<MapPin className="w-3 h-3" />
									<span>{auction.location}</span>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-medium">{auction.rating}</span>
						</div>
						<p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									{variant === "live" ? "Current Bid" : "Starting Price"}
								</span>
								<span className="text-xl font-bold text-primary">
									Rs. {variant === "live" ? auction.currentBid : auction.startPrice}
								</span>
							</div>
							{
								variant === "live" && (
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center space-x-1">
											<Users className="w-3 h-3" />
											<span className="text-muted-foreground">{auction.bidders} bidders</span>
										</div>
										<span className="text-muted-foreground">{auction.totalBids} total bids</span>
									</div>
								)
							}
						</div>
						<Button
							className="w-full"
							onClick={() => onBid?.(auction.id)}
							variant={variant === "upcoming" ? "outline" : "default"}
						>
							{
								variant === "live" ? (
									<>
										<Gavel className="w-4 h-4 mr-2" />
										Place Bid
									</>
								) : (
									<>
										<Clock className="w-4 h-4 mr-2" />
										Set Reminder
									</>
								)
							}
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}