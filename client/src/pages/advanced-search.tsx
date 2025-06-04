import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Star, 
  Calendar as CalendarIcon,
  Filter,
  X,
  Shield,
  Award
} from "lucide-react";
import NannyCard from "@/components/nanny-card";
import type { Nanny, User } from "@shared/schema";

type CaregiverWithUser = Nanny & { user: User };

export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    location: "",
    serviceType: "",
    minRate: 20,
    maxRate: 80,
    minRating: 0,
    experience: "",
    availability: null as Date | null,
    verified: false,
    certifications: [] as string[],
    ageGroups: [] as string[],
    languages: [] as string[],
    specialNeeds: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: caregivers = [], isLoading } = useQuery<CaregiverWithUser[]>({
    queryKey: ["/api/nannies/search", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== false && 
            (Array.isArray(value) ? value.length > 0 : true)) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value.toString());
          }
        }
      });
      return fetch(`/api/nannies/advanced-search?${params}`).then(res => res.json());
    },
  });

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev].includes(value)
        ? prev[key as keyof typeof prev].filter((item: string) => item !== value)
        : [...prev[key as keyof typeof prev], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      serviceType: "",
      minRate: 20,
      maxRate: 80,
      minRating: 0,
      experience: "",
      availability: null,
      verified: false,
      certifications: [],
      ageGroups: [],
      languages: [],
      specialNeeds: false,
    });
  };

  const serviceTypes = [
    "Childcare", "Nanny", "Babysitting", "Au Pair", 
    "After School Care", "Holiday Care", "Overnight Care"
  ];

  const certifications = [
    "First Aid", "CPR", "Working with Children Check", 
    "Police Check", "Early Childhood Education", 
    "Special Needs Training", "Newborn Care"
  ];

  const ageGroups = [
    "Newborn (0-3 months)", "Baby (3-12 months)", 
    "Toddler (1-3 years)", "Preschool (3-5 years)", 
    "School Age (5-12 years)", "Teenager (13+ years)"
  ];

  const languages = [
    "English", "Mandarin", "Spanish", "Arabic", 
    "French", "Italian", "German", "Japanese"
  ];

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minRate' || key === 'maxRate') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== "" && value !== null && value !== 0;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Caregiver</h1>
          <p className="text-gray-600 mt-2">Use advanced filters to find exactly what you need</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary">{activeFiltersCount}</Badge>
                    )}
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    placeholder="Enter suburb or city"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                  />
                </div>

                {/* Service Type */}
                <div>
                  <Label className="mb-2 block">Service Type</Label>
                  <Select value={filters.serviceType} onValueChange={(value) => updateFilter('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4" />
                    Hourly Rate: ${filters.minRate} - ${filters.maxRate}
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Min: ${filters.minRate}</Label>
                      <Slider
                        value={[filters.minRate]}
                        onValueChange={([value]) => updateFilter('minRate', value)}
                        min={15}
                        max={100}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Max: ${filters.maxRate}</Label>
                      <Slider
                        value={[filters.maxRate]}
                        onValueChange={([value]) => updateFilter('maxRate', value)}
                        min={15}
                        max={100}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4" />
                    Minimum Rating
                  </Label>
                  <Select value={filters.minRating.toString()} onValueChange={(value) => updateFilter('minRating', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.verified}
                    onCheckedChange={(checked) => updateFilter('verified', checked)}
                  />
                  <Label htmlFor="verified" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verified caregivers only
                  </Label>
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
                </Button>

                {showAdvanced && (
                  <>
                    <Separator />

                    {/* Experience */}
                    <div>
                      <Label className="mb-2 block">Experience</Label>
                      <Select value={filters.experience} onValueChange={(value) => updateFilter('experience', value)}>
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

                    {/* Availability */}
                    <div>
                      <Label className="mb-2 block">Available On</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {filters.availability ? 
                              filters.availability.toLocaleDateString() : 
                              "Select date"
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.availability}
                            onSelect={(date) => updateFilter('availability', date)}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Certifications */}
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4" />
                        Certifications
                      </Label>
                      <div className="space-y-2">
                        {certifications.map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox
                              id={cert}
                              checked={filters.certifications.includes(cert)}
                              onCheckedChange={() => toggleArrayFilter('certifications', cert)}
                            />
                            <Label htmlFor={cert} className="text-sm">{cert}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Age Groups */}
                    <div>
                      <Label className="mb-2 block">Age Groups</Label>
                      <div className="space-y-2">
                        {ageGroups.map((age) => (
                          <div key={age} className="flex items-center space-x-2">
                            <Checkbox
                              id={age}
                              checked={filters.ageGroups.includes(age)}
                              onCheckedChange={() => toggleArrayFilter('ageGroups', age)}
                            />
                            <Label htmlFor={age} className="text-sm">{age}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="mb-2 block">Languages</Label>
                      <div className="space-y-2">
                        {languages.map((lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox
                              id={lang}
                              checked={filters.languages.includes(lang)}
                              onCheckedChange={() => toggleArrayFilter('languages', lang)}
                            />
                            <Label htmlFor={lang} className="text-sm">{lang}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Needs */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="specialNeeds"
                        checked={filters.specialNeeds}
                        onCheckedChange={(checked) => updateFilter('specialNeeds', checked)}
                      />
                      <Label htmlFor="specialNeeds" className="text-sm">
                        Special needs experience
                      </Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoading ? 'Searching...' : `${caregivers.length} caregivers found`}
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filtered by {activeFiltersCount} criteria
                  </p>
                )}
              </div>
              
              <Select defaultValue="recommended">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to high</SelectItem>
                  <SelectItem value="price-high">Price: High to low</SelectItem>
                  <SelectItem value="experience">Most experienced</SelectItem>
                  <SelectItem value="newest">Newest members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : caregivers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No caregivers found</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Try adjusting your filters or expanding your search area
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {caregivers.map((caregiver) => (
                  <NannyCard key={caregiver.id} nanny={caregiver} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}