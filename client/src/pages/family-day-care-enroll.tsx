import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Users, Baby, Clock, Star, Shield, Calendar, Phone, User } from "lucide-react";
import type { Nanny, User as UserType, InsertFamilyDayCareEnrollment } from "@shared/schema";

const enrollmentSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  childAge: z.enum(["baby", "preschool", "school-age"], {
    required_error: "Please select child's age group"
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  enrollmentType: z.enum(["weekly", "monthly"], {
    required_error: "Please select enrollment type"
  }),
  daysPerWeek: z.array(z.string()).min(1, "Please select at least one day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  specialRequirements: z.string().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
});

type EnrollmentForm = z.infer<typeof enrollmentSchema>;

interface FamilyDayCareProvider extends Nanny {
  user: UserType;
  availableSpaces: number;
  availableBabySpaces: number;
}

export default function FamilyDayCareEnrollPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: provider, isLoading } = useQuery<FamilyDayCareProvider>({
    queryKey: ["/api/childcare/provider", providerId],
  });

  const form = useForm<EnrollmentForm>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      childName: "",
      startTime: "08:00",
      endTime: "17:00",
      daysPerWeek: [],
      specialRequirements: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      agreeToTerms: false
    }
  });

  const enrollMutation = useMutation({
    mutationFn: async (data: EnrollmentForm) => {
      const enrollmentData: InsertFamilyDayCareEnrollment = {
        providerId: parseInt(providerId!),
        parentId: 1, // Will be replaced with actual user ID
        childName: data.childName,
        childAge: data.childAge,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        enrollmentType: data.enrollmentType,
        daysPerWeek: data.daysPerWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        specialRequirements: data.specialRequirements || null,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship
        },
        weeklyRate: provider?.weeklyRate,
        monthlyRate: provider?.monthlyRate
      };

      return apiRequest("POST", "/api/family-day-care/enroll", enrollmentData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your family day care application has been submitted. The provider will contact you within 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/family-day-care"] });
      setLocation("/family-day-care");
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const weekDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" }
  ];

  const childAgeOptions = [
    { value: "baby", label: "Baby (0-2 years)" },
    { value: "preschool", label: "Preschool (3-5 years)" },
    { value: "school-age", label: "School age (6+ years)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/family-day-care")}
            className="mb-4"
          >
            ← Back to Family Day Care
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Apply for Childcare
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your application to secure a spot for your child
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF5F7E] to-[#FFA24D] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {provider?.user.firstName[0]}{provider?.user.lastName[0]}
                  </div>
                  <div>
                    <div className="text-lg">
                      {provider?.user.firstName} {provider?.user.lastName}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {provider?.suburb}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider?.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm text-green-700">Available</div>
                    <div className="font-bold text-green-800">
                      {provider?.availableSpaces} spots
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Baby className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm text-blue-700">Baby spots</div>
                    <div className="font-bold text-blue-800">
                      {provider?.availableBabySpaces}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Weekly Rate</span>
                    <span className="font-bold">${provider?.weeklyRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Rate</span>
                    <span className="font-bold">${provider?.monthlyRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
                <CardDescription>
                  Please provide the following information to complete your enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => enrollMutation.mutate(data))} className="space-y-6">
                    {/* Child Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Child Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="childName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Child's Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter child's name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="childAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age Group</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select age group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {childAgeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
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

                    {/* Care Schedule */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Care Schedule
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="enrollmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enrollment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select enrollment type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="daysPerWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days per Week</FormLabel>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                              {weekDays.map((day) => (
                                <FormItem key={day.value} className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day.value)}
                                      onCheckedChange={(checked) => {
                                        const updatedDays = checked
                                          ? [...(field.value || []), day.value]
                                          : (field.value || []).filter(d => d !== day.value);
                                        field.onChange(updatedDays);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {day.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Drop-off Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pick-up Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Emergency Contact
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Emergency contact name" />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Phone number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship to Child</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Grandmother, Uncle, Family Friend" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Special Requirements */}
                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requirements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Any allergies, dietary requirements, or special needs..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Terms and Conditions */}
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions and privacy policy
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}