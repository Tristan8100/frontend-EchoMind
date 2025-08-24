'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Users,
  GraduationCap,
  Shield,
  Brain,
  BarChart3,
  MessageSquare,
  Zap,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/toogle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">EchoMind AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#ai-insights" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Insights
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
                <Button variant="ghost">Sign Up</Button>
            </Link>
            <ModeToggle />
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-secondary text-secondary-foreground">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Evaluation Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Professor Evaluations with <span className="text-primary">Echomind AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Our institutional evaluation system provides intelligent feedback analysis,
            sentiment analysis, and performance summaries to track and improve professor performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              Contact Administrator
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-border hover:bg-muted/50">
              Learn More
            </Button>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <Image
              src="/images/img2.jpg"
              alt="Modern university campus with students"
              width={1200}
              height={500}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl border border-input"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Role in Education</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're an administrator, professor, or student, our platform provides tailored tools for
              meaningful evaluation experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Card */}
            <Card className="relative overflow-hidden border border-input bg-background">
              <div className="h-32 overflow-hidden relative">
                <Image
                  src="/images/img3.jpg"
                  alt="School administration office"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">For School Administration</CardTitle>
                <CardDescription>Complete oversight and institutional management by school leadership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Manage all users and classrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Monitor professor performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Identify excellence and improvement areas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Generate comprehensive institutional reports</span>
                </div>
              </CardContent>
            </Card>

            {/* Professor Card */}
            <Card className="relative overflow-hidden border-border bg-background">
              <div className="h-32 overflow-hidden relative">
                <Image
                  src="/images/img4.jpg"
                  alt="Professor teaching in classroom"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">For Professors</CardTitle>
                <CardDescription>AI-powered insights to enhance teaching effectiveness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Create and manage classrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">View student evaluations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">AI sentiment analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Performance summaries</span>
                </div>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="relative overflow-hidden border border-input bg-background">
              <div className="h-32 overflow-hidden relative">
                <Image
                  src="/images/img5.jpg"
                  alt="Students studying together"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">For Students</CardTitle>
                <CardDescription>Simple, secure evaluation submission process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Join via invite links</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Submit evaluations anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Anonymous feedback options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">User-friendly interface</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section id="ai-insights" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-secondary text-secondary-foreground">
                <Zap className="w-4 h-4 mr-2" />
                Powered by AI
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent Analysis That Drives Results</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our advanced AI engine processes evaluation data to provide actionable insights, sentiment analysis, and
                performance trends that help educators improve and institutions excel.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mt-1 text-secondary-foreground">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sentiment Analysis</h3>
                    <p className="text-muted-foreground">
                      Automatically categorize feedback as positive, negative, or neutral
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mt-1 text-secondary-foreground">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Performance Trends</h3>
                    <p className="text-muted-foreground">Track improvement over time with detailed analytics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mt-1 text-secondary-foreground">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Summaries</h3>
                    <p className="text-muted-foreground">
                      Get concise, actionable insights from complex evaluation data
                    </p>
                    <p className="text-muted-foreground">
                      Identify areas of improvement with automatic summaries of instructor and course evaluations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-6 bg-card border border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Evaluation Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Rating</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div className="w-16 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.2/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Positive Sentiment</span>
                      <span className="text-sm font-medium text-green-600">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Negative</span>
                      <span className="text-sm font-medium text-red-600">22%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Key Insights:</strong> Students appreciate clear explanations and engaging lectures.
                      Consider incorporating more interactive elements.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamlined Internal Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our institutional platform provides seamless evaluation management for your school
            </p>
            <div className="mt-8 relative w-full max-w-2xl mx-auto h-48">
              <Image
                src="/images/img1.webp"
                alt="University evaluation workflow process"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Admin Setup</h3>
              <p className="text-muted-foreground">
                School administrators create professor accounts and manage classroom assignments
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary-foreground">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Students Join & Evaluate</h3>
              <p className="text-muted-foreground">
                Students join classrooms via invite links and submit evaluations anytime
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analyzes & Reports</h3>
              <p className="text-muted-foreground">
                Our AI processes feedback and generates actionable insights for administration review
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}