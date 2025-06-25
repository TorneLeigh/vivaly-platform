import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, MapPin, DollarSign, Users, CheckCircle } from "lucide-react";

interface SuggestedNanniesProps {
  shareId: string;
  currentUserId: string;
  isCreator: boolean;
}

interface SuggestedNanny {
  id: number;
  userId: string;
  bio: string;
  hourlyRate: string;
  location: string;
  suburb: string;
  rating: string;
  reviewCount: number;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

export default function SuggestedNannies({ shareId, currentUserId, isCreator }: SuggestedNanniesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suggested nannies
  const { data: suggestedNannies = [], isLoading } = useQuery<SuggestedNanny[]>({
    queryKey: [`/api/nanny-shares/${shareId}/suggested-nannies`],
  });

  // Assign nanny mutation
  const assignNannyMutation = useMutation({
    mutationFn: async (nannyId: string) => {
      const response = await fetch(`/api/nanny-shares/${shareId}/assign-nanny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nannyId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to assign nanny");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nanny-shares/${shareId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/nanny-shares/${shareId}/messages`] });
      toast({
        title: "Success",
        description: "Nanny has been assigned to your share!",
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

  const handleAssignNanny = (nannyId: string) => {
    assignNannyMutation.mutate(nannyId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Suggested Nannies
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

  if (suggestedNannies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Suggested Nannies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No nannies found</p>
            <p className="text-sm text-gray-500">
              We'll suggest qualified nannies based on your location and budget.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Suggested Nannies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedNannies.map((nanny) => (
            <div
              key={nanny.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={nanny.profileImageUrl} />
                  <AvatarFallback>
                    {nanny.firstName?.[0]}{nanny.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {nanny.firstName} {nanny.lastName}
                    </h4>
                    {nanny.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{nanny.rating}</span>
                      <span>({nanny.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{nanny.suburb}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${nanny.hourlyRate}/hr</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-700 line-clamp-2 mb-3">
                    {nanny.bio}
                  </p>
                  
                  {isCreator && (
                    <Button
                      onClick={() => handleAssignNanny(nanny.userId)}
                      disabled={assignNannyMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      {assignNannyMutation.isPending ? "Assigning..." : "Assign Nanny"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}