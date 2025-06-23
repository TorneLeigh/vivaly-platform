import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, User, CreditCard, Shield } from "lucide-react";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function PaymentModal({ isOpen, onClose, booking }: PaymentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create checkout session when modal opens
  const createCheckoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/bookings/${booking.id}/pay`);
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
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

  const handlePayment = () => {
    createCheckoutMutation.mutate();
  };

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
                  <span>Service fee (10%)</span>
                  <span>${booking.serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${booking.totalAmount} AUD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Protection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-1">Secure Payment & Automatic Release</h4>
                <p>Your payment is processed securely by Stripe. Funds are held in escrow and automatically released to the caregiver 24 hours after job completion (Airbnb-style protection).</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={createCheckoutMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {createCheckoutMutation.isPending ? 'Redirecting to Stripe...' : `Pay $${booking.totalAmount} AUD Securely`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}