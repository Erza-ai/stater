"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VerifyEmailView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  )
  const [message, setMessage] = useState(
    token ? "" : "Missing verification token",
  )

  useEffect(() => {
    if (!token) return

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
        if (res.ok) {
          setStatus("success")
          setMessage("Email verified successfully!")
          setTimeout(() => router.push("/sign-in"), 2000)
        } else {
          const data = await res.json()
          setStatus("error")
          setMessage(data.message || "Verification failed")
        }
      } catch {
        setStatus("error")
        setMessage("Network error")
      }
    }

    verify()
  }, [token, router])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "verifying" && <CardDescription>Verifying your email...</CardDescription>}
        {status === "success" && (
          <CardDescription className="text-green-600">{message} Redirecting...</CardDescription>
        )}
        {status === "error" && <CardDescription className="text-destructive">{message}</CardDescription>}
      </CardContent>
    </Card>
  )
}
