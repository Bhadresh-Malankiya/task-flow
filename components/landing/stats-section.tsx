"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Users, Building, Globe, Star } from "lucide-react"

export function StatsSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Active Users",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Building,
      value: "1,000+",
      label: "Companies",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Globe,
      value: "120+",
      label: "Countries",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      color: "text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24 dark:from-gray-900 dark:to-gray-950"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10"></div>
      </div>

      <div className="container px-4 sm:px-6">
        <motion.div className="mx-auto mb-16 max-w-2xl text-center" style={{ opacity, y }}>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">By the Numbers</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our dashboard is trusted by users and companies worldwide.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-700 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-3xl font-bold">{stat.value}</h3>
              <p className="text-center text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

