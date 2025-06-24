import { useState } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Shield, 
  Clock, 
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  User
} from "lucide-react";

// Initialize Stripe with proper error handling
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
console.log('Stripe public key available:', !!stripePublicKey);

let stripePromise: Promise<any> | null = null;
if (stripePublicKey) {
  stripePromise = loadStripe(stripePublicKey).catch(error => {
    console.error('Failed to load Stripe:', error);
    return null;
  });
}

interface TestPaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

function TestPaymentForm({ amount, onSuccess }: TestPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: amount * 100, // Convert to cents
        bookingId: "test-booking-123"
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const { clientSecret } = await response.json();

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your test payment has been processed!",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Secure Payment</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Your payment is secured by Stripe's industry-leading encryption
        </p>
      </div>

      <PaymentElement />

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Test Card Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
          <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
          <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
          <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pay ${amount}</span>
          </div>
        )}
      </Button>
    </form>
  );
}

export default function TestPayment() {
  const [, navigate] = useLocation();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const testAmount = 75; // $75 test payment

  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment System Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Payment processing is temporarily unavailable. Please contact support.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your test payment of <strong>${testAmount}</strong> has been processed successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                This was a test transaction using Stripe's test mode. No real money was charged.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/")} 
              className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
            >
              Return to Dashboard
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
          onClick={() => navigate("/")} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FF5F7E]" />
                <span>Test Booking Summary</span>
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
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium">Sydney, NSW</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$200.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Platform Fee (10%)</span>
                  <span>$20.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">GST</span>
                  <span>$22.00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-[#FF5F7E]">${testAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-[#FF5F7E]" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{
                  mode: 'payment',
                  amount: testAmount * 100,
                  currency: 'aud',
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#FF5F7E',
                    },
                  },
                }}
              >
                <TestPaymentForm 
                  amount={testAmount}
                  onSuccess={() => setPaymentCompleted(true)}
                />
              </Elements>
            </CardContent>
          </Card>

          {/* Safety Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Payment Protection</p>
                  <p>
                    Your payment is held securely until 24 hours after service completion. 
                    This ensures both parties are protected and satisfied with the arrangement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}