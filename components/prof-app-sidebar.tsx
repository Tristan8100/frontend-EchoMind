"use client";

import * as React from "react";
import {
  GraduationCap,
  Home,
  BookOpen,
  User,
  LogOut,
  Archive,
  BarChart3,
  MessageSquarePlus,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ConversationSidebar from "./professor/conversations";

const studentNav = [
  { title: "Dashboard", url: "/professor/dashboard", icon: Home },
  { title: "My Classrooms", url: "/professor/classrooms", icon: BookOpen },
  { title: "Profile", url: "/professor/profile", icon: User },
  { title: "Archived Courses", url: "/professor/archived", icon: Archive },
];

export function ProfAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Logo/Header */}
      <SidebarHeader className="border-b border-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-accent/50 transition-colors"
            >
              <a href="/student">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-xl shadow-sm">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    EchoMind AI
                  </span>
                  <span className="text-xs font-medium">
                    Professor Portal
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        {/* Main Nav */}
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {studentNav.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 px-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg group"
                  >
                    <Link
                      href={item.url}
                      className="font-medium flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <Icon className="size-4 text-white transition-colors" />
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Conversations Section */}
        <SidebarGroup>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Conversations
            </span>
            <button
              onClick={() => {
                const event = new CustomEvent("new-conversation");
                window.dispatchEvent(event);
              }}
              className="p-1 rounded-md hover:bg-accent transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4 hover:text-primary" />
            </button>
          </div>

          {/* scroll area */}
          <div className="max-h-[40vh] overflow-y-auto overflow-x-hidden pr-1 [&::-webkit-scrollbar]:hidden">
            <ConversationSidebar />
          </div>
        </SidebarGroup>

        {/* Bottom user section */}
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
  );
}
