import { useState } from "react";
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

  const handleOpenPayment = () => {
    // Open test payment in new tab to avoid module loading conflicts
    window.open('/test-payment', '_blank');
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Secure Stripe Integration</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Fully integrated with Stripe payment processing using live test API keys.
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
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Launch Payment Demo</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Opens in new tab to demonstrate full payment flow
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}