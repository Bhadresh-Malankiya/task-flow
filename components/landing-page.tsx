"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Users, BarChart, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingSocials } from "@/components/floating-socials"
import { RoleFeaturesSection } from "@/components/role-features-section"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/ui/logo"

export function LandingPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar - Updated with Logo */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <Link
                href="/login"
                className="mx-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="mx-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign Up
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden border-b">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.2] dark:opacity-[0.1]"></div>
            </div>
            <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl"></div>
            <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-primary/20 blur-3xl"></div>
          </div>

          <div className="container relative px-4 py-20 sm:px-6 md:py-28 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                className="flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary backdrop-blur-sm">
                  <span className="mr-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  Streamlined Project Management
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  <span className="block">Manage Projects</span>
                  <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-primary dark:to-blue-400">
                    With Confidence
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground">
                  Our dashboard provides a seamless experience for managing projects, tasks, and team collaboration.
                  Perfect for businesses of all sizes.
                </p>

                <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                </div>

                <div className="flex flex-col space-y-2 text-sm text-muted-foreground sm:flex-row sm:space-x-6 sm:space-y-0">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
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
                <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl backdrop-blur-sm">
                  <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-r from-primary/30 to-blue-400/30 blur-3xl"></div>
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

        {/* Partners Section */}
        <section className="border-b bg-muted/30 py-12">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="mb-2 text-xl font-semibold">Trusted by Industry Leaders</h2>
              <p className="text-muted-foreground">
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
              {Array.from({ length: 6 }).map((_, index) => (
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
                      src="/placeholder.svg?height=60&width=120"
                      alt={`Partner ${index + 1}`}
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

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                Key Features
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to manage projects
              </h2>
              <p className="text-lg text-muted-foreground">
                Our comprehensive dashboard provides all the tools you need to plan, track, and deliver successful
                projects.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description:
                    "Work seamlessly with your team members in real-time with shared workspaces and communication tools.",
                },
                {
                  icon: BarChart,
                  title: "Advanced Analytics",
                  description:
                    "Gain valuable insights with detailed reports and analytics to track progress and identify bottlenecks.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description:
                    "Rest easy knowing your data is protected with enterprise-grade security and role-based access control.",
                },
                {
                  icon: Zap,
                  title: "Automation Tools",
                  description:
                    "Save time with powerful automation tools that streamline repetitive tasks and workflows.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "50,000+", label: "Active Users" },
                { value: "1,000+", label: "Companies" },
                { value: "120+", label: "Countries" },
                { value: "4.9/5", label: "Average Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-xl bg-card p-8 text-center shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-2 text-3xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Features Section - Keeping the component but enhancing its styling */}
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                Role-Based Features
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Tailored for every team member</h2>
              <p className="text-lg text-muted-foreground">
                Our dashboard adapts to different roles, providing the right tools and information for each team member.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <RoleFeaturesSection />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden border-t py-16 md:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
            </div>
            <div className="absolute -top-48 right-0 h-96 w-96 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 blur-3xl"></div>
          </div>

          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl border bg-card/80 p-8 shadow-xl backdrop-blur-sm md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to streamline your workflow?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Join thousands of satisfied users who have transformed their project management experience.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#">Schedule a Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Keeping as is */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FloatingSocials />
          </div>
        </div>
      </footer>
    </div>
  )
}

