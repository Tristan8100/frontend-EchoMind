'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { api2 } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// --- Type Definitions ---
interface StudentDetails {
  id: number;
  name: string;
  email: string;
}

interface ClassroomStudent {
  id: number;
  student: StudentDetails;
}

interface Evaluation {
  rating?: number | null;
  comment?: string | null;
  sentiment?: string | null;
  sentiment_score?: number | null;
}

interface ClassroomData {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  image?: string;
  code?: string;
  sentiment_analysis?: string;
  ai_analysis?: string;
  ai_recommendation?: string;
  status?: string;
  students: ClassroomStudent[];
}

export default function ClassroomPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    fetchData();
  }, [classroomId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, evalRes] = await Promise.all([
        api2.get(`/api/classrooms-students/${classroomId}`),
        api2.get(`/api/classrooms-evaluations/${classroomId}`),
      ]);
      setClassroom(studentsRes.data.classroom);
      setEvaluations(evalRes.data.evaluations);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load classroom data.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!classroomId) return;
    setIsGenerating(true);
    try {
      const res = await api2.get(`/api/classrooms-generate-ai-prof/${classroomId}`);
      if (res.data.success) {
        toast.success('AI analysis generated successfully.');
        fetchData();
      } else {
        toast.error(res.data.message || 'Failed to generate AI analysis.');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Failed to generate AI analysis. Make sure there are evaluations to analyze.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!classroom) return <div className="p-8 text-center">Classroom not found.</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card
        className={
          classroom?.status === "archived"
            ? "border-2 border-gray-400 bg-gray-50 opacity-80"
            : ""
        }
      >
        {classroom.image && (
          <div className="w-full h-64 relative">
            <img
              src={`${api2.defaults.baseURL}${classroom.image}`}
              alt={`${classroom.image} classroom image`}
              className={`w-full h-full object-cover rounded-t-lg ${
                classroom?.status === "archived" ? "grayscale" : ""
              }`}
            />
            {classroom?.status === "archived" && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="uppercase">
                  Archived
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>{classroom.description}</CardDescription>
            </div>
            {classroom?.status === "archived" && (
              <Badge variant="secondary" className="ml-2">
                Archived
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            <strong>Subject:</strong> {classroom.subject || "N/A"}
          </p>
          <p>
            <strong>Code:</strong> {classroom.code || "N/A"}
          </p>
          {classroom.sentiment_analysis && (
            <p>
              <strong>Sentiment Analysis:</strong> {classroom.sentiment_analysis}
            </p>
          )}
          {classroom.ai_analysis && (
            <p>
              <strong>AI Analysis:</strong> {classroom.ai_analysis}
            </p>
          )}
          {classroom.ai_recommendation && (
            <p>
              <strong>AI Recommendation:</strong> {classroom.ai_recommendation}
            </p>
          )}

          {/* Hide AI button if archived */}
          {classroom?.status !== "archived" && (
            <div className="pt-4">
              <Button onClick={handleGenerateAI} disabled={isGenerating}>
                {isGenerating ? "Generating AI..." : "Generate AI Analysis"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Roster</CardTitle>
              <CardDescription>View all students in this class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classroom.students.length === 0 ? (
                <p className="text-muted-foreground">No students in this classroom.</p>
              ) : (
                classroom.students.map((cs) => (
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
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Evaluations</CardTitle>
              <CardDescription>
                Anonymous teacher feedback and ratings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {evaluations.length === 0 ? (
                <p className="text-muted-foreground">
                  No evaluations available yet.
                </p>
              ) : (
                evaluations.map((evaluation, index) => (
                  <div key={index} className="pb-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      {evaluation.rating !== undefined &&
                        evaluation.rating !== null &&
                        renderStars(evaluation.rating)}
                      {evaluation.sentiment && (
                        <Badge
                          variant="outline"
                          className={
                            evaluation.sentiment === "Positive"
                              ? "bg-green-100 text-green-800"
                              : evaluation.sentiment === "Negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {evaluation.sentiment}
                        </Badge>
                      )}
                    </div>
                    {evaluation.comment && (
                      <p className="text-sm text-muted-foreground italic">
                        "{evaluation.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}