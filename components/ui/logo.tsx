import Link from "next/link"
import { Zap } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 shadow-md">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-xl">TaskFlow</span>
    </Link>
  )
}

