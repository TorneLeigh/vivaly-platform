import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface AdminPayoutControlsProps {
  bookings?: any[];
}

export default function AdminPayoutControls({ bookings = [] }: AdminPayoutControlsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  // Filter bookings that are eligible for payout release
  const eligibleBookings = bookings.filter(booking => 
    booking.paymentStatus === 'paid_unreleased' && 
    booking.status === 'completed'
  );

  const handleReleasePayment = async (bookingId: string) => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/stripe/transfer-to-caregiver', {
        bookingId: bookingId
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Payment Released",
          description: `Successfully transferred $${data.amount} AUD to caregiver.`,
        });
        // Refresh the page or update the booking list
        window.location.reload();
      } else {
        throw new Error(data.error || 'Transfer failed');
      }
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to release payment to caregiver.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleBulkRelease = async () => {
    if (eligibleBookings.length === 0) {
      toast({
        title: "No Eligible Bookings",
        description: "No bookings are currently eligible for payout release.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let successful = 0;
    let failed = 0;

    for (const booking of eligibleBookings) {
      try {
        const response = await apiRequest('POST', '/api/stripe/transfer-to-caregiver', {
          bookingId: booking.id
        });
        
        const data = await response.json();
        if (data.success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    }

    toast({
      title: "Bulk Release Complete",
      description: `${successful} payments released successfully. ${failed} failed.`,
      variant: successful > 0 ? "default" : "destructive",
    });

    if (successful > 0) {
      window.location.reload();
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)} AUD`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-[#FF5F7E]" />
          Payout Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{eligibleBookings.length}</div>
            <div className="text-sm text-blue-600">Ready for Release</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(eligibleBookings.reduce((sum, b) => sum + b.caregiverAmount, 0))}
            </div>
            <div className="text-sm text-green-600">Total Payout Amount</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(eligibleBookings.reduce((sum, b) => sum + b.serviceFee, 0))}
            </div>
            <div className="text-sm text-orange-600">Platform Revenue</div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleBulkRelease}
            disabled={loading || eligibleBookings.length === 0}
            className="bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Releasing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Release All Eligible ({eligibleBookings.length})
              </div>
            )}
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Status
          </Button>
        </div>

        {/* Individual Booking Controls */}
        {eligibleBookings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Individual Releases</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {eligibleBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Booking #{booking.id.slice(0, 8)}</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Release
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      Caregiver: {booking.caregiverName} • Amount: {formatCurrency(booking.caregiverAmount)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleReleasePayment(booking.id)}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Release
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {eligibleBookings.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="font-medium">All payments are up to date</p>
            <p className="text-sm">No bookings are currently eligible for payout release.</p>
          </div>
        )}

        {/* Manual Release by Booking ID */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Manual Release</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="bookingId" className="text-xs">Booking ID</Label>
              <Input
                id="bookingId"
                placeholder="Enter booking ID"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                size="sm"
              />
            </div>
            <Button
              onClick={() => selectedBookingId && handleReleasePayment(selectedBookingId)}
              disabled={loading || !selectedBookingId}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Release
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}