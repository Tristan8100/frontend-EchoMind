"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api2 } from "@/lib/api"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster, toast } from "sonner"

interface Institute {
  id: number
  name: string
  full_name: string
  description?: string
  professors_count?: number
}

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Institute | null>(null)
  const [formData, setFormData] = useState({ name: "", full_name: "", description: "" })

  useEffect(() => {
    fetchInstitutes()
  }, [])

  const fetchInstitutes = async () => {
    try {
      setLoading(true)
      const res = await api2.get("/api/institutes")
      setInstitutes(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch institutes", err)
      toast.error("Failed to load institutes.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editing) {
        await api2.put(`/api/institutes/${editing.id}`, formData)
        toast.success("Institute updated successfully!")
      } else {
        await api2.post("/api/institutes", formData)
        toast.success("Institute created successfully!")
      }
      setOpen(false)
      setEditing(null)
      setFormData({ name: "", full_name: "", description: "" })
      fetchInstitutes()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save institute")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this institute?")) return
    try {
      await api2.delete(`/api/institutes/${id}`)
      toast.success("Institute deleted successfully!")
      fetchInstitutes()
    } catch (err) {
      toast.error("Failed to delete institute")
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in-50">
      <Toaster position="top-right" richColors closeButton />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Institutes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null)
                setFormData({ name: "", full_name: "", description: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Institute
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Institute" : "Add Institute"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update the institute details." : "Create a new institute."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Short Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="CCS" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="College of Computer Studies"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : institutes.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">No institutes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((inst) => (
            <Card
              key={inst.id}
              className="shadow-md hover:shadow-lg transition-all animate-in fade-in-50"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{inst.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(inst)
                        setFormData({
                          name: inst.name,
                          full_name: inst.full_name,
                          description: inst.description || "",
                        })
                        setOpen(true)
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(inst.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{inst.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  Professors: {inst.professors_count ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  {inst.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
