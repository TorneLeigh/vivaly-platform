import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  ArrowRight,
  Calendar,
  CreditCard,
  CheckCircle
} from "lucide-react";

export default function TestBookingFlow() {
  const [, navigate] = useLocation();

  const testBookingData = {
    caregiver: {
      id: 'sarah-johnson',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 127
    },
    booking: {
      startDate: '2024-12-28',
      hoursPerDay: 8,
      location: 'Bondi Beach, NSW'
    },
    pricing: {
      ratePerHour: 25,
      total: 242
    }
  };

  const handleStartBookingFlow = () => {
    // Store test data and navigate to booking summary
    localStorage.setItem('testBookingFlow', JSON.stringify(testBookingData));
    navigate('/booking-summary?caregiver_id=sarah-johnson&test=true');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Complete Booking Flow</h1>
          <p className="text-gray-600">Experience the full booking and payment process</p>
        </div>

        <div className="space-y-6">
          {/* Flow Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Flow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF5F7E] text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Booking Summary</p>
                    <p className="text-sm text-gray-600">Review caregiver details, dates, and pricing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF5F7E] text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-600">Pay securely with Stripe (test mode)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF5F7E] text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Confirmation</p>
                    <p className="text-sm text-gray-600">Airbnb-style confirmation with all personal details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                Test Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Caregiver</p>
                  <p className="font-medium">{testBookingData.caregiver.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">Dec 28, 2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium">{testBookingData.booking.hoursPerDay} hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium text-[#FF5F7E]">${testBookingData.pricing.total} AUD</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Test Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800">
              <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> Any future date (e.g., 12/28)</p>
              <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
              <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
            </CardContent>
          </Card>

          {/* Start Flow Button */}
          <Button 
            onClick={handleStartBookingFlow}
            className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white h-12"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Start Complete Booking Flow
              <ArrowRight className="h-5 w-5" />
            </div>
          </Button>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}