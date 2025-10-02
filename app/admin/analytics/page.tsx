"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Institute = {
  id: number;
  name: string;
  professors_count: number;
};

type AnalyticsResponse = {
  institute: {
    id: number | null;
    name: string;
  };
  totals: {
    professors: number;
    classrooms_active: number;
    classrooms_archived: number;
    students_total: number;
    students_enrolled: number;
  };
  feedback: {
    total_feedbacks: number;
    completion_rate: number;
  };
  ratings: {
    average_rating: number;
  };
  sentiment: {
    positive_percentage: number;
    neutral_percentage: number;
    negative_percentage: number;
  };
  highlights: {
    top_professors: any[];
    lowest_professors: any[];
    top_classrooms: any[];
    lowest_classrooms: any[];
  };
};

export default function AnalyticsPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch all institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api2.get("/api/institutes");
        setInstitutes(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch institutes:", err);
      }
    };
    fetchInstitutes();
  }, []);

  // fetch analytics whenever institute changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const url = selectedInstitute
          ? `/api/analytics-institutes?institute_id=${selectedInstitute}`
          : "/api/analytics-institutes";
        const res = await api2.get(url);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedInstitute]);

  if (loading) return <p className="p-6">Loading analytics...</p>;
  if (!data) return <p className="p-6">No data found.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Institute filter */}
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <Select onValueChange={(value) => setSelectedInstitute(value)} value={selectedInstitute || ""}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((inst) => (
              <SelectItem key={inst.id} value={String(inst.id)}>
                {inst.name} ({inst.professors_count} profs)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Institute: {data.institute.name} {data.institute.id ? "" : "(All)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Badge>Total Professors: {data.totals.professors}</Badge>
            <Badge>Active Classrooms: {data.totals.classrooms_active}</Badge>
            <Badge>Archived Classrooms: {data.totals.classrooms_archived}</Badge>
            <Badge>Unique Students: {data.totals.students_total}</Badge>
            <Badge>Total Enrollments: {data.totals.students_enrolled}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for more details */}
      <Tabs defaultValue="feedback" className="w-full">
        <TabsList>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Card>
            <CardHeader><CardTitle>Feedback</CardTitle></CardHeader>
            <CardContent>
              <p>Total Feedbacks: {data.feedback.total_feedbacks}</p>
              <p>Completion Rate: {data.feedback.completion_rate}%</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <Card>
            <CardHeader><CardTitle>Ratings</CardTitle></CardHeader>
            <CardContent>
              <p>Average Rating: {data.ratings.average_rating}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader><CardTitle>Sentiment</CardTitle></CardHeader>
            <CardContent>
              <p>😊 Positive: {data.sentiment.positive_percentage}%</p>
              <p>😐 Neutral: {data.sentiment.neutral_percentage}%</p>
              <p>😡 Negative: {data.sentiment.negative_percentage}%</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="highlights">
          <Card>
            <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Top Professors</h3>
                <ul className="list-disc pl-5">
                  {data.highlights.top_professors.map((prof) => (
                    <li key={prof.id}>
                      {prof.name} — Avg Rating: {prof.avg_rating} ({prof.completion_rate}%)
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Lowest Professors</h3>
                <ul className="list-disc pl-5">
                  {data.highlights.lowest_professors.map((prof) => (
                    <li key={prof.id}>
                      {prof.name} — Avg Rating: {prof.avg_rating} ({prof.completion_rate}%)
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Top Classrooms</h3>
                <ul className="list-disc pl-5">
                  {data.highlights.top_classrooms.map((c) => (
                    <li key={c.id}>
                      {c.name} — Avg Rating: {c.avg_rating} ({c.completion_rate}%)
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Lowest Classrooms</h3>
                <ul className="list-disc pl-5">
                  {data.highlights.lowest_classrooms.map((c) => (
                    <li key={c.id}>
                      {c.name} — Avg Rating: {c.avg_rating} ({c.completion_rate}%)
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
