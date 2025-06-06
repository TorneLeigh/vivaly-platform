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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
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
  Footprints
} from "lucide-react";

const parentProfileSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  suburb: z.string().min(2, "Please enter your suburb"),
  
  // Family Information
  familySize: z.string(),
  numberOfChildren: z.string(),
  childrenAges: z.array(z.string()),
  
  // Detailed Children Information
  childrenNames: z.array(z.string()).default([]),
  childrenGenders: z.array(z.string()).default([]),
  childrenPersonalities: z.array(z.string()).default([]),
  childrenInterests: z.array(z.string()).default([]),
  childrenBehavioralNotes: z.array(z.string()).default([]),
  napSchedules: z.array(z.string()).default([]),
  mealPreferences: z.array(z.string()).default([]),
  pottyTrainingStatus: z.array(z.string()).default([]),
  schoolSchedules: z.array(z.string()).default([]),
  extracurricularActivities: z.array(z.string()).default([]),
  bedtimeRoutines: z.array(z.string()).default([]),
  comfortItems: z.array(z.string()).default([]),
  favoriteActivities: z.array(z.string()).default([]),
  
  // Health & Allergies
  foodAllergies: z.array(z.string()),
  environmentalAllergies: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()),
  medicationRequirements: z.string().optional(),
  medicalConditions: z.array(z.string()).default([]),
  doctorContactInfo: z.string().optional(),
  hospitalPreference: z.string().optional(),
  
  // Emergency Contacts
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  emergencyContactRelation: z.string(),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),
  emergencyContact2Relation: z.string().optional(),
  
  // Elderly Care Information
  elderlyInHome: z.boolean().default(false),
  elderlyName: z.string().optional(),
  elderlyAge: z.number().optional(),
  elderlyRelationship: z.string().optional(),
  elderlyMedicalConditions: z.array(z.string()).default([]),
  elderlyMedicationSchedule: z.string().optional(),
  elderlyMobilityNeeds: z.string().optional(),
  elderlyCarePreferences: z.string().optional(),
  elderlyDoctorInfo: z.string().optional(),
  elderlyDietaryNeeds: z.string().optional(),
  elderlyPersonalityNotes: z.string().optional(),
  elderlyPreferredActivities: z.array(z.string()).default([]),
  elderlyEmergencyInfo: z.string().optional(),
  
  // Pet Care Information
  petsInHome: z.array(z.string()),
  petNames: z.array(z.string()).default([]),
  petTypes: z.array(z.string()).default([]),
  petBreeds: z.array(z.string()).default([]),
  petAges: z.array(z.string()).default([]),
  petPersonalities: z.array(z.string()).default([]),
  petMedicalNeeds: z.array(z.string()).default([]),
  petFeedingSchedule: z.string().optional(),
  petWalkingRequirements: z.string().optional(),
  petGroomingNeeds: z.string().optional(),
  vetContactInfo: z.string().optional(),
  petEmergencyInfo: z.string().optional(),
  petBehavioralNotes: z.string().optional(),
  petPreferredTreats: z.array(z.string()).default([]),
  
  // Caregiver Preferences
  preferredCaregiverGender: z.string().optional(),
  languagePreferences: z.array(z.string()),
  caregiverExperienceLevel: z.string(),
  specialSkillsRequired: z.array(z.string()),
  
  // Care Requirements
  typicalCareHours: z.string(),
  careFrequency: z.string(),
  transportationNeeds: z.string().optional(),
  householdChores: z.boolean().default(false),
  
  // Household Rules & Preferences
  smokingPolicy: z.string(),
  screenTimePolicy: z.string(),
  disciplineStyle: z.string(),
  outdoorActivities: z.boolean(),
  
  // Safety & Verification
  backgroundCheckRequired: z.boolean(),
  referencesRequired: z.boolean(),
  
  // Additional Information
  specialInstructions: z.string().optional(),
  familyValues: z.string().optional(),
  communicationPreferences: z.string().default("text"),
});

type ParentProfileForm = z.infer<typeof parentProfileSchema>;

const foodAllergyOptions = [
  "Nuts", "Peanuts", "Shellfish", "Fish", "Eggs", "Dairy", "Soy", "Wheat/Gluten", 
  "Sesame", "Tree Nuts", "Kiwi", "Strawberries", "Chocolate", "Food Coloring", "None"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Dairy-Free", 
  "Sugar-Free", "Organic Only", "No Processed Foods", "None"
];

const languageOptions = [
  "English", "Mandarin", "Arabic", "Vietnamese", "Greek", "Italian", "Spanish", 
  "French", "German", "Hindi", "Tagalog", "Korean", "Japanese", "Other"
];

const specialSkillsOptions = [
  "First Aid Certified", "CPR Certified", "Early Childhood Education", 
  "Special Needs Experience", "Newborn Care", "Toddler Development", 
  "School Age Care", "Tutoring", "Music/Arts", "Swimming", "Cooking", "Driving License"
];

const petOptions = [
  "Dogs", "Cats", "Birds", "Fish", "Rabbits", "Guinea Pigs", "Reptiles", "None"
];

export default function ParentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ParentProfileForm>({
    resolver: zodResolver(parentProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      suburb: "",
      familySize: "2-3",
      numberOfChildren: "1",
      childrenAges: [],
      // Detailed Children Information
      childrenNames: [],
      childrenGenders: [],
      childrenPersonalities: [],
      childrenInterests: [],
      childrenBehavioralNotes: [],
      napSchedules: [],
      mealPreferences: [],
      pottyTrainingStatus: [],
      schoolSchedules: [],
      extracurricularActivities: [],
      bedtimeRoutines: [],
      comfortItems: [],
      favoriteActivities: [],
      // Health & Allergies
      foodAllergies: [],
      environmentalAllergies: [],
      dietaryRestrictions: [],
      medicationRequirements: "",
      medicalConditions: [],
      doctorContactInfo: "",
      hospitalPreference: "",
      // Emergency Contacts
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      emergencyContact2Name: "",
      emergencyContact2Phone: "",
      emergencyContact2Relation: "",
      // Elderly Care Information
      elderlyInHome: false,
      elderlyName: "",
      elderlyAge: undefined,
      elderlyRelationship: "",
      elderlyMedicalConditions: [],
      elderlyMedicationSchedule: "",
      elderlyMobilityNeeds: "",
      elderlyCarePreferences: "",
      elderlyDoctorInfo: "",
      elderlyDietaryNeeds: "",
      elderlyPersonalityNotes: "",
      elderlyPreferredActivities: [],
      elderlyEmergencyInfo: "",
      // Pet Care Information
      petsInHome: [],
      petNames: [],
      petTypes: [],
      petBreeds: [],
      petAges: [],
      petPersonalities: [],
      petMedicalNeeds: [],
      petFeedingSchedule: "",
      petWalkingRequirements: "",
      petGroomingNeeds: "",
      vetContactInfo: "",
      petEmergencyInfo: "",
      petBehavioralNotes: "",
      petPreferredTreats: [],
      // Caregiver Preferences
      preferredCaregiverGender: "no-preference",
      languagePreferences: ["English"],
      caregiverExperienceLevel: "experienced",
      specialSkillsRequired: [],
      // Care Requirements
      typicalCareHours: "full-day",
      careFrequency: "regular",
      transportationNeeds: "",
      householdChores: false,
      // Household Rules & Preferences
      smokingPolicy: "no-smoking",
      screenTimePolicy: "limited",
      disciplineStyle: "gentle",
      outdoorActivities: true,
      // Safety & Verification
      backgroundCheckRequired: true,
      referencesRequired: true,
      // Additional Information
      specialInstructions: "",
      familyValues: "",
      communicationPreferences: "text",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ParentProfileForm) => {
      const response = await apiRequest("POST", "/api/parent-profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your parent profile has been saved successfully.",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ParentProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "family", label: "Family & Children", icon: Users },
    { id: "children", label: "Children Details", icon: Baby },
    { id: "health", label: "Health & Medical", icon: Heart },
    { id: "elderly", label: "Elderly Care", icon: User },
    { id: "pets", label: "Pet Care", icon: Footprints },
    { id: "caregiver", label: "Caregiver Preferences", icon: Star },
    { id: "household", label: "Household Rules", icon: Home },
    { id: "safety", label: "Safety & Emergency", icon: Shield },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Profile</h1>
              <p className="text-gray-600 mt-1">Complete your profile to find the perfect caregiver</p>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-black hover:bg-gray-800 text-white">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isPending}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                {activeSection === "basic" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" disabled={!isEditing} />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="0412 345 678" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Home Address</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="123 Main Street, Sydney NSW 2000" />
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
                              <Input {...field} disabled={!isEditing} placeholder="Bondi Beach" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Family Information */}
                {activeSection === "family" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Family Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="familySize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Family Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select family size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="2-3">2-3 people</SelectItem>
                                  <SelectItem value="4-5">4-5 people</SelectItem>
                                  <SelectItem value="6+">6+ people</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="numberOfChildren"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Children</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select number" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 child</SelectItem>
                                  <SelectItem value="2">2 children</SelectItem>
                                  <SelectItem value="3">3 children</SelectItem>
                                  <SelectItem value="4+">4+ children</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="childrenAges"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Children's Ages</FormLabel>
                            <div className="grid grid-cols-6 gap-2">
                              {["0-1", "2-3", "4-5", "6-8", "9-12", "13+"].map((age) => (
                                <div key={age} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={age}
                                    checked={field.value?.includes(age)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, age]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== age));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={age} className="text-sm">{age}</label>
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

                {/* Children Details Section */}
                {activeSection === "children" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Baby className="h-5 w-5 mr-2" />
                        Detailed Children Information
                      </CardTitle>
                      <p className="text-sm text-gray-600">Help caregivers understand your children better</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="childrenNames"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Children's Names</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  value={field.value?.join(", ") || ""} 
                                  onChange={(e) => field.onChange(e.target.value.split(", ").filter(n => n.trim()))}
                                  placeholder="Emma, Jack, etc." 
                                  disabled={!isEditing} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="childrenGenders"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Children's Genders</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  value={field.value?.join(", ") || ""} 
                                  onChange={(e) => field.onChange(e.target.value.split(", ").filter(g => g.trim()))}
                                  placeholder="Girl, Boy, etc." 
                                  disabled={!isEditing} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="childrenPersonalities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Children's Personalities</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                value={field.value?.join("; ") || ""} 
                                onChange={(e) => field.onChange(e.target.value.split("; ").filter(p => p.trim()))}
                                placeholder="Emma is outgoing and loves books; Jack is energetic and loves building" 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="childrenInterests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Children's Interests & Hobbies</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                value={field.value?.join("; ") || ""} 
                                onChange={(e) => field.onChange(e.target.value.split("; ").filter(i => i.trim()))}
                                placeholder="Drawing, soccer, music, reading, etc." 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bedtimeRoutines"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bedtime Routines</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  value={field.value?.join("; ") || ""} 
                                  onChange={(e) => field.onChange(e.target.value.split("; ").filter(r => r.trim()))}
                                  placeholder="Story time at 7:30pm; Brush teeth; Lullaby" 
                                  disabled={!isEditing} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="napSchedules"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nap Schedules</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  value={field.value?.join("; ") || ""} 
                                  onChange={(e) => field.onChange(e.target.value.split("; ").filter(n => n.trim()))}
                                  placeholder="Emma: 1pm-3pm; Jack: No naps" 
                                  disabled={!isEditing} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="mealPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meal Preferences & Eating Habits</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                value={field.value?.join("; ") || ""} 
                                onChange={(e) => field.onChange(e.target.value.split("; ").filter(m => m.trim()))}
                                placeholder="Emma loves sandwiches; Jack prefers pasta; No spicy food" 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="childrenBehavioralNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Behavioral Notes & Special Considerations</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                value={field.value?.join("; ") || ""} 
                                onChange={(e) => field.onChange(e.target.value.split("; ").filter(b => b.trim()))}
                                placeholder="Emma gets shy with new people; Jack needs reminders for transitions" 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Elderly Care Section */}
                {activeSection === "elderly" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Elderly Care Information
                      </CardTitle>
                      <p className="text-sm text-gray-600">Information about elderly family members who may need care</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="elderlyInHome"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormLabel className="text-sm">We have elderly family members who may need care</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("elderlyInHome") && (
                        <>
                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="elderlyName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Grandma Rose" disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="elderlyAge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Age</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      type="number"
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                      placeholder="75" 
                                      disabled={!isEditing} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="elderlyRelationship"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Relationship</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Grandmother" disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="elderlyMedicalConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Medical Conditions</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    value={field.value?.join("; ") || ""} 
                                    onChange={(e) => field.onChange(e.target.value.split("; ").filter(c => c.trim()))}
                                    placeholder="Diabetes; Arthritis; High blood pressure" 
                                    disabled={!isEditing} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="elderlyMobilityNeeds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobility & Physical Needs</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Uses walker; Needs help with stairs; Independent" 
                                    disabled={!isEditing} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="elderlyCarePreferences"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Care Preferences & Daily Routine</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Enjoys gardening; Prefers quiet activities; Likes afternoon tea at 3pm" 
                                    disabled={!isEditing} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Pet Care Section */}
                {activeSection === "pets" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Footprints className="h-5 w-5 mr-2" />
                        Pet Care Information
                      </CardTitle>
                      <p className="text-sm text-gray-600">Information about pets that caregivers should know about</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="petsInHome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Pets in Home</FormLabel>
                            <div className="grid grid-cols-4 gap-3">
                              {petOptions.map((pet) => (
                                <div key={pet} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={pet}
                                    checked={field.value?.includes(pet)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, pet]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== pet));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={pet} className="text-sm">{pet}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("petsInHome")?.length > 0 && !form.watch("petsInHome")?.includes("None") && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="petNames"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pet Names</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      value={field.value?.join(", ") || ""} 
                                      onChange={(e) => field.onChange(e.target.value.split(", ").filter(n => n.trim()))}
                                      placeholder="Buddy, Whiskers, etc." 
                                      disabled={!isEditing} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="petBreeds"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pet Breeds</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      value={field.value?.join(", ") || ""} 
                                      onChange={(e) => field.onChange(e.target.value.split(", ").filter(b => b.trim()))}
                                      placeholder="Golden Retriever, Persian Cat" 
                                      disabled={!isEditing} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="petPersonalities"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pet Personalities & Behavior</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    value={field.value?.join("; ") || ""} 
                                    onChange={(e) => field.onChange(e.target.value.split("; ").filter(p => p.trim()))}
                                    placeholder="Buddy is friendly and energetic; Whiskers is calm and likes to hide" 
                                    disabled={!isEditing} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="petFeedingSchedule"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Feeding Schedule</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Buddy: 7am and 6pm; Whiskers: 8am and 7pm" 
                                      disabled={!isEditing} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="petWalkingRequirements"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Walking & Exercise Needs</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Buddy needs 2 walks per day; Whiskers is indoor only" 
                                      disabled={!isEditing} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="petMedicalNeeds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Medical Needs & Special Care</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    value={field.value?.join("; ") || ""} 
                                    onChange={(e) => field.onChange(e.target.value.split("; ").filter(m => m.trim()))}
                                    placeholder="Buddy takes arthritis medication; Whiskers has no special needs" 
                                    disabled={!isEditing} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Health & Allergies */}
                {activeSection === "health" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Health & Allergies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="foodAllergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Food Allergies</FormLabel>
                            <div className="grid grid-cols-3 gap-3">
                              {foodAllergyOptions.map((allergy) => (
                                <div key={allergy} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={allergy}
                                    checked={field.value?.includes(allergy)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, allergy]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== allergy));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={allergy} className="text-sm">{allergy}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="dietaryRestrictions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Dietary Restrictions</FormLabel>
                            <div className="grid grid-cols-3 gap-3">
                              {dietaryOptions.map((diet) => (
                                <div key={diet} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={diet}
                                    checked={field.value?.includes(diet)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, diet]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== diet));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={diet} className="text-sm">{diet}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medicationRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                disabled={!isEditing}
                                placeholder="List any medications your children take and administration instructions..."
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

                {/* Caregiver Preferences */}
                {activeSection === "caregiver" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Caregiver Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="preferredCaregiverGender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select preference" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="no-preference">No Preference</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="male">Male</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="caregiverExperienceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level Required</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="entry-level">Entry Level (1-2 years)</SelectItem>
                                  <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="languagePreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language Preferences</FormLabel>
                            <div className="grid grid-cols-4 gap-3">
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

                      <FormField
                        control={form.control}
                        name="specialSkillsRequired"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Skills Required</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                              {specialSkillsOptions.map((skill) => (
                                <div key={skill} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={skill}
                                    checked={field.value?.includes(skill)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, skill]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== skill));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={skill} className="text-sm">{skill}</label>
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

                {/* Household Rules */}
                {activeSection === "household" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Household Rules & Environment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="smokingPolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Smoking Policy</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="no-smoking">No Smoking</SelectItem>
                                  <SelectItem value="outdoor-only">Outdoor Only</SelectItem>
                                  <SelectItem value="smoking-ok">Smoking OK</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="screenTimePolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Screen Time Policy</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="no-screens">No Screens</SelectItem>
                                  <SelectItem value="limited">Limited (1-2 hours)</SelectItem>
                                  <SelectItem value="moderate">Moderate (2-4 hours)</SelectItem>
                                  <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="disciplineStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discipline Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gentle">Gentle Guidance</SelectItem>
                                <SelectItem value="firm-but-fair">Firm but Fair</SelectItem>
                                <SelectItem value="permissive">Permissive</SelectItem>
                                <SelectItem value="structured">Structured</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="petsInHome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pets in Home</FormLabel>
                            <div className="grid grid-cols-4 gap-3">
                              {petOptions.map((pet) => (
                                <div key={pet} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={pet}
                                    checked={field.value?.includes(pet)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, pet]);
                                      } else {
                                        field.onChange(field.value?.filter((v) => v !== pet));
                                      }
                                    }}
                                    disabled={!isEditing}
                                  />
                                  <label htmlFor={pet} className="text-sm">{pet}</label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="outdoorActivities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Outdoor Activities Encouraged
                              </FormLabel>
                              <p className="text-sm text-gray-600">
                                We encourage outdoor play and activities
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Safety & Emergency */}
                {activeSection === "safety" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Safety & Emergency Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="Full name" />
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
                                <Input {...field} disabled={!isEditing} placeholder="0412 345 678" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="e.g., Grandmother" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="backgroundCheckRequired"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Background Check Required
                                </FormLabel>
                                <p className="text-sm text-gray-600">
                                  Require caregivers to have a current background check
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="referencesRequired"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  References Required
                                </FormLabel>
                                <p className="text-sm text-gray-600">
                                  Require caregivers to provide references from previous families
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                disabled={!isEditing}
                                placeholder="Any additional information caregivers should know about your family, children, or home..."
                                rows={4}
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
    </div>
  );
}