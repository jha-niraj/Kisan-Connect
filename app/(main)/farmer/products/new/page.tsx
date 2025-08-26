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
import { Upload, X, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const categories = ["Fruits", "Vegetables", "Grains & Rice", "Spices", "Honey", "Dairy", "Herbs", "Nuts & Seeds"]

const units = ["kg", "gram", "piece", "bundle", "bottle", "packet", "liter"]

export default function AddProduct() {
	const [images, setImages] = useState<string[]>([])
	const [governmentRate, setGovernmentRate] = useState("")
	const [upperMargin, setUpperMargin] = useState("")
	const [isOrganic, setIsOrganic] = useState(false)
	const [allowBidding, setAllowBidding] = useState(false)

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			// Mock image upload - in real app, upload to server
			const newImages = Array.from(files).map(() => "/placeholder.svg?height=200&width=200")
			setImages([...images, ...newImages])
		}
	}

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index))
	}

	const calculateUpperPrice = () => {
		if (governmentRate && upperMargin) {
			const rate = Number.parseFloat(governmentRate)
			const margin = Number.parseFloat(upperMargin)
			return rate + (rate * margin) / 100
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
						<h1 className="font-serif text-3xl font-bold">Add New Product</h1>
						<p className="text-muted-foreground">List your fresh produce for direct sale to consumers</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="productName">Product Name *</Label>
										<Input id="productName" placeholder="e.g., Organic Basmati Rice" />
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
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										placeholder="Describe your product, growing methods, quality, etc."
										rows={4}
									/>
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

						{/* Pricing */}
						<Card>
							<CardHeader>
								<CardTitle>Pricing & Stock</CardTitle>
								<p className="text-sm text-muted-foreground">
									Set your price based on government rates with your preferred margin
								</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="govRate">Government Rate (Rs.) *</Label>
										<Input
											id="govRate"
											type="number"
											placeholder="30"
											value={governmentRate}
											onChange={(e) => setGovernmentRate(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="margin">Your Margin (%) *</Label>
										<Input
											id="margin"
											type="number"
											placeholder="20"
											max="20"
											value={upperMargin}
											onChange={(e) => setUpperMargin(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">Maximum 20% above government rate</p>
									</div>
									<div className="space-y-2">
										<Label>Final Price (Rs.)</Label>
										<div className="p-3 bg-muted rounded-md">
											<span className="text-lg font-bold text-primary">Rs. {calculateUpperPrice().toFixed(2)}</span>
										</div>
									</div>
								</div>

								<div className="grid md:grid-cols-3 gap-4">
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
									<div className="space-y-2">
										<Label htmlFor="stock">Available Stock *</Label>
										<Input id="stock" type="number" placeholder="100" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="minOrder">Minimum Order</Label>
										<Input id="minOrder" type="number" placeholder="1" />
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox 
										id="bidding" 
										checked={allowBidding} 
										onCheckedChange={(checked) => setAllowBidding(checked === true)} 
									/>
									<Label htmlFor="bidding">Allow bidding for this product</Label>
								</div>
							</CardContent>
						</Card>

						{/* Images */}
						<Card>
							<CardHeader>
								<CardTitle>Product Images</CardTitle>
								<p className="text-sm text-muted-foreground">
									Upload high-quality images of your product (max 5 images)
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
								<CardTitle>Product Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
										{images.length > 0 ? (
											<Image
												src={images[0] || "/placeholder.svg"}
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
										<h3 className="font-semibold">Product Name</h3>
										<div className="flex items-center space-x-2">
											{isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
											{allowBidding && <Badge variant="outline">Bidding Allowed</Badge>}
										</div>
										<p className="text-lg font-bold text-primary">Rs. {calculateUpperPrice().toFixed(2)}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3">
									<Button className="w-full" size="lg">
										<Plus className="h-4 w-4 mr-2" />
										List Product
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

						{/* Tips */}
						<Card>
							<CardHeader>
								<CardTitle className="text-sm">Tips for Better Sales</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<p>• Upload clear, well-lit photos</p>
								<p>• Write detailed descriptions</p>
								<p>• Set competitive prices</p>
								<p>• Keep stock updated</p>
								<p>• Respond to customer queries quickly</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
