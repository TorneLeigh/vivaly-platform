import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, DollarSign, Star, User, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function NannyDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [availability, setAvailability] = useState(true);

  const { data: nannyProfile } = useQuery({
    queryKey: ["/api/nannies/profile"],
    enabled: isAuthenticated,
  });

  const { data: upcomingBookings } = useQuery({
    queryKey: ["/api/bookings/upcoming"],
    enabled: isAuthenticated,
  });

  const { data: earnings } = useQuery({
    queryKey: ["/api/nannies/earnings"],
    enabled: isAuthenticated,
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (isAvailable: boolean) => {
      await apiRequest("PATCH", "/api/nannies/availability", { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nannies/profile"] });
      toast({
        title: "Availability Updated",
        description: "Your availability status has been updated successfully.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <Button onClick={() => window.location.href = "/login"}>Log In</Button>
        </div>
      </div>
    );
  }

  const profileCompletion = nannyProfile ? 
    ((nannyProfile.hasPhotoId ? 1 : 0) + 
     (nannyProfile.hasWwcc ? 1 : 0) + 
     (nannyProfile.hasPoliceCheck ? 1 : 0) + 
     (nannyProfile.hasFirstAid ? 1 : 0) + 
     (nannyProfile.bio ? 1 : 0)) / 5 * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600">Manage your profile, bookings, and earnings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">${earnings?.thisMonth || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{upcomingBookings?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold">{nannyProfile?.rating || "5.0"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                  <p className="text-2xl font-bold">{Math.round(profileCompletion)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile to get more bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round(profileCompletion)}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Photo ID Verification</span>
                        {nannyProfile?.hasPhotoId ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Working with Children Check</span>
                        {nannyProfile?.hasWwcc ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Police Check</span>
                        {nannyProfile?.hasPoliceCheck ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">First Aid Certificate</span>
                        {nannyProfile?.hasFirstAid ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        }
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      Complete Missing Items
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability Status</CardTitle>
                  <CardDescription>Control when you receive booking requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="availability"
                      checked={availability}
                      onCheckedChange={(checked) => {
                        setAvailability(checked);
                        updateAvailabilityMutation.mutate(checked);
                      }}
                    />
                    <Label htmlFor="availability">
                      {availability ? "Available for bookings" : "Not available"}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    When available, families can send you booking requests
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Update your profile information and credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Profile editing features coming soon</p>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>Manage your upcoming and past bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings && upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{booking.serviceType}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                            </p>
                            <p className="text-sm text-gray-600">Duration: {booking.endTime}</p>
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No upcoming bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Track your income and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Detailed earnings tracking coming soon</p>
                  <Button variant="outline">View Payment History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}