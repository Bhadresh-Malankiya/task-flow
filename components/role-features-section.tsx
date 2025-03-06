"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserCog,
  User,
  BarChart3,
  MessageSquare,
  ClipboardList,
  FileText,
  CheckSquare,
  Clock,
  Shield,
  Settings,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleFeature {
  icon: React.ReactNode
  title: string
  description: string
}

interface RoleData {
  title: string
  icon: React.ReactNode
  description: string
  features: RoleFeature[]
  color: string
}

export function RoleFeaturesSection() {
  const [activeRole, setActiveRole] = useState<"admin" | "team" | "customer">("admin")

  const roles: Record<"admin" | "team" | "customer", RoleData> = {
    admin: {
      title: "Administrator",
      icon: <UserCog className="h-6 w-6" />,
      description: "Complete control over projects, teams, and system settings",
      color: "from-indigo-500 to-purple-600",
      features: [
        {
          icon: <Users className="h-5 w-5 text-indigo-500" />,
          title: "Team Management",
          description: "Add, remove, and manage team members and their permissions",
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
          title: "Advanced Analytics",
          description: "Access detailed reports and performance metrics",
        },
        {
          icon: <Shield className="h-5 w-5 text-indigo-500" />,
          title: "Security Controls",
          description: "Manage security settings and access controls",
        },
        {
          icon: <Settings className="h-5 w-5 text-indigo-500" />,
          title: "System Configuration",
          description: "Configure system-wide settings and integrations",
        },
      ],
    },
    team: {
      title: "Team Member",
      icon: <User className="h-6 w-6" />,
      description: "Collaborate on projects and manage assigned tasks",
      color: "from-blue-500 to-cyan-500",
      features: [
        {
          icon: <CheckSquare className="h-5 w-5 text-blue-500" />,
          title: "Task Management",
          description: "Update task status and track progress",
        },
        {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          title: "Time Tracking",
          description: "Log time spent on tasks and projects",
        },
        {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          title: "Team Communication",
          description: "Collaborate with team members in real-time",
        },
        {
          icon: <Bell className="h-5 w-5 text-blue-500" />,
          title: "Notifications",
          description: "Stay updated with task assignments and mentions",
        },
      ],
    },
    customer: {
      title: "Customer",
      icon: <Users className="h-6 w-6" />,
      description: "Submit projects and track their progress",
      color: "from-emerald-500 to-teal-500",
      features: [
        {
          icon: <FileText className="h-5 w-5 text-emerald-500" />,
          title: "Project Submission",
          description: "Submit new project requests with detailed requirements",
        },
        {
          icon: <ClipboardList className="h-5 w-5 text-emerald-500" />,
          title: "Project Tracking",
          description: "Monitor the status and progress of your projects",
        },
        {
          icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
          title: "Direct Communication",
          description: "Communicate directly with project managers",
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-emerald-500" />,
          title: "Project Analytics",
          description: "View reports and analytics for your projects",
        },
      ],
    },
  }

  const currentRole = roles[activeRole]

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Features for Every Role
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            TaskFlow provides tailored features for administrators, team members, and customers
          </motion.p>
        </div>

        {/* Role selector tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border p-1 bg-card/50 backdrop-blur-sm">
            {(Object.keys(roles) as Array<keyof typeof roles>).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeRole === role ? `bg-gradient-to-r ${roles[role].color} text-white shadow-md` : "hover:bg-muted",
                )}
              >
                {roles[role].icon}
                {roles[role].title}
              </button>
            ))}
          </div>
        </div>

        {/* Role features */}
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${currentRole.color} text-white mb-4`}
            >
              {currentRole.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentRole.title}</h3>
            <p className="text-muted-foreground">{currentRole.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentRole.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${currentRole.color} bg-opacity-10 flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

