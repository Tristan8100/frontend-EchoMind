"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Survey {
  id: number;
  title: string;
  description?: string | null;
  status?: string | null;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [selected, setSelected] = useState<Survey | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await api2.get<Survey[]>("/api/surveys");
      setSurveys(res.data);
    } catch (error: any) {
      console.error("Failed to fetch surveys:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch surveys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api2.post("/api/surveys", form);
      toast.success("Survey created successfully!");
      setForm({ title: "", description: "", status: "pending" });
      setOpenCreate(false);
      await fetchSurveys();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create survey.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await api2.put(`/api/surveys/${selected.id}`, form);
      toast.success("Survey updated successfully!");
      setOpenEdit(false);
      await fetchSurveys();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update survey.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await api2.delete(`/api/surveys/${selected.id}`);
      toast.success("Survey deleted successfully!");
      setOpenDelete(false);
      await fetchSurveys();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete survey.");
    }
  };

  if (loading) return <p>Loading surveys...</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Surveys Management</h1>

        {/* Create Dialog */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>Add Survey</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm((f) => ({ ...f, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Survey"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {surveys.length === 0 ? (
        <p>No surveys available.</p>
      ) : (
        <ul className="space-y-2">
          {surveys.map((survey) => (
            <li
              key={survey.id}
              className="p-3 bg-gray-100 rounded-md shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{survey.title}</p>
                {survey.description && (
                  <p className="text-sm text-gray-600">{survey.description}</p>
                )}
                {survey.status && (
                  <p className="text-xs text-gray-500 italic">
                    Status: {survey.status}
                  </p>
                )}
                <Link href={`/admin/surveys/${survey.id}`}>View</Link>
              </div>

              <div className="flex gap-2">
                {/* Edit Dialog */}
                <Dialog
                  open={openEdit && selected?.id === survey.id}
                  onOpenChange={(open) => {
                    setOpenEdit(open);
                    if (open) {
                      setSelected(survey);
                      setForm({
                        title: survey.title,
                        description: survey.description || "",
                        status: survey.status || "pending",
                      });
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Survey</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <Input
                          value={form.title}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea
                          value={form.description}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, description: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Status
                        </label>
                        <Select
                          value={form.status}
                          onValueChange={(val) =>
                            setForm((f) => ({ ...f, status: val }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "Updating..." : "Update Survey"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog
                  open={openDelete && selected?.id === survey.id}
                  onOpenChange={(open) => {
                    setOpenDelete(open);
                    if (open) setSelected(survey);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Survey</DialogTitle>
                    </DialogHeader>
                    <p>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">{survey.title}</span>?
                    </p>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
