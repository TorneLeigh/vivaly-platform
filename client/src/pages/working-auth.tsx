import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isNanny?: boolean;
  phone?: string;
}

interface ForgotPasswordForm {
  email: string;
}

export default function WorkingAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"parent" | "caregiver">("parent");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>();
  const { register: signupRegister, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<SignupForm>();
  const { register: forgotPasswordRegister, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordErrors } } = useForm<ForgotPasswordForm>();

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          role: selectedRole
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });
      
      // Set user data in query cache immediately
      queryClient.setQueryData(["/api/auth/user"], result);
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your email and password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          isNanny: data.isNanny || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      toast({
        title: "Account created!",
        description: "Welcome to Vivaly. You can now start using the platform.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    setIsForgotPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      toast({
        title: "Reset Email Sent",
        description: "If an account with this email exists, a reset link has been sent.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignup ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignup 
              ? "Join Vivaly to find trusted care services"
              : "Sign in to your Vivaly account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selection */}
          <div className="mb-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('parent')}
                className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition-all duration-300 ${
                  selectedRole === 'parent'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Parent / Seeker
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('caregiver')}
                className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition-all duration-300 ${
                  selectedRole === 'caregiver'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Caregiver
              </button>
            </div>
          </div>
          {isSignup ? (
            <form onSubmit={handleSignupSubmit(handleSignup)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First name</label>
                  <Input 
                    {...signupRegister("firstName", { required: "First name is required" })}
                    placeholder="John" 
                  />
                  {signupErrors.firstName && <p className="text-sm text-red-600">{signupErrors.firstName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Last name</label>
                  <Input 
                    {...signupRegister("lastName", { required: "Last name is required" })}
                    placeholder="Doe" 
                  />
                  {signupErrors.lastName && <p className="text-sm text-red-600">{signupErrors.lastName.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  {...signupRegister("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address"
                    }
                  })}
                  placeholder="john@example.com" 
                />
                {signupErrors.email && <p className="text-sm text-red-600">{signupErrors.email.message}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone (optional)</label>
                <Input 
                  type="tel" 
                  {...signupRegister("phone")}
                  placeholder="0412 345 678" 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type={showSignupPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...signupRegister("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    placeholder="Create a password" 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signupErrors.password && <p className="text-sm text-red-600">{signupErrors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  {...signupRegister("isNanny")}
                  id="isNanny"
                  className="rounded"
                />
                <label htmlFor="isNanny" className="text-sm">I want to offer childcare services</label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  {...loginRegister("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address"
                    }
                  })}
                  placeholder="Enter your email" 
                />
                {loginErrors.email && <p className="text-sm text-red-600">{loginErrors.email.message}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...loginRegister("password", { 
                      required: "Password is required"
                    })}
                    placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginErrors.password && <p className="text-sm text-red-600">{loginErrors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm"
            >
              {isSignup 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Create one here"
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPasswordSubmit(handleForgotPassword)} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email">Email address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  {...forgotPasswordRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address"
                    }
                  })}
                />
              </div>
              {forgotPasswordErrors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {forgotPasswordErrors.email.message}
                </p>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowForgotPassword(false)}
                disabled={isForgotPasswordLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isForgotPasswordLoading}
              >
                {isForgotPasswordLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}