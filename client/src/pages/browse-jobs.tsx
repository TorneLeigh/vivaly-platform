import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, DollarSign, Clock, MapPin, Briefcase } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  parentProfile?: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    suburb?: string;
  };
}

export default function BrowseJobs() {

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['/api/getJobs'],
    queryFn: () => apiRequest('GET', '/api/getJobs')
  });

  const applyMutation = useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      return await apiRequest('POST', '/api/applyToJob', { jobId });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Application Sent",
          description: "Your profile was sent to the parent. They'll be in touch if interested.",
        });
        setSelectedJob(null);
        queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send application",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send application",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!selectedJob) {
      return;
    }

    applyMutation.mutate({
      jobId: selectedJob.id
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
                  <div className="flex items-start space-x-4">
                    {/* Parent Profile Image */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {job.parentProfile?.profilePhoto ? (
                          <img 
                            src={job.parentProfile.profilePhoto} 
                            alt={`${job.parentProfile.firstName} ${job.parentProfile.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium text-sm">
                            {job.parentProfile?.firstName?.[0] || 'P'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            Childcare Position
                          </CardTitle>
                          <div className="flex items-center space-x-4 mt-1">
                            <CardDescription className="text-sm text-gray-500">
                              Posted {formatDate(job.createdAt)}
                            </CardDescription>
                            {job.parentProfile?.suburb && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.parentProfile.suburb}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${job.rate}/hr
                          </div>
                        </div>
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

                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    onClick={() => applyMutation.mutate({ jobId: job.id })}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? 'Applying...' : 'I\'m Interested'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}