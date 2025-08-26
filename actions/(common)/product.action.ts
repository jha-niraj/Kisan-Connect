"use server"

import { prisma } from "@/lib/prisma"
import { ProductStatus } from "@prisma/client"

export async function getPublicProductById(productId: string) {
	try {
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				status: ProductStatus.ACTIVE
			},
			include: {
				farmer: {
					select: {
						id: true,
						name: true,
						location: true,
						district: true,
						image: true,
						farmingExperience: true,
						phone: true,
						email: true
					}
				}
			}
		})

		if (!product) {
			return { success: false, error: "Product not found" }
		}

		// Calculate farmer rating (placeholder for now)
		const farmerRating = 4.8 // TODO: Calculate from reviews when implemented
		const totalProducts = await prisma.product.count({
			where: {
				farmerId: product.farmerId,
				status: ProductStatus.ACTIVE
			}
		})

		return {
			success: true,
			product: {
				...product,
				farmer: {
					...product.farmer,
					rating: farmerRating,
					totalProducts,
					verified: true // TODO: Add verification logic
				}
			}
		}
	} catch (error) {
		console.error("Error fetching product:", error)
		return { success: false, error: "Failed to fetch product" }
	}
}

export async function getRelatedProducts(productId: string, category: string, limit = 4) {
	try {
		const products = await prisma.product.findMany({
			where: {
				id: { not: productId },
				category: category as any,
				status: ProductStatus.ACTIVE
			},
			include: {
				farmer: {
					select: {
						name: true
					}
				}
			},
			take: limit,
			orderBy: {
				createdAt: 'desc'
			}
		})

		return { success: true, products }
	} catch (error) {
		console.error("Error fetching related products:", error)
		return { success: false, error: "Failed to fetch related products" }
	}
}
