"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Twitter, Github, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"

export function FloatingSocials() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate opacity based on scroll position (fade out as user scrolls down)
  const opacity = Math.max(1 - scrollY / 1000, 0.2)

  return (
    <motion.div
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity }}
      transition={{ duration: 0.5 }}
    >
      <SocialButton href="https://twitter.com" icon={<Twitter />} label="Twitter" color="bg-[#1DA1F2]" />
      <SocialButton href="https://github.com" icon={<Github />} label="GitHub" color="bg-[#333]" />
      <SocialButton href="https://linkedin.com" icon={<Linkedin />} label="LinkedIn" color="bg-[#0A66C2]" />
      <SocialButton href="https://facebook.com" icon={<Facebook />} label="Facebook" color="bg-[#1877F2]" />
    </motion.div>
  )
}

interface SocialButtonProps {
  href: string
  icon: React.ReactNode
  label: string
  color: string
}

function SocialButton({ href, icon, label, color }: SocialButtonProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <motion.div className="relative group flex items-center" whileHover={{ x: 3 }}>
        <motion.div
          className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-md`}
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </motion.div>
        <div className="absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-background border rounded-md px-2 py-1 text-sm shadow-md">
          {label}
        </div>
      </motion.div>
    </Link>
  )
}

