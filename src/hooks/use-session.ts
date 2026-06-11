"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

export function useSession() {
  const { user, session, profile, isLoading, isAuthenticated, setAuth, clearAuth, setLoading } =
    useAuthStore()

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      setLoading(true)
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) {
          if (!cancelled) clearAuth()
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setAuth(data.user, data.session, data.profile)
        }
      } catch {
        if (!cancelled) clearAuth()
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [setAuth, clearAuth, setLoading])

  return { user, session, profile, isLoading, isAuthenticated }
}
