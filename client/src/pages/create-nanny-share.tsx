import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users } from "lucide-react";

const createNannyShareSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  suburb: z.string().min(1, "Suburb is required"),
  rate: z.string().min(1, "Rate is required"),
  schedule: z.string().min(1, "Schedule is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  maxFamilies: z.number().min(2).max(5),
  childrenDetails: z.string().min(1, "Children details are required"),
  requirements: z.string().optional(),
});

type CreateNannyShareForm = z.infer<typeof createNannyShareSchema>;

export default function CreateNannySharePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateNannyShareForm>({
    resolver: zodResolver(createNannyShareSchema),
    defaultValues: {
      maxFamilies: 2,
    },
  });

  const createShareMutation = useMutation({
    mutationFn: async (data: CreateNannyShareForm) => {
      const response = await fetch("/api/nanny-shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create nanny share");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nanny-shares"] });
      toast({
        title: "Success",
        description: "Your nanny share has been created successfully!",
      });
      navigate("/nanny-sharing");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateNannyShareForm) => {
    createShareMutation.mutate(data);
  };

  const maxFamilies = watch("maxFamilies");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/nanny-sharing")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Nanny Sharing
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Nanny Share</h1>
        <p className="text-gray-600">
          Create a nanny share to connect with other families and split childcare costs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Nanny Share Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Share Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., After School Care Share - Bondi"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb *</Label>
                <Input
                  id="suburb"
                  {...register("suburb")}
                  placeholder="e.g., Bondi"
                  className="mt-1"
                />
                {errors.suburb && (
                  <p className="text-sm text-red-600 mt-1">{errors.suburb.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">State/Region *</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., NSW"
                  className="mt-1"
                />
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Schedule and Rate */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule">Schedule *</Label>
                <Input
                  id="schedule"
                  {...register("schedule")}
                  placeholder="e.g., Mon-Fri 3pm-6pm"
                  className="mt-1"
                />
                {errors.schedule && (
                  <p className="text-sm text-red-600 mt-1">{errors.schedule.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="rate">Hourly Rate (AUD) *</Label>
                <Input
                  id="rate"
                  {...register("rate")}
                  placeholder="e.g., 30"
                  type="number"
                  className="mt-1"
                />
                {errors.rate && (
                  <p className="text-sm text-red-600 mt-1">{errors.rate.message}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  {...register("startDate")}
                  type="date"
                  className="mt-1"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  {...register("endDate")}
                  type="date"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Max Families */}
            <div>
              <Label htmlFor="maxFamilies">Maximum Families</Label>
              <Select
                value={maxFamilies?.toString()}
                onValueChange={(value) => setValue("maxFamilies", parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select number of families" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 families</SelectItem>
                  <SelectItem value="3">3 families</SelectItem>
                  <SelectItem value="4">4 families</SelectItem>
                  <SelectItem value="5">5 families</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Children Details */}
            <div>
              <Label htmlFor="childrenDetails">Children Details *</Label>
              <Textarea
                id="childrenDetails"
                {...register("childrenDetails")}
                placeholder="Describe the children who will be cared for (ages, number, any special needs)"
                className="mt-1"
                rows={3}
              />
              {errors.childrenDetails && (
                <p className="text-sm text-red-600 mt-1">{errors.childrenDetails.message}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                placeholder="Any specific requirements for the nanny or participating families"
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/nanny-sharing")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Share"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}