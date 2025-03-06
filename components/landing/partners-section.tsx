"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function PartnersSection() {
  const partners = [
    { name: "Acme Inc", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Globex", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Soylent Corp", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Initech", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Umbrella Corp", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Stark Industries", logo: "/placeholder.svg?height=60&width=120" },
  ]

  return (
    <section className="border-y border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Trusted by Industry Leaders</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of companies that rely on our dashboard for their business needs.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex h-16 w-full items-center justify-center grayscale transition-all duration-200 hover:grayscale-0">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

