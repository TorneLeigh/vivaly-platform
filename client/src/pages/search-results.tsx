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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchFilters onSearch={handleSearch} className="mb-4" />
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-warm-gray">
              {isLoading ? 'Searching...' : `${nannies.length} caregivers found`}
            </h1>
            
            <div className="flex items-center space-x-2">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <Card className="w-64">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      <span className="font-medium">Filters</span>
                    </div>
                    <FilterContent />
                  </CardContent>
                </Card>
              </div>
              
              {/* Mobile Filters */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
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
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : nannies.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No caregivers available</h3>
              <p className="text-gray-500 mb-6">
                No caregivers match your search criteria for the selected date and time. Try adjusting your filters or selecting different dates.
              </p>
              <Button onClick={() => window.location.reload()} className="bg-coral hover:bg-coral/90">
                Reset Search
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 p-4 bg-soft-green bg-opacity-10 rounded-lg border border-soft-green border-opacity-20">
              <h3 className="font-semibold text-soft-green mb-2">Available Caregivers Found</h3>
              <p className="text-gray-700 text-sm">
                All caregivers shown below are verified, background-checked, and available for your selected time slot. 
                You can book instantly with any of these approved providers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {nannies.map((nanny: Nanny & { user: User }) => (
                <NannyCard key={nanny.id} nanny={nanny} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
