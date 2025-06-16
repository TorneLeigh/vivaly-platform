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
  "Drop and dash"
];

interface CareOption {
  type: 'babies' | 'kids';
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
    { type: 'kids', label: 'Kids', count: 0 }
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
    if (totalCount === 0) return "Add people";
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
                    <div className="text-xs font-medium text-gray-700">WHERE</div>
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
            <div className="md:hidden flex-1">
              {!isExpanded ? (
                // Collapsed mobile search - Airbnb style
                <div 
                  className="flex items-center space-x-3 cursor-pointer" 
                  onClick={() => setIsExpanded(true)}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {filters.location || "Where to?"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedDate ? format(selectedDate, "MMM d") : "Any week"} • {getCareForDisplay()}
                    </div>
                  </div>
                </div>
              ) : (
                // Expanded mobile search - Clean card-style fields
                <div className="space-y-2">
                  {/* Close button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Search</h3>
                    <button 
                      onClick={() => {
                        setIsExpanded(false);
                        setActiveField(null);
                      }}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <div className="w-4 h-0.5 bg-gray-600 transform rotate-45 absolute"></div>
                      <div className="w-4 h-0.5 bg-gray-600 transform -rotate-45 absolute"></div>
                    </button>
                  </div>

                  {/* Where field */}
                  <div 
                    className={cn(
                      "p-4 border-2 rounded-xl cursor-pointer transition-all",
                      activeField === 'where' 
                        ? "border-coral bg-coral/5" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                    onClick={() => handleFieldClick('where')}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">WHERE</div>
                        <div className="text-base font-medium text-gray-900 mt-0.5">
                          {filters.location || "I'm flexible"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* When field */}
                  <div 
                    className={cn(
                      "p-4 border-2 rounded-xl cursor-pointer transition-all",
                      activeField === 'when' 
                        ? "border-coral bg-coral/5" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                    onClick={() => handleFieldClick('when')}
                  >
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">WHEN</div>
                        <div className="text-base font-medium text-gray-900 mt-0.5">
                          {selectedDate ? format(selectedDate, "MMM d, yyyy") : "I'm flexible"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Who field */}
                  <div 
                    className={cn(
                      "p-4 border-2 rounded-xl cursor-pointer transition-all",
                      activeField === 'careFor' 
                        ? "border-coral bg-coral/5" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                    onClick={() => handleFieldClick('careFor')}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">WHO</div>
                        <div className="text-base font-medium text-gray-900 mt-0.5">
                          {getCareForDisplay()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service field */}
                  <div 
                    className={cn(
                      "p-4 border-2 rounded-xl cursor-pointer transition-all",
                      activeField === 'service' 
                        ? "border-coral bg-coral/5" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                    onClick={() => handleFieldClick('service')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-500 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">SERVICE</div>
                        <div className="text-base font-medium text-gray-900 mt-0.5">
                          {filters.serviceType || "Any service"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleSearch}
                      className="w-full h-12 rounded-xl text-white font-semibold"
                      style={{ backgroundColor: '#FFBD59' }}
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button - Desktop only */}
            <Button
              onClick={handleSearch}
              className="hidden md:flex rounded-full p-3 ml-4 flex-shrink-0"
              style={{ backgroundColor: '#FFBD59' }}
              size="sm"
            >
              <Search className="h-4 w-4 text-white" />
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
              <div className="p-4 md:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">What type of care do you need?</h3>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICE_TYPES.map((service) => (
                    <div
                      key={service}
                      className={cn(
                        "p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors border border-transparent",
                        filters.serviceType === service ? "bg-coral/10 border-coral text-coral font-medium" : "text-gray-700"
                      )}
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