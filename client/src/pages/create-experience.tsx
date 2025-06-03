import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SERVICE_TYPES, SYDNEY_SUBURBS } from "@shared/schema";
import { 
  Camera,
  Plus,
  X,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  Upload
} from "lucide-react";

const experienceSchema = z.object({
  // Personal Details
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  
  // Experience Details
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  serviceType: z.string().min(1, "Please select a service type"),
  duration: z.number().min(30, "Minimum duration is 30 minutes").max(480, "Maximum duration is 8 hours"),
  
  // Pricing
  isFree: z.boolean().default(false),
  price: z.number().min(0, "Price cannot be negative").optional(),
  
  // Participants
  maxParticipants: z.number().min(1, "Must accommodate at least 1 participant").max(20, "Maximum 20 participants"),
  ageRange: z.string().min(1, "Please select an age range"),
  location: z.string().min(1, "Please select a location"),
  instantBook: z.boolean().default(false),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

const ageRanges = [
  "0-2 years (Infants/Toddlers)",
  "3-5 years (Preschoolers)",
  "6-8 years (Early School)",
  "9-12 years (School Age)",
  "13+ years (Teenagers)",
  "All Ages"
];

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
  { value: 360, label: "6 hours" },
  { value: 420, label: "7 hours" },
  { value: 480, label: "8 hours" },
];

export default function CreateExperience() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      title: "",
      description: "",
      serviceType: "",
      duration: 60,
      isFree: false,
      price: 30,
      maxParticipants: 5,
      ageRange: "",
      location: "",
      instantBook: false,
    },
  });

  const createExperience = useMutation({
    mutationFn: async (data: ExperienceFormData & { 
      inclusions: string[]; 
      requirements: string[]; 
      availability: string[]; 
      photos: string[] 
    }) => {
      return apiRequest("POST", "/api/experiences", data);
    },
    onSuccess: () => {
      toast({
        title: "Experience Created!",
        description: "Your experience is now live and families can book it.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      setLocation("/nanny-dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    const experienceData = {
      ...data,
      inclusions,
      requirements,
      availability,
      photos,
    };
    createExperience.mutate(experienceData);
  };

  const addInclusion = () => {
    if (newInclusion.trim() && !inclusions.includes(newInclusion.trim())) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addAvailability = (day: string) => {
    if (!availability.includes(day)) {
      setAvailability([...availability, day]);
    } else {
      setAvailability(availability.filter(d => d !== day));
    }
  };

  const steps = [
    "Personal Details",
    "Experience Details", 
    "Pricing & Participants",
    "Photos & Availability"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Experience</h1>
          <p className="text-gray-600">Share your unique caregiving experience with families</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {currentStep === 0 && <Star className="h-5 w-5 mr-2" />}
                  {currentStep === 1 && <DollarSign className="h-5 w-5 mr-2" />}
                  {currentStep === 2 && <CheckCircle className="h-5 w-5 mr-2" />}
                  {currentStep === 3 && <Camera className="h-5 w-5 mr-2" />}
                  {steps[currentStep]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 0: Personal Details */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your first name"
                                {...field} 
                              />
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
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your last name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your.email@example.com"
                                {...field} 
                              />
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
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder="0412 345 678"
                                {...field} 
                              />
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
                          <FormLabel>About You *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell families about your experience, qualifications, and what makes you special as a caregiver..."
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 1: Experience Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Creative Art Adventures for Toddlers"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what makes your experience special. What will participants do? What will they learn? What makes it unique?"
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration *</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {durationOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value.toString()}>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SYDNEY_SUBURBS.map((suburb) => (
                                <SelectItem key={suburb} value={suburb}>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {suburb}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Pricing & Participants */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Pricing</h3>
                      <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                This is a free experience
                              </FormLabel>
                              <p className="text-sm text-gray-600">
                                No payment required from families
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      {!form.watch("isFree") && (
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price per Hour *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="number"
                                    min="0"
                                    max="200"
                                    step="5"
                                    placeholder="30"
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Participants</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Participants *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="number"
                                    min="1"
                                    max="20"
                                    placeholder="5"
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ageRange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age Range *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select age range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ageRanges.map((age) => (
                                    <SelectItem key={age} value={age}>
                                      {age}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">What's Included</h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., Art supplies, snacks, activity sheets"
                            value={newInclusion}
                            onChange={(e) => setNewInclusion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                          />
                          <Button type="button" onClick={addInclusion} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {inclusions.map((inclusion, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {inclusion}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeInclusion(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Requirements for Families</h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., Bring change of clothes, pick up on time"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                          />
                          <Button type="button" onClick={addRequirement} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {requirements.map((requirement, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {requirement}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeRequirement(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="instantBook"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Enable Instant Booking
                            </FormLabel>
                            <p className="text-sm text-gray-600">
                              Families can book immediately without waiting for approval
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Photos & Availability */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Photos</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h4 className="text-lg font-medium mb-2">Add Photos of Your Experience</h4>
                        <p className="text-gray-600 mb-4">
                          Show families what to expect. Add photos of activities, your space, and previous experiences.
                        </p>
                        <Button type="button" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Photos
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Availability</h3>
                      <p className="text-gray-600 mb-4">When are you typically available for this experience?</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={availability.includes(day)}
                              onCheckedChange={() => addAvailability(day)}
                            />
                            <label htmlFor={day} className="text-sm font-medium">
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createExperience.isPending}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {createExperience.isPending ? "Creating..." : "Create Experience"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}