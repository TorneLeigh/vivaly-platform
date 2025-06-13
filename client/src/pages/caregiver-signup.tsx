import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, HelpCircle, DollarSign, Shield } from "lucide-react";

const caregiverSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  suburb: z.string().min(1, "Primary service area is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CaregiverSignupForm = z.infer<typeof caregiverSignupSchema>;

const sydneySuburbs = [
  "Bondi", "Surry Hills", "Newtown", "Manly", "Paddington", "Darlinghurst",
  "Balmain", "Leichhardt", "Rozelle", "Potts Point", "Double Bay", "Woollahra",
  "Randwick", "Coogee", "Marrickville", "Glebe", "Redfern", "Chippendale"
];

export default function CaregiverSignup() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CaregiverSignupForm>({
    resolver: zodResolver(caregiverSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      suburb: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: CaregiverSignupForm) => {
      const response = await apiRequest("POST", "/api/users", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType: "caregiver",
        suburb: data.suburb,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to VIVALY! You can now start connecting with families.",
      });
      setStep(5); // Success step
    },
    onError: (error: any) => {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CaregiverSignupForm) => {
    signupMutation.mutate(data);
  };

  const progress = (step / 4) * 100;

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for joining VIVALY as a caregiver. We're reviewing your application 
              and will notify you within 1-2 business days.
            </p>
            
            <div className="space-y-3 mb-8">
              <h3 className="font-medium text-gray-900">What happens next?</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• We'll verify your credentials and experience</p>
                <p>• Our team will contact you for any additional information</p>
                <p>• Once approved, you can start connecting with families</p>
                <p>• You'll receive access to your caregiver dashboard</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/")}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Explore VIVALY
              </Button>
              <Button 
                onClick={() => setLocation("/caregiver-profile")}
                variant="outline"
                className="w-full"
              >
                Complete Your Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Caregiver</h1>
          <p className="text-gray-600">Join thousands of caregivers helping families across Australia</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your location</CardTitle>
              <p className="text-gray-600">Where in Sydney are you available to provide care?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="suburb">Primary Service Area</Label>
                <Select onValueChange={(value) => form.setValue("suburb", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bondi" />
                  </SelectTrigger>
                  <SelectContent>
                    {sydneySuburbs.map((suburb) => (
                      <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  Choose the area where you're most available to provide care services.
                </p>
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!form.getValues("suburb")}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <p className="text-gray-600">Tell us about yourself</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Your first name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Your last name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="your.email@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="0412 345 678"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!form.getValues("firstName") || !form.getValues("lastName") || !form.getValues("email") || !form.getValues("phone")}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Password Setup */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Password</CardTitle>
              <p className="text-gray-600">Choose a secure password for your account</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="At least 8 characters"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  placeholder="Confirm your password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  disabled={!form.getValues("password") || !form.getValues("confirmPassword")}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <p className="text-gray-600">Please review your details before creating your account</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{form.getValues("firstName")} {form.getValues("lastName")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{form.getValues("email")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{form.getValues("phone")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Area:</span>
                  <span className="font-medium">{form.getValues("suburb")}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={signupMutation.isPending}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* FAQ Card */}
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>How do I get started?</strong></p>
              <p>What qualifications do I need?</p>
              <p>How does payment work?</p>
            </div>
          </div>

          {/* Fees Card */}
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">VIVALY Fees & Earnings</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Platform Fee:</strong> VIVALY takes a 10% service fee from each booking</p>
              <p><strong>Average Earnings:</strong> $25-65 per hour for experienced providers</p>
              <p><strong>Payment Schedule:</strong> Direct deposit within 24-48 hours</p>
            </div>
          </div>

          {/* Safety Card */}
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Policies & Regulations</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Background Check Requirements:</strong> Valid police checks, WWCC verification required</p>
              <p><strong>Safety & Protection:</strong> First aid certification and appropriate insurance recommended</p>
              <p><strong>Quality Standards:</strong> All bookings subject to mutual agreement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}