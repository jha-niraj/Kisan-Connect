"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Search, Filter, DollarSign, Clock, User, Package, Eye, Send, Leaf
} from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import {
    Dialog, DialogContent, DialogDescription, 
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Role } from '@prisma/client';
import { Product, PRODUCT_CATEGORIES } from "@/types/product"
import { toast } from "sonner"
import { getFarmerProducts } from "@/actions/(farmer)/farmer.action"

// Loading skeleton component
function ProductCardSkeleton() {
    return (
        <Card className="h-[400px] animate-pulse">
            <CardHeader className="p-0">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </CardContent>
        </Card>
    )
}

interface BidFormData {
    productId: string
    bidPrice: number
    quantity: number
    message: string
    deliveryDate: string
}

export default function ContractorOpportunities() {
    const { data: session, status } = useSession()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [farmerProducts, setFarmerProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [bidFormData, setBidFormData] = useState<BidFormData>({
        productId: "",
        bidPrice: 0,
        quantity: 0,
        message: "",
        deliveryDate: ""
    })

    // Function to load farmer products available for bidding
    const loadFarmerProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const result = await getFarmerProducts({
                search: searchQuery,
                category: selectedCategory === "all" ? undefined : selectedCategory
            })
            
            if (result.success && result.products) {
                setFarmerProducts(result.products as Product[])
            } else {
                setError(result.error || "Failed to load farmer products")
            }
        } catch (err) {
            console.log("error occurred while loading farmers product: " + err);
            setError("Failed to load farmer products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            redirect("/signin?callbackUrl=/contractor/opportunities")
            return
        }

        if (session.user.role !== Role.CONTRACTOR) {
            redirect("/")
            return
        }

        loadFarmerProducts()
    }, [session, status, searchQuery, selectedCategory, loadFarmerProducts])

    // Handle search input with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (session?.user?.role === Role.CONTRACTOR) {
                loadFarmerProducts()
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, selectedCategory, loadFarmerProducts, session?.user?.role])

    const handleBidSubmit = async (productId: string) => {
        try {
            // This would be replaced with actual API call to submit bid
            console.log("Submitting bid:", { ...bidFormData, productId })
            toast.success("Bid submitted successfully!")
            setBidFormData({
                productId: "",
                bidPrice: 0,
                quantity: 0,
                message: "",
                deliveryDate: ""
            })
        } catch (err) {
            console.log("Error occurred during the bid submission:", err);
            toast.error("Failed to submit bid")
        }
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!session || session.user.role !== Role.CONTRACTOR) {
        return null
    }

    // Use the products directly since filtering is now done server-side
    const filteredProducts = farmerProducts

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Farmer Products - Bidding Opportunities</h1>
                    <p className="text-muted-foreground">Bid on fresh products directly from farmers</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{farmerProducts.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
                        <Send className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Won Contracts</CardTitle>
                        <Clock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">NPR 85,000</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search products or farmers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="all">All Categories</option>
                    {PRODUCT_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={loadFarmerProducts}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
                <>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products available</h3>
                            <p className="text-muted-foreground">
                                No farmer products match your current filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-0">
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={product.images[0] || "/placeholder-product.jpg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    <Leaf className="h-3 w-3 mr-1" />
                                                    From Farmer
                                                </Badge>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="outline" className="bg-white/90">
                                                    {product.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    {product.farmer?.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-lg font-bold text-primary">
                                                        NPR {product.price.toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        /{product.unit}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Available: {product.stock} {product.unit}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2 pt-2">
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Details
                                                </Button>
                                                
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="flex-1">
                                                            <Send className="h-4 w-4 mr-1" />
                                                            Place Bid
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Place Bid for {product.name}</DialogTitle>
                                                            <DialogDescription>
                                                                Submit your bid for this product. The farmer will review and respond.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="bidPrice" className="text-right">
                                                                    Bid Price
                                                                </Label>
                                                                <Input
                                                                    id="bidPrice"
                                                                    type="number"
                                                                    placeholder="Price per unit"
                                                                    className="col-span-3"
                                                                    value={bidFormData.bidPrice || ""}
                                                                    onChange={(e) => setBidFormData({
                                                                        ...bidFormData,
                                                                        bidPrice: Number(e.target.value)
                                                                    })}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="quantity" className="text-right">
                                                                    Quantity
                                                                </Label>
                                                                <Input
                                                                    id="quantity"
                                                                    type="number"
                                                                    placeholder={`Quantity in ${product.unit}`}
                                                                    className="col-span-3"
                                                                    value={bidFormData.quantity || ""}
                                                                    onChange={(e) => setBidFormData({
                                                                        ...bidFormData,
                                                                        quantity: Number(e.target.value)
                                                                    })}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="deliveryDate" className="text-right">
                                                                    Delivery Date
                                                                </Label>
                                                                <Input
                                                                    id="deliveryDate"
                                                                    type="date"
                                                                    className="col-span-3"
                                                                    value={bidFormData.deliveryDate}
                                                                    onChange={(e) => setBidFormData({
                                                                        ...bidFormData,
                                                                        deliveryDate: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="message">Message to Farmer</Label>
                                                                <Textarea
                                                                    id="message"
                                                                    placeholder="Add any additional details or requirements..."
                                                                    value={bidFormData.message}
                                                                    onChange={(e) => setBidFormData({
                                                                        ...bidFormData,
                                                                        message: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end space-x-2">
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => setBidFormData({
                                                                    productId: "",
                                                                    bidPrice: 0,
                                                                    quantity: 0,
                                                                    message: "",
                                                                    deliveryDate: ""
                                                                })}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={() => handleBidSubmit(product.id)}>
                                                                Submit Bid
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
