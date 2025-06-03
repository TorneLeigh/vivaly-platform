import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users, 
  Heart,
  Phone,
  Mail,
  CheckCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import { useState } from "react";
import type { Nanny, User, Review } from "@shared/schema";

type CaregiverWithUser = Nanny & { user: User };
type ReviewWithUser = Review & { reviewer: User };

export default function CaregiverProfile() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { data: caregiver, isLoading } = useQuery<CaregiverWithUser>({
    queryKey: ["/api/nannies", id],
    enabled: !!id,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews/nanny", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Caregiver Not Found</h1>
          <p className="text-gray-600">The caregiver profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={caregiver.user.profileImage || ""} />
              <AvatarFallback className="text-2xl">
                {caregiver.user.firstName[0]}{caregiver.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {caregiver.user.firstName} {caregiver.user.lastName}
                </h1>
                {caregiver.isVerified && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(parseFloat(caregiver.rating))}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {caregiver.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({caregiver.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{caregiver.suburb}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {caregiver.services.map((service: string) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {caregiver.experience} years experience
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${caregiver.hourlyRate}/hour
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="lg" style={{ backgroundColor: '#FF6B35' }} className="text-white">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {caregiver.user.firstName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {caregiver.bio}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {caregiver.services.map((service: string) => (
                    <div key={service} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {caregiver.certificates.map((cert: string) => (
                    <div key={cert} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {review.reviewer.firstName[0]}{review.reviewer.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {review.reviewer.firstName} {review.reviewer.lastName}
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-500 ml-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{caregiver.user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{caregiver.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{caregiver.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Check</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Verified</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">References Checked</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}