import React, { useState } from "react";
import { Search, MessageSquare, Bookmark, User, Clock, Heart, HeartCrack, Building2, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  { title: "About company", icon: Building2, href: "#" },
  { title: "Bookmarks", icon: Bookmark, href: "#" },
  { title: "Personal Projects", icon: User, href: "#" },
  { title: "Liked messages", icon: Heart, href: "#" },
  { title: "Disliked messages", icon: HeartCrack, href: "#" },
  { title: "History", icon: Clock, href: "#" },
];

interface ChatSidebarProps {
  collapsed: boolean;
  onSelectView?: (view: 'liked' | 'disliked' | 'history') => void;
}

export function ChatSidebar({ collapsed, onSelectView }: ChatSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} bg-sidebar border-sidebar-border transition-all duration-300`}>
      <SidebarContent className="p-4">
        {!collapsed && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
              <Input 
                placeholder="Search" 
                className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
              />
            </div>
          </div>
        )}
        
        <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent mb-2"
            >
              {!collapsed && <span className="text-sm font-medium">Menu</span>}
              {collapsed ? (
                <MessageSquare className="h-5 w-5" />
              ) : (
                isMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="text-sidebar-foreground hover:bg-sidebar-accent">
                        <a
                          href={item.href}
                          className="flex items-center gap-3"
                          onClick={(e) => {
                            if (!onSelectView) return;
                            if (item.title === 'Liked messages') {
                              e.preventDefault();
                              onSelectView('liked');
                            } else if (item.title === 'Disliked messages') {
                              e.preventDefault();
                              onSelectView('disliked');
                            } else if (item.title === 'History') {
                              e.preventDefault();
                              onSelectView('history');
                            }
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </CollapsibleContent>
        </Collapsible>

        {!collapsed && (
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  JG
                </AvatarFallback>
              </Avatar>
              <span className="text-sidebar-foreground text-sm font-medium">Jacinth Gilbert</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}