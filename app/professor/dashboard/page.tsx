"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"

// Type definitions
interface Stats {
  total_classrooms: number
  total_classroom_students: number
  students_with_feedback: number
  average_rating: number
  sentiment_distribution: { positive: number; negative: number; neutral: number }
  positive_percentage: number
}

interface ClassroomPerformance {
  id: number
  name: string
  subject: string
  student_count: number
  average_rating: number
  total_ratings: number
  positive_sentiment_percentage: number
}

interface RecentFeedback {
  id: number
  classroom_name: string
  classroom_subject: string
  student_name: string
  rating: number
  comment: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentiment_score: number
  date: string
  time_ago: string
}

interface TrendData {
  rating_trends: Array<{
    date: string
    avg_rating: number
    count: number
  }>
  sentiment_trends: Array<{
    date: string
    positive_percentage: number
    negative_percentage: number
    neutral_percentage: number
    total_feedback: number
  }>
}

interface TopClassroom {
  id: number
  name: string
  subject: string
  total_students: number
  rated_students: number
  average_rating: number
}

interface RatingDistribution {
  [key: string]: number
}

import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  TrendingUp,
  Brain,
  MessageSquare,
  Users,
  Eye,
  BarChart3,
  Clock,
  Star,
  Award,
  Calendar,
  ChevronRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateClassroomDialog } from "@/components/professor/add-classroom"

export default function ProfessorDashboard() {
  const [stats, setStats] = useState<Stats>({
    total_classrooms: 0,
    total_classroom_students: 0,
    students_with_feedback: 0,
    average_rating: 0,
    sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
    positive_percentage: 0,
  });

  const [classroomPerformance, setClassroomPerformance] = useState<ClassroomPerformance[]>([])
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([])
  const [trendData, setTrendData] = useState<TrendData>({ rating_trends: [], sentiment_trends: [] })
  const [topClassrooms, setTopClassrooms] = useState<TopClassroom[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all analytics data in parallel
        const [
          statsResponse,
          performanceResponse,
          feedbackResponse,
          trendsResponse,
          topClassroomsResponse,
          distributionResponse
        ] = await Promise.all([
          api2.get("/api/professor-analytics"),
          api2.get("/api/professor-analytics/classroom-performance"),
          api2.get("/api/professor-analytics/recent-feedback?limit=5"),
          api2.get("/api/professor-analytics/trends"),
          api2.get("/api/professor-analytics/top-classrooms?limit=3"),
          api2.get("/api/professor-analytics/rating-distribution")
        ])

        setStats(statsResponse.data)
        setClassroomPerformance(performanceResponse.data)
        setRecentFeedback(feedbackResponse.data)
        setTrendData(trendsResponse.data)
        setTopClassrooms(topClassroomsResponse.data)
        setRatingDistribution(distributionResponse.data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold">Professor Dashboard</h1>
          <p className="text-muted-foreground mt-2 md:mt-4">
            Welcome back! Here's an overview of your teaching performance and student feedback.
          </p>
        </div>
        <CreateClassroomDialog onSuccess={() => console.log("Classroom created!")} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classrooms</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_classrooms}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_classroom_students}</div>
            <p className="text-xs text-muted-foreground">Across all classrooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            <MessageSquare className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students_with_feedback}</div>
            <p className="text-xs text-muted-foreground">With comments & ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.average_rating ? stats.average_rating.toFixed(2) : "0"}/5
            </div>
            <p className="text-xs text-muted-foreground">Based on student feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Sentiment</CardTitle>
            <Brain className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.positive_percentage}%</div>
            <p className="text-xs text-muted-foreground">Positive feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insights */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              AI Performance Insights
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              AI-generated analysis of your teaching performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Positive Sentiment</span>
                <span>
                  {stats.sentiment_distribution.positive
                    ? ((stats.sentiment_distribution.positive /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                        100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.sentiment_distribution.positive
                    ? (stats.sentiment_distribution.positive /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Negative Sentiment</span>
                <span>
                  {stats.sentiment_distribution.negative
                    ? ((stats.sentiment_distribution.negative /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                        100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.sentiment_distribution.negative
                    ? (stats.sentiment_distribution.negative /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Neutral Sentiment</span>
                <span>
                  {stats.sentiment_distribution.neutral
                    ? ((stats.sentiment_distribution.neutral /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                        100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.sentiment_distribution.neutral
                    ? (stats.sentiment_distribution.neutral /
                        (stats.sentiment_distribution.positive +
                          stats.sentiment_distribution.negative +
                          stats.sentiment_distribution.neutral)) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Classrooms */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Classrooms
            </CardTitle>
            <CardDescription>
              Your highest-rated classrooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClassrooms.map((classroom, index) => (
                <div key={classroom.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{classroom.name}</p>
                    <p className="text-xs text-muted-foreground">{classroom.subject}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(classroom.average_rating))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {classroom.average_rating.toFixed(1)}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Rating Distribution
            </CardTitle>
            <CardDescription>
              How students rate your teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(ratingDistribution).reverse().map(([rating, count]) => {
                const total = Object.values(ratingDistribution).reduce((sum: number, val: number) => sum + val, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={rating} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span>{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback and Classroom Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Recent Feedback
            </CardTitle>
            <CardDescription>
              Latest student evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="border-l-2 border-muted pl-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{feedback.classroom_name}</p>
                      <p className="text-xs text-muted-foreground">{feedback.student_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <Badge className={`text-xs ${getSentimentColor(feedback.sentiment)}`}>
                        {feedback.sentiment}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {feedback.comment}
                  </p>
                  <p className="text-xs text-muted-foreground">{feedback.time_ago}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Classroom Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Classroom Performance
            </CardTitle>
            <CardDescription>
              Overview of all your classrooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classroomPerformance.slice(0, 5).map((classroom) => (
                <div key={classroom.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{classroom.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {classroom.subject} • {classroom.student_count} students
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(classroom.average_rating))}
                      <span className="text-xs ml-1">{classroom.average_rating}/5</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {classroom.positive_sentiment_percentage}% positive
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}