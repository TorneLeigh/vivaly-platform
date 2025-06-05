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
import { insertNannySchema, SERVICE_TYPES, CERTIFICATE_TYPES } from "@shared/schema";
import { z } from "zod";
import { 
  Heart, Shield, Award, DollarSign, MapPin, FileText, ChevronDown, 
  Clock, HelpCircle, Users, CheckCircle, AlertCircle, Camera, Upload 
} from "lucide-react";

const caregiverFormSchema = insertNannySchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CaregiverFormData = z.infer<typeof caregiverFormSchema>;

export default function BecomeCaregiver() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [verificationStarted, setVerificationStarted] = useState(false);
  const { toast } = useToast();

  const form = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      bio: "",
      hourlyRate: "",
      experience: 0,
      location: "",
      serviceTypes: [],
      certificates: [],
      availability: {},
    },
  });

  const createCaregiver = useMutation({
    mutationFn: async (data: CaregiverFormData) => {
      const userResponse = await apiRequest("POST", "/api/users", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType: "caregiver",
      });

      const user = await userResponse.json();

      const nannyResponse = await apiRequest("POST", "/api/nannies", {
        userId: user.id,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        experience: data.experience,
        location: data.location,
        serviceTypes: data.serviceTypes,
        certificates: data.certificates,
        availability: data.availability,
      });

      return nannyResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully!",
        description: "Welcome to VIVALY! Complete your identity verification to start receiving bookings.",
      });
      setVerificationStarted(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CaregiverFormData) => {
    createCaregiver.mutate(data);
  };

  // Sydney suburbs for location selection
  const sydneySuburbs = [
    "Sydney CBD", "Bondi", "Manly", "Parramatta", "Penrith", "Liverpool", 
    "Bankstown", "Blacktown", "Hornsby", "Sutherland", "Randwick", "Waverley",
    "Woollahra", "Mosman", "North Sydney", "Willoughby", "Lane Cove", "Hunters Hill",
    "Ryde", "Ku-ring-gai", "Warringah", "Pittwater", "Canterbury", "Burwood",
    "Strathfield", "Auburn", "Holroyd", "The Hills", "Baulkham Hills", "Hawkesbury",
    "Camden", "Campbelltown", "Fairfield", "Blue Mountains", "Wollondilly"
  ];

  const verificationRequirements = [
    { icon: FileText, title: "Government ID", description: "Driver's license or passport", required: true },
    { icon: Shield, title: "Working with Children Check", description: "Valid WWCC number", required: true },
    { icon: Camera, title: "Profile Photo", description: "Clear photo of yourself", required: true },
    { icon: CheckCircle, title: "Background Check", description: "Police background verification", required: true },
    { icon: Award, title: "Qualifications", description: "First Aid, CPR certificates", required: false },
  ];

  const renderVerificationStep = () => {
    if (!verificationStarted) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
            <Shield className="h-16 w-16 text-coral" />
          </div>
          <h2 className="text-3xl font-bold text-warm-gray mb-4">Identity Verification Required</h2>
          <p className="text-warm-gray-light text-lg">
            Every VIVALY caregiver is required to go through our identity verification process before accepting bookings.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What's required before you can be a caregiver</h3>
              <p className="text-blue-800">
                You'll need to verify your identity before you can start providing care. Every community member 
                is required to go through this process to ensure the safety of families and children.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {verificationRequirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <req.icon className={`h-8 w-8 ${req.required ? 'text-coral' : 'text-gray-400'}`} />
              <div className="flex-1">
                <h4 className="font-semibold text-warm-gray">{req.title}</h4>
                <p className="text-warm-gray-light text-sm">{req.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                req.required ? 'bg-coral-light text-coral' : 'bg-gray-100 text-gray-600'
              }`}>
                {req.required ? 'Required' : 'Optional'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Button size="lg" className="px-12">
            Begin Verification Process
          </Button>
          <p className="text-sm text-warm-gray-light mt-4">
            If more information is needed, we'll let you know so you can complete your account creation.
          </p>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (verificationStarted) {
      return renderVerificationStep();
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
                <MapPin className="h-16 w-16 text-coral" />
              </div>
              <h2 className="text-3xl font-bold text-warm-gray mb-4">Tell us about your location</h2>
              <p className="text-warm-gray-light text-lg">Where in Sydney are you available to provide care?</p>
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Primary Service Area</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Select your primary location in Sydney" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sydneySuburbs.map((suburb) => (
                        <SelectItem key={suburb} value={suburb}>
                          {suburb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the area where you're most available to provide care services.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
                <Users className="h-16 w-16 text-coral" />
              </div>
              <h2 className="text-3xl font-bold text-warm-gray mb-4">Tell us about yourself</h2>
              <p className="text-warm-gray-light text-lg">Help families get to know you better</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-14 text-lg" placeholder="Your first name" />
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
                    <FormLabel className="text-lg font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-14 text-lg" placeholder="Your last name" />
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
                  <FormLabel className="text-lg font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="h-14 text-lg" placeholder="your.email@example.com" />
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
                  <FormLabel className="text-lg font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-14 text-lg" placeholder="0412 345 678" />
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
                  <FormLabel className="text-lg font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="h-14 text-lg" placeholder="Create a secure password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
                <Heart className="h-16 w-16 text-coral" />
              </div>
              <h2 className="text-3xl font-bold text-warm-gray mb-4">What services do you offer?</h2>
              <p className="text-warm-gray-light text-lg">Select all the care services you can provide</p>
            </div>
            
            <FormField
              control={form.control}
              name="serviceTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Service Types</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {SERVICE_TYPES.map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="serviceTypes"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, service])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== service)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {service}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
                <Award className="h-16 w-16 text-coral" />
              </div>
              <h2 className="text-3xl font-bold text-warm-gray mb-4">Your experience & qualifications</h2>
              <p className="text-warm-gray-light text-lg">Tell us about your background in childcare</p>
            </div>
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      max="50" 
                      className="h-14 text-lg" 
                      placeholder="How many years of childcare experience do you have?"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
                  <FormLabel className="text-lg font-semibold">About You</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell families about your experience, approach to childcare, and what makes you special..."
                      rows={6}
                      className="text-lg"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="certificates"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Certifications & Qualifications</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {CERTIFICATE_TYPES.map((cert) => (
                      <FormField
                        key={cert}
                        control={form.control}
                        name="certificates"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(cert)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, cert])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== cert)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {cert}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-coral-light rounded-2xl flex items-center justify-center">
                <DollarSign className="h-16 w-16 text-coral" />
              </div>
              <h2 className="text-3xl font-bold text-warm-gray mb-4">Set your rates</h2>
              <p className="text-warm-gray-light text-lg">What would you like to charge per hour?</p>
            </div>
            
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Hourly Rate (AUD)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="15" 
                      max="100" 
                      step="0.50"
                      className="h-14 text-lg text-center text-2xl font-semibold"
                      placeholder="25.00"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-center mt-2">
                    Average rates in Sydney: $25-45/hour
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-light to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!verificationStarted && (
              <Button 
                variant="ghost" 
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                ← Back
              </Button>
            )}
            {!verificationStarted && (
              <span className="text-warm-gray-light">Step {currentStep} of 5</span>
            )}
          </div>
          <div className="text-lg font-semibold text-warm-gray">VIVALY Caregiver</div>
        </div>
        {/* Progress bar */}
        {!verificationStarted && (
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-coral h-1 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderStepContent()}
            
            {/* Navigation buttons */}
            {!verificationStarted && (
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 5 ? (
                  <Button 
                    type="button" 
                    size="lg"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className={`px-8 ${currentStep === 1 ? 'ml-auto' : ''}`}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={createCaregiver.isPending}
                    className="px-8 ml-auto"
                  >
                    {createCaregiver.isPending ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Information Sections */}
      <div className="bg-white border-t py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* FAQ Section */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowFAQ(!showFAQ)}>
              <CardHeader className="text-center">
                <HelpCircle className="h-12 w-12 text-coral mx-auto mb-4" />
                <CardTitle className="flex items-center justify-center gap-2">
                  Frequently Asked Questions
                  <ChevronDown className={`h-5 w-5 transition-transform ${showFAQ ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
              <Collapsible open={showFAQ}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How do I get started?</h4>
                      <p className="text-sm text-warm-gray-light">Complete your profile, pass our background checks, and start receiving booking requests from families.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When do I get paid?</h4>
                      <p className="text-sm text-warm-gray-light">Payments are processed within 24 hours after each completed booking via direct bank transfer.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What support do I get?</h4>
                      <p className="text-sm text-warm-gray-light">24/7 customer support, safety resources, and ongoing training opportunities.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How long does verification take?</h4>
                      <p className="text-sm text-warm-gray-light">Identity verification typically takes 1-3 business days once all documents are submitted.</p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* VIVALY Fees Section */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowFees(!showFees)}>
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-coral mx-auto mb-4" />
                <CardTitle className="flex items-center justify-center gap-2">
                  VIVALY Fees & Earnings
                  <ChevronDown className={`h-5 w-5 transition-transform ${showFees ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
              <Collapsible open={showFees}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Platform Fee</h4>
                      <p className="text-sm text-warm-gray-light">VIVALY charges a 10% service fee on each completed booking to maintain the platform and provide support.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">You Keep 90%</h4>
                      <p className="text-sm text-warm-gray-light">If you charge $30/hour, you keep $27/hour. No hidden fees or additional charges.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment Processing</h4>
                      <p className="text-sm text-warm-gray-light">Secure payments handled by Stripe. Direct deposit to your bank account within 24 hours.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">No Upfront Costs</h4>
                      <p className="text-sm text-warm-gray-light">Free to join and create your profile. You only pay when you earn.</p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Policies & Regulations Section */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowPolicies(!showPolicies)}>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-coral mx-auto mb-4" />
                <CardTitle className="flex items-center justify-center gap-2">
                  Policies & Regulations
                  <ChevronDown className={`h-5 w-5 transition-transform ${showPolicies ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
              <Collapsible open={showPolicies}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Background Checks</h4>
                      <p className="text-sm text-warm-gray-light">All caregivers undergo comprehensive background checks including Working with Children Check (WWCC).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Insurance Coverage</h4>
                      <p className="text-sm text-warm-gray-light">Public liability insurance provided for all bookings. Additional professional indemnity available.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Compliance</h4>
                      <p className="text-sm text-warm-gray-light">All services comply with Australian childcare regulations and safety standards.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Safety Standards</h4>
                      <p className="text-sm text-warm-gray-light">Mandatory safety training, emergency procedures, and ongoing monitoring of service quality.</p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-coral text-white py-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Clock className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Create a profile in just a few steps</h3>
          <p className="text-lg opacity-90 mb-6">
            Go at your own pace, and make changes whenever you need to. Get 1:1 support from experienced VIVALY team members at any time.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Create a listing in just a few steps</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Go at your own pace</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Get 1:1 support from our team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}