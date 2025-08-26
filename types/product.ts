// Product related types and interfaces

import { ProductStatus } from '@prisma/client'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
    unit: string
    status: ProductStatus
    farmerId?: string | null
    sellerId?: string | null
    createdAt: Date
    updatedAt: Date
    farmer?: {
        id: string
        name: string
        image?: string | null
    } | null
    seller?: {
        id: string
        name: string
        image?: string | null
    } | null
}

export interface ProductFormData {
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
    unit: string
    status: ProductStatus
}

export interface ProductFilters {
    search?: string
    category?: string
    status?: ProductStatus | 'all'
    minPrice?: number
    maxPrice?: number
    sortBy?: 'name' | 'price' | 'createdAt' | 'stock'
    sortOrder?: 'asc' | 'desc'
}

export interface ProductStats {
    totalProducts: number
    activeProducts: number
    draftProducts: number
    outOfStockProducts: number
    totalSales: number
    totalRevenue: number
}

// Product categories
export const PRODUCT_CATEGORIES = [
    'Seeds',
    'Fertilizers',
    'Tools',
    'Equipment',
    'Pesticides',
    'Grains',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Other'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Common units for products
export const PRODUCT_UNITS = [
    'kg',
    'gram',
    'liter',
    'piece',
    'box',
    'bag',
    'ton',
    'quintal'
] as const

export type ProductUnit = typeof PRODUCT_UNITS[number]