"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { api2 } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { TrendingUp, Users, MessageSquare, Star } from "lucide-react"

interface Question {
  id: number
  text: string
  ratings: Record<number, number>
}

interface Section {
  id: number
  title: string
  questions: Question[]
}

interface Survey {
  id: number
  title: string
  sections: Section[]
}

interface SurveyReport {
  classroom_name: string
  classroom_id: number
  survey: Survey
  total_respondents: number
}

const RATING_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#10b981"]

// --- Utilities ---
const calcAverage = (ratings: Record<number, number>): number => {
  const entries = Object.entries(ratings)
  const totalResponses = entries.reduce((sum: number, [, count]) => sum + count, 0)
  const totalScore = entries.reduce((sum: number, [rating, count]) => sum + Number(rating) * count, 0)
  return totalResponses ? parseFloat((totalScore / totalResponses).toFixed(2)) : 0
}

const getChartData = (ratings: Record<number, number>) =>
  [1, 2, 3, 4, 5].map((r) => ({
    name: `${r}`,
    count: ratings[r] || 0,
    fill: RATING_COLORS[r - 1],
  }))

const getPieData = (ratings: Record<number, number>) =>
  Object.entries(ratings).map(([rating, count]) => ({
    name: `${rating} ★`,
    value: count,
    color: RATING_COLORS[Number(rating) - 1],
  }))

// --- Components ---
const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold">{label} ★</p>
      <p>
        Responses: <b>{payload[0].value}</b>
      </p>
    </div>
  ) : null

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: any
  label: string
  value: string | number
  subtext?: string
}) => (
  <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
      <div className="bg-primary/10 p-2 rounded-md">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </div>
)

const RatingCard = ({ ratings }: { ratings: Record<number, number> }) => {
  const average = calcAverage(ratings)
  const total = Object.values(ratings).reduce((sum: number, count: number) => sum + count, 0)

  const quality =
    average >= 4.5
      ? { label: "Excellent", color: "bg-emerald-500/10 text-emerald-700" }
      : average >= 4.0
      ? { label: "Very Good", color: "bg-green-500/10 text-green-700" }
      : average >= 3.5
      ? { label: "Good", color: "bg-blue-500/10 text-blue-700" }
      : average >= 3.0
      ? { label: "Average", color: "bg-amber-500/10 text-amber-700" }
      : { label: "Poor", color: "bg-red-500/10 text-red-700" }

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase mb-1">Average Rating</p>
      <p className="text-3xl font-bold">{average.toFixed(2)}</p>
      <Badge className={`${quality.color} border-0 mt-2`}>{quality.label}</Badge>
      <p className="text-xs text-muted-foreground mt-4">{total} total responses</p>
    </div>
  )
}

// --- Main Page ---
export default function SurveyReportPage() {
  const { id } = useParams()
  const [data, setData] = useState<SurveyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [view, setView] = useState<"bar" | "pie">("bar")

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api2.get(`/api/classrooms/${id}/survey-report`)
      setData(res.data)
      if (res.data?.survey?.sections?.length > 0) {
        setActiveSection(res.data.survey.sections[0].id)
      }
    } catch {
      toast.error("Failed to fetch survey report.")
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    if (!data?.survey) return null
    const sections = data.survey.sections

    const totalQuestions = sections.reduce((sum: number, s: Section) => sum + s.questions.length, 0)

    const overallAvg =
      sections.reduce((sum: number, s: Section) => {
        const sectionAvg =
          s.questions.reduce((acc: number, q: Question) => acc + calcAverage(q.ratings), 0) /
          (s.questions.length || 1)
        return sum + sectionAvg
      }, 0) / (sections.length || 1)

    return { totalQuestions, overallAvg }
  }, [data])

  if (loading)
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    )

  if (!data?.survey)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            No survey report found.
          </CardContent>
        </Card>
      </div>
    )

  const { survey, total_respondents } = data
  const section = survey.sections.find((s) => s.id === activeSection)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{survey.title}</h1>
        <p className="text-sm text-muted-foreground">
          {data.classroom_name} • ID: {data.classroom_id}
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Star} label="Overall Rating" value={stats.overallAvg.toFixed(2)} />
          <StatCard icon={MessageSquare} label="Total Questions" value={stats.totalQuestions} />
          <StatCard icon={Users} label="Total Responses" value={total_respondents} />
          <StatCard icon={TrendingUp} label="Sections" value={survey.sections.length} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 uppercase">Sections</h3>
            {survey.sections.map((s: Section) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-1 ${
                  activeSection === s.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {section ? (
            section.questions.map((q: Question) => (
              <Card key={q.id}>
                <CardHeader className="bg-secondary/30 border-b border-border pb-2">
                  <CardTitle className="text-base">{q.text}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-3 gap-6">
                  <div className="bg-secondary/20 p-4 rounded-md">
                    <RatingCard ratings={q.ratings} />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between mb-3">
                      <h4 className="text-sm font-semibold">Response Chart</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setView("bar")}
                          className={`px-2 py-1 text-xs rounded ${
                            view === "bar"
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          Bar
                        </button>
                        <button
                          onClick={() => setView("pie")}
                          className={`px-2 py-1 text-xs rounded ${
                            view === "pie"
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          Pie
                        </button>
                      </div>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer>
                        {view === "bar" ? (
                          <BarChart data={getChartData(q.ratings)}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                              {getChartData(q.ratings).map((d, i) => (
                                <Cell key={i} fill={d.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie data={getPieData(q.ratings)} dataKey="value" outerRadius={80}>
                              {getPieData(q.ratings).map((d, i) => (
                                <Cell key={i} fill={d.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a section to view questions.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
