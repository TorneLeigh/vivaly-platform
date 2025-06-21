import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, X, User, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { CaregiverProfileDisplay } from "@/components/CaregiverProfileDisplay";

// Contact Family Modal Component
interface ContactFamilyModalProps {
  user: any;
  jobData: {
    jobId: string;
    parentId: string;
    jobTitle: string;
  };
  onClose: () => void;
  onSend: (message: string) => void;
  isLoading: boolean;
}

function ContactFamilyModal({ user, jobData, onClose, onSend, isLoading }: ContactFamilyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  
  // Pre-fill cover letter template
  useEffect(() => {
    const template = `Hi! I'm very interested in your ${jobData.jobTitle} position.

I'm ${user.firstName} ${user.lastName}, and I believe I would be a great fit for your family. Here's why:

• [Your key qualifications and experience]
• [What makes you special as a caregiver]
• [Why you're interested in this particular position]

I'd love to discuss this opportunity further and answer any questions you might have about my background and approach to childcare.

Looking forward to hearing from you!

Best regards,
${user.firstName}`;
    
    setCoverLetter(template);
  }, [user, jobData]);

  const handleSend = () => {
    if (coverLetter.trim()) {
      onSend(coverLetter.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex overflow-hidden">
        {/* Profile Preview */}
        <div className="w-1/2 border-r bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Profile Preview</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <CaregiverProfileDisplay userId={user.id} />
            </div>
          </div>
        </div>
        
        {/* Cover Letter */}
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Apply for Position</h2>
                <p className="text-gray-600">{jobData.jobTitle}</p>
              </div>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter..."
                  className="h-64 resize-none"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Your complete profile will be sent along with this message.</strong> 
                  This includes your experience, qualifications, photos, and all other profile information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSend}
                disabled={!coverLetter.trim() || isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? "Sending..." : "Send Application"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'parent' | 'caregiver';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  jobTitle?: string;
  online: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactJobData, setContactJobData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    enabled: !!user
  });

  // Check URL parameters for contact family request
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isContactFamily = urlParams.get('contactFamily');
    const jobId = urlParams.get('jobId');
    const parentId = urlParams.get('parentId');
    const jobTitle = urlParams.get('jobTitle');

    if (isContactFamily === 'true' && jobId && parentId && user?.isNanny) {
      setContactJobData({
        jobId,
        parentId,
        jobTitle: decodeURIComponent(jobTitle || 'Childcare Position')
      });
      setShowContactModal(true);
    }
  }, [user]);

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/getMessages', selectedConversation],
    enabled: !!selectedConversation && !!user,
    queryFn: async () => {
      const response = await fetch(`/api/getMessages?otherUserId=${selectedConversation}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; text: string }) => {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(messageData)
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/getMessages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setNewMessage("");
    }
  });

  // Send job application mutation
  const sendInterestMutation = useMutation({
    mutationFn: async ({ message, jobId, parentId }: { message: string; jobId: string; parentId: string }) => {
      const response = await apiRequest('POST', '/api/send-interest', {
        message,
        jobId,
        parentId
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Sent",
        description: "Your job application has been sent successfully!",
      });
      setShowContactModal(false);
      setContactJobData(null);
      window.history.replaceState({}, '', '/messages');
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  // Function to detect and filter phone numbers and emails
  const filterBannedContent = (text: string) => {
    // Phone number patterns (various formats)
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(\d{10})|(\d{3}[-.\s]\d{3}[-.\s]\d{4})|(\(\d{3}\)\s?\d{3}[-.\s]\d{4})/g;
    
    // Email pattern
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    let filteredText = text;
    let hasBannedContent = false;
    
    // Replace phone numbers
    if (phoneRegex.test(text)) {
      filteredText = filteredText.replace(phoneRegex, '[PHONE NUMBER BLOCKED]');
      hasBannedContent = true;
    }
    
    // Replace emails
    if (emailRegex.test(text)) {
      filteredText = filteredText.replace(emailRegex, '[EMAIL ADDRESS BLOCKED]');
      hasBannedContent = true;
    }
    
    return { filteredText, hasBannedContent };
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const { filteredText, hasBannedContent } = filterBannedContent(newMessage.trim());
      
      sendMessageMutation.mutate({
        receiverId: selectedConversation,
        text: filteredText
      });
      
      if (hasBannedContent) {
        // Show notification that content was blocked
        toast({
          title: "Message Filtered",
          description: "Personal contact information was automatically blocked for privacy and security. Contact details are shared only after confirmed bookings.",
          variant: "default",
        });
      }
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // If contact family modal is active, show it as full screen
  if (showContactModal && contactJobData && user) {
    return <ContactFamilyModal 
      user={user}
      jobData={contactJobData}
      onClose={() => {
        setShowContactModal(false);
        setContactJobData(null);
        window.history.replaceState({}, '', '/messages');
      }}
      onSend={(message: string) => {
        sendInterestMutation.mutate({
          message,
          jobId: contactJobData.jobId,
          parentId: contactJobData.parentId
        });
      }}
      isLoading={sendInterestMutation.isPending}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect with families and caregivers</p>
        </div>

        {/* Safety Notice */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-orange-200 to-orange-300 border-l-4 border-orange-500 text-black p-4 rounded-md mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <strong>🔒 Stay Protected with VIVALY</strong>
                <p className="mt-1 text-sm">
                  To help keep our community safe and ensure we can provide support if needed, <b>VIVALY is only able to assist with issues when all communication has taken place through the VIVALY chat.</b><br />
                  Please avoid sharing personal contact details or moving conversations off-platform until a booking is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 max-h-[450px] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-gray-200">
                            {conversation.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {conversation.participantName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {conversation.jobTitle && (
                          <p className="text-xs text-blue-600 mb-1">{conversation.jobTitle}</p>
                        )}
                        
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No conversations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConv.avatar} />
                        <AvatarFallback className="bg-gray-200">
                          {selectedConv.participantName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConv.participantName}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedConv.online ? 'Online' : 'Last seen 2h ago'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 max-h-[400px] overflow-y-auto">
                  <div className="flex flex-col space-y-2">
                    {messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`my-2 p-2 max-w-[70%] rounded-md ${
                          msg.senderId === user?.id
                            ? "bg-black text-white self-end ml-auto"
                            : "bg-gray-100 text-black self-start mr-auto"
                        }`}
                      >
                        {msg.content || msg.text}
                        <div className={`text-xs mt-1 ${
                          msg.senderId === user?.id ? "text-gray-300" : "text-gray-500"
                        }`}>
                          {new Date(msg.createdAt || msg.timestamp).toLocaleDateString("en-AU", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Privacy Notice */}
                <div className="border-t border-gray-200 bg-orange-50 p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-orange-800">
                        <strong>Privacy Protection:</strong> Personal contact details are only shared after booking confirmation and payment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-black hover:bg-gray-800 text-white">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}