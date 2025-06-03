import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import NannyCard from "@/components/nanny-card";
import SearchFilters from "@/components/search-filters";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Nanny, User } from "@shared/schema";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    serviceType: searchParams.get('serviceType') || '',
    date: searchParams.get('date') || '',
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    minRate: 20,
    maxRate: 50,
  });

  // Debug the URL parameters
  console.log('URL Search Params:', Object.fromEntries(searchParams.entries()));
  console.log('Initial filters state:', filters);

  const { data: nannies = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/nannies/search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.set('location', filters.location);
      if (filters.serviceType) params.set('serviceType', filters.serviceType);
      if (filters.date) params.set('date', filters.date);
      params.set('minRate', filters.minRate.toString());
      params.set('maxRate', filters.maxRate.toString());
      
      const response = await fetch(`/api/nannies/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search nannies');
      return response.json();
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const handleSearch = (searchFilters: { location: string; serviceType: string; date: string; startTime: string; endTime: string }) => {
    setFilters(prev => ({
      ...prev,
      ...searchFilters,
    }));
  };

  const handleRateChange = (rates: number[]) => {
    setFilters(prev => ({
      ...prev,
      minRate: rates[0],
      maxRate: rates[1],
    }));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">Price Range</Label>
        <div className="px-3">
          <Slider
            value={[filters.minRate, filters.maxRate]}
            onValueChange={handleRateChange}
            max={100}
            min={15}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${filters.minRate}/hr</span>
            <span>${filters.maxRate}/hr</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Search Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 mb-6">
            <SearchFilters onSearch={handleSearch} />
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLoading ? 'Searching...' : `${nannies.length} caregivers available`}
            </h1>
            
            {/* Mobile Filters Only */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Results</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect caregiver
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Results Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Refine Search</h3>
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 pb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : nannies.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No caregivers found</h3>
                  <p className="text-gray-600 mb-8">
                    Try adjusting your search criteria or browse our featured caregivers instead.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Reset Search
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/'}
                      className="w-full"
                    >
                      Browse All Caregivers
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nannies.map((nanny: Nanny & { user: User }) => (
                  <NannyCard key={nanny.id} nanny={nanny} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
