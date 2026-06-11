import { Suspense } from "react"
import { VerifyEmailView } from "@/components/auth/verify-email-view"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailView />
      </Suspense>
    </div>
  )
}
