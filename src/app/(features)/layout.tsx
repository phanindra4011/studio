
"use client";

import { BookText, BotMessageSquare, Image as ImageIcon, Sparkles, History, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case '/qa':
        return 'Q&A';
      case '/summarize':
        return 'Summarize Content';
      case '/imagine':
        return 'Imagine';
      case '/translate':
        return 'Translate';
      case '/history':
        return 'History';
      default:
        return 'Vidyarthi AI';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="p-4">
            <Link href="/qa" className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold font-headline">Vidyarthi AI</h1>
                  <p className="text-xs text-muted-foreground">Your AI Tutor</p>
                </div>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/qa"} tooltip="Q&A">
                <Link href="/qa">
                  <BotMessageSquare />
                  <span>Q&A</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/summarize"} tooltip="Summarize">
                <Link href="/summarize">
                  <BookText />
                  <span>Summarize</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/imagine"} tooltip="Imagine">
                <Link href="/imagine">
                  <ImageIcon />
                  <span>Imagine</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/translate"} tooltip="Translate">
                <Link href="/translate">
                  <Languages />
                  <span>Translate</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/history"} tooltip="History">
                <Link href="/history">
                  <History />
                  <span>History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/60 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-lg font-semibold font-headline hidden md:block">
                {getPageTitle()}
            </h2>
             <div className="w-7 h-7" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
