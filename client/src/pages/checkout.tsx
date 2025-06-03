import { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, CreditCard } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutProps {
  amount: number;
  serviceType: string;
  nannyId?: number;
  nannyName?: string;
  date?: string;
  time?: string;
}

const CheckoutForm = ({ amount, serviceType, nannyName, date, time }: CheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => setLocation('/')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PaymentElement />
              <Button 
                type="submit" 
                className="w-full bg-coral hover:bg-coral/90" 
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay ${formatCurrency(amount)}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-warm-gray">Service</span>
              <span className="font-medium">{serviceType}</span>
            </div>
            {nannyName && (
              <div className="flex justify-between">
                <span className="text-warm-gray">Caregiver</span>
                <span className="font-medium">{nannyName}</span>
              </div>
            )}
            {date && (
              <div className="flex justify-between">
                <span className="text-warm-gray">Date</span>
                <span className="font-medium">{date}</span>
              </div>
            )}
            {time && (
              <div className="flex justify-between">
                <span className="text-warm-gray">Time</span>
                <span className="font-medium">{time}</span>
              </div>
            )}
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-coral">{formatCurrency(amount)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState<CheckoutProps | null>(null);

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount') || '0');
    const serviceType = urlParams.get('serviceType') || 'Childcare Service';
    const nannyId = urlParams.get('nannyId') ? parseInt(urlParams.get('nannyId')!) : undefined;
    const nannyName = urlParams.get('nannyName') || undefined;
    const date = urlParams.get('date') || undefined;
    const time = urlParams.get('time') || undefined;

    if (amount > 0) {
      setCheckoutData({ amount, serviceType, nannyId, nannyName, date, time });

      // Create PaymentIntent
      apiRequest("POST", "/api/create-payment-intent", { 
        amount, 
        serviceType, 
        nannyId 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Payment setup error:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret || !checkoutData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-warm-gray mb-4">Invalid Checkout</h1>
        <p className="text-warm-gray mb-6">No booking data found. Please start a new booking.</p>
        <Button onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...checkoutData} />
    </Elements>
  );
}