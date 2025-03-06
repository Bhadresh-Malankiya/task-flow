"use client"

import { motion } from "framer-motion"
import { BarChart3, Layers, Lock, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureCards() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Gain valuable insights with our powerful analytics tools. Track performance, identify trends, and make data-driven decisions.",
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      delay: 0,
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Rest easy knowing your data is protected with enterprise-grade security features, including role-based access control and encryption.",
      color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with our optimized dashboard. No more waiting for data to load or reports to generate.",
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      delay: 0.2,
    },
    {
      icon: Layers,
      title: "Customizable Interface",
      description:
        "Tailor the dashboard to your specific needs with our highly customizable interface. Create the perfect workflow for your team.",
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      delay: 0.3,
    },
  ]

  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-900/50">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our dashboard comes packed with features designed to help your business thrive.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl dark:bg-gray-800/80">
                <CardHeader className="pb-2">
                  <div className={`mb-3 inline-flex rounded-lg p-2 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

