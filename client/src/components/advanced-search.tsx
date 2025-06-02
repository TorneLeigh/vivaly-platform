import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Filter, 
  DollarSign, 
  Star, 
  Shield,
  ChevronDown,
  X
} from "lucide-react";
import { SERVICE_TYPES, CERTIFICATE_TYPES } from "@shared/schema";

interface AdvancedSearchProps {
  onSearch: (filters: {
    location: string;
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
    minRate?: number;
    maxRate?: number;
    experience?: number;
    isVerified?: boolean;
    hasReviews?: boolean;
    rating?: number;
    certificates?: string[];
    availability?: string;
    instantBook?: boolean;
  }) => void;
  className?: string;
}

export default function AdvancedSearch({ onSearch, className = "" }: AdvancedSearchProps) {
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priceRange, setPriceRange] = useState([20, 100]);
  const [experience, setExperience] = useState([0]);
  const [isVerified, setIsVerified] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [minRating, setMinRating] = useState([0]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [instantBook, setInstantBook] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const handleSearch = () => {
    const filters = {
      location,
      serviceType,
      date,
      startTime,
      endTime,
      minRate: priceRange[0],
      maxRate: priceRange[1],
      experience: experience[0],
      isVerified,
      hasReviews,
      rating: minRating[0],
      certificates,
      availability,
      instantBook
    };

    // Update applied filters for display
    const filterLabels = [];
    if (location) filterLabels.push(`Location: ${location}`);
    if (serviceType) filterLabels.push(`Service: ${serviceType}`);
    if (priceRange[0] > 20 || priceRange[1] < 100) {
      filterLabels.push(`Price: $${priceRange[0]}-$${priceRange[1]}/hr`);
    }
    if (experience[0] > 0) filterLabels.push(`Experience: ${experience[0]}+ years`);
    if (isVerified) filterLabels.push("Verified");
    if (hasReviews) filterLabels.push("Has Reviews");
    if (minRating[0] > 0) filterLabels.push(`${minRating[0]}+ stars`);
    if (certificates.length > 0) filterLabels.push(`Certificates: ${certificates.length}`);
    if (instantBook) filterLabels.push("Instant Book");

    setAppliedFilters(filterLabels);
    onSearch(filters);
  };

  const clearFilters = () => {
    setLocation("");
    setServiceType("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setPriceRange([20, 100]);
    setExperience([0]);
    setIsVerified(false);
    setHasReviews(false);
    setMinRating([0]);
    setCertificates([]);
    setAvailability("");
    setInstantBook(false);
    setAppliedFilters([]);
  };

  const removeFilter = (filterToRemove: string) => {
    const newFilters = appliedFilters.filter(f => f !== filterToRemove);
    setAppliedFilters(newFilters);
    
    // Reset corresponding state based on filter
    if (filterToRemove.includes("Location")) setLocation("");
    if (filterToRemove.includes("Service")) setServiceType("");
    if (filterToRemove.includes("Price")) setPriceRange([20, 100]);
    if (filterToRemove.includes("Experience")) setExperience([0]);
    if (filterToRemove.includes("Verified")) setIsVerified(false);
    if (filterToRemove.includes("Has Reviews")) setHasReviews(false);
    if (filterToRemove.includes("stars")) setMinRating([0]);
    if (filterToRemove.includes("Certificates")) setCertificates([]);
    if (filterToRemove.includes("Instant Book")) setInstantBook(false);
  };

  const toggleCertificate = (cert: string) => {
    setCertificates(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    );
  };

  return (
    <div className={className}>
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Perfect Caregiver
            </span>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inner Sydney">Inner Sydney</SelectItem>
                  <SelectItem value="Eastern Suburbs">Eastern Suburbs</SelectItem>
                  <SelectItem value="Northern Beaches">Northern Beaches</SelectItem>
                  <SelectItem value="North Shore">North Shore</SelectItem>
                  <SelectItem value="Western Sydney">Western Sydney</SelectItem>
                  <SelectItem value="Southern Sydney">Southern Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="startTime">Start</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time" />
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
              <div className="flex-1">
                <Label htmlFor="endTime">End</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time" />
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

          {/* Advanced Filters */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={150}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label>Minimum Experience: {experience[0]} years</Label>
                  <Slider
                    value={experience}
                    onValueChange={setExperience}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Minimum Rating: {minRating[0]} stars
                  </Label>
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={isVerified}
                    onCheckedChange={setIsVerified}
                  />
                  <Label htmlFor="verified" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verified Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reviews"
                    checked={hasReviews}
                    onCheckedChange={setHasReviews}
                  />
                  <Label htmlFor="reviews">Has Reviews</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instant"
                    checked={instantBook}
                    onCheckedChange={setInstantBook}
                  />
                  <Label htmlFor="instant">Instant Book</Label>
                </div>

                <div>
                  <Label>Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Weekends">Weekends</SelectItem>
                      <SelectItem value="Evenings">Evenings</SelectItem>
                      <SelectItem value="Overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Certificates */}
              <div className="space-y-2">
                <Label>Required Certificates</Label>
                <div className="flex flex-wrap gap-2">
                  {CERTIFICATE_TYPES.map((cert) => (
                    <Badge
                      key={cert}
                      variant={certificates.includes(cert) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCertificate(cert)}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Applied Filters</Label>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="bg-coral hover:bg-coral/90 flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search Caregivers
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}