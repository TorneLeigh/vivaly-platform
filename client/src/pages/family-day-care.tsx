import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Baby, Clock, Star, Shield, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Nanny, User } from "@shared/schema";

interface FamilyDayCareProvider extends Nanny {
  user: User;
  availableSpaces: number;
  availableBabySpaces: number;
}

export default function FamilyDayCarePage() {
  const [filters, setFilters] = useState({
    suburb: "",
    maxRate: "",
    ageGroup: ""
  });

  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/childcare/providers", filters],
    queryFn: () => 
      fetch(`/api/childcare/providers?${new URLSearchParams(filters)}`).then(res => res.json())
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Childcare in Sydney
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Licensed home-based childcare with space available now
          </p>
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">No waiting lists - Apply today and start Monday!</span>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
              <input
                type="text"
                placeholder="Enter suburb"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.suburb}
                onChange={(e) => setFilters({...filters, suburb: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Child's Age</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.ageGroup}
                onChange={(e) => setFilters({...filters, ageGroup: e.target.value})}
              >
                <option value="">Any age</option>
                <option value="baby">Baby (0-2 years)</option>
                <option value="preschool">Preschool (3-5 years)</option>
                <option value="school-age">School age (6+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Weekly Rate</label>
              <input
                type="number"
                placeholder="e.g. 400"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.maxRate}
                onChange={(e) => setFilters({...filters, maxRate: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {/* refresh query */}}
              >
                Find Care
              </Button>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((provider: FamilyDayCareProvider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF5F7E] to-[#FFA24D] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {provider.user.firstName[0]}{provider.user.lastName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {provider.user.firstName} {provider.user.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {provider.suburb}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Availability Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-sm">Total Spaces</span>
                    </div>
                    <div className="text-lg font-bold text-green-800">
                      {provider.availableSpaces}/{provider.maxCapacity}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Baby className="w-4 h-4" />
                      <span className="font-semibold text-sm">Baby Spaces</span>
                    </div>
                    <div className="text-lg font-bold text-blue-800">
                      {provider.availableBabySpaces}/{provider.maxBabies}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Weekly Rate</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${provider.weeklyRate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Monthly Rate</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${provider.monthlyRate}
                    </span>
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2">
                  {provider.hasEducatorCertificate && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Educator Cert
                    </Badge>
                  )}
                  {provider.hasWwcc && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      <Shield className="w-3 h-3 mr-1" />
                      WWCC
                    </Badge>
                  )}
                  {provider.hasFirstAid && (
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      <Shield className="w-3 h-3 mr-1" />
                      First Aid
                    </Badge>
                  )}
                  {provider.hasInsurance && (
                    <Badge variant="outline" className="text-purple-700 border-purple-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Insured
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href={`/caregiver/${provider.id}`}>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Link href={`/childcare/enroll/${provider.id}`}>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={provider.availableSpaces === 0}
                    >
                      {provider.availableSpaces > 0 ? "Apply Now" : "Full"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {providers?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No family day care providers found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search filters or check back later for new providers.
            </p>
            <Button onClick={() => setFilters({suburb: "", maxRate: "", ageGroup: ""})}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Home-Based Childcare Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Small Groups</h3>
              <p className="text-gray-600">
                Maximum 7 children in a home environment with personalized attention
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">
                All providers are licensed, certified, and fully insured for your peace of mind
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Arrangements</h3>
              <p className="text-gray-600">
                Weekly or monthly enrollments with consistent care from the same educator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}