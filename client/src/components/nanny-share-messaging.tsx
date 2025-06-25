import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle } from "lucide-react";

interface NannyShareMessagingProps {
  shareId: string;
  currentUserId: string;
}

interface ShareMessage {
  id: number;
  shareId: string;
  senderId: string;
  message: string;
  messageType: string;
  createdAt: string;
  senderProfile?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function NannyShareMessaging({ shareId, currentUserId }: NannyShareMessagingProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<ShareMessage[]>({
    queryKey: [`/api/nanny-shares/${shareId}/messages`],
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch(`/api/nanny-shares/${shareId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nanny-shares/${shareId}/messages`] });
      setNewMessage("");
      scrollToBottom();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageTypeStyle = (messageType: string) => {
    switch (messageType) {
      case "system":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "notification":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Share Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Share Messages
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-2 mb-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.senderId === currentUserId ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {message.messageType !== "system" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.senderProfile?.profileImageUrl} />
                      <AvatarFallback className="text-xs">
                        {message.senderProfile?.firstName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.messageType === "system" 
                        ? `mx-auto text-center ${getMessageTypeStyle(message.messageType)} border rounded-lg p-2 text-sm`
                        : message.senderId === currentUserId
                        ? "ml-auto"
                        : "mr-auto"
                    }`}
                  >
                    {message.messageType === "system" ? (
                      <p>{message.message}</p>
                    ) : (
                      <>
                        <div
                          className={`rounded-lg px-3 py-2 break-words ${
                            message.senderId === currentUserId
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.senderId !== currentUserId && (
                            <div className="text-xs font-medium mb-1">
                              {message.senderProfile?.firstName} {message.senderProfile?.lastName}
                            </div>
                          )}
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            message.senderId === currentUserId ? "text-right" : "text-left"
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}