"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { EnrollDialog } from "@/components/student/enroll";
import { Star, Users, Loader2 } from "lucide-react";

interface Professor {
  id: number;
  name: string;
  email: string;
  image?: string;
}

interface Classroom {
  id: number;
  name: string;
  description?: string;
  subject?: string;
  image?: string;
  code?: string;
  professor?: Professor | null;
  evaluated?: boolean;
  evaluated_at?: string | null;
  rating?: number | null;
  comment?: string | null;
  sentiment?: string | null;
}

export default function StudentClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await api2.get("/api/classrooms-student");
      setClassrooms(res.data.classrooms);
    } catch {
      toast.error("Failed to load classrooms.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentRating: number, editable = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i <= currentRating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            onClick={() => editable && setRating(i)}
            style={{ cursor: editable ? "pointer" : "default" }}
          />
        ))}
      </div>
    );
  };

  const handleOpenDialog = (cls: Classroom) => {
    setSelectedClassroom(cls);
    setRating(cls.rating || 0);
    setComment(cls.comment || "");
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedClassroom) return;
    try {
      const res = await api2.post(
        `/api/classroom-students/evaluate/${selectedClassroom.id}`,
        { rating, comment }
      );
      toast.success("Evaluation submitted successfully!");
      setClassrooms((prev) =>
        prev.map((cls) =>
          cls.id === selectedClassroom.id
            ? {
                ...cls,
                evaluated: true,
                evaluated_at: new Date().toISOString(),
                rating,
                comment,
                sentiment: res.data.data.sentiment,
              }
            : cls
        )
      );
      setSelectedClassroom(null);
    } catch {
      toast.error("Failed to submit evaluation.");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Enrolled Classrooms 🎓</h1>
          <p className="text-gray-500 mt-1">
            Manage your enrolled classrooms and evaluations
          </p>
        </div>
        <EnrollDialog onSuccess={fetchClassrooms} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
        </div>
      ) : classrooms.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No classrooms found yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {classrooms.map((cls) => (
            <Card
              key={cls.id}
              className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full h-36">
                <Image
                  src={cls.image || "/default-classroom.jpg"}
                  alt={cls.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cls.professor?.image ? (
                      <Image
                        src={cls.professor.image}
                        alt={cls.professor.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {cls.professor?.name || "Unknown Professor"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {cls.professor?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <Badge variant={cls.evaluated ? "outline" : "secondary"}>
                    {cls.evaluated ? "Evaluated" : "Active"}
                  </Badge>
                </div>

                <CardTitle className="truncate">{cls.name}</CardTitle>
                <CardDescription>{cls.subject}</CardDescription>
              </CardHeader>

              <CardContent className="text-sm text-gray-600 space-y-1">
                <p className="line-clamp-2">{cls.description}</p>
                <p className="font-medium mt-2">Code: {cls.code}</p>
                {cls.evaluated && (
                  <p className="text-green-600 font-medium">
                    ✅ Evaluated on{" "}
                    {cls.evaluated_at
                      ? new Date(cls.evaluated_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                )}
                {cls.rating && <p>Rating: {cls.rating}/5</p>}
                {cls.sentiment && <p>Sentiment: {cls.sentiment}</p>}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link href={`/user/classrooms/${cls.id}`} passHref>
                    <Button size="sm" variant="secondary" className="flex-1">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => handleOpenDialog(cls)}
                    className="flex-1"
                  >
                    {cls.evaluated ? "Edit Evaluation" : "Evaluate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedClassroom}
        onOpenChange={() => setSelectedClassroom(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClassroom?.name}</DialogTitle>
            <DialogDescription>
              {selectedClassroom?.description || selectedClassroom?.subject}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">Rating</p>
              {renderStars(rating, true)}
            </div>
            <div>
              <p className="font-medium mb-1">Comment</p>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
              />
            </div>
            <div>
              <p className="font-medium mb-1">Sentiment</p>
              <Badge variant="outline">
                {selectedClassroom?.sentiment || "N/A"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmitEvaluation} className="flex-1">
              {selectedClassroom?.evaluated
                ? "Update Evaluation"
                : "Submit Evaluation"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedClassroom(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
