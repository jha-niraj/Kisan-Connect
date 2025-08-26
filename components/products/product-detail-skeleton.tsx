import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Breadcrumb Skeleton */}
				<div className="flex items-center space-x-2 mb-6">
					<Skeleton className="h-4 w-12" />
					<span>/</span>
					<Skeleton className="h-4 w-16" />
					<span>/</span>
					<Skeleton className="h-4 w-32" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Product Images Skeleton */}
					<div className="space-y-4">
						<Skeleton className="aspect-square rounded-lg" />
						<div className="grid grid-cols-4 gap-2">
							{[...Array(4)].map((_, index) => (
								<Skeleton key={index} className="aspect-square rounded-lg" />
							))}
						</div>
					</div>

					{/* Product Info Skeleton */}
					<div className="space-y-6">
						<div>
							<div className="flex items-center justify-between mb-2">
								<Skeleton className="h-6 w-20" />
								<div className="flex items-center space-x-2">
									<Skeleton className="h-10 w-10 rounded-full" />
									<Skeleton className="h-10 w-10 rounded-full" />
								</div>
							</div>

							<Skeleton className="h-8 w-3/4 mb-2" />

							<div className="flex items-center space-x-4 mb-4">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-5 w-32" />
							</div>

							<div className="flex items-center space-x-4 mb-6">
								<Skeleton className="h-10 w-20" />
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-6 w-16" />
							</div>
						</div>

						{/* Stock Status Skeleton */}
						<div className="flex items-center space-x-2">
							<Skeleton className="w-3 h-3 rounded-full" />
							<Skeleton className="h-4 w-40" />
						</div>

						{/* Features Skeleton */}
						<div className="grid grid-cols-2 gap-2">
							{[...Array(6)].map((_, index) => (
								<div key={index} className="flex items-center space-x-2">
									<Skeleton className="w-4 h-4" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>

						{/* Quantity Selector Skeleton */}
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-10 w-32" />
								<Skeleton className="h-4 w-8" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>

						{/* Delivery Info Skeleton */}
						<Card>
							<CardContent className="p-4">
								<Skeleton className="h-5 w-40 mb-2" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-5/6" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Product Details Tabs Skeleton */}
				<div className="mb-12">
					<div className="grid grid-cols-4 gap-1 mb-6">
						{[...Array(4)].map((_, index) => (
							<Skeleton key={index} className="h-10" />
						))}
					</div>
					<Card>
						<CardContent className="p-6">
							<div className="space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-4/5" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Related Products Skeleton */}
				<div>
					<Skeleton className="h-8 w-48 mb-6" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[...Array(4)].map((_, index) => (
							<Card key={index}>
								<Skeleton className="w-full h-48" />
								<CardContent className="p-4">
									<Skeleton className="h-5 w-3/4 mb-2" />
									<div className="flex items-center justify-between mb-1">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-4 w-12" />
									</div>
									<Skeleton className="h-4 w-20" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
