"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"

type AuthView = "login" | "signup"

interface AuthCardProps {
  initialView?: AuthView
}

export function AuthCard({ initialView = "login" }: AuthCardProps) {
  const [view, setView] = useState<AuthView>(initialView)

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
            <h1 className="text-2xl font-bold">TaskFlow</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {view === "login" ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as AuthView)} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="login" asChild>
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              </TabsContent>
              <TabsContent value="signup" asChild>
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignupForm />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

