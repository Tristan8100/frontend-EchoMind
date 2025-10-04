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
import { toast } from "sonner"
import { Archive, RotateCcw } from "lucide-react"

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
  status?: string
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
      const response = await api2.get("/api/classrooms-archived")
      setClassrooms(response.data)
    } catch (error) {
      console.error("Error fetching classrooms:", error)
      toast.error("Failed to load classrooms.")
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
      toast.success("Classroom updated successfully.")
    } catch (error) {
      console.error("Error updating classroom:", error)
      toast.error("Failed to update classroom.")
    }
  }

  const handleDelete = async () => {
    if (!deletingClassroom) return
    try {
      await api2.delete(`/api/classrooms/${deletingClassroom.id}`)
      await fetchClassrooms()
      setDeletingClassroom(null)
      toast.success("Classroom deleted successfully.")
    } catch (error) {
      console.error("Error deleting classroom:", error)
      toast.error("Failed to delete classroom.")
    }
  }

  const handleActivate = async (id: number) => {
    try {
      await api2.post(`/api/classrooms-activate/${id}`)
      await fetchClassrooms()
      toast.success("Classroom activated successfully.")
    } catch (error) {
      console.error("Error activating classroom:", error)
      toast.error("Failed to activate classroom.")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Classrooms 📚</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Card
            key={classroom.id}
            className={`overflow-hidden transition-all duration-300 transform ${
              classroom.status === "archived"
                ? "opacity-60 grayscale hover:scale-100"
                : "hover:shadow-xl hover:scale-105"
            }`}
          >
            <div className="relative w-full h-40">
              <Image
                src={`${classroom.image}`}
                alt={classroom.name}
                fill
                className={`object-cover ${
                  classroom.status === "archived" ? "grayscale" : ""
                }`}
              />
              {classroom.status === "archived" && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">ARCHIVED</span>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>{classroom.subject}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="space-y-1 text-sm text-gray-600">
                <p>{classroom.description}</p>
                <p className="font-medium mt-2">Code: {classroom.code}</p>
                <p>Students: {classroom.students_count}</p>
                <p>Professor: {classroom.professor?.name}</p>
                {classroom.sentiment_analysis && <p>Sentiment: {classroom.sentiment_analysis}</p>}
                {classroom.status && <p>Status: {classroom.status}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                {classroom.status === "archived" ? (
                  <>
                    <Link href={`/professor/classrooms/${classroom.id}`} passHref>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => handleActivate(classroom.id)}
                      className="w-full sm:w-auto"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" /> Remove from Archive
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={`/professor/classrooms/${classroom.id}`} passHref>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </Link>
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
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4 mr-1" /> Archive
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
              {editingClassroom?.image && (
                <div className="relative w-full h-32 mt-2 rounded-md overflow-hidden">
                  <Image
                    src={`${api2.defaults.baseURL}${editingClassroom.image}`}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClassroom(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
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