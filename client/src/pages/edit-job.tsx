import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Calendar, DollarSign, Clock, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface Job {
  id: string;
  parentId: string;
  title?: string;
  startDate: string;
  numChildren: number;
  rate: string;
  hoursPerWeek: number;
  description: string;
  location?: string;
  suburb?: string;
}

export default function EditJob() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const jobId = params.id;

  const [jobForm, setJobForm] = useState({
    title: '',
    startDate: '',
    numChildren: 1,
    rate: '',
    hoursPerWeek: '',
    description: '',
    location: '',
    suburb: ''
  });

  // Fetch job details
  const { data: job, isLoading } = useQuery({
    queryKey: ['/api/jobs', jobId],
    queryFn: () => apiRequest('GET', `/api/jobs/${jobId}`),
    enabled: !!jobId
  });

  // Update form when job data loads
  useEffect(() => {
    if (job) {
      setJobForm({
        title: job.title || '',
        startDate: job.startDate || '',
        numChildren: job.numChildren || 1,
        rate: job.rate || '',
        hoursPerWeek: job.hoursPerWeek?.toString() || '',
        description: job.description || '',
        location: job.location || '',
        suburb: job.suburb || ''
      });
    }
  }, [job]);

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async (data: typeof jobForm) => {
      return await apiRequest('PUT', `/api/jobs/${jobId}`, {
        title: data.title,
        startDate: data.startDate,
        numChildren: parseInt(data.numChildren.toString()),
        rate: data.rate,
        hoursPerWeek: parseInt(data.hoursPerWeek),
        description: data.description,
        location: data.location,
        suburb: data.suburb
      });
    },
    onSuccess: () => {
      toast({
        title: "Job Updated",
        description: "Your job posting has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/getJobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      setLocation('/profile');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobForm.title || !jobForm.startDate || !jobForm.rate || !jobForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateJobMutation.mutate(jobForm);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please log in to edit jobs
            </h3>
            <Button onClick={() => setLocation("/auth")}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Job not found
            </h3>
            <Button onClick={() => setLocation("/profile")}>
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user owns this job
  if (job.parentId !== user.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-4">
              You can only edit jobs that you posted.
            </p>
            <Button onClick={() => setLocation("/profile")}>
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/profile")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Job Posting</CardTitle>
            <CardDescription>
              Update your job details to attract the right caregivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Morning Childcare for 3-year-old, Part-time Nanny for Weekends"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  className="mt-1"
                  required
                />
                <div className="mt-2 text-xs text-gray-500">
                  Write a clear title that describes what type of care you need
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={jobForm.startDate}
                    onChange={(e) => setJobForm({...jobForm, startDate: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numChildren">Number of Children *</Label>
                  <Input
                    id="numChildren"
                    type="number"
                    min="1"
                    value={jobForm.numChildren}
                    onChange={(e) => setJobForm({...jobForm, numChildren: parseInt(e.target.value) || 1})}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rate">Rate per Hour *</Label>
                  <Input
                    id="rate"
                    placeholder="25"
                    value={jobForm.rate}
                    onChange={(e) => setJobForm({...jobForm, rate: e.target.value})}
                    className="mt-1"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Enter amount in AUD (e.g., 25 for $25/hour)
                  </div>
                </div>
                <div>
                  <Label htmlFor="hoursPerWeek">Hours per Week *</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    min="1"
                    placeholder="20"
                    value={jobForm.hoursPerWeek}
                    onChange={(e) => setJobForm({...jobForm, hoursPerWeek: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Sydney, NSW"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    placeholder="e.g. Bondi"
                    value={jobForm.suburb}
                    onChange={(e) => setJobForm({...jobForm, suburb: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the care you need, your children's ages, schedules, and any special requirements..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="mt-1 min-h-[120px]"
                  required
                />
                <div className="mt-2 text-xs text-gray-500">
                  Include details about your children, schedule, and what you're looking for in a caregiver
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/profile")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateJobMutation.isPending}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateJobMutation.isPending ? 'Updating...' : 'Update Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}