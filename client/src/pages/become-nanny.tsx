import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNannySchema, SERVICE_TYPES, CERTIFICATE_TYPES, SYDNEY_SUBURBS } from "@shared/schema";
import { z } from "zod";
import { Heart, Shield, Award, DollarSign, MapPin, FileText, ChevronDown, Clock, HelpCircle, Users } from "lucide-react";

const nannyFormSchema = insertNannySchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type NannyFormData = z.infer<typeof nannyFormSchema>;

export default function BecomeNanny() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const { toast } = useToast();

  const form = useForm<NannyFormData>({
    resolver: zodResolver(nannyFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      bio: "",
      experience: 0,
      hourlyRate: "25",
      location: "Sydney, NSW",
      suburb: "",
      services: [],
      certificates: [],
      availability: {},
      isVerified: false,
    },
  });

  const createNannyMutation = useMutation({
    mutationFn: async (data: NannyFormData) => {
      // First create the user account
      const userResponse = await apiRequest("POST", "/api/users", {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isNanny: true,
        profileImage: "",
      });

      const user = await userResponse.json();

      // Then create the nanny profile
      const nannyResponse = await apiRequest("POST", "/api/nannies", {
        userId: user.id,
        bio: data.bio,
        experience: data.experience,
        hourlyRate: data.hourlyRate,
        location: data.location,
        suburb: data.suburb,
        services: data.services,
        certificates: data.certificates,
        availability: data.availability,
        isVerified: false,
      });

      return nannyResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for joining CareConnect. We'll review your application and get back to you soon.",
      });
      form.reset();
      setCurrentStep(1);
    },
    onError: () => {
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NannyFormData) => {
    createNannyMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: FileText },
    { number: 2, title: "Experience", icon: Award },
    { number: 3, title: "Services", icon: Heart },
    { number: 4, title: "Rates & Location", icon: MapPin },
  ];



  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-warm-gray mb-4">
            Join VIVALY as a Caregiver
          </h1>
          <p className="text-xl text-gray-600">
            Help Sydney families while building your childcare career
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-coral text-white' : 
                    isCompleted ? 'bg-soft-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-coral' : isCompleted ? 'text-soft-green' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-4 ${
                      isCompleted ? 'bg-soft-green' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Sarah" {...field} />
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
                              <Input placeholder="Matthews" {...field} />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="sarah@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0412 345 678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        You'll need to provide these documents for verification:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Photo ID (Driver's License or Passport)</li>
                        <li>• Working with Children Check (WWCC)</li>
                        <li>• National Police Check (less than 6 months old)</li>
                        <li>• Professional references (2-3 contacts)</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        Document upload will be available after initial application approval
                      </p>
                    </div>
                  </>
                )}

                {/* Step 2: Experience & Bio */}
                {currentStep === 2 && (
                  <>
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
                              max="30" 
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
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about yourself</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your experience with children, your approach to childcare, and what makes you a great nanny..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="certificates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications & Qualifications</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {CERTIFICATE_TYPES.map((cert) => (
                              <div key={cert} className="flex items-center space-x-2">
                                <Checkbox
                                  id={cert}
                                  checked={field.value?.includes(cert)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, cert]);
                                    } else {
                                      field.onChange(current.filter((c) => c !== cert));
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
                  </>
                )}

                {/* Step 3: Services */}
                {currentStep === 3 && (
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services You Offer</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {SERVICE_TYPES.map((service) => (
                            <div key={service} className="flex items-center space-x-3 p-4 border rounded-lg">
                              <Checkbox
                                id={service}
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, service]);
                                  } else {
                                    field.onChange(current.filter((s) => s !== service));
                                  }
                                }}
                              />
                              <Label htmlFor={service} className="flex-1">
                                <div className="font-medium">{service}</div>
                                <div className="text-sm text-gray-600">
                                  {service === "1-on-1 Care" && "Individual attention for one child"}
                                  {service === "Group Care" && "Care for multiple children"}
                                  {service === "Group Play" && "Organized activities and playtime"}
                                  {service === "Drop & Dash" && "Short-term care sessions"}
                                  {service === "Postpartum Support" && "Support for new mothers"}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 4: Rates & Location */}
                {currentStep === 4 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  <SelectValue placeholder="Select your suburb" />
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
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Verification Process</h3>
                          <p className="text-blue-800 text-sm">
                            After submitting your application, we'll verify your identity, check your references, 
                            and review your certifications. This process typically takes 3-5 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-coral hover:bg-coral/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createNannyMutation.isPending}
                  className="bg-coral hover:bg-coral/90"
                >
                  {createNannyMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
