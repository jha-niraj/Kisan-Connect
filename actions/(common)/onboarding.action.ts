'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const onboardingSchema = z.object({
	role: z.enum(["USER", "FARMER", "SELLER", "CONTRACTOR"]),
	location: z.string().min(1, "Location is required"),
	district: z.string().min(1, "District is required"),
	phone: z.string().min(10, "Valid phone number is required"),
	// Farmer specific fields
	farmName: z.string().optional(),
	farmSize: z.number().optional(),
	farmingExperience: z.number().optional(),
	// User interests
	categoryInterests: z.array(z.string()).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export async function completeOnboarding(data: OnboardingInput) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		const validatedData = onboardingSchema.parse(data);

		// Update user with onboarding data
		const updateData: any = {
			role: validatedData.role,
			location: validatedData.location,
			district: validatedData.district,
			phone: validatedData.phone,
			onboardingCompleted: true,
			roleExplicitlyChosen: true,
			updatedAt: new Date(),
		};

		// Add farmer-specific fields if role is FARMER
		if (validatedData.role === "FARMER") {
			if (validatedData.farmName) updateData.farmName = validatedData.farmName;
			if (validatedData.farmSize) updateData.farmSize = validatedData.farmSize;
			if (validatedData.farmingExperience) updateData.farmingExperience = validatedData.farmingExperience;
		}

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: updateData
		});

		// Create category interests for the user if provided
		if (validatedData.categoryInterests && validatedData.categoryInterests.length > 0) {
			// First ensure categories exist
			await seedDefaultCategories();
			
			const existingCategories = await prisma.category.findMany({
				where: {
					name: {
						in: validatedData.categoryInterests
					}
				}
			});

			if (existingCategories.length > 0) {
				await prisma.categoryInterest.createMany({
					data: existingCategories.map(category => ({
						userId: session.user.id,
						categoryId: category.id
					})),
					skipDuplicates: true
				});
			}
		}

		return { success: true, role: validatedData.role };
	} catch (error) {
		console.error("Error completing onboarding:", error);

		if (error instanceof z.ZodError) {
			return { success: false, error: error.issues[0].message };
		}

		return { success: false, error: "Failed to complete onboarding" };
	}
}

export async function checkOnboardingStatus() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { needsOnboarding: true };
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				onboardingCompleted: true,
				role: true,
			}
		});

		if (!user || !user.onboardingCompleted) {
			return { needsOnboarding: true };
		}

		return {
			needsOnboarding: false,
			role: user.role
		};
	} catch (error) {
		console.error("Error checking onboarding status:", error);
		return { needsOnboarding: true };
	}
}

export async function redirectAfterOnboarding(role: string) {
	switch (role) {
		case 'FARMER':
			redirect('/farmer/dashboard');
		case 'USER':
			redirect('/products');
		default:
			redirect('/products');
	}
}

// Get all categories for selection
export async function getCategories() {
	try {
		await seedDefaultCategories();
		
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' }
		});
		
		return { success: true, categories };
	} catch (error) {
		console.error("Error fetching categories:", error);
		return { success: false, error: "Failed to fetch categories" };
	}
}

// Seed default categories if they don't exist
export async function seedDefaultCategories() {
	const DEFAULT_CATEGORIES = [
		{ name: "Grains", icon: "🌾", description: "Rice, Wheat, Barley, Corn, etc." },
		{ name: "Vegetables", icon: "🥬", description: "Fresh vegetables like tomatoes, potatoes, etc." },
		{ name: "Fruits", icon: "�", description: "Apples, Oranges, Bananas, seasonal fruits" },
		{ name: "Spices", icon: "🌶️", description: "Turmeric, Cardamom, Ginger, etc." },
		{ name: "Dairy", icon: "🥛", description: "Milk, Cheese, Yogurt, etc." },
		{ name: "Legumes", icon: "🫘", description: "Lentils, Beans, Chickpeas, etc." },
		{ name: "Herbs", icon: "🌿", description: "Basil, Cilantro, Mint, etc." },
		{ name: "Organic", icon: "�", description: "Certified organic products" },
	];

	try {
		const existingCategories = await prisma.category.findMany();
		
		if (existingCategories.length === 0) {
			await prisma.category.createMany({
				data: DEFAULT_CATEGORIES.map(category => ({
					name: category.name,
					description: category.description,
					icon: category.icon,
				})),
				skipDuplicates: true
			});
			console.log("Default agricultural categories seeded");
		}
		
		return await prisma.category.findMany({
			orderBy: { name: 'asc' }
		});
	} catch (error) {
		console.error("Error seeding categories:", error);
		throw error;
	}
}