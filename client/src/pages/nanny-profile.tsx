import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCalendar from "@/components/booking-calendar";
import MessageThread from "@/components/message-thread";
import MobileBookingFlow from "@/components/mobile-booking-flow";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  Award,
  Heart
} from "lucide-react";
import type { Nanny, User, Review, Booking } from "@shared/schema";

export default function NannyProfile() {
  const [, params] = useRoute("/nanny/:id");
  const nannyId = parseInt(params?.id || "0");
  const [activeTab, setActiveTab] = useState("overview");
  const [showMessages, setShowMessages] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const { toast } = useToast();

  // Mock current user - in a real app this would come from auth context
  const currentUserId = 5; // parent user

  const { data: nannyProfile, isLoading } = useQuery({
    queryKey: ["/api/nannies", nannyId],
    enabled: !!nannyId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/reviews/nanny", nannyId],
    enabled: !!nannyId,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: {
      date: Date;
      startTime: string;
      endTime: string;
      serviceType: string;
      notes: string;
    }) => {
      const startDateTime = new Date(bookingData.date);
      const [startHour, startMinute] = bookingData.startTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(bookingData.date);
      const [endHour, endMinute] = bookingData.endTime.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      const totalAmount = duration * parseFloat(nannyProfile.hourlyRate);

      return apiRequest("POST", "/api/bookings", {
        nannyId,
        parentId: currentUserId,
        serviceType: bookingData.serviceType,
        date: startDateTime.toISOString(),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: totalAmount.toString(),
        notes: bookingData.notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent!",
        description: "The nanny will be notified and respond to your request soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking request.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!nannyProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Nanny Not Found</h1>
            <p className="text-gray-600">The nanny profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, ...nanny } = nannyProfile;
  const fullName = `${user.firstName} ${user.lastName}`;
  const profileImage = user.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileImage} alt={fullName} />
                    <AvatarFallback className="text-2xl">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-warm-gray">{fullName}</h1>
                      <div className="flex items-center text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{nanny.suburb}, Sydney</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold ml-1">{nanny.rating}</span>
                        <span className="text-gray-500 ml-1">({nanny.reviewCount} reviews)</span>
                      </div>
                      <div className="text-2xl font-bold text-warm-gray">
                        {formatCurrency(nanny.hourlyRate!)}/hr
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {nanny.isVerified && (
                      <Badge className="bg-soft-green bg-opacity-10 text-soft-green">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {nanny.experience}+ years exp
                    </Badge>
                    {nanny.certificates.slice(0, 3).map((cert, index) => (
                      <Badge key={index} variant="outline">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setShowMessages(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    {/* Desktop booking button */}
                    <Button 
                      onClick={() => setActiveTab("booking")}
                      className="hidden md:flex flex-1 bg-coral hover:bg-coral/90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    {/* Mobile booking button */}
                    <Button 
                      onClick={() => setShowMobileBooking(true)}
                      className="md:hidden flex-1 bg-coral hover:bg-coral/90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {activeTab === "booking" ? (
                <BookingCalendar
                  nannyId={nannyId}
                  hourlyRate={nanny.hourlyRate!}
                  onBooking={(bookingData) => bookingMutation.mutate(bookingData)}
                />
              ) : showMessages ? (
                <MessageThread
                  currentUserId={currentUserId}
                  otherUserId={user.id}
                  otherUser={user}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Contact via platform messaging only</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Verified email on file</span>
                    </div>
                    <Button 
                      onClick={() => setShowMessages(true)}
                      className="w-full bg-coral hover:bg-coral/90"
                    >
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About {user.firstName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {nanny.bio || `Experienced childcare provider with ${nanny.experience}+ years of experience caring for children of all ages. Passionate about creating a safe, nurturing environment where children can learn and grow.`}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Experience</h4>
                      <p className="text-gray-600">{nanny.experience}+ years in childcare</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Location</h4>
                      <p className="text-gray-600">{nanny.suburb}, Sydney NSW</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Hourly Rate</h4>
                      <p className="text-gray-600">{formatCurrency(nanny.hourlyRate!)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nanny.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-5 h-5 text-trust-blue mr-3" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nanny.services.map((service, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <Heart className="w-5 h-5 text-coral mr-3" />
                      <div>
                        <h4 className="font-medium">{service}</h4>
                        <p className="text-sm text-gray-600">Professional care service</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-600">No reviews yet. Be the first to book and review!</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review: Review & { reviewer: User }) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarFallback>
                              {review.reviewer.firstName.charAt(0)}{review.reviewer.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.reviewer.firstName}</h4>
                            <p className="text-sm text-gray-600">{formatDate(review.createdAt!)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="booking" className="mt-6">
            <div className="max-w-md mx-auto">
              <BookingCalendar
                nannyId={nannyId}
                hourlyRate={nanny.hourlyRate!}
                onBooking={(bookingData) => bookingMutation.mutate(bookingData)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Booking Flow */}
      {showMobileBooking && nannyProfile && (
        <MobileBookingFlow
          caregiver={{
            id: nanny.id,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              profileImage: user.profileImage || undefined,
            },
            hourlyRate: nanny.hourlyRate || "0",
            rating: nanny.rating || "0",
            reviewCount: nanny.reviewCount || 0,
            location: `${nanny.suburb}, Sydney`,
            bio: nanny.bio || "",
            isVerified: nanny.isVerified || false,
            serviceTypes: nanny.services || [],
          }}
          onClose={() => setShowMobileBooking(false)}
        />
      )}
    </div>
  );
}
