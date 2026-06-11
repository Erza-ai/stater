import { authServiceUrl, coreServiceUrl } from "@/lib/auth/config"

interface FetchOptions {
  method?: string
  body?: unknown
  token?: string
  origin?: string | null
  headers?: Record<string, string>
  timeout?: number
}

async function request(url: string, options: FetchOptions = {}): Promise<Response> {
  const { method = "GET", body, token, origin, headers: extraHeaders, timeout = 10000 } = options

  const headers: Record<string, string> = { ...extraHeaders }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }
  if (origin) {
    headers["origin"] = origin
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

export function authServiceFetch(path: string, options: FetchOptions = {}) {
  return request(authServiceUrl(path), options)
}

export function coreServiceFetch(path: string, options: FetchOptions = {}) {
  return request(coreServiceUrl(path), options)
}
