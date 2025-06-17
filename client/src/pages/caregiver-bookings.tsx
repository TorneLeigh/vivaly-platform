import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReferralBanner } from "@/components/ReferralBanner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

type Booking = {
  id: string;
  parentName: string;
  parentLastName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceType: string;
};

export default function CaregiverBookings() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/caregiver/bookings'],
    queryFn: async () => {
      const response = await fetch('/api/caregiver/bookings', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user
  });

  const todays = bookings.filter((b: Booking) => 
    new Date(b.date).toDateString() === date.toDateString()
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} – ${endTime}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Schedule</h1>
          <p className="text-gray-600">Manage your childcare appointments</p>
        </div>

        <ReferralBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="calendar-container">
                <Calendar 
                  onChange={(value) => setDate(value as Date)} 
                  value={date}
                  className="react-calendar"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bookings for Selected Date */}
          <Card>
            <CardHeader>
              <CardTitle>
                Appointments on {date.toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-600">Loading appointments...</p>
              ) : todays.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">📅</div>
                  <p className="text-gray-600">No appointments on this date.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a different date to view your schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todays.map((b: Booking) => (
                    <div key={b.id} className="border border-gray-200 p-4 rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {b.parentName} {b.parentLastName}
                          </h3>
                          <p className="text-sm text-gray-600">{b.serviceType}</p>
                        </div>
                        <Badge className={getStatusColor(b.status)}>
                          {b.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{formatTime(b.startTime, b.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter((b: Booking) => b.status.toLowerCase() === 'confirmed').length}
                </div>
                <div className="text-sm text-green-600">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b: Booking) => b.status.toLowerCase() === 'pending').length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter((b: Booking) => b.status.toLowerCase() === 'completed').length}
                </div>
                <div className="text-sm text-blue-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}