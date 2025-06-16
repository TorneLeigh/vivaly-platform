import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface BookingEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  clientName: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface CalendarProps {
  bookings?: BookingEvent[];
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ bookings = [], onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getDayClass = (date: Date) => {
    const hasBookings = getBookingsForDate(date).length > 0;
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentDate);

    let classes = "min-h-[60px] p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ";
    
    if (!isCurrentMonth) {
      classes += "text-gray-300 bg-gray-50 ";
    }
    
    if (isToday) {
      classes += "bg-blue-50 border-blue-200 ";
    }
    
    if (hasBookings) {
      classes += "bg-green-50 border-green-200 ";
    }

    return classes;
  };

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            My Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map(date => {
            const dayBookings = getBookingsForDate(date);
            return (
              <div
                key={date.toISOString()}
                className={getDayClass(date)}
                onClick={() => handleDateClick(date)}
              >
                <div className="text-sm font-medium mb-1">
                  {format(date, 'd')}
                </div>
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map(booking => (
                    <div
                      key={booking.id}
                      className={`text-xs p-1 rounded text-white truncate ${
                        booking.status === 'confirmed' ? 'bg-green-600' :
                        booking.status === 'pending' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      }`}
                      title={`${booking.title} - ${booking.startTime}`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.startTime}
                      </div>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}