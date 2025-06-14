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
  Globe,
  Car,
  Clock,
  Heart
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";

const enhancedCaregiverSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  // Location
  address: z.string().min(5, "Please enter your full address"),
  suburb: z.string().min(2, "Suburb is required"),
  state: z.string().min(2, "State is required"),
  postcode: z.string().min(4, "Valid postcode required"),
  
  // About Me / Bio (200-400 words)
  bio: z.string().min(200, "Bio must be between 200-400 words").max(2000, "Bio too long"),
  personalApproach: z.string().min(50, "Please describe your personal approach to care"),
  whyThisWork: z.string().min(50, "Please tell us why you chose this work"),
  
  // Experience & Credentials
  yearsExperience: z.number().min(0, "Experience cannot be negative"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  
  // Certifications
  hasWWCC: z.boolean(),
  wwccNumber: z.string().optional(),
  wwccExpiry: z.string().optional(),
  hasFirstAid: z.boolean(),
  firstAidExpiry: z.string().optional(),
  hasPoliceCheck: z.boolean(),
  policeCheckDate: z.string().optional(),
  hasCOVIDVaccine: z.boolean(),
  relevantDiplomas: z.array(z.string()),
  
  // Availability
  availability: z.object({
    monday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    tuesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    wednesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    thursday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    friday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    saturday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    sunday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
  }),
  emergencyBookings: z.boolean(),
  lastMinuteBookings: z.boolean(),
  
  // Rates
  hourlyRate: z.number().min(15, "Hourly rate must be at least $15"),
  overnightRate: z.number().optional(),
  willingToNegotiate: z.boolean(),
  packageDeals: z.boolean(),
  
  // Languages
  languages: z.array(z.string()).min(1, "Select at least one language"),
  otherLanguage: z.string().optional(),
  
  // Transport & Travel
  hasOwnCar: z.boolean(),
  publicTransportOnly: z.boolean(),
  travelRange: z.number().min(1, "Please specify travel range in km"),
  
  // Emergency Contact
  emergencyName: z.string().min(2, "Emergency contact name required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone required"),
  emergencyRelation: z.string().min(2, "Relationship required"),
  
  // Agreement
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true, "You must consent to background check"),
});

type EnhancedCaregiverForm = z.infer<typeof enhancedCaregiverSchema>;

export default function EnhancedCaregiverRegistration() {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const totalSteps = 6;

  const form = useForm<EnhancedCaregiverForm>({
    resolver: zodResolver(enhancedCaregiverSchema),
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
      personalApproach: "",
      whyThisWork: "",
      yearsExperience: 0,
      ageGroups: [],
      services: [],
      hasWWCC: false,
      wwccNumber: "",
      wwccExpiry: "",
      hasFirstAid: false,
      firstAidExpiry: "",
      hasPoliceCheck: false,
      policeCheckDate: "",
      hasCOVIDVaccine: false,
      relevantDiplomas: [],
      availability: {
        monday: { available: false, start: "09:00", end: "17:00" },
        tuesday: { available: false, start: "09:00", end: "17:00" },
        wednesday: { available: false, start: "09:00", end: "17:00" },
        thursday: { available: false, start: "09:00", end: "17:00" },
        friday: { available: false, start: "09:00", end: "17:00" },
        saturday: { available: false, start: "09:00", end: "17:00" },
        sunday: { available: false, start: "09:00", end: "17:00" },
      },
      emergencyBookings: false,
      lastMinuteBookings: false,
      hourlyRate: 25,
      overnightRate: undefined,
      willingToNegotiate: false,
      packageDeals: false,
      languages: [],
      otherLanguage: "",
      hasOwnCar: false,
      publicTransportOnly: false,
      travelRange: 10,
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      agreeToTerms: false,
      agreeToBackgroundCheck: false,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: EnhancedCaregiverForm) => {
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
        description: "Your caregiver profile is under review. You'll be notified within 1-2 business days.",
      });
      setStep(7); // Success step
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
    "1-on-1 care",
    "1-2 hours group care", 
    "Childcare",
    "Drop and dash",
    "Midwife services",
    "Doula services",
    "Breastfeeding support",
    "Birth education",
    "Newborn support",
    "Pregnancy assistance",
    "Postnatal care",
    "Pet sitting",
    "Elderly care",
    "Elderly companionship"
  ];

  const ageGroupOptions = [
    "0-12 months (Infants)",
    "1-2 years (Toddlers)", 
    "3-5 years (Preschool)",
    "6-12 years (School-aged)",
    "13+ years (Teenagers)",
    "Adults",
    "Elderly"
  ];

  const languageOptions = [
    "English",
    "Mandarin",
    "Cantonese",
    "Arabic",
    "Vietnamese",
    "Italian",
    "Greek",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Korean",
    "Japanese",
    "Other"
  ];

  const diplomaOptions = [
    "Certificate III in Early Childhood Education",
    "Diploma of Early Childhood Education",
    "Bachelor of Education",
    "Nursing Degree",
    "Social Work Degree",
    "Certificate IV in Disability",
    "Certificate in Aged Care",
    "Montessori Certification",
    "Special Needs Training",
    "Other"
  ];

  const validateCurrentStep = async () => {
    if (step === 1) {
      const requiredFields = [
        "firstName",
        "lastName", 
        "email",
        "phone",
        "dateOfBirth",
        "address",
        "suburb",
        "state",
        "postcode",
      ];

      const isValid = await form.trigger(requiredFields);

      if (!isValid) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in all required information before continuing.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 2) {
      const requiredFields = ["bio", "personalApproach", "whyThisWork"];
      const isValid = await form.trigger(requiredFields);
      
      const bioLength = form.watch("bio")?.length >= 200;

      if (!isValid || !bioLength) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in your bio (200+ characters) and approach descriptions.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 3) {
      const requiredFields = ["yearsExperience"];
      const isValid = await form.trigger(requiredFields);
      const hasServices = form.watch("services")?.length > 0;
      const hasAgeGroups = form.watch("ageGroups")?.length > 0;

      if (!isValid || !hasServices || !hasAgeGroups) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in experience, select services, and age groups.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              stepNumber <= step ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < 6 && (
              <div className={`w-8 h-0.5 mx-1 ${stepNumber < step ? 'bg-orange-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Step 1: Personal Information
  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-6 h-6 text-orange-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input 
              id="firstName" 
              {...form.register("firstName")}
              placeholder="Sarah" 
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input 
              id="lastName" 
              {...form.register("lastName")}
              placeholder="Johnson" 
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email" 
              type="email"
              {...form.register("email")}
              placeholder="sarah@email.com" 
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone" 
              {...form.register("phone")}
              placeholder="+61 xxx xxx xxx" 
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input 
            id="dateOfBirth" 
            type="date"
            {...form.register("dateOfBirth")}
          />
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input 
            id="address" 
            {...form.register("address")}
            placeholder="123 Care Street" 
          />
          {form.formState.errors.address && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.address.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="suburb">Suburb *</Label>
            <Input 
              id="suburb" 
              {...form.register("suburb")}
              placeholder="Melbourne" 
            />
            {form.formState.errors.suburb && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.suburb.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select onValueChange={(value) => form.setValue("state", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSW">NSW</SelectItem>
                <SelectItem value="VIC">VIC</SelectItem>
                <SelectItem value="QLD">QLD</SelectItem>
                <SelectItem value="WA">WA</SelectItem>
                <SelectItem value="SA">SA</SelectItem>
                <SelectItem value="TAS">TAS</SelectItem>
                <SelectItem value="ACT">ACT</SelectItem>
                <SelectItem value="NT">NT</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.state && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="postcode">Postcode *</Label>
            <Input 
              id="postcode" 
              {...form.register("postcode")}
              placeholder="3000" 
            />
            {form.formState.errors.postcode && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.postcode.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: About Me / Bio
  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-orange-600" />
          About Me / Bio
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help families get to know you with a detailed description (200-400 words)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="bio">Tell us about yourself *</Label>
          <Textarea
            id="bio"
            {...form.register("bio")}
            placeholder="Share who you are, your background, experience with children/care, what you enjoy about this work, and what makes you unique as a caregiver..."
            rows={8}
            className="mt-1"
          />
          <p className="text-sm text-gray-600 mt-1">
            {form.watch("bio")?.length || 0} characters (200-400 words recommended)
          </p>
          {form.formState.errors.bio && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.bio.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="personalApproach">Your personal approach to care *</Label>
          <Textarea
            id="personalApproach"
            {...form.register("personalApproach")}
            placeholder="Describe your philosophy and approach to caring for children/clients. What's your style? How do you handle different situations?"
            rows={4}
            className="mt-1"
          />
          {form.formState.errors.personalApproach && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.personalApproach.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="whyThisWork">Why do you do this work? *</Label>
          <Textarea
            id="whyThisWork"
            {...form.register("whyThisWork")}
            placeholder="What motivates you to work in care? What do you find rewarding about helping families?"
            rows={4}
            className="mt-1"
          />
          {form.formState.errors.whyThisWork && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.whyThisWork.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Experience & Services
  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-orange-600" />
          Experience & Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="yearsExperience">Years of Experience *</Label>
          <Input
            id="yearsExperience"
            type="number"
            min="0"
            {...form.register("yearsExperience", { valueAsNumber: true })}
            placeholder="3"
          />
          {form.formState.errors.yearsExperience && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.yearsExperience.message}</p>
          )}
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Age Groups You Care For *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ageGroupOptions.map((ageGroup) => (
              <div key={ageGroup} className="flex items-center space-x-3">
                <Checkbox 
                  id={ageGroup}
                  checked={form.watch("ageGroups")?.includes(ageGroup)}
                  onCheckedChange={(checked) => {
                    const currentAgeGroups = form.watch("ageGroups") || [];
                    if (checked) {
                      form.setValue("ageGroups", [...currentAgeGroups, ageGroup]);
                    } else {
                      form.setValue("ageGroups", currentAgeGroups.filter(item => item !== ageGroup));
                    }
                  }}
                />
                <Label htmlFor={ageGroup} className="text-sm">{ageGroup}</Label>
              </div>
            ))}
          </div>
          {form.formState.errors.ageGroups && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.ageGroups.message}</p>
          )}
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Services You Provide *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceTypes.map((service) => (
              <div key={service} className="flex items-center space-x-3">
                <Checkbox 
                  id={service}
                  checked={form.watch("services")?.includes(service)}
                  onCheckedChange={(checked) => {
                    const currentServices = form.watch("services") || [];
                    if (checked) {
                      form.setValue("services", [...currentServices, service]);
                    } else {
                      form.setValue("services", currentServices.filter(item => item !== service));
                    }
                  }}
                />
                <Label htmlFor={service} className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
          {form.formState.errors.services && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.services.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Step 4: Availability & Rates
  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-600" />
          Availability & Rates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Weekly Availability</Label>
          <div className="space-y-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
              const dayKey = day as keyof EnhancedCaregiverForm['availability'];
              const availability = form.watch('availability');
              return (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20">
                    <Checkbox 
                      id={`${day}-available`}
                      checked={availability?.[dayKey]?.available || false}
                      onCheckedChange={(checked) => {
                        form.setValue(`availability.${dayKey}.available`, !!checked);
                      }}
                    />
                    <Label htmlFor={`${day}-available`} className="ml-2 capitalize">{day}</Label>
                  </div>
                  {availability?.[dayKey]?.available && (
                    <>
                      <Input 
                        type="time"
                        value={availability?.[dayKey]?.start || "09:00"}
                        onChange={(e) => form.setValue(`availability.${dayKey}.start`, e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input 
                        type="time"
                        value={availability?.[dayKey]?.end || "17:00"}
                        onChange={(e) => form.setValue(`availability.${dayKey}.end`, e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="emergencyBookings"
              checked={form.watch("emergencyBookings")}
              onCheckedChange={(checked) => form.setValue("emergencyBookings", !!checked)}
            />
            <Label htmlFor="emergencyBookings">Available for emergency bookings</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="lastMinuteBookings"
              checked={form.watch("lastMinuteBookings")}
              onCheckedChange={(checked) => form.setValue("lastMinuteBookings", !!checked)}
            />
            <Label htmlFor="lastMinuteBookings">Available for last-minute bookings</Label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (AUD) *</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="15"
              {...form.register("hourlyRate", { valueAsNumber: true })}
              placeholder="25"
            />
            {form.formState.errors.hourlyRate && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.hourlyRate.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="overnightRate">Overnight Rate (AUD)</Label>
            <Input
              id="overnightRate"
              type="number"
              {...form.register("overnightRate", { valueAsNumber: true })}
              placeholder="200"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="willingToNegotiate"
              checked={form.watch("willingToNegotiate")}
              onCheckedChange={(checked) => form.setValue("willingToNegotiate", !!checked)}
            />
            <Label htmlFor="willingToNegotiate">Willing to negotiate rates</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="packageDeals"
              checked={form.watch("packageDeals")}
              onCheckedChange={(checked) => form.setValue("packageDeals", !!checked)}
            />
            <Label htmlFor="packageDeals">Offer package deals</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 5: Languages & Transport
  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-600" />
          Languages & Transport
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Languages Spoken *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languageOptions.map((language) => (
              <div key={language} className="flex items-center space-x-3">
                <Checkbox 
                  id={language}
                  checked={form.watch("languages")?.includes(language)}
                  onCheckedChange={(checked) => {
                    const currentLanguages = form.watch("languages") || [];
                    if (checked) {
                      form.setValue("languages", [...currentLanguages, language]);
                    } else {
                      form.setValue("languages", currentLanguages.filter(item => item !== language));
                    }
                  }}
                />
                <Label htmlFor={language} className="text-sm">{language}</Label>
              </div>
            ))}
          </div>
          {form.formState.errors.languages && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.languages.message}</p>
          )}
        </div>

        {form.watch("languages")?.includes("Other") && (
          <div>
            <Label htmlFor="otherLanguage">Please specify other language</Label>
            <Input
              id="otherLanguage"
              {...form.register("otherLanguage")}
              placeholder="Tamil, Punjabi, etc."
            />
          </div>
        )}

        <div>
          <Label className="text-base font-medium mb-4 block">Transport & Travel</Label>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="hasOwnCar"
                checked={form.watch("hasOwnCar")}
                onCheckedChange={(checked) => form.setValue("hasOwnCar", !!checked)}
              />
              <Label htmlFor="hasOwnCar">I have my own car</Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="publicTransportOnly"
                checked={form.watch("publicTransportOnly")}
                onCheckedChange={(checked) => form.setValue("publicTransportOnly", !!checked)}
              />
              <Label htmlFor="publicTransportOnly">I use public transport only</Label>
            </div>

            <div>
              <Label htmlFor="travelRange">Distance willing to travel (km) *</Label>
              <Input
                id="travelRange"
                type="number"
                min="1"
                {...form.register("travelRange", { valueAsNumber: true })}
                placeholder="10"
              />
              {form.formState.errors.travelRange && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.travelRange.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 6: Credentials & Final Details
  const renderStep6 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-600" />
          Credentials & Final Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Certifications & Checks</Label>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox 
                  id="hasWWCC"
                  checked={form.watch("hasWWCC")}
                  onCheckedChange={(checked) => form.setValue("hasWWCC", !!checked)}
                />
                <Label htmlFor="hasWWCC" className="font-medium">Working with Children Check (WWCC)</Label>
              </div>
              {form.watch("hasWWCC") && (
                <div className="ml-6 grid md:grid-cols-2 gap-4">
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

            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox 
                  id="hasFirstAid"
                  checked={form.watch("hasFirstAid")}
                  onCheckedChange={(checked) => form.setValue("hasFirstAid", !!checked)}
                />
                <Label htmlFor="hasFirstAid" className="font-medium">
                  First Aid & CPR Certification (optional but beneficial)
                </Label>
              </div>
              {form.watch("hasFirstAid") && (
                <div className="ml-6">
                  <Label htmlFor="firstAidExpiry">Expiry Date</Label>
                  <Input
                    id="firstAidExpiry"
                    type="date"
                    {...form.register("firstAidExpiry")}
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox 
                  id="hasPoliceCheck"
                  checked={form.watch("hasPoliceCheck")}
                  onCheckedChange={(checked) => form.setValue("hasPoliceCheck", !!checked)}
                />
                <Label htmlFor="hasPoliceCheck" className="font-medium">Police Check</Label>
              </div>
              {form.watch("hasPoliceCheck") && (
                <div className="ml-6">
                  <Label htmlFor="policeCheckDate">Date Completed</Label>
                  <Input
                    id="policeCheckDate"
                    type="date"
                    {...form.register("policeCheckDate")}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox 
                id="hasCOVIDVaccine"
                checked={form.watch("hasCOVIDVaccine")}
                onCheckedChange={(checked) => form.setValue("hasCOVIDVaccine", !!checked)}
              />
              <Label htmlFor="hasCOVIDVaccine" className="font-medium">COVID Vaccination (optional)</Label>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Relevant Diplomas & Training</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diplomaOptions.map((diploma) => (
              <div key={diploma} className="flex items-center space-x-3">
                <Checkbox 
                  id={diploma}
                  checked={form.watch("relevantDiplomas")?.includes(diploma)}
                  onCheckedChange={(checked) => {
                    const currentDiplomas = form.watch("relevantDiplomas") || [];
                    if (checked) {
                      form.setValue("relevantDiplomas", [...currentDiplomas, diploma]);
                    } else {
                      form.setValue("relevantDiplomas", currentDiplomas.filter(item => item !== diploma));
                    }
                  }}
                />
                <Label htmlFor={diploma} className="text-sm">{diploma}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-4 block">Emergency Contact</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
              <Input
                id="emergencyName"
                {...form.register("emergencyName")}
                placeholder="John Smith"
              />
              {form.formState.errors.emergencyName && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.emergencyName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
              <Input
                id="emergencyPhone"
                {...form.register("emergencyPhone")}
                placeholder="+61 xxx xxx xxx"
              />
              {form.formState.errors.emergencyPhone && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.emergencyPhone.message}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="emergencyRelation">Relationship *</Label>
            <Input
              id="emergencyRelation"
              {...form.register("emergencyRelation")}
              placeholder="Spouse, Parent, Sibling"
            />
            {form.formState.errors.emergencyRelation && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.emergencyRelation.message}</p>
            )}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="agreeToTerms"
              checked={form.watch("agreeToTerms")}
              onCheckedChange={(checked) => form.setValue("agreeToTerms", !!checked)}
            />
            <Label htmlFor="agreeToTerms" className="font-medium">
              I agree to VIVALY's Terms of Service and Privacy Policy
            </Label>
          </div>
          {form.formState.errors.agreeToTerms && (
            <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
          )}
          
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="agreeToBackgroundCheck"
              checked={form.watch("agreeToBackgroundCheck")}
              onCheckedChange={(checked) => form.setValue("agreeToBackgroundCheck", !!checked)}
            />
            <Label htmlFor="agreeToBackgroundCheck" className="font-medium">
              I consent to background verification and reference checks
            </Label>
          </div>
          {form.formState.errors.agreeToBackgroundCheck && (
            <p className="text-sm text-red-600">{form.formState.errors.agreeToBackgroundCheck.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Success Step
  const renderSuccessStep = () => (
    <Card>
      <CardContent className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for joining VIVALY as a caregiver. We're reviewing your application 
          and will notify you within 1-2 business days.
        </p>
        
        <div className="space-y-3 max-w-md mx-auto text-sm text-gray-600">
          <h3 className="font-medium text-gray-900">What happens next?</h3>
          <div className="space-y-1">
            <p>• We'll verify your credentials and references</p>
            <p>• Our team will contact you for any additional information</p>
            <p>• Once approved, your profile will be live on VIVALY</p>
            <p>• You'll receive access to your caregiver dashboard</p>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/dashboard">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const handleSubmit = () => {
    form.handleSubmit((data) => {
      registrationMutation.mutate(data);
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/registration-type-selection" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to registration options
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Individual Caregiver Registration</h1>
            <p className="text-gray-600">
              Complete your detailed profile to connect with families looking for trusted care
            </p>
          </div>

          {step <= 6 && renderStepIndicator()}

          {/* Form Steps */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderSuccessStep()}

          {/* Navigation */}
          {step <= 6 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={step === 6 ? handleSubmit : nextStep}
                disabled={registrationMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                {step === 6 ? (
                  registrationMutation.isPending ? 'Submitting...' : 'Submit Registration'
                ) : (
                  'Next'
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}