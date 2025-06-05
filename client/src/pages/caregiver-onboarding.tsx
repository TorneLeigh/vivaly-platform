import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNannySchema, SERVICE_TYPES, CERTIFICATE_TYPES, SYDNEY_SUBURBS } from "@shared/schema";
import { z } from "zod";
import { 
  Heart, Shield, Award, DollarSign, MapPin, FileText, Upload, 
  CheckCircle, Clock, AlertCircle, Camera, User, Phone, Mail,
  Calendar, Users, Star, CreditCard, Banknote
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const caregiverOnboardingSchema = insertNannySchema.extend({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  // Professional Details
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  experience: z.number().min(0, "Experience cannot be negative"),
  
  // Verification Documents
  wwccNumber: z.string().optional(),
  firstAidCert: z.boolean().default(false),
  policeCheck: z.boolean().default(false),
  
  // Financial Information
  abn: z.string().optional(),
  bankAccountName: z.string().min(1, "Account name is required"),
  bsb: z.string().length(6, "BSB must be 6 digits"),
  accountNumber: z.string().min(6, "Account number is required"),
  
  // Availability
  availability: z.record(z.array(z.string())).default({}),
  minimumBookingHours: z.number().min(1, "Minimum booking must be at least 1 hour"),
  
  // Profile Images
  profileImages: z.array(z.string()).optional(),
  
  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),
});

type CaregiverOnboardingData = z.infer<typeof caregiverOnboardingSchema>;

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  fields: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details and contact information",
    icon: User,
    fields: ["firstName", "lastName", "phone", "dateOfBirth"]
  },
  {
    id: 2,
    title: "Professional Background",
    description: "Experience, qualifications, and bio",
    icon: Award,
    fields: ["bio", "experience", "certificates", "services"]
  },
  {
    id: 3,
    title: "Verification & Safety",
    description: "Safety checks and certifications",
    icon: Shield,
    fields: ["wwccNumber", "firstAidCert", "policeCheck"]
  },
  {
    id: 4,
    title: "Financial Setup",
    description: "Payment details and tax information",
    icon: CreditCard,
    fields: ["abn", "bankAccountName", "bsb", "accountNumber"]
  },
  {
    id: 5,
    title: "Availability & Rates",
    description: "When you're available and your rates",
    icon: Calendar,
    fields: ["availability", "hourlyRate", "minimumBookingHours", "location", "suburb"]
  },
  {
    id: 6,
    title: "Profile & Photos",
    description: "Complete your profile with photos",
    icon: Camera,
    fields: ["profileImages"]
  },
  {
    id: 7,
    title: "Emergency Contact",
    description: "Emergency contact information",
    icon: Phone,
    fields: ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"]
  },
];

export default function CaregiverOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<CaregiverOnboardingData>({
    resolver: zodResolver(caregiverOnboardingSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: "",
      dateOfBirth: "",
      bio: "",
      experience: 0,
      hourlyRate: "25",
      location: "Sydney, NSW",
      suburb: "",
      services: [],
      certificates: [],
      availability: {},
      minimumBookingHours: 2,
      wwccNumber: "",
      firstAidCert: false,
      policeCheck: false,
      abn: "",
      bankAccountName: "",
      bsb: "",
      accountNumber: "",
      profileImages: [],
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      isVerified: false,
    },
  });

  const createCaregiverMutation = useMutation({
    mutationFn: async (data: CaregiverOnboardingData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const response = await apiRequest("POST", "/api/caregivers/onboard", {
        ...data,
        userId: user.id,
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "Welcome to VIVALY! We'll review your application and notify you within 2-3 business days.",
      });
      // Redirect to dashboard or confirmation page
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateCurrentStep = async () => {
    const currentStepInfo = onboardingSteps.find(step => step.id === currentStep);
    if (!currentStepInfo) return false;

    const result = await form.trigger(currentStepInfo.fields as any);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < onboardingSteps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.includes(stepNumber - 1)) {
      setCurrentStep(stepNumber);
    }
  };

  const onSubmit = (data: CaregiverOnboardingData) => {
    createCaregiverMutation.mutate(data);
  };

  const progressPercentage = ((completedSteps.length + (currentStep > 1 ? 1 : 0)) / onboardingSteps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="04XX XXX XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Privacy & Security</AlertTitle>
              <AlertDescription>
                Your personal information is encrypted and secure. We only share necessary details with families after successful matches.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell families about your experience, approach to childcare, and what makes you special as a caregiver..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 50 characters. This is what families will see first about you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services You Offer</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICE_TYPES.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={field.value?.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), service]);
                            } else {
                              field.onChange(field.value?.filter(s => s !== service));
                            }
                          }}
                        />
                        <Label htmlFor={service} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CERTIFICATE_TYPES.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={field.value?.includes(cert)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), cert]);
                            } else {
                              field.onChange(field.value?.filter(c => c !== cert));
                            }
                          }}
                        />
                        <Label htmlFor={cert} className="text-sm">
                          {cert}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Safety First</AlertTitle>
              <AlertDescription>
                All caregivers must complete safety verification. This builds trust with families and ensures child safety.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="wwccNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working with Children Check Number</FormLabel>
                  <FormControl>
                    <Input placeholder="WWC123456789" {...field} />
                  </FormControl>
                  <FormDescription>
                    Required for all caregivers. <a href="https://www.kidsguardian.nsw.gov.au/child-safe-organisations/working-with-children-check" target="_blank" className="text-blue-600 underline">Apply here</a> if you don't have one.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstAidCert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>First Aid Certification</FormLabel>
                      <FormDescription>
                        Current first aid certificate
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policeCheck"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Police Check</FormLabel>
                      <FormDescription>
                        Recent police background check
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Document Upload</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    You'll be contacted within 24 hours to upload verification documents securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert>
              <Banknote className="h-4 w-4" />
              <AlertTitle>Payment Setup</AlertTitle>
              <AlertDescription>
                Set up your payment details to receive payments directly. All information is encrypted and secure.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="abn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABN (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="12 345 678 901" {...field} />
                  </FormControl>
                  <FormDescription>
                    If you have an Australian Business Number for tax purposes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bankAccountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bsb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BSB</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (AUD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="number" 
                          min="15" 
                          max="100" 
                          step="0.50"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Minimum wage is $15/hour</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumBookingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Booking</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="number" 
                          min="1" 
                          max="12"
                          className="pl-10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Hours</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select suburb" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SYDNEY_SUBURBS.map((suburb) => (
                          <SelectItem key={suburb} value={suburb}>
                            {suburb}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Weekly Availability</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <Card key={day} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">{day}</Label>
                      <Checkbox />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="9:00 AM" />
                      <Input placeholder="5:00 PM" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertTitle>Profile Photos</AlertTitle>
              <AlertDescription>
                Add photos to make your profile more appealing to families. Good photos increase booking rates by 60%.
              </AlertDescription>
            </Alert>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
              <p className="text-gray-600 mb-4">Upload up to 5 professional photos of yourself</p>
              <Button type="button" variant="outline">
                Choose Files
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Photo Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use clear, well-lit photos</li>
                <li>• Smile and look approachable</li>
                <li>• Include photos of you with children (with permission)</li>
                <li>• Avoid selfies and group photos</li>
              </ul>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Alert>
              <Phone className="h-4 w-4" />
              <AlertTitle>Emergency Contact</AlertTitle>
              <AlertDescription>
                Required for safety. This person will be contacted in case of emergencies during bookings.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="04XX XXX XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emergencyContactRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other Family Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Almost Done!</h3>
                  <p className="text-green-800 text-sm">
                    You're ready to submit your application. Our team will review it within 2-3 business days 
                    and contact you with next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join VIVALY as a Caregiver
          </h1>
          <p className="text-lg text-gray-600">
            Complete your profile to start connecting with families
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {onboardingSteps.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <nav className="flex justify-center">
            <ol className="flex items-start">
              {onboardingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;
                const isAccessible = step.id <= currentStep || isCompleted;

                return (
                  <li key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => goToStep(step.id)}
                        disabled={!isAccessible}
                        className={`
                          flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors mb-2
                          ${isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-black border-black text-white'
                              : isAccessible
                                ? 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                                : 'bg-gray-100 border-gray-200 text-gray-400'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </button>
                      <div className="text-center">
                        <div className={`text-xs font-medium ${isCurrent ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          Step {step.id}
                        </div>
                        <div className={`text-xs max-w-16 leading-tight ${isCurrent ? 'text-black' : isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 mt-[-20px] ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Current Step Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {React.createElement(onboardingSteps[currentStep - 1]?.icon, { className: "w-6 h-6 mr-3" })}
                  {onboardingSteps[currentStep - 1]?.title}
                </CardTitle>
                <p className="text-gray-600">
                  {onboardingSteps[currentStep - 1]?.description}
                </p>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < onboardingSteps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createCaregiverMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createCaregiverMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}