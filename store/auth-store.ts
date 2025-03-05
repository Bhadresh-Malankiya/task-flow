"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// User roles
export type UserRole = "customer" | "team_member" | "admin"

// User interface
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

// Mock users for fallback when server is unavailable
const MOCK_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "12345678",
    role: "admin" as UserRole,
  },
  {
    id: 2,
    name: "Team Member",
    email: "team@example.com",
    password: "12345678",
    role: "team_member" as UserRole,
  },
  {
    id: 3,
    name: "Customer",
    email: "customer@example.com",
    password: "12345678",
    role: "customer" as UserRole,
  },
]

// Simple token generator for browser environment
const generateToken = (payload: any, expiresInHours = 24) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Date.now()
  const expiresAt = now + expiresInHours * 60 * 60 * 1000

  const data = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor(expiresAt / 1000),
  }

  // In a real app, we would use proper signing
  // This is just for demo purposes
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(data))
  const signature = btoa("demo-signature")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Simple token verification for browser environment
const verifyToken = (token: string) => {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      return null // Token expired
    }

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Check if the server is available
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch("http://localhost:3001/users", {
      method: "HEAD",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn("Server check failed:", error)
    return false
  }
}

// Auth store state interface
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  serverAvailable: boolean | null

  // Auth methods
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  checkServer: () => Promise<boolean>

  // Helper methods
  isAuthenticated: () => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      serverAvailable: null,

      checkServer: async () => {
        const available = await isServerAvailable()
        set({ serverAvailable: available })
        return available
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Check if server is available
          const serverAvailable = await get().checkServer()

          let user

          if (serverAvailable) {
            // Server is available, try to fetch from JSON Server
            const response = await fetch("http://localhost:3001/users?email=" + email)
            const users = await response.json()
            user = users[0]
          } else {
            // Server is not available, use mock data
            console.log("Server unavailable, using mock data")
            user = MOCK_USERS.find((u) => u.email === email)
          }

          if (!user || user.password !== password) {
            set({
              isLoading: false,
              error: "Invalid email or password",
            })
            return false
          }

          // Create token
          const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
          })

          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = user

          set({
            user: userWithoutPassword,
            token,
            isLoading: false,
            error: null,
          })

          return true
        } catch (error) {
          const errorMessage = "Unable to connect to the server. Please check your connection or try again later."

          set({
            isLoading: false,
            error: errorMessage,
            serverAvailable: false,
          })

          console.error("Login error:", error)
          return false
        }
      },

      signup: async (name: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true, error: null })

        try {
          // Check if server is available
          const serverAvailable = await get().checkServer()

          if (!serverAvailable) {
            set({
              isLoading: false,
              error: "Server is unavailable. Please try again later.",
            })
            return false
          }

          // Check if user already exists in db.json
          const checkResponse = await fetch("http://localhost:3001/users?email=" + email)
          const existingUsers = await checkResponse.json()

          if (existingUsers.length > 0) {
            set({ isLoading: false, error: "Email already in use" })
            return false
          }

          // Create new user in db.json
          const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In a real app, this would be hashed
            role,
          }

          const response = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          })

          if (!response.ok) {
            throw new Error("Failed to create user")
          }

          // Create token
          const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
          })

          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = newUser

          set({
            user: userWithoutPassword,
            token,
            isLoading: false,
            error: null,
          })

          return true
        } catch (error) {
          const errorMessage = "Unable to connect to the server. Please check your connection or try again later."

          set({
            isLoading: false,
            error: errorMessage,
            serverAvailable: false,
          })

          console.error("Signup error:", error)
          return false
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      requestPasswordReset: async (email: string) => {
        set({ isLoading: true, error: null })

        try {
          // Check if server is available
          const serverAvailable = await get().checkServer()

          if (!serverAvailable) {
            set({
              isLoading: false,
              error: "Server is unavailable. Please try again later.",
            })
            return false
          }

          // Check if user exists in db.json
          const response = await fetch("http://localhost:3001/users?email=" + email)
          const users = await response.json()

          if (users.length === 0) {
            set({ isLoading: false, error: "User not found" })
            return false
          }

          // Create a reset token
          const resetToken = generateToken(
            {
              id: users[0].id,
              email: users[0].email,
              purpose: "password_reset",
            },
            1,
          ) // 1 hour expiration

          // Store the reset token in db.json
          const resetRequest = {
            id: Date.now(),
            userId: users[0].id,
            token: resetToken,
            expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          }

          await fetch("http://localhost:3001/resetTokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resetRequest),
          })

          set({ isLoading: false })

          // In a real app, we would send an email with the reset link
          console.log(`Reset link: http://localhost:3000/reset-password/${resetToken}`)

          return true
        } catch (error) {
          const errorMessage = "Unable to connect to the server. Please check your connection or try again later."

          set({
            isLoading: false,
            error: errorMessage,
            serverAvailable: false,
          })

          console.error("Password reset request error:", error)
          return false
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null })

        try {
          // Check if server is available
          const serverAvailable = await get().checkServer()

          if (!serverAvailable) {
            set({
              isLoading: false,
              error: "Server is unavailable. Please try again later.",
            })
            return false
          }

          // Verify token
          const decoded = verifyToken(token)

          if (!decoded || decoded.purpose !== "password_reset") {
            set({ isLoading: false, error: "Invalid or expired token" })
            return false
          }

          // Get user from db.json
          const userResponse = await fetch(`http://localhost:3001/users/${decoded.id}`)
          const user = await userResponse.json()

          if (!user) {
            set({ isLoading: false, error: "User not found" })
            return false
          }

          // Update password in db.json
          const updatedUser = {
            ...user,
            password: newPassword, // In a real app, this would be hashed
          }

          await fetch(`http://localhost:3001/users/${decoded.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
          })

          // Delete the used reset token from db.json
          const tokensResponse = await fetch("http://localhost:3001/resetTokens?token=" + token)
          const tokens = await tokensResponse.json()

          if (tokens.length > 0) {
            await fetch(`http://localhost:3001/resetTokens/${tokens[0].id}`, {
              method: "DELETE",
            })
          }

          set({ isLoading: false })
          return true
        } catch (error) {
          const errorMessage = "Unable to connect to the server. Please check your connection or try again later."

          set({
            isLoading: false,
            error: errorMessage,
            serverAvailable: false,
          })

          console.error("Password reset error:", error)
          return false
        }
      },

      isAuthenticated: () => {
        const state = get()
        if (!state.token || !state.user) return false

        // Verify token is still valid
        const decoded = verifyToken(state.token)
        return !!decoded
      },

      hasRole: (role) => {
        const state = get()
        if (!state.user) return false

        if (Array.isArray(role)) {
          return role.includes(state.user.role)
        }

        return state.user.role === role
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)

