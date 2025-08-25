'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Role } from '@prisma/client';

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return;
		
		if (!session) {
			redirect("/signin?callbackUrl=" + window.location.pathname);
			return;
		}

		// Check if user has CONTRACTOR role
		if (session.user.role !== Role.CONTRACTOR) {
			redirect("/");
			return;
		}
	}, [session, status]);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!session || session.user.role !== Role.CONTRACTOR) {
		return null;
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
