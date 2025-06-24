import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Shield, 
  Clock, 
  Calendar,
  ArrowRight,
  Home,
  MessageCircle
} from "lucide-react";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    // Get booking details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking_id');
    
    // Mock booking details for demo
    setBookingDetails({
      id: bookingId || 'demo-booking-123',
      caregiverName: 'Sarah Johnson',
      startDate: '2024-12-28',
      endDate: '2024-12-28',
      hoursPerDay: 8,
      ratePerHour: 25,
      totalAmount: 75,
      serviceFee: 7.5,
      caregiverAmount: 67.5
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your booking is confirmed</p>
        </div>

        <div className="space-y-6">
          {/* Payment Protection Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Payment Held Securely</h3>
                  <p className="text-green-800 text-sm leading-relaxed">
                    Your payment is held securely by VIVALY and will be released to the caregiver 
                    24 hours after job completion. This ensures both parties are protected and 
                    satisfied with the arrangement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {bookingDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{bookingDetails.caregiverName}</p>
                    <p className="text-sm text-gray-600">Verified Caregiver</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Booked
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(bookingDetails.startDate).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{bookingDetails.hoursPerDay} hours</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rate</p>
                    <p className="font-medium">${bookingDetails.ratePerHour}/hour</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-medium text-xs">{bookingDetails.id.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Cost</span>
                    <span>${(bookingDetails.totalAmount - bookingDetails.serviceFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>${bookingDetails.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Paid</span>
                    <span className="text-[#FF5F7E]">${bookingDetails.totalAmount.toFixed(2)} AUD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#FF5F7E]" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF5F7E] text-white text-xs flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-medium">Caregiver Confirmation</p>
                  <p className="text-sm text-gray-600">Your caregiver will receive notification and confirm availability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF5F7E] text-white text-xs flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-medium">Service Day</p>
                  <p className="text-sm text-gray-600">Enjoy your childcare service with peace of mind</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-medium">Automatic Payment Release</p>
                  <p className="text-sm text-gray-600">Payment automatically released to caregiver 24 hours after completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button 
              onClick={() => navigate('/messages')}
              className="bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Caregiver
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Support */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-blue-800 mb-2">Need help with your booking?</p>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-800">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}