"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role, ProductCategory, ProductStatus } from "@prisma/client"

interface CreateProductData {
	name: string
	description: string
	category: ProductCategory
	price: number
	unit: string
	stock: number
	location: string
	district: string
	organicCertified: boolean
	harvestDate?: Date | null
	expiryDate?: Date | null
	images: string[]
	status: ProductStatus
}

export async function createProduct(data: CreateProductData) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// Create product in database
		const product = await prisma.product.create({
			data: {
				name: data.name,
				description: data.description,
				price: data.price,
				stock: data.stock,
				category: data.category,
				unit: data.unit,
				location: data.location,
				district: data.district,
				organicCertified: data.organicCertified,
				harvestDate: data.harvestDate,
				expiryDate: data.expiryDate,
				images: data.images,
				status: data.status,
				farmerId: session.user.id, // Using farmerId for seller products as well until schema is updated
			}
		})

		return { success: true, productId: product.id }
	} catch (error) {
		console.error("Error creating product:", error)
		return { success: false, error: "Failed to create product" }
	}
}

export async function updateProduct(productId: string, data: Partial<CreateProductData>) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// Verify product belongs to the seller
		const existingProduct = await prisma.product.findFirst({
			where: {
				id: productId,
				farmerId: session.user.id
			}
		})

		if (!existingProduct) {
			throw new Error("Product not found or unauthorized")
		}

		// Update product
		const product = await prisma.product.update({
			where: { id: productId },
			data: {
				...data,
				updatedAt: new Date()
			}
		})

		return { success: true, product }
	} catch (error) {
		console.error("Error updating product:", error)
		return { success: false, error: "Failed to update product" }
	}
}

export async function updateSellerProduct(productId: string, data: Partial<CreateProductData>) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		const updatedProduct = await prisma.product.update({
			where: {
				id: productId,
				farmerId: session.user.id
			},
			data: {
				...data,
				updatedAt: new Date()
			}
		})

		return { success: true, product: updatedProduct }
	} catch (error) {
		console.error("Error updating product:", error)
		return { success: false, error: "Failed to update product" }
	}
}

export async function deleteProduct(productId: string) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// Verify product belongs to the seller
		const existingProduct = await prisma.product.findFirst({
			where: {
				id: productId,
				farmerId: session.user.id
			}
		})

		if (!existingProduct) {
			throw new Error("Product not found or unauthorized")
		}

		// Delete product
		await prisma.product.delete({
			where: { id: productId }
		})

		return { success: true }
	} catch (error) {
		console.error("Error deleting product:", error)
		return { success: false, error: "Failed to delete product" }
	}
}

export async function getSellerProducts() {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		const products = await prisma.product.findMany({
			where: {
				farmerId: session.user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return { success: true, products }
	} catch (error) {
		console.error("Error fetching products:", error)
		return { success: false, error: "Failed to fetch products" }
	}
}

export async function getSellerProduct(productId: string) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				farmerId: session.user.id
			}
		})

		if (!product) {
			throw new Error("Product not found")
		}

		return { success: true, product }
	} catch (error) {
		console.error("Error fetching product:", error)
		return { success: false, error: "Failed to fetch product" }
	}
}

export async function toggleProductStatus(productId: string) {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// Get current product
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				farmerId: session.user.id
			}
		})

		if (!product) {
			throw new Error("Product not found")
		}

		// Toggle status (ACTIVE <-> INACTIVE)
		const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"

		const updatedProduct = await prisma.product.update({
			where: { id: productId },
			data: {
				status: newStatus
			}
		})

		return { success: true, product: updatedProduct }
	} catch (error) {
		console.error("Error toggling product status:", error)
		return { success: false, error: "Failed to toggle product status" }
	}
}

export async function getSellerStats() {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// Get product stats
		const totalProducts = await prisma.product.count({
			where: { farmerId: session.user.id }
		})

		const activeProducts = await prisma.product.count({
			where: {
				farmerId: session.user.id,
				status: "ACTIVE"
			}
		})

		const outOfStock = await prisma.product.count({
			where: {
				farmerId: session.user.id,
				stock: 0
			}
		})

		// TODO: Add order stats when Order model is implemented
		const stats = {
			totalProducts,
			activeProducts,
			outOfStock,
			totalOrders: 0, // placeholder
			totalRevenue: 0, // placeholder
			pendingOrders: 0, // placeholder
			activeListings: activeProducts,
			completedOrders: 0 // placeholder
		}

		return { success: true, stats }
	} catch (error) {
		console.error("Error fetching seller stats:", error)
		return { success: false, error: "Failed to fetch stats" }
	}
}

export async function getSellerRecentOrders() {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// TODO: Implement when Order model is implemented
		// For now return empty array
		const orders: any[] = []

		return { success: true, orders }
	} catch (error) {
		console.error("Error fetching recent orders:", error)
		return { success: false, error: "Failed to fetch recent orders" }
	}
}

export async function getSellerTopProducts() {
	try {
		const session = await auth()

		if (!session?.user || session.user.role !== Role.SELLER) {
			throw new Error("Unauthorized")
		}

		// TODO: Implement when Order model is implemented to get actual sales data
		// For now return empty array
		const products: any[] = []

		return { success: true, products }
	} catch (error) {
		console.error("Error fetching top products:", error)
		return { success: false, error: "Failed to fetch top products" }
	}
}
