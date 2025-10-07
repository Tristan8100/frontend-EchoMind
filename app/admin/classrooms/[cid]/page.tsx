'use client';

import { useEffect, useState, useCallback } from 'react';
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
import Link from 'next/link';
import Image from 'next/image';

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
  student_id: any;
  student_name: string;
  student_email: string;
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
  const classroomId = Array.isArray(params.cid) ? params.cid[0] : (params.cid as string);

  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [idError, setIdError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!classroomId) {
      console.error('[ERROR] Missing classroomId in params ⚠️');
      setIdError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      console.log(`[INFO] Fetching classroom data for ID: ${classroomId}...`);

      const [studentsRes, evalRes] = await Promise.all([
        api2.get(`/api/classrooms-students-admin/${classroomId}`),
        api2.get(`/api/classrooms-evaluations-admin/${classroomId}`)
      ]);

      if (!studentsRes.data.classroom) {
        console.error('Classroom not found', studentsRes.data);
        setFetchError('Classroom not found.');
        return;
      }

      console.log('succ');

      setClassroom(studentsRes.data.classroom);
      setEvaluations(evalRes.data.evaluations);
    } catch (err: any) {
      console.error('err', err);

      if (err.response) {
        console.error('err2', err.response.data);
        console.error('err3', err.response.status);
      }

      setFetchError('Failed to load classroom data. Check network and ID.');
      toast.error('Failed to load classroom data.');
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  const handleGenerateAI = async () => {
    if (!classroomId) {
      toast.error('Classroom ID is missing. Cannot generate analysis.');
      return;
    }

    if (evaluations.length === 0) {
      console.warn('[WARN] Tried to generate AI with no evaluations ⚠️');
      toast.error('Cannot generate AI analysis: No student evaluations available.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api2.get(`/api/classrooms-generate-ai/${classroomId}`);

      if (res.data.success) {
        toast.success('AI analysis generated successfully.');
        fetchData();
      } else {
        const message = res.data.message || 'AI generation failed due to an unknown issue.';
        toast.error(message);
      }
    } catch (err: any) {

      toast.error('Failed to connect to the AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!classroomId) {
      setIdError(true);
      setLoading(false);
      return;
    }

    fetchData();
  }, [fetchData, classroomId]);

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  // --- Conditional UI ---
  if (idError) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-300 rounded-lg m-8">
        <h2 className="text-xl font-semibold text-red-700">Missing Classroom ID</h2>
        <p className="text-red-500">The classroom ID (cid) is missing from the URL. Please check the route.</p>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-lg font-medium">Loading classroom details...</div>;

  if (fetchError) {
    console.error('[ERROR] Rendering error UI due to fetch failure:', fetchError);
    return (
      <div className="p-8 text-center bg-yellow-50 border border-yellow-300 rounded-lg m-8">
        <h2 className="text-xl font-semibold text-yellow-700">Error Loading Data</h2>
        <p className="text-yellow-500">{fetchError}</p>
        <Button onClick={fetchData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!classroom) {
    return <div className="p-8 text-center">Classroom data is null.</div>;
  }

  // --- Render ---
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card
        className={
          classroom.status === 'archived'
            ? 'border-2 border-gray-400 bg-gray-50 opacity-90'
            : ''
        }
      >
        {classroom.image && (
          <div className="w-full h-64 relative">
            <Image
              src={`${classroom.image}`}
              alt={`${classroom.name} classroom image`}
              className={`w-full h-full object-cover rounded-t-lg ${
                classroom.status === 'archived' ? 'grayscale' : ''
              }`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {classroom.status === 'archived' && (
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
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            <strong>Subject:</strong> {classroom.subject || 'N/A'}
          </p>
          <p>
            <strong>Code:</strong> {classroom.code || 'N/A'}
          </p>

          <hr className="my-4" />

          {classroom.sentiment_analysis && (
            <p className="border-l-4 pl-3 border-blue-500 bg-blue-50 p-2 rounded">
              <strong>Sentiment Analysis:</strong> {classroom.sentiment_analysis}
            </p>
          )}
          {classroom.ai_analysis && (
            <p className="border-l-4 pl-3 border-purple-500 bg-purple-50 p-2 rounded">
              <strong>AI Analysis:</strong> {classroom.ai_analysis}
            </p>
          )}
          {classroom.ai_recommendation && (
            <p className="border-l-4 pl-3 border-green-500 bg-green-50 p-2 rounded">
              <strong>AI Recommendation:</strong> {classroom.ai_recommendation}
            </p>
          )}

          {classroom.status !== 'archived' && (
            <div className="pt-4">
              <Button onClick={handleGenerateAI} disabled={isGenerating}>
                {isGenerating ? 'Generating AI...' : 'Generate AI Analysis'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">
            Students ({classroom.students.length})
          </TabsTrigger>
          <TabsTrigger value="evaluation">
            Evaluations ({evaluations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Roster</CardTitle>
              <CardDescription>
                All students currently enrolled in this class.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classroom.students.length === 0 ? (
                <p className="text-muted-foreground">No students in this classroom.</p>
              ) : (
                classroom.students.map((cs) => (
                  <div key={cs.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {cs.student?.name
                          ? cs.student.name.charAt(0).toUpperCase()
                          : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {cs.student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cs.student?.email || 'No email'}
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
              <CardTitle>Student Feedback</CardTitle>
              <CardDescription>
                Anonymous ratings and comments from students.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {evaluations.length === 0 ? (
                <p className="text-muted-foreground">
                  No evaluations available yet. Share the evaluation link with
                  your students.
                </p>
              ) : (
                evaluations.map((evaluation, index) => (
                  <div key={index} className="pb-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="text-xs">
                            {evaluation.student_name
                              ? evaluation.student_name.charAt(0).toUpperCase()
                              : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {evaluation.student_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {evaluation.student_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        {evaluation.rating !== undefined &&
                          evaluation.rating !== null && (
                            <div className="hidden sm:flex">
                              {renderStars(evaluation.rating)}
                            </div>
                          )}
                        {evaluation.sentiment && (
                          <Badge
                            variant="outline"
                            className={`${
                              evaluation.sentiment.toLowerCase() === 'positive'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : ''
                            } ${
                              evaluation.sentiment.toLowerCase() === 'negative'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : ''
                            } ${
                              evaluation.sentiment.toLowerCase() === 'neutral'
                                ? 'bg-gray-100 text-gray-800 border-gray-300'
                                : ''
                            } text-xs px-2 py-0.5`}
                          >
                            {evaluation.sentiment}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {evaluation.comment && (
                      <p className="text-sm text-gray-700 italic border-l-2 pl-3 mt-2">
                        "{evaluation.comment}"
                      </p>
                    )}

                    <div className="mt-3">
                      <Link href={`/admin/students/${evaluation.student_id}`} passHref>
                        <Button variant="ghost" className="h-8 px-3 text-xs">
                          View student details
                        </Button>
                      </Link>
                    </div>
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
