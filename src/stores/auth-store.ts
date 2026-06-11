import { create } from "zustand"

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role?: string
  twoFactorEnabled?: boolean
  phoneNumber?: string
}

interface Session {
  id: string
  expiresAt: string
  userId: string
}

interface BEProfile {
  id: string
  auth_user_id: string
  email: string
  role: string
  active: boolean
  name?: string
  image?: string
  phone?: string
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: BEProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  setAuth: (user: User | null, session: Session | null, profile: BEProfile | null) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setAuth: (user, session, profile) =>
    set({ user, session, profile, isAuthenticated: !!user && !!session, isLoading: false }),
  clearAuth: () =>
    set({ user: null, session: null, profile: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
