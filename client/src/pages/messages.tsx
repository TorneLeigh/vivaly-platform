import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MessageThread from "@/components/message-thread";
import { formatRelativeTime } from "@/lib/utils";
import { MessageCircle, Users, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Message, User } from "@shared/schema";

export default function Messages() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const currentUserId = 5; // parent user
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/messages/conversations", currentUserId],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const handleSelectConversation = (user: User) => {
    setSelectedUserId(user.id);
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-warm-gray mb-2">Messages</h1>
          <p className="text-gray-600">Stay connected with your caregivers and families</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Inbox className="w-5 h-5 mr-2" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-3 p-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Start by messaging a caregiver from their profile
                    </p>
                    <Button className="bg-coral hover:bg-coral/90">
                      Find Caregivers
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation: { user: User, lastMessage: Message, unreadCount: number }) => (
                      <div
                        key={conversation.user.id}
                        onClick={() => handleSelectConversation(conversation.user)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedUserId === conversation.user.id ? 'bg-coral bg-opacity-5 border-r-2 border-coral' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage 
                              src={conversation.user.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                              alt={`${conversation.user.firstName} ${conversation.user.lastName}`} 
                            />
                            <AvatarFallback>
                              {conversation.user.firstName.charAt(0)}{conversation.user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {conversation.user.firstName} {conversation.user.lastName}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {conversation.user.isNanny && (
                                  <Badge variant="secondary" className="bg-soft-green bg-opacity-10 text-soft-green text-xs">
                                    Nanny
                                  </Badge>
                                )}
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-coral text-white text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.isBlocked 
                                ? "Message blocked - contains external contact info"
                                : conversation.lastMessage.content
                              }
                            </p>
                            
                            <p className="text-xs text-gray-500 mt-1">
                              {formatRelativeTime(conversation.lastMessage.createdAt!)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedUserId && selectedUser ? (
              <MessageThread
                currentUserId={currentUserId}
                otherUserId={selectedUserId}
                otherUser={selectedUser}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Safe Messaging</h3>
                  <p className="text-blue-800 text-sm">
                    For your safety, all messages are monitored. Messages containing phone numbers, 
                    email addresses, or external contact information will be automatically blocked. 
                    Keep all communication within the CareConnect platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
