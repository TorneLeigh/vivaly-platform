import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import SearchFilters from "@/components/search-filters";
import CaregiverSearchResults from "@/components/caregiver-search-results";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Lock } from "lucide-react";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // Parse search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const initialFilters = {
    location: searchParams.get("location") || "",
    serviceType: searchParams.get("serviceType") || "",
    date: searchParams.get("date") || "",
    startTime: searchParams.get("startTime") || "",
    endTime: searchParams.get("endTime") || "",
    numberOfPeople: searchParams.get("numberOfPeople") || "",
  };

  const [searchFilters, setSearchFilters] = useState(initialFilters);

  const handleFiltersChange = (newFilters: typeof searchFilters) => {
    setSearchFilters(newFilters);
    
    // Update URL with new search parameters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    setLocation(newUrl);
  };

  const handleNewSearch = (filters: typeof searchFilters) => {
    handleFiltersChange(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            
            {searchFilters.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {searchFilters.location}
              </div>
            )}
          </div>
          
          {/* Compact Search Filters */}
          <SearchFilters
            onSearch={handleNewSearch}
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Search Results */}
      <CaregiverSearchResults
        searchFilters={searchFilters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}