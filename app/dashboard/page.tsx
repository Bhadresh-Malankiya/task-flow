"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"
import { useAuthStore } from "@/store/auth-store"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router, isAuthenticated])

  if (!isAuthenticated()) {
    return null
  }

  return <Dashboard />
}

