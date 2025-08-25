"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuthDialog } from "./use-auth-dialog"
import { Mail, Eye, EyeOff, LogIn, XCircle, CircleHelp } from "lucide-react"
import type { ReadonlyURLSearchParams } from "next/navigation"

export function AuthDialog() {
	const { status } = useSession()
	const sp = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const { open, callbackUrl, openAuth, closeAuth } = useAuthDialog()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPw, setShowPw] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const resolvedCallback = useMemo(() => {
		if (callbackUrl) return callbackUrl
		const cbFromUrl = sp.get("callbackUrl")
		return cbFromUrl || `${pathname}${makeSearchWithout(sp, ["auth", "callbackUrl"])}`
	}, [callbackUrl, sp, pathname])

	// Auto-open dialog when ?auth=1 is present
	useEffect(() => {
		const shouldOpen = sp.get("auth") === "1"
		const cb = sp.get("callbackUrl")
		if (shouldOpen) {
			openAuth({ callbackUrl: cb || `${pathname}${makeSearchWithout(sp, ["auth", "callbackUrl"])}` })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sp, pathname])

	// When session becomes authenticated, close modal and redirect
	useEffect(() => {
		if (status === "authenticated" && open) {
			dismissFromUrl()
			// If there's a callback URL, redirect to it
			if (resolvedCallback && resolvedCallback !== pathname) {
				router.push(resolvedCallback)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, open, resolvedCallback, pathname, router])

	function dismissFromUrl() {
		closeAuth()
		// remove ?auth and ?callbackUrl but preserve other params
		const params = new URLSearchParams(window.location.search)
		params.delete("auth")
		params.delete("callbackUrl")
		router.replace(`${pathname}${params.toString() ? "?" + params.toString() : ""}`)
	}

	async function onCredentialsSignIn(e: React.FormEvent) {
		e.preventDefault()
		setSubmitting(true)
		setError(null)
		try {
			// NextAuth will handle redirect to callbackUrl if provided
			await signIn("credentials", {
				email,
				password,
				callbackUrl: resolvedCallback || "/",
				redirect: true,
			})
		} catch (err) {
			console.log("Error while signin in:" + err);
			setError("Unable to sign in. Please try again.")
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={(o) => (o ? openAuth({ callbackUrl: resolvedCallback }) : dismissFromUrl())}>
			<DialogContent
				className="max-w-[min(560px,96vw)] p-0 overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl dark:bg-black/20 shadow-2xl"
			>
				<div className="relative">
					<div className="pointer-events-none absolute -inset-1 rounded-lg bg-[radial-gradient(90%_60%_at_50%_0%,rgba(255,255,255,.35),transparent)]" />
					<div className="relative p-6 sm:p-7">
						<DialogHeader className="mb-4">
							<DialogTitle className="text-xl sm:text-2xl">Sign in to your account</DialogTitle>
							<DialogDescription>Welcome back! Please sign in to continue.</DialogDescription>
						</DialogHeader>
						{
							error ? (
								<div className="mb-3 inline-flex items-center gap-2 text-red-600 text-sm">
									<XCircle className="w-4 h-4" />
									{error}
								</div>
							) : null}
						<div className="grid gap-3">
							<Button
								type="button"
								variant="outline"
								className="bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 border-white/30"
								onClick={() =>
									signIn("google", { callbackUrl: resolvedCallback || `${pathname}${window.location.search}` })
								}
							>
								<svg viewBox="0 0 48 48" className="w-4 h-4 mr-2" aria-hidden="true">
									<path
										fill="#FFC107"
										d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                      						c0-6.627,5.373-12,12-12c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657C33.642,6.053,29.083,4,24,4C12.955,4,4,12.955,4,24
                      						c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
									/>
									<path
										fill="#FF3D00"
										d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657
                      						C33.642,6.053,29.083,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
									/>
									<path
										fill="#4CAF50"
										d="M24,44c5.176,0,9.86-1.977,13.409-5.197l-6.197-5.238C29.201,35.091,26.715,36,24,36
                      						c-5.197,0-9.607-3.317-11.287-7.946l-6.532,5.036C9.505,39.556,16.227,44,24,44z"
									/>
									<path
										fill="#1976D2"
										d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.166-4.094,5.566c0.001-0.001,0.002-0.001,0.003-0.002
                      						l6.197,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
									/>
								</svg>
								Continue with Google
							</Button>
							<div className="relative my-4">
								<Separator />
								<span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background/30 backdrop-blur px-2 text-xs text-muted-foreground">
									or
								</span>
							</div>
							<form onSubmit={onCredentialsSignIn} className="grid gap-3">
								<div className="grid gap-2">
									<label htmlFor="email" className="text-sm font-medium">
										Email address
									</label>
									<div className="relative">
										<Mail className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="pl-8"
											placeholder="Enter your email address"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<label htmlFor="password" className="text-sm font-medium">
										Password
									</label>
									<div className="relative">
										<Input
											id="password"
											type={showPw ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground h-auto p-1"
											onClick={() => setShowPw((v) => !v)}
											aria-label={showPw ? "Hide password" : "Show password"}
										>
											{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</Button>
									</div>
								</div>
								<Button type="submit" disabled={submitting} className="mt-1">
									<LogIn className="w-4 h-4 mr-2" />
									Continue
								</Button>
							</form>
							<div className="mt-4 space-y-3">
								<div className="text-xs text-muted-foreground flex items-center gap-2">
									<CircleHelp className="w-3.5 h-3.5" />
									Already have an account? Use your email and password or continue with Google.
								</div>
								
								<Separator />
								
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-3">
										Don&apos;t have an account yet?
									</p>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											const signupUrl = new URL('/signup', window.location.origin)
											if (resolvedCallback) {
												signupUrl.searchParams.set('callbackUrl', resolvedCallback)
											}
											router.push(signupUrl.toString())
											closeAuth()
										}}
									>
										Create New Account
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function makeSearchWithout(sp: ReadonlyURLSearchParams, keys: string[]) {
	const p = new URLSearchParams(sp.toString())
	keys.forEach((k) => p.delete(k))
	const s = p.toString()
	return s ? `?${s}` : ""
}
