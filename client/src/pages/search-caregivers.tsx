import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Users,
  Clock,
  DollarSign,
  Heart,
  Calendar
} from "lucide-react";
import type { Nanny } from "@shared/schema";

export default function SearchCaregivers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Fetch caregivers
  const { data: caregivers = [], isLoading, error } = useQuery({
    queryKey: ['/api/nannies'],
    queryFn: async () => {
      const response = await fetch('/api/nannies');
      if (!response.ok) {
        console.error('Failed to fetch caregivers:', response.status, response.statusText);
        throw new Error('Failed to fetch caregivers');
      }
      const data = await response.json();
      console.log('Fetched caregivers:', data);
      return data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const filteredCaregivers = caregivers.filter((caregiver: Nanny) => {
    const matchesSearch = !searchQuery || 
      caregiver.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !location || 
      caregiver.suburb?.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const serviceTypes = [
    "All Services",
    "Infant Care",
    "Toddler Care", 
    "School Age Care",
    "Special Needs Care",
    "Overnight Care",
    "Emergency Care"
  ];

  const priceRanges = [
    "All Prices",
    "$25-35/hour",
    "$35-45/hour", 
    "$45-55/hour",
    "$55+/hour"
  ];

  const sydneyLocations = [
    "Bondi", "Surry Hills", "Paddington", "Newtown", "Glebe",
    "Darlinghurst", "Potts Point", "Woollahra", "Double Bay", "Rose Bay"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Caregiver
          </h1>
          <p className="text-lg text-gray-600">
            Connect with trusted, verified caregivers in your area
          </p>
        </div>

        {/* Safety Notice */}
        <div className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] border-l-4 border-[#FF5F7E] text-white p-4 rounded-md mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <strong>🔒 Stay Protected with VIVALY</strong>
              <p className="mt-1 text-sm">
                To help keep our community safe and ensure we can provide support if needed, <b>VIVALY is only able to assist with issues when all communication has taken place through the VIVALY chat.</b><br />
                Please avoid sharing personal contact details or moving conversations off-platform until a booking is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="search">Search Caregivers</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Skills, experience, qualifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="Suburb or area..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service">Service Type</Label>
                <select
                  id="service"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type === "All Services" ? "" : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="price">Price Range</Label>
                <select
                  id="price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range === "All Prices" ? "" : range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredCaregivers.length} caregiver{filteredCaregivers.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding caregivers...</p>
          </div>
        ) : filteredCaregivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No caregivers found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCaregivers.map((caregiver: Nanny, index: number) => (
              <Card key={caregiver.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Profile Photo */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                      {caregiver.profileImageUrl ? (
                        <img 
                          src={caregiver.profileImageUrl}
                          alt="Caregiver profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF5F7E] to-[#FFA24D] flex items-center justify-center text-white font-semibold text-xl">
                          {caregiver.firstName?.[0]?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {caregiver.firstName} {caregiver.lastName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {caregiver.suburb || caregiver.location}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Verification Badge */}
                  {caregiver.isVerified && (
                    <div className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-md inline-block mb-3">
                      ✔️ Verified Caregiver — ID, WWCC, and Intro Video Confirmed
                    </div>
                  )}

                  {/* Professional Liability Coverage */}
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block mb-3">
                    🛡️ Covered by VIVALY Professional Liability
                  </span>

                  {/* Bio */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {caregiver.bio || "Experienced caregiver passionate about child development and safety. Creating nurturing environments where children can learn, play, and grow."}
                  </p>

                  {/* Skills/Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">Infant Care</Badge>
                    <Badge variant="secondary" className="text-xs">First Aid</Badge>
                    <Badge variant="secondary" className="text-xs">Meal Prep</Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center text-yellow-500 mb-1">
                        <Star className="h-4 w-4" />
                        <span className="ml-1 font-medium">{caregiver.rating || '4.9'}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-gray-700 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="ml-1 font-medium">{caregiver.experience || '5'}</span>
                      </div>
                      <p className="text-xs text-gray-500">Years Exp</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="ml-1 font-medium">{caregiver.hourlyRate || '38'}</span>
                      </div>
                      <p className="text-xs text-gray-500">Per Hour</p>
                    </div>
                  </div>

                  {/* Platform Commitment Notice */}
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm mb-4">
                    VIVALY is committed to community safety. When care is booked through our platform, you're backed by our support team and dispute mediation process.
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                      onClick={() => window.location.href = `/nanny/${caregiver.id}`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      VIEW PROFILE
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredCaregivers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No caregivers found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or browse all available caregivers.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setLocation("");
                  setServiceType("");
                  setPriceRange("");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}