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
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface Job {
  id: string;
  parentId: string;
  startDate: string;
  numChildren: number;
  rate: string;
  hoursPerWeek: number;
  description: string;
  location?: string;
  suburb?: string;
  timestamp?: string;
  status?: string;
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

  // Check user authentication and role
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-500 mb-6">
              Please log in to access the job board
            </p>
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is a caregiver/nanny
  if (!user.isNanny) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Caregiver Access Only
            </h3>
            <p className="text-gray-500 mb-6">
              The job board is only available to registered caregivers. Parents can post jobs through their dashboard.
            </p>
            <div className="space-y-3">
              <Link href="/become-caregiver">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Become a Caregiver
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Job posting form state
  const [jobForm, setJobForm] = useState({
    startDate: '',
    numChildren: 1,
    rate: '',
    hoursPerWeek: 20,
    description: '',
    location: '',
    suburb: ''
  });

  // Fetch all jobs
  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      const response = await fetch('/api/getJobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // Fetch applications for current user
  const { data: applications = [] } = useQuery({
    queryKey: ['/api/applications'],
    queryFn: async () => {
      const response = await fetch('/api/getApplications');
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // Post new job mutation
  const postJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await fetch('/api/postJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          parentId: 'parent123', // This would come from auth context
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Job Posted Successfully",
          description: "Your job listing is now live and visible to caregivers.",
        });
        setJobForm({
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
    mutationFn: async ({ jobId, message }: { jobId: string; message: string }) => {
      const response = await fetch('/api/applyToJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caregiverId: 'caregiver456', // This would come from auth context
          jobId,
          message,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Application Sent",
          description: "Your application has been sent to the parent.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send application",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send application",
        variant: "destructive",
      });
    }
  });

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.startDate || !jobForm.rate || !jobForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    postJobMutation.mutate(jobForm);
  };

  const handleApplyToJob = (jobId: string) => {
    const message = prompt("Send a message to the parent:");
    if (message) {
      applyToJobMutation.mutate({ jobId, message });
    }
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post Job
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              My Applications
            </TabsTrigger>
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
              <div className="grid gap-6">
                {filteredJobs.map((job: Job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Care for {job.numChildren} child{job.numChildren > 1 ? 'ren' : ''}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Starts: {new Date(job.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.rate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.hoursPerWeek} hours/week
                            </div>
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          Active
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {job.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Posted: {job.timestamp ? new Date(job.timestamp).toLocaleDateString() : 'Recently'}
                        </div>
                        <Button 
                          onClick={() => handleApplyToJob(job.id)}
                          disabled={applyToJobMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {applyToJobMutation.isPending ? 'Applying...' : 'I\'m Interested'}
                        </Button>
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
                    className="w-full bg-purple-600 hover:bg-purple-700"
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