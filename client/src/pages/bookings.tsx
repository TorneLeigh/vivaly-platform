import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, User, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

interface Booking {
  id: string;
  parentId: string;
  caregiverId: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  ratePerHour: number;
  totalAmount: number;
  serviceFee: number;
  caregiverAmount: number;
  status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid_unreleased' | 'released' | 'refunded';
  notes: string;
  createdAt: string;
  parentName: string;
  caregiverName: string;
  caregiverPhoto?: string;
  parentPhoto?: string;
}

export default function Bookings() {
  const { user, activeRole } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bookings based on role
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings', activeRole],
    queryFn: async () => {
      const response = await fetch(`/api/bookings?role=${activeRole}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user
  });

  // Respond to booking (caregiver)
  const respondToBookingMutation = useMutation({
    mutationFn: async ({ bookingId, action }: { bookingId: string; action: 'accept' | 'decline' }) => {
      const response = await apiRequest('POST', `/api/bookings/${bookingId}/respond`, { action });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.action === 'accept' ? "Booking Accepted" : "Booking Declined",
        description: variables.action === 'accept' 
          ? "You've accepted the booking! The parent will now be prompted to pay."
          : "You've declined this booking request.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to booking",
        variant: "destructive",
      });
    }
  });

  // Complete job (parent)
  const completeJobMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiRequest('POST', `/api/bookings/${bookingId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Completed",
        description: "The job has been marked as completed and payment has been released to the caregiver.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete job",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'pending') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Response</Badge>;
    }
    if (status === 'confirmed') {
      if (paymentStatus === 'unpaid') {
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Payment Required</Badge>;
      }
      if (paymentStatus === 'paid_unreleased') {
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid & Confirmed</Badge>;
      }
    }
    if (status === 'declined') {
      return <Badge variant="destructive">Declined</Badge>;
    }
    if (status === 'completed') {
      return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header with other party info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {(activeRole === 'parent' ? booking.caregiverPhoto : booking.parentPhoto) ? (
                <img 
                  src={activeRole === 'parent' ? booking.caregiverPhoto : booking.parentPhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(activeRole === 'parent' ? booking.caregiverName : booking.parentName).split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {activeRole === 'parent' ? booking.caregiverName : booking.parentName}
              </h3>
              <p className="text-sm text-gray-600">
                {activeRole === 'parent' ? 'Caregiver' : 'Parent'}
              </p>
            </div>
          </div>
          {getStatusBadge(booking.status, booking.paymentStatus)}
        </div>

        {/* Booking details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{booking.hoursPerDay} hours per day</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>${booking.ratePerHour}/hour</span>
          </div>
        </div>

        {/* Total amount */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total Amount:</span>
            <span className="text-lg font-bold text-green-600">${booking.totalAmount}</span>
          </div>
          {activeRole === 'parent' && (
            <div className="text-xs text-gray-500 mt-1">
              Includes ${booking.serviceFee} service fee
            </div>
          )}
          {activeRole === 'caregiver' && (
            <div className="text-xs text-gray-500 mt-1">
              You receive: ${booking.caregiverAmount}
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
              <strong>Notes:</strong> {booking.notes}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Caregiver actions */}
          {activeRole === 'caregiver' && booking.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => respondToBookingMutation.mutate({ bookingId: booking.id, action: 'decline' })}
                disabled={respondToBookingMutation.isPending}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => respondToBookingMutation.mutate({ bookingId: booking.id, action: 'accept' })}
                disabled={respondToBookingMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </>
          )}

          {/* Parent actions */}
          {activeRole === 'parent' && booking.status === 'confirmed' && booking.paymentStatus === 'unpaid' && (
            <Button
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setShowPaymentModal(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pay Now (${booking.totalAmount})
            </Button>
          )}

          {/* Complete job button */}
          {activeRole === 'parent' && 
           booking.status === 'confirmed' && 
           booking.paymentStatus === 'paid_unreleased' && 
           new Date(booking.endDate) <= new Date() && (
            <Button
              size="sm"
              onClick={() => completeJobMutation.mutate(booking.id)}
              disabled={completeJobMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            {activeRole === 'parent' 
              ? 'Manage your childcare bookings and payments'
              : 'View and respond to booking requests'
            }
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">
                {activeRole === 'parent' 
                  ? "You haven't made any bookings yet. Find a caregiver and create your first booking!"
                  : "You don't have any booking requests yet. Applications from parents will appear here."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map(renderBookingCard)}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedBooking && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
          />
        )}
      </div>
    </div>
  );
}