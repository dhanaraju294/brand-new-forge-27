import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollaborationDialog({ open, onOpenChange }: CollaborationDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "1", name: "Jacinth Gilbert", email: "jacinth@example.com" },
    { id: "2", name: "Alex Johnson", email: "alex@example.com" }
  ]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddCollaborator = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and email fields.",
        variant: "destructive"
      });
      return;
    }

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: newName.trim(),
      email: newEmail.trim()
    };

    setCollaborators([...collaborators, newCollaborator]);
    setNewName("");
    setNewEmail("");
    
    toast({
      title: "Success",
      description: `${newName} has been added to collaborators.`
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    const collaborator = collaborators.find(c => c.id === id);
    setCollaborators(collaborators.filter(c => c.id !== id));
    
    toast({
      title: "Removed",
      description: `${collaborator?.name} has been removed from collaborators.`
    });
  };

  const handleEditCollaborator = (id: string) => {
    const collaborator = collaborators.find(c => c.id === id);
    if (collaborator) {
      setNewName(collaborator.name);
      setNewEmail(collaborator.email);
      setEditingId(id);
    }
  };

  const handleUpdateCollaborator = () => {
    if (!newName.trim() || !newEmail.trim() || !editingId) return;

    setCollaborators(collaborators.map(c => 
      c.id === editingId 
        ? { ...c, name: newName.trim(), email: newEmail.trim() }
        : c
    ));

    setNewName("");
    setNewEmail("");
    setEditingId(null);
    
    toast({
      title: "Updated",
      description: "Collaborator has been updated successfully."
    });
  };

  const cancelEdit = () => {
    setNewName("");
    setNewEmail("");
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Collaboration Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Collaborator</TabsTrigger>
            <TabsTrigger value="modify">Modify Collaborators</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingId ? "Edit Collaborator" : "Add New Collaborator"}
                </CardTitle>
                <CardDescription>
                  {editingId ? "Update collaborator information" : "Add someone to share query results with"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingId ? handleUpdateCollaborator : handleAddCollaborator}
                    className="flex-1"
                  >
                    {editingId ? "Update Collaborator" : "Add Collaborator"}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Collaborators</CardTitle>
                <CardDescription>
                  Manage your collaboration list for sharing query results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {collaborators.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No collaborators added yet. Use the "Add Collaborator" tab to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{collaborator.name}</p>
                            <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCollaborator(collaborator.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}