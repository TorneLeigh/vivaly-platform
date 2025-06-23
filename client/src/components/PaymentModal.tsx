import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, User, CreditCard, Shield } from "lucide-react";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Booking {
  id: string;
  caregiverName: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  ratePerHour: number;
  totalAmount: number;
  serviceFee: number;
  caregiverAmount: number;
  notes: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

function PaymentForm({ booking, onSuccess }: { booking: Booking; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings?payment=success`,
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
        description: "Your booking has been confirmed and payment processed!",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Caregiver:</span>
              <p className="font-medium">{booking.caregiverName}</p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-medium">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Hours per day:</span>
              <p className="font-medium">{booking.hoursPerDay} hours</p>
            </div>
            <div>
              <span className="text-gray-600">Rate:</span>
              <p className="font-medium">${booking.ratePerHour}/hour</p>
            </div>
          </div>
          
          {booking.notes && (
            <div className="pt-2 border-t">
              <span className="text-gray-600 text-sm">Notes:</span>
              <p className="text-sm mt-1">{booking.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Caregiver payment</span>
              <span>${booking.caregiverAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service fee (15%)</span>
              <span>${booking.serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${booking.totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-1">Secure Payment</h4>
                  <p>Your payment is processed securely by Stripe. Funds are held in escrow and only released to the caregiver after the job is completed.</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? 'Processing...' : `Pay $${booking.totalAmount} AUD`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentModal({ isOpen, onClose, booking }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create payment intent when modal opens
  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/bookings/${booking.id}/pay`);
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      onClose();
    }
  });

  // Initialize payment when modal opens
  useState(() => {
    if (isOpen && !clientSecret) {
      createPaymentIntentMutation.mutate();
    }
  });

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Secure your booking with {booking.caregiverName} by completing payment.
          </DialogDescription>
        </DialogHeader>

        {createPaymentIntentMutation.isPending ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing payment...</p>
          </div>
        ) : clientSecret ? (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#2563eb',
                }
              }
            }}
          >
            <PaymentForm booking={booking} onSuccess={handlePaymentSuccess} />
          </Elements>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to initialize payment. Please try again.</p>
            <Button onClick={() => createPaymentIntentMutation.mutate()} className="mt-4">
              Retry
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}