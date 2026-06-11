import { env } from "@/lib/env"

const isProd = process.env.NODE_ENV === "production"

export function cookiePrefix() {
  return isProd ? "__Host-" : ""
}

export function tokenCookieName() {
  return `${cookiePrefix()}${env.APP_NAME}-token`
}

export function sessionCookieName() {
  return `${cookiePrefix()}${env.APP_NAME}-session`
}

export function authServiceUrl(path: string) {
  const base = env.AUTH_SERVICE_API_URL.replace(/\/$/, "")
  const cleanPath = path.replace(/^\//, "")
  return `${base}/api/auth/${cleanPath}`
}

export function tokenUrl() {
  return authServiceUrl(`token/${env.PRODUCT}`)
}

export function coreServiceUrl(path: string) {
  const base = env.CORE_SERVICE_API_URL.replace(/\/$/, "")
  const cleanPath = path.replace(/^\//, "")
  return `${base}/${cleanPath}`
}
