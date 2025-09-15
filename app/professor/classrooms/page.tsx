// app/classrooms/page.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Professor {
  id: number
  name: string
  email: string
}

interface Classroom {
  id: number
  name: string
  subject: string
  description: string
  image: string
  code: string
  professor: Professor
  students_count: number
  sentiment_analysis?: string
}

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)
  const [deletingClassroom, setDeletingClassroom] = useState<Classroom | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    subject: string
    description: string
    image: File | null
  }>({ name: "", subject: "", description: "", image: null })

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const response = await api2.get("/api/classrooms")
      setClassrooms(response.data)
    } catch (error) {
      console.error("Error fetching classrooms:", error)
    }
  }

  const openEditDialog = (classroom: Classroom) => {
    setEditingClassroom(classroom)
    setFormData({
      name: classroom.name,
      subject: classroom.subject,
      description: classroom.description,
      image: null,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleUpdate = async () => {
    if (!editingClassroom) return
    try {
      const form = new FormData()
      form.append("name", formData.name)
      form.append("subject", formData.subject)
      form.append("description", formData.description)
      if (formData.image) {
        form.append("image", formData.image)
      }

      await api2.post(`/api/classrooms-update/${editingClassroom.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      await fetchClassrooms()
      setEditingClassroom(null)
    } catch (error) {
      console.error("Error updating classroom:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingClassroom) return
    try {
      await api2.delete(`/api/classrooms/${deletingClassroom.id}`)
      await fetchClassrooms()
      setDeletingClassroom(null)
    } catch (error) {
      console.error("Error deleting classroom:", error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Classrooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Link key={classroom.id} href={`/professor/classrooms/${classroom.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition">
            <div className="relative w-full h-40">
              <Image
                src={`${api2.defaults.baseURL}${classroom.image}`}
                alt={classroom.name}
                fill
                className="object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>{classroom.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{classroom.description}</p>
              <p className="text-sm font-medium">Code: {classroom.code}</p>
              <p className="text-sm text-muted-foreground">
                Students: {classroom.students_count}
              </p>
              <p className="text-sm text-muted-foreground">
                Professor: {classroom.professor?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Sentiment Analysis: {classroom.sentiment_analysis}
              </p>

              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => openEditDialog(classroom)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeletingClassroom(classroom)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingClassroom} onOpenChange={() => setEditingClassroom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {editingClassroom?.image && (
                <div className="relative w-full h-32 mt-2">
                  <Image
                    src={`${api2.defaults.baseURL}${editingClassroom.image}`}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClassroom(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deletingClassroom} onOpenChange={() => setDeletingClassroom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Classroom</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingClassroom?.name}</span>?  
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
