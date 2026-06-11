"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SocialButtonProps {
  provider: string
  label: string
  icon?: React.ReactNode
}

export function SocialButton({ provider, label, icon }: SocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          callbackURL: "/auth/callback",
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Redirecting..." : icon}{label}
    </Button>
  )
}
