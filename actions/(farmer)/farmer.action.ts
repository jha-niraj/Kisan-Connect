"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from '@prisma/client'

export interface FarmerProductsFilters {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    location?: string
    sortBy?: 'name' | 'price' | 'createdAt' | 'stock'
    sortOrder?: 'asc' | 'desc'
}

/**
 * Get all farmer products available for bidding (public access for contractors)
 */
export async function getFarmerProducts(filters?: FarmerProductsFilters) {
    try {
        const where: any = {
            status: "ACTIVE",
            stock: { gt: 0 },
            farmerId: { not: null }, // Ensure these are farmer products
        }

        // Apply filters
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { category: { contains: filters.search, mode: 'insensitive' } }
            ]
        }

        if (filters?.category && filters.category !== 'all') {
            where.category = filters.category
        }

        if (filters?.minPrice !== undefined) {
            where.price = { ...where.price, gte: filters.minPrice }
        }

        if (filters?.maxPrice !== undefined) {
            where.price = { ...where.price, lte: filters.maxPrice }
        }

        if (filters?.location) {
            where.location = { contains: filters.location, mode: 'insensitive' }
        }

        // Set up ordering
        const orderBy: any = {}
        if (filters?.sortBy) {
            orderBy[filters.sortBy] = filters.sortOrder || 'desc'
        } else {
            orderBy.createdAt = 'desc'
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy
        })

        return { success: true, products }
    } catch (error) {
        console.error("Error fetching farmer products:", error)
        return { success: false, error: "Failed to fetch farmer products" }
    }
}

/**
 * Get farmer products for the authenticated farmer
 */
export async function getMyFarmerProducts() {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== Role.FARMER) {
            throw new Error("Unauthorized")
        }

        const products = await prisma.product.findMany({
            where: {
                farmerId: session.user.id
            },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, products }
    } catch (error) {
        console.error("Error fetching farmer products:", error)
        return { success: false, error: "Failed to fetch farmer products" }
    }
}

/**
 * Get farmer dashboard stats
 */
export async function getFarmerStats() {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== Role.FARMER) {
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

        // TODO: Add order and bid stats when those models are implemented
        const stats = {
            totalProducts,
            activeListings: activeProducts, // use activeProducts as activeListings
            totalEarnings: 0, // placeholder
            monthlyOrders: 0, // placeholder
            activeBids: 0, // placeholder
            avgRating: 4.8 // placeholder
        }

        return { success: true, stats }
    } catch (error) {
        console.error("Error fetching farmer stats:", error)
        return { success: false, error: "Failed to fetch farmer stats" }
    }
}

/**
 * Get all seller products available for purchase (public access for farmers)
 */
export async function getSellerProductsForFarmers() {
    try {
        const products = await prisma.product.findMany({
            where: {
                status: "ACTIVE",
                stock: { gt: 0 },
                farmer: {
                    role: "SELLER" // Get products from users with SELLER role
                }
            },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return {
            success: true,
            products: products,
        }
    } catch (error) {
        console.error("Error fetching seller products:", error)
        return {
            success: false,
            error: "Failed to fetch products",
        }
    }
}