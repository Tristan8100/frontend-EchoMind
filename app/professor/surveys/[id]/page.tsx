'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api2 } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Question {
  id: number;
  text: string;
  ratings: Record<number, number>;
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

interface SurveyReport {
  classroom_id: number;
  survey: Survey;
}

export default function SurveyReportPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [data, setData] = useState<SurveyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) return;
    fetchSurveyReport();
  }, [classroomId]);

  const fetchSurveyReport = async () => {
    try {
      setLoading(true);
      const res = await api2.get(`/api/classrooms/${classroomId}/survey-report`);
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch survey report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data || !data.survey) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No survey report found for this classroom.
      </div>
    );
  }

  const { survey } = data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        <p className="text-muted-foreground">Classroom ID: {data.classroom_id}</p>
      </div>

      {survey.sections.map((section) => (
        <Card key={section.id} className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {section.questions.length === 0 && (
              <p className="text-muted-foreground">No questions in this section.</p>
            )}

            {section.questions.map((question) => (
              <div
                key={question.id}
                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">{question.text}</p>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {Object.entries(question.ratings).map(([rating, count]) => (
                    <Badge
                      key={rating}
                      variant="outline"
                      className={`px-3 py-1 ${
                        Number(rating) <= 2
                          ? 'bg-red-100 text-red-800'
                          : Number(rating) === 3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {rating} ⭐ — {count}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
