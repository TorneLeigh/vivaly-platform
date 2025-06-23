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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            My Bookings
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setLocation('/my-bookings')}>
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="recent">Recent ({recentBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-gray-600">No upcoming bookings</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => setLocation('/search')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book a Caregiver
                </Button>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={booking.caregiver.profileImageUrl} />
                      <AvatarFallback>
                        {booking.caregiver.firstName[0]}{booking.caregiver.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{booking.caregiver.firstName} {booking.caregiver.lastName}</h4>
                      <p className="text-sm text-gray-600">{booking.job.title}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(booking.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    <p className="text-sm font-medium mt-1">${booking.totalAmount}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4 mt-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-gray-600">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={booking.caregiver.profileImageUrl} />
                      <AvatarFallback>
                        {booking.caregiver.firstName[0]}{booking.caregiver.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{booking.caregiver.firstName} {booking.caregiver.lastName}</h4>
                      <p className="text-sm text-gray-600">{booking.job.title}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    <p className="text-sm font-medium mt-1">${booking.totalAmount}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation('/auth');
    return null;
  }

  if (activeRole !== 'parent') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-4">This page is only available for parents.</p>
            <RoleToggle 
              roles={roles || []}
              activeRole={activeRole || 'parent'}
              onSwitch={switchRole}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Find Caregivers",
      description: "Browse and book trusted childcare providers",
      icon: Search,
      action: () => setLocation('/search'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "My Bookings",
      description: "View and manage your upcoming appointments",
      icon: Calendar,
      action: () => setLocation('/parent/bookings'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "Messages",
      description: "Chat with your caregivers",
      icon: MessageSquare,
      action: () => setLocation('/messages'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "Post a Job",
      description: "Create a job posting for caregivers",
      icon: Users,
      action: () => setLocation('/post-job'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Referral Banner */}
        <ReferralBanner />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Find trusted care for your family
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-gray-700 border-gray-300">
              Parent Dashboard
            </Badge>
            <RoleToggle 
              roles={roles || []}
              activeRole={activeRole || 'parent'}
              onSwitch={switchRole}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all duration-200 ${action.color}`}
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <action.icon className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Bookings Section - Airbnb Style */}
        <MyBookingsSection />

        {/* Additional Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent messages</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => setLocation('/messages')}
                >
                  View Messages
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Favorite Caregivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No favorites yet</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => setLocation('/search-caregivers')}
                >
                  Find Caregivers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="mt-8 bg-gray-50 border-gray-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your family details to get better caregiver matches
                </p>
                <Button 
                  onClick={() => setLocation('/parent-profile')}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Complete Profile
                </Button>
              </div>
              <Users className="w-16 h-16 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Referral Popup */}
      {user && (
        <ReferralPopup 
          userRole="parent" 
          userName={user.firstName || 'User'} 
        />
      )}
    </div>
  );
}