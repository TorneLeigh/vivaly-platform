import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, DollarSign, Star, MessageSquare, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChildcareProvider {
  id: number;
  centerName: string;
  description: string;
  suburb: string;
  totalCapacity: number;
  currentEnrollments: number;
  hourlyRate: string;
  dailyRate: string;
  weeklyRate: string;
  ageGroups: string[];
  operatingDays: string[];
  startTime: string;
  endTime: string;
  verificationStatus: string;
}

interface ChildcareEnrollment {
  id: number;
  childName: string;
  childAge: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  startDate: string;
  enrollmentType: string;
  status: string;
  weeklyFee: string;
  createdAt: string;
}

export default function ChildcareDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock current user ID - in real app, get from auth context
  const currentUserId = 1;

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["/api/childcare-providers/user", currentUserId],
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/childcare-enrollments/provider", provider?.id],
    enabled: !!provider?.id,
  });

  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ enrollmentId, status }: { enrollmentId: number; status: string }) => {
      const response = await fetch(`/api/childcare-enrollments/${enrollmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update enrollment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/childcare-enrollments/provider"] });
      toast({
        title: "Enrollment Updated",
        description: "The enrollment status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update enrollment status. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (providerLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No Childcare Provider Profile</h2>
            <p className="text-muted-foreground mb-4">
              You need to register as a childcare provider to access this dashboard.
            </p>
            <Button asChild>
              <a href="/become-childcare-provider">Register as Provider</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingEnrollments = enrollments.filter((e: ChildcareEnrollment) => e.status === "pending");
  const activeEnrollments = enrollments.filter((e: ChildcareEnrollment) => e.status === "approved");
  const availableSpots = provider.totalCapacity - provider.currentEnrollments;
  const occupancyRate = Math.round((provider.currentEnrollments / provider.totalCapacity) * 100);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Childcare Dashboard</h1>
          <p className="text-muted-foreground">{provider.centerName}</p>
        </div>
        <Badge 
          variant={provider.verificationStatus === "approved" ? "default" : "secondary"}
          className="text-sm"
        >
          {provider.verificationStatus === "approved" ? "Verified Provider" : "Pending Verification"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.totalCapacity}</div>
                <p className="text-xs text-muted-foreground">
                  Licensed capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Enrollments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.currentEnrollments}</div>
                <p className="text-xs text-muted-foreground">
                  {occupancyRate}% occupancy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableSpots}</div>
                <p className="text-xs text-muted-foreground">
                  Spots remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${provider.weeklyRate}</div>
                <p className="text-xs text-muted-foreground">
                  Per child per week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
                <CardDescription>Latest enrollment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingEnrollments.slice(0, 3).map((enrollment: ChildcareEnrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{enrollment.childName}</p>
                        <p className="text-sm text-muted-foreground">Age: {enrollment.childAge}</p>
                        <p className="text-sm text-muted-foreground">Parent: {enrollment.parentName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateEnrollmentMutation.mutate({ 
                            enrollmentId: enrollment.id, 
                            status: "approved" 
                          })}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateEnrollmentMutation.mutate({ 
                            enrollmentId: enrollment.id, 
                            status: "rejected" 
                          })}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingEnrollments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No pending enrollments</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Schedule</CardTitle>
                <CardDescription>Your current operating hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Operating Days:</span>
                    <span>{provider.operatingDays.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Hours:</span>
                    <span>{provider.startTime} - {provider.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Age Groups:</span>
                    <span>{provider.ageGroups.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Enrollments</CardTitle>
              <CardDescription>Manage your childcare enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment: ChildcareEnrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{enrollment.childName}</h4>
                        <Badge variant={
                          enrollment.status === "approved" ? "default" :
                          enrollment.status === "pending" ? "secondary" : "destructive"
                        }>
                          {enrollment.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p><strong>Age:</strong> {enrollment.childAge}</p>
                          <p><strong>Type:</strong> {enrollment.enrollmentType}</p>
                        </div>
                        <div>
                          <p><strong>Parent:</strong> {enrollment.parentName}</p>
                          <p><strong>Phone:</strong> {enrollment.parentPhone}</p>
                        </div>
                        <div>
                          <p><strong>Start Date:</strong> {new Date(enrollment.startDate).toLocaleDateString()}</p>
                          <p><strong>Weekly Fee:</strong> ${enrollment.weeklyFee}</p>
                        </div>
                      </div>
                      {enrollment.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => updateEnrollmentMutation.mutate({ 
                              enrollmentId: enrollment.id, 
                              status: "approved" 
                            })}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateEnrollmentMutation.mutate({ 
                              enrollmentId: enrollment.id, 
                              status: "rejected" 
                            })}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {enrollments.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No enrollments yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your operating schedule and capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.operatingDays.map((day) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{day}</p>
                      <p className="text-sm text-muted-foreground">
                        {provider.startTime} - {provider.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{provider.currentEnrollments}/{provider.totalCapacity}</p>
                      <p className="text-sm text-muted-foreground">Children enrolled</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>Manage your childcare provider profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Provider Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Update Pricing
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Manage Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Communication Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}