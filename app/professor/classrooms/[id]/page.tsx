'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { api2 } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface Student {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
  };
}


interface Evaluation {
  rating?: number | null;
  comment?: string | null;
  sentiment?: string | null;
  sentiment_score?: number | null;
}

interface Classroom {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  image?: string;
  code?: string;
  sentiment_analysis?: string;
  ai_analysis?: string;
  ai_recommendation?: string;
  students: Student[];
}

export default function ClassroomPage() {
  const params = useParams();
  const classroomId = params.id;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

    const handleGenerateAI = async () => {
    if (!classroomId) return;

    try {
        setGenerating(true);
        const res = await api2.get(`/api/classrooms-generate-ai-prof/${classroomId}`);

        if (res.data.success) {
        toast.success("AI analysis generated successfully.");
        fetchData();
        } else {
        alert(res.data.message || "Failed to generate AI analysis.");
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to generate AI analysis. Make sure you have evaluations.");
    } finally {
        setGenerating(false);
    }
    };

  useEffect(() => {
    if (!classroomId) return;
    fetchData();
  }, [classroomId]);

  const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch classroom + students
        const studentsRes = await api2.get(`/api/classrooms-students/${classroomId}`);
        setClassroom(studentsRes.data.classroom);

        // Fetch evaluations (anonymous)
        const evalRes = await api2.get(`/api/classrooms-evaluations/${classroomId}`);
        setEvaluations(evalRes.data.evaluations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  const renderStars = (rating?: number | null) => {
    const stars = [];
    const r = rating || 0;
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < r ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  if (loading) return <p>Loading...</p>;
  if (!classroom) return <p>Classroom not found.</p>;

  return (
    <div className="p-4 md:p-8">
      {/* Classroom Header */}
      <Card className="mb-6">
        {classroom.image && (
          <div className="w-full h-64 relative">
            <img
              src={`${api2.defaults.baseURL}${classroom.image}`}
              alt={classroom.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{classroom.name}</CardTitle>
          <CardDescription>{classroom.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Subject:</strong> {classroom.subject || "N/A"}</p>
          <p><strong>Code:</strong> {classroom.code || "N/A"}</p>
          {classroom.sentiment_analysis && <p><strong>Sentiment Analysis:</strong> {classroom.sentiment_analysis}</p>}
          {classroom.ai_analysis && <p><strong>AI Analysis:</strong> {classroom.ai_analysis}</p>}
          {classroom.ai_recommendation && <p><strong>AI Recommendation:</strong> {classroom.ai_recommendation}</p>}
        </CardContent>
        <div className="mb-4">
        <Button
            onClick={handleGenerateAI}
            disabled={generating}
        >
            {generating ? "Generating AI..." : "Generate AI Analysis"}
        </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Roster</CardTitle>
              <CardDescription>View all students in this class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {classroom.students?.map(cs => (
                <div key={cs.id} className="flex items-center space-x-4">
                <Avatar>
                    <AvatarFallback>
                    {cs.student?.name ? cs.student.name.charAt(0) : "?"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                    {cs.student?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    {cs.student?.email || "No email"}
                    </p>
                </div>
                </div>
            ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Evaluations</CardTitle>
              <CardDescription>Teacher feedback and ratings for students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {evaluations.length === 0 && <p className="text-muted-foreground">No evaluations yet.</p>}
              {evaluations.map((evaluation, index) => (
                <div key={index} className="pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    {renderStars(evaluation.rating)}
                    {evaluation.sentiment && (
                      <Badge
                        variant="outline"
                        className={`${evaluation.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                          evaluation.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {evaluation.sentiment}
                      </Badge>
                    )}
                  </div>
                  {evaluation.comment && (
                    <p className="text-sm text-muted-foreground italic">"{evaluation.comment}"</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
