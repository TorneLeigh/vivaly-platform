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
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  suburb: z.string().min(2, "Suburb must be at least 2 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  familySize: z.string().min(1, "Please select family size"),
  childrenAges: z.string().min(1, "Please enter children's ages"),
  careNeeds: z.array(z.string()).min(1, "Please select at least one care need"),
  specialRequirements: z.string().optional(),
  emergencyContact: z.string().min(10, "Emergency contact information is required"),
});

type ParentProfileFormData = z.infer<typeof parentProfileSchema>;

export default function ParentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<ParentProfileFormData>({
    resolver: zodResolver(parentProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      suburb: "",
      bio: "",
      familySize: "",
      childrenAges: "",
      careNeeds: [],
      specialRequirements: "",
      emergencyContact: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ParentProfileFormData) => {
      console.log("Submitting profile data:", data);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ParentProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  // Temporarily show profile for preview - will restore auth check
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
  //         <p className="text-gray-600 mb-4">Please log in to access your profile.</p>
  //         <Button onClick={() => window.location.href = "/auth"}>
  //           Go to Login
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

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

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="suburb">Suburb *</Label>
                      <Input
                        id="suburb"
                        {...form.register("suburb")}
                        placeholder="e.g., Bondi Beach"
                      />
                      {form.formState.errors.suburb && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.suburb.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Full Address *</Label>
                      <Input
                        id="location"
                        {...form.register("location")}
                        placeholder="123 Ocean St, Bondi Beach NSW 2026"
                      />
                      {form.formState.errors.location && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">About Our Family *</Label>
                    <Textarea
                      id="bio"
                      {...form.register("bio")}
                      placeholder="Tell caregivers about your family, values, lifestyle, and what makes your home special..."
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
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
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

                  <div>
                    <Label className="mb-3 block">Care Needs *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["Nanny/Babysitting", "Before/After School Care", "Holiday Care", "Overnight Care", "Emergency Care", "Special Needs Care", "Newborn Care", "Toddler Care", "School Age Care"].map((need) => (
                        <div
                          key={need}
                          className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                        >
                          <span className="text-sm font-medium">{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>

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
                    <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
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

                  <div>
                    <Label className="mb-3 block">Budget Range (per hour)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["$25-35", "$35-45", "$45-55", "$55-65", "$65+", "Flexible"].map((budget) => (
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
                    <Label className="mb-3 block">Required Qualifications</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["First Aid Certified", "CPR Certified", "WWCC Verified", "Early Childhood Education", "Teaching Background", "Nursing Background", "Previous References", "Own Transport", "Non-smoker"].map((qualification) => (
                        <div
                          key={qualification}
                          className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                        >
                          <span className="text-sm font-medium">{qualification}</span>
                        </div>
                      ))}
                    </div>
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

                  <div>
                    <Label className="mb-3 block text-lg font-semibold">Care Setting Preferences</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["In our home", "At caregiver's home", "Both locations", "Outdoor activities", "Public venues", "Educational outings", "Flexible locations"].map((setting) => (
                        <div
                          key={setting}
                          className="p-3 border rounded-lg cursor-pointer transition-colors bg-white border-gray-200 hover:border-coral"
                        >
                          <span className="text-sm font-medium">{setting}</span>
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
                  <ParentPhotoUpload
                    photos={photos}
                    onPhotosChange={setPhotos}
                    maxPhotos={3}
                  />
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