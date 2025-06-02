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
                
                {/* Family figures with animations and connection lines */}
                <div className="absolute top-1/3 left-1/4 animate-bounce">
                  {/* Parent figure */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-pink-300 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-10 bg-blue-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 left-1/3 animate-bounce" style={{animationDelay: '0.5s'}}>
                  {/* Child figure */}
                  <div className="relative">
                    <div className="w-6 h-6 bg-yellow-300 rounded-full border border-white shadow-sm"></div>
                    <div className="w-4 h-8 bg-pink-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="absolute top-2/3 left-1/2 animate-bounce" style={{animationDelay: '0.3s'}}>
                  {/* Baby figure */}
                  <div className="relative">
                    <div className="w-4 h-4 bg-orange-300 rounded-full border border-white shadow-sm"></div>
                    <div className="w-3 h-6 bg-orange-200 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/4 animate-bounce" style={{animationDelay: '1s'}}>
                  {/* Caregiver figure */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-300 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-10 bg-green-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="absolute top-1/2 right-1/5 animate-bounce" style={{animationDelay: '1.5s'}}>
                  {/* Additional caregiver */}
                  <div className="relative">
                    <div className="w-7 h-7 bg-purple-300 rounded-full border border-white shadow-sm"></div>
                    <div className="w-5 h-9 bg-purple-400 rounded-lg mx-auto mt-1 shadow-sm"></div>
                  </div>
                </div>
                
                {/* Animated connection lines between all figures */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
                  {/* Parent to child */}
                  <line
                    x1="100"
                    y1="130"
                    x2="130"
                    y2="200"
                    stroke="#FF6B6B"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="1s" repeatCount="indefinite"/>
                  </line>
                  {/* Child to baby */}
                  <line
                    x1="130"
                    y1="200"
                    x2="200"
                    y2="270"
                    stroke="#FF6B6B"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="1.2s" repeatCount="indefinite"/>
                  </line>
                  {/* Parent to caregiver */}
                  <line
                    x1="100"
                    y1="130"
                    x2="300"
                    y2="130"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="0.8s" repeatCount="indefinite"/>
                  </line>
                  {/* Caregiver to second caregiver */}
                  <line
                    x1="300"
                    y1="130"
                    x2="320"
                    y2="200"
                    stroke="#9C27B0"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="1.5s" repeatCount="indefinite"/>
                  </line>
                  {/* Baby to caregivers */}
                  <line
                    x1="200"
                    y1="270"
                    x2="320"
                    y2="200"
                    stroke="#FF9800"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="1.8s" repeatCount="indefinite"/>
                  </line>
                </svg>
                
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
                    Certified
                  </div>
                </div>
                
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

      {/* Service Categories with Animated Illustrations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by service type
            </h2>
            <p className="text-xl text-gray-600">
              Whatever you need, we have trusted caregivers ready to help
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => handleServiceClick(category.serviceType)}
                >
                  {/* Uniform Card Container */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300 h-48">
                    {/* Illustration Area */}
                    <div className="h-32 relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-t-xl">
                      {/* Service specific illustrations - Airbnb style */}
                      {category.title === "1-on-1 Care" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">👩‍👧</div>
                        </div>
                      )}
                      
                      {category.title === "Group Care" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">👨‍👩‍👧‍👦</div>
                        </div>
                      )}
                      
                      {category.title === "Midwife Services" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">🤰</div>
                        </div>
                      )}
                      
                      {category.title === "Drop & Dash" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">🚗</div>
                        </div>
                      )}
                      
                      {category.title === "Postpartum" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">🤱</div>
                        </div>
                      )}
                      
                      {category.title === "Breastfeeding" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">🍼</div>
                        </div>
                      )}
                      
                      {category.title === "Birth Education" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">📚</div>
                        </div>
                      )}
                      
                      {category.title === "Elderly Care" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">👴</div>
                        </div>
                      )}
                      
                      {category.title === "Companionship" && (
                        <div className="flex items-center justify-center">
                          <div className="text-6xl">☕</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-coral transition-colors text-sm">
                        {category.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          

        </div>
      </section>

      {/* Available Today Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Available Today</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find caregivers ready to help in your area right now
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl animate-pulse overflow-hidden">
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && featuredNannies.length > 0 ? (
              featuredNannies.slice(0, 8).map((nanny: Nanny & { user: UserType }) => (
                <div key={nanny.id} className="bg-white rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-coral to-pink-400 flex items-center justify-center rounded-t-xl">
                      <span className="text-3xl text-white font-bold">{nanny.user.firstName[0]}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Available
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{nanny.user.firstName}</h3>
                    <p className="text-xs text-gray-600 mb-2">{nanny.suburb}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{nanny.hourlyRate}/hr</span>
                      <div className="flex items-center text-xs text-yellow-600">
                        <span>⭐</span>
                        <span className="ml-1">{nanny.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No caregivers available today.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services in Popular Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Services in Popular Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover local caregivers offering services and events in your neighborhood
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl animate-pulse overflow-hidden">
                  <div className="w-full h-32 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && featuredNannies.length > 0 ? (
              [
                {
                  area: "Bondi Beach",
                  emoji: "🏖️",
                  service: "Beach Playgroup",
                  description: "Weekly beach activities for toddlers",
                  time: "Tuesdays 10am",
                  caregiver: featuredNannies[0]?.user?.firstName || "Sarah",
                  price: "$35/session"
                },
                {
                  area: "Manly",
                  emoji: "🌊",
                  service: "Swimming Lessons",
                  description: "Learn to swim in safe environment",
                  time: "Saturdays 9am",
                  caregiver: featuredNannies[1]?.user?.firstName || "Emma",
                  price: "$45/lesson"
                },
                {
                  area: "Paddington",
                  emoji: "🎨",
                  service: "Art & Craft Group",
                  description: "Creative sessions for kids 3-8 years",
                  time: "Thursdays 2pm",
                  caregiver: featuredNannies[2]?.user?.firstName || "Lucy",
                  price: "$40/session"
                },
                {
                  area: "Newtown",
                  emoji: "🎵",
                  service: "Music Circle",
                  description: "Interactive music for young children",
                  time: "Fridays 11am",
                  caregiver: featuredNannies[3]?.user?.firstName || "Mia",
                  price: "$30/session"
                },
                {
                  area: "Surry Hills",
                  emoji: "📚",
                  service: "Story Time",
                  description: "Reading sessions and literacy play",
                  time: "Wednesdays 10:30am",
                  caregiver: featuredNannies[4]?.user?.firstName || "Zoe",
                  price: "$25/session"
                },
                {
                  area: "Double Bay",
                  emoji: "🧘",
                  service: "Baby Yoga",
                  description: "Gentle yoga for mums and babies",
                  time: "Mondays 9:30am",
                  caregiver: featuredNannies[5]?.user?.firstName || "Anna",
                  price: "$50/session"
                }
              ].map((service, index) => (
                <div key={service.area} className="bg-white rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-t-xl">
                      <span className="text-4xl">{service.emoji}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Available
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{service.service}</h3>
                    <p className="text-xs text-gray-600 mb-1">{service.area}</p>
                    <p className="text-xs text-gray-600 mb-2">{service.time}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{service.price}</span>
                      <span className="text-xs text-gray-600">⭐ 4.9</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No services available at the moment.</p>
              </div>
            )}
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
              <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-coral transition-all bg-transparent">
                Become a Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
