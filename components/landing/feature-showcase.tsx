"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Lock } from "lucide-react"

export function FeatureShowcase() {
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl dark:bg-gray-800/80">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                Gain valuable insights with our powerful analytics tools. Track performance, identify trends, and make
                data-driven decisions.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl dark:bg-gray-800/80">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                Rest easy knowing your data is protected with enterprise-grade security features, including role-based
                access control and encryption.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

