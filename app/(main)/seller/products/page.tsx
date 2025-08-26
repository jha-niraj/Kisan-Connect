"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getSellerProducts, deleteProduct, toggleProductStatus } from "@/actions/(seller)/seller.action"
import { Product } from "@/types/product"
import { ProductStatus } from "@prisma/client"

export default function SellerProductsPage() {
    const { status } = useSession()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "authenticated") {
            loadProducts()
        }
    }, [status])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const result = await getSellerProducts()
            if (result.success && result.products) {
                setProducts(result.products)
            }
        } catch (error) {
            console.error("Error loading products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const result = await deleteProduct(productId)
            if (result.success) {
                setProducts(products.filter(p => p.id !== productId))
            }
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    const handleToggleStatus = async (productId: string) => {
        try {
            const result = await toggleProductStatus(productId)
            if (result.success && result.product) {
                setProducts(products.map(p =>
                    p.id === productId ? { ...p, status: result.product!.status } : p
                ))
            }
        } catch (error) {
            console.error("Error toggling product status:", error)
        }
    }

    const getStatusBadge = (status: ProductStatus) => {
        switch (status) {
            case ProductStatus.ACTIVE:
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case ProductStatus.INACTIVE:
                return <Badge variant="secondary">Inactive</Badge>
            case ProductStatus.SOLD_OUT:
                return <Badge variant="destructive">Sold Out</Badge>
            case ProductStatus.PENDING:
                return <Badge variant="outline">Pending</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return <div>Please sign in to access this page.</div>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === ProductStatus.ACTIVE).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === ProductStatus.SOLD_OUT).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === ProductStatus.PENDING).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-4">You haven&apos;t added any products yet.</p>
                            <Button asChild>
                                <Link href="/seller/products/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-square relative">
                                <Image
                                    src={product.images[0] || "/placeholder.jpg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(product.status)}
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-lg font-bold">₹{product.price}</span>
                                            <span className="text-sm text-muted-foreground">/{product.unit}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline" asChild className="flex-1">
                                            <Link href={`/seller/products/${product.id}`}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleStatus(product.id)}
                                            className="flex-1"
                                        >
                                            {product.status === ProductStatus.ACTIVE ? "Hide" : "Show"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
