"use client"

import { useState, useEffect } from "react"
import {
	Card, CardContent, CardDescription,
	CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
	Hammer, TrendingUp, Users, Eye, Clock, CheckCircle, DollarSign, FileText
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
	getContractorStats, getContractorActiveBids,
	getContractorActiveProjects, getContractorRecentActivity
} from "@/actions/(contractor)/contractor.action"
import {
	ContractorStats, ActiveBid,
	ActiveProject, RecentActivity
} from "@/types/dashboard"
import { useSession } from "next-auth/react"

export default function ContractorDashboard() {
	const { data: session } = useSession();
	const [stats, setStats] = useState<ContractorStats>({
		totalBids: 0,
		activeBids: 0,
		wonBids: 0,
		totalRevenue: 0,
		activeProjects: 0,
		completedProjects: 0
	})
	const [activeBids, setActiveBids] = useState<ActiveBid[]>([])
	const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([])
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		try {
			setLoading(true)

			// Load contractor stats
			const statsResult = await getContractorStats()
			if (statsResult.success && statsResult.stats) {
				setStats(statsResult.stats)
			}

			// Load active bids
			const bidsResult = await getContractorActiveBids()
			if (bidsResult.success && bidsResult.bids) {
				setActiveBids(bidsResult.bids)
			}

			// Load active projects
			const projectsResult = await getContractorActiveProjects()
			if (projectsResult.success && projectsResult.projects) {
				setActiveProjects(projectsResult.projects)
			}

			// Load recent activity
			const activityResult = await getContractorRecentActivity()
			if (activityResult.success && activityResult.activities) {
				setRecentActivity(activityResult.activities)
			}
		} catch (error) {
			console.error("Error loading dashboard data:", error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="flex justify-between items-center">
					<div>
						<div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-64"></div>
					</div>
					<div className="h-10 bg-gray-200 rounded w-32"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{
						[...Array(4)].map((_, i) => (
							<div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
						))
					}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Contractor Dashboard</h1>
					<p className="text-muted-foreground">Welcome back, {session?.user?.name}!</p>
				</div>
				<Button asChild>
					<Link href="/contractor/opportunities">
						<Eye className="h-4 w-4 mr-2" />
						Browse Opportunities
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Active Bids</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.activeBids}</div>
							<p className="text-xs text-muted-foreground">
								{stats.totalBids} total submitted
							</p>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Won Projects</CardTitle>
							<CheckCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.wonBids}</div>
							<p className="text-xs text-muted-foreground">
								{stats.activeProjects} currently active
							</p>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground">
								+15% from last month
							</p>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
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
				</motion.div>
			</div>
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
									{
										recentActivity.length > 0 ? (
											recentActivity.map((activity, index) => (
												<div key={index} className="flex items-center">
													<div className={`w-2 h-2 rounded-full mr-4 ${activity.type === 'bid_won' ? 'bg-green-500' :
														activity.type === 'project_update' ? 'bg-blue-500' : 'bg-yellow-500'
														}`}></div>
													<div className="flex-1">
														<p className="text-sm font-medium">{activity.message}</p>
													</div>
													<div className="text-xs text-muted-foreground">{activity.time}</div>
												</div>
											))
										) : (
											<div className="text-center text-muted-foreground py-8">
												<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
												<p>No recent activity</p>
												<p className="text-sm">Activity will appear here when you start bidding</p>
											</div>
										)
									}
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
								{
									activeBids.length > 0 ? (
										activeBids.map((bid) => (
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
										))
									) : (
										<div className="text-center text-muted-foreground py-8">
											<Hammer className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<p>No active bids</p>
											<p className="text-sm">Start bidding on opportunities to see them here</p>
										</div>
									)
								}
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
								{
									activeProjects.length > 0 ? (
										activeProjects.map((project) => (
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
										))
									) : (
										<div className="text-center text-muted-foreground py-8">
											<CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<p>No active projects</p>
											<p className="text-sm">Win bids to start working on projects</p>
										</div>
									)
								}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}