"use client"

import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  TrendingUp,
  Brain,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, MessageSquare, Plus, Search, Settings, Eye, BarChart3, Copy, Calendar, Clock } from "lucide-react"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"


export default function ProfessorDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating classroom:", formData)
    setIsDialogOpen(false)
    setFormData({ name: "", code: "", description: "" })
  }

  // Mock data for professor dashboard
  const stats = {
    activeClassrooms: 4,
    totalStudents: 127,
    evaluationsReceived: 89,
    averageRating: 4.2,
    sentimentScore: 78,
  }

  const recentEvaluations = [
    {
      id: 1,
      classroom: "Advanced Mathematics",
      student: "Anonymous",
      rating: 5,
      sentiment: "positive",
      date: "2024-01-15",
      preview: "Great explanation of complex topics...",
    },
    {
      id: 2,
      classroom: "Calculus I",
      student: "Anonymous",
      rating: 4,
      sentiment: "positive",
      date: "2024-01-14",
      preview: "Clear teaching style, very helpful...",
    },
    {
      id: 3,
      classroom: "Statistics",
      student: "Anonymous",
      rating: 3,
      sentiment: "neutral",
      date: "2024-01-13",
      preview: "Good content but could improve pace...",
    },
  ]

  const classrooms = [
    {
      id: 1,
      name: "Advanced Mathematics",
      code: "MATH401",
      students: 32,
      evaluations: 28,
      avgRating: 4.5,
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      name: "Calculus I",
      code: "MATH201",
      students: 45,
      evaluations: 41,
      avgRating: 4.2,
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      name: "Statistics",
      code: "STAT301",
      students: 38,
      evaluations: 15,
      avgRating: 3.8,
      lastActivity: "3 days ago",
    },
  ]

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4" />
              Create New Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
              <DialogDescription className="text-muted-foreground">Set up a new classroom for your students to join and evaluate.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Classroom Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Advanced Mathematics"
                    required
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., MATH401"
                    required
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the course"
                    rows={3}
                    className="bg-background text-foreground border-input"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-muted text-muted-foreground hover:bg-muted/90 border-border">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Create Classroom</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classrooms</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClassrooms}</div>
            <p className="text-xs text-muted-foreground">+1 from last semester</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classrooms</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            <MessageSquare className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluationsReceived}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">+0.3 from last semester</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Sentiment</CardTitle>
            <Brain className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentimentScore}%</div>
            <p className="text-xs text-muted-foreground">Positive feedback</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Insights */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              AI Performance Insights
            </CardTitle>
            <CardDescription className="text-muted-foreground">AI-generated analysis of your teaching performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Positive Sentiment</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Negative Sentiment</span>
                <span>5%</span>
              </div>
              <Progress value={5} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Neutral Sentiment</span>
                <span>17%</span>
              </div>
              <Progress value={17} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              Recent Evaluations
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest feedback from your students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto h-[300px] space-y-4">
              {recentEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="border rounded-lg p-4 space-y-2 bg-background border-input">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{evaluation.classroom}</p>
                      <p className="text-xs text-muted-foreground">{evaluation.student}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          evaluation.sentiment === "positive"
                            ? "default"
                            : evaluation.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {evaluation.sentiment}
                      </Badge>
                      <span className="text-sm font-medium">{evaluation.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{evaluation.preview}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {evaluation.date}
                    </span>
                    <Button variant="ghost" size="sm" className="hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-muted text-muted-foreground hover:bg-muted/90 border-border">
              View All Evaluations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Classrooms */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            My Classrooms
          </CardTitle>
          <CardDescription className="text-muted-foreground">Manage your active classrooms and view performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <Card key={classroom.id} className="hover:shadow-md transition-shadow bg-background border-input">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{classroom.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{classroom.code}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary">{classroom.avgRating}/5</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{classroom.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Evaluations:</span>
                    <span className="font-medium">{classroom.evaluations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span className="font-medium">{classroom.lastActivity}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-muted text-muted-foreground hover:bg-muted/90 border-border">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-muted text-muted-foreground hover:bg-muted/90 border-border">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}