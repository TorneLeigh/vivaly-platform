import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Shield, 
  Heart, 
  Users, 
  Calendar,
  Eye,
  Edit,
  ArrowLeft,
  Check,
  X
} from "lucide-react";
import { useLocation } from "wouter";

export default function ProfilePreview() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Determine if we're previewing caregiver or parent profile
  const isProviderRoute = location.includes('/provider-dashboard') || location.includes('/become-caregiver');
  const profileType = isProviderRoute ? 'caregiver' : 'parent';

  const { data: caregiverProfile, isLoading: caregiverLoading } = useQuery({
    queryKey: ["/api/nannies/profile", user?.id],
    enabled: profileType === 'caregiver' && !!user?.id,
  });

  const { data: parentProfile, isLoading: parentLoading } = useQuery({
    queryKey: ["/api/parent-profile", user?.id],
    enabled: profileType === 'parent' && !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to preview your profile</p>
            <Button onClick={() => setLocation('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = profileType === 'caregiver' ? caregiverLoading : parentLoading;
  const profile = profileType === 'caregiver' ? caregiverProfile : parentProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (profileType === 'caregiver') {
    return <CaregiverProfilePreview profile={profile} user={user} />;
  } else {
    return <ParentProfilePreview profile={profile} user={user} />;
  }
}

function CaregiverProfilePreview({ profile, user }: { profile: any; user: any }) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/provider-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2 text-blue-600">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Profile Preview</span>
              </div>
            </div>
            <Button onClick={() => setLocation('/profile')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <p className="text-gray-600 mt-2">This is how your profile appears to families searching for care</p>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Photos */}
              <div className="lg:w-1/3">
                {profile?.profilePhotos?.length > 0 ? (
                  <div className="space-y-4">
                    <img 
                      src={profile.profilePhotos[0]} 
                      alt="Main profile photo"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {profile.profilePhotos.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {profile.profilePhotos.slice(1, 4).map((photo: string, index: number) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Profile photo ${index + 2}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2" />
                      <p>No photos uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profile?.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-2xl font-bold text-coral">
                      <DollarSign className="h-6 w-6" />
                      {profile?.hourlyRate || '25'}/hr
                    </div>
                    {profile?.instantBookingEnabled && (
                      <Badge variant="secondary" className="mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        Instant Book
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold ml-1">{profile?.rating || '5.0'}</span>
                    <span className="text-gray-600 ml-1">({profile?.reviewCount || 0} reviews)</span>
                  </div>
                  {profile?.isVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.services?.length > 0 ? (
                      profile.services.map((service: string, index: number) => (
                        <Badge key={index} variant="outline">{service}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No services specified</span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{profile?.experience || 0} years of childcare experience</span>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="font-semibold mb-2">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profile?.bio || 'No description provided yet.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Background Checks & Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <VerificationItem 
                label="WWCC Check" 
                verified={profile?.hasWwcc} 
              />
              <VerificationItem 
                label="Police Check" 
                verified={profile?.hasPoliceCheck} 
              />
              <VerificationItem 
                label="First Aid/CPR" 
                verified={profile?.hasFirstAid} 
              />
              <VerificationItem 
                label="References" 
                verified={profile?.hasReferences} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability Calendar Preview */}
        {profile?.availabilityCalendar && Object.keys(profile.availabilityCalendar).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Availability Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Available dates with custom pricing shown to families
              </p>
              <div className="grid grid-cols-7 gap-2">
                {/* Sample calendar preview - would show actual availability */}
                <div className="text-center text-sm font-medium text-gray-500 p-2">Mon</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Tue</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Wed</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Thu</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Fri</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Sat</div>
                <div className="text-center text-sm font-medium text-gray-500 p-2">Sun</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ParentProfilePreview({ profile, user }: { profile: any; user: any }) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/parent-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2 text-blue-600">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Profile Preview</span>
              </div>
            </div>
            <Button onClick={() => setLocation('/parent-profile')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <p className="text-gray-600 mt-2">This is how your family profile appears to caregivers</p>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}'s Family
                </h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile?.location || 'Location not specified'}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <Heart className="h-3 w-3 mr-1" />
                  Family Profile
                </Badge>
              </div>
            </div>

            {/* Family Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Children Information</h3>
                {profile?.children?.length > 0 ? (
                  <div className="space-y-3">
                    {profile.children.map((child: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{child.name}</span>
                          <Badge variant="secondary">{child.age} years old</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{child.interests}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No children information provided</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Care Requirements</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Care Type:</span>
                    <span className="font-medium">{profile?.careType || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{profile?.frequency || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Budget Range:</span>
                    <span className="font-medium">${profile?.budgetMin || 25}-${profile?.budgetMax || 45}/hr</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* About Family */}
            <div>
              <h3 className="font-semibold mb-3">About Our Family</h3>
              <p className="text-gray-700 leading-relaxed">
                {profile?.aboutFamily || 'No family description provided yet.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Special Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Requirements & Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.requiredSkills?.length > 0 ? (
                    profile.requiredSkills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">No specific skills required</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Language Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.languages?.length > 0 ? (
                    profile.languages.map((language: string, index: number) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">English</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="font-medium ml-2">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium ml-2">{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VerificationItem({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      {verified ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className={`text-xs ${verified ? 'text-green-600' : 'text-red-500'}`}>
          {verified ? 'Verified' : 'Not verified'}
        </p>
      </div>
    </div>
  );
}