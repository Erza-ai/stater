export interface AuthError {
  message: string
  error?: string
}

export interface AuthSessionResponse {
  session: {
    id: string
    expiresAt: string
    token: string
    userId: string
    createdAt: string
    updatedAt: string
    ipAddress?: string
    userAgent?: string
    impersonatedBy?: string
  } | null
  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string
    role?: string
    twoFactorEnabled?: boolean
    phoneNumber?: string
    createdAt: string
    updatedAt: string
  } | null
}

export interface BEProfileResponse {
  id: string
  auth_user_id: string
  email: string
  role: string
  active: boolean
  name?: string
  image?: string
  phone?: string
}

export interface SessionLoadResult {
  session: AuthSessionResponse["session"]
  user: AuthSessionResponse["user"]
  profile: BEProfileResponse | null
}
