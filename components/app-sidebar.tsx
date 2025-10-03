import * as React from "react"
import { GraduationCap, Home, BookOpen, User, LogOut, Archive } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"

// Simple navigation for students
const studentNav = [
  { title: "Dashboard", url: "/user/dashboard", icon: Home },
  { title: "My Classrooms", url: "/user/classrooms", icon: BookOpen },
  { title: "Profile", url: "/user/profile", icon: User },
  { title: "Achived Courses", url: "/user/archived", icon: Archive },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader className="border-b border-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/50 transition-colors">
              <Link href="/student">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-xl shadow-sm">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">EchoMind AI</span>
                  <span className="text-xs text-muted font-medium">Student Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {studentNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-11 px-3 rounded-lg group transition-all duration-200
                      ${isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                  >
                    <Link href={item.url} className="font-medium flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors
                          ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                          }`}
                      >
                        <Icon className="size-4 text-white" />
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Footer / Logout */}
        <div className="mt-auto p-3 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-4 text-primary" />
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <LogOut className="size-4 text-white" />
              <span className="text-white">Logout</span>
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
