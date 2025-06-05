import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { 
  Mail, User, Phone, Lock, Clock, Shield, Heart, CheckCircle, 
  Baby, Users2, Handshake, MapPin, ArrowRight, Building
} from "lucide-react";
import { Link } from "wouter";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [step, setStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm & { userType: string }) => {
      const response = await apiRequest("POST", "/api/users", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType: data.userType,
      });
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Welcome to VIVALY!",
        description: "Your account has been created successfully.",
      });
      setStep(4); // Success step
    },
    onError: (error: any) => {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Please Select an Option",
        description: "Choose how you'd like to use VIVALY.",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate({ ...data, userType: selectedOptions.join(",") });
  };

  const handleContinue = () => {
    const { firstName, lastName, email, phone } = form.getValues();
    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleContinueToPassword = () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Please Select an Option",
        description: "Choose at least one way you'd like to use VIVALY.",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coral-light to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-warm-gray">Welcome to VIVALY!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-warm-gray-light">
              Your account has been created successfully. You can now access all the services you selected.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/">Explore VIVALY</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/profile">Complete Your Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-light to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-warm-gray mb-2">Join VIVALY Community</h1>
            <p className="text-warm-gray-light text-lg">Connect with trusted caregivers and supportive families</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-coral h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tell us about yourself</CardTitle>
              <p className="text-center text-warm-gray-light">We need some basic information to get started</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your first name" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your last name" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Enter your email address" 
                          className="h-12"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel" 
                          placeholder="0412 345 678" 
                          className="h-12"
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  onClick={handleContinue}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  Continue
                </Button>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">How would you like to use VIVALY?</CardTitle>
              <p className="text-center text-warm-gray-light">Select all that apply to you</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Little Ones Care Option */}
                <div
                  className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                    selectedOptions.includes("little-ones") 
                      ? "border-coral bg-coral-light/20" 
                      : "border-gray-200 hover:border-coral hover:bg-coral-light/20"
                  }`}
                  onClick={() => handleOptionToggle("little-ones")}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center">
                      <Checkbox 
                        checked={selectedOptions.includes("little-ones")}
                        onChange={() => handleOptionToggle("little-ones")}
                        className="mr-3"
                      />
                      <div className="w-12 h-12 bg-coral-light rounded-lg flex items-center justify-center">
                        <Baby className="h-6 w-6 text-coral" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-warm-gray mb-2">I need care for little ones</h3>
                      <p className="text-warm-gray-light text-sm">Find trusted babysitters, nannies, and caregivers for children in your area</p>
                    </div>
                  </div>
                </div>

                {/* Family Support Option */}
                <div
                  className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                    selectedOptions.includes("family-support") 
                      ? "border-coral bg-coral-light/20" 
                      : "border-gray-200 hover:border-coral hover:bg-coral-light/20"
                  }`}
                  onClick={() => handleOptionToggle("family-support")}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center">
                      <Checkbox 
                        checked={selectedOptions.includes("family-support")}
                        onChange={() => handleOptionToggle("family-support")}
                        className="mr-3"
                      />
                      <div className="w-12 h-12 bg-coral-light rounded-lg flex items-center justify-center">
                        <Users2 className="h-6 w-6 text-coral" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-warm-gray mb-2">I want to connect with families close by for support</h3>
                      <p className="text-warm-gray-light text-sm">Join our community network for mutual family support and shared childcare</p>
                    </div>
                  </div>
                </div>

                {/* Day Care Option */}
                <div
                  className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                    selectedOptions.includes("day-care") 
                      ? "border-coral bg-coral-light/20" 
                      : "border-gray-200 hover:border-coral hover:bg-coral-light/20"
                  }`}
                  onClick={() => handleOptionToggle("day-care")}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center">
                      <Checkbox 
                        checked={selectedOptions.includes("day-care")}
                        onChange={() => handleOptionToggle("day-care")}
                        className="mr-3"
                      />
                      <div className="w-12 h-12 bg-coral-light rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-coral" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-warm-gray mb-2">I'm looking for day care</h3>
                      <p className="text-warm-gray-light text-sm">Find quality daycare centers and early learning programs in your area</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleContinueToPassword}
                className="w-full h-12 text-lg"
                size="lg"
                disabled={selectedOptions.length === 0}
              >
                Continue
              </Button>

              <Button 
                type="button" 
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full h-12"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create your password</CardTitle>
              <p className="text-center text-warm-gray-light">Almost done! Choose a secure password to protect your account</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Create a secure password" 
                            className="h-12"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Confirm your password" 
                            className="h-12"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={signupMutation.isPending}
                      className="flex-1 h-12"
                    >
                      {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        {step <= 2 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-coral mx-auto mb-4" />
              <h3 className="font-semibold text-warm-gray mb-2">Quick & Easy</h3>
              <p className="text-sm text-warm-gray-light">Join in minutes and start connecting right away</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-coral mx-auto mb-4" />
              <h3 className="font-semibold text-warm-gray mb-2">Safe & Secure</h3>
              <p className="text-sm text-warm-gray-light">All caregivers are background checked and verified</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Handshake className="h-12 w-12 text-coral mx-auto mb-4" />
              <h3 className="font-semibold text-warm-gray mb-2">Community Support</h3>
              <p className="text-sm text-warm-gray-light">Connect with local families for mutual help</p>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-warm-gray-light">
            Already have an account?{" "}
            <Link href="/auth" className="text-coral hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}