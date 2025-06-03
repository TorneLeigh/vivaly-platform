import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Bell,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  Send
} from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import type { Booking, User } from "@shared/schema";

interface BookingWithUser extends Booking {
  parent: User;
}

export default function NannyDashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/nanny/bookings"],
  });

  const { data: earnings } = useQuery({
    queryKey: ["/api/nanny/earnings"],
  });

  // Calculate today's stats
  const todayBookings = bookings?.filter((booking: BookingWithUser) => 
    isToday(new Date(booking.date))
  ) || [];

  const upcomingBookings = bookings?.filter((booking: BookingWithUser) => 
    new Date(booking.date) > new Date() && booking.status === 'confirmed'
  )?.slice(0, 5) || [];

  const getBookingTimeLabel = (booking: BookingWithUser) => {
    const bookingDate = new Date(booking.date);
    if (isToday(bookingDate)) return "Today";
    if (isTomorrow(bookingDate)) return "Tomorrow";
    return format(bookingDate, "MMM d");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Stay on top of today, every day</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Earnings and Insights - Right up top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings?.today || '0.00'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weekly Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings?.week || '0.00'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {earnings?.hoursWeek || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bookings Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayBookings.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings today</p>
                    <p className="text-sm text-gray-400">Enjoy your day off!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayBookings.map((booking: BookingWithUser) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {booking.parent?.firstName} {booking.parent?.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="text-sm text-gray-500">{booking.serviceType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(booking.status || 'pending')}>
                            {booking.status || 'pending'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Mom Notes */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder to Parent
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Capture Mom Notes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Completed
                </Button>
              </CardContent>
            </Card>

            {/* Recent Mom Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Mom Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-gray-900">Emma had a great day!</p>
                    <p className="text-xs text-gray-600">Johnson Family - Yesterday</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-gray-900">Needs extra snacks for tomorrow</p>
                    <p className="text-xs text-gray-600">Smith Family - 2 days ago</p>
                  </div>
                  <Button variant="ghost" className="w-full text-sm">
                    View all notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming bookings</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking: BookingWithUser) => (
                  <div key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{getBookingTimeLabel(booking)}</Badge>
                      <Badge className={getStatusColor(booking.status || 'pending')}>
                        {booking.status || 'pending'}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {booking.parent?.firstName} {booking.parent?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {booking.startTime} - {booking.endTime}
                    </p>
                    <p className="text-sm text-gray-500">{booking.serviceType}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Bell className="h-3 w-3 mr-1" />
                        Remind
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}