import { AuthCard } from "@/components/auth/auth-card"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <AuthCard initialView="signup" />
    </div>
  )
}

