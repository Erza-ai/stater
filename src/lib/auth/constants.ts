export const TOKEN_RETURNING_PATHS = new Set([
  "sign-in/email",
  "sign-up/email",
  "sign-in/social",
  "change-password",
  "two-factor/verify-otp",
])

export function isTokenReturning(path: string): boolean {
  if (TOKEN_RETURNING_PATHS.has(path)) return true
  if (path.startsWith("reset-password/")) return true
  if (path.startsWith("token/")) return true
  return false
}
