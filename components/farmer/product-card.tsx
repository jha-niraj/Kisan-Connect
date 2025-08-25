"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface ProductCardProps {
	product: {
		id: number
		name: string
		category: string
		price: string
		stock: number
		status: string
		views: number
		orders: number
		rating?: number
		image: string
		isOrganic?: boolean
		allowsBidding?: boolean
	}
	onEdit?: (id: number) => void
	onDelete?: (id: number) => void
	onView?: (id: number) => void
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge className="bg-green-100 text-green-800">Active</Badge>
			case "out_of_stock":
				return <Badge variant="destructive">Out of Stock</Badge>
			case "draft":
				return <Badge variant="secondary">Draft</Badge>
			case "pending":
				return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
			default:
				return <Badge variant="secondary">{status}</Badge>
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			whileHover={{ y: -2 }}
		>
			<Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
				<div className="relative">
					<Image
						src={product.image || "/placeholder.svg"}
						alt={product.name}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						height={192}
						width={192}
					/>
					<div className="absolute top-3 left-3 flex gap-2">
						{product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
						{product.allowsBidding && (
							<Badge variant="outline" className="bg-white">
								Bidding
							</Badge>
						)}
					</div>
					<div className="absolute top-3 right-3">{getStatusBadge(product.status)}</div>
				</div>

				<CardContent className="p-4">
					<div className="space-y-3">
						<div>
							<h3 className="font-semibold text-lg">{product.name}</h3>
							<p className="text-sm text-muted-foreground">{product.category}</p>
						</div>

						{product.rating && (
							<div className="flex items-center space-x-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="text-sm font-medium">{product.rating}</span>
								<span className="text-sm text-muted-foreground">({product.orders} orders)</span>
							</div>
						)}

						<div className="flex items-center justify-between">
							<div>
								<p className="text-xl font-bold text-primary">{product.price}</p>
								<p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-muted-foreground">{product.views} views</p>
								<p className="text-sm font-medium">{product.orders} sold</p>
							</div>
						</div>

						<div className="flex items-center justify-between pt-2 border-t">
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" onClick={() => onView?.(product.id)}>
									<Eye className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="sm" onClick={() => onEdit?.(product.id)}>
									<Edit className="h-4 w-4" />
								</Button>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => onView?.(product.id)}>View Details</DropdownMenuItem>
									<DropdownMenuItem onClick={() => onEdit?.(product.id)}>Edit Product</DropdownMenuItem>
									<DropdownMenuItem>Duplicate</DropdownMenuItem>
									<DropdownMenuItem>{product.status === "active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
									<DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(product.id)}>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
