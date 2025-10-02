"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  BookOpen, 
  UserPlus, 
  Settings, 
  TrendingUp, 
  MessageSquare, 
  Brain,
  AlertTriangle,
  Download,
  Star,
  Eye,
  Calendar
} from "lucide-react"
import AddProfessorDialog from "@/components/admin/add-prof"
import { useRouter } from "next/navigation"
import { api2 } from "@/lib/api"

// Type definitions
interface SystemOverview {
  professors: {
    total: number
    active_with_classrooms: number
    without_classrooms: number
  }
  students: {
    total: number
    enrolled: number
    with_feedback: number
  }
  classrooms: {
    total: number
    active: number
    inactive: number
    avg_students_per_classroom: number
  }
  feedback: {
    total_feedback: number
    average_rating: number
    completion_rate: number
  }
  sentiment: {
    positive: number
    negative: number
    neutral: number
    positive_percentage: number
  }
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
  professor: {
    id: number
    name: string
    email: string
  }
  total_students: number
  students_with_ratings: number
  average_rating: number
  positive_sentiment_percentage: number
  feedback_completion_rate: number
  created_at: string
}

interface ContentModeration {
  low_rated_classrooms: Array<{
    classroom_id: number
    classroom_name: string
    subject: string
    professor_name: string
    professor_email: string
    average_rating: number
    total_ratings: number
    status: string
  }>
  negative_feedback: Array<{
    id: number
    classroom_name: string
    subject: string
    professor_name: string
    student_name: string
    rating: number
    comment: string
    sentiment_score: number
    date: string
  }>
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
        const [
          overviewRes,
          professorsRes,
          classroomsRes
        ] = await Promise.all([
          api2.get('/api/admin-system-overview'),
          api2.get('/api/admin-professor-analytics?limit=10&sort_by=average_rating'),
          api2.get('/api/admin-classroom-analytics?limit=10')
        ])

        setOverview(overviewRes.data)
        setProfessors(professorsRes.data)
        setClassrooms(classroomsRes.data)
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return <div className="p-6">Loading admin dashboard...</div>
  }

  if (!overview) {
    return <div className="p-6">Failed to load dashboard data.</div>
  }

  return (
    <div className="space-y-6">
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
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Professors</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.professors.total}</div>
            <p className="text-xs text-muted-foreground">
              {overview.professors.active_with_classrooms} active, {overview.professors.without_classrooms} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.students.total}</div>
            <p className="text-xs text-muted-foreground">
              {overview.students.enrolled} enrolled, {overview.students.with_feedback} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classrooms</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.classrooms.active}</div>
            <p className="text-xs text-muted-foreground">
              {overview.classrooms.total} total, {overview.classrooms.avg_students_per_classroom} avg students
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.feedback.average_rating}/5</div>
            <p className="text-xs text-muted-foreground">
              {overview.feedback.completion_rate}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-border">
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

        <Card className="bg-card text-card-foreground border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              System Activity
            </CardTitle>
            <CardDescription>Recent system activity and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded bg-background">
                  <p className="text-2xl font-bold text-green-600">{overview.feedback.total_feedback}</p>
                  <p className="text-sm text-muted-foreground">Total Evaluations</p>
                </div>
                <div className="text-center p-4 rounded bg-background">
                  <p className="text-2xl font-bold text-blue-600">{overview.feedback.completion_rate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Activity Highlights</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-background">
                    <span className="text-sm">Active Professors</span>
                    <Badge variant="default">{overview.professors.active_with_classrooms}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background">
                    <span className="text-sm">Students with Feedback</span>
                    <Badge variant="secondary">{overview.students.with_feedback}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background">
                    <span className="text-sm">Active Classrooms</span>
                    <Badge variant="outline">{overview.classrooms.active}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Professors */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Top Performing Professors</CardTitle>
            <CardDescription className="text-muted-foreground">Professors ranked by average rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {professors.slice(0, 5).map((prof, index) => (
              <div key={prof.id} className="p-4 rounded-lg bg-background border border-input">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{prof.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(prof.average_rating))}
                    </div>
                    <p className="text-xs text-muted-foreground">{prof.average_rating}/5</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>{prof.active_classrooms} classrooms</span>
                  <span>{prof.total_students} students</span>
                  <span>{prof.positive_percentage}% positive</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Classroom Activity */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Recent Classroom Activity</CardTitle>
            <CardDescription className="text-muted-foreground">Latest classroom performance data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {classrooms.slice(0, 5).map((classroom) => (
              <div key={classroom.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-input">
                <div>
                  <p className="text-sm font-medium">{classroom.name}</p>
                  <p className="text-xs text-muted-foreground">{classroom.professor.name} • {classroom.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={classroom.status === 'active' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {classroom.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{classroom.total_students} students</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(Math.round(classroom.average_rating))}
                  </div>
                  <p className="text-xs text-muted-foreground">{classroom.feedback_completion_rate}% feedback</p>
                  <p className="text-xs text-muted-foreground">{classroom.positive_sentiment_percentage}% positive</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Stats Summary */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            System Summary
          </CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}