import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  MapPin, 
  Users,
  Camera,
  Save,
  Eye,
  Home,
  Baby,
  Heart,
  Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ParentPhotoUpload from "@/components/parent-photo-upload";

const parentProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  suburb: z.string().min(2, "Suburb is required"),
  state: z.string().min(2, "State is required"),
  postcode: z.string().min(4, "Valid postcode required"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  familySize: z.string().min(1, "Please specify family size"),
  childrenAges: z.string().min(1, "Please specify children's ages"),
  careNeeds: z.array(z.string()).min(1, "Please select at least one care need"),
  emergencyContact: z.string().min(5, "Emergency contact is required"),
  specialRequirements: z.string().optional(),
});

type ParentProfileFormData = z.infer<typeof parentProfileSchema>;

const careNeedsOptions = [
  "Babysitting",
  "After school care",
  "Holiday care",
  "Weekend care",
  "Date night sitting",
  "Overnight care",
  "Special needs care",
  "Tutoring support",
  "Transportation",
  "Meal preparation"
];

const australianStates = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" }
];

export default function ParentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedCareNeeds, setSelectedCareNeeds] = useState<string[]>([]);

  const form = useForm<ParentProfileFormData>({
    resolver: zodResolver(parentProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      bio: "",
      familySize: "",
      childrenAges: "",
      careNeeds: [],
      emergencyContact: "",
      specialRequirements: "",
    },
  });

  // Fetch existing profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/parent-profile", (user as any)?.id],
    enabled: !!(user as any)?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ParentProfileFormData & { photos: string[] }) => {
      const response = await apiRequest("POST", "/api/parent-profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your parent profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/parent-profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCareNeedToggle = (careNeed: string) => {
    const updated = selectedCareNeeds.includes(careNeed)
      ? selectedCareNeeds.filter(need => need !== careNeed)
      : [...selectedCareNeeds, careNeed];
    
    setSelectedCareNeeds(updated);
    form.setValue("careNeeds", updated);
  };

  const onSubmit = (data: ParentProfileFormData) => {
    updateProfileMutation.mutate({
      ...data,
      photos,
      careNeeds: selectedCareNeeds,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Profile</h1>
              <p className="text-gray-600 mt-2">
                Complete your profile to help caregivers understand your family's needs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/profile-preview'}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View My Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="family">Family Details</TabsTrigger>
            <TabsTrigger value="preferences">Care Preferences</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          </TabsList>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
            <TabsContent value="personal" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
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
                  <Label htmlFor="lastName">Last Name *</Label>
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
                    placeholder="04XX XXX XXX"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">About Your Family *</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Tell caregivers about your family, your values, and what you're looking for in a caregiver..."
                  rows={4}
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Home Address *</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      {australianStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
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
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
          {/* Family Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Family Details & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="familySize">Family Size *</Label>
                  <Select onValueChange={(value) => form.setValue("familySize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select family size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 people</SelectItem>
                      <SelectItem value="3-4">3-4 people</SelectItem>
                      <SelectItem value="5-6">5-6 people</SelectItem>
                      <SelectItem value="7+">7+ people</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.familySize && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.familySize.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="childrenAges">Children's Ages *</Label>
                  <Input
                    id="childrenAges"
                    {...form.register("childrenAges")}
                    placeholder="e.g., 3, 7, 12 years old"
                  />
                  {form.formState.errors.childrenAges && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.childrenAges.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Household Information */}
              <div>
                <Label className="mb-3 block text-lg font-semibold">Household Information</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Pet-friendly home", "Smoke-free home", "Pool on property", "Stairs in home", "Security cameras", "Alarm system", "Garden/outdoor space", "Parking available", "Public transport nearby"].map((feature) => (
                    <div
                      key={feature}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Preferences */}
              <div>
                <Label className="mb-3 block text-lg font-semibold">Family Values & Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Religious household", "Vegetarian/Vegan meals", "Organic food only", "Screen time limits", "Outdoor activities focus", "Educational emphasis", "Multilingual environment", "Cultural traditions", "Eco-conscious family"].map((value) => (
                    <div
                      key={value}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Care Needs *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {careNeedsOptions.map((careNeed) => (
                    <div
                      key={careNeed}
                      onClick={() => handleCareNeedToggle(careNeed)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCareNeeds.includes(careNeed)
                          ? "bg-coral text-white border-coral"
                          : "bg-white border-gray-200 hover:border-coral"
                      }`}
                    >
                      <span className="text-sm font-medium">{careNeed}</span>
                    </div>
                  ))}
                </div>
                {form.formState.errors.careNeeds && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.careNeeds.message}
                  </p>
                )}
              </div>

              {/* Detailed Care Preferences */}
              <div>
                <Label className="mb-3 block">Preferred Care Schedule</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Morning", "Afternoon", "Evening", "Overnight", "Weekends", "School Hours", "Flexible", "Regular"].map((schedule) => (
                    <div
                      key={schedule}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{schedule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Care Activities Preferred</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Educational Activities", "Outdoor Play", "Arts & Crafts", "Music", "Reading", "Sports", "Swimming", "Cooking", "Homework Help"].map((activity) => (
                    <div
                      key={activity}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Caregiver Qualifications Preferred</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["First Aid Certified", "CPR Certified", "Early Childhood Education", "Working with Children Check", "References Available", "Experience with Special Needs", "Driver's License", "Non-smoker", "Pet Friendly"].map((qualification) => (
                    <div
                      key={qualification}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{qualification}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Budget Range</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["$20-25/hour", "$25-30/hour", "$30-35/hour", "$35-40/hour", "$40+/hour", "Negotiable"].map((budget) => (
                    <div
                      key={budget}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{budget}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequirements">Special Requirements & Additional Information</Label>
                <Textarea
                  id="specialRequirements"
                  {...form.register("specialRequirements")}
                  placeholder="Any special needs, allergies, dietary requirements, behavioral considerations, house rules, or specific care instructions..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
          {/* Care Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Care Preferences & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Preferred Communication Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Phone Call", "Text Message", "Email", "In-App Messaging"].map((method) => (
                    <div
                      key={method}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Language Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["English", "Mandarin", "Cantonese", "Arabic", "Hindi", "Spanish", "Italian", "Greek", "Other"].map((language) => (
                    <div
                      key={language}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{language}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Transportation Requirements</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["School Drop-off/Pick-up", "Activity Transport", "Medical Appointments", "Emergency Transport", "No Transport Needed"].map((transport) => (
                    <div
                      key={transport}
                      className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                    >
                      <span className="text-sm font-medium">{transport}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <ParentPhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={3}
          />

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Information *</Label>
                <Textarea
                  id="emergencyContact"
                  {...form.register("emergencyContact")}
                  placeholder="Name, relationship, phone number of emergency contact..."
                  rows={2}
                />
                {form.formState.errors.emergencyContact && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.emergencyContact.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Scheduling & Care Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-lg font-semibold">Typical Care Schedule Needed</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekend mornings", "Weekend afternoons", "Weekend evenings", "Overnight care", "Emergency care", "School holidays", "Flexible schedule"].map((schedule) => (
                        <div
                          key={schedule}
                          className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                        >
                          <span className="text-sm font-medium">{schedule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Profile Photos
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Add photos to help caregivers get to know your family (children's faces will be blurred automatically)
                  </p>
                </CardHeader>
                <CardContent>
                  <ParentPhotoUpload />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Emergency Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Details *</Label>
                    <Textarea
                      id="emergencyContact"
                      {...form.register("emergencyContact")}
                      placeholder="Name, relationship, phone number of emergency contact..."
                      rows={2}
                    />
                    {form.formState.errors.emergencyContact && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.emergencyContact.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/profile-preview'}
              >
                <Eye className="h-4 w-4" />
                View My Profile
              </Button>
              
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}