"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectSubmissionForm } from "@/components/project/project-submission-form"
import { useAuthStore } from "@/store/auth-store"

export default function SubmitProjectPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Redirect if not authenticated or not a customer
    if (!isAuthenticated() || (user && user.role !== "customer")) {
      router.push("/dashboard")
    }
  }, [router, isAuthenticated, user])

  // Don't render anything until we've checked authentication
  if (!isAuthenticated() || (user && user.role !== "customer")) {
    return null
  }

  return <ProjectSubmissionForm />
}

