import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import CaregiverApplicationModal from "@/components/caregiver-application-modal";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  ArrowLeft,
  User,
  Briefcase
} from "lucide-react";

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
  parentProfile?: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    suburb?: string;
  };
}

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id;
  const { user, activeRole } = useAuth();
  const { toast } = useToast();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: [`/api/jobs/${jobId}`],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Job not found');
      }
      return response.json();
    },
    enabled: !!jobId
  });

  // Fetch caregiver profile for current user
  const { data: caregiverProfile } = useQuery({
    queryKey: ['/api/caregiver/profile', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/caregiver/profile/${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch caregiver profile');
      return res.json();
    },
    enabled: !!user?.id && activeRole === 'caregiver'
  });

  const handleApply = () => {
    if (!caregiverProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your caregiver profile before applying to jobs.",
        variant: "destructive",
      });
      return;
    }
    setShowApplicationModal(true);
  };

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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/job-board">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job Board
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/job-board">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Job Board
            </Button>
          </Link>
        </div>

        {/* Job Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  {job.title || 'Childcare Position'}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {job.parentProfile?.firstName} {job.parentProfile?.lastName}
                  </span>
                  {job.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {job.status === 'active' ? 'Active' : job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Job Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hourly Rate</p>
                  <p className="font-semibold text-gray-900">${job.rate}/hour</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hours per Week</p>
                  <p className="font-semibold text-gray-900">{job.hoursPerWeek} hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Children</p>
                  <p className="font-semibold text-gray-900">{job.numChildren} child{job.numChildren !== 1 ? 'ren' : ''}</p>
                </div>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(job.startDate).toLocaleDateString('en-AU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Posted Date */}
            <div className="text-sm text-gray-500 border-t pt-4">
              Posted on {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-AU') : 'Recently'}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/job-board">
            <Button variant="outline" className="flex-1">
              View More Jobs
            </Button>
          </Link>
          {activeRole === 'caregiver' ? (
            <Button onClick={handleApply} className="flex-1">
              <Briefcase className="w-4 h-4 mr-2" />
              Apply for Job
            </Button>
          ) : (
            <Link href={`/messages?parentId=${job.parentId}&jobId=${job.id}&jobTitle=${encodeURIComponent(job.title || 'Childcare Position')}`}>
              <Button className="flex-1">
                Contact Family
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && job && caregiverProfile && (
        <CaregiverApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={{
            id: job.id,
            title: job.title,
            parentId: job.parentId,
            parentName: job.parentName || 'Parent',
            location: job.location,
            hourlyRate: job.hourlyRate,
            description: job.description
          }}
          caregiverProfile={{
            id: user?.id || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            bio: caregiverProfile.bio || '',
            experience: caregiverProfile.experience || '',
            location: caregiverProfile.location || '',
            hourlyRate: caregiverProfile.hourlyRate || '25',
            services: caregiverProfile.services || [],
            certificates: caregiverProfile.certificates || [],
            yearsOfExperience: caregiverProfile.yearsOfExperience || 0,
            averageRating: caregiverProfile.averageRating || '5.0',
            profilePhoto: caregiverProfile.profilePhoto
          }}
        />
      )}
    </div>
  );
}