import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import NannyCard from "@/components/nanny-card";
import SearchFilters from "@/components/search-filters";
import { 
  User, 
  Users, 
  Puzzle, 
  Clock, 
  Heart,
  Shield,
  IdCard,
  MessageCircle,
  ShieldCheck,
  Plus,
  Search
} from "lucide-react";
import type { Nanny, User as UserType } from "@shared/schema";

const serviceCategories = [
  {
    icon: User,
    title: "1-on-1 Care",
    description: "Personal attention",
    bgColor: "bg-soft-green bg-opacity-10",
    iconColor: "text-soft-green",
    serviceType: "1-on-1 Care"
  },
  {
    icon: Users,
    title: "Group Care", 
    description: "Small groups",
    bgColor: "bg-trust-blue bg-opacity-10",
    iconColor: "text-trust-blue",
    serviceType: "Group Care"
  },
  {
    icon: Puzzle,
    title: "Group Play",
    description: "Fun activities", 
    bgColor: "bg-coral bg-opacity-10",
    iconColor: "text-coral",
    serviceType: "Group Play"
  },
  {
    icon: Clock,
    title: "Drop & Dash",
    description: "Quick care",
    bgColor: "bg-yellow-500 bg-opacity-10", 
    iconColor: "text-yellow-600",
    serviceType: "Drop & Dash"
  },
  {
    icon: Heart,
    title: "Postpartum",
    description: "New parent support",
    bgColor: "bg-purple-500 bg-opacity-10",
    iconColor: "text-purple-500", 
    serviceType: "Postpartum Support"
  },
  {
    icon: Heart,
    title: "Breastfeeding",
    description: "Lactation support",
    bgColor: "bg-pink-500 bg-opacity-10",
    iconColor: "text-pink-500", 
    serviceType: "Breastfeeding Support"
  },
  {
    icon: Shield,
    title: "Birth Education",
    description: "Preparation classes",
    bgColor: "bg-indigo-500 bg-opacity-10",
    iconColor: "text-indigo-500", 
    serviceType: "Birth Education"
  },
  {
    icon: Heart,
    title: "Elderly Care",
    description: "Senior assistance",
    bgColor: "bg-rose-500 bg-opacity-10",
    iconColor: "text-rose-500", 
    serviceType: "Elderly Care"
  },
  {
    icon: Users,
    title: "Companionship",
    description: "Social visits",
    bgColor: "bg-teal-500 bg-opacity-10",
    iconColor: "text-teal-500", 
    serviceType: "Elderly Companionship"
  }
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Verified Caregivers",
    description: "All caregivers undergo thorough background checks and reference verification for your peace of mind",
    bgColor: "bg-soft-green bg-opacity-10",
    iconColor: "text-soft-green"
  },
  {
    icon: IdCard,
    title: "Certified & Trained", 
    description: "First aid certified with ongoing training in child development and safety practices",
    bgColor: "bg-trust-blue bg-opacity-10",
    iconColor: "text-trust-blue"
  },
  {
    icon: MessageCircle,
    title: "Secure Communication",
    description: "Built-in messaging keeps all communication safe and protects your family's privacy",
    bgColor: "bg-coral bg-opacity-10",
    iconColor: "text-coral"
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Real reviews from verified families ensure you find the perfect caregiver for your needs",
    bgColor: "bg-amber-500 bg-opacity-10",
    iconColor: "text-amber-500"
  }
];

export default function Home() {
  const [, navigate] = useLocation();

  const { data: featuredNannies = [], isLoading } = useQuery({
    queryKey: ["/api/nannies/featured"],
  });

  const handleSearch = (filters: { location: string; serviceType: string; date: string; startTime: string; endTime: string }) => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.serviceType && filters.serviceType !== 'All Services') {
      params.set('serviceType', filters.serviceType);
    }
    if (filters.date) params.set('date', filters.date);
    if (filters.startTime) params.set('startTime', filters.startTime);
    if (filters.endTime) params.set('endTime', filters.endTime);
    
    navigate(`/search?${params.toString()}`);
  };

  const handleServiceClick = (serviceType: string) => {
    const params = new URLSearchParams();
    params.set('serviceType', serviceType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find care for what matters most
            </h1>
            <p className="text-xl text-gray-600">
              Discover trusted caregivers in Sydney - from childcare to elderly support
            </p>
          </div>
          
          <SearchFilters onSearch={handleSearch} />
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-warm-gray text-center mb-12">
            Browse by service type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer"
                  onClick={() => handleServiceClick(category.serviceType)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 ${category.bgColor} rounded-2xl flex items-center justify-center group-hover:bg-opacity-20 transition-colors`}>
                    <IconComponent className={`w-8 h-8 ${category.iconColor}`} />
                  </div>
                  <h3 className="font-medium text-warm-gray">{category.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Nannies */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray">Featured caregivers</h2>
            <Link href="/search">
              <Button variant="ghost" className="text-coral hover:text-coral">
                View all
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm animate-pulse overflow-hidden">
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="flex gap-1 mb-3">
                      <div className="h-5 w-12 bg-gray-200 rounded"></div>
                      <div className="h-5 w-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {featuredNannies.map((nanny: Nanny & { user: UserType }) => (
                <NannyCard key={nanny.id} nanny={nanny} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Safety and trust first</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every caregiver on CareConnect goes through our comprehensive verification process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 ${feature.bgColor} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-warm-gray mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">How it works</h2>
            <p className="text-xl text-gray-600">
              Book trusted childcare in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Search & Filter", description: "Find caregivers by location, service type, and availability" },
              { step: 2, title: "Review Profiles", description: "Check certificates, reviews, and experience details" },
              { step: 3, title: "Message & Book", description: "Connect securely and schedule your childcare" },
              { step: 4, title: "Relax & Enjoy", description: "Your children are in safe, trusted hands" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-6 bg-coral rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-warm-gray mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Provider Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">For Care Providers</h2>
            <p className="text-xl text-gray-600">Join our community and connect with families who need your expertise</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Sign Up */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-soft-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-soft-green" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sign Up as Provider</h3>
              <p className="text-gray-600 mb-6">Create your professional profile and get verified to start offering your services</p>
              <Link href="/become-nanny">
                <Button className="w-full bg-soft-green hover:bg-soft-green/90 text-white py-3 rounded-lg font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Offer Services */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-coral bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-coral" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Offer Your Services</h3>
              <p className="text-gray-600 mb-6">Set your availability, rates, and service areas to attract the right families</p>
              <Link href="/become-nanny">
                <Button className="w-full bg-coral hover:bg-coral/90 text-white py-3 rounded-lg font-semibold">
                  Start Offering
                </Button>
              </Link>
            </div>

            {/* Find Opportunities */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-trust-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-trust-blue" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Opportunities</h3>
              <p className="text-gray-600 mb-6">Browse families looking for care and apply to positions that match your skills</p>
              <Link href="/search">
                <Button className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white py-3 rounded-lg font-semibold">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-coral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect caregiver?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of Sydney families who trust CareConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button className="bg-white text-coral px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Searching
              </Button>
            </Link>
            <Link href="/become-nanny">
              <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-coral transition-colors">
                Become a Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
