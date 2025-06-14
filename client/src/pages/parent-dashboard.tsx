import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoleToggle from '@/components/RoleToggle';
import { useLocation } from 'wouter';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Search, 
  Heart,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

export default function ParentDashboard() {
  const { user, isAuthenticated, activeRole, roles, switchRole } = useAuth();
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
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "My Bookings",
      description: "View and manage your upcoming appointments",
      icon: Calendar,
      action: () => setLocation('/bookings'),
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Messages",
      description: "Chat with your caregivers",
      icon: MessageSquare,
      action: () => setLocation('/messages'),
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Post a Job",
      description: "Create a job posting for caregivers",
      icon: Users,
      action: () => setLocation('/post-job'),
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
            <Badge variant="outline" className="text-blue-600 border-blue-200">
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent bookings</p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => setLocation('/search')}
                  >
                    Find a Caregiver
                  </Button>
                </div>
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
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No favorites yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => setLocation('/search')}
                  >
                    Browse Caregivers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your family details to get better caregiver matches
                </p>
                <Button onClick={() => setLocation('/parent-profile')}>
                  Complete Profile
                </Button>
              </div>
              <Users className="w-16 h-16 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}