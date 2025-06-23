import { useState } from "react";
import { useLocation } from "wouter";
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
    numberOfPeople: string;
  }) => void;
  className?: string;
}

export default function SearchFilters({ onSearch, className = "" }: SearchFiltersProps) {
  const [, setNavigationLocation] = useLocation();
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("All Services");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");

  const handleSearch = () => {
    const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : "";
    const searchParams = new URLSearchParams();
    
    if (location) searchParams.set("location", location);
    if (serviceType && serviceType !== "All Services") searchParams.set("serviceType", serviceType);
    if (dateString) searchParams.set("date", dateString);
    if (startTime) searchParams.set("startTime", startTime);
    if (endTime) searchParams.set("endTime", endTime);
    if (numberOfPeople) searchParams.set("numberOfPeople", numberOfPeople);
    
    // Navigate to search caregivers page with parameters
    const searchUrl = `/search-caregivers${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    setNavigationLocation(searchUrl);
    
    // Also call the onSearch callback for compatibility
    onSearch({ location, serviceType, date: dateString, startTime, endTime, numberOfPeople });
  };

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ];

  return (
    <div className={`bg-white rounded-xl border border-gray-100 transform translate-y-[-2px] ${className}`} style={{ boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 10px 20px -6px rgba(0, 0, 0, 0.15), 0 6px 12px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)' }}>
      <div className="p-2 md:p-4 space-y-2 md:space-y-3">
        {/* Where and When - Mobile-first responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
          {/* Location */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Where</label>
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
            <label className="text-xs font-medium text-gray-700 mb-1 block">When</label>
            <div className="space-y-1">
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="flex-1 text-xs px-2 py-1 h-8"
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
                  className="flex-1 text-xs px-2 py-1 h-8"
                >
                  Tomorrow
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8",
                      !selectedDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
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

        {/* Time, Service, and Number of People - Mobile-optimized layout */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-2">
          {/* Time */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Time</label>
            <div className="grid grid-cols-2 gap-1">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-8 text-xs">
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
                <SelectTrigger className="h-8 text-xs">
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
            <label className="text-xs font-medium text-gray-700 mb-1 block">Service</label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="h-8 text-xs">
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

          {/* Number of People */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Care for</label>
            <Select value={numberOfPeople} onValueChange={setNumberOfPeople}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="1 person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3 people</SelectItem>
                <SelectItem value="4">4 people</SelectItem>
                <SelectItem value="5">5+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Icon */}
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
