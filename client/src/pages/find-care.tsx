import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Clock, Calendar, Heart, Search } from "lucide-react";
import { Link } from "wouter";

interface Caregiver {
  id: number;
  userId: number;
  bio: string;
  experience: number;
  hourlyRate: number;
  weeklyAvailability: string[];
  specializations: string[];
  location: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  verification?: {
    backgroundCheck: boolean;
    wwccVerified: boolean;
  };
}



export default function FindCare() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuburb, setSelectedSuburb] = useState("");

  // Fetch caregivers using existing nannies endpoint
  const { data: caregivers = [], isLoading: loadingChildcare, error } = useQuery({
    queryKey: ["/api/nannies/featured"],
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });



  const filteredCaregivers = (caregivers as Caregiver[]).filter((caregiver: Caregiver) =>
    caregiver.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedSuburb === "" || caregiver.location.toLowerCase().includes(selectedSuburb.toLowerCase()))
  );



  const suburbs = ["Bondi", "Surry Hills", "Paddington", "Newtown", "Manly", "Chatswood", "Parramatta", "Randwick"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Trusted Caregivers
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with verified nannies, babysitters and childcare professionals
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Suburbs</option>
                {suburbs.map((suburb) => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
              <Button className="w-full">
                Search Care Options
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Childcare Centers Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Caregivers
            </h2>
            <Badge variant="outline" className="text-sm">
              {filteredCaregivers.length} available
            </Badge>
          </div>

          {loadingChildcare ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Unable to load caregivers. Please try again.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredCaregivers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No caregivers found matching your search.</p>
              <Button onClick={() => {setSearchTerm(""); setSelectedSuburb("");}} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChildcare.map((provider: ChildcareProvider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {provider.centerName}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {provider.suburb}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {provider.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs">
                      {provider.ageGroups.map((age, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {age}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{provider.totalCapacity - provider.currentEnrollments} spots available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{provider.startTime} - {provider.endTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {provider.rating || "New"} 
                          {provider.reviewCount && ` (${provider.reviewCount})`}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ${provider.dailyRate}/day
                        </div>
                        <div className="text-xs text-gray-500">
                          ${provider.hourlyRate}/hr
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Link href={`/childcare-enroll/${provider.id}`}>
                        <Button size="sm" className="flex-1">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loadingChildcare && filteredChildcare.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No caregivers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or location
              </p>
            </div>
          )}
        </section>


      </div>
    </div>
  );
}