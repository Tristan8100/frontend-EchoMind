"use client";

import { useEffect, useState } from "react";
// Assuming api2 and component imports are correct
import { api2 } from "@/lib/api"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf, Users, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Types ---
interface ClassroomFeedback {
    classroom_id: number;
    rating: number;
    comment: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    classroom: { id: number; name: string };
}

interface AnalyticsResponse {
  student: { id: number; name: string; email: string };
  classrooms: { total_joined: number; list: ClassroomFeedback[] };
  ratings: { average_rating: string | null; ratings_count: number };
  sentiments: { sentiment: 'positive' | 'negative' | 'neutral'; total: number }[];
  engagement: { comments_count: number; last_activity: { created_at?: string } | null };
  warnings: { not_evaluated_classrooms: { classroom_name: string }[]; count: number };
  progress?: { evaluated: number; pending: number; completion_rate: number };
}

// --- Constants ---
const SENTIMENT_COLORS = {
  positive: "#10b981", // Emerald green
  neutral: "#facc15",  // Amber yellow
  negative: "#ef4444", // Red
};

// --- Helper Components ---

// A component to render the star rating visually
const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center text-yellow-500">
            {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 fill-current" />)}
            {hasHalfStar && <StarHalf key="half" className="w-4 h-4 fill-current" />}
            {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
        </div>
    );
};

// --- Main Component ---
export default function StudentAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mimic the API call structure
    api2
      .get("/api/student-analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-red-500">Failed to load analytics data.</p>;

  const averageRating = data.ratings.average_rating ? parseFloat(data.ratings.average_rating) : 0;
  const isAllEvaluated = data.warnings.count === 0;

  return (
    <div className="space-y-8 p-4 md:p-8">
      
      {/* --- Header & Progress --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0 p-6 bg-card rounded-xl shadow-lg border-l-4 border-indigo-500">
        <div>
          <h1 className="text-3xl font-extrabold">
            Hello, <span className="text-indigo-600">{data.student.name}</span>!
          </h1>
          <p className="text-sm text-gray-500">{data.student.email}</p>
        </div>

        {data.progress && (
          <div className="w-full md:w-64 flex-shrink-0">
            <p className="mb-2 font-semibold text-gray-700">Evaluation Completion Rate</p>
            <Progress
              value={data.progress.completion_rate}
              className="h-3 bg-indigo-100"
            />
            <p className="mt-1 text-sm text-indigo-600 font-medium">
              {data.progress.completion_rate}% Complete
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.progress.evaluated} evaluated / {data.progress.pending} pending
            </p>
          </div>
        )}
      </div>

      <Separator />
      
      {/* --- Key Statistics Grid --- */}
      <h2 className="text-2xl font-bold text-gray-800">Your Evaluation Overview</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric Card: Average Rating */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {averageRating.toFixed(2)}
            </div>
            <div className="mt-1">
                <StarRating rating={averageRating} />
            </div>
            <p className="text-xs text-muted-foreground">
              Across {data.ratings.ratings_count} submission{data.ratings.ratings_count !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Metric Card: Total Classrooms */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classrooms Joined</CardTitle>
            <Users className="h-5 w-5 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.classrooms.total_joined}</div>
            <p className="text-xs text-muted-foreground">Total courses on your list</p>
          </CardContent>
        </Card>
        
        {/* Metric Card: Total Comments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.engagement.comments_count}</div>
            <p className="text-xs text-muted-foreground">Engaging with your feedback</p>
          </CardContent>
        </Card>

        {/* Metric Card: Warnings/Pending */}
        <Card className={`hover:shadow-md transition-shadow ${!isAllEvaluated ? "border-red-500" : "border-green-500"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluation Status</CardTitle>
            {isAllEvaluated ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${!isAllEvaluated ? "text-red-600" : "text-green-600"}`}>
                {data.warnings.count}
            </div>
            <p className="text-xs text-muted-foreground">
                {isAllEvaluated ? "All clear!" : "Pending evaluations"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Charts and Detailed Feedback --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Sentiment Distribution Pie Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sentiment Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of text feedback.</p>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {data.sentiments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sentiments}
                    dataKey="total"
                    nameKey="sentiment"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => `${name.charAt(0).toUpperCase() + name.slice(1)}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.sentiments.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SENTIMENT_COLORS[entry.sentiment]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      typeof name === "string"
                        ? name.charAt(0).toUpperCase() + name.slice(1)
                        : String(name)
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">No sentiment data yet.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Feedback List (Styled) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Recent Feedback</CardTitle>
            <p className="text-sm text-muted-foreground">A summary of your latest evaluations.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.classrooms.list.length > 0 ? (
              <div className="space-y-3">
                {data.classrooms.list.map((f, i) => (
                  <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg text-indigo-700">{f.classroom.name}</h4>
                      <Badge 
                        className="text-xs font-semibold"
                        style={{ backgroundColor: SENTIMENT_COLORS[f.sentiment], color: 'white' }}
                      >
                        {f.sentiment.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-1 mb-2">
                      <StarRating rating={f.rating} />
                    </div>
                    <p className="text-sm italic text-gray-600">
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent feedback recorded.</p>
            )}
          </CardContent>
        </Card>

      </div>
      
      {/* --- Pending Evaluations Warning (If any) --- */}
      {!isAllEvaluated && (
        <Card className="border-l-4 border-red-500 bg-red-50">
            <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Action Required: Pending Evaluations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2 text-red-600">You still need to evaluate the following classrooms:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-red-800">
                    {data.warnings.not_evaluated_classrooms.map((c, i) => (
                        <li key={i} className="font-medium">{c.classroom_name}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      )}

    </div>
  );
}