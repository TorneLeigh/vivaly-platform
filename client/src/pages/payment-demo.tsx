import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Shield, 
  Calendar,
  DollarSign,
  CreditCard,
  User,
  ExternalLink
} from "lucide-react";

export default function PaymentDemo() {
  const [, navigate] = useLocation();
  const [stripeReady, setStripeReady] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Test Stripe configuration
    const testStripe = async () => {
      try {
        const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (publicKey && publicKey.startsWith('pk_')) {
          setStripeReady(true);
        }
      } catch (error) {
        console.error('Stripe test failed:', error);
      }
    };
    testStripe();
  }, []);

  const handleOpenPayment = () => {
    navigate('/test-payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid gap-6">
          {/* Demo Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-[#FF5F7E]" />
                <span>VIVALY Payment System Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Experience the complete payment flow for childcare bookings on the VIVALY platform.
              </p>

              <div className={`border rounded-lg p-4 ${stripeReady ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className={`h-5 w-5 ${stripeReady ? 'text-green-600' : 'text-yellow-600'}`} />
                  <span className={`font-medium ${stripeReady ? 'text-green-800' : 'text-yellow-800'}`}>
                    Stripe Integration {stripeReady ? 'Ready' : 'Checking...'}
                  </span>
                </div>
                <p className={`text-sm ${stripeReady ? 'text-green-700' : 'text-yellow-700'}`}>
                  {stripeReady 
                    ? 'Payment processing configured and ready for testing.'
                    : 'Verifying payment configuration...'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Demo Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional booking summary with caregiver verification</li>
                  <li>• Detailed cost breakdown including platform fees and GST</li>
                  <li>• Live Stripe payment form with test card support</li>
                  <li>• Payment protection messaging (24-hour hold system)</li>
                  <li>• Success confirmation flow</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Sample Booking Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                <span>Sample Booking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#FF5F7E] rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Experienced Caregiver</p>
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">Dec 28, 2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium">8 hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Rate</p>
                  <p className="font-medium">$25/hour</p>
                </div>
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium text-[#FF5F7E]">$75 AUD</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Instructions */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Test Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-800 space-y-2">
              <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
              <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
              <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
            </CardContent>
          </Card>

          {/* Launch Demo Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleOpenPayment}
                className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white h-12"
                size="lg"
                disabled={!stripeReady}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>{stripeReady ? 'Launch Payment Demo' : 'Preparing Payment System...'}</span>
                </div>
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">
                {stripeReady ? 'Test the complete payment flow' : 'Please wait while we verify configuration'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}