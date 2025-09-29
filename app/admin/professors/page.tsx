"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Mail, GraduationCap, Building2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Institute {
  id: number
  name: string
  full_name: string
}

interface Professor {
  id: number
  name: string
  email: string
  image?: string
  institute?: Institute
  active_classrooms_count: number
  avg_rating: number | null
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-muted-foreground/30" />)
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all")
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  })
  const [loading, setLoading] = useState(false)

  // Fetch institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api2.get("/api/institutes")
        setInstitutes(res?.data?.data || res?.data || [])
      } catch (error) {
        console.error("Failed to fetch institutes:", error)
        setInstitutes([])
      }
    }
    fetchInstitutes()
  }, [])

  // Fetch professors
  const fetchProfessors = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api2.get("/api/get-professors", {
        params: {
          page,
          per_page: pagination.per_page,
          institute_id: selectedInstitute !== "all" ? selectedInstitute : undefined,
        },
      })

      console.log(res.data)

      const responseData = res?.data?.data || res?.data || {}
      const professorsData = responseData.data || responseData || []

      setProfessors(Array.isArray(professorsData) ? professorsData : [])
      setPagination({
        current_page: responseData.current_page || 1,
        last_page: responseData.last_page || 1,
        per_page: responseData.per_page || 10,
        total: responseData.total || professorsData.length || 0,
      })
    } catch (err) {
      console.error("Failed to fetch professors:", err)
      setProfessors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessors(1)
  }, [selectedInstitute])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground text-balance">Faculty Directory</h1>
              </div>
              <p className="text-muted-foreground text-balance">
                Discover and connect with professors across all institutes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedInstitute} onValueChange={(val) => setSelectedInstitute(val)}>
                <SelectTrigger className="w-[280px] bg-background/50 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="Filter by Institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutes</SelectItem>
                  {institutes.map((inst) => (
                    <SelectItem key={inst.id} value={String(inst.id)}>
                      {inst.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                Showing {professors.length} of {pagination.total} professors
                {selectedInstitute && selectedInstitute !== "all" && (
                  <span> from {institutes.find((i) => String(i.id) === selectedInstitute)?.name}</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading professors...</span>
            </div>
          </div>
        ) : professors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Users className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No professors found</h3>
            <p className="text-muted-foreground max-w-md">
              {selectedInstitute && selectedInstitute !== "all"
                ? "Try selecting a different institute or clear the filter to see all professors."
                : "There are no professors available at the moment. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map((prof) => (
              <Card
                key={prof.id}
                className="group hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2 border-border/50">
                      <AvatarImage src={`${api2.defaults.baseURL}${prof?.image || ""}`} alt={prof?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {prof.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-balance group-hover:text-primary transition-colors">
                        {prof.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{prof.email}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Institute</span>
                      <Badge variant="secondary" className="text-xs">
                        {prof.institute?.name || "—"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Active Classrooms</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-semibold">{prof.active_classrooms_count}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Rating</span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={Number(prof.avg_rating || 0)} />
                        <span className="text-sm font-semibold">{Number(prof.avg_rating || 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <Link href={`/admin/professors/${prof.id}`}>
                      <Button className="w-full">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pagination.last_page > 1 && !loading && (
          <div className="mt-12 flex justify-center">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pagination.current_page === 1}
                      onClick={() => fetchProfessors(pagination.current_page - 1)}
                      className="gap-2"
                    >
                      <PaginationPrevious />
                      Previous
                    </Button>
                  </PaginationItem>
                  <div className="flex items-center px-6 py-2 text-sm text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                  </div>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => fetchProfessors(pagination.current_page + 1)}
                      className="gap-2"
                    >
                      Next
                      <PaginationNext />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
