import { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Gift, Mail } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface GiftCardCheckoutProps {
  amount: number;
  recipientEmail: string;
  message: string;
}

const GiftCardCheckoutForm = ({ amount, recipientEmail, message }: GiftCardCheckoutProps) => {
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
          return_url: `${window.location.origin}/gift-card-success`,
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
        onClick={() => setLocation('/gift-cards')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Gift Cards
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Complete Gift Card Purchase
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
                {isProcessing ? "Processing..." : `Purchase Gift Card - ${formatCurrency(amount)}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gift Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-warm-gray">Gift Card Value</span>
              <span className="font-medium text-coral">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-warm-gray">Recipient</span>
              <div className="text-right">
                <div className="font-medium flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {recipientEmail}
                </div>
              </div>
            </div>
            {message && (
              <div className="space-y-2">
                <span className="text-warm-gray">Personal Message</span>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  "{message}"
                </div>
              </div>
            )}
            <hr className="my-4" />
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="text-xs space-y-1">
                <li>• Gift card will be emailed to the recipient</li>
                <li>• Valid for all childcare services on our platform</li>
                <li>• No expiration date</li>
                <li>• Can be used multiple times until balance is zero</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function GiftCardCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [giftCardData, setGiftCardData] = useState<GiftCardCheckoutProps | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount') || '0');
    const recipientEmail = urlParams.get('recipientEmail') || '';
    const message = urlParams.get('message') || '';

    if (amount >= 10 && recipientEmail) {
      setGiftCardData({ amount, recipientEmail, message });

      // Create PaymentIntent for gift card
      apiRequest("POST", "/api/create-gift-card-payment", { 
        amount, 
        recipientEmail, 
        message 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Gift card payment setup error:", error);
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

  if (!clientSecret || !giftCardData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Gift className="w-16 h-16 text-warm-gray mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-warm-gray mb-4">Invalid Gift Card</h1>
        <p className="text-warm-gray mb-6">No gift card data found. Please start a new purchase.</p>
        <Button onClick={() => window.location.href = '/gift-cards'}>
          Return to Gift Cards
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <GiftCardCheckoutForm {...giftCardData} />
    </Elements>
  );
}