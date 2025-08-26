"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { Upload, X, ArrowLeft, CalendarIcon, Clock, Gavel, Loader2 } from "lucide-react"
import Link from "next/link"
import { format, addHours } from "date-fns"
import Image from "next/image"
import { uploadToCloudinary } from "@/actions/(common)/utils.action"
import { createProductAndAuction } from "@/actions/(common)/auction.action"
import { ProductCategory } from "@prisma/client"

const categories = [
	{ label: "Grains", value: ProductCategory.GRAINS },
	{ label: "Vegetables", value: ProductCategory.VEGETABLES },
	{ label: "Fruits", value: ProductCategory.FRUITS },
	{ label: "Spices", value: ProductCategory.SPICES },
	{ label: "Dairy", value: ProductCategory.DAIRY },
	{ label: "Meat", value: ProductCategory.MEAT },
	{ label: "Legumes", value: ProductCategory.LEGUMES },
	{ label: "Herbs", value: ProductCategory.HERBS },
	{ label: "Organic", value: ProductCategory.ORGANIC },
	{ label: "Seeds", value: ProductCategory.SEEDS },
]

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
	const { data: session, status } = useSession()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	
	// Form state
	const [formData, setFormData] = useState({
		productName: "",
		category: "",
		description: "",
		quantity: "",
		unit: "",
		isOrganic: false,
		startDate: undefined as Date | undefined,
		startTime: "",
		duration: "",
		governmentRate: "",
		startingPrice: "",
		minIncrement: "",
		reservePrice: "",
		hasReservePrice: false,
	})
	
	const [images, setImages] = useState<File[]>([])
	const [imagesPreviews, setImagePreviews] = useState<string[]>([])
	const [isUploading, setIsUploading] = useState(false)

	// Role-based access control
	if (status === "loading") {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	if (!session) {
		router.push("/signin?redirect=/bidding/new")
		return null
	}

	if (session.user.role !== "FARMER" && session.user.role !== "ADMIN") {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="max-w-md mx-auto">
						<CardHeader>
							<CardTitle>Access Denied</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								Only farmers and administrators can create auctions.
							</p>
							<Button asChild>
								<Link href="/bidding">View Auctions</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
				<Footer />
			</div>
		)
	}

	const updateFormData = (field: string, value: string | boolean | Date | undefined) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files) return

		const newFiles = Array.from(files).slice(0, 5 - images.length)
		const newPreviews = newFiles.map(file => URL.createObjectURL(file))
		
		setImages(prev => [...prev, ...newFiles])
		setImagePreviews(prev => [...prev, ...newPreviews])
	}

	const removeImage = (index: number) => {
		// Revoke the object URL to free memory
		URL.revokeObjectURL(imagesPreviews[index])
		setImages(prev => prev.filter((_, i) => i !== index))
		setImagePreviews(prev => prev.filter((_, i) => i !== index))
	}

	const calculateSuggestedStartPrice = () => {
		if (formData.governmentRate) {
			const rate = Number.parseFloat(formData.governmentRate)
			return Math.floor(rate * 0.8) // Start 20% below government rate
		}
		return 0
	}

	const validateForm = () => {
		const requiredFields = [
			"productName", "category", "description", "quantity", "unit",
			"startDate", "startTime", "duration", "governmentRate", 
			"startingPrice", "minIncrement"
		]
		
		for (const field of requiredFields) {
			if (!formData[field as keyof typeof formData]) {
				toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
				return false
			}
		}

		if (images.length === 0) {
			toast.error("Please upload at least one product image")
			return false
		}

		if (formData.hasReservePrice && !formData.reservePrice) {
			toast.error("Please enter a reserve price")
			return false
		}

		return true
	}

	const handleSubmit = async () => {
		if (!validateForm()) return

		startTransition(async () => {
			try {
				setIsUploading(true)
				
				// Upload images to Cloudinary
				const uploadPromises = images.map(file => uploadToCloudinary(file))
				const imageResults = await Promise.all(uploadPromises)
				const imageUrls = imageResults.map(result => result.secure_url)
				
				// Prepare auction data
				const startDateTime = new Date(formData.startDate!)
				const [hours, minutes] = formData.startTime.split(":").map(Number)
				startDateTime.setHours(hours, minutes, 0, 0)
				
				const endDateTime = addHours(startDateTime, parseInt(formData.duration))
				
				const auctionData = {
					title: formData.productName,
					description: formData.description,
					category: formData.category as ProductCategory,
					images: imageUrls,
					quantity: parseFloat(formData.quantity),
					unit: formData.unit,
					isOrganic: formData.isOrganic,
					startingPrice: parseFloat(formData.startingPrice),
					currentPrice: parseFloat(formData.startingPrice),
					reservePrice: formData.hasReservePrice ? parseFloat(formData.reservePrice) : undefined,
					governmentRate: parseFloat(formData.governmentRate),
					minBidIncrement: parseFloat(formData.minIncrement),
					startTime: startDateTime,
					endTime: endDateTime,
				}
				
				const result = await createProductAndAuction(auctionData)
				
				if (result.success) {
					toast.success("Auction created successfully!")
					router.push(`/bidding?auction=${result.data?.id}`)
				} else {
					toast.error(result.error || "Failed to create auction")
				}
			} catch (error) {
				console.error("Error creating auction:", error)
				toast.error("Failed to create auction. Please try again.")
			} finally {
				setIsUploading(false)
			}
		})
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex items-center space-x-4 mb-8">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/bidding">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Auctions
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
										<Input 
											id="productName" 
											placeholder="e.g., Premium Cardamom"
											value={formData.productName}
											onChange={(e) => updateFormData("productName", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="category">Category *</Label>
										<Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.value} value={category.value}>
														{category.label}
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
										value={formData.description}
										onChange={(e) => updateFormData("description", e.target.value)}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="quantity">Quantity *</Label>
										<Input 
											id="quantity" 
											type="number" 
											placeholder="50"
											value={formData.quantity}
											onChange={(e) => updateFormData("quantity", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="unit">Unit *</Label>
										<Select value={formData.unit} onValueChange={(value) => updateFormData("unit", value)}>
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
										checked={formData.isOrganic} 
										onCheckedChange={(checked) => updateFormData("isOrganic", checked === true)} 
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
													{formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar 
													mode="single" 
													selected={formData.startDate} 
													onSelect={(date) => updateFormData("startDate", date)} 
													disabled={(date) => date < new Date()}
													initialFocus 
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="space-y-2">
										<Label htmlFor="startTime">Start Time *</Label>
										<Input
											id="startTime"
											type="time"
											value={formData.startTime}
											onChange={(e) => updateFormData("startTime", e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="duration">Auction Duration *</Label>
									<Select value={formData.duration} onValueChange={(value) => updateFormData("duration", value)}>
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
											value={formData.governmentRate}
											onChange={(e) => updateFormData("governmentRate", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="startPrice">Starting Price (Rs.) *</Label>
										<Input
											id="startPrice"
											type="number"
											placeholder={calculateSuggestedStartPrice().toString()}
											value={formData.startingPrice}
											onChange={(e) => updateFormData("startingPrice", e.target.value)}
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
											value={formData.minIncrement}
											onChange={(e) => updateFormData("minIncrement", e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Checkbox 
											id="reservePrice" 
											checked={formData.hasReservePrice} 
											onCheckedChange={(checked) => updateFormData("hasReservePrice", checked === true)} 
										/>
										<Label htmlFor="reservePrice">Set a reserve price (minimum selling price)</Label>
									</div>
									{formData.hasReservePrice && (
										<div className="space-y-2">
											<Label htmlFor="reserve">Reserve Price (Rs.)</Label>
											<Input
												id="reserve"
												type="number"
												placeholder="1800"
												value={formData.reservePrice}
												onChange={(e) => updateFormData("reservePrice", e.target.value)}
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
									{imagesPreviews.map((preview, index) => (
										<div key={index} className="relative group">
											<Image
												src={preview}
												alt={`Product ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg border"
												height={128}
												width={128}
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
											<input 
												type="file" 
												multiple 
												accept="image/*" 
												className="hidden" 
												onChange={handleImageUpload} 
												disabled={isUploading}
											/>
										</label>
									)}
								</div>
								
								<p className="text-sm text-muted-foreground">
									Upload up to 5 high-quality images. Supported formats: JPG, PNG, WEBP (max 5MB each)
								</p>
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
										{imagesPreviews.length > 0 ? (
											<Image
												src={imagesPreviews[0]}
												alt="Product preview"
												className="w-full h-full object-cover rounded-lg"
												height={200}
												width={200}
											/>
										) : (
											<span className="text-muted-foreground">No image uploaded</span>
										)}
									</div>

									<div className="space-y-2">
										<h3 className="font-semibold">{formData.productName || "Product Name"}</h3>
										<div className="flex items-center space-x-2">
											{formData.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
											<Badge variant="outline">Auction</Badge>
										</div>
										<div className="space-y-1">
											<p className="text-sm text-muted-foreground">Starting Price</p>
											<p className="text-lg font-bold text-primary">
												Rs. {formData.startingPrice || calculateSuggestedStartPrice()}
											</p>
										</div>
										{formData.duration && (
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{durations.find((d) => d.value.toString() === formData.duration)?.label} duration</span>
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
									<Button 
										className="w-full" 
										size="lg"
										onClick={handleSubmit}
										disabled={isPending || isUploading}
									>
										{isPending || isUploading ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												{isUploading ? "Uploading Images..." : "Creating Auction..."}
											</>
										) : (
											<>
												<Gavel className="h-4 w-4 mr-2" />
												Create Auction
											</>
										)}
									</Button>
									<Button variant="outline" className="w-full bg-transparent" disabled={isPending}>
										Save as Draft
									</Button>
									<Button variant="ghost" className="w-full" asChild>
										<Link href="/bidding">Cancel</Link>
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