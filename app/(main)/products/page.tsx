"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Role } from '@prisma/client'
import FarmerProducts from "../farmer/_components/farmer-products"
import SellerProducts from "../seller/_components/seller-products"
import ContractorProducts from "../contractor/_components/contractor-products"

export default function MainProducts() {
	const { data: session, status } = useSession()

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (!session) {
		redirect("/signin?callbackUrl=/products")
		return null
	}

	// Render products based on user role
	switch (session.user.role) {
		case Role.FARMER:
			return (
				<div className="container mx-auto p-6">
					<FarmerProducts />
				</div>
			)

		case Role.SELLER:
			return (
				<div className="container mx-auto p-6">
					<SellerProducts />
				</div>
			)

		case Role.CONTRACTOR:
			return (
				<div className="container mx-auto p-6">
					<ContractorProducts />
				</div>
			)

		default:
			// If user has no role or unknown role, redirect to onboarding
			redirect("/onboarding")
			return null
	}
}