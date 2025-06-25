import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  MapPin,
  Shield,
  MessageSquare,
  Home
} from 'lucide-react';

interface Booking {
  id: string;
  parentId: string;
  caregiverId: string;
  startDate: string;
  endDate: string;
  ratePerHour: number;
  hoursPerDay: number;
  totalAmount: number;
  serviceFee: number;
  caregiverAmount: number;
  status: string;
  paymentStatus: string;
  notes?: string;
  caregiver?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Get booking ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking_id');
        
        if (!bookingId) {
          setError('No booking ID provided');
          return;
        }

        const response = await apiRequest('GET', `/api/bookings/${bookingId}`);
        setBooking(response);
        
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed and payment processed.",
        });
      } catch (error: any) {
        console.error('Error fetching booking:', error);
        setError(error.message || 'Failed to load booking details');
        toast({
          title: "Error",
          description: "Failed to load booking details. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDays = () => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Booking</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the booking details.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = calculateDays();
  const totalHours = days * booking.hoursPerDay;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Booking Confirmed!</CardTitle>
            <p className="text-green-700">
              Your payment has been processed successfully and your booking is confirmed.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Caregiver Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {booking.caregiver?.profileImageUrl ? (
                    <img 
                      src={booking.caregiver.profileImageUrl} 
                      alt="Caregiver" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {booking.caregiver?.firstName?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {booking.caregiver ? 
                      `${booking.caregiver.firstName} ${booking.caregiver.lastName}` : 
                      'Caregiver'
                    }
                  </h3>
                  <p className="text-sm text-gray-600">Your assigned caregiver</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Service Dates</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="text-xs text-gray-500">{days} day{days !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Hours per Day</p>
                    <p className="text-sm text-gray-600">
                      {booking.hoursPerDay} hour{booking.hoursPerDay !== 1 ? 's' : ''} per day
                    </p>
                    <p className="text-xs text-gray-500">Total: {totalHours} hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Hourly Rate</p>
                    <p className="text-sm text-gray-600">${booking.ratePerHour}/hour</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {booking.paymentStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="pt-3 border-t">
                  <p className="font-medium mb-1">Special Notes</p>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Cost</span>
                  <span>${booking.caregiverAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee (10%)</span>
                  <span>${booking.serviceFee.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Paid</span>
                  <span>${booking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Security Notice */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <h4 className="font-medium mb-1">Payment Security</h4>
                      <p className="text-xs leading-relaxed">
                        Your payment is held securely and will be automatically released to the caregiver 
                        24 hours after the job is completed. This protects both you and the caregiver.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            onClick={() => navigate('/parent-dashboard')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/messages')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Message Caregiver
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">1. Connect</h3>
                <p className="text-sm text-gray-600">
                  Your caregiver will reach out to coordinate details and arrange the first meeting.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">2. Service</h3>
                <p className="text-sm text-gray-600">
                  Enjoy professional childcare services during your booked dates and times.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">3. Complete</h3>
                <p className="text-sm text-gray-600">
                  Payment is automatically released to the caregiver 24 hours after job completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}