"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search,
  Filter,
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Eye,
  Plus,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product, PRODUCT_CATEGORIES } from "@/types/product"
import { ProductStatus } from '@prisma/client'
import { getFarmerProducts } from "@/actions/(farmer)/farmer.action"

interface SellerProductsProps {
  session: any
}

export default function SellerProducts({ session }: SellerProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState("newest")

  // Load farmer products that sellers can purchase/sell
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await getFarmerProducts()
        if (response.success && response.products) {
          setProducts(response.products)
        } else {
          console.error("Error loading farmer products:", response.error)
        }
      } catch (error) {
        console.error("Error loading farmer products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return 0 // Products don't have rating field in the current schema
      case "name":
        return a.name.localeCompare(b.name)
      default: // newest
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Farmer Products</h1>
          <p className="text-muted-foreground">
            Browse fresh products from local farmers for your business
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/seller/products">
              <Plus className="h-4 w-4 mr-2" />
              Manage My Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Price Range: Rs {priceRange[0]} - Rs {priceRange[1]}
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {product.category === "Organic" && (
                <Badge className="absolute top-2 left-2 bg-green-500">
                  Organic
                </Badge>
              )}
              {product.status === ProductStatus.ACTIVE && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  Active
                </Badge>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">N/A</span>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Farmer Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>By {product.farmer?.name || "Unknown Farmer"}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location not specified</span>
              </div>

              {/* Price and Stock */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    Rs {product.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{product.unit}</span>
                </div>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} ${product.unit} left` : "Out of Stock"}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1">
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No products message */}
      {sortedProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your filters to find more products."
                : "No farmer products are currently available."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">In Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {products.filter(p => p.category === "Organic").length}
              </div>
              <div className="text-sm text-muted-foreground">Organic Products</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
