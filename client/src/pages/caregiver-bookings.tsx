import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  jobId: string;
  parentId: string;
  caregiverId: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  totalAmount: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    title: string;
    location: string;
    description: string;
    childrenAges: string[];
  };
  parent?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

function CaregiverBookings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch caregiver bookings
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/caregiver/bookings'],
    queryFn: async () => {
      const res = await fetch('/api/caregiver/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/caregiver/bookings'] });
      toast({
        title: "Booking updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBookingsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === selectedDateStr;
    });
  };

  const hasBookingsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings
      .filter(booking => new Date(booking.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings
      .filter(booking => new Date(booking.endTime) < now)
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
      .slice(0, 5);
  };

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingMutation.mutate({ bookingId, status: 'confirmed' });
  };

  const handleDeclineBooking = (bookingId: string) => {
    updateBookingMutation.mutate({ bookingId, status: 'cancelled' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-muted-foreground">
          Manage your scheduled childcare appointments and view your booking history
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{getUpcomingBookings().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">
                  ${bookings
                    .filter(b => b.status === 'completed')
                    .reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>List View</span>
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasBooking: (date) => hasBookingsOnDate(date)
                  }}
                  modifiersStyles={{
                    hasBooking: {
                      backgroundColor: '#000',
                      color: '#fff',
                      borderRadius: '50%'
                    }
                  }}
                />
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <p className="text-sm text-muted-foreground mb-2">Legend:</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
                    <span className="text-sm">Days with bookings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? `Bookings for ${formatDate(selectedDate.toISOString())}` : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getBookingsForSelectedDate().length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No bookings for this date</p>
                      </div>
                    ) : (
                      getBookingsForSelectedDate().map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onAccept={handleAcceptBooking}
                          onDecline={handleDeclineBooking}
                          isUpdating={updateBookingMutation.isPending}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a date from the calendar to view bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Upcoming Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingBookings().length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingBookings().map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onAccept={handleAcceptBooking}
                      onDecline={handleDeclineBooking}
                      isUpdating={updateBookingMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Recent Past Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getPastBookings().length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No past bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPastBookings().map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onAccept={handleAcceptBooking}
                      onDecline={handleDeclineBooking}
                      isUpdating={updateBookingMutation.isPending}
                      isPast={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Booking Card Component
function BookingCard({ 
  booking, 
  onAccept, 
  onDecline, 
  isUpdating = false,
  isPast = false 
}: { 
  booking: Booking; 
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  isUpdating?: boolean;
  isPast?: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{booking.job?.title || 'Childcare Service'}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {booking.job?.location && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{booking.job.location}</span>
            </div>
          )}
          {booking.parent && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{booking.parent.firstName} {booking.parent.lastName}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>${booking.hourlyRate}/hour (Total: ${booking.totalAmount})</span>
          </div>
          {booking.parent?.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{booking.parent.phone}</span>
            </div>
          )}
        </div>
      </div>

      {booking.job?.description && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="text-sm"><strong>Job Details:</strong> {booking.job.description}</p>
        </div>
      )}

      {booking.notes && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
        </div>
      )}

      {booking.job?.childrenAges && booking.job.childrenAges.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Children Ages:</p>
          <div className="flex flex-wrap gap-2">
            {booking.job.childrenAges.map((age, index) => (
              <Badge key={index} variant="outline">
                {age} years old
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="sm" variant="outline">
          <MessageCircle className="w-4 h-4 mr-1" />
          Message Parent
        </Button>
        
        {!isPast && booking.status === 'pending' && (
          <>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onAccept(booking.id)}
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDecline(booking.id)}
              disabled={isUpdating}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default CaregiverBookings;