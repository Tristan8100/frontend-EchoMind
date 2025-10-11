"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Users, GraduationCap, Shield, Brain, CheckCircle, Menu } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/toogle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    // Wait for sheet to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
                <path
                  d="M20 10L28 16V24L20 30L12 24V16L20 10Z"
                  fill="currentColor"
                  className="text-primary-foreground"
                  opacity="0.9"
                />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="text-primary-foreground" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">EchoMind AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#ai-insights"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Insights
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
            <ModeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-4 sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                        <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
                        <path
                          d="M20 10L28 16V24L20 30L12 24V16L20 10Z"
                          fill="currentColor"
                          className="text-primary-foreground"
                          opacity="0.9"
                        />
                        <circle cx="20" cy="20" r="4" fill="currentColor" className="text-primary-foreground" />
                      </svg>
                    </div>
                    <span>EchoMind AI</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-6 mt-8">
                  <Link
                    href="#features"
                    onClick={(e) => handleMobileNavClick(e, "features")}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    onClick={(e) => handleMobileNavClick(e, "how-it-works")}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="#ai-insights"
                    onClick={(e) => handleMobileNavClick(e, "ai-insights")}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    AI Insights
                  </Link>

                  <div className="border-t border-border pt-6 flex flex-col gap-3">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced SVG Background */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient blob - top right */}
          <svg className="absolute -top-40 -right-40 w-[900px] h-[900px] opacity-20" viewBox="0 0 900 900">
            <defs>
              <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.4 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="450" cy="300" r="350" fill="url(#heroGrad1)" filter="url(#glow)" />
            <circle cx="650" cy="500" r="250" fill="hsl(var(--accent))" opacity="0.3" />
          </svg>

          {/* Geometric shapes - bottom left */}
          <svg className="absolute -bottom-20 -left-20 w-[700px] h-[700px] opacity-15" viewBox="0 0 700 700">
            <defs>
              <linearGradient id="heroGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>
            <polygon points="350,100 650,600 50,600" fill="url(#heroGrad2)" />
            <circle cx="200" cy="200" r="150" fill="hsl(var(--secondary))" opacity="0.4" />
          </svg>

          {/* Floating circles pattern */}
          <svg className="absolute top-1/4 left-1/4 w-[400px] h-[400px] opacity-10" viewBox="0 0 400 400">
            <circle cx="100" cy="100" r="60" fill="hsl(var(--primary))" />
            <circle cx="300" cy="150" r="80" fill="hsl(var(--accent))" />
            <circle cx="200" cy="300" r="70" fill="hsl(var(--secondary))" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground mb-6 border border-border/50">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Evaluation Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-balance">
              Transform Professor Evaluations with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Echomind AI</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 opacity-30"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,6 Q75,0 150,6 T300,6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-primary"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Our institutional evaluation system provides intelligent feedback analysis, sentiment analysis, and
              performance summaries to track and improve professor performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
              >
                Contact Administrator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-border hover:bg-muted/50 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image with Custom Frame */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 z-10 pointer-events-none" />
              <Image
                src="/images/img2.jpg"
                alt="Modern university campus with students"
                width={1200}
                height={600}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>

            <svg className="absolute -top-12 -left-12 w-40 h-40 opacity-30" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="accentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
                  <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#accentGrad1)" />
            </svg>
            <svg className="absolute -bottom-12 -right-12 w-48 h-48 opacity-25" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "hsl(var(--secondary))" }} />
                  <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="80" height="80" rx="16" fill="url(#accentGrad2)" />
            </svg>
            <svg className="absolute top-1/2 -right-20 w-32 h-32 opacity-20" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced SVG Backgrounds */}
      <section id="features" className="relative py-24 px-6 bg-muted/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10" viewBox="0 0 600 600">
            <defs>
              <linearGradient id="featuresGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
              </linearGradient>
            </defs>
            <rect x="100" y="100" width="400" height="400" rx="80" fill="url(#featuresGrad)" />
          </svg>

          <svg className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-12" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="200" fill="hsl(var(--accent))" />
            <circle cx="150" cy="150" r="100" fill="hsl(var(--primary))" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for Every Role in Education</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're an administrator, professor, or student, our platform provides tailored tools for
              meaningful evaluation experiences.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Admin Card */}
            <Card className="group relative overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-15">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
                      <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
                    </linearGradient>
                  </defs>
                  <polygon points="50,10 90,90 10,90" fill="url(#cardGrad1)" />
                </svg>
              </div>

              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/img3.jpg"
                  alt="School administration office"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              <div className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-3">For School Administration</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Complete oversight and institutional management by school leadership
                </p>

                <ul className="space-y-3">
                  {[
                    "Manage all users and classrooms",
                    "Monitor professor performance",
                    "Identify excellence and improvement areas",
                    "Generate comprehensive institutional reports",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Professor Card */}
            <Card className="group relative overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 lg:mt-8">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-15">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "hsl(var(--secondary))" }} />
                      <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill="url(#cardGrad2)" />
                </svg>
              </div>

              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/img4.jpg"
                  alt="Professor teaching in classroom"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              <div className="p-8">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <GraduationCap className="w-7 h-7 text-secondary-foreground" />
                </div>

                <h3 className="text-2xl font-bold mb-3">For Professors</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  AI-powered insights to enhance teaching effectiveness
                </p>

                <ul className="space-y-3">
                  {[
                    "Create and manage classrooms",
                    "View student evaluations",
                    "AI sentiment analysis",
                    "Performance summaries",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Student Card */}
            <Card className="group relative overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-15">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "hsl(var(--accent))" }} />
                      <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#cardGrad3)" />
                </svg>
              </div>

              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/img5.jpg"
                  alt="Students studying together"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              <div className="p-8">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <Users className="w-7 h-7 text-accent-foreground" />
                </div>

                <h3 className="text-2xl font-bold mb-3">For Students</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Simple, secure evaluation submission process
                </p>

                <ul className="space-y-3">
                  {[
                    "Join via invite links",
                    "Submit evaluations anytime",
                    "Anonymous feedback options",
                    "User-friendly interface",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Insights Section with Enhanced SVG */}
      <section id="ai-insights" className="relative py-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-8"
            viewBox="0 0 1200 1200"
          >
            <defs>
              <radialGradient id="aiGrad">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 0.2 }} />
              </radialGradient>
            </defs>
            <circle cx="600" cy="600" r="500" fill="url(#aiGrad)" />
          </svg>

          {/* Floating geometric shapes */}
          <svg className="absolute top-20 right-20 w-[300px] h-[300px] opacity-12" viewBox="0 0 300 300">
            <rect
              x="50"
              y="50"
              width="200"
              height="200"
              rx="40"
              fill="hsl(var(--primary))"
              transform="rotate(15 150 150)"
            />
          </svg>

          <svg className="absolute bottom-20 left-20 w-[250px] h-[250px] opacity-15" viewBox="0 0 250 250">
            <polygon points="125,25 225,200 25,200" fill="hsl(var(--accent))" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground mb-6 border border-border/50">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Evaluation Platform</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-balance">
              Transform Professor Evaluations with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Echomind AI</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 opacity-30"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,6 Q75,0 150,6 T300,6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-primary"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Our institutional evaluation system provides intelligent feedback analysis, sentiment analysis, and
              performance summaries to track and improve professor performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
              >
                Contact Administrator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-border hover:bg-muted/50 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image with Custom Frame */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 z-10 pointer-events-none" />
              <Image
                src="/images/img2.jpg"
                alt="Modern university campus with students"
                width={1200}
                height={600}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>

            {/* Floating SVG Accents */}
            <svg className="absolute -top-6 -left-6 w-24 h-24 text-primary opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
            <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-secondary opacity-20" viewBox="0 0 100 100">
              <rect x="10" y="10" width="80" height="80" rx="16" fill="currentColor" />
            </svg>
          </div>
        </div>
      </section>

      {/* How It Works Section with Enhanced SVG */}
      <section id="how-it-works" className="relative py-24 px-6 bg-muted/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 left-1/4 w-[500px] h-[500px] opacity-10" viewBox="0 0 500 500">
            <defs>
              <linearGradient id="workflowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
              </linearGradient>
            </defs>
            <circle cx="250" cy="250" r="200" fill="url(#workflowGrad1)" />
          </svg>

          <svg className="absolute bottom-0 right-1/4 w-[450px] h-[450px] opacity-12" viewBox="0 0 450 450">
            <rect x="75" y="75" width="300" height="300" rx="60" fill="hsl(var(--accent))" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Streamlined Internal Process</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our institutional platform provides seamless evaluation management for your school
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-border shadow-xl">
              <Image
                src="/images/img1.webp"
                alt="University evaluation workflow process"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <svg
              className="hidden md:block absolute top-24 left-0 w-full h-2 pointer-events-none"
              viewBox="0 0 1000 20"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
                  <stop offset="50%" style={{ stopColor: "hsl(var(--accent))" }} />
                  <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
                </linearGradient>
              </defs>
              <line
                x1="200"
                y1="10"
                x2="800"
                y2="10"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeDasharray="8 8"
                opacity="0.4"
              />
            </svg>

            {[
              {
                number: "1",
                title: "Admin Setup",
                description: "School administrators create professor accounts and manage classroom assignments",
                color: "bg-primary text-primary-foreground",
                icon: Shield,
              },
              {
                number: "2",
                title: "Students Join & Evaluate",
                description: "Students join classrooms via invite links and submit evaluations anytime",
                color: "bg-secondary text-secondary-foreground",
                icon: Users,
              },
              {
                number: "3",
                title: "AI Analyzes & Reports",
                description: "Our AI processes feedback and generates actionable insights for administration review",
                color: "bg-accent text-accent-foreground",
                icon: Brain,
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <svg className="absolute w-32 h-32 opacity-20" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`stepGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          style={{
                            stopColor: step.color.includes("primary")
                              ? "hsl(var(--primary))"
                              : step.color.includes("secondary")
                                ? "hsl(var(--secondary))"
                                : "hsl(var(--accent))",
                          }}
                        />
                        <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.5 }} />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill={`url(#stepGrad${i})`} />
                  </svg>
                  <div
                    className={`relative w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
                <path
                  d="M20 10L28 16V24L20 30L12 24V16L20 10Z"
                  fill="currentColor"
                  className="text-primary-foreground"
                  opacity="0.9"
                />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="text-primary-foreground" />
              </svg>
            </div>
            <span className="text-lg font-semibold">EchoMind AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 EchoMind AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
