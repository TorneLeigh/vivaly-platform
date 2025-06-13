import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, DollarSign, Clock, MapPin, Briefcase } from "lucide-react";

interface Job {
  id: string;
  parentId: string;
  startDate: string;
  numChildren: number;
  rate: string;
  hoursPerWeek: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function BrowseJobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [caregiverProfile, setCaregiverProfile] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/getJobs')
      .then(res => res.json())
      .then((data: Job[]) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const applyMutation = useMutation({
    mutationFn: async ({ jobId, caregiverProfile }: { jobId: string; caregiverProfile: string }) => {
      const res = await fetch('/api/applyToJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, caregiverProfile })
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Application submitted successfully!",
      });
      setCaregiverProfile("");
      setSelectedJob(null);
      queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!selectedJob || !caregiverProfile.trim()) {
      toast({
        title: "Error",
        description: "Please provide your caregiver profile",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate({
      jobId: selectedJob.id,
      caregiverProfile: caregiverProfile.trim()
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading available jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Childcare Jobs
          </h1>
          <p className="text-lg text-gray-600">
            Find your next childcare opportunity
          </p>
        </div>

        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available</h3>
              <p className="text-gray-500">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job: Job) => (
              <Card key={job.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Childcare Position
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Posted {formatDate(job.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${job.rate}/hr
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Start: {formatDate(job.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{job.numChildren} {job.numChildren === 1 ? 'child' : 'children'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{job.hoursPerWeek} hours/week</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>${(parseFloat(job.rate) * job.hoursPerWeek).toFixed(2)}/week</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setSelectedJob(job)}
                      >
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Apply for Childcare Position</DialogTitle>
                        <DialogDescription>
                          Tell the parent about your experience and why you're a great fit for this role.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Children:</strong> {selectedJob?.numChildren}</p>
                            <p><strong>Rate:</strong> ${selectedJob?.rate}/hour</p>
                            <p><strong>Hours:</strong> {selectedJob?.hoursPerWeek} hours/week</p>
                            <p><strong>Start Date:</strong> {selectedJob && formatDate(selectedJob.startDate)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile">Your Profile & Experience *</Label>
                          <Textarea
                            id="profile"
                            placeholder="Tell the parent about your childcare experience, qualifications, special skills, and why you're interested in this position..."
                            value={caregiverProfile}
                            onChange={(e) => setCaregiverProfile(e.target.value)}
                            className="min-h-[120px] resize-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <Button 
                          onClick={handleApply}
                          disabled={applyMutation.isPending || !caregiverProfile.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}