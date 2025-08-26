"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, X, ArrowLeft, CalendarIcon, Clock, Gavel } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"

const categories = ["Fruits", "Vegetables", "Grains & Rice", "Spices", "Honey", "Dairy", "Herbs", "Nuts & Seeds"]
const units = ["kg", "gram", "piece", "bundle", "bottle", "packet", "liter"]
const durations = [
	{ label: "1 Hour", value: 1 },
	{ label: "2 Hours", value: 2 },
	{ label: "6 Hours", value: 6 },
	{ label: "12 Hours", value: 12 },
	{ label: "24 Hours", value: 24 },
	{ label: "48 Hours", value: 48 },
	{ label: "72 Hours", value: 72 },
]

export default function CreateAuction() {
	const [images, setImages] = useState<string[]>([])
	const [startDate, setStartDate] = useState<Date>()
	const [startTime, setStartTime] = useState("")
	const [duration, setDuration] = useState("")
	const [governmentRate, setGovernmentRate] = useState("")
	const [startingPrice, setStartingPrice] = useState("")
	const [minIncrement, setMinIncrement] = useState("")
	const [isOrganic, setIsOrganic] = useState(false)
	const [reservePrice, setReservePrice] = useState("")
	const [hasReservePrice, setHasReservePrice] = useState(false)

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			const newImages = Array.from(files).map(() => "/placeholder.svg?height=200&width=200")
			setImages([...images, ...newImages])
		}
	}

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index))
	}

	const calculateSuggestedStartPrice = () => {
		if (governmentRate) {
			const rate = Number.parseFloat(governmentRate)
			return Math.floor(rate * 0.8) // Start 20% below government rate
		}
		return 0
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex items-center space-x-4 mb-8">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/farmer/dashboard">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Link>
					</Button>
					<div>
						<h1 className="font-serif text-3xl font-bold">Create Auction</h1>
						<p className="text-muted-foreground">Set up a live bidding auction for your premium products</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Product Information */}
						<Card>
							<CardHeader>
								<CardTitle>Product Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="productName">Product Name *</Label>
										<Input id="productName" placeholder="e.g., Premium Cardamom" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="category">Category *</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category} value={category.toLowerCase()}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description *</Label>
									<Textarea
										id="description"
										placeholder="Describe your product quality, origin, special features..."
										rows={4}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="quantity">Quantity *</Label>
										<Input id="quantity" type="number" placeholder="50" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="unit">Unit *</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select unit" />
											</SelectTrigger>
											<SelectContent>
												{units.map((unit) => (
													<SelectItem key={unit} value={unit}>
														{unit}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox 
										id="organic" 
										checked={isOrganic} 
										onCheckedChange={(checked) => setIsOrganic(checked === true)} 
									/>
									<Label htmlFor="organic">This is an organic product</Label>
								</div>
							</CardContent>
						</Card>

						{/* Auction Settings */}
						<Card>
							<CardHeader>
								<CardTitle>Auction Settings</CardTitle>
								<p className="text-sm text-muted-foreground">Configure your auction timing and pricing</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Start Date *</Label>
										<Popover>
											<PopoverTrigger>
												<Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
													<CalendarIcon className="mr-2 h-4 w-4" />
													{startDate ? format(startDate, "PPP") : "Pick a date"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
											</PopoverContent>
										</Popover>
									</div>
									<div className="space-y-2">
										<Label htmlFor="startTime">Start Time *</Label>
										<Input
											id="startTime"
											type="time"
											value={startTime}
											onChange={(e) => setStartTime(e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="duration">Auction Duration *</Label>
									<Select value={duration} onValueChange={setDuration}>
										<SelectTrigger>
											<SelectValue placeholder="Select duration" />
										</SelectTrigger>
										<SelectContent>
											{durations.map((dur) => (
												<SelectItem key={dur.value} value={dur.value.toString()}>
													{dur.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="govRate">Government Rate (Rs.) *</Label>
										<Input
											id="govRate"
											type="number"
											placeholder="2000"
											value={governmentRate}
											onChange={(e) => setGovernmentRate(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="startPrice">Starting Price (Rs.) *</Label>
										<Input
											id="startPrice"
											type="number"
											placeholder={calculateSuggestedStartPrice().toString()}
											value={startingPrice}
											onChange={(e) => setStartingPrice(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">
											Suggested: Rs. {calculateSuggestedStartPrice()} (20% below govt. rate)
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="minIncrement">Min Bid Increment (Rs.) *</Label>
										<Input
											id="minIncrement"
											type="number"
											placeholder="50"
											value={minIncrement}
											onChange={(e) => setMinIncrement(e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Checkbox 
											id="reservePrice" 
											checked={hasReservePrice} 
											onCheckedChange={(checked) => setHasReservePrice(checked === true)} 
										/>
										<Label htmlFor="reservePrice">Set a reserve price (minimum selling price)</Label>
									</div>
									{hasReservePrice && (
										<div className="space-y-2">
											<Label htmlFor="reserve">Reserve Price (Rs.)</Label>
											<Input
												id="reserve"
												type="number"
												placeholder="1800"
												value={reservePrice}
												onChange={(e) => setReservePrice(e.target.value)}
											/>
											<p className="text-xs text-muted-foreground">
												The auction will only complete if the final bid meets or exceeds this price
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Images */}
						<Card>
							<CardHeader>
								<CardTitle>Product Images</CardTitle>
								<p className="text-sm text-muted-foreground">
									Upload high-quality images to attract more bidders (max 5 images)
								</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{images.map((image, index) => (
										<div key={index} className="relative group">
											<Image
												src={image || "/placeholder.svg"}
												alt={`Product ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg border"
												height={32}
												width={32}
											/>
											<Button
												variant="destructive"
												size="sm"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() => removeImage(index)}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}

									{images.length < 5 && (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
											<Upload className="h-8 w-8 text-muted-foreground mb-2" />
											<span className="text-sm text-muted-foreground">Upload Image</span>
											<input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
										</label>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Preview */}
						<Card>
							<CardHeader>
								<CardTitle>Auction Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
										{images.length > 0 ? (
											<Image
												src={images[0] || "/placeholder.svg"}
												alt="Product preview"
												className="w-full h-full object-cover rounded-lg"
												height={32}
												width={32}
											/>
										) : (
											<span className="text-muted-foreground">No image uploaded</span>
										)}
									</div>

									<div className="space-y-2">
										<h3 className="font-semibold">Product Name</h3>
										<div className="flex items-center space-x-2">
											{isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
											<Badge variant="outline">Auction</Badge>
										</div>
										<div className="space-y-1">
											<p className="text-sm text-muted-foreground">Starting Price</p>
											<p className="text-lg font-bold text-primary">
												Rs. {startingPrice || calculateSuggestedStartPrice()}
											</p>
										</div>
										{duration && (
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{durations.find((d) => d.value.toString() === duration)?.label} duration</span>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3">
									<Button className="w-full" size="lg">
										<Gavel className="h-4 w-4 mr-2" />
										Create Auction
									</Button>
									<Button variant="outline" className="w-full bg-transparent">
										Save as Draft
									</Button>
									<Button variant="ghost" className="w-full" asChild>
										<Link href="/farmer/dashboard">Cancel</Link>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Auction Tips */}
						<Card>
							<CardHeader>
								<CardTitle className="text-sm">Auction Tips</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<p>• Start with attractive pricing to draw bidders</p>
								<p>• Use high-quality, well-lit photos</p>
								<p>• Write detailed, honest descriptions</p>
								<p>• Set reasonable auction duration</p>
								<p>• Respond to bidder questions quickly</p>
								<p>• Consider peak hours for better visibility</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
