"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

/**
 * SurveySectionsPage
 * - Uses your existing backend routes:
 *   GET  /api/survey-sections/:id
 *   POST /api/survey-sections
 *   PUT  /api/survey-sections/:id
 *   DELETE /api/survey-sections/:id
 *   POST /api/survey-questions
 *   PUT  /api/survey-questions/:id
 *   DELETE /api/survey-questions/:id
 *
 * Behavior:
 * - If GET returns 404 -> show "Survey not found" UI (different from "No sections found")
 * - If GET returns 200 but empty array -> show "No sections found."
 * - All CRUD actions show sonner toasts and refetch afterwards
 * - Clean, separated dialog state per action (create/edit/delete)
 */

type Question = {
  id: number;
  question_text: string;
  section_id: number;
};

type Section = {
  id: number;
  survey_id: number;
  title: string;
  description?: string | null;
  questions?: Question[] | null;
};

export default function SurveySectionsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = String(params?.id ?? "");

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Dialog states (separate booleans so multiple dialogs can work independently)
  const [openCreateSection, setOpenCreateSection] = useState(false);
  const [openEditSection, setOpenEditSection] = useState(false);
  const [openDeleteSection, setOpenDeleteSection] = useState(false);

  const [openCreateQuestion, setOpenCreateQuestion] = useState(false);
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState(false);

  // Forms
  const [sectionForm, setSectionForm] = useState({ title: "", description: "" });
  const [questionForm, setQuestionForm] = useState({ question_text: "" });

  // Selection
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Fetch sections (distinguish 404 from empty result)
  const fetchSections = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await api2.get<Section[]>(`/api/survey-sections/${surveyId}`);
      // Backend returns array (maybe empty). We treat empty array as "no sections".
      setSections(res.data ?? []);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        setSections([]);
      } else {
        toast.error(err?.response?.data?.message || "Failed to load sections.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!surveyId) return;
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  // Helpers to reset selection/forms
  const resetSectionForm = () => setSectionForm({ title: "", description: "" });
  const resetQuestionForm = () => setQuestionForm({ question_text: "" });
  const clearSelections = () => {
    setSelectedSection(null);
    setSelectedQuestion(null);
  };

  // Create Section
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api2.post("/api/survey-sections", {
        survey_id: surveyId,
        ...sectionForm,
      });
      toast.success("Section created");
      resetSectionForm();
      setOpenCreateSection(false);
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create section.");
    } finally {
      setSubmitting(false);
    }
  };

  // Update Section
  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    setSubmitting(true);
    try {
      await api2.put(`/api/survey-sections/${selectedSection.id}`, sectionForm);
      toast.success("Section updated");
      setOpenEditSection(false);
      clearSelections();
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update section.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Section
  const handleDeleteSection = async () => {
    if (!selectedSection) return;
    setSubmitting(true);
    try {
      await api2.delete(`/api/survey-sections/${selectedSection.id}`);
      toast.success("Section deleted");
      setOpenDeleteSection(false);
      clearSelections();
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete section.");
    } finally {
      setSubmitting(false);
    }
  };

  // Create Question
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) {
      toast.error("Select a section first");
      return;
    }
    setSubmitting(true);
    try {
      await api2.post("/api/survey-questions", {
        section_id: selectedSection.id,
        ...questionForm,
      });
      toast.success("Question added");
      resetQuestionForm();
      setOpenCreateQuestion(false);
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add question.");
    } finally {
      setSubmitting(false);
    }
  };

  // Update Question
  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setSubmitting(true);
    try {
      await api2.put(`/api/survey-questions/${selectedQuestion.id}`, questionForm);
      toast.success("Question updated");
      setOpenEditQuestion(false);
      clearSelections();
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update question.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;
    setSubmitting(true);
    try {
      await api2.delete(`/api/survey-questions/${selectedQuestion.id}`);
      toast.success("Question deleted");
      setOpenDeleteQuestion(false);
      clearSelections();
      await fetchSections();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete question.");
    } finally {
      setSubmitting(false);
    }
  };

  // UI states for not found vs loading vs none
  if (!surveyId) return <p className="p-6">Invalid survey id.</p>;
  if (loading) return <p className="p-6">Loading sections...</p>;

  if (notFound) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Survey not found</h1>
        <p>The survey with id <strong>{surveyId}</strong> does not exist.</p>
        <div className="flex gap-2">
          <Button onClick={() => router.back()}>Go back</Button>
          <Button onClick={() => router.push("/admin/surveys")}>Back to surveys</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Survey Sections & Questions</h1>
          <p className="text-sm text-gray-600">Survey ID: {surveyId}</p>
        </div>

        <div className="flex gap-2">
          {/* Refresh */}
          <Button onClick={fetchSections} variant="outline">Refresh</Button>

          {/* Add Section */}
          <Dialog open={openCreateSection} onOpenChange={setOpenCreateSection}>
            <DialogTrigger asChild>
              <Button>Add Section</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Section</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm((s) => ({ ...s, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm((s) => ({ ...s, description: e.target.value }))}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Section"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-gray-600">No sections found for this survey.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.id} className="p-4 bg-gray-50 rounded-md shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  {section.description && <p className="text-sm text-gray-600">{section.description}</p>}
                </div>

                <div className="flex gap-2">
                  {/* Edit Section */}
                  <Dialog
                    open={openEditSection && selectedSection?.id === section.id}
                    onOpenChange={(open) => {
                      setOpenEditSection(open);
                      if (open) {
                        setSelectedSection(section);
                        setSectionForm({ title: section.title, description: section.description || "" });
                      } else {
                        setSelectedSection(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Section</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateSection} className="space-y-4">
                        <Input
                          value={sectionForm.title}
                          onChange={(e) => setSectionForm((s) => ({ ...s, title: e.target.value }))}
                          required
                        />
                        <Textarea
                          value={sectionForm.description}
                          onChange={(e) => setSectionForm((s) => ({ ...s, description: e.target.value }))}
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={submitting}>Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Section */}
                  <Dialog
                    open={openDeleteSection && selectedSection?.id === section.id}
                    onOpenChange={(open) => {
                      setOpenDeleteSection(open);
                      if (open) setSelectedSection(section);
                      else setSelectedSection(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Section</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to delete the section <strong>{section.title}</strong>?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDeleteSection(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteSection}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Questions list */}
              <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Questions</p>

                  {/* Add question (opens dialog tied to this section) */}
                  <Dialog
                    open={openCreateQuestion && selectedSection?.id === section.id}
                    onOpenChange={(open) => {
                      setOpenCreateQuestion(open);
                      if (open) {
                        setSelectedSection(section);
                        setQuestionForm({ question_text: "" });
                      } else {
                        setSelectedSection(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />Add Question</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateQuestion} className="space-y-4">
                        <Input
                          value={questionForm.question_text}
                          onChange={(e) => setQuestionForm({ question_text: e.target.value })}
                          placeholder="Question text"
                          required
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Question"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {section.questions && section.questions.length > 0 ? (
                  section.questions.map((q) => (
                    <div key={q.id} className="flex items-center justify-between bg-white p-2 rounded-md">
                      <div className="flex-1 pr-4">
                        <p className="text-sm">{q.question_text}</p>
                      </div>

                      <div className="flex gap-2">
                        {/* Edit question */}
                        <Dialog
                          open={openEditQuestion && selectedQuestion?.id === q.id}
                          onOpenChange={(open) => {
                            setOpenEditQuestion(open);
                            if (open) {
                              setSelectedQuestion(q);
                              setQuestionForm({ question_text: q.question_text });
                            } else {
                              setSelectedQuestion(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Question</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateQuestion} className="space-y-4">
                              <Input
                                value={questionForm.question_text}
                                onChange={(e) => setQuestionForm({ question_text: e.target.value })}
                                required
                              />
                              <DialogFooter>
                                <Button type="submit" disabled={submitting}>Update</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete question */}
                        <Dialog
                          open={openDeleteQuestion && selectedQuestion?.id === q.id}
                          onOpenChange={(open) => {
                            setOpenDeleteQuestion(open);
                            if (open) setSelectedQuestion(q);
                            else setSelectedQuestion(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Question</DialogTitle>
                            </DialogHeader>
                            <p>Delete this question?</p>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setOpenDeleteQuestion(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDeleteQuestion}>Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No questions yet.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
