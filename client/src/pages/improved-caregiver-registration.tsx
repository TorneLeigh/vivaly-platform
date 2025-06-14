import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define clean form schema
const caregiverSchema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  
  // Step 2: Professional Information
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  yearsExperience: z.string().min(1, "Years of experience is required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  
  // Step 3: Availability (simplified)
  availabilityDays: z.array(z.string()).min(1, "Select at least one available day"),
  availableFrom: z.string().min(1, "Start time is required"),
  availableTo: z.string().min(1, "End time is required"),
  
  // Step 4: Emergency Contact & Agreements
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyRelation: z.string().min(1, "Relationship is required"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true, "You must agree to background check"),
});

type CaregiverFormData = z.infer<typeof caregiverSchema>;

const serviceOptions = [
  "Babysitting",
  "Nannying", 
  "After School Care",
  "School Pickup/Dropoff",
  "Overnight Care",
  "Weekend Care",
  "Holiday Care",
  "Special Needs Care"
];

const ageGroupOptions = [
  "0-6 months",
  "6-12 months", 
  "1-2 years",
  "3-4 years",
  "5-8 years",
  "9-12 years",
  "13+ years"
];

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export default function ImprovedCaregiverRegistration() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverSchema),
    mode: "onTouched",
    defaultValues: {
      services: [],
      ageGroups: [],
      availabilityDays: [],
      agreeToTerms: false,
      agreeToBackgroundCheck: false,
    },
  });

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: async (data: CaregiverFormData) => {
      const response = await apiRequest('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          isNanny: true,
          password: "temp123", // In real app, collect this
        }),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "Welcome to Vivaly! Please check your email to verify your account.",
      });
      setLocation('/caregiver-dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof CaregiverFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "firstName", "lastName", "email", "phone", "dateOfBirth",
          "address", "suburb", "state", "postcode"
        ];
        break;
      case 2:
        fieldsToValidate = ["bio", "yearsExperience", "hourlyRate", "services", "ageGroups"];
        break;
      case 3:
        fieldsToValidate = ["availabilityDays", "availableFrom", "availableTo"];
        break;
      case 4:
        fieldsToValidate = ["emergencyName", "emergencyPhone", "emergencyRelation", "agreeToTerms", "agreeToBackgroundCheck"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in all required information before continuing.",
        variant: "destructive",
      });
    }

    return isValid;
  };

  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (await validateCurrentStep()) {
      registrationMutation.mutate(form.getValues());
    }
  };

  const toggleService = (service: string) => {
    const current = form.getValues("services");
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    form.setValue("services", updated);
  };

  const toggleAgeGroup = (ageGroup: string) => {
    const current = form.getValues("ageGroups");
    const updated = current.includes(ageGroup)
      ? current.filter(g => g !== ageGroup)
      : [...current, ageGroup];
    form.setValue("ageGroups", updated);
  };

  const toggleDay = (day: string) => {
    const current = form.getValues("availabilityDays");
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    form.setValue("availabilityDays", updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Caregiver Registration - Step {step} of 4
            </CardTitle>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      className={form.formState.errors.firstName ? "border-red-500" : ""}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      className={form.formState.errors.lastName ? "border-red-500" : ""}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register("phone")}
                      className={form.formState.errors.phone ? "border-red-500" : ""}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register("dateOfBirth")}
                      className={form.formState.errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...form.register("address")}
                    className={form.formState.errors.address ? "border-red-500" : ""}
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
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
                      className={form.formState.errors.suburb ? "border-red-500" : ""}
                    />
                    {form.formState.errors.suburb && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.suburb.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...form.register("state")}
                      className={form.formState.errors.state ? "border-red-500" : ""}
                    />
                    {form.formState.errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      {...form.register("postcode")}
                      className={form.formState.errors.postcode ? "border-red-500" : ""}
                    />
                    {form.formState.errors.postcode && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.postcode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                
                <div>
                  <Label htmlFor="bio">Tell us about yourself (minimum 50 characters) *</Label>
                  <Textarea
                    id="bio"
                    {...form.register("bio")}
                    className={form.formState.errors.bio ? "border-red-500" : ""}
                    rows={4}
                    placeholder="Share your experience, approach to childcare, and what makes you special..."
                  />
                  {form.formState.errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Select onValueChange={(value) => form.setValue("yearsExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-3">2-3 years</SelectItem>
                        <SelectItem value="4-5">4-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.yearsExperience && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.yearsExperience.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (AUD) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="25"
                      {...form.register("hourlyRate")}
                      className={form.formState.errors.hourlyRate ? "border-red-500" : ""}
                    />
                    {form.formState.errors.hourlyRate && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.hourlyRate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Services Offered * (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={form.watch("services").includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label htmlFor={service} className="text-sm">{service}</Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.services && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.services.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Age Groups * (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {ageGroupOptions.map((ageGroup) => (
                      <div key={ageGroup} className="flex items-center space-x-2">
                        <Checkbox
                          id={ageGroup}
                          checked={form.watch("ageGroups").includes(ageGroup)}
                          onCheckedChange={() => toggleAgeGroup(ageGroup)}
                        />
                        <Label htmlFor={ageGroup} className="text-sm">{ageGroup}</Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.ageGroups && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.ageGroups.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Availability</h3>
                
                <div>
                  <Label>Available Days * (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={form.watch("availabilityDays").includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <Label htmlFor={day} className="text-sm capitalize">{day}</Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.availabilityDays && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.availabilityDays.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availableFrom">Available From *</Label>
                    <Input
                      id="availableFrom"
                      type="time"
                      {...form.register("availableFrom")}
                      className={form.formState.errors.availableFrom ? "border-red-500" : ""}
                    />
                    {form.formState.errors.availableFrom && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.availableFrom.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="availableTo">Available To *</Label>
                    <Input
                      id="availableTo"
                      type="time"
                      {...form.register("availableTo")}
                      className={form.formState.errors.availableTo ? "border-red-500" : ""}
                    />
                    {form.formState.errors.availableTo && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.availableTo.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Emergency Contact & Agreements */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact & Final Steps</h3>
                
                <div>
                  <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    {...form.register("emergencyName")}
                    className={form.formState.errors.emergencyName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.emergencyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.emergencyName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      {...form.register("emergencyPhone")}
                      className={form.formState.errors.emergencyPhone ? "border-red-500" : ""}
                    />
                    {form.formState.errors.emergencyPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.emergencyPhone.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyRelation">Relationship *</Label>
                    <Input
                      id="emergencyRelation"
                      placeholder="e.g., Parent, Sibling, Friend"
                      {...form.register("emergencyRelation")}
                      className={form.formState.errors.emergencyRelation ? "border-red-500" : ""}
                    />
                    {form.formState.errors.emergencyRelation && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.emergencyRelation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={form.watch("agreeToTerms")}
                      onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                  </div>
                  {form.formState.errors.agreeToTerms && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.agreeToTerms.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToBackgroundCheck"
                      checked={form.watch("agreeToBackgroundCheck")}
                      onCheckedChange={(checked) => form.setValue("agreeToBackgroundCheck", checked as boolean)}
                    />
                    <Label htmlFor="agreeToBackgroundCheck" className="text-sm leading-5">
                      I consent to a background check and verification process *
                    </Label>
                  </div>
                  {form.formState.errors.agreeToBackgroundCheck && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.agreeToBackgroundCheck.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={registrationMutation.isPending}
                >
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={registrationMutation.isPending}
                  className="ml-auto"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={registrationMutation.isPending}
                  className="ml-auto"
                >
                  {registrationMutation.isPending ? "Submitting..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}