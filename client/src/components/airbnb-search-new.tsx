import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users,
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
  "Nanny Services", 
  "Drop-in care",
  "Overnight newborn support",
  "Newborn support",
  "Birth education",
  "Breastfeeding support",
  "Pregnancy assistance",
  "1-2 hours group care",
  "Drop and dash",
  "Elderly Care",
  "Pet Care"
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
      setFilteredLocations(AUSTRALIAN_LOCATIONS);
    }
  }, [locationQuery]);

  const handleLocationSelect = (location: string) => {
    setFilters({ ...filters, location });
    setLocationQuery(location);
    setActiveField(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFilters({ ...filters, date: format(date, "yyyy-MM-dd") });
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
  };

  const getCareForDisplay = () => {
    const totalCount = careOptions.reduce((sum, option) => sum + option.count, 0);
    if (totalCount === 0) return "Care for";
    if (totalCount === 1) {
      const activeOption = careOptions.find(option => option.count > 0);
      return `${activeOption?.count} ${activeOption?.label}`;
    }
    return `${totalCount} people`;
  };

  const handleServiceSelect = (service: string) => {
    setFilters({ ...filters, serviceType: service });
    setActiveField(null);
  };

  const handleSearch = () => {
    const careForString = careOptions
      .filter(option => option.count > 0)
      .map(option => `${option.count} ${option.label}`)
      .join(", ");
    
    const searchFilters = {
      ...filters,
      careFor: careForString
    };
    
    onSearch(searchFilters);
    setIsExpanded(false);
    setActiveField(null);
  };

  const handleFieldClick = (field: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setActiveField(activeField === field ? null : field);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Search Container with Fixed Height */}
      <div className="relative">
        {/* Main Search Bar */}
        <div className={cn(
          "bg-white border border-gray-300 shadow-md transition-all duration-200",
          isExpanded 
            ? "rounded-3xl px-6 py-4" 
            : "rounded-full px-6 py-3 hover:shadow-lg cursor-pointer"
        )}>
          <div className="flex items-center justify-between">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center flex-1">
              {/* Where */}
              <div 
                className={cn(
                  "flex-1 px-4 py-2 rounded-full transition-all cursor-pointer",
                  activeField === 'where' ? "bg-white shadow-md" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick('where')}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">Where</div>
                    <div className="text-sm text-gray-900 truncate">
                      {filters.location || "Search destinations"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 mx-2" />

              {/* When */}
              <div 
                className={cn(
                  "flex-1 px-4 py-2 rounded-full transition-all cursor-pointer",
                  activeField === 'when' ? "bg-white shadow-md" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick('when')}
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">When</div>
                    <div className="text-sm text-gray-900">
                      {selectedDate ? format(selectedDate, "MMM d") : "Add dates"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 mx-2" />

              {/* Care For */}
              <div 
                className={cn(
                  "flex-1 px-4 py-2 rounded-full transition-all cursor-pointer",
                  activeField === 'careFor' ? "bg-white shadow-md" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick('careFor')}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">Care for</div>
                    <div className="text-sm text-gray-900">
                      {getCareForDisplay()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 mx-2" />

              {/* Service */}
              <div 
                className={cn(
                  "flex-1 px-4 py-2 rounded-full transition-all cursor-pointer",
                  activeField === 'service' ? "bg-white shadow-md" : "hover:bg-gray-50"
                )}
                onClick={() => handleFieldClick('service')}
              >
                <div>
                  <div className="text-xs font-medium text-gray-700">Service</div>
                  <div className="text-sm text-gray-900 truncate">
                    {filters.serviceType || "Select service"}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex items-center space-x-3 flex-1" onClick={() => !isExpanded && setIsExpanded(true)}>
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {filters.location || "Where to?"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {selectedDate ? format(selectedDate, "MMM d") : "When"} • {getCareForDisplay()}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-coral hover:bg-coral/90 text-white rounded-full p-3 ml-4 flex-shrink-0"
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dropdown Content */}
        {isExpanded && activeField && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            {/* Where Dropdown */}
            {activeField === 'where' && (
              <div className="p-4 md:p-6">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search destinations</h3>
                  <Input
                    placeholder="Where are you going?"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="mb-4 border-gray-300 focus:border-coral focus:ring-coral"
                  />
                </div>
                <div className="space-y-1">
                  {filteredLocations.slice(0, 8).map((location) => (
                    <div
                      key={location}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When Dropdown */}
            {activeField === 'when' && (
              <div className="p-4 md:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">When do you need care?</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  className="w-full border-0"
                  classNames={{
                    months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-coral/10 rounded-lg",
                    day_selected: "bg-coral text-white hover:bg-coral hover:text-white focus:bg-coral focus:text-white",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            )}

            {/* Care For Dropdown */}
            {activeField === 'careFor' && (
              <div className="p-4 md:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Who needs care?</h3>
                <div className="space-y-4">
                  {careOptions.map((option) => (
                    <div key={option.type} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {option.type === 'babies' && 'Ages 0-2'}
                          {option.type === 'kids' && 'Ages 3-12'}
                          {option.type === 'pets' && 'Dogs, cats, etc.'}
                          {option.type === 'elderly' && 'Senior care'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-coral disabled:opacity-30"
                          onClick={() => updateCareOption(option.type, false)}
                          disabled={option.count === 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{option.count}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-coral"
                          onClick={() => updateCareOption(option.type, true)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Dropdown */}
            {activeField === 'service' && (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-1">
                  {SERVICE_TYPES.map((service) => (
                    <div
                      key={service}
                      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm"
                      onClick={() => handleServiceSelect(service)}
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}