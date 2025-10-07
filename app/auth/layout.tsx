'use client';
import { ReactNode, useEffect } from 'react';
import { LoginForm } from "@/components/login-form";
import LoginPageTrial from "@/components/trial/login";
import { Car, GalleryVerticalEnd, GraduationCap } from "lucide-react"
import { CarouselBasic } from '@/components/content';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background text-foreground">
      {/* left: auth children */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center lg:hidden mb-6 gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EchoMind AI</span>
          </div>
          {children}
        </div>
      </div>

      {/* right: content */}
      <div className="relative hidden lg:flex h-full flex-col p-10 bg-card">
        <Link href="/" className="flex items-center gap-2 self-start font-semibold text-foreground">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">EchoMind AI</span>
        </Link>


        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
            Welcome to EchoMind AI
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            A smarter way to evaluate your professors.
          </p>
          <div className="flex justify-center mt-6">
            <CarouselBasic />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 text-sm text-foreground/60">
          <div>Built for a modern educational experience</div>
        </div>
      </div>
    </div>
  );
}