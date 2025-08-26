"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Product, ProductStatus } from "@/types/product";


interface ProductCardProps {
	product: Product
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
	onView?: (id: string) => void
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
	const getStatusBadge = (status: ProductStatus) => {
		switch (status) {
			case ProductStatus.ACTIVE:
				return <Badge className="bg-green-100 text-green-800">Active</Badge>
			case ProductStatus.SOLD_OUT:
				return <Badge variant="destructive">Sold Out</Badge>
			case ProductStatus.PENDING:
				return <Badge variant="secondary">Pending</Badge>
			case ProductStatus.INACTIVE:
				return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
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
						src={product.images?.[0] || "/placeholder.svg"}
						alt={product.name}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						height={192}
						width={192}
					/>
					<div className="absolute top-3 left-3 flex gap-2">
						{/* Organic badge - would need to be added to Product type if needed */}
						{/* {product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>} */}
						{/* Bidding badge - would need to be added to Product type if needed */}
						{/* {product.allowsBidding && (
							<Badge variant="outline" className="bg-white">
								Bidding
							</Badge>
						)} */}
					</div>
					<div className="absolute top-3 right-3">{getStatusBadge(product.status)}</div>
				</div>
				<CardContent className="p-4">
					<div className="space-y-3">
						<div>
							<h3 className="font-semibold text-lg">{product.name}</h3>
							<p className="text-sm text-muted-foreground">{product.category}</p>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xl font-bold text-primary">Rs. {product.price}</p>
								<p className="text-sm text-muted-foreground">Stock: {product.stock} {product.unit}</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-muted-foreground">
									{new Date(product.createdAt).toLocaleDateString()}
								</p>
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
									<DropdownMenuItem>
										{product.status === ProductStatus.ACTIVE ? "Deactivate" : "Activate"}
									</DropdownMenuItem>
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