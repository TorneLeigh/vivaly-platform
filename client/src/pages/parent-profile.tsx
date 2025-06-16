import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  User, 
  Camera, 
  Users, 
  Baby, 
  Heart, 
  UserCheck, 
  PawPrint, 
  CheckCircle, 
  FileText, 
  Star,
  Home,
  Shield,
  MessageCircle,
  Eye,
  Edit
} from "lucide-react";

export default function ParentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("basic-info");
  const [videoUploading, setVideoUploading] = useState(false);

  // Fetch user's jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/jobs/my'],
    queryFn: () => apiRequest('GET', '/api/jobs/my'),
    enabled: !!user
  });

  const sidebarItems = [
    { id: "basic-info", label: "Basic Info", icon: User, active: true },
    { id: "photos", label: "Photos", icon: Camera },
    { id: "family-children", label: "Family & Children", icon: Users },
    { id: "children-details", label: "Children Details", icon: Baby },
    { id: "health-medical", label: "Health & Medical", icon: Heart },
    { id: "elderly-care", label: "Elderly Care", icon: UserCheck },
    { id: "pet-care", label: "Pet Care", icon: PawPrint },
    { id: "essential-requirements", label: "Essential Requirements", icon: CheckCircle },
    { id: "position-details", label: "Position Details", icon: FileText },
    { id: "responsibilities", label: "Responsibilities", icon: Star },
    { id: "caregiver-preferences", label: "Caregiver Preferences", icon: Star },
    { id: "household-rules", label: "Household Rules", icon: Home },
    { id: "safety-emergency", label: "Safety & Emergency", icon: Shield },
    { id: "personal-touch", label: "Personal Touch", icon: MessageCircle }
  ];

  const calculateCompletion = () => {
    if (!user) return 0;
    const fields = [
      user.firstName,
      user.lastName, 
      user.email,
      (user as any).phone,
      (user as any).suburb,
      (user as any).homeAddress,
      (user as any).introVideo,
      // Add other profile fields as they're completed
    ];
    const filled = fields.filter(f => f && f.toString().trim());
    return Math.round((filled.length / fields.length) * 100);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 60 * 1024 * 1024) {
      toast({ 
        title: "Video too large", 
        description: "Must be under 60MB", 
        variant: "destructive" 
      });
      return;
    }

    setVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload-intro-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({ 
          title: "Success",
          description: "Video uploaded successfully!" 
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: "Please try again",
        variant: "destructive" 
      });
    } finally {
      setVideoUploading(false);
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

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={user.firstName || ""}
            placeholder="torne"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={user.lastName || ""}
            placeholder="velk"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email || ""}
            placeholder="tornevelk1@gmail.com"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={(user as any).phone || ""}
            placeholder="0431553386"
            readOnly
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input
          id="homeAddress"
          placeholder="123 Main Street, Sydney NSW 2000"
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suburb">Suburb</Label>
        <Input
          id="suburb"
          placeholder="Bondi Beach"
          readOnly
        />
      </div>

      {/* Profile Completion */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <Label>Profile Completion</Label>
          <Progress value={calculateCompletion()} className="w-full" />
          <p className="text-sm text-gray-500">{calculateCompletion()}% complete</p>
        </div>
      </div>

      {/* Intro Video Section */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <div className="space-y-4">
          <Label>Intro Video</Label>
          <p className="text-sm text-gray-500">
            Upload a short 1-minute video about your family and what kind of caregiver you're looking for.
          </p>
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept="video/mp4,video/quicktime,video/x-msvideo" 
              onChange={handleVideoUpload}
              disabled={videoUploading}
            />
            {videoUploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>
        </div>
      </div>

      {/* Active Job Posts Section */}
      <div className="mt-8 p-6 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Your Active Job Posts</h3>
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No jobs posted yet.</p>
            <Button onClick={() => setLocation("/post-job")}>
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div key={job.id} className="border p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Starts: {new Date(job.startDate).toLocaleDateString()}</p>
                  <p>${job.rate}/hour — {job.hoursPerWeek} hours/week — {job.numChildren} child(ren)</p>
                  <p className="mt-2">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Photos</h3>
        <p className="text-gray-600 mb-4">Add photos to help caregivers get to know your family</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Add Photo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyChildren = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Family & Children</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Number of Children</Label>
            <Input placeholder="2" />
          </div>
          <div className="space-y-2">
            <Label>Family Type</Label>
            <Input placeholder="Nuclear family" />
          </div>
          <div className="space-y-2">
            <Label>Languages Spoken</Label>
            <Input placeholder="English, Spanish" />
          </div>
          <div className="space-y-2">
            <Label>Pets</Label>
            <Input placeholder="1 dog, 2 cats" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderChildrenDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Children Details</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Child 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Emma" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input placeholder="Kindergarten" />
              </div>
            </div>
          </div>
          <Button variant="outline">Add Another Child</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parent Profile</h1>
            <p className="text-gray-600 mt-1">Complete your profile to find the perfect caregiver</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-sm ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {(() => {
                  const activeItem = sidebarItems.find(item => item.id === activeSection);
                  const Icon = activeItem?.icon || User;
                  return (
                    <>
                      <Icon className="h-5 w-5" />
                      <span>{activeItem?.label || "Basic Information"}</span>
                    </>
                  );
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeSection === "basic-info" && renderBasicInfo()}
              {activeSection === "photos" && renderPhotos()}
              {activeSection === "family-children" && renderFamilyChildren()}
              {activeSection === "children-details" && renderChildrenDetails()}
              {activeSection === "health-medical" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Health & Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <Input placeholder="None" />
                    </div>
                    <div className="space-y-2">
                      <Label>Medical Conditions</Label>
                      <Input placeholder="None" />
                    </div>
                    <div className="space-y-2">
                      <Label>Medications</Label>
                      <Input placeholder="None" />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input placeholder="Dr. Smith - (555) 123-4567" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "elderly-care" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Elderly Care Requirements</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Care Type Needed</Label>
                      <Input placeholder="Companionship, Light housekeeping" />
                    </div>
                    <div className="space-y-2">
                      <Label>Special Requirements</Label>
                      <Input placeholder="Mobility assistance, medication reminders" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "pet-care" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Pet Care</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Pet Types</Label>
                      <Input placeholder="1 Dog, 2 Cats" />
                    </div>
                    <div className="space-y-2">
                      <Label>Care Requirements</Label>
                      <Input placeholder="Feeding, walking, basic care" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "essential-requirements" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Essential Requirements</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Experience Required</Label>
                      <Input placeholder="2+ years with children" />
                    </div>
                    <div className="space-y-2">
                      <Label>Qualifications</Label>
                      <Input placeholder="First Aid, CPR certified" />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Check</Label>
                      <Input placeholder="Required" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "position-details" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Position Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hours per Week</Label>
                      <Input placeholder="40" />
                    </div>
                    <div className="space-y-2">
                      <Label>Schedule</Label>
                      <Input placeholder="Monday-Friday, 8am-5pm" />
                    </div>
                    <div className="space-y-2">
                      <Label>Rate</Label>
                      <Input placeholder="$25/hour" />
                    </div>
                  </div>
                </div>
              )}
              {["responsibilities", "caregiver-preferences", "household-rules", "safety-emergency", "personal-touch"].includes(activeSection) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Section Coming Soon</h3>
                  <p className="text-gray-500">
                    This section is under development. Complete the other sections first.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}