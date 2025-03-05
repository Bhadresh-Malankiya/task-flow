import { NewPasswordCard } from "@/components/auth/new-password-card"

export default function NewPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <NewPasswordCard token={params.token} />
    </div>
  )
}

