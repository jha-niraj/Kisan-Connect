"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Hammer, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

// Mock data - replace with actual API calls
const mockStats = {
  totalBids: 32,
  activeBids: 8,
  wonBids: 18,
  totalRevenue: 125600,
  activeProjects: 5,
  completedProjects: 13
}

const mockActiveBids = [
  {
    id: "BID-001",
    title: "Irrigation System Installation",
    farmer: "Ram Bahadur Thapa",
    location: "Chitwan",
    budget: 45000,
    deadline: "2024-02-15",
    status: "pending",
    timeLeft: "3 days",
    description: "Complete drip irrigation system for 2 acre vegetable farm"
  },
  {
    id: "BID-002", 
    title: "Greenhouse Construction",
    farmer: "Sita Kumari",
    location: "Lalitpur",
    budget: 85000,
    deadline: "2024-02-20",
    status: "submitted",
    timeLeft: "8 days",
    description: "200 sqm polyhouse with climate control system"
  },
  {
    id: "BID-003",
    title: "Farm Equipment Maintenance",
    farmer: "Krishna Bahadur",
    location: "Kaski",
    budget: 15000,
    deadline: "2024-01-25",
    status: "shortlisted",
    timeLeft: "10 days",
    description: "Annual maintenance of tractors and harvesting equipment"
  }
]

const mockActiveProjects = [
  {
    id: "PROJ-001",
    title: "Solar Water Pump Installation",
    farmer: "Hari Prasad",
    location: "Jhapa",
    budget: 65000,
    progress: 75,
    startDate: "2024-01-01",
    endDate: "2024-01-30",
    status: "in_progress"
  },
  {
    id: "PROJ-002",
    title: "Organic Composting Unit",
    farmer: "Maya Devi",
    location: "Sunsari",
    budget: 28000,
    progress: 40,
    startDate: "2024-01-10", 
    endDate: "2024-02-10",
    status: "in_progress"
  }
]

const mockRecentActivity = [
  {
    type: "bid_won",
    message: "Congratulations! You won the bid for Solar Water Pump Installation",
    time: "2 hours ago"
  },
  {
    type: "project_update",
    message: "Project milestone completed for Organic Composting Unit",
    time: "1 day ago"
  },
  {
    type: "new_opportunity",
    message: "New bidding opportunity: Farm Mechanization in Bardiya",
    time: "2 days ago"
  }
]

import { Role } from '@prisma/client';

export default function ContractorDashboard() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      redirect("/signin?callbackUrl=/contractor/dashboard")
      return
    }

    if (session.user.role !== Role.CONTRACTOR) {
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

  if (!session || session.user.role !== Role.CONTRACTOR) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <Button asChild>
          <Link href="/contractor/opportunities">
            <Eye className="h-4 w-4 mr-2" />
            Browse Opportunities
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeBids}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.totalBids} total submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.wonBids}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeProjects} currently active
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
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              18 of 24 bids won
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bids">Active Bids</TabsTrigger>
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {mockRecentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-4 ${
                        activity.type === 'bid_won' ? 'bg-green-500' :
                        activity.type === 'project_update' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your contracting business
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/contractor/opportunities">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Opportunities
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/contractor/bids">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Bids
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/contractor/projects">
                    <Hammer className="h-4 w-4 mr-2" />
                    View Projects
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/contractor/profile">
                    <Users className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Bids</CardTitle>
              <CardDescription>
                Track your submitted bids and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActiveBids.map((bid) => (
                  <div key={bid.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{bid.title}</h3>
                          <Badge 
                            variant={
                              bid.status === "shortlisted" ? "default" :
                              bid.status === "submitted" ? "secondary" : "outline"
                            }
                          >
                            {bid.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{bid.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Farmer:</span> {bid.farmer}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span> {bid.location}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span> ₹{bid.budget.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline:</span> {bid.deadline}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {bid.timeLeft} left
                        </div>
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

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Monitor your ongoing project progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActiveProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant="default">In Progress</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Farmer:</span> {project.farmer}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span> {project.location}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span> ₹{project.budget.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">End Date:</span> {project.endDate}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage Project
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
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
