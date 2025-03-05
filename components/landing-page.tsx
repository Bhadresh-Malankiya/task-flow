"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const authStore = useAuthStore()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TaskFlow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {authStore.isAuthenticated() ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Testimonials
              </button>

              {!authStore.isAuthenticated() && (
                <>
                  <Link href="/login" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                    Sign Up
                  </Link>
                </>
              )}

              {authStore.isAuthenticated() && (
                <Link href="/dashboard" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient-xy"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-xy 15s ease infinite",
            }}
          />

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Manage Tasks with Ease and Efficiency
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                TaskFlow helps teams organize, track, and manage their work in a visual, productive, and rewarding way.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" className="group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </motion.div>
            </div>

            {/* Hero image/mockup */}
            <motion.div
              className="mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="TaskFlow Dashboard"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground">Everything you need to manage your tasks and boost productivity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">Choose the plan that fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground">Trusted by thousands of teams around the world</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of teams who use TaskFlow to manage their work efficiently
              </p>
              <Button size="lg" className="group">
                Start Your Free Trial
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary rounded-full p-1.5">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">TaskFlow</span>
              </div>
              <p className="text-muted-foreground mb-4">Simplify task management and boost team productivity</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </motion.div>
  )
}

// Pricing Card Component
function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <motion.div
      className={`bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 ${
        plan.popular ? "border-primary ring-1 ring-primary relative" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          Popular
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <p className="text-muted-foreground mb-6">{plan.description}</p>

      <div className="mb-6">
        <span className="text-3xl font-bold">${plan.price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>

      <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"}>
        {plan.buttonText}
      </Button>

      <ul className="space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={testimonial.avatar || "/placeholder.svg"}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{testimonial.content}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </motion.div>
  )
}

// Data Types
interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface PricingPlan {
  name: string
  description: string
  price: number
  buttonText: string
  features: string[]
  popular?: boolean
}

interface Testimonial {
  name: string
  role: string
  avatar: string
  content: string
}

// Data
const features: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Lightning Fast",
    description: "Optimized for speed and performance, so you can focus on what matters.",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Secure & Private",
    description: "Your data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Detailed Analytics",
    description: "Track progress and measure productivity with comprehensive reports.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Accessible Anywhere",
    description: "Access your tasks from any device, anywhere in the world.",
  },
]

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for individuals",
    price: 0,
    buttonText: "Get Started",
    features: ["Up to 10 tasks", "Basic task management", "1 user", "24-hour support"],
  },
  {
    name: "Pro",
    description: "Ideal for small teams",
    price: 29,
    buttonText: "Start Free Trial",
    popular: true,
    features: [
      "Unlimited tasks",
      "Advanced task management",
      "Up to 10 users",
      "Priority support",
      "Analytics dashboard",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: 99,
    buttonText: "Contact Sales",
    features: [
      "Everything in Pro",
      "Unlimited users",
      "Advanced security",
      "Dedicated account manager",
      "Custom training",
      "SLA guarantees",
    ],
  },
]

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "TaskFlow has transformed how our team manages projects. The interface is intuitive and the features are exactly what we needed.",
  },
  {
    name: "Michael Chen",
    role: "CEO at Startup Inc",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "As a startup founder, I need tools that scale with my business. TaskFlow has been the perfect solution for our growing team.",
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "I juggle multiple clients and projects. TaskFlow helps me stay organized and never miss a deadline. Couldn't work without it!",
  },
]

