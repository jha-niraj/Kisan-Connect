'use client'

import { Header } from '@/components/layout/navbar';
import { Footer } from '@/components/footer';
import OnboardingCheck from '@/components/onboardingcheck';

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {

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