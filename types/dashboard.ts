// Dashboard related types and interfaces

export interface DashboardStats {
    totalProducts: number
    activeListings: number
    totalEarnings: number
    monthlyOrders: number
    activeBids: number
    avgRating: number
}

export interface SellerStats {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    activeListings: number
    activeProducts: number
    outOfStock: number
    pendingOrders: number
    completedOrders: number
}

export interface ContractorStats {
    totalBids: number
    activeBids: number
    wonBids: number
    totalRevenue: number
    activeProjects: number
    completedProjects: number
}

export interface FarmerStats {
    totalProducts: number
    activeListings: number
    totalEarnings: number
    monthlyOrders: number
    activeBids: number
    avgRating: number
}

export interface RecentOrder {
    id: string
    customer: string
    product: string
    quantity: number | string
    amount: number
    status: "pending" | "processing" | "completed" | "cancelled" | "delivered"
    date: string
}

export interface TopProduct {
    id: string
    name: string
    sales: number
    revenue: number
    image?: string
}

export interface ActiveBid {
    id: string
    title: string
    farmer: string
    location: string
    budget: number
    deadline: string
    status: "pending" | "submitted" | "shortlisted" | "won" | "lost"
    timeLeft: string
    description: string
}

export interface ActiveProject {
    id: string
    title: string
    farmer: string
    location: string
    budget: number
    progress: number
    startDate: string
    endDate: string
    status: "in_progress" | "completed" | "cancelled"
}

export interface RecentActivity {
    type: "bid_won" | "project_update" | "new_opportunity" | "order_received" | "product_published"
    message: string
    time: string
}
