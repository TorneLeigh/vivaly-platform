import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoleToggle from '@/components/RoleToggle';
import { ReferralBanner } from '@/components/ReferralBanner';
import { calculateProfileCompletion } from '@/utils/profileCompletion';

import Calendar from '@/components/Calendar';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Briefcase, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  User, 
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export default function CaregiverDashboard() {
  const { user, isAuthenticated, activeRole, roles, switchRole } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch caregiver's applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['/api/applications/my'],
    queryFn: () => apiRequest('GET', '/api/applications/my'),
    enabled: isAuthenticated && activeRole === 'caregiver'
  });

  if (!isAuthenticated) {
    setLocation('/auth');
    return null;
  }

  if (activeRole !== 'caregiver') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-4">This page is only available for caregivers.</p>
            <RoleToggle 
              roles={roles || []}
              activeRole={activeRole || 'caregiver'}
              onSwitch={switchRole}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Browse Jobs",
      description: "Find new opportunities near you",
      icon: Briefcase,
      action: () => setLocation('/job-board'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "My Bookings",
      description: "View your confirmed bookings",
      icon: CalendarIcon,
      action: () => setLocation('/caregiver-bookings'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "Messages",
      description: "Chat with families",
      icon: MessageSquare,
      action: () => setLocation('/messages'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    },
    {
      title: "Profile",
      description: "Update your caregiver profile",
      icon: User,
      action: () => setLocation('/profile'),
      color: "bg-white hover:bg-gray-50 border-gray-200"
    }
  ];

  const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
  const acceptedApplications = applications.filter((app: any) => app.status === 'accepted').length;

  const stats = [
    {
      title: "Active Applications", 
      value: pendingApplications.toString(),
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: "Accepted Applications",
      value: acceptedApplications.toString(),
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Total Applications",
      value: applications.length.toString(),
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Profile Status",
      value: "Active",
      icon: User,
      color: "text-purple-600"
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
              Manage your caregiver profile and bookings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-gray-700 border-gray-300">
              Caregiver Dashboard
            </Badge>
            <RoleToggle 
              roles={roles || []}
              activeRole={activeRole || 'caregiver'}
              onSwitch={switchRole}
            />
          </div>
        </div>

        {/* Profile Completion Alert */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">
                  Showcase your experience and connect with families
                </h3>
                <p className="text-orange-700 mt-1">
                  Profile Completion
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProfileCompletion(user)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-orange-900">
                      {calculateProfileCompletion(user)}%
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => setLocation('/caregiver-registration')}
              >
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent applications</p>
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => setLocation('/job-board')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  applications.slice(0, 3).map((application: any) => (
                    <div 
                      key={application.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Job Application</p>
                          <p className="text-sm text-gray-600">
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={application.status === 'accepted' ? 'default' : 'secondary'}
                          className={
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {application.status === 'pending' ? 'Pending' :
                           application.status === 'accepted' ? 'Accepted' :
                           'Not Selected'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/job/${application.jobId}`)}
                        >
                          View job details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                {applications.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setLocation('/caregiver-profile')}
                  >
                    View All Applications
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Upcoming Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                bookings={[
                  {
                    id: '1',
                    title: 'Smith Family',
                    date: new Date(2025, 5, 18),
                    startTime: '9:00 AM',
                    endTime: '5:00 PM',
                    clientName: 'Sarah Smith',
                    location: 'Sydney CBD',
                    status: 'confirmed'
                  },
                  {
                    id: '2',
                    title: 'Johnson Family',
                    date: new Date(2025, 5, 20),
                    startTime: '2:00 PM',
                    endTime: '6:00 PM',
                    clientName: 'Mike Johnson',
                    location: 'Bondi',
                    status: 'pending'
                  }
                ]}
                onDateSelect={(date) => console.log('Selected date:', date)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Verification Status */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Status
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete your verification to access premium job opportunities
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setLocation('/verification')}>
                    Start Verification
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/help')}>
                    Learn More
                  </Button>
                </div>
              </div>
              <CheckCircle className="w-16 h-16 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
      

    </div>
  );
}