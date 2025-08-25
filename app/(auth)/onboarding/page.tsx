"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Tractor, Home } from "lucide-react"
import { completeOnboarding, redirectAfterOnboarding, checkOnboardingStatus, getCategories } from "@/actions/onboarding.action"

interface Category {
	id: string
	name: string
	description: string | null
	icon: string | null
}

// Nepal districts for location selection
const NEPAL_DISTRICTS = [
	"Kathmandu", "Lalitpur", "Bhaktapur", "Chitwan", "Pokhara", "Butwal", "Dharan", "Biratnagar",
	"Birgunj", "Janakpur", "Dhangadhi", "Mahendranagar", "Nepalgunj", "Gorkha", "Syangja", 
	"Kaski", "Tanahu", "Baglung", "Myagdi", "Mustang", "Manang", "Lamjung", "Nawalpur"
]

export default function OnboardingPage() {
	const { data: session } = useSession()
	const router = useRouter()
	const [currentStep, setCurrentStep] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [checkingStatus, setCheckingStatus] = useState(true)
	const [categories, setCategories] = useState<Category[]>([])
	const [categoriesLoading, setCategoriesLoading] = useState(true)
	const [formData, setFormData] = useState({
		role: "" as "FARMER" | "USER" | "",
		location: "",
		district: "",
		phone: "",
		farmName: "",
		farmSize: "",
		farmingExperience: "",
		categoryInterests: [] as string[],
	})

	useEffect(() => {
		checkOnboardingStatusAndRedirect()
		fetchCategories()
	}, [])

	const checkOnboardingStatusAndRedirect = async () => {
		try {
			setCheckingStatus(true)
			const result = await checkOnboardingStatus()
			
			if (!result.needsOnboarding) {
				// User has already completed onboarding, redirect appropriately
				toast.success("You've already completed onboarding!")
				await redirectAfterOnboarding(result.role || 'USER')
				return
			}
		} catch (error) {
			console.error("Error checking onboarding status:", error)
		} finally {
			setCheckingStatus(false)
		}
	}

	const fetchCategories = async () => {
		try {
			setCategoriesLoading(true)
			const result = await getCategories()

			if (result.success && result.categories) {
				setCategories(result.categories)
			}
		} catch (error) {
			console.error("Error fetching categories:", error)
			toast.error("Failed to load categories")
		} finally {
			setCategoriesLoading(false)
		}
	}

	const handleRoleSelection = (role: "FARMER" | "USER") => {
		setFormData(prev => ({ ...prev, role: role }))
	}

	const handleCategoryToggle = (categoryName: string) => {
		setFormData(prev => ({
			...prev,
			categoryInterests: prev.categoryInterests.includes(categoryName)
				? prev.categoryInterests.filter(name => name !== categoryName)
				: [...prev.categoryInterests, categoryName]
		}))
	}

	const nextStep = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1)
		}
	}

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleSubmit = async () => {
		if (!formData.role) {
			toast.error("Please select a role")
			return
		}

		setIsLoading(true)
		try {
			const data = {
				role: formData.role,
				location: formData.location,
				district: formData.district,
				phone: formData.phone,
				categoryInterests: formData.categoryInterests,
				...(formData.role === "FARMER" && {
					farmName: formData.farmName,
					farmSize: formData.farmSize ? parseFloat(formData.farmSize) : undefined,
					farmingExperience: formData.farmingExperience ? parseInt(formData.farmingExperience) : undefined,
				})
			}

			const result = await completeOnboarding(data)
			
			if (result.success) {
				toast.success("Welcome to KisanConnect! 🎉")
				await redirectAfterOnboarding(result.role || formData.role)
			} else {
				toast.error(result.error || "Failed to complete onboarding")
			}
		} catch (error) {
			console.error("Error submitting onboarding:", error)
			toast.error("Something went wrong. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	if (checkingStatus) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Checking your status...</span>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						Welcome to KisanConnect! 🌾
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Nepal&apos;s premier agricultural marketplace connecting farmers and buyers
					</p>
				</div>

				{/* Progress Indicator */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center space-x-4">
						{[1, 2, 3].map((step) => (
							<div key={step} className="flex items-center">
								<div className={`w-10 h-10 rounded-full flex items-center justify-center ${
									currentStep >= step 
										? 'bg-green-500 text-white' 
										: 'bg-gray-200 dark:bg-gray-700 text-gray-500'
								}`}>
									{currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
								</div>
								{step < 3 && (
									<div className={`h-1 w-16 mx-2 ${
										currentStep > step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
									}`} />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Step Content */}
				<Card className="mx-auto max-w-2xl">
					<CardHeader>
						<CardTitle className="text-center">
							{currentStep === 1 && "Choose Your Role"}
							{currentStep === 2 && "Basic Information"}
							{currentStep === 3 && "Interests & Preferences"}
						</CardTitle>
						<CardDescription className="text-center">
							{currentStep === 1 && "How would you like to use KisanConnect?"}
							{currentStep === 2 && "Tell us about yourself and your location"}
							{currentStep === 3 && "Help us personalize your experience"}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Step 1: Role Selection */}
						{currentStep === 1 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card 
									className={`cursor-pointer transition-all hover:shadow-lg ${
										formData.role === "FARMER" ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
									}`}
									onClick={() => handleRoleSelection("FARMER")}
								>
									<CardContent className="flex flex-col items-center p-6 text-center">
										<Tractor className="h-12 w-12 text-green-600 mb-4" />
										<h3 className="text-xl font-semibold mb-2">I&apos;m a Farmer</h3>
										<p className="text-gray-600 dark:text-gray-400 text-sm">
											Sell your agricultural products directly to buyers, 
											participate in auctions, and grow your business
										</p>
									</CardContent>
								</Card>

								<Card 
									className={`cursor-pointer transition-all hover:shadow-lg ${
										formData.role === "USER" ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
									}`}
									onClick={() => handleRoleSelection("USER")}
								>
									<CardContent className="flex flex-col items-center p-6 text-center">
										<Home className="h-12 w-12 text-blue-600 mb-4" />
										<h3 className="text-xl font-semibold mb-2">I&apos;m a Buyer</h3>
										<p className="text-gray-600 dark:text-gray-400 text-sm">
											Buy fresh agricultural products directly from farmers,
											participate in auctions, and support local agriculture
										</p>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Step 2: Basic Information */}
						{currentStep === 2 && (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="location">Location/Address</Label>
										<Input
											id="location"
											value={formData.location}
											onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
											placeholder="Enter your address"
											className="w-full"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="district">District</Label>
										<Select value={formData.district} onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}>
											<SelectTrigger>
												<SelectValue placeholder="Select your district" />
											</SelectTrigger>
											<SelectContent>
												{NEPAL_DISTRICTS.map((district) => (
													<SelectItem key={district} value={district}>
														{district}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										value={formData.phone}
										onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
										placeholder="+977 98XXXXXXXX"
										className="w-full"
									/>
								</div>

								{/* Farmer specific fields */}
								{formData.role === "FARMER" && (
									<div className="space-y-4 pt-4 border-t">
										<h4 className="font-semibold text-green-700 dark:text-green-400">Farm Information</h4>
										
										<div className="space-y-2">
											<Label htmlFor="farmName">Farm Name (Optional)</Label>
											<Input
												id="farmName"
												value={formData.farmName}
												onChange={(e) => setFormData(prev => ({ ...prev, farmName: e.target.value }))}
												placeholder="e.g., Green Valley Farm"
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="farmSize">Farm Size (in acres)</Label>
												<Input
													id="farmSize"
													type="number"
													value={formData.farmSize}
													onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
													placeholder="e.g., 5.5"
													step="0.1"
													min="0"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="farmingExperience">Farming Experience (years)</Label>
												<Input
													id="farmingExperience"
													type="number"
													value={formData.farmingExperience}
													onChange={(e) => setFormData(prev => ({ ...prev, farmingExperience: e.target.value }))}
													placeholder="e.g., 10"
													min="0"
												/>
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Step 3: Interests */}
						{currentStep === 3 && (
							<div className="space-y-4">
								<div className="text-center mb-4">
									<h4 className="font-semibold mb-2">
										{formData.role === "FARMER" 
											? "What do you grow or plan to grow?" 
											: "What products are you interested in buying?"
										}
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Select all that apply to personalize your experience
									</p>
								</div>

								{categoriesLoading ? (
									<div className="flex justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin" />
									</div>
								) : (
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{categories.map((category) => (
											<div
												key={category.id}
												className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
													formData.categoryInterests.includes(category.name)
														? 'border-green-500 bg-green-50 dark:bg-green-900/20'
														: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
												}`}
												onClick={() => handleCategoryToggle(category.name)}
											>
												<div className="text-center">
													<div className="text-2xl mb-1">{category.icon}</div>
													<div className="text-sm font-medium">{category.name}</div>
													<div className="text-xs text-gray-500 mt-1">
														{category.description}
													</div>
												</div>
											</div>
										))}
									</div>
								)}

								<div className="text-center text-sm text-gray-500 mt-4">
									You can always update your preferences later in your profile
								</div>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-6">
							<Button
								variant="outline"
								onClick={prevStep}
								disabled={currentStep === 1}
								className="flex items-center space-x-2"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Previous</span>
							</Button>

							{currentStep < 3 ? (
								<Button
									onClick={nextStep}
									disabled={
										(currentStep === 1 && !formData.role) ||
										(currentStep === 2 && (!formData.location || !formData.district || !formData.phone))
									}
									className="flex items-center space-x-2"
								>
									<span>Next</span>
									<ArrowRight className="h-4 w-4" />
								</Button>
							) : (
								<Button
									onClick={handleSubmit}
									disabled={isLoading}
									className="flex items-center space-x-2"
								>
									{isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<CheckCircle className="h-4 w-4" />
									)}
									<span>{isLoading ? "Setting up..." : "Complete Setup"}</span>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}