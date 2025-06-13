import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

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

export default function WorkingAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>();
  const { register: signupRegister, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<SignupForm>();

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
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
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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
                <Input 
                  type="password" 
                  {...signupRegister("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  placeholder="Create a password" 
                />
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
                <Input 
                  type="password" 
                  {...loginRegister("password", { 
                    required: "Password is required"
                  })}
                  placeholder="Enter your password" 
                />
                {loginErrors.password && <p className="text-sm text-red-600">{loginErrors.password.message}</p>}
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
    </div>
  );
}