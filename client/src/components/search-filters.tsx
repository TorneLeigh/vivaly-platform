import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { SERVICE_TYPES, SYDNEY_SUBURBS } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onSearch: (filters: {
    location: string;
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  className?: string;
}

export default function SearchFilters({ onSearch, className = "" }: SearchFiltersProps) {
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("All Services");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSearch = () => {
    const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : "";
    onSearch({ location, serviceType, date: dateString, startTime, endTime });
  };

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ];

  return (
    <div className={`bg-white rounded-full shadow-xl border ${className}`}>
      <div className="flex items-center divide-x">
        {/* Location */}
        <div className="flex-1 px-6 py-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-800 mb-1">Where</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-sm">
                <SelectValue placeholder="Search locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sydney">All Sydney</SelectItem>
                {SYDNEY_SUBURBS.map((suburb) => (
                  <SelectItem key={suburb} value={suburb}>
                    {suburb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date */}
        <div className="flex-1 px-6 py-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-800 mb-1">When</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start text-left font-normal p-0 h-auto text-sm",
                    !selectedDate && "text-gray-500"
                  )}
                >
                  {selectedDate ? formatDate(selectedDate) : "Add dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Time */}
        <div className="flex-1 px-6 py-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-800 mb-1">Time</label>
            <div className="flex gap-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-sm w-16">
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
              <span className="text-gray-400">-</span>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-sm w-16">
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
        </div>

        {/* Service Type */}
        <div className="flex-1 px-6 py-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-800 mb-1">Service</label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-sm">
                <SelectValue placeholder="Any service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Services">All Services</SelectItem>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Search Button */}
        <div className="px-2 py-4">
          <Button 
            onClick={handleSearch}
            className="bg-coral text-white hover:bg-coral/90 rounded-full w-12 h-12 p-0"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
