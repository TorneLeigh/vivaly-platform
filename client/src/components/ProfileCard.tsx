import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Award, User } from "lucide-react";

interface ProfileCardProps {
  profileData: {
    firstName: string;
    lastName: string;
    location: string;
    hourlyRate: string;
    rating: string;
    experience: number;
    bio: string;
    services: string[];
    certificates: string[];
    profilePhoto?: string;
  };
}

export function ProfileCard({ profileData }: ProfileCardProps) {
  return (
    <Card className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardContent className="p-6">
        {/* Header with photo and basic info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {profileData.profilePhoto ? (
              <img 
                src={profileData.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="h-3 w-3" />
              {profileData.location}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{profileData.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{profileData.experience} years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rate */}
        <div className="text-center mb-4 p-3 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-green-600">${profileData.hourlyRate}</div>
          <div className="text-sm text-gray-600">per hour</div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Services
          </h4>
          <div className="flex flex-wrap gap-1">
            {profileData.services.slice(0, 4).map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                {service}
              </Badge>
            ))}
            {profileData.services.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{profileData.services.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Certifications */}
        {profileData.certificates.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
            <div className="flex flex-wrap gap-1">
              {profileData.certificates.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                  {cert}
                </Badge>
              ))}
              {profileData.certificates.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                  +{profileData.certificates.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Bio preview */}
        <div className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
          <p className="line-clamp-3">{profileData.bio}</p>
        </div>

        {/* Application indicator */}
        <div className="mt-4 text-center">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            Job Application Received
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}