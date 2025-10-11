'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Users,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Brain,
  Star,
  Eye,
} from "lucide-react"
import AddProfessorDialog from "@/components/admin/add-prof"
import { useRouter } from "next/navigation"
import { api2 } from "@/lib/api"

interface SystemOverview {
  professors: { total: number; active_with_classrooms: number; without_classrooms: number }
  students: { total: number; enrolled: number; with_feedback: number }
  classrooms: { total: number; active: number; inactive: number; avg_students_per_classroom: number }
  feedback: { total_feedback: number; average_rating: number; completion_rate: number }
  sentiment: { positive: number; negative: number; neutral: number; positive_percentage: number }
}

interface ProfessorAnalytic {
  id: number
  name: string
  email: string
  total_classrooms: number
  active_classrooms: number
  total_students: number
  total_ratings: number
  average_rating: number
  positive_sentiments: number
  negative_sentiments: number
  positive_percentage: number
  feedback_completion_rate: number
}

interface ClassroomAnalytic {
  id: number
  name: string
  subject: string
  status: string
  code: string
  professor: { id: number; name: string; email: string }
  total_students: number
  students_with_ratings: number
  average_rating: number
  positive_sentiment_percentage: number
  feedback_completion_rate: number
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [overview, setOverview] = useState<SystemOverview | null>(null)
  const [professors, setProfessors] = useState<ProfessorAnalytic[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomAnalytic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        const [overviewRes, professorsRes, classroomsRes] = await Promise.all([
          api2.get('/api/admin-system-overview'),
          api2.get('/api/admin-professor-analytics?limit=10&sort_by=average_rating'),
          api2.get('/api/admin-classroom-analytics?limit=10'),
        ])
        setOverview(overviewRes.data)
        setProfessors(professorsRes.data)
        setClassrooms(classroomsRes.data)
      } catch (error) {
        toast.error("Failed to load dashboard data")
        console.error("Admin dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))

  //
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="p-4 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-full" />
          </Card>
          <Card className="p-4 lg:col-span-2 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
          </Card>
        </div>
      </div>
    )
  }

  if (!overview)
    return (
      <div className="p-6 text-red-500 font-medium">
        Failed to load dashboard data. Try reloading.
      </div>
    )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System Administration Portal</p>
        </div>
        <div className="flex gap-2">
          <AddProfessorDialog />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Professors",
            value: overview.professors.total,
            desc: `${overview.professors.active_with_classrooms} active, ${overview.professors.without_classrooms} inactive`,
            icon: <Users className="h-4 w-4 text-secondary" />,
          },
          {
            title: "Total Students",
            value: overview.students.total,
            desc: `${overview.students.enrolled} enrolled, ${overview.students.with_feedback} active`,
            icon: <Users className="h-4 w-4 text-secondary" />,
          },
          {
            title: "Active Classrooms",
            value: overview.classrooms.active,
            desc: `${overview.classrooms.total} total, ${overview.classrooms.avg_students_per_classroom} avg students`,
            icon: <BookOpen className="h-4 w-4 text-secondary" />,
          },
          {
            title: "System Rating",
            value: `${overview.feedback.average_rating}/5`,
            desc: `${overview.feedback.completion_rate}% completion rate`,
            icon: <TrendingUp className="h-4 w-4 text-secondary" />,
          },
        ].map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sentiment + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Sentiment Analysis
            </CardTitle>
            <CardDescription>System-wide feedback sentiment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Positive Sentiment</span>
                <span>{overview.sentiment.positive_percentage}%</span>
              </div>
              <Progress value={overview.sentiment.positive_percentage} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-medium text-green-600">{overview.sentiment.positive}</p>
                <p className="text-xs text-muted-foreground">Positive</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{overview.sentiment.neutral}</p>
                <p className="text-xs text-muted-foreground">Neutral</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">{overview.sentiment.negative}</p>
                <p className="text-xs text-muted-foreground">Negative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              System Activity
            </CardTitle>
            <CardDescription>Recent system activity and usage</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded bg-background">
              <p className="text-2xl font-bold text-green-600">{overview.feedback.total_feedback}</p>
              <p className="text-sm text-muted-foreground">Total Evaluations</p>
            </div>
            <div className="text-center p-3 rounded bg-background">
              <p className="text-2xl font-bold text-blue-600">{overview.feedback.completion_rate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center p-3 rounded bg-background">
              <p className="text-2xl font-bold text-purple-600">{overview.sentiment.positive_percentage}%</p>
              <p className="text-sm text-muted-foreground">Positive Sentiment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Professors & Recent Classrooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Professors</CardTitle>
            <CardDescription>Ranked by average rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {professors.slice(0, 5).map((prof, index) => (
              <div key={prof.id} className="p-3 rounded bg-background border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === 0
                          ? 'bg-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{prof.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(prof.average_rating))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {prof.active_classrooms} classrooms • {prof.total_students} students
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Classroom Activity</CardTitle>
            <CardDescription>Latest performance insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {classrooms.slice(0, 5).map((c) => (
              <div key={c.id} className="p-3 rounded bg-background border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.professor.name} • {c.subject}</p>
                  </div>
                  <div className="flex items-center gap-1">{renderStars(Math.round(c.average_rating))}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.feedback_completion_rate}% feedback • {c.positive_sentiment_percentage}% positive
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            System Summary
          </CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded bg-background">
            <p className="text-2xl font-bold text-green-600">{overview.feedback.total_feedback}</p>
            <p className="text-sm text-muted-foreground">Total Evaluations</p>
          </div>
          <div className="text-center p-4 rounded bg-background">
            <p className="text-2xl font-bold text-blue-600">{overview.feedback.completion_rate}%</p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>
          <div className="text-center p-4 rounded bg-background">
            <p className="text-2xl font-bold text-purple-600">{overview.sentiment.positive_percentage}%</p>
            <p className="text-sm text-muted-foreground">Positive Sentiment</p>
          </div>
          <div className="text-center p-4 rounded bg-background">
            <p className="text-2xl font-bold text-orange-600">{overview.classrooms.avg_students_per_classroom}</p>
            <p className="text-sm text-muted-foreground">Avg Students/Class</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
