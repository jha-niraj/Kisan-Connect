"use client"

import { create } from "zustand"

type State = {
	open: boolean
	callbackUrl?: string
	reason?: string
}
type Actions = {
	openAuth: (opts?: { callbackUrl?: string; reason?: string }) => void
	closeAuth: () => void
	setCallbackUrl: (u?: string) => void
}

export const useAuthDialog = create<State & Actions>((set) => ({
	open: false,
	callbackUrl: undefined,
	reason: undefined,
	openAuth: (opts) => set({ open: true, callbackUrl: opts?.callbackUrl, reason: opts?.reason }),
	closeAuth: () => set({ open: false }),
	setCallbackUrl: (u) => set({ callbackUrl: u }),
}))