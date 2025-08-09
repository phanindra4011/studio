
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
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
        return 'Telugu Thodu';
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
                  <h1 className="text-xl font-bold font-headline">Telugu Thodu</h1>
                </div>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="px-2">
            {isClient && <>
                <SidebarMenuItem>
                <Link href="/qa">
                  <SidebarMenuButton size="lg" isActive={pathname === "/qa"} tooltip="Chat">
                    <React.Fragment>
                      <BotMessageSquare />
                      <span>Chat</span>
                    </React.Fragment>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/summarize">
                  <SidebarMenuButton size="lg" isActive={pathname === "/summarize"} tooltip="Summarize">
                    <React.Fragment>
                      <BookText />
                      <span>Summarize</span>
                    </React.Fragment>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/imagine">
                  <SidebarMenuButton size="lg" isActive={pathname === "/imagine"} tooltip="Imagine">
                    <React.Fragment>
                      <ImageIcon />
                      <span>Imagine</span>
                    </React.Fragment>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/translate">
                    <SidebarMenuButton size="lg" isActive={pathname === "/translate"} tooltip="Translate">
                        <React.Fragment>
                            <Languages />
                            <span>Translate</span>
                        </React.Fragment>
                    </SidebarMenuButton>
                 </Link>
             </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/history">
                  <SidebarMenuButton size="lg" isActive={pathname === "/history"} tooltip="History">
                    <React.Fragment>
                      <History />
                      <span>History</span>
                    </React.Fragment>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            </>}
          </SidebarMenu>
          <SidebarFooter className="p-2 mt-auto flex items-center justify-between">
            <div className="flex-grow">
                 <SidebarMenu>
                    {isClient && <SidebarMenuItem>
                        <Link href="#">
                            <SidebarMenuButton size="lg" isActive={pathname === "/profile"} tooltip="Profile">
                                <React.Fragment>
                                    <Avatar className="size-8">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                                        <AvatarFallback>N</AvatarFallback>
                                    </Avatar>
                                    <span>Profile</span>
                                </React.Fragment>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>}
                 </SidebarMenu>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
                <ThemeToggle />
            </div>
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
             <div className="md:hidden">
                <ThemeToggle />
             </div>
             <div className="w-7 h-7 hidden md:block" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
