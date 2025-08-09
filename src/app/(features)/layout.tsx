
"use client";

import { Bot, BotMessageSquare, ImageIcon, BookText, History, Mic, Languages } from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case '/qa':
        return 'Chat';
      case '/summarize':
        return 'Summarize';
      case '/imagine':
        return 'Imagine';
      case '/history':
        return 'History';
      case '/translate':
          return 'Translate';
      default:
        return 'Study Buddy';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="p-4 justify-center">
            <Link href="/qa" className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <h1 className="text-xl font-bold font-headline">Study Buddy</h1>
                </div>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild isActive={pathname === "/qa"} tooltip="Chat">
                <Link href="/qa">
                  <BotMessageSquare />
                  <span>Chat</span>
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
          <SidebarFooter className="p-2 mt-auto">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild isActive={pathname === "/profile"} tooltip="Profile">
                        <Link href="#">
                            <Avatar className="size-8">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                                <AvatarFallback>N</AvatarFallback>
                            </Avatar>
                            <span>Profile</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/60 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h2 className="text-lg font-semibold font-headline hidden md:block">
                    {getPageTitle()}
                </h2>
            </div>
             <div className="w-7 h-7" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
