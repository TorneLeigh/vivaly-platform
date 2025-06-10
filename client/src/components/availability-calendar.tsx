import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

interface AvailabilityData {
  available: boolean;
  rate?: number;
}

interface AvailabilityCalendarProps {
  availability: Record<string, AvailabilityData>;
  onAvailabilityChange: (availability: Record<string, AvailabilityData>) => void;
  baseRate: number;
  instantBookingEnabled: boolean;
  onInstantBookingChange: (enabled: boolean) => void;
}

export default function AvailabilityCalendar({
  availability,
  onAvailabilityChange,
  baseRate,
  instantBookingEnabled,
  onInstantBookingChange
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customRate, setCustomRate] = useState<string>("");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  const getDayAvailability = (date: Date): AvailabilityData => {
    const key = formatDateKey(date);
    return availability[key] || { available: false };
  };

  const updateDayAvailability = (date: Date, data: AvailabilityData) => {
    const key = formatDateKey(date);
    const newAvailability = { ...availability, [key]: data };
    onAvailabilityChange(newAvailability);
  };

  const toggleDayAvailability = (date: Date) => {
    const current = getDayAvailability(date);
    updateDayAvailability(date, {
      available: !current.available,
      rate: current.rate || baseRate
    });
  };

  const setCustomRateForDate = (date: Date, rate: number) => {
    const current = getDayAvailability(date);
    updateDayAvailability(date, {
      ...current,
      rate: rate
    });
  };

  const handleCustomRateSubmit = () => {
    if (selectedDate && customRate) {
      const date = new Date(selectedDate);
      const rate = parseFloat(customRate);
      if (!isNaN(rate) && rate > 0) {
        setCustomRateForDate(date, rate);
        setSelectedDate(null);
        setCustomRate("");
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(monthStart, 32));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(monthStart, -1));
  };

  const getAvailableCount = () => {
    return Object.values(availability).filter(day => day.available).length;
  };

  const bulkSetAvailability = (available: boolean) => {
    const newAvailability: Record<string, AvailabilityData> = {};
    
    // Set availability for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), i);
      const key = formatDateKey(date);
      newAvailability[key] = {
        available,
        rate: baseRate
      };
    }
    
    onAvailabilityChange({ ...availability, ...newAvailability });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Availability Calendar
        </CardTitle>
        <p className="text-sm text-gray-600">
          Set your availability and custom rates. {getAvailableCount()} days currently available.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Instant Booking Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Instant Booking</h4>
            <p className="text-sm text-gray-600">
              Allow parents to book you immediately without approval
            </p>
          </div>
          <Switch
            checked={instantBookingEnabled}
            onCheckedChange={onInstantBookingChange}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkSetAvailability(true)}
          >
            Available Next 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkSetAvailability(false)}
          >
            Unavailable Next 30 Days
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevMonth}>
            ←
          </Button>
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" onClick={nextMonth}>
            →
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {daysInMonth.map(date => {
            const dayAvailability = getDayAvailability(date);
            const dateKey = formatDateKey(date);
            const isPast = date < new Date() && !isToday(date);
            
            return (
              <div
                key={dateKey}
                className={`
                  p-2 h-16 border rounded cursor-pointer relative text-sm
                  ${isPast ? 'bg-gray-100 cursor-not-allowed' : ''}
                  ${dayAvailability.available 
                    ? 'bg-green-100 border-green-300 hover:bg-green-200' 
                    : 'bg-white hover:bg-gray-50'
                  }
                  ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                  ${selectedDate === dateKey ? 'ring-2 ring-purple-500' : ''}
                `}
                onClick={() => {
                  if (!isPast) {
                    if (selectedDate === dateKey) {
                      toggleDayAvailability(date);
                    } else {
                      setSelectedDate(dateKey);
                    }
                  }
                }}
              >
                <div className="font-medium">{format(date, 'd')}</div>
                {dayAvailability.available && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="text-xs text-green-700 flex items-center">
                      <DollarSign className="h-3 w-3" />
                      {dayAvailability.rate || baseRate}
                    </div>
                  </div>
                )}
                {instantBookingEnabled && dayAvailability.available && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Date Actions */}
        {selectedDate && (
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">
                {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
              </h4>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    toggleDayAvailability(new Date(selectedDate));
                    setSelectedDate(null);
                  }}
                  className="w-full"
                >
                  {getDayAvailability(new Date(selectedDate)).available 
                    ? 'Mark Unavailable' 
                    : 'Mark Available'
                  }
                </Button>
                
                {getDayAvailability(new Date(selectedDate)).available && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Custom rate (default: $${baseRate})`}
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleCustomRateSubmit} variant="outline">
                      Set Rate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border rounded"></div>
            <span>Unavailable</span>
          </div>
          {instantBookingEnabled && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Instant Book</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">How to use:</h4>
          <ul className="text-sm space-y-1">
            <li>• Click any date to select it, then click again to toggle availability</li>
            <li>• Set custom rates for special occasions or peak times</li>
            <li>• Enable instant booking to let parents book without approval</li>
            <li>• Use bulk actions to quickly set availability for multiple days</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}