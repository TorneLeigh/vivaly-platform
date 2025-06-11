import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users,
  Briefcase,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFilters {
  location: string;
  date: string;
  careFor: string;
  serviceType: string;
}

interface AirbnbSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const SERVICE_TYPES = [
  "Babysitting",
  "Childcare", 
  "Elderly Care",
  "Pet Care",
  "House Sitting",
  "Tutoring",
  "Cleaning",
  "All Services"
];

const CARE_FOR_OPTIONS = [
  "1 child",
  "2 children", 
  "3 children",
  "4+ children",
  "1 adult",
  "2 adults",
  "3+ adults",
  "Pets"
];

export default function AirbnbSearch({ onSearch, className = "" }: AirbnbSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    careFor: "",
    serviceType: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setActiveField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldClick = (field: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setActiveField(field);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFilters({
      ...filters,
      date: date ? format(date, "yyyy-MM-dd") : ""
    });
    setActiveField(null);
  };

  const handleFieldChange = (field: keyof SearchFilters, value: string) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsExpanded(false);
    setActiveField(null);
  };

  const hasFilters = Object.values(filters).some(value => value !== "");

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Collapsed Search Bar */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-6 flex-1">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {filters.location || "Where"}
              </span>
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {selectedDate ? format(selectedDate, "MMM dd") : "When"}
              </span>
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {filters.careFor || "Care for"}
              </span>
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {filters.serviceType || "Service"}
              </span>
            </div>
          </div>
          
          <div className="ml-4">
            <div className="bg-coral text-white rounded-full p-2 hover:bg-coral/90 transition-colors">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded Search Form */}
      {isExpanded && (
        <Card className="absolute top-0 left-0 right-0 z-50 shadow-2xl border-0">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              
              {/* Where */}
              <div 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  activeField === "location" ? "bg-gray-50" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick("location")}
              >
                <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Where
                </Label>
                <Input
                  placeholder="Search destinations"
                  value={filters.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="border-0 p-0 text-sm font-medium placeholder:text-gray-500 focus-visible:ring-0 bg-transparent"
                  autoFocus={activeField === "location"}
                />
              </div>

              {/* When */}
              <div 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  activeField === "date" ? "bg-gray-50" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick("date")}
              >
                <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  When
                </Label>
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => {
                    handleFieldChange("date", e.target.value);
                    setSelectedDate(e.target.value ? new Date(e.target.value) : undefined);
                  }}
                  className="border-0 p-0 text-sm font-medium focus-visible:ring-0 bg-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  autoFocus={activeField === "date"}
                />
              </div>

              {/* Care For */}
              <div 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  activeField === "careFor" ? "bg-gray-50" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick("careFor")}
              >
                <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Care for
                </Label>
                <Select 
                  value={filters.careFor} 
                  onValueChange={(value) => {
                    handleFieldChange("careFor", value);
                    setActiveField(null);
                  }}
                  open={activeField === "careFor"}
                  onOpenChange={(open) => !open && setActiveField(null)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent">
                    <div className="text-sm font-medium text-gray-900 text-left">
                      {filters.careFor || "Add guests"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CARE_FOR_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service */}
              <div 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  activeField === "service" ? "bg-gray-50" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick("service")}
              >
                <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Service
                </Label>
                <Select 
                  value={filters.serviceType} 
                  onValueChange={(value) => {
                    handleFieldChange("serviceType", value);
                    setActiveField(null);
                  }}
                  open={activeField === "service"}
                  onOpenChange={(open) => !open && setActiveField(null)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent">
                    <div className="text-sm font-medium text-gray-900 text-left">
                      {filters.serviceType || "Service type"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((service) => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilters({ location: "", date: "", careFor: "", serviceType: "" });
                    setSelectedDate(undefined);
                  }}
                  className="text-sm font-medium underline"
                  disabled={!hasFilters}
                >
                  Clear all
                </Button>
                
                <Button
                  onClick={handleSearch}
                  className="bg-coral hover:bg-coral/90 text-white rounded-lg px-8 py-2 font-medium flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}