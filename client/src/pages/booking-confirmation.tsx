import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Home,
  FileText,
  Shield
} from 'lucide-react';

interface BookingConfirmation {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  serviceFee: number;
  caregiverAmount: number;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  ratePerHour: number;
  caregiver?: {
    firstName: string;
    lastName: string;
  };
}

export default function BookingConfirmation() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking_id');
        
        if (!bookingId) {
          navigate('/');
          return;
        }

        const response = await apiRequest('GET', `/api/bookings/${bookingId}`);
        setBooking(response);
      } catch (error: any) {
        console.error('Error fetching booking:', error);
        toast({
          title: "Error",
          description: "Failed to load booking confirmation.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const calculateDays = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Animation Card */}
        <Card className="text-center border-green-200 bg-green-50 mb-6">
          <CardContent className="py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-3">
              Booking Confirmed!
            </h1>
            <p className="text-green-700 text-lg mb-6">
              Your payment has been processed and your booking is confirmed
            </p>
            
            {/* Quick Summary */}
            <div className="bg-white rounded-lg p-6 mx-auto max-w-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Caregiver:</span>
                <span className="font-medium">
                  {booking.caregiver ? 
                    `${booking.caregiver.firstName} ${booking.caregiver.lastName}` : 
                    'Assigned'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{days} day{days !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Hours/Day:</span>
                <span className="font-medium">{booking.hoursPerDay}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-bold text-lg">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Security Notice */}
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Payment Protection</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Your payment is held securely by VIVALY and will be automatically released 
                  to the caregiver 24 hours after job completion. This ensures quality service 
                  and protects both parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Caregiver Contact</h4>
                  <p className="text-sm text-gray-600">
                    Your caregiver will reach out within 24 hours to coordinate details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Service Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Enjoy professional childcare during your scheduled dates
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Automatic Payment</h4>
                  <p className="text-sm text-gray-600">
                    Payment releases to caregiver 24h after completion
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/payment-success?booking_id=' + booking.id)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Details
          </Button>
          
          <Button 
            onClick={() => navigate('/messages')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Message Caregiver
          </Button>
          
          <Button 
            onClick={() => navigate('/parent-dashboard')}
            className="flex items-center gap-2 bg-[#FF5F7E] hover:bg-[#e54c6b]"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}