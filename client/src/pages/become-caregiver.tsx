import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNannySchema, SERVICE_TYPES, CERTIFICATE_TYPES } from "@shared/schema";
import { z } from "zod";
import { 
  Heart, Shield, Award, DollarSign, MapPin, FileText, ChevronDown, 
  Clock, HelpCircle, Users, CheckCircle, AlertCircle, Camera, Upload 
} from "lucide-react";

const caregiverFormSchema = insertNannySchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CaregiverFormData = z.infer<typeof caregiverFormSchema>;

export default function BecomeCaregiver() {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      suburb: "",
      bio: "",
      experience: 0,
      hourlyRate: 25,
      services: [],
      certifications: [],
      availability: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CaregiverFormData) => {
      return apiRequest("POST", "/api/nannies", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your caregiver profile has been submitted for review.",
      });
      setStep(5);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CaregiverFormData) => {
    mutation.mutate(data);
  };

  const nextStep = () => {
    const fieldsToValidate = getFieldsForStep(step);
    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) {
        setStep(step + 1);
      }
    });
  };

  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'password'] as const;
      case 2:
        return ['suburb'] as const;
      case 3:
        return ['services'] as const;
      case 4:
        return ['hourlyRate', 'bio'] as const;
      default:
        return [] as const;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-coral" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VIVALY</h2>
                <p className="text-gray-600">Let's start with your basic information</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
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
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
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
                      <Input type="tel" placeholder="0412 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a secure password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-coral" />
                Location & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your suburb" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sydney-cbd">Sydney CBD</SelectItem>
                        <SelectItem value="bondi">Bondi</SelectItem>
                        {/* Add more suburbs */}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the area where you're available to provide care services
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-coral" />
                Services & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel>What services do you offer?</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {SERVICE_TYPES.map((service) => (
                        <FormField
                          key={service}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, service])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {service}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About You</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell families about yourself, your experience, and why you love caring for others..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={() => (
                  <FormItem>
                    <FormLabel>Certifications & Qualifications</FormLabel>
                    <div className="grid grid-cols-1 gap-3">
                      {CERTIFICATE_TYPES.map((cert) => (
                        <FormField
                          key={cert}
                          control={form.control}
                          name="certifications"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={cert}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(cert)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, cert])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== cert
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {cert}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-coral" />
                Rates & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (AUD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="150"
                        placeholder="25"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 25)}
                      />
                    </FormControl>
                    <FormDescription>
                      Set your hourly rate. You can adjust this later in your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Image Upload */}
              <div className="space-y-4">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <Label
                      htmlFor="profile-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      A friendly photo helps build trust with families
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
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
                <Button onClick={() => window.location.href = "/provider-dashboard"} className="w-full">
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Caregiver</h1>
          <p className="text-gray-600">Join our community of trusted care providers</p>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-coral h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                <Button
                  type={step === 4 ? "submit" : "button"}
                  onClick={step === 4 ? undefined : nextStep}
                  disabled={mutation.isPending}
                  className="bg-coral hover:bg-coral/90"
                >
                  {step === 4 
                    ? mutation.isPending 
                      ? "Submitting..." 
                      : "Submit Application"
                    : "Next"
                  }
                </Button>
              </div>
            )}
          </form>
        </Form>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-white rounded-lg border hover:bg-gray-50">
                <span className="font-medium">How much can I earn as a caregiver?</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 text-gray-600">
                Caregivers on VIVALY typically earn between $25-65 per hour, depending on their experience, 
                qualifications, and the type of care provided. You set your own rates and keep 90% of what you earn.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-white rounded-lg border hover:bg-gray-50">
                <span className="font-medium">What's required to become a caregiver?</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 text-gray-600">
                You need to be 18+ years old, have relevant experience or qualifications, pass our background checks, 
                and hold current First Aid and CPR certifications. We also verify your identity and references.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-white rounded-lg border hover:bg-gray-50">
                <span className="font-medium">How does the approval process work?</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 text-gray-600">
                After submitting your application, we review your profile, verify your qualifications, and conduct 
                background checks. This process typically takes 2-3 business days. You'll be notified by email once approved.
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Need help with your application?</h3>
              <p className="text-blue-700 text-sm mt-1">
                Our support team is here to help you every step of the way. Contact us at support@vivaly.com.au 
                or call 1800-VIVALY (1800-848-259).
              </p>
            </div>
          </div>
        </div>

        {/* Professional Development */}
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Professional Development</h3>
              <p className="text-green-700 text-sm mt-1">
                Access free training courses, workshops, and resources to enhance your skills 
                and advance your career in childcare. Available once you're approved.
              </p>
            </div>
          </div>
        </div>

        {/* Time Commitment */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border">
            <Clock className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Hours</h3>
            <p className="text-gray-600 text-sm">
              Work as little or as much as you want. Set your own schedule and choose 
              bookings that fit your lifestyle.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg border">
            <Clock className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Quick Start</h3>
            <p className="text-gray-600 text-sm">
              Once approved, you can start accepting bookings immediately. 
              Most caregivers get their first booking within a week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}