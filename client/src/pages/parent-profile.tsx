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
  Briefcase,
  Camera,
  Play
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
      return apiRequest('DELETE', `/api/jobs/${jobId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/getJobs'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJobMutation.mutate(jobId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
              <Button onClick={() => setLocation("/auth")}>
                Log In
              </Button>
            </div>
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

            {/* Intro Video Section */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Intro Video</h3>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a short video introducing yourself and your family
                  </p>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t mt-6">
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading your jobs...</p>
              </div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active job posts</h3>
                <p className="text-gray-500 mb-4">Start by creating your first job posting to find the perfect caregiver.</p>
                <Button onClick={() => setLocation("/post-job")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {myJobs.map((job: Job) => (
                  <Card key={job.id} className="border border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(job.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>${job.rate}/hour</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{job.hoursPerWeek}h/week</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{job.numChildren} {job.numChildren === 1 ? 'child' : 'children'}</span>
                            </div>
                          </div>
                          {job.suburb && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{job.suburb}</span>
                            </div>
                          )}
                          <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                          <Badge variant="secondary">
                            Posted by you
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/edit-job/${job.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleteJobMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
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