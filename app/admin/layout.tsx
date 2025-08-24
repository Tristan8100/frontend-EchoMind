'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ModeToggle } from "@/components/toogle"
import { ProfAppSidebar } from "@/components/prof-app-sidebar"
import { AdminAppSidebar } from "@/components/admin-app-sidebar"


export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
      const { user, setUser } = useAuth();
  
      useEffect(() => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/auth/login");
        return;
      }
  
      const verifyUser = async () => {
        try {
          const res = await api.get("/api/verify-user", { //RETURN THE IMAGE PATH IF EXIST AH
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser(res.data.user_info);
          console.log("User set:", res.data.user_info); // por debugging again
        } catch (error) {
          console.error("Verification failed:", error);
          localStorage.removeItem("token");
          setUser(null);
          router.push("/auth/login");
        }
      };
  
      verifyUser();
    }, [router, setUser]);
  
    // Por debugging
    useEffect(() => {
      console.log("User state updated:", user);
    }, [user]);
  
    if (!user) {
      // This will trigger if verification fails
      return null;
    }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AdminAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <ModeToggle />
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-xl font-semibold">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70">
              
            </p>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
