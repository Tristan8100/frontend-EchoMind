'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import Link from 'next/link';

// ==== INTERFACES ====
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
  status?: string;
  sentiment_analysis?: string;
  ai_analysis?: string;
  ai_recommendation?: string;
  students: ClassroomStudent[];
}

interface Survey {
  id: number;
  title: string;
  description?: string;
}

export default function ClassroomPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [existingSurvey, setExistingSurvey] = useState<Survey | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ==== INITIAL LOAD ====
  useEffect(() => {
    if (!classroomId) return;
    fetchClassroom();
    fetchSurveys();
    checkSurvey();
  }, [classroomId]);

  // ==== API CALLS ====
  const fetchClassroom = async () => {
    try {
      setLoading(true);
      const [studentsRes, evalRes] = await Promise.all([
        api2.get(`/api/classrooms-students/${classroomId}`),
        api2.get(`/api/classrooms-evaluations/${classroomId}`),
      ]);
      setClassroom(studentsRes.data.classroom);
      setEvaluations(evalRes.data.evaluations);
    } catch (err) {
      toast.error('Failed to load classroom data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const res = await api2.get('/api/surveys');
      setSurveys(res.data);
    } catch (err) {
      toast.error('Failed to load surveys.');
      console.error(err);
    }
  };

  const checkSurvey = async () => {
    try {
      const res = await api2.get(`/api/classrooms/${classroomId}/check-survey`);
      if (res.data.has_survey) {
        setExistingSurvey(res.data.survey);
      } else {
        setExistingSurvey(null);
      }
    } catch (err) {
      console.error('Failed to check survey:', err);
    }
  };

  const handleAssignSurvey = async () => {
    if (!selectedSurvey) {
      toast.error('Please select a survey first.');
      return;
    }

    setAssigning(true);
    try {
      await api2.post(`/api/surveys-assign/${classroomId}`, {
        survey_id: selectedSurvey,
      });
      toast.success('Survey assigned successfully.');
      checkSurvey();
      fetchClassroom();
    } catch (err) {
      toast.error('Failed to assign survey.');
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  // ==== AI GENERATION ====
  const handleGenerateAI = async () => {
    if (!classroomId) return;
    setIsGenerating(true);
    try {
      const res = await api2.get(`/api/classrooms-generate-ai-prof/${classroomId}`);
      if (res.data.success) {
        toast.success('AI analysis generated successfully.');
        fetchClassroom();
      } else {
        toast.error(res.data.message || 'Failed to generate AI analysis.');
      }
    } catch (err) {
      toast.error('Failed to generate AI analysis.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!classroom) return <div className="p-8 text-center">Classroom not found.</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* ===== CLASSROOM HEADER ===== */}
      <Card
        className={
          classroom?.status === 'archived'
            ? 'border-2 border-gray-400 bg-gray-50 opacity-80'
            : ''
        }
      >
        {classroom.image && (
          <div className="w-full h-64 relative">
            <Image
              src={`${classroom.image}`}
              alt="Classroom"
              fill
              className={`object-cover rounded-t-lg ${
                classroom?.status === 'archived' ? 'grayscale' : ''
              }`}
            />
            {classroom?.status === 'archived' && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive">Archived</Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>{classroom.description}</CardDescription>
            </div>
            {classroom?.status === 'archived' && (
              <Badge variant="secondary">Archived</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p><strong>Subject:</strong> {classroom.subject || 'N/A'}</p>
          <p><strong>Code:</strong> {classroom.code || 'N/A'}</p>
          {classroom.sentiment_analysis && (
            <p><strong>Sentiment Analysis:</strong> {classroom.sentiment_analysis}</p>
          )}
          {classroom.ai_analysis && (
            <p><strong>AI Analysis:</strong> {classroom.ai_analysis}</p>
          )}
          {classroom.ai_recommendation && (
            <p><strong>AI Recommendation:</strong> {classroom.ai_recommendation}</p>
          )}

          {/* SURVEY ASSIGNMENT */}
          {classroom?.status !== 'archived' && (
            <div className="pt-4 space-y-2">
              <label className="text-sm font-medium">Survey</label>

              {existingSurvey ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {existingSurvey.title}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    (Already assigned)
                  </p>
                    <Button><Link href={`/professor/surveys/${classroomId}`}>View</Link></Button>
                  
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a survey" />
                    </SelectTrigger>
                    <SelectContent>
                      {surveys.map((survey) => (
                        <SelectItem key={survey.id} value={String(survey.id)}>
                          {survey.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleAssignSurvey} disabled={assigning}>
                    {assigning ? 'Assigning...' : 'Assign Survey'}
                  </Button>
                </div>
              )}

              {/* AI GENERATION BUTTON */}
              <div className="pt-4">
                <Button onClick={handleGenerateAI} disabled={isGenerating}>
                  {isGenerating ? 'Generating AI...' : 'Generate AI Analysis'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== TABS ===== */}
      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Roster</CardTitle>
              <CardDescription>All enrolled students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classroom.students.length === 0 ? (
                <p className="text-muted-foreground">No students found.</p>
              ) : (
                classroom.students.map((cs) => (
                  <div
                    key={cs.id}
                    className="flex items-center space-x-4 border-b pb-2 last:border-b-0"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {cs.student?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cs.student?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cs.student?.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* EVALUATION TAB */}
        <TabsContent value="evaluation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Evaluations</CardTitle>
              <CardDescription>Anonymous feedback and ratings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluations.length === 0 ? (
                <p className="text-muted-foreground">No evaluations yet.</p>
              ) : (
                evaluations.map((e, i) => (
                  <div key={i} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      {e.rating ? renderStars(e.rating) : <div />}
                      {e.sentiment && (
                        <Badge
                          variant="outline"
                          className={
                            e.sentiment === 'Positive'
                              ? 'bg-green-100 text-green-800'
                              : e.sentiment === 'Negative'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {e.sentiment}
                        </Badge>
                      )}
                    </div>
                    {e.comment && (
                      <p className="italic text-sm text-muted-foreground">
                        "{e.comment}"
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
