"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Users, BookOpen, MessageSquare, TrendingUp, TrendingDown, ArrowRight, Download } from "lucide-react"
import { api2 } from "@/lib/api"
import { generatePDF } from "@/components/institute-analytics-pdf"

interface Institute {
  id: number
  name: string
  full_name: string
  description: string | null
  analysis: string | null
  created_at: string | null
  updated_at: string | null
  professors_count: number
}

interface Professor {
  id: number
  name: string
  avg_rating: number
  completion_rate: number
}

interface Classroom {
  id: number
  name: string
  avg_rating: number
  completion_rate: number
}

interface Analytics {
  institute: {
    id: string
    name: string
  }
  totals: {
    professors: number
    classrooms_active: number
    classrooms_archived: number
    students_total: number
    students_enrolled: number
  }
  feedback: {
    total_feedbacks: number
    completion_rate: number
  }
  ratings: {
    average_rating: number
  }
  sentiment: {
    positive_percentage: number
    neutral_percentage: number
    negative_percentage: number
  }
  highlights: {
    top_professors: Professor[]
    lowest_professors: Professor[]
    top_classrooms: Classroom[]
    lowest_classrooms: Classroom[]
  }
}

export default function InstituteAnalyticsDashboard() {
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all")
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false)
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false)

  useEffect(() => {
    fetchInstitutes()
  }, [])

  useEffect(() => {
    if (selectedInstitute) {
      fetchAnalytics(selectedInstitute)
    }
  }, [selectedInstitute])

  const fetchInstitutes = async () => {
    try {
      const response = await api2.get("/api/institutes")
      setInstitutes(response.data.data || [])
    } catch (error) {
      console.error("Error fetching institutes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (instituteId: string) => {
    setAnalyticsLoading(true)
    try {
      const url =
        instituteId === "all" ? "/api/analytics-institutes" : `/api/analytics-institutes?institute_id=${instituteId}`
      const response = await api2.get(url)
      setAnalytics(response.data || null)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!analytics) return

    setPdfGenerating(true)
    try {
      await generatePDF(analytics)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setPdfGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Institute Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor performance and feedback across institutes</p>
          </div>

          <div className="flex items-center gap-3">
            {analytics && (
              <Button onClick={handleGeneratePDF} disabled={pdfGenerating} className="gap-2">
                {pdfGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            )}

            <Select value={selectedInstitute} onValueChange={setSelectedInstitute}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select an institute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutes</SelectItem>
                {institutes.map((institute) => (
                  <SelectItem key={institute.id} value={institute.id.toString()}>
                    {institute.name} - {institute.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : analytics ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Professors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totals.professors}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Classrooms</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totals.classrooms_active}</div>
                  <p className="text-xs text-muted-foreground mt-1">{analytics.totals.classrooms_archived} archived</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totals.students_total}</div>
                  <p className="text-xs text-muted-foreground mt-1">{analytics.totals.students_enrolled} enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Feedbacks</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.feedback.total_feedbacks}</div>
                  <p className="text-xs text-muted-foreground mt-1">{analytics.feedback.completion_rate}% completion</p>
                </CardContent>
              </Card>
            </div>

            {/* Rating and Sentiment Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Rating</CardTitle>
                  <CardDescription>Average rating across all feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl font-bold text-foreground">
                      {analytics.ratings.average_rating.toFixed(1)}
                    </div>
                    <div className="text-yellow-500 text-2xl">★★★★★</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Feedback sentiment distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Positive</span>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                      {analytics.sentiment.positive_percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${analytics.sentiment.positive_percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Neutral</span>
                    <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      {analytics.sentiment.neutral_percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all"
                      style={{ width: `${analytics.sentiment.neutral_percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Negative</span>
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">
                      {analytics.sentiment.negative_percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${analytics.sentiment.negative_percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Performing Professors
                  </CardTitle>
                  <CardDescription>Highest rated professors by completion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.highlights.top_professors.map((prof: Professor) => (
                      <div key={prof.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{prof.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {prof.id}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{prof.avg_rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{prof.completion_rate}% complete</p>
                          </div>
                          <Link href={`/admin/professors/${prof.id}`} passHref>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Performing Classrooms
                  </CardTitle>
                  <CardDescription>Highest rated classrooms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.highlights.top_classrooms.map((classroom: Classroom) => (
                      <div key={classroom.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{classroom.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {classroom.id}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{classroom.avg_rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{classroom.completion_rate}% complete</p>
                          </div>
                          <Link href={`/admin/classrooms/${classroom.id}`} passHref>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Needs Improvement Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Needs Improvement - Professors
                  </CardTitle>
                  <CardDescription>Professors requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.highlights.lowest_professors.map((prof: Professor) => (
                      <div key={prof.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{prof.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {prof.id}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{prof.avg_rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{prof.completion_rate}% complete</p>
                          </div>
                          <Link href={`/admin/professors/${prof.id}`} passHref>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4 text-red-600" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Needs Improvement - Classrooms
                  </CardTitle>
                  <CardDescription>Classrooms requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.highlights.lowest_classrooms.map((classroom: Classroom) => (
                      <div key={classroom.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{classroom.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {classroom.id}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{classroom.avg_rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{classroom.completion_rate}% complete</p>
                          </div>
                          <Link href={`/admin/classrooms/${classroom.id}`} passHref>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4 text-red-600" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No analytics data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
