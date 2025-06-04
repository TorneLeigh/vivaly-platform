import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users, Clock, Star, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const enrollmentSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  childAge: z.number().min(0).max(300, "Please enter age in months"),
  childDateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  enrollmentType: z.enum(["weekly", "monthly", "casual"], {
    required_error: "Please select enrollment type",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  preferredDays: z.array(z.string()).min(1, "Please select at least one day"),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export default function ChildcareEnroll() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      childName: "",
      childAge: 0,
      enrollmentType: "weekly",
      preferredDays: [],
      allergies: "",
      medicalConditions: "",
      dietaryRequirements: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  });

  // Fetch childcare provider details
  const { data: provider, isLoading } = useQuery({
    queryKey: ["/api/childcare-providers", id],
  });

  const enrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      return apiRequest("POST", "/api/childcare-enrollments", {
        ...data,
        providerId: parseInt(id!),
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your childcare enrollment application has been submitted successfully. The provider will review and respond soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/childcare-enrollments"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EnrollmentFormData) => {
    enrollmentMutation.mutate({
      ...data,
      preferredDays: selectedDays,
    });
  };

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    form.setValue("preferredDays", newDays);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Provider Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The childcare provider you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/find-care")}>
              Find Other Providers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Provider Summary */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{provider.centerName}</CardTitle>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {provider.suburb}, {provider.postcode}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${provider.dailyRate}/day
                </div>
                <div className="text-sm text-gray-500">
                  ${provider.hourlyRate}/hr
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {provider.totalCapacity - provider.currentEnrollments} spots available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {provider.startTime} - {provider.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {provider.rating || "New"} rating
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {provider.ageGroups?.map((age: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {age}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Childcare Enrollment Application
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Please provide your child's details to apply for enrollment at this childcare center.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Child Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Child Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child's Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your child's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="childAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (in months) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="300"
                              placeholder="e.g., 18"
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
                      name="childDateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Enrollment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Enrollment Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enrollmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select enrollment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly (Ongoing)</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="casual">Casual (Drop-in)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Preferred Days *</FormLabel>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={selectedDays.includes(day) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day)}
                          className="text-xs"
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                    {form.formState.errors.preferredDays && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.preferredDays.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Special Requirements</h3>
                  
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any allergies your child has..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any medical conditions or medications..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dietaryRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special dietary needs or preferences..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContact.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContact.relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Grandmother, Uncle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="emergencyContact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="0400 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/find-care")}
                    className="flex-1"
                  >
                    Back to Search
                  </Button>
                  <Button
                    type="submit"
                    disabled={enrollmentMutation.isPending}
                    className="flex-1"
                  >
                    {enrollmentMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}