"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, TrendingUp, DollarSign, Eye, Edit, Trash2, Clock, Gavel } from "lucide-react"
import Link from "next/link"

// Mock data for farmer dashboard
const farmerStats = {
  totalProducts: 24,
  activeListings: 18,
  totalEarnings: "Rs. 45,600",
  monthlyOrders: 156,
  activeBids: 5,
  avgRating: 4.8,
}

const recentProducts = [
  {
    id: 1,
    name: "Organic Basmati Rice",
    category: "Grains",
    price: "Rs. 120/kg",
    stock: 50,
    status: "active",
    views: 234,
    orders: 12,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: "Rs. 80/kg",
    stock: 0,
    status: "out_of_stock",
    views: 189,
    orders: 8,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Mountain Honey",
    category: "Honey",
    price: "Rs. 800/bottle",
    stock: 25,
    status: "active",
    views: 456,
    orders: 23,
    image: "/placeholder.svg?height=80&width=80",
  },
]

const activeBids = [
  {
    id: 1,
    product: "Premium Cardamom",
    startPrice: "Rs. 2,000",
    currentBid: "Rs. 2,500",
    bidders: 12,
    timeLeft: "2h 15m",
    status: "active",
  },
  {
    id: 2,
    product: "Organic Potatoes",
    startPrice: "Rs. 40",
    currentBid: "Rs. 45",
    bidders: 8,
    timeLeft: "45m",
    status: "active",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rajesh Sharma",
    product: "Organic Basmati Rice",
    quantity: "5kg",
    amount: "Rs. 600",
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Priya Thapa",
    product: "Mountain Honey",
    quantity: "2 bottles",
    amount: "Rs. 1,600",
    status: "processing",
    date: "2024-01-14",
  },
]

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "delivered":
        return <Badge className="bg-blue-100 text-blue-800">Delivered</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Ram Bahadur! Manage your products and track your sales.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/farmer/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/farmer/bidding/new">
                <Gavel className="h-4 w-4 mr-2" />
                Create Auction
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{farmerStats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
                    <p className="text-2xl font-bold">{farmerStats.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Orders</p>
                    <p className="text-2xl font-bold">{farmerStats.monthlyOrders}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Bids</p>
                    <p className="text-2xl font-bold">{farmerStats.activeBids}</p>
                  </div>
                  <Gavel className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="bidding">Bidding</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Products
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/farmer/products">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • {product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(product.status)}
                        <p className="text-xs text-muted-foreground mt-1">{product.views} views</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Bids */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Active Auctions
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/farmer/bidding">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeBids.map((bid) => (
                    <div key={bid.id} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{bid.product}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {bid.timeLeft}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Price</p>
                          <p className="font-medium">{bid.startPrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Bid</p>
                          <p className="font-bold text-primary">{bid.currentBid}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{bid.bidders} active bidders</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Products
                  <Button asChild>
                    <Link href="/farmer/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="font-medium">{product.price}</span>
                          <span className="text-muted-foreground">Stock: {product.stock}</span>
                          <span className="text-muted-foreground">{product.views} views</span>
                          <span className="text-muted-foreground">{product.orders} orders</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(product.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bidding Tab */}
          <TabsContent value="bidding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Auctions
                  <Button asChild>
                    <Link href="/farmer/bidding/new">
                      <Gavel className="h-4 w-4 mr-2" />
                      Create Auction
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeBids.map((bid) => (
                    <div key={bid.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{bid.product}</h4>
                          <p className="text-sm text-muted-foreground">Started at {bid.startPrice}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {bid.timeLeft}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Bid</p>
                          <p className="text-xl font-bold text-primary">{bid.currentBid}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bidders</p>
                          <p className="text-lg font-semibold">{bid.bidders}</p>
                        </div>
                        <div className="flex items-end">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">#{order.id}</h4>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm">
                          {order.product} • {order.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
