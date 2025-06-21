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
  CheckCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const caregiverRegistrationSchema = z.object({
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
  
  // About Me / Bio
  bio: z.string().min(200, "Bio must be between 200-400 words").max(2000, "Bio must be under 400 words"),
  personalApproach: z.string().min(50, "Please describe your personal approach to care"),
  whyThisWork: z.string().min(50, "Please tell us why you chose this work"),
  
  // Experience & Services
  yearsExperience: z.number().min(0, "Experience cannot be negative"),
  hourlyRate: z.number().min(15, "Hourly rate must be at least $15"),
  overnightRate: z.number().optional(),
  willingToNegotiate: z.boolean(),
  packageDeals: z.boolean(),
  services: z.array(z.string()).min(1, "Select at least one service"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  
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
  
  // Languages
  languages: z.array(z.string()).min(1, "Select at least one language"),
  otherLanguage: z.string().optional(),
  
  // Transport & Travel
  hasOwnCar: z.boolean(),
  publicTransportOnly: z.boolean(),
  travelRange: z.number().min(1, "Please specify travel range in km"),
  
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
  
  // Emergency Contact
  emergencyName: z.string().min(2, "Emergency contact name required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone required"),
  emergencyRelation: z.string().min(2, "Relationship required"),
  
  // Agreement
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true, "You must consent to background check"),
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
      personalApproach: "",
      whyThisWork: "",
      yearsExperience: 0,
      hourlyRate: 25,
      overnightRate: undefined,
      willingToNegotiate: false,
      packageDeals: false,
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
      emergencyBookings: false,
      lastMinuteBookings: false,
      languages: [],
      otherLanguage: "",
      hasOwnCar: false,
      publicTransportOnly: false,
      travelRange: 10,
      hasWWCC: false,
      wwccNumber: "",
      wwccExpiry: "",
      hasFirstAid: false,
      firstAidExpiry: "",
      hasPoliceCheck: false,
      policeCheckDate: "",
      hasCOVIDVaccine: false,
      relevantDiplomas: [],
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
        description: "Your caregiver profile is under review. You'll be notified within 1-2 business days.",
      });
      setStep(5); // Success step
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

  const ageGroups = [
    "Newborn (0-3 months)", "Baby (3-12 months)", 
    "Toddler (1-3 years)", "Preschool (3-5 years)", 
    "School Age (5-12 years)", "Teenager (13+ years)"
  ];

  const states = [
    "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"
  ];

  const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", 
    "friday", "saturday", "sunday"
  ];

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

  const saveSectionData = async (sectionData: any) => {
    try {
      const response = await fetch("/api/caregiver/save-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save section");
      }

      toast({
        title: "Success",
        description: "Section saved successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
                  type="date"
                  {...form.register("dateOfBirth")}
                />
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Input
                    id="suburb"
                    {...form.register("suburb")}
                    placeholder="Suburb"
                  />
                  {form.formState.errors.suburb && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.suburb.message}
                    </p>
                  )}
                </div>
                
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

              <div>
                <Label htmlFor="profileImage">Profile Photos</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Upload multiple professional photos to showcase yourself (recommended)
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Experience & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="bio">About You *</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Tell families about yourself, your experience, and what makes you special..."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  {form.watch("bio")?.length || 0}/50 characters minimum
                </p>
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    {...form.register("yearsExperience", { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {form.formState.errors.yearsExperience && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.yearsExperience.message}
                    </p>
                  )}
                </div>
                
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
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.hourlyRate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Services You Offer *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceTypes.map((service) => (
                    <div
                      key={service}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        form.watch("services")?.includes(service)
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
                {form.formState.errors.services && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.services.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-3 block">Age Groups You Care For *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ageGroups.map((ageGroup) => (
                    <div
                      key={ageGroup}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        form.watch("ageGroups")?.includes(ageGroup)
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleAgeGroup(ageGroup)}
                    >
                      <span className="text-sm font-medium">{ageGroup}</span>
                    </div>
                  ))}
                </div>
                {form.formState.errors.ageGroups && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.ageGroups.message}
                  </p>
                )}
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
                Availability & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Set your general availability. You can always update this later.
              </p>
              
              {daysOfWeek.map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={form.watch(`availability.${day}.available`)}
                        onCheckedChange={(checked) => 
                          form.setValue(`availability.${day}.available`, checked as boolean)
                        }
                      />
                      <Label htmlFor={day} className="font-medium capitalize">
                        {day}
                      </Label>
                    </div>
                  </div>
                  
                  {form.watch(`availability.${day}.available`) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Start Time</Label>
                        <Select
                          value={form.watch(`availability.${day}.start`)}
                          onValueChange={(value) => 
                            form.setValue(`availability.${day}.start`, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">End Time</Label>
                        <Select
                          value={form.watch(`availability.${day}.end`)}
                          onValueChange={(value) => 
                            form.setValue(`availability.${day}.end`, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification & Background Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Why We Verify Caregivers</h4>
                <p className="text-sm text-blue-800">
                  We conduct thorough background checks to ensure the safety and peace of mind 
                  for families using our platform. This includes identity verification, 
                  police checks, and reference validation.
                </p>
              </div>

              {/* Working with Children Check */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWWCC"
                    {...form.register("hasWWCC")}
                  />
                  <Label htmlFor="hasWWCC" className="font-medium">
                    I have a Working with Children Check (WWCC)
                  </Label>
                </div>
                
                {form.watch("hasWWCC") && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label htmlFor="wwccNumber">WWCC Number</Label>
                      <Input
                        id="wwccNumber"
                        {...form.register("wwccNumber")}
                        placeholder="Enter WWCC number"
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

              {/* First Aid */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFirstAid"
                    {...form.register("hasFirstAid")}
                  />
                  <Label htmlFor="hasFirstAid" className="font-medium">
                    I have a Current First Aid Certificate (optional but beneficial)
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

              {/* Police Check */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPoliceCheck"
                    {...form.register("hasPoliceCheck")}
                  />
                  <Label htmlFor="hasPoliceCheck" className="font-medium">
                    I have a Current Police Check
                  </Label>
                </div>
                
                {form.watch("hasPoliceCheck") && (
                  <div className="ml-6">
                    <Label htmlFor="policeCheckDate">Issue Date</Label>
                    <Input
                      id="policeCheckDate"
                      type="date"
                      {...form.register("policeCheckDate")}
                    />
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h4 className="font-medium">Emergency Contact</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Full Name *</Label>
                    <Input
                      id="emergencyName"
                      {...form.register("emergencyName")}
                      placeholder="Emergency contact name"
                    />
                    {form.formState.errors.emergencyName && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.emergencyName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyPhone">Phone Number *</Label>
                    <Input
                      id="emergencyPhone"
                      {...form.register("emergencyPhone")}
                      placeholder="Emergency contact phone"
                    />
                    {form.formState.errors.emergencyPhone && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.emergencyPhone.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="emergencyRelation">Relationship *</Label>
                  <Input
                    id="emergencyRelation"
                    {...form.register("emergencyRelation")}
                    placeholder="e.g., Partner, Parent, Sibling"
                  />
                  {form.formState.errors.emergencyRelation && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.emergencyRelation.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    {...form.register("agreeToTerms")}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms-of-service" className="text-orange-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy-policy" className="text-orange-600 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.agreeToTerms.message}
                  </p>
                )}
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToBackgroundCheck"
                    {...form.register("agreeToBackgroundCheck")}
                  />
                  <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
                    I consent to background checks and verification processes
                  </Label>
                </div>
                {form.formState.errors.agreeToBackgroundCheck && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.agreeToBackgroundCheck.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for joining VIVALY as a caregiver. We're reviewing your application 
                and will notify you within 1-2 business days.
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
      ] as const;

      const isValid = await form.trigger(requiredFields as any);

      if (!isValid) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in all required information before continuing.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 2) {
      const requiredFields = ["bio", "yearsExperience", "hourlyRate"] as const;
      const isValid = await form.trigger(requiredFields as any);
      
      const hasServices = form.watch("services")?.length > 0;
      const hasAgeGroups = form.watch("ageGroups")?.length > 0;
      const bioLength = form.watch("bio")?.length >= 50;

      if (!isValid || !hasServices || !hasAgeGroups || !bioLength) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in your bio (50+ characters), select services, and age groups.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 3) {
      const hasAvailability = daysOfWeek.some(day => form.watch(`availability.${day}.available` as any));
      if (!hasAvailability) {
        toast({
          title: "Please set your availability",
          description: "Select at least one day when you're available.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 4) {
      const requiredFields = ["emergencyName", "emergencyPhone", "emergencyRelation"] as const;
      const isValid = await form.trigger(requiredFields as any);
      const hasAgreements = form.watch("agreeToTerms") && form.watch("agreeToBackgroundCheck");

      if (!isValid || !hasAgreements) {
        toast({
          title: "Please complete all required fields",
          description: "Fill in emergency contact details and agree to terms.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, 4));
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

        {step < 5 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={() => step === 4 ? handleSubmit() : nextStep()}
              disabled={step === 4 && registrationMutation.isPending}
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
      </div>
    </div>
  );
}