"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { api2 } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { toast } from "sonner" // ✅ Import toast

interface CreateClassroomDialogProps {
  onSuccess?: () => void
}

export function CreateClassroomDialog({ onSuccess }: CreateClassroomDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    image: null as File | null,
  })

  const createClassroomMutation = useMutation({
    mutationFn: async () => {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("subject", formData.subject)
      if (formData.description) data.append("description", formData.description)
      if (formData.image) data.append("image", formData.image)

      return api2.post("/api/classrooms", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: () => {
      toast.success("🎉 Classroom created successfully!")
      setIsOpen(false)
      setFormData({ name: "", subject: "", description: "", image: null })
      if (onSuccess) onSuccess()
    },
    onError: (error: any) => {
      console.error("Error creating classroom:", error)
      const message =
        error.response?.data?.message ||
        "Failed to create classroom. Please try again."
      toast.error(`❌ ${message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createClassroomMutation.mutate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Plus className="h-4 w-4" />
          Create New Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up a new classroom for your students to join and evaluate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] || null })
              }
              className="bg-background text-foreground border-input"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-muted text-muted-foreground hover:bg-muted/90 border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createClassroomMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createClassroomMutation.isPending ? "Creating..." : "Create Classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
