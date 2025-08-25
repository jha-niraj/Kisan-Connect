"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Star
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Role } from '@prisma/client';

// Mock data - replace with actual API calls
const mockStats = {
  totalProducts: 24,
  totalOrders: 156,
  totalRevenue: 45600,
  activeListings: 18,
  pendingOrders: 8,
  completedOrders: 148
}

const mockRecentOrders = [
  {
    id: "ORD-001",
    customer: "Ram Bahadur",
    product: "Organic Fertilizer",
    quantity: 5,
    amount: 2500,
    status: "pending",
    date: "2024-01-15"
  },
  {
    id: "ORD-002", 
    customer: "Sita Devi",
    product: "Wheat Seeds",
    quantity: 10,
    amount: 1200,
    status: "completed",
    date: "2024-01-14"
  },
  {
    id: "ORD-003",
    customer: "Krishna Kumar",
    product: "Garden Tools Set",
    quantity: 2,
    amount: 3500,
    status: "processing",
    date: "2024-01-13"
  }
]

const mockTopProducts = [
  {
    id: 1,
    name: "Organic Fertilizer",
    sales: 45,
    revenue: 11250,
    image: "/placeholder-product.jpg"
  },
  {
    id: 2,
    name: "Wheat Seeds",
    sales: 32,
    revenue: 3840,
    image: "/placeholder-product.jpg"
  },
  {
    id: 3,
    name: "Garden Tools Set",
    sales: 18,
    revenue: 31500,
    image: "/placeholder-product.jpg"
  }
]

export default function SellerDashboard() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      redirect("/signin?callbackUrl=/seller/dashboard")
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeListings} active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +7 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New order received</p>
                      <p className="text-xs text-muted-foreground">Order #ORD-001 - ₹2,500</p>
                    </div>
                    <div className="text-xs text-muted-foreground">2 min ago</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Product published</p>
                      <p className="text-xs text-muted-foreground">Organic Fertilizer is now live</p>
                    </div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Low stock alert</p>
                      <p className="text-xs text-muted-foreground">Wheat Seeds - Only 5 left</p>
                    </div>
                    <div className="text-xs text-muted-foreground">3 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your store efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/seller/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/seller/products">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/seller/orders">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/seller/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your latest customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.product}</p>
                        <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">₹{order.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <Badge 
                        variant={
                          order.status === "completed" ? "default" :
                          order.status === "processing" ? "secondary" : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Your best-selling products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-bold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
