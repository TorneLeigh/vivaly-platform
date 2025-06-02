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
    icon: Heart,
    title: "Midwife Services",
    description: "Birth & postnatal support", 
    bgColor: "bg-coral bg-opacity-10",
    iconColor: "text-coral",
    serviceType: "Midwife Services"
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
      {/* Hero Section with Airbnb-style Layout */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find care for what matters most
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover trusted caregivers in Sydney - from childcare to elderly support
              </p>
              
              <SearchFilters onSearch={handleSearch} />
              
              {/* Trust indicators */}
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-pink-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-green-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-yellow-300 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">2,000+ happy families</p>
                  <p className="text-xs text-gray-500">Verified caregivers</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Airbnb-style illustration */}
            <div className="relative">
              <div className="relative w-full h-[500px] bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 rounded-3xl overflow-hidden shadow-2xl">
                {/* Main house */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* House body */}
                    <div className="w-32 h-24 bg-coral rounded-t-lg shadow-lg"></div>
                    {/* Roof */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-40 h-12 bg-gray-600 rounded-t-full shadow-md"></div>
                    </div>
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-amber-700 rounded-t-md"></div>
                    {/* Windows */}
                    <div className="absolute top-3 left-3 w-6 h-6 bg-yellow-200 rounded border-2 border-white"></div>
                    <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-200 rounded border-2 border-white"></div>
                  </div>
                </div>
                
                {/* Family figures with animations */}
                <div className="absolute top-1/3 left-1/4 animate-float">
                  {/* Parent figure */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-pink-300 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-10 bg-blue-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="absolute top-2/5 left-1/3 animate-bounce" style={{animationDelay: '0.5s'}}>
                  {/* Child figure */}
                  <div className="relative">
                    <div className="w-6 h-6 bg-yellow-300 rounded-full border border-white shadow-sm"></div>
                    <div className="w-4 h-8 bg-pink-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/4 animate-float" style={{animationDelay: '1s'}}>
                  {/* Caregiver figure */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-300 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-10 bg-green-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                    {/* Heart connection */}
                    <div className="absolute -top-2 -left-3 text-red-400 text-lg animate-pulse">♥</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-200 rounded-full opacity-60 animate-float"></div>
                <div className="absolute top-16 left-8 w-8 h-8 bg-green-200 rounded-full opacity-50 animate-float" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-32 right-16 w-6 h-6 bg-purple-200 rounded-full opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
                
                {/* Trust badges */}
                <div className="absolute top-6 left-6 bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Verified
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Insured
                  </div>
                </div>
                
                {/* Connection line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <path
                    d="M 100 120 Q 200 80 300 120"
                    stroke="#FF6B6B"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="6,6"
                    opacity="0.7"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Bottom stats */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white rounded-full px-6 py-2 shadow-lg">
                    <p className="text-sm font-semibold text-gray-800">Connecting families with trusted care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-coral transition-all">
                Become a Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
