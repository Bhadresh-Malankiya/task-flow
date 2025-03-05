"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Loader2, Zap } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ResetFormValues = z.infer<typeof resetSchema>

export function ResetPasswordCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { requestPasswordReset } = useAuthStore()

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ResetFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const success = await requestPasswordReset(data.email)
      if (success) {
        setIsSuccess(true)
      } else {
        setError("We couldn't find an account with that email address.")
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a password reset link</p>
          </div>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>Password reset link sent! Check your email for instructions.</AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">If you don't see the email, check your spam folder.</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </motion.div>
          ) : (
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="inline-block mr-1 h-3 w-3" />
                    Back to login
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

