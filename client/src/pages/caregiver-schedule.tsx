import { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface ScheduleItem {
  id: string;
  title: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  children: number;
  rate: string;
}

export default function CaregiverSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for now - replace with actual API call
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Childcare Session',
      client: 'Sarah Johnson',
      date: '2025-06-18',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Bondi Beach, NSW',
      status: 'confirmed',
      children: 2,
      rate: '$25/hr'
    },
    {
      id: '2',
      title: 'After School Care',
      client: 'Mike Wilson',
      date: '2025-06-19',
      startTime: '15:30',
      endTime: '18:00',
      location: 'Surry Hills, NSW',
      status: 'pending',
      children: 1,
      rate: '$22/hr'
    },
    {
      id: '3',
      title: 'Weekend Babysitting',
      client: 'Emma Davis',
      date: '2025-06-21',
      startTime: '19:00',
      endTime: '23:00',
      location: 'Paddington, NSW',
      status: 'confirmed',
      children: 2,
      rate: '$30/hr'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">My Schedule</h1>
        <p className="text-gray-600">Manage your upcoming bookings and appointments</p>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">5</div>
            <p className="text-xs text-gray-500">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">32</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$800</div>
            <p className="text-xs text-gray-500">Expected this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-black">{item.title}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{item.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.children} child{item.children !== 1 ? 'ren' : ''}</span>
                        <span>•</span>
                        <span className="font-medium text-green-600">{item.rate}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {item.status === 'pending' && (
                      <Button size="sm">
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {scheduleItems.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
              <p className="text-gray-600 mb-4">Your schedule is currently empty</p>
              <Button>Browse Available Jobs</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}