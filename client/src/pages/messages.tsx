import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
  Search,
  Phone,
  Video
} from "lucide-react";
import type { Message, User as UserType } from "@shared/schema";

type MessageWithUsers = Message & { sender: UserType, receiver: UserType };
type Conversation = { user: UserType, lastMessage: Message, unreadCount: number };

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<UserType | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<MessageWithUsers[]>({
    queryKey: ["/api/messages", selectedConversation?.id],
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: number; content: string }) => {
      return apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Your message has been delivered.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation.id,
      content: newMessage.trim(),
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with families and caregivers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start by booking a caregiver</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.user.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.user)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.user.profileImage || ""} />
                          <AvatarFallback>
                            {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.user.firstName} {conversation.user.lastName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage.content}
                          </p>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.profileImage || ""} />
                        <AvatarFallback>
                          {selectedConversation.firstName[0]}{selectedConversation.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.firstName} {selectedConversation.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.isNanny ? 'Caregiver' : 'Parent'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    {messagesLoading ? (
                      <div className="text-center text-gray-500 py-8">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender.id === selectedConversation.id ? 'justify-start' : 'justify-end'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender.id === selectedConversation.id
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'bg-orange-500 text-white'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender.id === selectedConversation.id
                                    ? 'text-gray-500'
                                    : 'text-orange-100'
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />

                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        style={{ backgroundColor: '#FF6B35' }}
                        className="text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}