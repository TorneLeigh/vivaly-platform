import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign, Shield, Clock } from "lucide-react";

interface NannySharePaymentProps {
  shareId: string;
  share: {
    title: string;
    rate: string;
    schedule: string;
    participants: string[];
    maxFamilies: number;
  };
  currentUserId: string;
}

export default function NannySharePayment({ shareId, share, currentUserId }: NannySharePaymentProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentPeriod, setPaymentPeriod] = useState("weekly");
  const { toast } = useToast();

  // Calculate costs
  const hourlyRate = parseFloat(share.rate);
  const familyCount = share.participants.length;
  const splitRate = hourlyRate / familyCount;

  // Create Stripe checkout session
  const createPaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: "aud",
          successUrl: `${window.location.origin}/nanny-share/${shareId}?payment=success`,
          cancelUrl: `${window.location.origin}/nanny-share/${shareId}?payment=cancelled`,
          metadata: {
            shareId,
            parentId: currentUserId,
            type: "nanny_share_payment"
          },
          lineItems: [{
            name: `Nanny Share Payment - ${share.title}`,
            description: `Payment for shared childcare services (${paymentPeriod})`,
            amount: amount * 100,
            quantity: 1
          }]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment session");
      }

      const { url } = await response.json();
      window.location.href = url;
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }
    createPaymentMutation.mutate(amount);
  };

  const calculateWeeklyHours = () => {
    // Simple calculation - can be enhanced based on schedule parsing
    const scheduleHours = 30; // Default assumption
    return scheduleHours;
  };

  const suggestedWeeklyAmount = splitRate * calculateWeeklyHours();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment & Escrow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm">Cost Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total hourly rate:</span>
              <span>${hourlyRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Families sharing:</span>
              <span>{familyCount}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Your rate per hour:</span>
              <span>${splitRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-orange-600 font-medium">
              <span>Suggested weekly payment:</span>
              <span>${suggestedWeeklyAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Payment Amount (AUD)</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={suggestedWeeklyAmount.toFixed(2)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the amount you want to pay into escrow
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={createPaymentMutation.isPending || !paymentAmount}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {createPaymentMutation.isPending ? "Processing..." : "Pay into Escrow"}
          </Button>
        </div>

        {/* Escrow Information */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-medium text-sm">Secure Escrow Protection</span>
          </div>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Funds held securely until service completion</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Automatic release 24 hours after service</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              <span>10% platform fee deducted at release</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-between text-sm">
          <span>Payment Status:</span>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Setup Required
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}