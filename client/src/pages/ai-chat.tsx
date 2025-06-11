import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { 
  Bot, 
  User, 
  Send, 
  MessageCircle, 
  Sparkles,
  Baby,
  Heart,
  Users,
  Shield,
  Clock
} from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CareRecommendation {
  message: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm VIVALY's AI assistant. I'm here to help you find the perfect care services for your family. Whether you need a nanny, childcare, elderly care, or any other support, I can provide personalized recommendations and answer your questions. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (messages: { role: string; content: string }[]) => {
      return await apiRequest("POST", "/api/ai/chat", { messages });
    },
    onSuccess: (data: any) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      toast({
        title: "Chat Error",
        description: "Unable to get response. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const recommendationMutation = useMutation({
    mutationFn: async (careData: any) => {
      return await apiRequest("POST", "/api/ai/care-recommendations", careData);
    },
    onSuccess: (data: CareRecommendation) => {
      let responseContent = data.message;
      
      if (data.suggestions && data.suggestions.length > 0) {
        responseContent += "\n\n**Suggestions:**\n" + data.suggestions.map(s => `• ${s}`).join('\n');
      }
      
      if (data.followUpQuestions && data.followUpQuestions.length > 0) {
        responseContent += "\n\n**Questions to help me assist you better:**\n" + data.followUpQuestions.map(q => `• ${q}`).join('\n');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      toast({
        title: "Recommendation Error",
        description: "Unable to get care recommendations. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Check if the message seems like a care recommendation request
    const careKeywords = ['nanny', 'childcare', 'elderly care', 'babysitter', 'caregiver', 'care', 'help finding', 'recommend', 'looking for'];
    const isCareRequest = careKeywords.some(keyword => 
      inputMessage.toLowerCase().includes(keyword)
    );

    if (isCareRequest) {
      // Use care recommendation API
      recommendationMutation.mutate({
        careType: 'nanny', // Default, AI will adjust based on context
        location: 'Australia', // Default location
        specialNeeds: inputMessage
      });
    } else {
      // Use general chat API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      chatHistory.push({ role: 'user', content: inputMessage });
      
      chatMutation.mutate(chatHistory);
    }
  };

  const handleQuickAction = (actionType: string) => {
    let message = "";
    switch (actionType) {
      case 'nanny':
        message = "I'm looking for a nanny for my child. Can you help me find the right match?";
        break;
      case 'childcare':
        message = "I need childcare services. What should I consider when choosing?";
        break;
      case 'elderly':
        message = "I'm looking for elderly care services for my parent. What options are available?";
        break;
      case 'safety':
        message = "What safety considerations should I keep in mind when hiring a caregiver?";
        break;
      case 'emergency':
        message = "What should I do in case of an emergency while my child is with a caregiver?";
        break;
      default:
        return;
    }
    setInputMessage(message);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            VIVALY AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized care recommendations and support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('nanny')}
                >
                  <Baby className="h-4 w-4 mr-2" />
                  Find a Nanny
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('childcare')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Childcare Options
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('elderly')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Elderly Care
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('safety')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Tips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('emergency')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Emergency Help
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {message.role === 'user' ? (
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me about care services, safety tips, or any questions..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                      disabled={chatMutation.isPending || recommendationMutation.isPending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || chatMutation.isPending || recommendationMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Powered by ChatGPT
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Australian Care Specialist
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}