import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { calculateProfileCompletion } from '@/utils/profileCompletion';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Search, 
  Heart,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  DollarSign,
  Phone,
  Plus,
  Briefcase,
  Home,
  CalendarDays,
  Filter
} from 'lucide-react';

// Booking interface
interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'pending';
  totalAmount: number;
  caregiver: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    phone?: string;
  };
  job: {
    title: string;
    location: string;
    description?: string;
  };
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/parent/bookings'],
    queryFn: async () => {
      const response = await fetch('/api/parent/bookings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs', 'parent'],
    queryFn: async () => {
      const response = await fetch('/api/jobs?filter=parent', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
  });

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming').slice(0, 3);
  const recentBookings = bookings.filter(b => ['completed', 'ongoing'].includes(b.status)).slice(0, 3);
  const allUpcoming = bookings.filter(b => b.status === 'upcoming');
  const allCompleted = bookings.filter(b => b.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-700">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateCompletion = () => {
    return calculateProfileCompletion(user);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Welcome back, {user?.firstName || 'Parent'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Dashboard - Manage your bookings and find quality childcare
              </p>
            </div>
            <Button 
              onClick={() => setLocation('/search-caregivers')}
              className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] hover:opacity-90 text-white w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Find Caregivers</span>
              <span className="sm:hidden">Find Care</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upcoming ({allUpcoming.length})</span>
              <span className="sm:hidden">Next ({allUpcoming.length})</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Past ({allCompleted.length})</span>
              <span className="sm:hidden">Done ({allCompleted.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Mobile Optimized */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Cards - Mobile Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-4 min-w-0">
                      <p className="text-lg sm:text-2xl font-bold">{allUpcoming.length}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-4 min-w-0">
                      <p className="text-lg sm:text-2xl font-bold">{allCompleted.length}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-4 min-w-0">
                      <p className="text-lg sm:text-2xl font-bold">{jobs.length}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Active Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-4 min-w-0">
                      <p className="text-lg sm:text-2xl font-bold">4.9</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={calculateCompletion()} className="w-full" />
                    <p className="text-sm text-gray-500">{calculateCompletion()}% complete</p>
                    <p className="text-sm text-gray-600">Complete your profile to attract the best caregivers</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/parent-profile')}
                    >
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation('/search-caregivers')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Caregivers
                  </Button>
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation('/post-job')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Button>
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation('/messages')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Upcoming Bookings Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Next Bookings</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('upcoming')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                      ))}
                    </div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming bookings</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setLocation('/search-caregivers')}
                      >
                        Book a Caregiver
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={booking.caregiver.profileImageUrl} />
                            <AvatarFallback>
                              {booking.caregiver.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {booking.caregiver.firstName} {booking.caregiver.lastName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              {booking.job.location}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(booking.status)}
                            <p className="text-sm font-medium mt-1">
                              ${booking.totalAmount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Bookings Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('past')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={booking.caregiver.profileImageUrl} />
                            <AvatarFallback>
                              {booking.caregiver.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {booking.caregiver.firstName} {booking.caregiver.lastName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatDate(booking.startTime)}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upcoming Bookings Tab - Mobile Optimized */}
          <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">Upcoming Bookings</h2>
              <Button 
                onClick={() => setLocation('/search-caregivers')}
                className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] hover:opacity-90 text-white w-full sm:w-auto"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Book Caregiver</span>
                <span className="sm:hidden">Book Care</span>
              </Button>
            </div>

            {allUpcoming.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Book a caregiver to get started with quality childcare
                  </p>
                  <Button onClick={() => setLocation('/search-caregivers')}>
                    Find Caregivers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allUpcoming.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                          <AvatarImage src={booking.caregiver.profileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] text-white text-sm sm:text-base">
                            {booking.caregiver.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {booking.caregiver.firstName} {booking.caregiver.lastName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 truncate">{booking.job.title}</p>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(booking.startTime)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {booking.job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${booking.totalAmount}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {getStatusBadge(booking.status)}
                            <div className="flex space-x-1 sm:space-x-2">
                              {booking.caregiver.phone && (
                                <Button size="sm" variant="outline" className="p-2">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => setLocation('/messages')} className="p-2">
                                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Bookings Tab - Mobile Optimized */}
          <TabsContent value="past" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">Booking History</h2>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {allCompleted.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No booking history yet
                  </h3>
                  <p className="text-gray-500">
                    Your completed bookings will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {allCompleted.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarImage src={booking.caregiver.profileImageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] text-white text-sm sm:text-base">
                              {booking.caregiver.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm sm:text-base truncate">
                              {booking.caregiver.firstName} {booking.caregiver.lastName}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm truncate">{booking.job.title}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">
                              {formatDate(booking.startTime)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                            {getStatusBadge(booking.status)}
                            <p className="text-base sm:text-lg font-semibold">${booking.totalAmount}</p>
                          </div>
                          <Button size="sm" variant="outline" className="flex-shrink-0">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">Rate</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}