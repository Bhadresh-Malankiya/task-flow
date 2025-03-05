import { format } from "date-fns"

// Helper functions for formatting dates
export const safeFormatDistance = (dateString: string | undefined) => {
  if (!dateString) return "recently"
  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) return "recently"
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "recently"
  }
}

export const safeFormat = (dateString: string | undefined, formatString: string) => {
  if (!dateString) return "Unknown time"
  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) return "Unknown time"
    return format(date, formatString)
  } catch (error) {
    return "Unknown time"
  }
}

import { formatDistanceToNow } from "date-fns"

