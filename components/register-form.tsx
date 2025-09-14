'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (credentials: { name: string; student_number: string; password: string }) =>
      api.post('/api/register', credentials).then(res => res.data),
    onSuccess: (data) => {
      console.log('Registration successful:', data);

      // Save email (from laravel) with domain name
      if (data.email) {
        localStorage.setItem('email', data.email);
      }

      // Redirect to verification step
      router.push('/auth/verify-otp');
    },
    onError: (error: any) => {
      console.log('Registration failed:', error);
      if (error.response && error.response.data) {
        const message = error.response.data.message || 
                       error.response.data.errors?.student_number?.[0] || 
                       "Registration failed";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, student_number: studentNumber, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Get started with your student number and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="student_number">Student Number</Label>
                  <Input
                    id="student_number"
                    type="text"
                    placeholder="2022119356"
                    value={studentNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating account..." : "Create account"}
                </Button>
              </div>
              {error && (
                <div className="text-red-500 text-center text-sm mt-2">
                  {error}
                </div>
              )}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
