import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  Heart
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
    queryKey: ["/api/parent-profile", user?.id],
    enabled: !!user?.id,
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
      <div className="max-w-4xl mx-auto px-4">
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          {/* Family Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Family Details
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

              <div>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  {...form.register("specialRequirements")}
                  placeholder="Any special needs, allergies, or specific care requirements..."
                  rows={3}
                />
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

          {/* Submit Button */}
          <div className="flex justify-end">
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
      </div>
    </div>
  );
}