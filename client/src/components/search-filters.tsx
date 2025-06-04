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
    <div className={`bg-white rounded-2xl shadow-xl border ${className}`}>
      <div className="p-6 space-y-4">
        {/* Where and When on first row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">Where</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Search Sydney areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sydney">All Sydney</SelectItem>
                <SelectItem value="Inner Sydney">Inner Sydney</SelectItem>
                <SelectItem value="Eastern Suburbs">Eastern Suburbs</SelectItem>
                <SelectItem value="Northern Beaches">Northern Beaches</SelectItem>
                <SelectItem value="North Shore">North Shore</SelectItem>
                <SelectItem value="Western Sydney">Western Sydney</SelectItem>
                <SelectItem value="Southern Sydney">Southern Sydney</SelectItem>
                <SelectItem value="Southwest Sydney">Southwest Sydney</SelectItem>
                <SelectItem value="Northwest Sydney">Northwest Sydney</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">When</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="flex-1 text-xs"
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setSelectedDate(tomorrow);
                  }}
                  className="flex-1 text-xs"
                >
                  Tomorrow
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate) : "Choose date"}
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
        </div>

        {/* Time and Service on second row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">Time</label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
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
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
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

          {/* Service Type */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">Service</label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
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
          
          {/* Search Icon */}
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              style={{ backgroundColor: '#FF6B35' }}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
