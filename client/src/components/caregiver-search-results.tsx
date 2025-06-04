import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import MobileBookingFlow from "@/components/mobile-booking-flow";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Calendar,
  Filter,
  SlidersHorizontal,
  Heart,
  MessageCircle,
  ChevronRight,
  X
} from "lucide-react";
import { Link } from "wouter";

interface SearchFilters {
  location: string;
  serviceType: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: string;
}

interface CaregiverSearchResultsProps {
  searchFilters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function CaregiverSearchResults({ searchFilters, onFiltersChange }: CaregiverSearchResultsProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([15, 60]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<any>(null);
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["/api/nannies/search", searchFilters, sortBy, priceRange, experienceFilter, verifiedOnly, availableToday],
    enabled: !!searchFilters.location || !!searchFilters.serviceType,
  });

  const handleBookNow = (caregiver: any) => {
    setSelectedCaregiver(caregiver);
    setShowMobileBooking(true);
  };

  const filteredResults = (searchResults as any[]).filter((caregiver: any) => {
    const hourlyRate = parseFloat(caregiver.hourlyRate || "0");
    const meetsPrice = hourlyRate >= priceRange[0] && hourlyRate <= priceRange[1];
    const meetsExperience = !experienceFilter || caregiver.experience >= parseInt(experienceFilter);
    const meetsVerification = !verifiedOnly || caregiver.isVerified;
    
    return meetsPrice && meetsExperience && meetsVerification;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.hourlyRate || "0") - parseFloat(b.hourlyRate || "0");
      case "price-high":
        return parseFloat(b.hourlyRate || "0") - parseFloat(a.hourlyRate || "0");
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "experience":
        return (b.experience || 0) - (a.experience || 0);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Summary & Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filteredResults.length} caregivers found
            </h1>
            <p className="text-gray-600 mt-1">
              {searchFilters.location && `in ${searchFilters.location}`}
              {searchFilters.serviceType && searchFilters.serviceType !== "All Services" && 
                ` for ${searchFilters.serviceType}`}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most experienced</SelectItem>
                <SelectItem value="newest">Newest profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Minimum Experience
                </label>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                  />
                  <label htmlFor="verified" className="text-sm font-medium text-gray-700">
                    Verified caregivers only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={availableToday}
                    onCheckedChange={(checked) => setAvailableToday(checked === true)}
                  />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700">
                    Available today
                  </label>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([15, 60]);
                    setExperienceFilter("");
                    setVerifiedOnly(false);
                    setAvailableToday(false);
                  }}
                  className="w-full"
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((caregiver: any) => (
            <Card key={caregiver.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={caregiver.user?.profileImage} />
                        <AvatarFallback>
                          {caregiver.user?.firstName?.[0]}{caregiver.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {caregiver.user?.firstName} {caregiver.user?.lastName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {caregiver.suburb}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{caregiver.rating}</span>
                      <span className="text-sm text-gray-500">({caregiver.reviewCount})</span>
                    </div>
                    <div className="text-lg font-bold text-coral">
                      ${caregiver.hourlyRate}/hr
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {caregiver.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {caregiver.experience}+ years
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {caregiver.bio}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/nanny/${caregiver.id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-coral hover:bg-coral/90"
                      onClick={() => handleBookNow(caregiver)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && sortedResults.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No caregivers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or removing some filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setPriceRange([15, 60]);
              setExperienceFilter("");
              setVerifiedOnly(false);
              setAvailableToday(false);
              setShowAdvancedFilters(false);
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Mobile Booking Flow */}
      {showMobileBooking && selectedCaregiver && (
        <MobileBookingFlow
          caregiver={{
            id: selectedCaregiver.id,
            user: {
              firstName: selectedCaregiver.user?.firstName || "",
              lastName: selectedCaregiver.user?.lastName || "",
              profileImage: selectedCaregiver.user?.profileImage || undefined,
            },
            hourlyRate: selectedCaregiver.hourlyRate || "0",
            rating: selectedCaregiver.rating || "0",
            reviewCount: selectedCaregiver.reviewCount || 0,
            location: `${selectedCaregiver.suburb}, Sydney`,
            bio: selectedCaregiver.bio || "",
            isVerified: selectedCaregiver.isVerified || false,
            serviceTypes: selectedCaregiver.services || [],
          }}
          onClose={() => {
            setShowMobileBooking(false);
            setSelectedCaregiver(null);
          }}
        />
      )}
    </div>
  );
}