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
  Search,
  Sun,
  Coffee,
  TreePine,
  Palette,
  Music,
  BookOpen,
  Utensils,
  Baby
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

const popularActivities = [
  {
    icon: Users,
    title: "Park Playdates",
    description: "Meet other families at local parks",
    bgColor: "bg-green-50",
    iconColor: "text-green-400",
    serviceType: "Park Playdates"
  },
  {
    icon: Sun,
    title: "Beach Days", 
    description: "Family beach outings and activities",
    bgColor: "bg-trust-blue bg-opacity-10",
    iconColor: "text-trust-blue",
    serviceType: "Beach Days"
  },
  {
    icon: Coffee,
    title: "Coffee Catch-ups",
    description: "Parent meetups at local cafes", 
    bgColor: "bg-amber-500 bg-opacity-10",
    iconColor: "text-amber-600",
    serviceType: "Coffee Catch-ups"
  },
  {
    icon: TreePine,
    title: "Nature Walks",
    description: "Explore trails with other families",
    bgColor: "bg-green-100", 
    iconColor: "text-green-500",
    serviceType: "Nature Walks"
  },
  {
    icon: Palette,
    title: "Art & Craft",
    description: "Creative sessions for kids and parents",
    bgColor: "bg-purple-500 bg-opacity-10",
    iconColor: "text-purple-500", 
    serviceType: "Art & Craft"
  },
  {
    icon: Utensils,
    title: "Picnic Gatherings",
    description: "Family picnics and shared meals",
    bgColor: "bg-orange-500 bg-opacity-10",
    iconColor: "text-orange-500", 
    serviceType: "Picnic Gatherings"
  }
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Background Checks",
    description: "Every caregiver undergoes thorough background verification",
    bgColor: "bg-soft-green bg-opacity-10",
    iconColor: "text-soft-green"
  },
  {
    icon: ShieldCheck,
    title: "Certified",
    description: "All providers are certified professionals",
    bgColor: "bg-trust-blue bg-opacity-10",
    iconColor: "text-trust-blue"
  },
  {
    icon: IdCard,
    title: "Identity Verified",
    description: "Profile photos and IDs are verified",
    bgColor: "bg-coral bg-opacity-10",
    iconColor: "text-coral"
  }
];

export default function Home() {
  const { data: featuredNannies, isLoading } = useQuery({
    queryKey: ["/api/nannies/featured"],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Find care you can trust
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Book trusted caregivers in your neighborhood. Available for one-time or ongoing care.
              </p>
              
              <div className="space-y-4 mb-8">
                <SearchFilters onSearch={(filters) => {
                  const searchParams = new URLSearchParams(filters);
                  window.location.href = `/search?${searchParams.toString()}`;
                }} />
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">👩‍⚕️</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Professional Care</h3>
                    <p className="text-xs text-gray-600">Qualified caregivers</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🏠</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">In Your Home</h3>
                    <p className="text-xs text-gray-600">Comfort & convenience</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Verified Safe</h3>
                    <p className="text-xs text-gray-600">Background checked</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Highly Rated</h3>
                    <p className="text-xs text-gray-600">Trusted by families</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
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
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: category.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className={`${category.bgColor} rounded-2xl p-6 text-center h-32 flex flex-col justify-center items-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <IconComponent className={`w-8 h-8 ${category.iconColor} mb-2 relative z-10`} />
                    <h3 className="font-semibold text-gray-900 text-sm relative z-10">{category.title}</h3>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 text-center">{category.description}</p>
                  </div>
                </div>
              );
            })}
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
            {popularActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: activity.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className={`${activity.bgColor} rounded-2xl p-4 text-center h-32 flex flex-col justify-center items-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <IconComponent className={`w-8 h-8 ${activity.iconColor} mb-2 relative z-10`} />
                    <h3 className="font-semibold text-gray-900 text-sm relative z-10">{activity.title}</h3>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 text-center">{activity.description}</p>
                  </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && Array.isArray(featuredNannies) && featuredNannies.length > 0 ? (
              featuredNannies.slice(0, 8).map((nanny: Nanny & { user: UserType }) => (
                <NannyCard key={nanny.id} nanny={nanny} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No caregivers available today.</p>
              </div>
            )}
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