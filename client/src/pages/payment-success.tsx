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
    // Get booking details from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking_id');
    const paymentIntentId = urlParams.get('payment_intent');
    
    // Fetch actual booking details and personal information
    const fetchBookingDetails = async () => {
      try {
        if (bookingId) {
          // In production, fetch from API
          const response = await fetch(`/api/bookings/${bookingId}`);
          if (response.ok) {
            const booking = await response.json();
            setBookingDetails(booking);
          } else {
            throw new Error('Booking not found');
          }
        } else {
          // Demo data with complete personal details
          setBookingDetails({
            id: 'VIV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            caregiverName: 'Sarah Johnson',
            caregiverPhone: '+61 4 1234 5678',
            caregiverEmail: 'sarah.johnson@email.com',
            startDate: '2024-12-28',
            endDate: '2024-12-28',
            hoursPerDay: 8,
            ratePerHour: 25,
            totalAmount: 75,
            serviceFee: 7.5,
            caregiverAmount: 67.5,
            // Parent's details
            parentName: 'Emma Wilson',
            parentEmail: 'emma.wilson@email.com',
            parentPhone: '+61 4 9876 5432',
            serviceAddress: '123 Beach Road, Bondi Beach NSW 2026',
            children: [
              { name: 'Olivia', age: 6 },
              { name: 'Lucas', age: 4 }
            ],
            specialInstructions: 'Children love outdoor activities. Olivia is allergic to nuts.',
            emergencyContact: {
              name: 'Mark Wilson',
              phone: '+61 4 5555 1234',
              relationship: 'Father'
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
        // Fallback to demo data
        setBookingDetails({
          id: 'DEMO-BOOKING',
          caregiverName: 'Demo Caregiver',
          error: 'Could not load booking details'
        });
      }
    };

    fetchBookingDetails();
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

          {/* Booking Confirmation Details */}
          {bookingDetails && !bookingDetails.error && (
            <>
              {/* Personal Details - Airbnb Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                    Your Booking Confirmation
                  </CardTitle>
                  <p className="text-sm text-gray-600">Confirmation ID: {bookingDetails.id}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Location */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Service Location</h4>
                    <p className="text-gray-700">{bookingDetails.serviceAddress}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Your Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{bookingDetails.parentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{bookingDetails.parentEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{bookingDetails.parentPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Caregiver Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{bookingDetails.caregiverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{bookingDetails.caregiverEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{bookingDetails.caregiverPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Children Information */}
                  {bookingDetails.children && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Children</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {bookingDetails.children.map((child: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-gray-600">{child.age} years old</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {bookingDetails.specialInstructions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                      <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded-lg">
                        {bookingDetails.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Emergency Contact */}
                  {bookingDetails.emergencyContact && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-red-700">Name:</span>
                            <span className="font-medium text-red-900">{bookingDetails.emergencyContact.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Phone:</span>
                            <span className="font-medium text-red-900">{bookingDetails.emergencyContact.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Relationship:</span>
                            <span className="font-medium text-red-900">{bookingDetails.emergencyContact.relationship}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">
                        {new Date(bookingDetails.startDate).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
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
                      <p className="font-medium">{bookingDetails.id}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Service Cost ({bookingDetails.hoursPerDay} hours × ${bookingDetails.ratePerHour})</span>
                      <span>${(bookingDetails.totalAmount - bookingDetails.serviceFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Service Fee</span>
                      <span>${bookingDetails.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Paid</span>
                      <span className="text-[#FF5F7E]">${bookingDetails.totalAmount.toFixed(2)} AUD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
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