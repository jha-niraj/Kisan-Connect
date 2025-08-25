"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  FileText,
  AlertCircle,
  Eye,
  Send
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Role } from '@prisma/client';

// Mock data - replace with actual API calls
const mockOpportunities = [
  {
    id: 1,
    title: "Solar Water Pump Installation",
    description: "Install solar-powered water pump system for 5-acre farm with automated irrigation controls",
    farmer: "Ram Bahadur Thapa",
    location: "Chitwan, Bharatpur",
    budget: { min: 80000, max: 120000 },
    deadline: "2024-02-15",
    postedDate: "2024-01-20",
    bidsCount: 8,
    timeLeft: "25 days",
    category: "Irrigation",
    urgency: "medium",
    requirements: [
      "Solar panel installation experience required",
      "Water pump maintenance certification preferred",
      "Must provide 2-year warranty"
    ],
    status: "open"
  },
  {
    id: 2,
    title: "Greenhouse Construction",
    description: "Build 500 sqm polyhouse with climate control system for vegetable cultivation",
    farmer: "Sita Kumari Shrestha",
    location: "Lalitpur, Godawari",
    budget: { min: 150000, max: 200000 },
    deadline: "2024-02-10",
    postedDate: "2024-01-18",
    bidsCount: 12,
    timeLeft: "20 days",
    category: "Construction",
    urgency: "high",
    requirements: [
      "Greenhouse construction experience mandatory",
      "HVAC system installation capability",
      "Previous work portfolio required"
    ],
    status: "open"
  },
  {
    id: 3,
    title: "Farm Mechanization Project",
    description: "Complete mechanization setup including tractor services, seed drills, and harvesting equipment",
    farmer: "Krishna Bahadur Magar",
    location: "Kaski, Pokhara",
    budget: { min: 250000, max: 350000 },
    deadline: "2024-03-01",
    postedDate: "2024-01-15",
    bidsCount: 6,
    timeLeft: "40 days",
    category: "Mechanization",
    urgency: "low",
    requirements: [
      "Heavy machinery operation experience",
      "Equipment maintenance capabilities",
      "Training provision for farmers"
    ],
    status: "open"
  },
  {
    id: 4,
    title: "Organic Composting Unit Setup",
    description: "Design and install vermicomposting unit with capacity of 5 tons per month",
    farmer: "Maya Devi Gurung",
    location: "Sunsari, Dharan",
    budget: { min: 45000, max: 60000 },
    deadline: "2024-02-05",
    postedDate: "2024-01-12",
    bidsCount: 15,
    timeLeft: "15 days",
    category: "Waste Management",
    urgency: "high",
    requirements: [
      "Composting system design experience",
      "Organic farming knowledge preferred",
      "Training and maintenance support"
    ],
    status: "open"
  },
  {
    id: 5,
    title: "Fish Pond Construction",
    description: "Construct 3 fish ponds with filtration system and aeration for integrated farming",
    farmer: "Hari Prasad Thapa",
    location: "Jhapa, Birtamod",
    budget: { min: 75000, max: 100000 },
    deadline: "2024-01-30",
    postedDate: "2024-01-10",
    bidsCount: 4,
    timeLeft: "9 days",
    category: "Aquaculture",
    urgency: "urgent",
    requirements: [
      "Pond construction experience required",
      "Aquaculture system knowledge",
      "Filtration system installation"
    ],
    status: "closing_soon"
  }
]

export default function ContractorOpportunities() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [bidData, setBidData] = useState({
    amount: "",
    timeline: "",
    proposal: "",
    experience: ""
  })

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

  // Filter opportunities based on search and filters
  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.farmer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || opp.location.includes(selectedLocation)
    const matchesUrgency = selectedUrgency === "all" || opp.urgency === selectedUrgency
    
    return matchesSearch && matchesCategory && matchesLocation && matchesUrgency
  })

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Open</Badge>
      case "closing_soon":
        return <Badge variant="destructive">Closing Soon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBidSubmit = () => {
    // TODO: Implement bid submission API
    console.log('Submitting bid:', {
      opportunityId: selectedOpportunity?.id,
      ...bidData
    })
    setBidDialogOpen(false)
    setBidData({ amount: "", timeline: "", proposal: "", experience: "" })
    setSelectedOpportunity(null)
  }

  const openBidDialog = (opportunity: any) => {
    setSelectedOpportunity(opportunity)
    setBidDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bidding Opportunities</h1>
          <p className="text-muted-foreground">Find and bid on agricultural projects</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/contractor/bids">
            <FileText className="h-4 w-4 mr-2" />
            My Bids
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
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
              <option value="Irrigation">Irrigation</option>
              <option value="Construction">Construction</option>
              <option value="Mechanization">Mechanization</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Aquaculture">Aquaculture</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Locations</option>
              <option value="Chitwan">Chitwan</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Kaski">Kaski</option>
              <option value="Sunsari">Sunsari</option>
              <option value="Jhapa">Jhapa</option>
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="grid gap-6">
        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground text-center mb-4">
                No opportunities match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{opportunity.title}</h3>
                      {getStatusBadge(opportunity.status)}
                      {getUrgencyBadge(opportunity.urgency)}
                    </div>
                    <p className="text-muted-foreground">{opportunity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{opportunity.budget.min.toLocaleString()} - ₹{opportunity.budget.max.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Budget Range</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{opportunity.farmer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Due: {opportunity.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{opportunity.timeLeft} left</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                  <ul className="text-sm space-y-1">
                    {opportunity.requirements.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                        {req}
                      </li>
                    ))}
                    {opportunity.requirements.length > 2 && (
                      <li className="text-muted-foreground">
                        +{opportunity.requirements.length - 2} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{opportunity.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {opportunity.bidsCount} bids submitted
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => openBidDialog(opportunity)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Bid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunities Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredOpportunities.length}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredOpportunities.filter(o => o.urgency === "urgent" || o.urgency === "high").length}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredOpportunities.filter(o => o.status === "closing_soon").length}</p>
              <p className="text-sm text-muted-foreground">Closing Soon</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                ₹{(filteredOpportunities.reduce((acc, o) => acc + o.budget.max, 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bid Submission Dialog */}
      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Bid - {selectedOpportunity?.title}</DialogTitle>
            <DialogDescription>
              Submit your proposal for this project. Make sure to provide detailed information to increase your chances.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bid-amount">Bid Amount (₹)</Label>
                <Input
                  id="bid-amount"
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidData.amount}
                  onChange={(e) => setBidData({...bidData, amount: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Budget: ₹{selectedOpportunity?.budget.min.toLocaleString()} - ₹{selectedOpportunity?.budget.max.toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="timeline">Timeline (days)</Label>
                <Input
                  id="timeline"
                  type="number"
                  placeholder="Project completion days"
                  value={bidData.timeline}
                  onChange={(e) => setBidData({...bidData, timeline: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="proposal">Project Proposal</Label>
              <Textarea
                id="proposal"
                placeholder="Describe your approach, methodology, and what makes your bid competitive..."
                value={bidData.proposal}
                onChange={(e) => setBidData({...bidData, proposal: e.target.value})}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your relevant experience, past projects, certifications..."
                value={bidData.experience}
                onChange={(e) => setBidData({...bidData, experience: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setBidDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBidSubmit}
                disabled={!bidData.amount || !bidData.timeline || !bidData.proposal}
              >
                Submit Bid
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
