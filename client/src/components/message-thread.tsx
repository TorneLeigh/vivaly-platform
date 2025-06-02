import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Message, User } from "@shared/schema";

interface MessageThreadProps {
  currentUserId: number;
  otherUserId: number;
  otherUser: User;
}

export default function MessageThread({ currentUserId, otherUserId, otherUser }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages/conversation", currentUserId, otherUserId],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        senderId: currentUserId,
        receiverId: otherUserId,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/messages/conversation", currentUserId, otherUserId] 
      });
      setNewMessage("");
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">Loading conversation...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {otherUser.firstName} {otherUser.lastName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message: Message & { sender: User, receiver: User }) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? "bg-coral text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.isBlocked ? (
                      <div className="flex items-center text-red-500">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm italic">
                          Message blocked - contains external contact info
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? "text-white/70" : "text-gray-500"
                    }`}>
                      {formatRelativeTime(message.createdAt!)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-coral hover:bg-coral/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Note: Messages containing phone numbers, emails, or external contact info will be blocked for safety.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
