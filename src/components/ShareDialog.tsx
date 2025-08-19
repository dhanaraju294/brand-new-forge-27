import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContent: string;
}

export function ShareDialog({ open, onOpenChange, messageContent }: ShareDialogProps) {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const { toast } = useToast();

  // Sample collaborators (in real app, this would come from props or context)
  const collaborators: Collaborator[] = [
    { id: "1", name: "Jacinth Gilbert", email: "jacinth@example.com" },
    { id: "2", name: "Alex Johnson", email: "alex@example.com" },
    { id: "3", name: "Sarah Wilson", email: "sarah@example.com" },
    { id: "4", name: "Mike Davis", email: "mike@example.com" }
  ];

  const handleCollaboratorToggle = (collaboratorId: string) => {
    setSelectedCollaborators(prev =>
      prev.includes(collaboratorId)
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const handleShare = () => {
    if (selectedCollaborators.length === 0) {
      toast({
        title: "No collaborators selected",
        description: "Please select at least one collaborator to share with.",
        variant: "destructive"
      });
      return;
    }

    const selectedNames = collaborators
      .filter(c => selectedCollaborators.includes(c.id))
      .map(c => c.name);

    toast({
      title: "Message shared successfully!",
      description: `Shared with ${selectedNames.join(", ")}`
    });

    setSelectedCollaborators([]);
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    if (selectedCollaborators.length === collaborators.length) {
      setSelectedCollaborators([]);
    } else {
      setSelectedCollaborators(collaborators.map(c => c.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Share with Collaborators
          </DialogTitle>
        </DialogHeader>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Message Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 bg-muted p-2 rounded">
              {messageContent}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Select Collaborators</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCollaborators.length === collaborators.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleCollaboratorToggle(collaborator.id)}
              >
                <Checkbox
                  checked={selectedCollaborators.includes(collaborator.id)}
                  onCheckedChange={() => handleCollaboratorToggle(collaborator.id)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {collaborator.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{collaborator.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{collaborator.email}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleShare}
              disabled={selectedCollaborators.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Share ({selectedCollaborators.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}