"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
    children: React.ReactNode
}

interface PopoverTriggerProps {
    children: React.ReactNode
    onClick?: () => void
}

interface PopoverContentProps {
    children: React.ReactNode
    className?: string
    align?: "start" | "center" | "end"
    sideOffset?: number
}

const Popover = ({ children }: PopoverProps) => {
    return <div className="relative">{children}</div>
}

const PopoverTrigger = React.forwardRef<
    HTMLButtonElement,
    PopoverTriggerProps
>(({ children, onClick, ...props }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
))
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverAnchor = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>
}

const PopoverContent = React.forwardRef<
    HTMLDivElement,
    PopoverContentProps
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none",
            className
        )}
        {...props}
    >
        {children}
    </div>
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }