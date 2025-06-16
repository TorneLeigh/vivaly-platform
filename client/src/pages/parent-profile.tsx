import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users,
  Edit,
  Trash2,
  Plus,
  Briefcase
} from "lucide-react";
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
  status?: string;
  createdAt?: string;
}

export default function ParentProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completedFields = 0;
    const totalFields = 4;
    
    if (user.firstName) completedFields++;
    if (user.lastName) completedFields++;
    if (user.email) completedFields++;
    if ((user as any).phone) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Fetch user's active job posts
  const { data: myJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs/my'],
    queryFn: () => apiRequest('GET', '/api/jobs/my'),
    enabled: !!user
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return await apiRequest('DELETE', `/api/jobs/${jobId}`);
    },
    onSuccess: () => {
      toast({
        title: "Job Deleted",
        description: "Your job posting has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/getJobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      });
    }
  });

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteJobMutation.mutate(jobId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please log in to view your profile
            </h3>
            <Button onClick={() => setLocation("/auth")}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Profile Completion</span>
                    <span>{calculateProfileCompletion()}%</span>
                  </div>
                  <Progress value={calculateProfileCompletion()} className="w-full" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {(user as any).phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{(user as any).phone}</span>
                  </div>
                )}
              </div>
              
              {/* Account Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Account Details</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Parent Account</Badge>
                  {user.roles?.includes("caregiver") && (
                    <Badge variant="outline">Dual Role</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Active Jobs: {myJobs.length}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-500">
                Member since {new Date().getFullYear()}
              </div>
              <Button variant="outline" onClick={() => setLocation("/account-settings")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Job Posts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Active Job Posts
                </CardTitle>
                <CardDescription>
                  Manage your childcare job listings
                </CardDescription>
              </div>
              <Button onClick={() => setLocation("/post-job")}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your job posts...</p>
              </div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active job posts
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by posting your first job to find qualified caregivers
                </p>
                <Button onClick={() => setLocation("/post-job")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job: Job) => (
                  <Card key={job.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {job.title || `Care for ${job.numChildren} child${job.numChildren > 1 ? 'ren' : ''}`}
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Starts: {new Date(job.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${job.rate}/hour</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.hoursPerWeek} hours/week</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{job.numChildren} {job.numChildren === 1 ? 'child' : 'children'}</span>
                            </div>
                          </div>
                          
                          {job.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {job.status || 'Active'}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => setLocation(`/edit-job/${job.id}`)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              onClick={() => handleDeleteJob(job.id)}
                              variant="destructive"
                              size="sm"
                              disabled={deleteJobMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {deleteJobMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => setLocation(`/job/${job.id}/applications`)}
                          >
                            View Applications
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}