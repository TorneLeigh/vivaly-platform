import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Calendar } from "lucide-react";
import { SERVICE_TYPES } from "@shared/schema";

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
  const [location, setLocation] = useState("Sydney, NSW");
  const [serviceType, setServiceType] = useState("All Services");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSearch = () => {
    onSearch({ location, serviceType, date, startTime, endTime });
  };

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="date" className="block text-sm font-medium text-warm-gray mb-2">
            Date
          </Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
            />
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="start-time" className="block text-sm font-medium text-warm-gray mb-2">
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

        <div className="md:col-span-1">
          <Label htmlFor="end-time" className="block text-sm font-medium text-warm-gray mb-2">
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
        
        <div className="md:col-span-1">
          <Label htmlFor="location" className="block text-sm font-medium text-warm-gray mb-2">
            Location
          </Label>
          <div className="relative">
            <Input
              id="location"
              type="text"
              placeholder="Sydney, NSW"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="md:col-span-1">
          <Label htmlFor="service-type" className="block text-sm font-medium text-warm-gray mb-2">
            Service Type
          </Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger id="service-type">
              <SelectValue placeholder="All Services" />
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
        
        <div className="md:col-span-1 flex items-end">
          <Button 
            onClick={handleSearch}
            className="w-full bg-coral text-white hover:bg-coral/90 transition-colors font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
