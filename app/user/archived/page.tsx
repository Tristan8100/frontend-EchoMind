"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import Image from "next/image"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"

interface Professor {
  id: number
  name: string
  email: string
  image?: string
}

interface Classroom {
  id: number
  name: string
  subject: string
  description: string
  image: string
  code: string
  professor: Professor | null
  sentiment?: string
  rating?: number
  comment?: string
  evaluated?: boolean
  evaluated_at?: string
  status?: string
}

export default function Archived() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])

  useEffect(() => {
    fetchArchivedClassrooms()
  }, [])

  const fetchArchivedClassrooms = async () => {
    try {
      const response = await api2.get("/api/classrooms-student",  {
        params: { status: "archived" },
      })
      setClassrooms(response.data.classrooms)
    } catch (error) {
      console.error("Error fetching classrooms:", error)
      toast.error("Failed to load archived classrooms.")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Archived Classrooms 🗂️
      </h1>

      {classrooms.length === 0 ? (
        <p className="text-gray-600">No archived classrooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="overflow-hidden opacity-60 grayscale"
            >
              <div className="relative w-full h-40">
                <Image
                  src={`${api2.defaults.baseURL}${classroom.image}`}
                  alt={classroom.name}
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">ARCHIVED</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle>{classroom.name}</CardTitle>
                <CardDescription>{classroom.subject}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-grow">
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{classroom.description}</p>
                  <p className="font-medium mt-2">Code: {classroom.code}</p>
                  <p>Professor: {classroom.professor?.name}</p>
                  {classroom.evaluated && (
                    <p className="text-green-600 font-medium">✅ Evaluated</p>
                  )}
                  {classroom.sentiment && (
                    <p>Sentiment: {classroom.sentiment}</p>
                  )}
                  {classroom.rating && <p>Rating: {classroom.rating}/5</p>}
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/student/classrooms/${classroom.id}`} passHref>
                    <Button size="sm" variant="secondary">
                      View
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
