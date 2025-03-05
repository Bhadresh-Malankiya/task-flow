"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, FileText, ImageIcon, Loader2, Save, Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Define the schema for each step
const basicDetailsSchema = z.object({
  projectName: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget must be a positive number",
  }),
})

const projectDetailsSchema = z.object({
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  timeline: z.string().min(3, { message: "Please provide an estimated timeline" }),
  goals: z.string().min(10, { message: "Please describe your project goals" }),
})

const fileUploadSchema = z.object({
  // We'll validate files in the component
  files: z.any(),
})

const reviewSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to submit",
  }),
})

// Combined schema for the entire form
const projectSchema = z.object({
  ...basicDetailsSchema.shape,
  ...projectDetailsSchema.shape,
  ...fileUploadSchema.shape,
  ...reviewSchema.shape,
})

type ProjectFormValues = z.infer<typeof projectSchema>

// Define the steps
const steps = [
  { id: "basic", title: "Basic Details", schema: basicDetailsSchema },
  { id: "details", title: "Project Details", schema: projectDetailsSchema },
  { id: "files", title: "Upload Files", schema: fileUploadSchema },
  { id: "review", title: "Review & Submit", schema: reviewSchema },
]

export function ProjectSubmissionForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()

  // Use local storage for auto-save
  const [savedFormData, setSavedFormData] = useLocalStorage<Partial<ProjectFormValues>>("project-form-data", {})

  // Initialize form with saved data if available
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: savedFormData.projectName || "",
      budget: savedFormData.budget || "",
      description: savedFormData.description || "",
      timeline: savedFormData.timeline || "",
      goals: savedFormData.goals || "",
      termsAccepted: savedFormData.termsAccepted || false,
      files: [],
    },
    mode: "onChange",
  })

  // Calculate progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100

  // Auto-save form data when values change
  const autoSave = useCallback(() => {
    const values = form.getValues()
    setSavedFormData(values)
    setAutoSaving(true)
    setLastSaved(new Date())

    setTimeout(() => {
      setAutoSaving(false)
    }, 1000)
  }, [form, setSavedFormData])

  // Set up auto-save on form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      autoSave()
    })
    return () => subscription.unsubscribe()
  }, [form, autoSave])

  // Get the current step schema
  const currentSchema = steps[currentStep].schema

  // Handle next step
  const handleNext = async () => {
    // Validate the current step
    const isValid = await form.trigger(Object.keys(currentSchema.shape) as any)

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])

      // Show toast for successful upload
      toast({
        title: "Files uploaded",
        description: `${newFiles.length} file(s) added successfully.`,
      })
    }
  }

  // Remove a file
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  // Handle form submission
  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, you would send the data to your API
      console.log("Submitting project:", { ...data, files: uploadedFiles })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear saved form data
      setSavedFormData({})

      // Show success toast
      toast({
        title: "Project submitted successfully!",
        description: "We'll review your project and get back to you soon.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Progress tracker */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form card with glassmorphism effect */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Provide basic information about your project"}
                {currentStep === 1 && "Tell us more details about what you need"}
                {currentStep === 2 && "Upload any relevant files or images"}
                {currentStep === 3 && "Review your information before submitting"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Details */}
                    {currentStep === 0 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="projectName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Awesome Project" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="5000"
                                  {...field}
                                  onChange={(e) => {
                                    // Only allow positive numbers
                                    const value = e.target.value
                                    if (!value || Number(value) >= 0) {
                                      field.onChange(value)
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Project Details */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your project in detail..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Timeline</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2 weeks, 3 months" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="goals"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Goals</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What do you hope to achieve with this project?"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 3: File Uploads */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Input type="file" id="file-upload" className="hidden" multiple onChange={handleFileUpload} />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center gap-2"
                          >
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <p className="text-lg font-medium">Drop files here or click to upload</p>
                            <p className="text-sm text-muted-foreground">Support for images, documents, and PDFs</p>
                            <Button type="button" variant="outline" className="mt-2">
                              Select Files
                            </Button>
                          </label>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                            <div className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                  <div className="flex items-center gap-2">
                                    {file.type.includes("image") ? (
                                      <ImageIcon className="h-5 w-5 text-primary" />
                                    ) : (
                                      <FileText className="h-5 w-5 text-primary" />
                                    )}
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">Basic Details</h3>
                            <p>
                              <span className="text-muted-foreground">Project Name:</span>{" "}
                              {form.getValues().projectName}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Budget:</span> ${form.getValues().budget}
                            </p>
                          </div>

                          <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">Project Details</h3>
                            <p>
                              <span className="text-muted-foreground">Timeline:</span> {form.getValues().timeline}
                            </p>
                            <div className="mt-2">
                              <p className="text-muted-foreground">Description:</p>
                              <p className="text-sm mt-1">{form.getValues().description}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-muted-foreground">Goals:</p>
                              <p className="text-sm mt-1">{form.getValues().goals}</p>
                            </div>
                          </div>

                          <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">Files</h3>
                            {uploadedFiles.length > 0 ? (
                              <p>{uploadedFiles.length} file(s) uploaded</p>
                            ) : (
                              <p className="text-muted-foreground">No files uploaded</p>
                            )}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 mt-1"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>I agree to the terms and conditions</FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                {autoSaving && (
                  <span className="flex items-center">
                    <Save className="h-3 w-3 mr-1 animate-pulse" /> Auto-saving...
                  </span>
                )}
                {!autoSaving && lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="flex-1 sm:flex-initial">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !form.formState.isValid}
                    className="flex-1 sm:flex-initial"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Submit Project
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

