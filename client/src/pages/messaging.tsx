import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Flag, 
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isBlocked: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
  };
}

const MessagingPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const [senderId, setSenderId] = useState('caregiver123');
  const [receiverId, setReceiverId] = useState('parent456');
  const [inboxUserId, setInboxUserId] = useState('parent456');
  const [notification, setNotification] = useState<string | null>(null);
  const [replyForms, setReplyForms] = useState<{[key: number]: string}>({});
  const [showReplyForm, setShowReplyForm] = useState<{[key: number]: boolean}>({});

  // Fetch messages for inbox
  const { data: messagesData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/getMessages', inboxUserId],
    queryFn: async () => {
      const response = await fetch(`/api/getMessages/${inboxUserId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object' && Array.isArray(data.messages)) {
        return data.messages;
      } else {
        return [];
      }
    },
    enabled: !!inboxUserId && activeTab === 'inbox'
  });

  // Ensure messages is always an array with additional safety check
  const messages = Array.isArray(messagesData) ? messagesData : [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { senderId: string; receiverId: string; content: string }) => {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setNotification('✅ Message Sent!');
        setMessageContent('');
        setTimeout(() => setNotification(null), 3000);
        queryClient.invalidateQueries({ queryKey: ['/api/getMessages'] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send message",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  });

  // Report message mutation
  const reportMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/messages/${messageId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'inappropriate_content' }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message flagged for review ✅",
      });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    sendMessageMutation.mutate({
      senderId,
      receiverId,
      content: messageContent
    });
  };

  const handleReplyTo = (originalMessage: Message) => {
    const messageId = originalMessage.id;
    setShowReplyForm(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
    if (!showReplyForm[messageId]) {
      setReplyForms(prev => ({
        ...prev,
        [messageId]: ''
      }));
    }
  };

  const handleQuickReply = async (originalMessage: Message) => {
    const messageId = originalMessage.id;
    const replyContent = replyForms[messageId];
    
    if (!replyContent?.trim()) return;

    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: inboxUserId,
          receiverId: originalMessage.senderId,
          content: replyContent
        }),
      });

      if (response.ok) {
        toast({
          title: "Reply Sent",
          description: "Your reply has been delivered.",
        });
        
        // Clear the reply form
        setReplyForms(prev => ({
          ...prev,
          [messageId]: ''
        }));
        setShowReplyForm(prev => ({
          ...prev,
          [messageId]: false
        }));
        
        // Refresh messages
        refetch();
      }
    } catch (error) {
      toast({
        title: "Failed to Send Reply",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReportMessage = (messageId: number) => {
    reportMessageMutation.mutate(messageId);
  };

  const loadInbox = () => {
    refetch();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-purple-600" />
            Vivaly Messaging
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Secure communication between caregivers and parents
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {notification}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'inbox'
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Inbox
          </button>
        </div>

        {/* Compose Message Tab */}
        {activeTab === 'compose' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Caregiver ➡️ Parent
              </CardTitle>
              <CardDescription>
                Send a message from caregiver to parent. Messages are monitored for safety.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderId">Caregiver ID</Label>
                    <Input
                      id="senderId"
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                      placeholder="Enter caregiver ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverId">Parent ID</Label>
                    <Input
                      id="receiverId"
                      value={receiverId}
                      onChange={(e) => setReceiverId(e.target.value)}
                      placeholder="Enter parent ID"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="messageContent">Message</Label>
                  <Textarea
                    id="messageContent"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={sendMessageMutation.isPending}
                  className="w-full"
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            {/* Inbox Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  📥 Parent Inbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="inboxId">View Inbox for Parent ID</Label>
                    <Input
                      id="inboxId"
                      value={inboxUserId}
                      onChange={(e) => setInboxUserId(e.target.value)}
                      placeholder="Enter parent ID"
                    />
                  </div>
                  <Button onClick={loadInbox} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load Inbox'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No messages found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {inboxUserId ? `No messages for user ${inboxUserId}` : 'Enter a user ID to view messages'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((message: Message) => (
                  <Card key={message.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar>
                            <AvatarImage src={message.sender.profileImageUrl} />
                            <AvatarFallback>
                              {getInitials(message.sender.firstName, message.sender.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                From:
                              </span>
                              <a 
                                href={`/caregiver/${message.senderId}`}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                              >
                                {message.sender.firstName} {message.sender.lastName} ({message.senderId})
                              </a>
                              {message.isBlocked && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold text-gray-900 dark:text-white">To:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-300">
                                {message.receiver.firstName} {message.receiver.lastName} ({message.receiverId})
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                              {message.content}
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              {formatTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReplyTo(message)}
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Reply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportMessage(message.id)}
                          disabled={reportMessageMutation.isPending}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Flag className="h-4 w-4" />
                          Report
                        </Button>
                      </div>
                      
                      {/* Inline Reply Form */}
                      {showReplyForm[message.id] && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Label htmlFor={`reply-${message.id}`} className="text-sm font-medium">
                            Quick Reply
                          </Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id={`reply-${message.id}`}
                              value={replyForms[message.id] || ''}
                              onChange={(e) => setReplyForms(prev => ({
                                ...prev,
                                [message.id]: e.target.value
                              }))}
                              placeholder="Type your reply..."
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleQuickReply(message);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleQuickReply(message)}
                              disabled={!replyForms[message.id]?.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;