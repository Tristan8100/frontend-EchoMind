"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"

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
  const [stats, setStats] = useState({
  total_classrooms: 0,
  total_classroom_students: 0,
  students_with_feedback: 0,
  average_rating: 0,
  sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
  positive_percentage: 0,
});

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api2.get("/api/professor-analytics") // adjust path if needed
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
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

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
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
      </div>
    </div>
  )
}
