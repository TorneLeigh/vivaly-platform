import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Shield, 
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  CreditCard,
  CheckCircle
} from "lucide-react";

interface BookingSummaryData {
  caregiver: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    verificationBadges: string[];
    bio: string;
  };
  booking: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    hoursPerDay: number;
    location: string;
    specialRequests?: string;
  };
  pricing: {
    ratePerHour: number;
    subtotal: number;
    platformFee: number;
    gst: number;
    total: number;
  };
}

export default function BookingSummary() {
  const [, navigate] = useLocation();
  const [bookingData, setBookingData] = useState<BookingSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from URL params or state
    const urlParams = new URLSearchParams(window.location.search);
    const caregiverId = urlParams.get('caregiver_id');
    
    // Mock data for demo - in real app, fetch from API
    setBookingData({
      caregiver: {
        id: caregiverId || 'sarah-johnson',
        name: 'Sarah Johnson',
        rating: 4.9,
        reviewCount: 127,
        verificationBadges: ['WWCC', 'Police Check', 'First Aid'],
        bio: 'Experienced childcare professional with 8+ years caring for children of all ages. Certified in First Aid and passionate about early childhood development.'
      },
      booking: {
        startDate: '2024-12-28',
        endDate: '2024-12-28',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        hoursPerDay: 8,
        location: 'Bondi Beach, NSW',
        specialRequests: 'Light meal preparation, outdoor activities'
      },
      pricing: {
        ratePerHour: 25,
        subtotal: 200,
        platformFee: 20,
        gst: 22,
        total: 242
      }
    });
    setLoading(false);
  }, []);

  const handleProceedToPayment = () => {
    navigate('/payment-demo');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Booking information not found</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Review Your Booking</CardTitle>
              <p className="text-gray-600">Please review the details below before confirming payment</p>
            </CardHeader>
          </Card>

          {/* Caregiver Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#FF5F7E]" />
                Your Caregiver
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={bookingData.caregiver.avatar} />
                  <AvatarFallback className="bg-[#FF5F7E] text-white text-lg">
                    {bookingData.caregiver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{bookingData.caregiver.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{bookingData.caregiver.rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">({bookingData.caregiver.reviewCount} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {bookingData.caregiver.verificationBadges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{bookingData.caregiver.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {new Date(bookingData.booking.startDate).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{bookingData.booking.startTime} - {bookingData.booking.endTime}</p>
                      <p className="text-sm text-gray-500">({bookingData.booking.hoursPerDay} hours)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{bookingData.booking.location}</p>
                    </div>
                  </div>
                  {bookingData.booking.specialRequests && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                      <p className="text-sm bg-gray-50 p-2 rounded">{bookingData.booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#FF5F7E]" />
                Price Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>${bookingData.pricing.ratePerHour}/hour × {bookingData.booking.hoursPerDay} hours</span>
                  <span>${bookingData.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platform service fee</span>
                  <span>${bookingData.pricing.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GST</span>
                  <span>${bookingData.pricing.gst.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                  <span>Total (AUD)</span>
                  <span className="text-[#FF5F7E]">${bookingData.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Protection */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-1">Payment Protection</h4>
                  <p>Your payment is held securely until 24 hours after service completion. This ensures both you and your caregiver are protected.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <Button 
            onClick={handleProceedToPayment}
            className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white h-12"
            size="lg"
          >
            Confirm & Pay ${bookingData.pricing.total.toFixed(2)} AUD
          </Button>
        </div>
      </div>
    </div>
  );
}