import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users,
  Briefcase,
  Plus,
  Minus
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

const AUSTRALIAN_LOCATIONS = [
  "Sydney, NSW",
  "Melbourne, VIC", 
  "Brisbane, QLD",
  "Perth, WA",
  "Adelaide, SA",
  "Gold Coast, QLD",
  "Newcastle, NSW",
  "Canberra, ACT",
  "Sunshine Coast, QLD",
  "Wollongong, NSW",
  "Geelong, VIC",
  "Townsville, QLD",
  "Cairns, QLD",
  "Darwin, NT",
  "Toowoomba, QLD",
  "Ballarat, VIC",
  "Bendigo, VIC",
  "Albury-Wodonga, NSW/VIC",
  "Launceston, TAS",
  "Mackay, QLD"
];

const SERVICE_TYPES = [
  "Babysitting",
  "Childcare", 
  "Elderly Care",
  "Pet Care",
  "House Sitting",
  "Tutoring",
  "Cleaning",
  "Nanny Services",
  "Overnight Care",
  "Emergency Care"
];

interface CareOption {
  type: 'babies' | 'kids' | 'pets' | 'elderly';
  label: string;
  count: number;
}

export default function AirbnbSearch({ onSearch, className }: AirbnbSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  
  const [careOptions, setCareOptions] = useState<CareOption[]>([
    { type: 'babies', label: 'Babies', count: 0 },
    { type: 'kids', label: 'Kids', count: 0 },
    { type: 'pets', label: 'Pets', count: 0 },
    { type: 'elderly', label: 'Elderly', count: 0 }
  ]);

  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    careFor: "",
    serviceType: ""
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close expanded search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setActiveField(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter locations based on query
  useEffect(() => {
    if (locationQuery) {
      const filtered = AUSTRALIAN_LOCATIONS.filter(location =>
        location.toLowerCase().includes(locationQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [locationQuery]);

  const handleFieldClick = (field: string) => {
    setActiveField(field);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleFieldChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: string) => {
    handleFieldChange("location", location);
    setLocationQuery(location);
    setActiveField(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      handleFieldChange("date", format(date, "yyyy-MM-dd"));
    }
    setActiveField(null);
  };

  const updateCareOption = (type: CareOption['type'], increment: boolean) => {
    setCareOptions(prev => 
      prev.map(option => 
        option.type === type 
          ? { ...option, count: Math.max(0, option.count + (increment ? 1 : -1)) }
          : option
      )
    );
    
    // Update the care for filter
    const updatedOptions = careOptions.map(option => 
      option.type === type 
        ? { ...option, count: Math.max(0, option.count + (increment ? 1 : -1)) }
        : option
    );
    
    const careForText = updatedOptions
      .filter(option => option.count > 0)
      .map(option => `${option.count} ${option.label}`)
      .join(", ");
    
    handleFieldChange("careFor", careForText);
  };

  const handleServiceSelect = (service: string) => {
    handleFieldChange("serviceType", service);
    setActiveField(null);
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsExpanded(false);
    setActiveField(null);
  };

  const getCareForDisplay = () => {
    const activeCare = careOptions.filter(option => option.count > 0);
    if (activeCare.length === 0) return "Care for";
    return activeCare.map(option => `${option.count} ${option.label}`).join(", ");
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Collapsed Search Bar */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer max-w-md mx-auto"
        >
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 truncate">
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
          </div>
          
          <div className="bg-coral p-2 rounded-full">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Expanded Search Bar */}
      {isExpanded && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-white border border-gray-300 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-0 border border-gray-200 rounded-full overflow-hidden">
            
            {/* Where */}
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors relative",
                activeField === "location" ? "bg-gray-50" : "hover:bg-gray-50"
              )}
              onClick={() => handleFieldClick("location")}
            >
              <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Where
              </Label>
              <Input
                placeholder="Search destinations"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="border-0 p-0 text-sm font-medium focus-visible:ring-0 bg-transparent mt-1"
                autoFocus={activeField === "location"}
              />
              
              {/* Location Dropdown */}
              {activeField === "location" && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto z-10">
                  {filteredLocations.map((location, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* When */}
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors border-l border-gray-200 relative",
                activeField === "date" ? "bg-gray-50" : "hover:bg-gray-50"
              )}
              onClick={() => handleFieldClick("date")}
            >
              <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                When
              </Label>
              <div className="text-sm font-medium text-gray-900 mt-1">
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Add dates"}
              </div>
              
              {/* Calendar Dropdown */}
              {activeField === "date" && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
              )}
            </div>

            {/* Care For */}
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors border-l border-gray-200 relative",
                activeField === "careFor" ? "bg-gray-50" : "hover:bg-gray-50"
              )}
              onClick={() => handleFieldClick("careFor")}
            >
              <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Care for
              </Label>
              <div className="text-sm font-medium text-gray-900 mt-1 truncate">
                {getCareForDisplay()}
              </div>
              
              {/* Care For Dropdown */}
              {activeField === "careFor" && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 z-10 min-w-64">
                  <div className="space-y-4">
                    {careOptions.map((option) => (
                      <div key={option.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCareOption(option.type, false);
                            }}
                            disabled={option.count === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{option.count}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCareOption(option.type, true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service */}
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors border-l border-gray-200 relative flex items-center justify-between",
                activeField === "service" ? "bg-gray-50" : "hover:bg-gray-50"
              )}
              onClick={() => handleFieldClick("service")}
            >
              <div className="flex-1">
                <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Service
                </Label>
                <div className="text-sm font-medium text-gray-900 mt-1 truncate">
                  {filters.serviceType || "Any service"}
                </div>
              </div>
              
              <div className="bg-coral p-2 rounded-full ml-4">
                <Search className="h-4 w-4 text-white" />
              </div>
              
              {/* Service Dropdown */}
              {activeField === "service" && (
                <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto z-10 min-w-48">
                  {SERVICE_TYPES.map((service, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{service}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleSearch}
              className="bg-coral hover:bg-coral/90 text-white px-8 py-3 rounded-full font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}