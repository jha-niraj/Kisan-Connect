'use client'

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import OnboardingCheck from '@/components/onboardingcheck';

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	// Routes are now mostly public, middleware handles auth redirects

	return (
		<OnboardingCheck>
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 pt-20">
					{children}
				</main>
				<Footer />
			</div>
		</OnboardingCheck>
	);
};

export default Layout;