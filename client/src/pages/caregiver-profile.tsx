import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { calculateCompletion } from "@/lib/profileCompletion";
import ReferralPopup from "@/components/ReferralPopup";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Baby, 
  Heart, 
  Shield, 
  Clock,
  AlertTriangle,
  Users,
  Home,
  Star,
  CheckCircle,
  Award,
  BookOpen,
  Car,
  Briefcase,
  Calendar,
  DollarSign,
  Plus
} from "lucide-react";

const caregiverProfileSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  // email and phone are private - only shown after booking confirmation
  address: z.string().min(5, "Address must be at least 5 characters"),
  suburb: z.string().min(2, "Suburb must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  profilePhoto: z.string().optional(),
  
  // Professional Bio
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  introVideo: z.string().optional(),
  yearsOfExperience: z.string().default("1-2"),
  hourlyRate: z.string().optional(),
  availability: z.array(z.string()).default([]),
  
  // Qualifications & Certifications
  hasWWCC: z.boolean().default(false),
  hasPoliceCheck: z.boolean().default(false),
  hasFirstAid: z.boolean().default(false),
  hasPaediatricCPR: z.boolean().default(false),
  hasDriversLicense: z.boolean().default(false),
  hasOwnCar: z.boolean().default(false),
  isNonSmoker: z.boolean().default(true),
  certifications: z.array(z.string()).default([]),
  
  // Age Group Experience
  experienceWithNewborns: z.boolean().default(false),
  experienceWithInfants: z.boolean().default(false),
  experienceWithToddlers: z.boolean().default(false),
  experienceWithSchoolAge: z.boolean().default(false),
  experienceWithTeenagers: z.boolean().default(false),
  
  // Specialized Care Services
  maternityNurseServices: z.boolean().default(false),
  nightNannyServices: z.boolean().default(false),
  sleepTrainingExpertise: z.boolean().default(false),
  evidenceBasedCare: z.boolean().default(false),
  specialNeedsExperience: z.boolean().default(false),
  
  // Care Services Offered
  childSupervision: z.boolean().default(true),
  schoolPickupDropoff: z.boolean().default(false),
  afterSchoolActivities: z.boolean().default(false),
  mealPreparation: z.boolean().default(false),
  lightHousework: z.boolean().default(false),
  laundryHelp: z.boolean().default(false),
  lunchboxPrep: z.boolean().default(false),
  bathTimeAssistance: z.boolean().default(false),
  bedtimeRoutines: z.boolean().default(false),
  homeworkSupport: z.boolean().default(false),
  creativePlay: z.boolean().default(true),
  developmentalActivities: z.boolean().default(false),
  overnightCare: z.boolean().default(false),
  weekendCare: z.boolean().default(false),
  emergencyCare: z.boolean().default(false),
  
  // Additional Skills
  languagesSpoken: z.array(z.string()).default(["English"]),
  musicSkills: z.boolean().default(false),
  artsCraftsSkills: z.boolean().default(false),
  swimmingSkills: z.boolean().default(false),
  cookingSkills: z.boolean().default(false),
  tutoring: z.boolean().default(false),
  petCare: z.boolean().default(false),
  
  // Availability & Preferences
  availableDays: z.array(z.string()).default([]),
  preferredStartTime: z.string().optional(),
  preferredEndTime: z.string().optional(),
  minimumHours: z.string().optional(),
  maximumHours: z.string().optional(),
  longTermPositions: z.boolean().default(true),
  shortTermPositions: z.boolean().default(true),
  adhocBookings: z.boolean().default(true),
  
  // References
  hasReferences: z.boolean().default(false),
  referenceCount: z.string().default("3"),
  referenceDetails: z.string().optional(),
  
  // Emergency Information
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  
  // Additional Information
  specialInstructions: z.string().optional(),
  personalityDescription: z.string().optional(),
  approach: z.string().optional(),
  
  // Personal Touch Questions
  myLoveLanguage: z.string().optional(),
  littleAboutMe: z.string().optional(),
  imProudOf: z.string().optional(),
  whatMakesMe: z.string().optional(),
  mySuperpowerIs: z.string().optional(),
  onePerfectDay: z.string().optional(),
});

type CaregiverProfileForm = z.infer<typeof caregiverProfileSchema>;

const experienceOptions = [
  "Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "Over 10 years"
];

const certificationOptions = [
  "First Aid Certified", "CPR Certified (Paediatric)", "Early Childhood Education", 
  "Cert III Childcare", "Maternity Nurse", "Night Nanny", "Sleep Training", 
  "Evidence-based Newborn Care", "Developmental Support", "Special Needs Experience", 
  "Montessori", "Blue Card Verified", "Driving License", "Swimming Instructor",
  "Music Teacher", "Art Therapy", "Cooking Certification"
];

const languageOptions = [
  "English", "Mandarin", "Arabic", "Vietnamese", "Greek", "Italian", "Spanish", 
  "French", "German", "Hindi", "Tagalog", "Korean", "Japanese", "Other"
];

export default function CaregiverProfile() {
  const [activeSection, setActiveSection] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CaregiverProfileForm>({
    resolver: zodResolver(caregiverProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      // Contact info removed for privacy
      address: "",
      suburb: "",
      dateOfBirth: "",
      profilePhoto: "",
      bio: "",
      introVideo: "",
      yearsOfExperience: "1-2",
      hourlyRate: "",
      availability: [],
      // Qualifications
      hasWWCC: false,
      hasPoliceCheck: false,
      hasFirstAid: false,
      hasPaediatricCPR: false,
      hasDriversLicense: false,
      hasOwnCar: false,
      isNonSmoker: true,
      certifications: [],
      // Experience
      experienceWithNewborns: false,
      experienceWithInfants: false,
      experienceWithToddlers: false,
      experienceWithSchoolAge: false,
      experienceWithTeenagers: false,
      // Specialized Services
      maternityNurseServices: false,
      nightNannyServices: false,
      sleepTrainingExpertise: false,
      evidenceBasedCare: false,
      specialNeedsExperience: false,
      // Services Offered
      childSupervision: true,
      schoolPickupDropoff: false,
      afterSchoolActivities: false,
      mealPreparation: false,
      lightHousework: false,
      laundryHelp: false,
      lunchboxPrep: false,
      bathTimeAssistance: false,
      bedtimeRoutines: false,
      homeworkSupport: false,
      creativePlay: true,
      developmentalActivities: false,
      overnightCare: false,
      weekendCare: false,
      emergencyCare: false,
      // Additional Skills
      languagesSpoken: ["English"],
      musicSkills: false,
      artsCraftsSkills: false,
      swimmingSkills: false,
      cookingSkills: false,
      tutoring: false,
      petCare: false,
      // Availability
      availableDays: [],
      preferredStartTime: "",
      preferredEndTime: "",
      minimumHours: "",
      maximumHours: "",
      longTermPositions: true,
      shortTermPositions: true,
      adhocBookings: true,
      // References
      hasReferences: false,
      referenceCount: "3",
      referenceDetails: "",
      // Emergency
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      // Additional
      specialInstructions: "",
      personalityDescription: "",
      approach: "",
      // Personal Touch
      myLoveLanguage: "",
      littleAboutMe: "",
      imProudOf: "",
      whatMakesMe: "",
      mySuperpowerIs: "",
      onePerfectDay: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: CaregiverProfileForm) => {
      const response = await apiRequest("POST", "/api/caregiver-profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your caregiver profile has been saved successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch caregiver's job applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['/api/applications/my'],
    queryFn: () => apiRequest('GET', '/api/applications/my'),
    enabled: !!user
  });

  const onSubmit = (data: CaregiverProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 60 * 1024 * 1024) { // 60MB limit
      toast({
        title: "File Too Large",
        description: "Video must be under 60MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload-intro-video", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      // Update the form with the video URL
      form.setValue("introVideo", result.url);
      
      toast({
        title: "Success",
        description: "Intro video uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "qualifications", label: "Qualifications", icon: Award },
    { id: "experience", label: "Experience", icon: BookOpen },
    { id: "services", label: "Services Offered", icon: Star },
    { id: "specialized", label: "Specialized Care", icon: Heart },
    { id: "skills", label: "Additional Skills", icon: CheckCircle },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "references", label: "References", icon: Users },
    { id: "applications", label: "Job Applications", icon: Briefcase },
    { id: "personal", label: "Personal Touch", icon: Heart },
    { id: "emergency", label: "Emergency Contact", icon: Shield },
  ];

  // Temporarily bypass auth for demo
  const tempUser = user || { firstName: "Demo", lastName: "Caregiver", email: "caregiver@example.com" };

  // Calculate profile completion
  const currentProfile = form.getValues();
  const completionPercentage = calculateCompletion(currentProfile, 'caregiver');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Caregiver Profile</h1>
              <p className="text-gray-600 mt-1">Showcase your experience and connect with families</p>
              
              {/* Profile Completion */}
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                {completionPercentage < 100 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Complete your profile to attract more families
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={() => form.handleSubmit(onSubmit)()} 
                    disabled={updateProfileMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Profile Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Information Section */}
                {activeSection === "basic" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
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
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Contact information privacy protection */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Privacy Protected:</strong> Your contact details are kept private and only shared with confirmed, paid bookings for security.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
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
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Hi families! I'm Lia, and I'm offering my services as a nanny / mom's helper. I have loads of experience and I'm currently working as a part time nanny..."
                                disabled={!isEditing}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Intro Video Upload */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Intro Video (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          {form.watch("introVideo") ? (
                            <div className="space-y-4">
                              <video 
                                src={form.watch("introVideo")} 
                                controls 
                                className="w-full max-w-md h-48 object-cover rounded-lg"
                              />
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => form.setValue("introVideo", "")}
                                  disabled={!isEditing}
                                >
                                  Remove Video
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-gray-600 mb-2">Upload an intro video to showcase your personality</p>
                                <p className="text-sm text-gray-500">MP4, MOV up to 60MB</p>
                              </div>
                              <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && isEditing) {
                                    handleVideoUpload(file);
                                  }
                                }}
                                disabled={!isEditing || uploading}
                                className="hidden"
                                id="video-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("video-upload")?.click()}
                                disabled={!isEditing || uploading}
                              >
                                {uploading ? "Uploading..." : "Choose Video"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="yearsOfExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {experienceOptions.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hourlyRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hourly Rate (AUD)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="25" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          type="button"
                          onClick={() => handleSectionSave('basic')}
                          disabled={sectionSaveMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {sectionSaveMutation.isPending ? "Saving..." : "Save Basic Info"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Qualifications Section */}
                {activeSection === "qualifications" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Qualifications & Certifications
                      </CardTitle>
                      <p className="text-sm text-gray-600">Australian childcare qualifications and safety certifications</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">Safety Certifications (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="hasWWCC"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium">Working with Children Check (WWCC)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasPoliceCheck"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium">Police Check Verified</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasFirstAid"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">First Aid Certified - Optional</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasPaediatricCPR"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">CPR Certified (Paediatric) - Optional</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isNonSmoker"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium">Non-smoker</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3">Transport & Mobility</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="hasDriversLicense"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Valid Driver's License</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasOwnCar"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Own reliable car</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Additional Certifications</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {certificationOptions.map((cert) => (
                                <div key={cert} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={cert}
                                    checked={field.value?.includes(cert)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, cert]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== cert));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={cert} className="text-sm">{cert}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Experience Section */}
                {activeSection === "experience" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Age Group Experience
                      </CardTitle>
                      <p className="text-sm text-gray-600">What age groups do you have experience caring for?</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-3">Age Group Experience</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="experienceWithNewborns"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Newborn experience (0-3 months)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experienceWithInfants"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Infant experience (3-12 months)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experienceWithToddlers"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Toddler experience (1-3 years)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experienceWithSchoolAge"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">School-age children (4-12 years)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experienceWithTeenagers"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Teenagers (13+ years)</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Specialized Care Section */}
                {activeSection === "specialized" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Specialized Care Services
                      </CardTitle>
                      <p className="text-sm text-gray-600">Professional care services based on your market research</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-pink-900 mb-3">Specialized Newborn & Infant Care</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="maternityNurseServices"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Maternity nurse services</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="nightNannyServices"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Night nanny services</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="sleepTrainingExpertise"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Sleep training expertise</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="evidenceBasedCare"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Evidence-based newborn care</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="specialNeedsExperience"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Special needs experience</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          type="button"
                          onClick={() => handleSectionSave('experience')}
                          disabled={sectionSaveMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {sectionSaveMutation.isPending ? "Saving..." : "Save Experience"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Services Offered Section */}
                {activeSection === "services" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Services I Offer
                      </CardTitle>
                      <p className="text-sm text-gray-600">What services can you provide to families?</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">Child Care & Supervision</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="childSupervision"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">General child supervision</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="creativePlay"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Creative play & engagement</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="developmentalActivities"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Developmental activities</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bathTimeAssistance"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Bath time assistance</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bedtimeRoutines"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Bedtime routines</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3">Transportation & Activities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="schoolPickupDropoff"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">School pickup and drop-off</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="afterSchoolActivities"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">After-school activities transport</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="homeworkSupport"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Homework support</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-3">Household Support</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="mealPreparation"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Meal preparation</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lunchboxPrep"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Lunchbox preparation</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lightHousework"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Light housework</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="laundryHelp"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Laundry assistance</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-3">Extended Care Options</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="overnightCare"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Overnight care available</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="weekendCare"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Weekend care available</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="emergencyCare"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Emergency/adhoc care</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Skills Section */}
                {activeSection === "skills" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Additional Skills & Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="languagesSpoken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Languages Spoken</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {languageOptions.map((language) => (
                                <div key={language} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={language}
                                    checked={field.value?.includes(language)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, language]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== language));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={language} className="text-sm">{language}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Special Skills</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="musicSkills"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Music & instrument skills</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="artsCraftsSkills"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Arts & crafts</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="swimmingSkills"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Swimming instructor</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cookingSkills"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Cooking skills</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="tutoring"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Tutoring & homework help</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="petCare"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Pet care experience</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          type="button"
                          onClick={() => handleSectionSave('skills')}
                          disabled={sectionSaveMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {sectionSaveMutation.isPending ? "Saving..." : "Save Skills"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Availability Section */}
                {activeSection === "availability" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Availability & Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="availableDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Available Days</FormLabel>
                            <div className="grid grid-cols-4 gap-3">
                              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <div key={day} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={day}
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, day]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== day));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={day} className="text-sm">{day}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="preferredStartTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Start Time</FormLabel>
                              <FormControl>
                                <Input {...field} type="time" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="preferredEndTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred End Time</FormLabel>
                              <FormControl>
                                <Input {...field} type="time" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="minimumHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Hours per Booking</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="3 hours" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="maximumHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Hours per Day</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="10 hours" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">Position Types Available</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="longTermPositions"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Long-term positions</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="shortTermPositions"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Short-term positions</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="adhocBookings"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">Adhoc/emergency bookings</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          type="button"
                          onClick={() => handleSectionSave('availability')}
                          disabled={sectionSaveMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {sectionSaveMutation.isPending ? "Saving..." : "Save Availability"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* References Section */}
                {activeSection === "references" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        References
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="hasReferences"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium">I have references from previous families</FormLabel>
                          </FormItem>
                        )}
                      />

                      {form.watch("hasReferences") && (
                        <>
                          <FormField
                            control={form.control}
                            name="referenceCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of References</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select number of references" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">1 reference</SelectItem>
                                    <SelectItem value="2">2 references</SelectItem>
                                    <SelectItem value="3">3 references</SelectItem>
                                    <SelectItem value="4">4+ references</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="referenceDetails"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reference Details</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Brief description of your references (e.g., worked with the Smith family for 2 years caring for twin toddlers)"
                                    disabled={!isEditing}
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          type="button"
                          onClick={() => handleSectionSave('references')}
                          disabled={sectionSaveMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {sectionSaveMutation.isPending ? "Saving..." : "Save References"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Emergency Contact Section */}
                {activeSection === "emergency" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
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
                              <FormLabel>Emergency Contact Phone</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="emergencyContactRelation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Mother, Partner, Friend" disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="personalityDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personality & Approach</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Describe your personality and approach to childcare (e.g., loving, patient, and engaging approach with organized and reliable care)"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Any additional information families should know about you or your services"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Job Applications Section */}
                {activeSection === "applications" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        My Job Applications
                      </CardTitle>
                      <p className="text-sm text-gray-600">Track your job applications and their status</p>
                    </CardHeader>
                    <CardContent>
                      {applicationsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                      ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                          <p className="text-gray-500 mb-6">Start applying to jobs to see your applications here</p>
                          <Button 
                            onClick={() => window.location.href = '/browse-jobs'}
                            className="bg-black hover:bg-gray-800"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Browse Jobs
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {applications.map((application: any) => (
                            <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Job Application</h4>
                                  <p className="text-sm text-gray-600">
                                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge 
                                  variant={
                                    application.status === 'accepted' ? 'default' : 
                                    application.status === 'rejected' ? 'destructive' : 
                                    'secondary'
                                  }
                                  className={
                                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {application.status === 'pending' ? 'Pending' :
                                   application.status === 'accepted' ? 'Accepted' :
                                   application.status === 'rejected' ? 'Not Selected' : 
                                   application.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Job ID: {application.jobId}</span>
                                </div>
                                {application.status === 'pending' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.location.href = '/browse-jobs'}
                                  >
                                    View Job
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Personal Touch Section */}
                {activeSection === "personal" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Personal Touch
                      </CardTitle>
                      <p className="text-sm text-gray-600">Help families connect with you by sharing your personality and passion for caregiving</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="myLoveLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-purple-500" />
                              My love language is...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="acts of service, quality time, words of affirmation..."
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="littleAboutMe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-500" />
                              A little about me...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Tell families what makes you special!"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imProudOf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              I'm proud of...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Share something you're proud of accomplishing"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatMakesMe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              What makes me a great caregiver is...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Share your caregiving strengths and passion"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mySuperpowerIs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-purple-500" />
                              My superpower with kids is...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="What's your special talent with children?"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="onePerfectDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-pink-500" />
                              One perfect day caring for children would be...
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Describe your ideal day with the kids you care for"
                                disabled={!isEditing}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Referral Popup */}
      {user && (
        <ReferralPopup 
          userRole="caregiver" 
          userName={user.firstName || 'User'} 
        />
      )}
    </div>
  );
}