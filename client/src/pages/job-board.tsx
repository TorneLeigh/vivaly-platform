import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Send,
  Heart,
  Star,
  Filter,
  Search,
  Plus,
  Shield,
  AlertTriangle,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

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
  timestamp?: string;
  createdAt?: string;
  status?: string;
  parentProfile?: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    suburb?: string;
  };
}

interface Application {
  id: string;
  caregiverId: string;
  jobId: string;
  message: string;
  timestamp: string;
  caregiver?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function JobBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'browse' | 'post' | 'applications'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Check user authentication and role (optional for browsing)
  const { data: user, isLoading: userLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch('/api/auth/user', { credentials: 'include' });
      if (!response.ok) return null; // Allow browsing without authentication
      return response.json();
    },
    retry: false
  });

  // Don't show loading for unauthenticated users
  if (userLoading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show different views based on user role
  const isCaregiver = user?.isNanny || false;
  const isParent = user && !user.isNanny;
  
  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: '',
    startDate: '',
    numChildren: 1,
    rate: '',
    hoursPerWeek: 20,
    description: '',
    location: '',
    suburb: ''
  });

  // Fetch all jobs (public endpoint, no authentication required)
  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // Fetch applications for current user
  const { data: applications = [] } = useQuery({
    queryKey: ['/api/applications/my'],
    queryFn: async () => {
      const response = await fetch('/api/applications/my', { credentials: 'include' });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user
  });

  // Post new job mutation
  const postJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error('Failed to post job');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Job Posted Successfully",
          description: "Your job listing is now live and visible to caregivers.",
        });
        setJobForm({
          title: '',
          startDate: '',
          numChildren: 1,
          rate: '',
          hoursPerWeek: 20,
          description: '',
          location: '',
          suburb: ''
        });
        refetchJobs();
        setActiveTab('browse');
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to post job",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive",
      });
    }
  });

  // Apply to job mutation
  const applyToJobMutation = useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      const response = await fetch('/api/applyToJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply to job');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Application Sent",
          description: "Your profile was sent to the parent. They'll be in touch if interested.",
        });
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
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Deleted",
        description: "Your job posting has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
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

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.startDate || !jobForm.rate || !jobForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including job title",
        variant: "destructive",
      });
      return;
    }
    postJobMutation.mutate(jobForm);
  };

  const handleApplyToJob = (jobId: string) => {
    applyToJobMutation.mutate({ jobId });
  };

  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch = searchQuery === '' || 
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === '' || 
      job.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      job.suburb?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vivaly Job Board
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect families with trusted caregivers. Post job opportunities or find your next childcare position.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className={`grid w-full ${isParent ? 'grid-cols-2' : isCaregiver ? 'grid-cols-2' : 'grid-cols-1'} mb-8`}>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            {isParent && (
              <TabsTrigger value="post" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Post Job
              </TabsTrigger>
            )}
            {isCaregiver && (
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                My Applications
              </TabsTrigger>
            )}
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search">Search Jobs</Label>
                    <Input
                      id="search"
                      placeholder="Search by description, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location Filter</Label>
                    <Input
                      id="location"
                      placeholder="Filter by location or suburb..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            {jobsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery || locationFilter ? 'Try adjusting your search filters.' : 'Be the first to post a job!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job: Job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow h-fit overflow-hidden">
                    {/* Large Hero Image at Top */}
                    <div className="relative h-64 bg-gray-200">
                      {job.parentProfile?.profilePhoto ? (
                        <img 
                          src={job.parentProfile.profilePhoto} 
                          alt={`${job.parentProfile.firstName}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF5F7E] to-[#FFA24D] flex items-center justify-center text-white font-semibold text-6xl">
                          {job.parentProfile?.firstName?.charAt(0) || 'P'}
                        </div>
                      )}
                      {/* Application count overlay */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-900">
                          {(applications || []).filter((app: any) => app.jobId === job.id).length} applied
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      {/* Job title */}
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {job.title || `Care for ${job.numChildren} child${job.numChildren > 1 ? 'ren' : ''}`}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className="font-medium">
                            {job.parentProfile?.firstName} {job.parentProfile?.lastName}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location || 'Sydney, NSW'}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>Starts: {new Date(job.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            <span>${job.rate}/hour</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>{job.hoursPerWeek} hours/week</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-xs text-gray-500">
                          Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                        
                        {/* Show edit/delete buttons for jobs posted by current user */}
                        {job.parentId === user?.id ? (
                          <div className="space-y-2">
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                              Posted by you
                            </Badge>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => setLocation(`/edit-job/${job.id}`)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleDeleteJob(job.id)}
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                disabled={deleteJobMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {deleteJobMutation.isPending ? 'Deleting...' : 'Delete'}
                              </Button>
                            </div>
                          </div>
                        ) : !isParent ? (
                          <Button 
                            onClick={() => handleApplyToJob(job.id)}
                            disabled={applyToJobMutation.isPending}
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-sm transition-colors"
                          >
                            {applyToJobMutation.isPending ? 'Applying...' : 'I\'M INTERESTED'}
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setLocation(`/job-details/${job.id}`)}
                            variant="outline"
                            className="w-full text-sm"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Post Job Tab */}
          <TabsContent value="post">
            <Card>
              <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
                <CardDescription>
                  Create a job listing to find qualified caregivers for your family
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobSubmit} className="space-y-6">
                  <div className="mb-6">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Morning Childcare for 3-year-old, Part-time Nanny for Weekends, Afterschool Care Needed"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                      className="mt-1"
                      required
                    />
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p>Write a title that clearly describes what type of care you need</p>
                      <div className="text-gray-400">
                        <strong>Examples:</strong> "Reliable Babysitter for Date Nights", "Live-in Au Pair for Large Family", "Occasional Care for Toddler"
                      </div>
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
                        max="10"
                        value={jobForm.numChildren}
                        onChange={(e) => setJobForm({...jobForm, numChildren: parseInt(e.target.value)})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rate">Rate *</Label>
                      <Input
                        id="rate"
                        placeholder="e.g. $30/hr or $600/week"
                        value={jobForm.rate}
                        onChange={(e) => setJobForm({...jobForm, rate: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                      <Input
                        id="hoursPerWeek"
                        type="number"
                        min="1"
                        max="60"
                        value={jobForm.hoursPerWeek}
                        onChange={(e) => setJobForm({...jobForm, hoursPerWeek: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
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
                        placeholder="e.g. Bondi Beach"
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
                      rows={6}
                      placeholder="Describe what you're looking for in a caregiver, your children's ages, any special requirements, daily routine, etc."
                      value={jobForm.description}
                      onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={postJobMutation.isPending}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {postJobMutation.isPending ? 'Posting Job...' : 'Post Job'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-500">
                      Apply to jobs to see your applications here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application: Application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Job Application</h4>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied: {new Date(application.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700">
                          {application.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}