import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, MapPin, Calendar, DollarSign, Clock, User, MessageCircle } from "lucide-react";
import NannyShareMessaging from "@/components/nanny-share-messaging";
import SuggestedNannies from "@/components/suggested-nannies";
import NannySharePayment from "@/components/nanny-share-payment";

interface NannyShare {
  id: string;
  creatorId: string;
  title: string;
  location: string;
  suburb: string;
  rate: string;
  schedule: string;
  startDate: string;
  endDate?: string;
  maxFamilies: number;
  childrenDetails: string;
  requirements?: string;
  nannyId?: string;
  status: string;
  participants: string[];
  createdAt: string;
  creatorProfile?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function NannyShareDetailsPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const shareId = params.id;

  const { data: share, isLoading } = useQuery<NannyShare>({
    queryKey: [`/api/nanny-shares/${shareId}`],
    enabled: !!shareId,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const joinShareMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nanny-shares/${shareId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join nanny share");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nanny-shares/${shareId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/nanny-shares"] });
      toast({
        title: "Success",
        description: "You have successfully joined this nanny share!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800";
      case "full": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleJoinShare = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join a nanny share.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user.activeRole !== "parent") {
      toast({
        title: "Parent Role Required",
        description: "Switch to parent role to join nanny shares.",
        variant: "destructive",
      });
      return;
    }

    joinShareMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nanny Share Not Found</h1>
          <Button onClick={() => navigate("/nanny-sharing")}>
            Back to Nanny Sharing
          </Button>
        </div>
      </div>
    );
  }

  const isUserParticipant = user && share.participants.includes(user.id);
  const isCreator = user && share.creatorId === user.id;
  const canJoin = user && 
    user.activeRole === "parent" && 
    !isUserParticipant && 
    share.status === "open" && 
    share.participants.length < share.maxFamilies;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/nanny-sharing")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Nanny Sharing
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs for different sections */}
          {isUserParticipant && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="nannies">Nannies</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Share Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{share.title}</CardTitle>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={share.creatorProfile?.profileImageUrl} />
                      <AvatarFallback>
                        {share.creatorProfile?.firstName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {share.creatorProfile?.firstName} {share.creatorProfile?.lastName}
                    </span>
                    <span className="text-sm text-gray-500">• Creator</span>
                  </div>
                </div>
                <Badge className={getStatusColor(share.status)} variant="secondary">
                  {share.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{share.suburb}, {share.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{share.schedule}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>${share.rate}/hr (split between families)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{share.participants.length}/{share.maxFamilies} families</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  Starts {new Date(share.startDate).toLocaleDateString()}
                  {share.endDate && ` - Ends ${new Date(share.endDate).toLocaleDateString()}`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Children Details */}
          <Card>
            <CardHeader>
              <CardTitle>Children Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{share.childrenDetails}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {share.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{share.requirements}</p>
              </CardContent>
            </Card>
          )}
              </TabsContent>
              
              <TabsContent value="messages" className="mt-6">
                <NannyShareMessaging 
                  shareId={share.id} 
                  currentUserId={user?.id || ""} 
                />
              </TabsContent>
              
              <TabsContent value="nannies" className="mt-6">
                <SuggestedNannies 
                  shareId={share.id} 
                  currentUserId={user?.id || ""} 
                  isCreator={isCreator}
                />
              </TabsContent>
              
              <TabsContent value="payment" className="mt-6">
                <NannySharePayment 
                  shareId={share.id} 
                  share={share}
                  currentUserId={user?.id || ""} 
                />
              </TabsContent>
            </Tabs>
          )}
          
          {/* Show details only for non-participants */}
          {!isUserParticipant && (
            <>
              {/* Share Header */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{share.title}</CardTitle>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={share.creatorProfile?.profileImageUrl} />
                          <AvatarFallback>
                            {share.creatorProfile?.firstName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {share.creatorProfile?.firstName} {share.creatorProfile?.lastName}
                        </span>
                        <span className="text-sm text-gray-500">• Creator</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(share.status)} variant="secondary">
                      {share.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{share.suburb}, {share.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{share.schedule}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span>${share.rate}/hr (split between families)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span>{share.participants.length}/{share.maxFamilies} families</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>
                      Starts {new Date(share.startDate).toLocaleDateString()}
                      {share.endDate && ` - Ends ${new Date(share.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Children Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Children Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{share.childrenDetails}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {share.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{share.requirements}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join Share */}
          <Card>
            <CardHeader>
              <CardTitle>Join This Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    You need to be logged in to join a nanny share.
                  </p>
                  <Button 
                    onClick={() => navigate("/login")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Login to Join
                  </Button>
                </div>
              ) : isUserParticipant ? (
                <div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                    You're participating
                  </Badge>
                  <p className="text-sm text-gray-600">
                    You are already part of this nanny share.
                  </p>
                </div>
              ) : isCreator ? (
                <div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
                    You created this
                  </Badge>
                  <p className="text-sm text-gray-600">
                    You are the creator of this nanny share.
                  </p>
                </div>
              ) : canJoin ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Join this nanny share to split costs with other families.
                  </p>
                  <Button
                    onClick={handleJoinShare}
                    disabled={joinShareMutation.isPending}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {joinShareMutation.isPending ? "Joining..." : "Join Share"}
                  </Button>
                </div>
              ) : share.status === "full" ? (
                <div>
                  <p className="text-sm text-gray-600">
                    This nanny share is currently full.
                  </p>
                </div>
              ) : user.activeRole !== "parent" ? (
                <div>
                  <p className="text-sm text-gray-600">
                    Switch to parent role to join nanny shares.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    This share is not available for joining.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Participating Families</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={share.creatorProfile?.profileImageUrl} />
                    <AvatarFallback>
                      {share.creatorProfile?.firstName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {share.creatorProfile?.firstName} {share.creatorProfile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Creator</p>
                  </div>
                </div>
                
                {share.participants.length > 1 && (
                  <p className="text-sm text-gray-600">
                    + {share.participants.length - 1} other {share.participants.length === 2 ? 'family' : 'families'}
                  </p>
                )}
                
                {share.participants.length < share.maxFamilies && (
                  <p className="text-sm text-gray-500">
                    {share.maxFamilies - share.participants.length} more {share.maxFamilies - share.participants.length === 1 ? 'family' : 'families'} needed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total hourly rate:</span>
                  <span>${share.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Split between families:</span>
                  <span>{share.participants.length}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Your cost per hour:</span>
                  <span>${(parseFloat(share.rate) / share.participants.length).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}