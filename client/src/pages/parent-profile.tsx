import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import ReferralPopup from "@/components/ReferralPopup";
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
  Edit,
  Briefcase,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Trash2
} from "lucide-react";
import { MultiPhotoUpload } from "@/components/MultiPhotoUpload";
import { Badge } from "@/components/ui/badge";

export default function ParentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("basic-info");
  const [videoUploading, setVideoUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState<Array<{id: string, url: string, isMain?: boolean}>>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state for each section
  const [formData, setFormData] = useState({
    // Basic Info
    homeAddress: '',
    suburb: '',
    bio: '',
    
    // Family & Children
    numberOfChildren: 1,
    languagesSpoken: '',
    pets: '',
    
    // Children Details
    children: [{ name: '', age: '', grade: '' }],
    
    // Health & Medical
    allergies: '',
    medications: '',
    emergencyContact: '',
    
    // Essential Requirements
    essentialRequirements: [],
    experienceRequired: '',
    qualifications: '',
    backgroundCheck: '',
    
    // Position Details
    positionType: '',
    schedule: '',
    startDate: '',
    hoursPerWeek: '',
    rate: '',
    
    // Responsibilities
    responsibilities: [],
    childcareDuties: '',
    householdTasks: '',
    educationalSupport: '',
    transportation: '',
    
    // Caregiver Preferences
    caregiverPreferences: '',
    languagesRequired: '',
    carRequired: '',
    swimmingAbility: '',
    agePreference: '',
    genderPreference: '',
    smokingPolicy: '',
    
    // Household Rules
    householdRules: '',
    screenTimeRules: '',
    mealGuidelines: '',
    disciplineApproach: '',
    bedtimeRoutine: '',
    visitorsPolicy: '',
    
    // Safety & Emergency
    emergencyProcedures: '',
    emergencyContact1: '',
    emergencyContact2: '',
    doctorContact: '',
    hospitalContact: '',
    policeFireContact: '',
    poisonControlContact: '',
    
    // Personal Touch
    personalMessage: '',
    funFamilyFacts: '',
    familyValues: ''
  });

  // Fetch user's jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/jobs/my'],
    queryFn: () => apiRequest('GET', '/api/jobs/my'),
    enabled: !!user
  });

  // Fetch user's profile photos
  const { data: photos = [], refetch: refetchPhotos } = useQuery({
    queryKey: ['/api/profile-photos'],
    queryFn: () => apiRequest('GET', '/api/profile-photos'),
    enabled: !!user
  });

  const fetchProfilePhotos = () => {
    refetchPhotos();
    setProfilePhotos(photos);
  };

  const sidebarItems = [
    { id: "basic-info", label: "Basic Info", icon: User, active: true },
    { id: "photos", label: "Photos", icon: Camera },
    { id: "family-children", label: "Family & Children", icon: Users },
    { id: "children-details", label: "Children Details", icon: Baby },
    { id: "health-medical", label: "Health & Medical", icon: Heart },
    { id: "essential-requirements", label: "Essential Requirements", icon: CheckCircle },
    { id: "position-details", label: "Position Details", icon: FileText },
    { id: "responsibilities", label: "Responsibilities", icon: Star },
    { id: "caregiver-preferences", label: "Caregiver Preferences", icon: Star },
    { id: "household-rules", label: "Household Rules", icon: Home },
    { id: "safety-emergency", label: "Safety & Emergency", icon: Shield },
    { id: "personal-touch", label: "Personal Touch", icon: MessageCircle }
  ];

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('parentProfileData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      localStorage.setItem('parentProfileData', JSON.stringify(newData));
      return newData;
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await apiRequest('PUT', '/api/parent/profile', formData);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSectionData = async (sectionKey: string, sectionData: any) => {
    setSaving(true);
    try {
      const updatedData = { ...formData, ...sectionData };
      await apiRequest('PUT', '/api/parent/profile', updatedData);
      updateFormData(sectionKey, sectionData);
      toast({
        title: "Success",
        description: "Section saved successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save section",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    if (!formData) return 0;
    
    const profileFields = [
      formData.homeAddress,
      formData.suburb,
      formData.bio,
      formData.numberOfChildren,
      formData.languagesSpoken,
      formData.pets,
      formData.children?.length > 0 && formData.children[0]?.name,
      formData.caregiverPreferences,
      formData.householdRules,
      formData.personalMessage
    ];
    
    const filled = profileFields.filter(field => {
      if (Array.isArray(field)) {
        return field.length > 0;
      }
      return field && field.toString().trim() !== '';
    });
    
    return Math.round((filled.length / profileFields.length) * 100);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, GIF, or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be under 5MB",
        variant: "destructive"
      });
      return;
    }

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload photo");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: data.message || "Photo uploaded successfully!",
      });

      // Refresh photos and user data
      refetchPhotos();
      
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setPhotoUploading(false);
    }
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

      {/* Email and phone are private - only shown after booking confirmation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Privacy Protected:</strong> Contact details are kept private and only shared with confirmed, paid bookings for security.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input
          id="homeAddress"
          placeholder="123 Main Street, Sydney NSW 2000"
          value={formData.homeAddress}
          onChange={(e) => updateFormData('homeAddress', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suburb">Suburb</Label>
        <Input
          id="suburb"
          placeholder="Bondi Beach"
          value={formData.suburb}
          onChange={(e) => updateFormData('suburb', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          placeholder="Tell caregivers about your family..."
          value={formData.bio}
          onChange={(e) => updateFormData('bio', e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
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
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Photos</h3>
        <p className="text-gray-600 mb-4">Add photos to help caregivers get to know your family</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Display existing photos */}
          {photos.map((photo: any, index: number) => (
            <div key={photo.id || index} className="aspect-square rounded-lg overflow-hidden relative">
              <img 
                src={photo.url} 
                alt={`Profile photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {photo.isMain && (
                <div className="absolute top-2 left-2">
                  <Badge variant="default" className="bg-blue-600 text-white text-xs">
                    Main Photo
                  </Badge>
                </div>
              )}
            </div>
          ))}
          
          {/* Add Photo Button */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors">
            <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {photoUploading ? "Uploading..." : "Add Photo"}
                </p>
              </div>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              disabled={photoUploading}
              className="hidden"
            />
          </div>
        </div>
        
        {/* Upload Guidelines */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Photo Guidelines</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Upload clear, well-lit photos of your family</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Supported formats: JPG, PNG, GIF, WebP</li>
            <li>• First photo uploaded becomes your main profile photo</li>
          </ul>
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
            <Input 
              placeholder="2" 
              value={formData.numberOfChildren}
              onChange={(e) => updateFormData('numberOfChildren', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label>Languages Spoken</Label>
            <Input 
              placeholder="English, Spanish" 
              value={formData.languagesSpoken}
              onChange={(e) => updateFormData('languagesSpoken', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pets</Label>
            <Input 
              placeholder="1 dog, 2 cats" 
              value={formData.pets}
              onChange={(e) => updateFormData('pets', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderChildrenDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Children Details</h3>
        <div className="space-y-4">
          {formData.children.map((child, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Child {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Emma"
                    value={child.name}
                    onChange={(e) => {
                      const newChildren = [...formData.children];
                      newChildren[index] = { ...child, name: e.target.value };
                      updateFormData('children', newChildren);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    placeholder="5"
                    value={child.age}
                    onChange={(e) => {
                      const newChildren = [...formData.children];
                      newChildren[index] = { ...child, age: e.target.value };
                      updateFormData('children', newChildren);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input
                    placeholder="Kindergarten"
                    value={child.grade}
                    onChange={(e) => {
                      const newChildren = [...formData.children];
                      newChildren[index] = { ...child, grade: e.target.value };
                      updateFormData('children', newChildren);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const newChildren = [...formData.children, { name: '', age: '', grade: '' }];
                updateFormData('children', newChildren);
              }}
            >
              Add Another Child
            </Button>
            {formData.children.length > 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  const newChildren = formData.children.slice(0, -1);
                  updateFormData('children', newChildren);
                }}
              >
                Remove Last Child
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
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

      {/* Profile Completion & Job Posts - Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={calculateCompletion()} className="w-full" />
                <p className="text-sm text-gray-500">{calculateCompletion()}% complete</p>
                <p className="text-sm text-gray-600">Complete your profile to attract the best caregivers</p>
              </div>
            </CardContent>
          </Card>

          {/* Video Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Intro Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Upload a short video about your family (Max 60MB)
                </p>
                <Input 
                  type="file" 
                  accept="video/mp4,video/quicktime,video/x-msvideo" 
                  onChange={handleVideoUpload}
                  disabled={videoUploading}
                />
                {videoUploading && (
                  <p className="text-sm text-gray-500">Uploading...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Job Posts */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Your Active Job Posts
              </CardTitle>
              <Button onClick={() => setLocation("/post-job")}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
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
                {jobs.map((job: any) => (
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
              {activeSection === "photos" && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Photos</h3>
                <p className="text-gray-600 mb-6">Add multiple photos to help caregivers get to know your family</p>
                
                <MultiPhotoUpload 
                  photos={photos}
                  onPhotosChange={refetchPhotos}
                  maxPhotos={10}
                />
              </div>
            </div>
          </div>
        )}
              {activeSection === "family-children" && renderFamilyChildren()}
              {activeSection === "children-details" && renderChildrenDetails()}
              {activeSection === "health-medical" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Health & Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <Input 
                        value={formData.allergies}
                        onChange={(e) => updateFormData('allergies', e.target.value)}
                        placeholder="None" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medications</Label>
                      <Input 
                        value={formData.medications}
                        onChange={(e) => updateFormData('medications', e.target.value)}
                        placeholder="None" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input 
                        value={formData.emergencyContact}
                        onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                        placeholder="Dr. Smith - (555) 123-4567" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSectionData('healthMedical', {
                        allergies: formData.allergies,
                        medications: formData.medications,
                        emergencyContact: formData.emergencyContact
                      })}
                      disabled={saving}
                      className="bg-coral hover:bg-coral/90"
                    >
                      {saving ? "Saving..." : "Save Health & Medical Information"}
                    </Button>
                  </div>
                </div>
              )}
              {activeSection === "essential-requirements" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Essential Requirements</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Experience Required</Label>
                      <Input 
                        value={formData.experienceRequired || ''}
                        onChange={(e) => updateFormData('experienceRequired', e.target.value)}
                        placeholder="2+ years with children" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Qualifications</Label>
                      <Input 
                        value={formData.qualifications || ''}
                        onChange={(e) => updateFormData('qualifications', e.target.value)}
                        placeholder="First Aid, CPR certified" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Check</Label>
                      <Input 
                        value={formData.backgroundCheck || ''}
                        onChange={(e) => updateFormData('backgroundCheck', e.target.value)}
                        placeholder="Required" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSectionData('essentialRequirements', {
                        experienceRequired: formData.experienceRequired,
                        qualifications: formData.qualifications,
                        backgroundCheck: formData.backgroundCheck
                      })}
                      disabled={saving}
                      className="bg-coral hover:bg-coral/90"
                    >
                      {saving ? "Saving..." : "Save Essential Requirements"}
                    </Button>
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
                    <div className="space-y-2">
                      <Label>Position Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring-help">Recurring help</SelectItem>
                          <SelectItem value="short-term">Short term</SelectItem>
                          <SelectItem value="last-minute-notice">Last minute notice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Availability Needed</Label>
                      <Input placeholder="Last minute coverage, emergency care, date nights" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "responsibilities" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Responsibilities</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Childcare Duties</Label>
                      <Input 
                        placeholder="Pick up from school, prepare meals, bedtime routine" 
                        value={formData.childcareDuties || ''}
                        onChange={(e) => updateFormData('childcareDuties', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Household Tasks</Label>
                      <Input 
                        placeholder="Light housekeeping, children's laundry, meal prep" 
                        value={formData.householdTasks || ''}
                        onChange={(e) => updateFormData('householdTasks', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Educational Support</Label>
                      <Input 
                        placeholder="Homework help, reading practice, educational activities" 
                        value={formData.educationalSupport || ''}
                        onChange={(e) => updateFormData('educationalSupport', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Transportation</Label>
                      <Input 
                        placeholder="School pickup, activities, appointments" 
                        value={formData.transportation || ''}
                        onChange={(e) => updateFormData('transportation', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSectionData('responsibilities', {
                        childcareDuties: formData.childcareDuties,
                        householdTasks: formData.householdTasks,
                        educationalSupport: formData.educationalSupport,
                        transportation: formData.transportation
                      })}
                      disabled={saving}
                      className="bg-coral hover:bg-coral/90"
                    >
                      {saving ? "Saving..." : "Save Responsibilities"}
                    </Button>
                  </div>
                </div>
              )}
              {activeSection === "caregiver-preferences" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Caregiver Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Languages Required</Label>
                      <Input 
                        placeholder="English, Spanish" 
                        value={formData.languagesRequired || ''}
                        onChange={(e) => updateFormData('languagesRequired', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Car Required</Label>
                      <Input 
                        placeholder="Yes, own reliable vehicle" 
                        value={formData.carRequired || ''}
                        onChange={(e) => updateFormData('carRequired', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Swimming Ability</Label>
                      <Input 
                        placeholder="Must be confident swimmer" 
                        value={formData.swimmingAbility || ''}
                        onChange={(e) => updateFormData('swimmingAbility', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age Preference</Label>
                      <Input 
                        placeholder="25-45 years old" 
                        value={formData.agePreference || ''}
                        onChange={(e) => updateFormData('agePreference', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender Preference</Label>
                      <Input 
                        placeholder="No preference" 
                        value={formData.genderPreference || ''}
                        onChange={(e) => updateFormData('genderPreference', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Smoking Policy</Label>
                      <Input 
                        placeholder="Non-smoker only" 
                        value={formData.smokingPolicy || ''}
                        onChange={(e) => updateFormData('smokingPolicy', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSectionData('caregiverPreferences', {
                        languagesRequired: formData.languagesRequired,
                        carRequired: formData.carRequired,
                        swimmingAbility: formData.swimmingAbility,
                        agePreference: formData.agePreference,
                        genderPreference: formData.genderPreference,
                        smokingPolicy: formData.smokingPolicy
                      })}
                      disabled={saving}
                      className="bg-coral hover:bg-coral/90"
                    >
                      {saving ? "Saving..." : "Save Caregiver Preferences"}
                    </Button>
                  </div>
                </div>
              )}
              {activeSection === "household-rules" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Household Rules</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Screen Time Rules</Label>
                      <Input 
                        placeholder="1 hour on weekdays, 2 hours weekends" 
                        value={formData.screenTimeRules || ''}
                        onChange={(e) => updateFormData('screenTimeRules', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Meal Guidelines</Label>
                      <Input 
                        placeholder="Healthy snacks only, no sugary drinks" 
                        value={formData.mealGuidelines || ''}
                        onChange={(e) => updateFormData('mealGuidelines', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discipline Approach</Label>
                      <Input 
                        placeholder="Positive reinforcement, time-outs if needed" 
                        value={formData.disciplineApproach || ''}
                        onChange={(e) => updateFormData('disciplineApproach', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bedtime Routine</Label>
                      <Input 
                        placeholder="Bath, story, lights out by 8pm" 
                        value={formData.bedtimeRoutine || ''}
                        onChange={(e) => updateFormData('bedtimeRoutine', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Visitors Policy</Label>
                      <Input 
                        placeholder="No visitors without prior approval" 
                        value={formData.visitorsPolicy || ''}
                        onChange={(e) => updateFormData('visitorsPolicy', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSectionData('householdRules', {
                        screenTimeRules: formData.screenTimeRules,
                        mealGuidelines: formData.mealGuidelines,
                        disciplineApproach: formData.disciplineApproach,
                        bedtimeRoutine: formData.bedtimeRoutine,
                        visitorsPolicy: formData.visitorsPolicy
                      })}
                      disabled={saving}
                      className="bg-coral hover:bg-coral/90"
                    >
                      {saving ? "Saving..." : "Save Household Rules"}
                    </Button>
                  </div>
                </div>
              )}
              {activeSection === "safety-emergency" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Safety & Emergency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Emergency Contact 1</Label>
                      <Input placeholder="Parent: (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact 2</Label>
                      <Input placeholder="Grandparent: (555) 987-6543" />
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Input placeholder="Dr. Smith: (555) 246-8135" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hospital</Label>
                      <Input placeholder="City General Hospital" />
                    </div>
                    <div className="space-y-2">
                      <Label>Safety Equipment</Label>
                      <Input placeholder="First aid kit, fire extinguisher locations" />
                    </div>
                    <div className="space-y-2">
                      <Label>Special Instructions</Label>
                      <Input placeholder="Pool safety, gate codes, alarm system" />
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "personal-touch" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Touch</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Family Values</Label>
                      <Input placeholder="Kindness, respect, honesty, hard work" />
                    </div>
                    <div className="space-y-2">
                      <Label>Communication Style</Label>
                      <Input placeholder="Daily updates, weekly check-ins" />
                    </div>
                    <div className="space-y-2">
                      <Label>Activities We Love</Label>
                      <Input placeholder="Outdoor play, reading, arts and crafts" />
                    </div>
                    <div className="space-y-2">
                      <Label>What We're Looking For</Label>
                      <Input placeholder="Someone who becomes part of our family" />
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Input placeholder="Feel free to ask any questions!" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Referral Popup */}
      {user && (
        <ReferralPopup 
          userRole="parent" 
          userName={user.firstName || 'User'} 
        />
      )}
    </div>
  );
}