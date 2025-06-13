import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, MessageCircle, Users, Heart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParentProfile {
  id: number;
  userId: string;
  suburb: string | null;
  familySize: string | null;
  numberOfChildren: string | null;
  childrenAges: string[] | null;
  childrenNames: string[] | null;
  littleAboutMe: string | null;
  myLoveLanguage: string | null;
  imProudOf: string | null;
  onePerfectDay: string | null;
}

interface ParentUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  phone: string | null;
  allowCaregiverMessages: boolean | null;
  profile?: ParentProfile;
}

export default function ParentDirectory() {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSuburb, setSearchSuburb] = useState("");
  const { toast } = useToast();

  const { data: parents, isLoading, refetch } = useQuery<ParentUser[]>({
    queryKey: ["/api/parents", searchLocation, searchSuburb],
    enabled: true,
  });

  const handleSearch = () => {
    refetch();
  };

  const handleMessageParent = async (parentId: string, parentName: string) => {
    try {
      // Get current user from auth
      const authResponse = await fetch("/api/auth/user");
      if (!authResponse.ok) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
        return;
      }

      const currentUser = await authResponse.json();
      
      // Send initial message
      const messageResponse = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser.user.id,
          receiverId: parentId,
          content: `Hi ${parentName}! I'm a caregiver interested in connecting with your family. I'd love to learn more about your childcare needs.`,
        }),
      });

      if (messageResponse.ok) {
        toast({
          title: "Message sent successfully",
          description: `Your message has been sent to ${parentName}`,
        });
      } else {
        const error = await messageResponse.json();
        toast({
          title: "Failed to send message",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase() || "P";
  };

  const formatChildrenInfo = (ages: string[] | null, names: string[] | null) => {
    if (!ages || ages.length === 0) return "No children information";
    
    const childCount = ages.length;
    const ageRange = ages.length > 1 ? 
      `${Math.min(...ages.map(Number))} - ${Math.max(...ages.map(Number))} years` : 
      `${ages[0]} years`;
    
    return `${childCount} ${childCount === 1 ? 'child' : 'children'} (${ageRange})`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parent directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Directory</h1>
        <p className="text-gray-600 mb-6">
          Connect with families who are open to hearing from caregivers like you.
        </p>

        {/* Search Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Find Parents in Your Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by location (e.g., Sydney, Melbourne)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Search by suburb (e.g., Bondi, Richmond)"
                  value={searchSuburb}
                  onChange={(e) => setSearchSuburb(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parents && parents.length > 0 ? (
          parents.map((parent) => (
            <Card key={parent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={parent.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {getInitials(parent.firstName, parent.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    {parent.profile?.suburb && (
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{parent.profile.suburb}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Family Information */}
                {parent.profile && (
                  <div className="space-y-3">
                    {parent.profile.numberOfChildren && (
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm">
                          {formatChildrenInfo(parent.profile.childrenAges, parent.profile.childrenNames)}
                        </span>
                      </div>
                    )}

                    {parent.profile.familySize && (
                      <div className="flex items-center text-gray-700">
                        <Heart className="h-4 w-4 mr-2 text-pink-600" />
                        <span className="text-sm">Family of {parent.profile.familySize}</span>
                      </div>
                    )}

                    {parent.profile.myLoveLanguage && (
                      <div>
                        <Badge variant="secondary" className="text-xs">
                          Love Language: {parent.profile.myLoveLanguage}
                        </Badge>
                      </div>
                    )}

                    {parent.profile.littleAboutMe && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {parent.profile.littleAboutMe}
                        </p>
                      </div>
                    )}

                    {parent.profile.mySuperpowerIs && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-sm">
                          <strong>Superpower:</strong> {parent.profile.mySuperpowerIs}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Action Button */}
                <Button
                  onClick={() => handleMessageParent(parent.id, parent.firstName || "this parent")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No parents found</h3>
              <p className="text-gray-600 mb-4">
                {searchLocation || searchSuburb 
                  ? "Try adjusting your search criteria to find parents in your area."
                  : "There are currently no parents available for caregiver messaging."
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchLocation("");
                  setSearchSuburb("");
                  handleSearch();
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Information Footer */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          About the Parent Directory
        </h3>
        <div className="text-blue-800 space-y-2 text-sm">
          <p>
            • Only parents who have opted in to receive messages from caregivers are shown here
          </p>
          <p>
            • Respect family privacy and send thoughtful, professional messages
          </p>
          <p>
            • Parents can update their messaging preferences at any time
          </p>
          <p>
            • All communication is subject to our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
}