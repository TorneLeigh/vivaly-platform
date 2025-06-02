import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Download,
  Share,
  Star
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Booking, Nanny, User } from "@shared/schema";

export default function BookingConfirmation() {
  const [location] = useLocation();
  const bookingId = new URLSearchParams(location.split('?')[1] || '').get('id');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['/api/bookings', bookingId],
    enabled: !!bookingId
  });

  const { data: nanny } = useQuery({
    queryKey: ['/api/nannies', booking?.nannyId],
    enabled: !!booking?.nannyId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!booking || !nanny) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookingDetails = {
    id: booking.id,
    date: new Date(booking.date),
    startTime: booking.startTime,
    endTime: booking.endTime,
    serviceType: booking.serviceType,
    totalAmount: booking.totalAmount,
    status: booking.status,
    notes: booking.notes
  };

  const caregiverDetails = {
    name: `${nanny.user.firstName} ${nanny.user.lastName}`,
    phone: nanny.user.phone,
    email: nanny.user.email,
    rating: nanny.rating,
    totalReviews: nanny.totalReviews,
    profileImage: nanny.user.profileImageUrl,
    verified: nanny.isVerified
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your care booking has been successfully confirmed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Booking Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-coral" />
                  Booking Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-semibold">#{bookingDetails.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Service Type</span>
                    <Badge variant="secondary">{bookingDetails.serviceType}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">{formatDate(bookingDetails.date)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">
                      {bookingDetails.startTime} - {bookingDetails.endTime}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800">{bookingDetails.status}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 text-lg">Total Amount</span>
                    <span className="font-bold text-xl text-coral">
                      {formatCurrency(bookingDetails.totalAmount)}
                    </span>
                  </div>
                </div>
                
                {bookingDetails.notes && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">Special Notes</h3>
                    <p className="text-gray-600">{bookingDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-coral" />
                  Contact Your Caregiver
                </h2>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> Contact details are now available since your booking is confirmed. 
                    Please reach out to coordinate meeting details.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${caregiverDetails.phone}`} className="font-semibold text-coral hover:underline">
                        {caregiverDetails.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${caregiverDetails.email}`} className="font-semibold text-coral hover:underline">
                        {caregiverDetails.email}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Link href={`/messages?user=${nanny.userId}`}>
                    <Button className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Caregiver Profile Card */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Caregiver</h2>
                
                <div className="text-center mb-6">
                  <img 
                    src={caregiverDetails.profileImage || '/placeholder-avatar.png'} 
                    alt={caregiverDetails.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg">{caregiverDetails.name}</h3>
                  {caregiverDetails.verified && (
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{caregiverDetails.rating}</span>
                  <span className="text-gray-600">({caregiverDetails.totalReviews} reviews)</span>
                </div>
                
                <div className="space-y-3">
                  <Link href={`/nanny-profile/${nanny.id}`}>
                    <Button variant="outline" className="w-full">
                      View Full Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-coral text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p>Contact your caregiver to confirm meeting location and any specific requirements</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-coral text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p>You'll receive an email confirmation with all these details</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-coral text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p>After your service, please leave a review to help other families</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/search">
            <Button>Book Another Caregiver</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}