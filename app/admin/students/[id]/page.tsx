"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api2 } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Define types for your API response
interface Student {
  id: number;
  name: string;
  email: string;
  classrooms_count: number;
  ratings_count: number;
  created_at: string;
  updated_at: string;
}

interface Professor {
  id: number;
  name: string;
  email: string;
  image: string | null;
}

interface Classroom {
  id: number;
  name: string;
  subject: string;
  description: string;
  image: string | null;
  code: string;
  professor: Professor;
}

export default function StudentsPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const [student, setStudent] = useState<Student | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [studentRes, classroomRes] = await Promise.all([
          api2.get<Student>(`/api/get-student/${id}`),
          api2.get<{ classrooms: Classroom[] }>(`/api/get-student-classrooms/${id}`),
        ]);

        setStudent(studentRes.data);
        setClassrooms(classroomRes.data.classrooms);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!student) {
    return <div className="p-4 text-red-500">Student not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Student Info */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
          <p className="text-gray-600">{student.email}</p>

          <div className="flex gap-4 mt-4">
            <Badge variant="secondary">
              Classrooms: {student.classrooms_count}
            </Badge>
            <Badge variant="secondary">
              Ratings: {student.ratings_count}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Classrooms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Enrolled Classrooms</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {classrooms.length > 0 ? (
            classrooms.map((c) => (
              <Card key={c.id} className="hover:shadow-lg transition">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{c.name}</h3>
                  <p className="text-gray-500">{c.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Professor:</span>{" "}
                    {c.professor.name} ({c.professor.email})
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No active classrooms enrolled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
