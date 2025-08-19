import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { CollaborationDialog } from "@/components/CollaborationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, BarChart3, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  hasChart?: boolean;
  status?: "liked" | "disliked";
}

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentView, setCurrentView] = useState<'all' | 'liked' | 'disliked' | 'history'>('history');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aiva_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "1",
        role: "assistant",
        content: "Hey! I'm AIVA. How can I assist you?",
        timestamp: new Date().toLocaleTimeString(),
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('aiva_messages', JSON.stringify(messages));
  }, [messages]);
  const handleSendMessage = (content: string, includeVisualization?: boolean) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let assistantContent = "I'm processing your request...";
      let hasChart = false;

      // Enhanced detection for monthly reports and data queries
      const isMonthlyReport = /\b(month|monthly|report|reports|data|sales|revenue|performance|analytics|statistics|stats|summary|overview)\b/i.test(content);
      const isDataQuery = /\b(show|display|give|get|provide|tell|what|how)\b.*\b(data|information|info|numbers|figures|metrics)\b/i.test(content);
      
      if (isMonthlyReport || isDataQuery || includeVisualization) {
        // Generate random monthly data
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = months[new Date().getMonth()];
        const previousMonth = months[new Date().getMonth() - 1] || "December";
        
        const currentSales = Math.floor(Math.random() * 500000) + 200000;
        const previousSales = Math.floor(Math.random() * 450000) + 180000;
        const growthRateNum = ((currentSales - previousSales) / previousSales) * 100;
        const growthRate = growthRateNum.toFixed(1);
        
        const totalOrders = Math.floor(Math.random() * 2000) + 800;
        const avgOrderValue = Math.floor(currentSales / totalOrders);
        const customerAcquisition = Math.floor(Math.random() * 300) + 150;
        const customerRetention = (Math.random() * 20 + 75).toFixed(1);

        assistantContent = `📊 **${currentMonth} Monthly Report Summary**

**Sales Performance:**
• Total Revenue: $${currentSales.toLocaleString()}
• Previous Month (${previousMonth}): $${previousSales.toLocaleString()}
• Growth Rate: ${growthRateNum > 0 ? '+' : ''}${growthRate}%

**Key Metrics:**
• Total Orders: ${totalOrders.toLocaleString()}
• Average Order Value: $${avgOrderValue}
• New Customers: ${customerAcquisition}
• Customer Retention: ${customerRetention}%

**Department Breakdown:**
• Fashion: $${Math.floor(currentSales * 0.6).toLocaleString()} (60%)
• Food & Beverages: $${Math.floor(currentSales * 0.4).toLocaleString()} (40%)

The visual chart below shows the detailed breakdown by category.`;
        
        hasChart = true;
      } else if (content.toLowerCase().includes("hello") || content.toLowerCase().includes("hi")) {
        assistantContent = "Hello! I'm here to help you with data analysis, monthly reports, visualizations, and any questions you might have. How can I assist you today?";
      } else {
        assistantContent = "I can help you with monthly reports, data analysis, and visualizations. Try asking about 'monthly sales report' or 'show me this month's data' to see detailed analytics with charts!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString(),
        hasChart,
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleLike = (id?: string) => {
    if (!id) return;
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'liked' } : m));
  };

  const handleDislike = (id?: string) => {
    if (!id) return;
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'disliked' } : m));
  };

  const displayedMessages =
    currentView === 'liked'
      ? messages.filter(m => m.status === 'liked')
      : currentView === 'disliked'
      ? messages.filter(m => m.status === 'disliked')
      : messages;

  if (showChat) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <ChatSidebar collapsed={sidebarCollapsed} onSelectView={setCurrentView} />
          
          <div className="flex-1 flex flex-col">
            <ChatHeader 
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              onShowCollaboration={() => setShowCollaboration(true)}
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {displayedMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    id={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    hasChart={message.hasChart}
                    onLike={handleLike}
                    onDislike={handleDislike}
                  />
                ))}
              </div>
            </main>
            
            <ChatInput onSendMessage={handleSendMessage} />
          </div>

          <CollaborationDialog 
            open={showCollaboration}
            onOpenChange={setShowCollaboration}
          />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-blue text-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/d7cd0b78-b21d-4fe3-80f7-810cad970aaf.png" alt="AIVA logo" className="w-10 h-10 rounded-xl object-contain bg-white/20 p-1" />
            <h1 className="text-2xl font-bold">AIVA</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="text-white border-white/30"
              onClick={() => setShowLogin(true)}
            >
              Log in
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setShowSignup(true)}
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            AIVA Chatbot
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            AIVA delivers precise answers to your queries, summarizes complex data into clear insights,
            and securely retrieves information from your organization’s database.
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-3 text-foreground">
            <li>• Gives required, exact outputs for your questions</li>
            <li>• Summarizes data into actionable points</li>
            <li>• Retrieves data from your organization's database</li>
          </ul>
          <div className="mt-10">
            <Button 
              onClick={() => setShowChat(true)}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              Open AIVA Chat
            </Button>
          </div>
        </div>
      </section>


      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log in to AIVA</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Log in</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create your account</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Name</Label>
              <Input id="signup-name" type="text" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Sign up</Button>
          </form>
        </DialogContent>
      </Dialog>

      <CollaborationDialog 
        open={showCollaboration}
        onOpenChange={setShowCollaboration}
      />
    </div>
  );
};

export default Index;
