import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  MapPin, 
  DollarSign, 
  Award, 
  FileText,
  Camera,
  Shield,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const caregiverRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Please enter your full address"),
  suburb: z.string().min(2, "Suburb is required"),
  state: z.string().min(2, "State is required"),
  postcode: z.string().min(4, "Valid postcode required"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  experience: z.number().min(0, "Experience cannot be negative"),
  hourlyRate: z.number().min(15, "Hourly rate must be at least $15"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  availability: z.object({
    monday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    tuesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    wednesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    thursday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    friday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    saturday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    sunday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
  }),
  hasWWCC: z.boolean(),
  wwccNumber: z.string().optional(),
  wwccExpiry: z.string().optional(),
  hasFirstAid: z.boolean(),
  firstAidExpiry: z.string().optional(),
  hasPoliceCheck: z.boolean(),
  policeCheckDate: z.string().optional(),
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyRelation: z.string().min(1, "Emergency contact relation is required"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true, "You must agree to background check"),
});

type CaregiverRegistrationForm = z.infer<typeof caregiverRegistrationSchema>;

export default function CaregiverRegistration() {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CaregiverRegistrationForm>({
    resolver: zodResolver(caregiverRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      bio: "",
      experience: 0,
      hourlyRate: 25,
      services: [],
      ageGroups: [],
      availability: {
        monday: { available: false, start: "09:00", end: "17:00" },
        tuesday: { available: false, start: "09:00", end: "17:00" },
        wednesday: { available: false, start: "09:00", end: "17:00" },
        thursday: { available: false, start: "09:00", end: "17:00" },
        friday: { available: false, start: "09:00", end: "17:00" },
        saturday: { available: false, start: "09:00", end: "17:00" },
        sunday: { available: false, start: "09:00", end: "17:00" },
      },
      hasWWCC: false,
      wwccNumber: "",
      wwccExpiry: "",
      hasFirstAid: false,
      firstAidExpiry: "",
      hasPoliceCheck: false,
      policeCheckDate: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      agreeToTerms: false,
      agreeToBackgroundCheck: false,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: CaregiverRegistrationForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      return apiRequest("POST", "/api/caregivers/register", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Registration Submitted!",
        description: "Your caregiver profile is under review. You'll be notified within 2-3 business days.",
      });
      setStep(5);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const serviceTypes = [
    "Childcare", "Babysitting", "Nanny", "Au Pair", 
    "After School Care", "Holiday Care", "Overnight Care",
    "Special Needs Care", "Newborn Care"
  ];

  const ageGroups = [
    "Newborn (0-3 months)", "Baby (3-12 months)", 
    "Toddler (1-3 years)", "Preschool (3-5 years)", 
    "School Age (5-12 years)", "Teenager (13+ years)"
  ];

  const states = [
    "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"
  ];

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const toggleService = (service: string) => {
    const currentServices = form.getValues("services");
    if (currentServices.includes(service)) {
      form.setValue("services", currentServices.filter(s => s !== service));
    } else {
      form.setValue("services", [...currentServices, service]);
    }
  };

  const toggleAgeGroup = (ageGroup: string) => {
    const currentAgeGroups = form.getValues("ageGroups");
    if (currentAgeGroups.includes(ageGroup)) {
      form.setValue("ageGroups", currentAgeGroups.filter(a => a !== ageGroup));
    } else {
      form.setValue("ageGroups", [...currentAgeGroups, ageGroup]);
    }
  };

  const progress = (step / 4) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tell us about your location</h2>
              <p className="text-xl text-gray-600">Where in Sydney are you available to provide care?</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium text-gray-900 mb-4 block">Primary Service Area</Label>
                <Select onValueChange={(value) => form.setValue("suburb", value)}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Bondi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bondi">Bondi</SelectItem>
                    <SelectItem value="sydney-cbd">Sydney CBD</SelectItem>
                    <SelectItem value="manly">Manly</SelectItem>
                    <SelectItem value="parramatta">Parramatta</SelectItem>
                    <SelectItem value="chatswood">Chatswood</SelectItem>
                    <SelectItem value="newtown">Newtown</SelectItem>
                    <SelectItem value="surry-hills">Surry Hills</SelectItem>
                    <SelectItem value="paddington">Paddington</SelectItem>
                    <SelectItem value="double-bay">Double Bay</SelectItem>
                    <SelectItem value="mosman">Mosman</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-gray-600 mt-2">Choose the area where you're most available to provide care services.</p>
                {form.formState.errors.suburb && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.suburb.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 text-lg font-medium rounded-lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Enter your first name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Enter your last name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Label htmlFor="phone">Phone Number *</Label>
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
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="text"
                  {...form.register("dateOfBirth")}
                  placeholder="DD/MM/YYYY"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Please enter your date of birth in DD/MM/YYYY format (e.g., 15/08/1990)
                </p>
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="123 Main Street"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select onValueChange={(value) => form.setValue("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.state && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.state.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input
                    id="postcode"
                    {...form.register("postcode")}
                    placeholder="2000"
                  />
                  {form.formState.errors.postcode && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.postcode.message}
                    </p>
                  )}
                </div>
              </div>


            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Availability & Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Weekly Availability</Label>
                <div className="space-y-3">
                  {daysOfWeek.map((day) => {
                    const availabilityField = form.watch("availability");
                    const dayData = availabilityField[day as keyof typeof availabilityField];
                    
                    return (
                      <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-24">
                          <Label className="flex items-center gap-2">
                            <Checkbox
                              checked={dayData.available}
                              onCheckedChange={(checked) => 
                                form.setValue(`availability.${day as keyof typeof availabilityField}.available`, !!checked)
                              }
                            />
                            <span className="capitalize">{day}</span>
                          </Label>
                        </div>
                        
                        {dayData.available && (
                          <div className="flex items-center gap-2 flex-1">
                            <Select
                              value={dayData.start}
                              onValueChange={(value) => 
                                form.setValue(`availability.${day as keyof typeof availabilityField}.start`, value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <span className="text-gray-500">to</span>
                            
                            <Select
                              value={dayData.end}
                              onValueChange={(value) => 
                                form.setValue(`availability.${day as keyof typeof availabilityField}.end`, value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Qualifications & Certifications</Label>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasWWCC"
                        checked={form.watch("hasWWCC")}
                        onCheckedChange={(checked) => form.setValue("hasWWCC", !!checked)}
                      />
                      <Label htmlFor="hasWWCC" className="flex-1">
                        <div className="font-medium">Working With Children Check (WWCC)</div>
                        <div className="text-sm text-gray-600">Required for all childcare providers in Australia</div>
                      </Label>
                    </div>
                    
                    {form.watch("hasWWCC") && (
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <Label htmlFor="wwccNumber">WWCC Number</Label>
                          <Input
                            id="wwccNumber"
                            {...form.register("wwccNumber")}
                            placeholder="WWC1234567E"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wwccExpiry">Expiry Date</Label>
                          <Input
                            id="wwccExpiry"
                            type="date"
                            {...form.register("wwccExpiry")}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasFirstAid"
                        checked={form.watch("hasFirstAid")}
                        onCheckedChange={(checked) => form.setValue("hasFirstAid", !!checked)}
                      />
                      <Label htmlFor="hasFirstAid" className="flex-1">
                        <div className="font-medium">First Aid & CPR Certification</div>
                        <div className="text-sm text-gray-600">Essential for child safety and emergencies</div>
                      </Label>
                    </div>
                    
                    {form.watch("hasFirstAid") && (
                      <div className="mt-3">
                        <Label htmlFor="firstAidExpiry">Certification Expiry Date</Label>
                        <Input
                          id="firstAidExpiry"
                          type="date"
                          {...form.register("firstAidExpiry")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasPoliceCheck"
                        checked={form.watch("hasPoliceCheck")}
                        onCheckedChange={(checked) => form.setValue("hasPoliceCheck", !!checked)}
                      />
                      <Label htmlFor="hasPoliceCheck" className="flex-1">
                        <div className="font-medium">National Police Check</div>
                        <div className="text-sm text-gray-600">Background verification for child safety</div>
                      </Label>
                    </div>
                    
                    {form.watch("hasPoliceCheck") && (
                      <div className="mt-3">
                        <Label htmlFor="policeCheckDate">Issue Date</Label>
                        <Input
                          id="policeCheckDate"
                          type="date"
                          {...form.register("policeCheckDate")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Emergency Contact & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Emergency Contact Information</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyName">Full Name *</Label>
                    <Input
                      id="emergencyName"
                      {...form.register("emergencyName")}
                      placeholder="Emergency contact full name"
                    />
                    {form.formState.errors.emergencyName && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.emergencyName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number *</Label>
                      <Input
                        id="emergencyPhone"
                        {...form.register("emergencyPhone")}
                        placeholder="0412 345 678"
                      />
                      {form.formState.errors.emergencyPhone && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.emergencyPhone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emergencyRelation">Relationship *</Label>
                      <Input
                        id="emergencyRelation"
                        {...form.register("emergencyRelation")}
                        placeholder="e.g., Parent, Sibling, Friend"
                      />
                      {form.formState.errors.emergencyRelation && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.emergencyRelation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={form.watch("agreeToTerms")}
                      onCheckedChange={(checked) => form.setValue("agreeToTerms", !!checked)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to VIVALY's{" "}
                      <a href="/terms" className="text-blue-600 underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {form.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                </div>

                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToBackgroundCheck"
                      checked={form.watch("agreeToBackgroundCheck")}
                      onCheckedChange={(checked) => form.setValue("agreeToBackgroundCheck", !!checked)}
                    />
                    <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
                      I consent to background checks and verification processes required for child safety
                    </Label>
                  </div>
                  {form.formState.errors.agreeToBackgroundCheck && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.agreeToBackgroundCheck.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• We'll review your application within 2-3 business days</li>
                  <li>• Background checks and verification will be conducted</li>
                  <li>• You'll receive email notification once approved</li>
                  <li>• Complete any additional verification steps if required</li>
                  <li>• Start accepting bookings from families</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for joining VIVALY as a caregiver. We're reviewing your application 
                and will notify you within 2-3 business days.
              </p>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We'll verify your certifications and conduct background checks</li>
                  <li>• You'll receive an email once your profile is approved</li>
                  <li>• Complete any additional verification steps if required</li>
                  <li>• Start accepting bookings from families</li>
                </ul>
              </div>
              
              <div className="space-y-3 mt-8">
                <Button onClick={() => window.location.href = "/caregiver-dashboard"} className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return form.watch("suburb"); // Only need suburb for step 1
      case 2:
        return form.watch("firstName") && form.watch("lastName") && 
               form.watch("email") && form.watch("phone") && 
               form.watch("dateOfBirth") && form.watch("address") && 
               form.watch("state") && form.watch("postcode");
      case 3:
        const availability = form.watch("availability");
        return daysOfWeek.some(day => availability[day as keyof typeof availability].available);
      case 4:
        return form.watch("emergencyName") && 
               form.watch("emergencyPhone") && 
               form.watch("emergencyRelation") &&
               form.watch("agreeToTerms") && 
               form.watch("agreeToBackgroundCheck");
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    registrationMutation.mutate(form.getValues());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Caregiver</h1>
          <p className="text-gray-600 mt-2">Join thousands of caregivers helping families across Australia</p>
        </div>

        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {renderStep()}

        {step > 1 && step < 5 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={() => step === 4 ? handleSubmit() : setStep(step + 1)}
              disabled={!canProceed() || (step === 4 && registrationMutation.isPending)}
              style={{ backgroundColor: '#FF6B35' }}
              className="text-white"
            >
              {step === 4 ? (
                registrationMutation.isPending ? 'Submitting...' : 'Submit Application'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Information Boxes */}
        <div className="mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            {/* FAQ Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h3>
                <ChevronDown className="w-4 h-4 text-gray-600 mx-auto" />
              </div>
              
              <div className="space-y-4">
                <Collapsible>
                  <CollapsibleTrigger className="w-full text-left font-medium text-gray-900 hover:text-coral transition-colors">
                    How do I get started?
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm text-gray-600 mt-2">
                    Complete our simple registration process, pass background checks, and start accepting bookings from families in your area.
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="w-full text-left font-medium text-gray-900 hover:text-coral transition-colors">
                    What qualifications do I need?
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm text-gray-600 mt-2">
                    You need to be 18+, have relevant experience, hold current First Aid/CPR certifications, and pass our background checks.
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="w-full text-left font-medium text-gray-900 hover:text-coral transition-colors">
                    How does payment work?
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm text-gray-600 mt-2">
                    You set your own rates and receive payment directly through our secure platform. VIVALY takes a 10% service fee.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* VIVALY Fees & Earnings */}
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">VIVALY Fees & Earnings</h3>
                <ChevronDown className="w-4 h-4 text-gray-600 mx-auto" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Platform Fee</h4>
                  <p className="text-sm text-gray-600">VIVALY takes a 10% service fee from each booking to maintain the platform and provide customer support.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Average Earnings</h4>
                  <p className="text-sm text-gray-600">Caregivers typically earn $25-65 per hour, with experienced providers earning $45+ per hour.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Schedule</h4>
                  <p className="text-sm text-gray-600">Payments are processed within 24-48 hours after job completion via direct deposit.</p>
                </div>
              </div>
            </div>

            {/* Policies & Regulations */}
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Policies & Regulations</h3>
                <ChevronDown className="w-4 h-4 text-gray-600 mx-auto" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Background Checks</h4>
                  <p className="text-sm text-gray-600">All caregivers undergo comprehensive background checks including police checks, WWCC verification, and reference validation.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Insurance Coverage</h4>
                  <p className="text-sm text-gray-600">VIVALY provides liability insurance coverage for all registered caregivers during active bookings.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Compliance Standards</h4>
                  <p className="text-sm text-gray-600">We adhere to Australian childcare regulations and maintain strict safety protocols for all services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}