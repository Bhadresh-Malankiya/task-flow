"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

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
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true)
    setError(null)

    let email = ""
    switch (role) {
      case "admin":
        email = "admin@example.com"
        break
      case "team_member":
        email = "team@example.com"
        break
      case "customer":
        email = "customer@example.com"
        break
    }

    try {
      const success = await login(email, "12345678")
      if (success) {
        router.push("/dashboard")
      } else {
        setError(`Failed to login as ${role}`)
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-center text-muted-foreground mb-2">Demo Accounts (Password: 12345678)</p>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin")} disabled={isLoading}>
            Admin
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("team_member")} disabled={isLoading}>
            Team
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("customer")} disabled={isLoading}>
            Customer
          </Button>
        </div>
      </div>
    </Form>
  )
}

