import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: (user: any) => {
      // Set the user data in the query cache
      queryClient.setQueryData(["/api/auth/user"], user);
      
      // Invalidate the auth query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Use setTimeout to ensure the query cache is updated before navigation
      setTimeout(() => {
        window.location.href = user.isNanny ? "/nanny-dashboard" : "/";
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: (user: any) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Account Created!",
        description: "Welcome to VIVALY! You can now start booking caregivers.",
      });
      
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleSignup = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to VIVALY</h1>
          <p className="mt-2 text-gray-600">
            {activeTab === "login" 
              ? "Sign in to your account" 
              : "Create your account to get started"
            }
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...loginForm.register("email")}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        {...loginForm.register("password")}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox id="remember-me" />
                      <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-orange-600 hover:text-orange-500"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10"
                          {...signupForm.register("firstName")}
                        />
                      </div>
                      {signupForm.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {signupForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        {...signupForm.register("lastName")}
                      />
                      {signupForm.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {signupForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...signupForm.register("email")}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10"
                        {...signupForm.register("phone")}
                      />
                    </div>
                    {signupForm.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {signupForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        {...signupForm.register("password")}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                    
                    {/* Password Requirements */}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Password requirements:</p>
                      <div className="space-y-1">
                        <div className={`text-xs flex items-center space-x-1 ${
                          signupForm.watch("password")?.length >= 8 ? "text-green-600" : "text-gray-400"
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`text-xs flex items-center space-x-1 ${
                          /[A-Z]/.test(signupForm.watch("password") || "") ? "text-green-600" : "text-gray-400"
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`text-xs flex items-center space-x-1 ${
                          /[a-z]/.test(signupForm.watch("password") || "") ? "text-green-600" : "text-gray-400"
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          <span>One lowercase letter</span>
                        </div>
                        <div className={`text-xs flex items-center space-x-1 ${
                          /\d/.test(signupForm.watch("password") || "") ? "text-green-600" : "text-gray-400"
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          <span>One number</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        {...signupForm.register("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>



                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      {...signupForm.register("agreeToTerms")}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{" "}
                      <a href="/terms-of-service" className="text-black hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" className="text-black hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {signupForm.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-600">
                      {signupForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Want to offer care services?
            </p>
            <a 
              href="/become-caregiver" 
              className="text-sm text-orange-600 hover:text-orange-500 font-medium"
            >
              Switch to Service Provider Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}