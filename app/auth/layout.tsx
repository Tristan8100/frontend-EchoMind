"use client"
import type { ReactNode } from "react"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { CarouselBasic } from "@/components/content"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2 bg-background text-foreground overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-15" viewBox="0 0 600 600">
          <defs>
            <linearGradient id="auth-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="280" fill="url(#auth-gradient-1)" />
        </svg>


        <svg className="absolute -bottom-20 left-10 w-[400px] h-[400px] opacity-12" viewBox="0 0 400 400">
          <defs>
            <radialGradient id="auth-gradient-2">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="180" ry="220" fill="url(#auth-gradient-2)" />
        </svg>

        <svg className="absolute top-1/3 left-1/4 w-[120px] h-[120px] opacity-8" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="auth-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#auth-gradient-3)" />
        </svg>
      </div>

      {/* right */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none overflow-hidden hidden lg:block">
        {/* circle - top right */}
        <svg className="absolute -top-40 -right-40 w-[700px] h-[700px] opacity-10" viewBox="0 0 700 700">
          <defs>
            <linearGradient id="auth-gradient-4" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="50%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
          <circle cx="350" cy="350" r="320" fill="url(#auth-gradient-4)" />
        </svg>

        {/* Floating shapes svgs */}
        <svg className="absolute top-1/4 right-1/4 w-[200px] h-[200px] opacity-8" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="auth-gradient-5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <polygon points="100,20 180,180 20,180" fill="url(#auth-gradient-5)" />
        </svg>

        {/* Bottom*/}
        <svg className="absolute bottom-10 right-20 w-[500px] h-[500px] opacity-12" viewBox="0 0 500 500">
          <defs>
            <radialGradient id="auth-gradient-6">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="250" rx="200" ry="240" fill="url(#auth-gradient-6)" transform="rotate(-25 250 250)" />
        </svg>

        {/*grid pattern */}
        <svg className="absolute top-1/2 right-1/3 w-[150px] h-[150px] opacity-6" viewBox="0 0 150 150">
          <defs>
            <pattern id="auth-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill="hsl(var(--accent))" />
            </pattern>
          </defs>
          <rect width="150" height="150" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* left: auth children */}
      <div className="relative flex items-center justify-center p-6 md:p-10 z-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center lg:hidden mb-6 gap-2">
            <div className="relative">
              <svg className="absolute -inset-2 opacity-20" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="hsl(var(--primary))" />
              </svg>
              <GraduationCap className="relative h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EchoMind AI
            </span>
          </div>
          {children}
        </div>
      </div>

      {/* right: content */}
      <div className="relative hidden lg:flex h-full flex-col p-10 bg-card/50 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-2 self-start font-semibold text-foreground group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <svg className="absolute inset-0 opacity-20" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="white" />
            </svg>
            <GraduationCap className="relative h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            EchoMind AI
          </span>
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center text-center relative">
          {/* Decorative accent line */}
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 mb-8" viewBox="0 0 96 4">
            <defs>
              <linearGradient id="accent-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <rect width="96" height="4" rx="2" fill="url(#accent-line)" />
          </svg>

          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground mt-12">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EchoMind AI
            </span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            A smarter way to evaluate your professors with AI-powered insights and analytics.
          </p>

          <div className="flex justify-center mt-6">
            <CarouselBasic />
          </div>
        </div>

        <div className="relative text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L10 6H16L11 10L13 16L8 12L3 16L5 10L0 6H6L8 0Z" fill="hsl(var(--primary))" />
            </svg>
            <span>Built for a modern educational experience</span>
          </div>
        </div>
      </div>
    </div>
  )
}
