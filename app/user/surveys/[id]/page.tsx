'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface Classroom {
  id: number;
  name: string;
  survey_id?: number | null;
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

      // Fetch classroom data
      const classroomRes = await api2.get(`/api/check-if-enrolled/${classroomId}`);
      setClassroom(classroomRes.data.classroom);
      console.log(classroomRes.data);

      const surveyId = classroomRes.data.classroom.survey_id;
      if (!surveyId) {
        toast.error('No survey assigned to this classroom.');
        return;
      }

      // Fetch survey questions
      const surveyRes = await api2.get(`/api/surveys/${surveyId}`);
      setSurvey(surveyRes.data);

      // Fetch existing student responses
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

  if (loading) return <div className="p-8 text-center">Loading survey...</div>;
  if (!survey) return <div className="p-8 text-center">No survey available.</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Survey: {survey.title}</CardTitle>
          <CardDescription>Please answer all questions honestly.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {survey.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="space-y-3">
                {section.questions.map((q) => (
                  <div key={q.id} className="space-y-1">
                    <p className="text-sm">{q.question_text}</p>
                    <div className="flex space-x-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <label key={num} className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={num}
                            checked={answers[q.id] === num}
                            onChange={() => handleAnswerChange(q.id, num)}
                            className="accent-blue-600"
                          />
                          <span>{num}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={handleSubmit} disabled={submitting} className="mt-4">
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
