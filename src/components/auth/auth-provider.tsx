"use client"

import { useSession } from "@/hooks/use-session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useSession()
  return <>{children}</>
}
