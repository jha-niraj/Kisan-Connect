"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Role } from '@prisma/client'
import FarmerDashboard from "../farmer/_components/farmer-dashboard"
import SellerDashboard from "../seller/_components/seller-dashboard"
import ContractorDashboard from "../contractor/_components/contractor-dashboard"

export default function MainDashboard() {
	const { data: session, status } = useSession()

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (!session) {
		redirect("/signin?callbackUrl=/dashboard")
		return null
	}

	// Render dashboard based on user role
	switch (session.user.role) {
		case Role.FARMER:
			return (
				<div className="container mx-auto p-6">
					<FarmerDashboard session={session} />
				</div>
			)

		case Role.SELLER:
			return (
				<div className="container mx-auto p-6">
					<SellerDashboard session={session} />
				</div>
			)

		case Role.CONTRACTOR:
			return (
				<div className="container mx-auto p-6">
					<ContractorDashboard session={session} />
				</div>
			)

		default:
			// If user has no role or unknown role, redirect to onboarding
			redirect("/onboarding")
			return null
	}
}