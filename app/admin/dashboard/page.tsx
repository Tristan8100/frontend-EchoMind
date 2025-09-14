"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, UserPlus, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddProfessorDialog from "@/components/admin/add-prof"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">School Administration Portal</p>
        </div>
        <div className="flex gap-2">
          <AddProfessorDialog />
          <Button onClick={() => router.refresh()}>
      Refresh Data
    </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Professors</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classrooms</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Subject classrooms</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Professors & Their Classrooms</CardTitle>
            <CardDescription className="text-muted-foreground">All professors and their created subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Dr. Sarah Johnson",
                subjects: ["CS 101 - Programming", "CS 201 - Data Structures"],
                students: 65,
              },
              { name: "Prof. Mike Chen", subjects: ["MATH 101 - Algebra", "MATH 201 - Calculus"], students: 58 },
              { name: "Dr. Emily Davis", subjects: ["PHYS 101 - Physics I"], students: 42 },
              {
                name: "Prof. James Wilson",
                subjects: ["CHEM 101 - Chemistry", "CHEM 201 - Organic Chem"],
                students: 71,
              },
              { name: "Dr. Lisa Brown", subjects: ["BIO 101 - Biology"], students: 38 },
            ].map((prof, index) => (
              <div key={index} className="p-4 rounded-lg bg-background border border-input">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{prof.name}</p>
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary">
                    {prof.students} students
                  </Badge>
                </div>
                <div className="space-y-1">
                  {prof.subjects.map((subject, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      • {subject}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Recent Evaluations</CardTitle>
            <CardDescription className="text-muted-foreground">Latest student evaluations submitted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: "CS 101 - Programming", professor: "Dr. Sarah Johnson", count: 12, time: "2 hours ago" },
              { subject: "MATH 201 - Calculus", professor: "Prof. Mike Chen", count: 8, time: "5 hours ago" },
              { subject: "PHYS 101 - Physics I", professor: "Dr. Emily Davis", count: 15, time: "1 day ago" },
              { subject: "CHEM 101 - Chemistry", professor: "Prof. James Wilson", count: 6, time: "1 day ago" },
              { subject: "BIO 101 - Biology", professor: "Dr. Lisa Brown", count: 9, time: "2 days ago" },
            ].map((evaluation, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border border-input">
                <div>
                  <p className="text-sm font-medium">{evaluation.subject}</p>
                  <p className="text-xs text-muted-foreground">{evaluation.professor}</p>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="text-xs mb-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    {evaluation.count} evals
                  </Badge>
                  <p className="text-xs text-muted-foreground">{evaluation.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}