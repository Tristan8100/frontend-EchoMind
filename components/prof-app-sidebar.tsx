import * as React from "react"
import { GraduationCap, Home, BookOpen, User, LogOut, Archive, BarChart3 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Simple navigation for students
const studentNav = [
  {
    title: "Dashboard",
    url: "/student",
    icon: Home,
  },
  {
    title: "My Classrooms",
    url: "/student/classrooms",
    icon: BookOpen,
  },
  {
    title: "Profile",
    url: "/student/profile",
    icon: User,
  },
  {
    title: "Achived Courses",
    url: "/archived",
    icon: Archive,
  },
  {
    title: "My Performance",
    url: "/analytics",
    icon: BarChart3,
  },
]

export function ProfAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/50 transition-colors">
              <a href="/student">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-xl shadow-sm">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">EchoMind AI</span>
                  <span className="text-xs text-muted-foreground font-medium">Professor Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {studentNav.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-11 px-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg group"
                  >
                    <a href={item.url} className="font-medium flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Bottom section with user info */}
        <div className="mt-auto p-3 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <button className="flex items-center gap-1" onClick={() => console.log("logout")}>
                <LogOut className="size-4" />
                <span className="text-xs text-muted-foreground">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}