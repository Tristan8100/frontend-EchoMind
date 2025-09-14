import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Calendar, Star, Plus, Search } from "lucide-react"

export default function StudentClassrooms() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2 md:mt-4">
           Manage your enrolled subjects and join new ones
          </p>
        </div>
        <Button className="gap-2 mt-4 md:mt-0 md:ml-auto md:w-auto">
          <Plus className="h-4 w-4" />
          Join Classroom
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search classrooms..." className="pl-10" />
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <CardTitle className="text-lg">Computer Science 101</CardTitle>
            <CardDescription>Introduction to Programming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Prof. Johnson</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>MWF 9:00-10:00 AM</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Last evaluated: 2 days ago</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Submit Evaluation
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <CardTitle className="text-lg">Data Structures</CardTitle>
            <CardDescription>Advanced Programming Concepts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Prof. Smith</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>TTh 2:00-3:30 PM</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Last evaluated: 1 week ago</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Submit Evaluation
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <CardTitle className="text-lg">Web Development</CardTitle>
            <CardDescription>Modern Web Technologies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Prof. Davis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>MW 1:00-2:30 PM</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Last evaluated: 2 weeks ago</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Submit Evaluation
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
            <CardTitle className="text-lg">Database Systems</CardTitle>
            <CardDescription>SQL and Database Design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Prof. Wilson</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Fall 2024</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Last evaluated: 3 weeks ago</span>
              <span>Maximum evaluation aquired</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                View Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
