"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Zap } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"

const newPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>

interface NewPasswordCardProps {
  token: string
}

export function NewPasswordCard({ token }: NewPasswordCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { resetPassword } = useAuthStore()

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const watchPassword = form.watch("password")

  // Calculate password strength whenever password changes
  useState(() => {
    if (!watchPassword) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (watchPassword.length >= 8) strength += 1
    // Contains uppercase
    if (/[A-Z]/.test(watchPassword)) strength += 1
    // Contains lowercase
    if (/[a-z]/.test(watchPassword)) strength += 1
    // Contains number
    if (/[0-9]/.test(watchPassword)) strength += 1
    // Contains special character
    if (/[^A-Za-z0-9]/.test(watchPassword)) strength += 1

    setPasswordStrength(strength)
  })

  async function onSubmit(data: NewPasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const success = await resetPassword(token, data.password)
      if (success) {
        router.push("/login?reset=success")
      } else {
        setError("Invalid or expired token. Please request a new password reset link.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary rounded-full p-2 mb-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Set New Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Create a new password for your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating password
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

