
"use client";

import { BookText, BotMessageSquare, Image as ImageIcon, Sparkles } from "lucide-react";
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
      default:
        return 'Vidyarthi AI';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader className="p-4">
            <Link href="/qa" className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline">Vidyarthi AI</h1>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/qa"} tooltip="Q&A">
                <Link href="/qa">
                  <BotMessageSquare />
                  <span>Q&A</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/summarize"} tooltip="Summarize">
                <Link href="/summarize">
                  <BookText />
                  <span>Summarize</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/imagine"} tooltip="Imagine">
                <Link href="/imagine">
                  <ImageIcon />
                  <span>Imagine</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/80 backdrop-blur-sm">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold font-headline">
                {getPageTitle()}
            </h2>
             <div className="w-7 h-7" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
