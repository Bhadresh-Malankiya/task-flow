"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const router = useRouter()
  const { login, checkServer } = useAuthStore()

  // Check server availability on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      const isAvailable = await checkServer()
      setOfflineMode(!isAvailable)
    }

    checkServerStatus()
  }, [checkServer])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(data.email, data.password)
      if (success) {
        router.push("/dashboard")
      } else {
        const authStore = useAuthStore.getState()
        setError(authStore.error || "Invalid email or password. Please try again.")
        setOfflineMode(!authStore.serverAvailable)
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {offlineMode && (
          <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Info className="h-4 w-4" />
            <AlertDescription>Server connection unavailable. You can still log in with demo accounts.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-right">
          <Link href="/reset-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {offlineMode && (
          <div className="text-xs text-center text-muted-foreground mt-2">
            <p>Demo accounts:</p>
            <p>admin@example.com / password123</p>
            <p>team@example.com / password123</p>
            <p>customer@example.com / password123</p>
          </div>
        )}
      </form>
    </Form>
  )
}

