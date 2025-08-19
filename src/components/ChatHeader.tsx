import React, { useState } from "react";
import { Menu, User, Plus, RotateCcw, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollaborationDialog } from "./CollaborationDialog";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onShowCollaboration: () => void;
}

export function ChatHeader({ onToggleSidebar, onShowCollaboration }: ChatHeaderProps) {
  return (
    <header className="bg-gradient-blue text-white p-4 flex items-center justify-between shadow-elegant">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/d7cd0b78-b21d-4fe3-80f7-810cad970aaf.png" alt="AIVA logo" className="w-8 h-8 rounded-md object-contain bg-white/20 p-1" />
          <h1 className="text-xl font-semibold">AIVA</h1>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <User className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RotateCcw className="mr-2 h-4 w-4" />
            Switch Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShowCollaboration}>
            <Link2 className="mr-2 h-4 w-4" />
            Collaboration
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}