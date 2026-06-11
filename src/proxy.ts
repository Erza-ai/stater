import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { tokenCookieName } from "@/lib/auth/config"

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
]

function isPublicPath(pathname: string): boolean {
  const path = pathname.toLowerCase()
  return publicPaths.some((p) => path.startsWith(p))
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()
  const token = request.cookies.get(tokenCookieName())?.value

  if (!token && !isPublicPath(pathname) && !pathname.startsWith("/_next") && !pathname.startsWith("/favicon")) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (token && isPublicPath(pathname) && pathname.startsWith("/sign-")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
