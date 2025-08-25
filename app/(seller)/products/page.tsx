"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Package,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Role } from '@prisma/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with actual API calls
const mockProducts = [
    {
        id: 1,
        name: "Organic Fertilizer Premium",
        description: "High-quality organic fertilizer for better crop yield",
        price: 250,
        category: "Fertilizers",
        stock: 45,
        status: "active",
        image: "/placeholder-product.jpg",
        createdAt: "2024-01-10",
        sales: 23
    },
    {
        id: 2,
        name: "Wheat Seeds - Hybrid Variety",
        description: "Disease-resistant wheat seeds with high germination rate",
        price: 120,
        category: "Seeds",
        stock: 5,
        status: "active",
        image: "/placeholder-product.jpg",
        createdAt: "2024-01-08",
        sales: 18
    },
    {
        id: 3,
        name: "Garden Tools Set",
        description: "Complete set of gardening tools for small farms",
        price: 1750,
        category: "Tools",
        stock: 12,
        status: "active",
        image: "/placeholder-product.jpg",
        createdAt: "2024-01-05",
        sales: 8
    },
    {
        id: 4,
        name: "Rice Seeds - Basmati",
        description: "Premium basmati rice seeds for aromatic rice production",
        price: 180,
        category: "Seeds",
        stock: 0,
        status: "out_of_stock",
        image: "/placeholder-product.jpg",
        createdAt: "2024-01-03",
        sales: 15
    },
    {
        id: 5,
        name: "Pesticide Spray Pump",
        description: "Manual spray pump for pesticide application",
        price: 890,
        category: "Equipment",
        stock: 8,
        status: "draft",
        image: "/placeholder-product.jpg",
        createdAt: "2024-01-01",
        sales: 0
    }
]

export default function SellerProducts() {
    const { data: session, status } = useSession()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            redirect("/signin?callbackUrl=/seller/products")
            return
        }

        if (session.user.role !== Role.SELLER) {
            redirect("/")
            return
        }
    }, [session, status])

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!session || session.user.role !== Role.SELLER) {
        return null
    }

    // Filter products based on search and filters
    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
        const matchesStatus = selectedStatus === "all" || product.status === selectedStatus

        return matchesSearch && matchesCategory && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge variant="default">Active</Badge>
            case "draft":
                return <Badge variant="secondary">Draft</Badge>
            case "out_of_stock":
                return <Badge variant="destructive">Out of Stock</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getStockStatus = (stock: number) => {
        if (stock === 0) return "text-red-500"
        if (stock <= 10) return "text-yellow-500"
        return "text-green-500"
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Products</h1>
                    <p className="text-muted-foreground">Manage your product listings</p>
                </div>
                <Button asChild>
                    <Link href="/seller/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="all">All Categories</option>
                            <option value="Seeds">Seeds</option>
                            <option value="Fertilizers">Fertilizers</option>
                            <option value="Tools">Tools</option>
                            <option value="Equipment">Equipment</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>

                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Products List */}
            <div className="grid gap-6">
                {filteredProducts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                    ? "No products match your current filters. Try adjusting your search criteria."
                                    : "You haven't added any products yet. Create your first product to get started."
                                }
                            </p>
                            <Button asChild>
                                <Link href="/seller/products/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredProducts.map((product) => (
                        <Card key={product.id}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                                            <Package className="w-8 h-8 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                                {getStatusBadge(product.status)}
                                            </div>
                                            <p className="text-muted-foreground text-sm">{product.description}</p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-sm text-muted-foreground">Category: {product.category}</span>
                                                <span className="text-sm text-muted-foreground">•</span>
                                                <span className="text-sm text-muted-foreground">Created: {product.createdAt}</span>
                                                <span className="text-sm text-muted-foreground">•</span>
                                                <span className="text-sm text-muted-foreground">{product.sales} sales</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">₹{product.price}</p>
                                            <p className={`text-sm ${getStockStatus(product.stock)}`}>
                                                {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/seller/products/${product.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/seller/products/${product.id}/edit`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Product
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Product
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Stats Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{mockProducts.length}</p>
                            <p className="text-sm text-muted-foreground">Total Products</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{mockProducts.filter(p => p.status === "active").length}</p>
                            <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{mockProducts.filter(p => p.stock <= 10 && p.stock > 0).length}</p>
                            <p className="text-sm text-muted-foreground">Low Stock</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{mockProducts.filter(p => p.stock === 0).length}</p>
                            <p className="text-sm text-muted-foreground">Out of Stock</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
