import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, DollarSign, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Get booking ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('booking_id');
    if (id) {
      setBookingId(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-lg">
                Your booking has been confirmed and payment processed securely.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-3">What happens next?</h3>
              <div className="space-y-3 text-sm text-green-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Your booking is confirmed with the caregiver</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>Payment will be held securely until 24 hours after service completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4" />
                  <span>Funds will be automatically released to the caregiver after the holding period</span>
                </div>
              </div>
            </div>

            {bookingId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Booking Reference: <span className="font-mono font-semibold">{bookingId}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/parent-dashboard')}
                className="w-full bg-coral hover:bg-coral/90"
              >
                View My Bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation('/search-caregivers')}
                className="w-full"
              >
                Book Another Caregiver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}