"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [email, setEmail] = useState("")

  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30 dark:opacity-10"></div>
        </div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-r from-violet-500/30 to-purple-500/30 blur-3xl dark:from-violet-500/20 dark:to-purple-500/20"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-3xl dark:from-blue-500/20 dark:to-indigo-500/20"></div>
      </div>

      <div className="container relative px-4 py-24 sm:px-6 md:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-600/20 bg-blue-50/50 px-3 py-1 text-sm text-blue-600 backdrop-blur-sm dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
              <span className="mr-1 flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75 dark:bg-blue-600"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-500"></span>
              </span>
              New Dashboard v2.0 Released
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Powerful Dashboard</span>
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                for Your Business
              </span>
            </h1>

            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Streamline your operations, gain valuable insights, and make data-driven decisions with our comprehensive
              dashboard solution.
            </p>

            <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:space-x-6 sm:space-y-0">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white/80 shadow-2xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
              <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-r from-violet-400/30 to-purple-400/30 blur-3xl dark:from-violet-600/20 dark:to-purple-600/20"></div>
              <div className="relative p-1">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  width={800}
                  height={600}
                  alt="Dashboard Preview"
                  className="rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

