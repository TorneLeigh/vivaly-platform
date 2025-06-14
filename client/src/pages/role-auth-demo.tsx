import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import RoleToggle from '@/components/RoleToggle';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Users, UserCheck, Settings, LogOut } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  role: string;
}

export default function RoleAuthDemo() {
  const { user, isAuthenticated, roles, activeRole, switchRole, logout } = useAuth();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    role: 'parent'
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest('POST', '/api/login', data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: `Welcome back! Logged in as ${loginForm.role}`,
      });
      // Reset form
      setLoginForm({ email: '', password: '', role: 'parent' });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginForm);
  };

  const handleSwitchRole = async (newRole: string) => {
    console.log("handleSwitchRole called with:", newRole);
    console.log("Current activeRole before switch:", activeRole);
    try {
      await switchRole(newRole);
      console.log("switchRole completed successfully");
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  };

  // Log activeRole changes
  console.log("RoleAuthDemo render - activeRole:", activeRole, "roles:", roles);

  const renderAuthenticatedView = () => {
    const roleContent = {
      parent: {
        title: "Parent Dashboard",
        description: "Find and book trusted caregivers for your children",
        features: [
          "Browse caregiver profiles",
          "Book childcare services",
          "Manage your children's information",
          "View booking history",
          "Message caregivers"
        ],
        color: "bg-blue-50 border-blue-200"
      },
      caregiver: {
        title: "Caregiver Dashboard", 
        description: "Manage your caregiver profile and job applications",
        features: [
          "Update your profile and qualifications",
          "Browse available jobs",
          "Apply for positions",
          "Manage your schedule",
          "Communicate with families"
        ],
        color: "bg-green-50 border-green-200"
      }
    };

    const content = roleContent[activeRole as keyof typeof roleContent] || roleContent.parent;

    return (
      <div className="space-y-6">
        {/* User Info & Role Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Welcome, {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription>
                  Email: {user?.email}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <RoleToggle 
                  roles={roles} 
                  activeRole={activeRole} 
                  onSwitch={handleSwitchRole}
                />
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="secondary">Active Role: {activeRole}</Badge>
              <Badge variant="outline">Available Roles: {roles.join(', ')}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        <Card className={content.color}>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>{content.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="font-medium mb-3">Available Features:</h4>
            <ul className="space-y-2">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Demo Actions
            </CardTitle>
            <CardDescription>
              Test the role-based functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleSwitchRole('parent')}
                disabled={activeRole === 'parent' || !roles.includes('parent')}
              >
                Switch to Parent View
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSwitchRole('caregiver')}
                disabled={activeRole === 'caregiver' || !roles.includes('caregiver')}
              >
                Switch to Caregiver View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLoginView = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-6 w-6" />
          Role-Based Authentication Demo
        </CardTitle>
        <CardDescription>
          Login with role selection to test the authentication system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Select Role</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={loginForm.role === 'parent' ? 'default' : 'outline'}
                onClick={() => setLoginForm({ ...loginForm, role: 'parent' })}
                className="flex-1"
              >
                Parent
              </Button>
              <Button
                type="button"
                variant={loginForm.role === 'caregiver' ? 'default' : 'outline'}
                onClick={() => setLoginForm({ ...loginForm, role: 'caregiver' })}
                className="flex-1"
              >
                Caregiver
              </Button>
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : `Sign in as ${loginForm.role}`}
          </Button>
        </form>

        {/* Demo Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Demo Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use any existing account credentials to test</li>
            <li>• Select your desired role before logging in</li>
            <li>• After login, you can switch between available roles</li>
            <li>• Each role shows different features and content</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Role-Based Authentication System
            </h1>
            <p className="text-gray-600">
              Demonstration of multi-role user authentication with seamless role switching
            </p>
          </div>

          {/* Main Content */}
          {isAuthenticated ? renderAuthenticatedView() : renderLoginView()}
        </div>
      </div>
    </div>
  );
}