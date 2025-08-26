"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ram Bahadur Sharma</h3>
                    <p className="text-muted-foreground">ram@example.com</p>
                    <p className="text-sm text-muted-foreground">+977-9841234567</p>
                  </div>
                  <Badge variant="secondary">Regular Customer</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground">Update your name, email, and phone</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/profile/addresses"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">My Addresses</p>
                      <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/profile/payment"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Payment Methods</p>
                      <p className="text-sm text-muted-foreground">Manage payment options</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Orders & Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Orders & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/profile/orders"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">My Orders</p>
                      <p className="text-sm text-muted-foreground">Track and manage your orders</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/profile/wishlist"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Wishlist</p>
                      <p className="text-sm text-muted-foreground">Your saved products</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/profile/notifications"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/profile/settings"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Account Settings</p>
                      <p className="text-sm text-muted-foreground">Privacy and security settings</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/help"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Help & Support</p>
                      <p className="text-sm text-muted-foreground">Get help with your account</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Separator />

                <button className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors w-full text-left">
                  <div className="flex items-center space-x-3">
                    <LogOut className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
