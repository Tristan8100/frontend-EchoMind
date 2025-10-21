'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
}

interface Section {
  id: number;
  title: string;
  questions: Question[];
}

interface Survey {
  id: number;
  title: string;
  sections: Section[];
}

interface Professor {
  id: number;
  name: string;
  email: string;
}

interface Classroom {
  id: number;
  name: string;
  survey_id?: number | null;
  professor?: Professor;
}

export default function StudentSurveyPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    fetchClassroomAndSurvey();
  }, [classroomId]);

  const fetchClassroomAndSurvey = async () => {
    try {
      setLoading(true);

      const classroomRes = await api2.get(`/api/check-if-enrolled/${classroomId}`);
      setClassroom(classroomRes.data.classroom);
      console.log(classroomRes.data);

      const surveyId = classroomRes.data.classroom.survey_id;
      if (!surveyId) {
        toast.error('No survey assigned to this classroom.');
        return;
      }

      const surveyRes = await api2.get(`/api/surveys/${surveyId}`);
      setSurvey(surveyRes.data);

      const responseRes = await api2.get(`/api/survey-responses/${classroomId}`);
      const existingAnswers: Record<number, number> = {};
      responseRes.data.responses.forEach((r: any) => {
        if (r.rating) existingAnswers[r.survey_question_id] = r.rating;
      });
      setAnswers(existingAnswers);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load survey.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async () => {
    if (!classroom || !survey) return;

    const totalQuestions = survey.sections.reduce(
      (sum, sec) => sum + sec.questions.length,
      0
    );

    if (Object.keys(answers).length !== totalQuestions) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        classroom_id: classroom.id,
        responses: Object.entries(answers).map(([questionId, rating]) => ({
          survey_question_id: Number(questionId),
          rating,
        })),
      };

      await api2.post('/api/survey-responses', payload);
      toast.success('Survey submitted successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading survey...</div></div>;
  if (!survey) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">No survey available.</div></div>;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-3">
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="h-3 bg-primary rounded-t-xl" />
          <div className="p-8 space-y-2">
            <h1 className="text-3xl font-normal text-foreground">{survey.title}</h1>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Please answer all questions honestly.</p>
              {classroom && (
                <div className="pt-2 space-y-0.5">
                  <p><span className="font-medium text-foreground">Classroom:</span> {classroom.name}</p>
                  {classroom.professor && (
                    <p><span className="font-medium text-foreground">Professor:</span> {classroom.professor.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-medium">Rating Scale:</span> 1 (Lowest) to 5 (Highest)
          </AlertDescription>
        </Alert>

        {survey.sections.map((section) => (
          <div key={section.id} className="space-y-3">
            {section.title && (
              <div className="bg-card rounded-xl border border-border px-6 py-4 shadow-sm">
                <h2 className="text-xl font-medium text-foreground">{section.title}</h2>
              </div>
            )}
            
            {section.questions.map((q) => (
              <div key={q.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-base font-normal text-foreground mb-5 leading-relaxed">{q.question_text}</p>
                
                <RadioGroup
                  value={answers[q.id]?.toString()}
                  onValueChange={(value) => handleAnswerChange(q.id, Number(value))}
                >
                  <div className="flex flex-wrap gap-6">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-center space-x-2.5">
                        <RadioGroupItem 
                          value={num.toString()} 
                          id={`q-${q.id}-${num}`}
                          className="border-2"
                        />
                        <Label 
                          htmlFor={`q-${q.id}-${num}`}
                          className="text-sm font-medium cursor-pointer text-foreground hover:text-primary transition-colors"
                        >
                          {num}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        ))}

        <div className="bg-card rounded-xl border border-border p-6 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center shadow-sm">
          <div className="text-sm">
            <span className="text-muted-foreground">Completed: </span>
            <span className="font-medium text-foreground">
              {Object.keys(answers).length} / {survey.sections.reduce((sum, sec) => sum + sec.questions.length, 0)}
            </span>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            size="lg"
            className="w-full sm:w-auto"
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </div>
      </div>
    </div>
  );
}