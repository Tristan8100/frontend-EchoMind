"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, Users, BookOpen, Hash } from "lucide-react"
import { useParams } from "next/navigation"

interface Professor {
  id: number
  name: string
  email: string
  image?: string
  avg_rating?: number
  active_classrooms_count?: number
  institute?: {
    id: number
    name: string
  }
}

interface Classroom {
  id: number
  name: string
  subject: string
  description: string
  image: string
  code: string
  status: string
  students_count: number
}

export default function AdminProfessorPage() {
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)

  const params = useParams()

  useEffect(() => {
    fetchProfessor()
  }, [params.id])

  const fetchProfessor = async () => {
    try {
      setLoading(true)
      const response = await api2.get(`/api/get-one-prof/${params.id}`)
      const data = response.data.data
      setProfessor(data)
      setClassrooms(data.classrooms || [])
    } catch (error) {
      console.error("Error fetching professor:", error)
      toast.error("Failed to load professor info.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Professor not found</h2>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
       {professor.image ? (
        <Image
            src={`${professor.image}`}
            alt={professor.name}
            width={80}
            height={80}
            className="rounded-full border object-cover"
        />
        ) : (
        <div className="w-20 h-20 rounded-full border flex items-center justify-center bg-muted">
            <span className="text-xl font-bold text-foreground">
            {professor.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
        </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{professor.name}</h1>
          <p className="text-muted-foreground">{professor.email}</p>
          {professor.institute && (
            <p className="text-sm text-foreground mt-1">
              Institute: <span className="font-medium">{professor.institute.name}</span>
            </p>
          )}
          {professor.avg_rating !== null && (
            <p className="text-sm text-foreground mt-1">
              Avg. Rating:{" "}
              <span className="font-medium">{Number(professor.avg_rating).toFixed(2)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Classrooms</p>
            <p className="text-2xl font-bold">{classrooms.length}</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-chart-2" />
          <div>
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold">
              {classrooms.reduce((sum, c) => sum + c.students_count, 0)}
            </p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-chart-3" />
          <div>
            <p className="text-sm text-muted-foreground">Active Classrooms</p>
            <p className="text-2xl font-bold">
              {classrooms.filter((c) => c.status === "active").length}
            </p>
          </div>
        </div>
      </div>

      {/* Classrooms */}
      {classrooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">This professor has no classrooms yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((c) => (
            <Card
              key={c.id}
              className={`overflow-hidden border-0 shadow-md transition-all ${
                c.status === "archived" ? "opacity-60 grayscale bg-muted/50" : "hover:scale-105 bg-card"
              }`}
            >
              <div className="relative w-full h-40">
                <Image
                  src={`${c.image}`}
                  alt={c.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>{c.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4 text-primary" />
                    {c.code}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-chart-2" />
                    {c.students_count}
                  </span>
                </div>
                <div className="mt-4">
                  <Link href={`/admin/professors/${params.id}/classrooms/${c.id}`}>
                    <Button size="sm" className="w-full flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
