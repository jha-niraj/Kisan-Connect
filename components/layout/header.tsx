"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu, DropdownMenuContent,
	DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	Search, ShoppingCart, User, Menu, Bell, Sprout, ChevronDown
} from "lucide-react"

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<Sprout className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="font-serif text-xl font-bold text-foreground">KrishiConnect</span>
						</motion.div>
					</Link>
					<div className="hidden md:flex flex-1 max-w-md mx-8">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input placeholder="Search for fresh produce..." className="pl-10 pr-4" />
						</div>
					</div>
					<nav className="hidden lg:flex items-center space-x-6">
						<Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
							Products
						</Link>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center text-sm font-medium hover:text-primary transition-colors">
								Categories <ChevronDown className="ml-1 h-3 w-3" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Fruits</DropdownMenuItem>
								<DropdownMenuItem>Vegetables</DropdownMenuItem>
								<DropdownMenuItem>Grains & Rice</DropdownMenuItem>
								<DropdownMenuItem>Spices</DropdownMenuItem>
								<DropdownMenuItem>Honey</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Link href="/bidding" className="text-sm font-medium hover:text-primary transition-colors">
							Live Bidding
						</Link>
						<Link href="/farmers" className="text-sm font-medium hover:text-primary transition-colors">
							For Farmers
						</Link>
					</nav>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" size="sm" className="relative">
							<Bell className="h-4 w-4" />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
						</Button>
						<Button variant="ghost" size="sm" className="relative">
							<ShoppingCart className="h-4 w-4" />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<User className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>My Orders</DropdownMenuItem>
								<DropdownMenuItem>My Bids</DropdownMenuItem>
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>Sign Out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							<Menu className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="md:hidden pb-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search for fresh produce..." className="pl-10 pr-4" />
					</div>
				</div>
				{
					isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden border-t py-4"
						>
							<nav className="flex flex-col space-y-4">
								<Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
									Products
								</Link>
								<Link href="/bidding" className="text-sm font-medium hover:text-primary transition-colors">
									Live Bidding
								</Link>
								<Link href="/farmers" className="text-sm font-medium hover:text-primary transition-colors">
									For Farmers
								</Link>
								<div className="pt-2 border-t">
									<Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
										Profile
									</Link>
								</div>
							</nav>
						</motion.div>
					)
				}
			</div>
		</header>
	)
}