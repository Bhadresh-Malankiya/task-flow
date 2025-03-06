"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  User,
  Briefcase,
  ListTodo,
  Users,
  Settings,
  MessageSquare,
  X,
  Menu,
  LogOut,
  WifiOff,
  CheckCircle2,
  BarChart,
  RefreshCw,
  PlusCircle,
  Clock,
  XCircle,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import { ThemeToggle } from "@/components/theme-toggle"
import { useStore } from "@/store/store"
import { useProjectStore } from "@/store/project-store"
import { useAuthStore } from "@/store/auth-store"
import { ProjectList } from "@/components/project/project-list"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"

// Modify the Dashboard component to accept a hideContent prop
export const Dashboard = ({ hideContent = false }: { hideContent?: boolean }) => {
  const [showForm, setShowForm] = useState(false)
  const [activeView, setActiveView] = useState("overview")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { tasks, fetchTasks, isLoading: tasksLoading, offlineMode, error: tasksError } = useStore()
  const { projects, fetchProjects, isLoading: projectsLoading, error: projectsError } = useProjectStore()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  // Fetch data when dashboard loads
  useEffect(() => {
    if (user?.role === "customer" || user?.role === "admin") {
      fetchProjects()
    } else if (user?.role === "team_member" || user?.role === "admin") {
      fetchTasks()
    }
  }, [user, fetchProjects, fetchTasks])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isLoading = tasksLoading || projectsLoading
  const error = tasksError || projectsError

  // Calculate statistics
  const pendingProjects = projects.filter((p) => p.status === "pending").length
  const activeProjects = projects.filter((p) => p.status === "in_progress").length
  const completedProjects = projects.filter((p) => p.status === "completed").length

  const pendingTasks = tasks.filter((t) => !t.completed).length
  const completedTasks = tasks.filter((t) => t.completed).length
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
      { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    ]

    if (user?.role === "admin") {
      return [
        ...commonItems,
        { id: "projects", label: "Projects", icon: <Briefcase className="h-5 w-5" /> },
        { id: "tasks", label: "Tasks", icon: <ListTodo className="h-5 w-5" /> },
        { id: "team", label: "Team", icon: <Users className="h-5 w-5" /> },
        { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
      ]
    } else if (user?.role === "customer") {
      return [
        ...commonItems,
        { id: "projects", label: "My Projects", icon: <Briefcase className="h-5 w-5" /> },
        { id: "messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
      ]
    } else {
      // team_member
      return [
        ...commonItems,
        { id: "tasks", label: "My Tasks", icon: <ListTodo className="h-5 w-5" /> },
        { id: "messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
      ]
    }
  }

  const navigationItems = getNavigationItems()

  // Modify the return statement to conditionally render the content
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - Desktop always visible, mobile conditionally visible */}
      <div
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out bg-card/80 backdrop-blur-md border-r shadow-md`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4 border-b p-4 flex justify-center flex-col items-center">
              <div className="bg-primary rounded-full p-1.5">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">TaskFlow</span>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id)
                      setMobileSidebarOpen(false)
                      router.push("/dashboard")
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      activeView === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <ThemeToggle />
              </div>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content - only render if hideContent is false */}
      {!hideContent && (
        <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                {navigationItems.find((item) => item.id === activeView)?.label || "Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeView === "overview" && "Welcome to your dashboard"}
                {activeView === "projects" && "Manage your projects"}
                {activeView === "tasks" && "Track and manage tasks"}
                {activeView === "team" && "Manage your team members"}
                {activeView === "profile" && "Update your profile information"}
                {activeView === "settings" && "Configure your account settings"}
                {activeView === "messages" && "View your messages"}
              </p>
            </div>

            {offlineMode && (
              <Alert className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You're in offline mode. Changes will be saved locally but not synced to the server.
                </AlertDescription>
              </Alert>
            )}

            {/* Admin Dashboard - Overview */}
            {user?.role === "admin" && activeView === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                          <h3 className="text-3xl font-bold mt-1">{projects.length}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {projects.length > 0 ? "+2 from last month" : "No projects yet"}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                          <h3 className="text-3xl font-bold mt-1">{activeProjects}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{pendingProjects} pending approval</p>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                          <h3 className="text-3xl font-bold mt-1">{tasks.length}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{completedTasks} completed</p>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <ListTodo className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <h3 className="text-3xl font-bold mt-1">{taskCompletionRate}%</h3>
                          <p className="text-xs text-muted-foreground mt-1">{pendingTasks} tasks pending</p>
                        </div>
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <BarChart className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity and Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Recent Projects
                      </CardTitle>
                      <CardDescription>Latest project submissions and updates</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {projects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No projects found.</div>
                      ) : (
                        <div className="space-y-4">
                          {projects.slice(0, 3).map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{project.name}</h4>
                                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className={`
                                  ${project.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                                  ${project.status === "in_progress" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                                  ${project.status === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                                `}
                                  >
                                    {project.status.replace("_", " ")}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Budget: ${project.budget}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
                                View
                              </Button>
                            </div>
                          ))}
                          {projects.length > 3 && (
                            <Button variant="outline" className="w-full" onClick={() => setActiveView("projects")}>
                              View All Projects
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Recent Messages
                      </CardTitle>
                      <CardDescription>Latest communications</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">JD</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">John Doe</span>
                            <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                          </div>
                          <p className="text-sm">Can we discuss the project timeline?</p>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">AS</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">Alice Smith</span>
                            <span className="text-xs text-muted-foreground ml-auto">1d ago</span>
                          </div>
                          <p className="text-sm">I've submitted the design mockups for review.</p>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">RJ</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">Robert Johnson</span>
                            <span className="text-xs text-muted-foreground ml-auto">2d ago</span>
                          </div>
                          <p className="text-sm">Thanks for accepting my proposal!</p>
                        </div>

                        <Button variant="outline" className="w-full" onClick={() => setActiveView("messages")}>
                          View All Messages
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Task Progress */}
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary" />
                      Task Progress
                    </CardTitle>
                    <CardDescription>Overview of task completion status</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Overall Progress</h4>
                          <p className="text-sm text-muted-foreground">
                            {completedTasks} of {tasks.length} tasks completed
                          </p>
                        </div>
                        <span className="text-2xl font-bold">{taskCompletionRate}%</span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${taskCompletionRate}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-2xl font-bold text-amber-500">{pendingTasks}</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">In Progress</p>
                          <p className="text-2xl font-bold text-blue-500">
                            {tasks.filter((t) => t?.status === "in_progress").length}
                          </p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setActiveView("tasks")}>
                        View All Tasks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Admin Projects Tab */}
            {user?.role === "admin" && activeView === "projects" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div>
                      <CardTitle>All Projects</CardTitle>
                      <CardDescription>Manage all customer projects</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => fetchProjects()} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        onClick={() => router.push("/submit-project")}
                        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ProjectList projects={projects} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Admin Tasks Tab */}
            {user?.role === "admin" && activeView === "tasks" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div>
                      <CardTitle>All Tasks</CardTitle>
                      <CardDescription>Manage tasks across all projects</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => fetchTasks()} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                      <Button onClick={() => setShowForm(!showForm)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {showForm && (
                      <div className="mb-6">
                        <TaskForm onComplete={() => setShowForm(false)} />
                      </div>
                    )}
                    <TaskList tasks={tasks} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Admin Team Tab */}
            {user?.role === "admin" && activeView === "team" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage team members and assignments</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-muted-foreground">Team management features coming soon.</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Profile Tab - Common for all users */}
            {activeView === "profile" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                          <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                              {user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                              <p className="font-medium">{user?.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Email</label>
                              <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Role</label>
                              <p className="font-medium capitalize">{user?.role?.replace("_", " ")}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Account ID</label>
                              <p className="font-medium">#{user?.id}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">Edit Profile</Button>
                            <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab - Common for all users */}
            {activeView === "settings" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                            </div>
                            <div className="h-6 w-11 bg-muted rounded-full p-1 cursor-pointer">
                              <div className="h-4 w-4 rounded-full bg-primary ml-auto"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Project Updates</p>
                              <p className="text-sm text-muted-foreground">Get notified about project status changes</p>
                            </div>
                            <div className="h-6 w-11 bg-muted rounded-full p-1 cursor-pointer">
                              <div className="h-4 w-4 rounded-full bg-primary ml-auto"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Privacy</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Profile Visibility</p>
                              <p className="text-sm text-muted-foreground">
                                Control who can see your profile information
                              </p>
                            </div>
                            <select className="bg-muted rounded p-1 text-sm">
                              <option>Everyone</option>
                              <option>Team Only</option>
                              <option>Private</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Customer Dashboard */}
            {user?.role === "customer" && activeView === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                          <h3 className="text-3xl font-bold mt-1">{projects.length}</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                          <h3 className="text-3xl font-bold mt-1">{activeProjects}</h3>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pending Projects</p>
                          <h3 className="text-3xl font-bold mt-1">{pendingProjects}</h3>
                        </div>
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <Clock className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projects and Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <div>
                        <CardTitle>My Projects</CardTitle>
                        <CardDescription>Manage your project submissions</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => fetchProjects()} disabled={isLoading}>
                          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        </Button>
                        <Button
                          onClick={() => router.push("/submit-project")}
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          New Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ProjectList projects={projects} />
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <CardTitle>Overview</CardTitle>
                      <CardDescription>Your activity summary</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <p className="text-sm font-medium">Projects</p>
                          </div>
                          <p className="text-2xl font-bold mt-1">{projects.length}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending: {projects.filter((p) => p.status === "pending").length}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Active: {projects.filter((p) => p.status === "in_progress").length}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Completed: {projects.filter((p) => p.status === "completed").length}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <p className="text-sm font-medium">Recent Activity</p>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>• Project proposal received (2 days ago)</p>
                            <p>• Message from admin (1 week ago)</p>
                            <p>• Project status updated (2 weeks ago)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Customer Projects View */}
            {user?.role === "customer" && activeView === "projects" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div>
                      <CardTitle>My Projects</CardTitle>
                      <CardDescription>Manage your project submissions</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => fetchProjects()} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        onClick={() => router.push("/submit-project")}
                        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ProjectList projects={projects} />
                  </CardContent>
                </Card>

                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle>Submit a New Project</CardTitle>
                    <CardDescription>Have a new project idea? Let us know the details!</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Button
                      onClick={() => router.push("/submit-project")}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Team Member Dashboard */}
            {user?.role === "team_member" && activeView === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                          <h3 className="text-3xl font-bold mt-1">{tasks.length}</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ListTodo className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completed</p>
                          <h3 className="text-3xl font-bold mt-1">{completedTasks}</h3>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <h3 className="text-3xl font-bold mt-1">{taskCompletionRate}%</h3>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <BarChart className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <div>
                        <CardTitle>My Tasks</CardTitle>
                        <CardDescription>Manage your assigned tasks</CardDescription>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => fetchTasks()} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <TaskList tasks={tasks} />
                    </CardContent>
                  </Card>

                  <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <CardTitle>Performance</CardTitle>
                      <CardDescription>Your task completion metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <p className="text-sm font-medium">Tasks</p>
                          <p className="text-2xl font-bold">{tasks.length}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">Completed: {tasks.filter((task) => task.completed).length}</Badge>
                            <Badge variant="outline">Pending: {tasks.filter((task) => !task.completed).length}</Badge>
                          </div>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-primary" />
                            <p className="text-sm font-medium">Performance</p>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5 my-3">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${taskCompletionRate}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground">Task completion rate: {taskCompletionRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Team Member Tasks View */}
            {user?.role === "team_member" && activeView === "tasks" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div>
                      <CardTitle>My Tasks</CardTitle>
                      <CardDescription>Manage your assigned tasks</CardDescription>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => fetchTasks()} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <TaskList tasks={tasks} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Messages View - For all users */}
            {activeView === "messages" && (
              <div className="space-y-6">
                <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with your team and clients</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p>Select a project to view messages</p>
                      <Button className="mt-4" onClick={() => setActiveView("projects")}>
                        View Projects
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

