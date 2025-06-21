import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  Heart,
  Award,
  Calendar,
  Phone,
  Mail
} from "lucide-react";

interface CaregiverProfileDisplayProps {
  user: any;
  className?: string;
}

export function CaregiverProfileDisplay({ user, className }: CaregiverProfileDisplayProps) {
  if (!user) return null;

  const services = user.services || [];
  const experience = user.experience || [];
  const certifications = user.certifications || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg bg-coral text-white">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-gray-500">(127 reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                {user.suburb && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.suburb}, NSW</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Available weekdays & weekends</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  WWCC Verified
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Award className="h-3 w-3 mr-1" />
                  First Aid Certified
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Heart className="h-3 w-3 mr-1" />
                  Background Checked
                </Badge>
              </div>

              {user.hourlyRate && (
                <div className="flex items-center space-x-1 text-lg font-semibold text-coral">
                  <DollarSign className="h-5 w-5" />
                  <span>${user.hourlyRate}/hour</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      {services.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About */}
      {user.bio && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">About Me</h3>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Experience</h3>
            <div className="space-y-3">
              {experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-coral pl-4">
                  <h4 className="font-medium text-gray-900">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.organization}</p>
                  <p className="text-xs text-gray-500">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Certifications & Training</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((cert: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Award className="h-4 w-4 text-coral" />
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Availability</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="text-center p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800">{day}</div>
                <div className="text-xs text-green-600">7AM - 7PM</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="space-y-2">
            {user.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}