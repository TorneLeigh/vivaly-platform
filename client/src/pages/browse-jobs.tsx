import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Clock, DollarSign, Users, Star, Filter, Search } from "lucide-react";

interface Job {
  id: string;
  title: string;
  parentName: string;
  location: string;
  suburb: string;
  hourlyRate: number;
  startDate: string;
  endDate: string;
  description: string;
  numberOfChildren: number;
  childrenAges: string[];
  positionType: string;
  hoursPerWeek: number;
  requirements: string[];
  urgency: 'low' | 'medium' | 'high';
  postedDate: string;
}

export default function BrowseJobs() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [positionTypeFilter, setPositionTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock job data - in real implementation, this would come from API
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Full-time Nanny for 2 Children',
      parentName: 'Sarah Johnson',
      location: 'Sydney CBD',
      suburb: 'Pyrmont',
      hourlyRate: 42,
      startDate: '2025-07-01',
      endDate: '2026-06-30',
      description: 'Looking for an experienced, loving nanny to care for our 3-year-old and 6-year-old. Must be comfortable with school pickup/dropoff and light meal preparation.',
      numberOfChildren: 2,
      childrenAges: ['3', '6'],
      positionType: 'recurring-help',
      hoursPerWeek: 40,
      requirements: ['WWCC', 'First Aid', 'References', 'Own transport'],
      urgency: 'medium',
      postedDate: '2025-06-15'
    },
    {
      id: '2',
      title: 'After School Care - Twin Boys',
      parentName: 'Mike Chen',
      location: 'North Sydney',
      suburb: 'Neutral Bay',
      hourlyRate: 38,
      startDate: '2025-06-20',
      endDate: '2025-12-15',
      description: 'Seeking reliable after-school care for energetic 8-year-old twins. School pickup at 3:30pm, homework supervision, and outdoor activities.',
      numberOfChildren: 2,
      childrenAges: ['8', '8'],
      positionType: 'recurring-help',
      hoursPerWeek: 20,
      requirements: ['WWCC', 'Experience with school-age children'],
      urgency: 'high',
      postedDate: '2025-06-16'
    },
    {
      id: '3',
      title: 'Emergency Babysitter Needed',
      parentName: 'Emma Williams',
      location: 'Eastern Suburbs',
      suburb: 'Bondi',
      hourlyRate: 45,
      startDate: '2025-06-17',
      endDate: '2025-06-17',
      description: 'Last-minute babysitting needed for tonight 6-10pm. One 4-year-old girl, very easy-going. Dinner provided.',
      numberOfChildren: 1,
      childrenAges: ['4'],
      positionType: 'last-minute-notice',
      hoursPerWeek: 4,
      requirements: ['WWCC', 'Available tonight'],
      urgency: 'high',
      postedDate: '2025-06-16'
    },
    {
      id: '4',
      title: 'Weekend Nanny - Newborn Care',
      parentName: 'Jessica Brown',
      location: 'Inner West',
      suburb: 'Newtown',
      hourlyRate: 50,
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      description: 'Experienced newborn specialist needed for weekend care. 8-week-old baby, parents need support while adjusting to parenthood.',
      numberOfChildren: 1,
      childrenAges: ['0'],
      positionType: 'short-term',
      hoursPerWeek: 16,
      requirements: ['WWCC', 'Newborn experience', 'References'],
      urgency: 'medium',
      postedDate: '2025-06-14'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesPositionType = !positionTypeFilter || job.positionType === positionTypeFilter;
    
    return matchesSearch && matchesLocation && matchesPositionType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'highest-pay':
        return b.hourlyRate - a.hourlyRate;
      case 'urgent':
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      default:
        return 0;
    }
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionTypeLabel = (type: string) => {
    switch (type) {
      case 'recurring-help': return 'Recurring help';
      case 'short-term': return 'Short term';
      case 'last-minute-notice': return 'Last minute notice';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find your next childcare opportunity</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All locations</SelectItem>
                  <SelectItem value="sydney cbd">Sydney CBD</SelectItem>
                  <SelectItem value="north sydney">North Sydney</SelectItem>
                  <SelectItem value="eastern suburbs">Eastern Suburbs</SelectItem>
                  <SelectItem value="inner west">Inner West</SelectItem>
                </SelectContent>
              </Select>

              <Select value={positionTypeFilter} onValueChange={setPositionTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Position type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="recurring-help">Recurring help</SelectItem>
                  <SelectItem value="short-term">Short term</SelectItem>
                  <SelectItem value="last-minute-notice">Last minute notice</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="highest-pay">Highest pay</SelectItem>
                  <SelectItem value="urgent">Most urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Results */}
        <div className="space-y-4">
          {sortedJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <Badge className={getUrgencyColor(job.urgency)}>
                          {job.urgency} priority
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">Posted by {job.parentName}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.hoursPerWeek} hrs/week
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${job.hourlyRate}/hour
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.numberOfChildren} {job.numberOfChildren === 1 ? 'child' : 'children'} (ages {job.childrenAges.join(', ')})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{getPositionTypeLabel(job.positionType)}</Badge>
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Save Job
                      </Button>
                      <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {sortedJobs.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Showing {sortedJobs.length} of {jobs.length} jobs
            </p>
            <Button variant="outline">Load More Jobs</Button>
          </div>
        )}
      </div>
    </div>
  );
}