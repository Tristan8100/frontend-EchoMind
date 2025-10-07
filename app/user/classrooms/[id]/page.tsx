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
import { api2 } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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

interface ClassroomData {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  image?: string;
  code?: string;
  status?: string;
  students: ClassroomStudent[];
}

export default function ClassroomPage() {
  const params = useParams();
  const classroomId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [idError, setIdError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!classroomId) {
      setIdError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const res = await api2.get(`/api/get-classroom-data/${classroomId}`);

      if (!res.data.classroom) {
        setFetchError('Classroom not found.');
        toast.error('Classroom not found.');
        return;
      }

      setClassroom(res.data.classroom);
    } catch {
      setFetchError('Failed to load classroom data.');
      toast.error('Failed to load classroom data.');
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    if (!classroomId) {
      setIdError(true);
      setLoading(false);
      return;
    }

    fetchData();
  }, [fetchData, classroomId]);

  // --- Conditional UI ---
  if (idError) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-300 rounded-lg m-8">
        <h2 className="text-xl font-semibold text-red-700">Missing Classroom ID</h2>
        <p className="text-red-500">
          The classroom ID (cid) is missing from the URL. Please check the route.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-lg font-medium">Loading classroom details...</div>;
  }

  if (fetchError) {
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
        </CardContent>
      </Card>

      <Tabs defaultValue="students">
        <TabsList className="w-full">
          <TabsTrigger value="students">
            Students ({classroom.students.length})
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
      </Tabs>
    </div>
  );
}
