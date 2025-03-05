"use client"

import { cn } from "@/lib/utils"

interface PasswordStrengthIndicatorProps {
  strength: number // 0-5 scale
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthText = () => {
    if (strength === 0) return "No password"
    if (strength === 1) return "Very weak"
    if (strength === 2) return "Weak"
    if (strength === 3) return "Medium"
    if (strength === 4) return "Strong"
    return "Very strong"
  }

  const getStrengthColor = () => {
    if (strength === 0) return "bg-muted"
    if (strength === 1) return "bg-red-500"
    if (strength === 2) return "bg-orange-500"
    if (strength === 3) return "bg-yellow-500"
    if (strength === 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              index <= strength ? getStrengthColor() : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{getStrengthText()}</p>
    </div>
  )
}

