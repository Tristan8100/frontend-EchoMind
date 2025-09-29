"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api2 } from "@/lib/api"
import { Pencil, Trash2, Plus } from "lucide-react"

interface Institute {
  id: number
  name: string
  full_name: string
  description?: string
  professors_count?: number
}

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Institute | null>(null)
  const [formData, setFormData] = useState({ name: "", full_name: "", description: "" })

  useEffect(() => {
    fetchInstitutes()
  }, [])

  const fetchInstitutes = async () => {
    try {
      const res = await api2.get("/api/institutes")
      setInstitutes(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch institutes", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setMessage("")
      if (editing) {
        await api2.put(`/api/institutes/${editing.id}`, formData)
        setMessage("Institute updated successfully!")
      } else {
        await api2.post("/api/institutes", formData)
        setMessage("Institute created successfully!")
      }
      setOpen(false)
      setEditing(null)
      setFormData({ name: "", full_name: "", description: "" })
      fetchInstitutes()
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to save institute")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this institute?")) return
    try {
      await api2.delete(`/api/institutes/${id}`)
      fetchInstitutes()
    } catch (err) {
      console.error("Failed to delete institute", err)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Institutes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditing(null)
              setFormData({ name: "", full_name: "", description: "" })
            }}>
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
                <Input id="full_name" value={formData.full_name} onChange={handleChange} placeholder="College of Computer Studies" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={handleChange} placeholder="Optional description" />
              </div>
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutes.map((inst) => (
          <Card key={inst.id} className="shadow-md">
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
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(inst.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">{inst.full_name}</p>
              <p className="text-sm text-muted-foreground">Current Professors: {inst.professors_count}</p>
              <p className="text-sm text-muted-foreground">{inst.description || "No description"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
