import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, DollarSign, Star, MessageSquare, CalendarDays, List, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProviderStats {
  todayBookings: number;
  weeklyEarnings: number;
  totalReviews: number;
  averageRating: number;
  upcomingBookings: any[];
  messages: any[];
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login?redirect=' + encodeURIComponent('/provider-dashboard'));
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <Lock className="w-16 h-16 text-coral mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Caregiver Access Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your caregiver dashboard and manage your services.
          </p>
          <Button 
            className="w-full bg-coral hover:bg-coral/90"
            onClick={() => setLocation('/login?redirect=' + encodeURIComponent('/provider-dashboard'))}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("today");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/provider/stats", user?.id],
    enabled: !!user?.id,
  });

  const { data: todayBookings = [] } = useQuery({
    queryKey: ["/api/bookings/today", user?.id],
    enabled: !!user?.id,
  });

  const { data: upcomingBookings = [] } = useQuery({
    queryKey: ["/api/bookings/upcoming", user?.id],
    enabled: !!user?.id,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ["/api/provider/listings", user?.id],
    enabled: !!user?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName}</p>
          </div>
          <Badge variant="default" className="text-sm">
            Active Provider
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Today's Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todayBookings.length > 0 ? "Next at 9:00 AM" : "No bookings today"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$240</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9</div>
                  <p className="text-xs text-muted-foreground">
                    From 24 reviews
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    2 new inquiries
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your bookings for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayBookings.length > 0 ? (
                    todayBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.serviceType}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Client: {booking.parentName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${booking.totalAmount}</p>
                          <Badge variant="default">Confirmed</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No bookings scheduled for today</p>
                      <p className="text-sm">Enjoy your free day!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.serviceType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Client: {booking.parentName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${booking.totalAmount}</p>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming bookings</p>
                      <p className="text-sm">Check back later for new appointments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Service Listings</CardTitle>
                <CardDescription>Manage your available services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <List className="h-4 w-4 mr-2" />
                    Add New Service
                  </Button>
                  
                  {listings.length > 0 ? (
                    listings.map((listing: any) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{listing.serviceType}</p>
                          <p className="text-sm text-muted-foreground">
                            {listing.location} • {listing.hourlyRate}/hour
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Badge variant={listing.isActive ? "default" : "secondary"}>
                            {listing.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No service listings yet</p>
                      <p className="text-sm">Create your first listing to start receiving bookings</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communication with clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message: any) => (
                      <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{message.senderName}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {message.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Reply</Button>
                          {!message.isRead && (
                            <Badge variant="destructive">New</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Messages from clients will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}