import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}