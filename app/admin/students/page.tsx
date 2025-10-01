"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Student {
  id: number;
  name: string;
  email: string;
  classrooms_count: number;
  ratings_count: number;
}

interface PaginatedResponse {
  data: Student[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // committed search query

  useEffect(() => {
    fetchStudents(currentPage, query);
  }, [currentPage, query]);

  const fetchStudents = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    try {
      const response = await api2.get<PaginatedResponse>(`/api/get-students?page=${page}&search=${searchTerm}`);
      setStudents(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page when searching
    setQuery(search);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Students</CardTitle>
          <form
            onSubmit={handleSearch}
            className="flex gap-2 mt-4 max-w-md"
          >
            <Input
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Classrooms</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-6 w-6 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-12" />
                      </TableCell>
                    </TableRow>
                  ))
                : students.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell>{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {student.classrooms_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {student.ratings_count}
                        </Badge>
                      </TableCell>
                        <TableCell>
                            <Link href={`/admin/students/${student.id}`}><Button>View</Button></Link>
                        </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && lastPage > 1 && (
            <Pagination className="mt-6 flex justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: lastPage }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < lastPage) setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
