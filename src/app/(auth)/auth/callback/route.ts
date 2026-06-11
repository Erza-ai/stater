import { NextRequest, NextResponse } from "next/server"
import { tokenCookieName } from "@/lib/auth/config"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const error = request.nextUrl.searchParams.get("error")

  if (error || !token) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_failed", request.url))
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url))
  response.cookies.set(tokenCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  return response
}
