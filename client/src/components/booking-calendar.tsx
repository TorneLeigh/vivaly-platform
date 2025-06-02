import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, generateTimeSlots } from "@/lib/utils";
import { CalendarDays, Clock, DollarSign } from "lucide-react";

interface BookingCalendarProps {
  nannyId: number;
  hourlyRate: string;
  onBooking: (booking: {
    date: Date;
    startTime: string;
    endTime: string;
    serviceType: string;
    notes: string;
  }) => void;
}

export default function BookingCalendar({ nannyId, hourlyRate, onBooking }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const timeSlots = generateTimeSlots();
  const rate = parseFloat(hourlyRate);

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const start = parseInt(startTime.split(':')[0]) + (startTime.includes(':30') ? 0.5 : 0);
    const end = parseInt(endTime.split(':')[0]) + (endTime.includes(':30') ? 0.5 : 0);
    return Math.max(0, end - start);
  };

  const duration = calculateDuration();
  const totalCost = duration * rate;

  const handleBooking = () => {
    if (!selectedDate || !startTime || !endTime || !serviceType) {
      return;
    }

    onBooking({
      date: selectedDate,
      startTime,
      endTime,
      serviceType,
      notes,
    });
  };

  const isBookingValid = selectedDate && startTime && endTime && serviceType && duration > 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="w-5 h-5 mr-2" />
          Book Care
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="start-time" className="text-sm font-medium mb-2 block">
              Start Time
            </Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="start-time">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="end-time" className="text-sm font-medium mb-2 block">
              End Time
            </Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger id="end-time">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="service-type" className="text-sm font-medium mb-2 block">
            Service Type
          </Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger id="service-type">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-on-1 Care">1-on-1 Care</SelectItem>
              <SelectItem value="Group Care">Group Care</SelectItem>
              <SelectItem value="Group Play">Group Play</SelectItem>
              <SelectItem value="Drop & Dash">Drop & Dash</SelectItem>
              <SelectItem value="Postpartum Support">Postpartum Support</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
            Special Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special requirements or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {duration > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Duration:
              </span>
              <span>{duration} hours</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Rate:
              </span>
              <span>{formatCurrency(rate)}/hour</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-lg mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
          </div>
        )}

        <Button 
          onClick={handleBooking}
          disabled={!isBookingValid}
          className="w-full bg-coral hover:bg-coral/90 text-white"
        >
          Request Booking
        </Button>
      </CardContent>
    </Card>
  );
}
