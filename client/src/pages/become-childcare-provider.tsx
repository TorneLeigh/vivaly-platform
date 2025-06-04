import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Home, Users, Shield, Clock, MapPin, Phone, Mail, FileText, Award } from "lucide-react";

const childcareProviderSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  
  // Location and Setup
  address: z.string().min(10, "Please enter your full address"),
  suburb: z.string().min(2, "Please enter your suburb"),
  postcode: z.string().min(4, "Please enter a valid postcode"),
  state: z.string().min(1, "Please select your state"),
  
  // Childcare Details
  centerName: z.string().min(3, "Center name must be at least 3 characters"),
  description: z.string().min(50, "Please provide a detailed description (minimum 50 characters)"),
  ageGroups: z.array(z.string()).min(1, "Please select at least one age group"),
  capacity: z.number().min(1).max(7, "Maximum capacity is 7 children"),
  babyCapacity: z.number().min(0).max(4, "Maximum baby capacity is 4 children (0-2 years)"),
  
  // Availability
  operatingDays: z.array(z.string()).min(1, "Please select at least one operating day"),
  startTime: z.string().min(1, "Please select start time"),
  endTime: z.string().min(1, "Please select end time"),
  
  // Rates
  hourlyRate: z.number().min(15, "Minimum rate is $15/hour"),
  dailyRate: z.number().min(50, "Minimum daily rate is $50"),
  weeklyRate: z.number().min(200, "Minimum weekly rate is $200"),
  
  // Qualifications & Australian Requirements
  qualifications: z.array(z.string()).min(1, "Please select at least one qualification"),
  experience: z.number().min(0, "Experience cannot be negative"),
  childProtectionTraining: z.boolean().refine(val => val === true, "Child Protection Training is mandatory"),
  anaphylaxisTraining: z.boolean().refine(val => val === true, "Anaphylaxis Management Training is required"),
  asthmaManagement: z.boolean().refine(val => val === true, "Asthma Emergency Management Training is required"),
  emergencyEvacuation: z.boolean().refine(val => val === true, "Emergency Evacuation Training is required"),
  
  // Legal Requirements & Verification
  wwccNumber: z.string().min(8, "Please enter your WWCC number"),
  wwccExpiryDate: z.string().min(1, "WWCC expiry date is required"),
  proofOfAddress: z.instanceof(File).optional(),
  firstAidCert: z.boolean().refine(val => val === true, "First aid certification is required"),
  firstAidExpiryDate: z.string().min(1, "First aid expiry date is required"),
  publicLiability: z.boolean().refine(val => val === true, "Public liability insurance is required"),
  publicLiabilityPolicyNumber: z.string().min(1, "Insurance policy number is required"),
  childcareInsurance: z.boolean().refine(val => val === true, "Childcare insurance is required"),
  childcareInsurancePolicyNumber: z.string().min(1, "Childcare insurance policy number is required"),
  
  // Safety & Privacy Protection
  backgroundCheckConsent: z.boolean().refine(val => val === true, "Background check consent is required"),
  platformTermsAgreement: z.boolean().refine(val => val === true, "Platform terms agreement is required"),
  dataProtectionConsent: z.boolean().refine(val => val === true, "Data protection consent is required"),
  
  // Additional Services
  mealsProvided: z.boolean().default(false),
  nappiesProvided: z.boolean().default(false),
  transportProvided: z.boolean().default(false),
  outdoorPlay: z.boolean().default(false),
  educationalActivities: z.boolean().default(false),
});

type ChildcareProviderForm = z.infer<typeof childcareProviderSchema>;

const ageGroupOptions = [
  "0-12 months (babies)",
  "1-2 years (toddlers)",
  "2-3 years (preschool)",
  "3-5 years (kindergarten)",
  "School age (5+ years)"
];

const qualificationOptions = [
  "Early Childhood Education Certificate III",
  "Early Childhood Education Diploma",
  "Bachelor of Early Childhood Education",
  "Family Day Care Coordinator Certificate",
  "First Aid & CPR Certification",
  "Anaphylaxis Management Training",
  "Asthma Management Training"
];

const dayOptions = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const stateOptions = [
  "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"
];

export default function BecomeChildcareProvider() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ChildcareProviderForm>({
    resolver: zodResolver(childcareProviderSchema),
    defaultValues: {
      ageGroups: [],
      operatingDays: [],
      qualifications: [],
      capacity: 4,
      babyCapacity: 2,
      experience: 0,
      hourlyRate: 25,
      dailyRate: 120,
      weeklyRate: 500,
      mealsProvided: false,
      nappiesProvided: false,
      transportProvided: false,
      outdoorPlay: true,
      educationalActivities: true,
      firstAidCert: false,
      publicLiability: false,
      childcareInsurance: false,
      backgroundCheckConsent: false,
      platformTermsAgreement: false,
      dataProtectionConsent: false,
      childProtectionTraining: false,
      anaphylaxisTraining: false,
      asthmaManagement: false,
      emergencyEvacuation: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ChildcareProviderForm) => {
      return await apiRequest("POST", "/api/childcare-providers", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We'll review your childcare center application and contact you within 48 hours.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ChildcareProviderForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verified Childcare Center Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join VIVALY's secure network of fully verified childcare providers. Complete background checks 
            and comprehensive verification protect both families and platform operators.
          </p>
        </div>

        {/* Requirements Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="w-5 h-5" />
              Childcare Center Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements (Australian):</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Valid Working with Children Check</li>
                  <li>First Aid & CPR Certification (HLTAID012)</li>
                  <li>Child Protection Training (mandatory)</li>
                  <li>Anaphylaxis Management Training</li>
                  <li>Asthma Emergency Management</li>
                  <li>Emergency Evacuation Training</li>
                  <li>Public Liability Insurance ($20M+)</li>
                  <li>Childcare-specific Insurance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Capacity Limits:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Maximum 7 children total</li>
                  <li>Maximum 4 babies (0-2 years)</li>
                  <li>Proper supervision ratios</li>
                  <li>Safe home environment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main Street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="suburb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suburb</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stateOptions.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Childcare Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Childcare Center Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="centerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Little Stars Family Day Care" />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          placeholder="Describe your childcare philosophy, environment, and what makes your center special..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Capacity (Max 7)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="7" 
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
                    name="babyCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Baby Capacity (0-2 years, Max 4)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="4" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Verification & Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Verification & Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wwccNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working with Children Check Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="WWC1234567890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wwccExpiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WWCC Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="proofOfAddress"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Proof of Address (Utility Bill, Council Rates, etc.)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Upload a recent utility bill, council rates notice, or bank statement showing your address
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstAidExpiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Aid Certificate Expiry</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publicLiabilityPolicyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Liability Policy Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PLI123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="childcareInsurancePolicyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Childcare Insurance Policy Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CCI987654321" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Legal Requirements Checkboxes */}
                <div className="space-y-3 pt-4">
                  <FormField
                    control={form.control}
                    name="firstAidCert"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I have current First Aid & CPR certification</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publicLiability"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I have current Public Liability insurance ($20M minimum)</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="childcareInsurance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I have childcare-specific insurance coverage</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* Australian Mandatory Training Requirements */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-3 text-gray-800">Mandatory Australian Training Requirements:</h4>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="childProtectionTraining"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I have completed Child Protection Training (mandatory in Australia)</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="anaphylaxisTraining"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I have Anaphylaxis Management Training (ASCIA certified)</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="asthmaManagement"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I have Asthma Emergency Management Training</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyEvacuation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I have Emergency Evacuation & Risk Management Training</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety & Privacy Protection */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  Platform Safety & Privacy Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-green-700 mb-4">
                  VIVALY implements comprehensive verification to protect all parties:
                </p>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="backgroundCheckConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I consent to comprehensive background checks including criminal history, 
                            reference verification, and address confirmation
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platformTermsAgreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to VIVALY's platform terms, safety protocols, and dispute resolution process
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataProtectionConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I consent to secure data handling and verification sharing with authorized parties only
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-white border border-green-300 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Platform Owner Protection:</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• All providers undergo multi-stage verification before approval</li>
                    <li>• Address verification prevents false registration</li>
                    <li>• Insurance requirements protect against liability claims</li>
                    <li>• Regular compliance monitoring and renewal tracking</li>
                    <li>• Clear terms of service with enforceable dispute resolution</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full max-w-md bg-blue-600 hover:bg-blue-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting Application..." : "Submit Verified Childcare Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}