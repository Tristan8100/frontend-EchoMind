'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, Calendar, Star, Plus, Search } from "lucide-react";
import { api2 } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { EnrollDialog } from "@/components/student/enroll";

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

  // Dialog state
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const res = await api2.get('/api/classrooms-student');
        setClassrooms(res.data.classrooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  const renderStars = (currentRating: number, editable = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 ${i <= currentRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          onClick={() => editable && setRating(i)}
          style={{ cursor: editable ? "pointer" : "default" }}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  const handleOpenDialog = (cls: Classroom) => {
    setSelectedClassroom(cls);
    setRating(cls.rating || 0);
    setComment(cls.comment || "");
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedClassroom) return;

    try {
      const res = await api2.post(`/api/classroom-students/evaluate/${selectedClassroom.id}`, {
        rating,
        comment,
      });

      toast.success("Evaluation submitted successfully!");

      // Update classroom in local state
      setClassrooms(prev =>
        prev.map(cls =>
          cls.id === selectedClassroom.id
            ? {
                ...cls,
                evaluated: true,
                evaluated_at: new Date().toISOString(),
                rating,
                comment,
                sentiment: res.data.data.sentiment, // use updated sentiment from backend
              }
            : cls
        )
      );

      setSelectedClassroom(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit evaluation.");
    }
  };

  if (loading) return <p>Loading classrooms...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2 md:mt-4">
            Manage your enrolled subjects and join new ones
          </p>
        </div>
        <EnrollDialog onSuccess={() => {fetchClassrooms();}} />
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search classrooms..." className="pl-10" />
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {classrooms.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {cls.professor?.image ? (
                    <Image
                      src={`${api2.defaults.baseURL}${cls.professor.image}`}
                      alt={cls.professor.name}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  <span>{cls.professor?.name || "Unknown Professor"}</span>
                </div>
                <Badge variant={cls.evaluated ? "outline" : "secondary"}>
                  {cls.evaluated ? "Evaluated" : "Active"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{cls.name}</CardTitle>
              <CardDescription>{cls.description || cls.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{cls.professor?.name || "Unknown Professor"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{cls.code || "Schedule TBD"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>
                  Last evaluated:{" "}
                  {cls.evaluated_at ? new Date(cls.evaluated_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleOpenDialog(cls)}>
                  {cls.evaluated ? "View/Edit Evaluation" : "Submit Evaluation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Evaluation Dialog */}
      <Dialog open={!!selectedClassroom} onOpenChange={() => setSelectedClassroom(null)}>
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
              <Badge variant="outline">{selectedClassroom?.sentiment || "N/A"}</Badge>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSubmitEvaluation} className="flex-1">
              {selectedClassroom?.evaluated ? "Update Evaluation" : "Submit Evaluation"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedClassroom(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
