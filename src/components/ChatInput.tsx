import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, BarChart3, Mic } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatInputProps {
  onSendMessage: (message: string, includeVisualization?: boolean) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showVisualization, setShowVisualization] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), showVisualization);
      setMessage("");
      setShowVisualization(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicrophoneToggle = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording functionality
    if (!isRecording) {
      // Start recording
      console.log("Starting voice recording...");
    } else {
      // Stop recording
      console.log("Stopping voice recording...");
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        {/* Visualization Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 mb-1"
              title="Add Visualization"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Microsoft Activator Visualization</DialogTitle>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Visualization</CardTitle>
                <CardDescription>
                  Enable visualization for your query using Microsoft Activator integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include in next query</span>
                  <Button
                    variant={showVisualization ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowVisualization(!showVisualization)}
                  >
                    {showVisualization ? "Enabled" : "Enable"}
                  </Button>
                </div>
                {showVisualization && (
                  <Badge variant="secondary" className="w-fit">
                    ✓ Visualization will be generated with your next query
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  When enabled, your query results will be automatically converted into charts, graphs, and visual representations.
                </p>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type something....."
            className="min-h-[44px] max-h-32 resize-none pr-12 py-3"
            rows={1}
          />
          {showVisualization && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-12 text-xs"
            >
              📊 Viz
            </Badge>
          )}
        </div>

        {/* Microphone Button */}
        <Button
          type="button"
          variant={isRecording ? "default" : "outline"}
          size="icon"
          className="shrink-0 mb-1"
          onClick={handleMicrophoneToggle}
          title={isRecording ? "Stop Recording" : "Start Voice Recording"}
        >
          <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
        </Button>

        {/* Additional Options Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 mb-1"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          className="shrink-0 mb-1 bg-gradient-primary hover:bg-primary/90"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}