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
  Baby,
  Dog,
  PawPrint
} from "lucide-react";
import type { Nanny, User as UserType } from "@shared/schema";

// Service category colors
const serviceColors = [
  "bg-gradient-to-br from-blue-100 to-blue-200",
  "bg-gradient-to-br from-green-100 to-green-200", 
  "bg-gradient-to-br from-purple-100 to-purple-200",
  "bg-gradient-to-br from-orange-100 to-orange-200",
  "bg-gradient-to-br from-pink-100 to-pink-200",
  "bg-gradient-to-br from-indigo-100 to-indigo-200",
  "bg-gradient-to-br from-teal-100 to-teal-200",
  "bg-gradient-to-br from-red-100 to-red-200"
];

// Activity colors
const activityColors = [
  "bg-gradient-to-br from-emerald-100 to-emerald-200",
  "bg-gradient-to-br from-cyan-100 to-cyan-200",
  "bg-gradient-to-br from-yellow-100 to-yellow-200",
  "bg-gradient-to-br from-rose-100 to-rose-200",
  "bg-gradient-to-br from-violet-100 to-violet-200",
  "bg-gradient-to-br from-amber-100 to-amber-200"
];

const serviceCategories = [
  {
    title: "Newborn Care",
    description: "Specialized care for newborns",
    image: "/images/newborn.jpg",
    serviceType: "Newborn Care"
  },
  {
    title: "Childcare", 
    description: "Daily care for children",
    image: "/images/childcare.jpg",
    serviceType: "Childcare"
  },
  {
    title: "Daycare",
    description: "Group daycare services", 
    image: "/images/daycare.jpg",
    serviceType: "Daycare"
  },
  {
    title: "Nanny Services",
    description: "Professional nanny care",
    image: "/images/nanny.jpg",
    serviceType: "Nanny"
  },
  {
    title: "Au Pair",
    description: "Live-in cultural exchange care",
    image: "/images/aupair.jpg",
    serviceType: "Au Pair"
  },
  {
    title: "Babysitting",
    description: "Occasional childcare",
    image: "/images/babysitter.jpg",
    serviceType: "Babysitting"
  },
  {
    title: "Midwife Services",
    description: "Pregnancy and birth support",
    image: "/images/midwife.jpg",
    serviceType: "Midwife Services"
  },
  {
    title: "Elderly Care",
    description: "Senior care services",
    image: "/images/elderly.jpg",
    serviceType: "Elderly Care"
  },
  {
    title: "Companionship",
    description: "Social companionship care",
    image: "/images/companionship.jpg",
    serviceType: "Companionship"
  },
  {
    title: "Pet Care",
    description: "Professional pet services",
    image: "/images/petcare.jpg",
    serviceType: "Pet Care"
  }
];

const popularActivities = [
  {
    title: "Park Playdates",
    description: "Meet other families at local parks",
    icon: TreePine,
    color: activityColors[0],
    serviceType: "Park Playdates"
  },
  {
    title: "Coffee Catch-ups",
    description: "Parent meetups at local cafes", 
    icon: Coffee,
    color: activityColors[1],
    serviceType: "Coffee Catch-ups"
  },
  {
    title: "Art & Craft",
    description: "Creative sessions for kids and parents",
    icon: Palette,
    color: activityColors[2],
    serviceType: "Art & Craft"
  },
  {
    title: "New Parent Groups",
    description: "Support groups for new mothers",
    icon: Users,
    color: activityColors[3],
    serviceType: "New Parent Groups"
  },
  {
    title: "Nature Exploration",
    description: "Outdoor discovery with children",
    icon: Sun,
    color: activityColors[4],
    serviceType: "Nature Exploration"
  },
  {
    title: "Elderly Care Social",
    description: "Companionship and care activities",
    icon: Heart,
    color: activityColors[5],
    serviceType: "Elderly Care Social"
  }
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Background Checks",
    description: "Every caregiver undergoes thorough background verification",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-700"
  },
  {
    icon: ShieldCheck,
    title: "Certified",
    description: "All providers are certified professionals",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-700"
  },
  {
    icon: IdCard,
    title: "Identity Verified",
    description: "Profile photos and IDs are verified",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-700"
  }
];

export default function Home() {
  const { data: featuredNannies, isLoading } = useQuery({
    queryKey: ["/api/nannies/featured"],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Airbnb Style */}
      <section className="bg-white relative min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
            Book trusted care in minutes
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Instant booking • Verified caregivers • Available today
          </p>
          
          {/* Large Search Bar - Airbnb Style */}
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 max-w-3xl mx-auto mb-8">
            <SearchFilters onSearch={(filters) => {
              const searchParams = new URLSearchParams(filters);
              window.location.href = `/search?${searchParams.toString()}`;
            }} />
          </div>

          {/* Quick Booking Options */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/quick-start?when=tonight">
              <Button className="text-black animate-bounce-slow hover:opacity-90" style={{ backgroundColor: '#FFB366' }}>
                Book Tonight
              </Button>
            </Link>
            <Link href="/quick-start?when=weekend">
              <Button className="text-black animate-bounce-slow hover:opacity-90" style={{ backgroundColor: '#FFB366' }}>
                This Weekend
              </Button>
            </Link>
            <Link href="/quick-start?when=next-week">
              <Button className="text-black animate-bounce-slow hover:opacity-90" style={{ backgroundColor: '#FFB366' }}>
                Next Week
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-gray-900">500+</div>
              <div>Caregivers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">10,000+</div>
              <div>Families served</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">4.9</div>
              <div>Average rating</div>
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
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Failed to load image:', category.image);
                        console.error('Image path attempted:', e.currentTarget.src);
                        // Fallback to a light background if image fails
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                          e.currentTarget.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <span class="text-gray-400 text-xs">${category.title}</span>
                            </div>
                          `;
                        }
                      }}
                      onLoad={(e) => {
                        console.log('Successfully loaded image:', category.image);
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.title}</h3>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pet Care Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <PawPrint className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900">Pet Care Services</h2>
              <Dog className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your furry family members deserve the best care too. Find trusted pet sitters, dog walkers, and animal care specialists.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Pet Sitting'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet1.jpg" 
                  alt="Pet Sitting"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Pet Sitting</h3>
              <p className="text-xs text-gray-600">In-home pet care</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Dog Walking'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet2.jpg" 
                  alt="Dog Walking"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Dog Walking</h3>
              <p className="text-xs text-gray-600">Daily exercise</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Pet Boarding'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet3.jpg" 
                  alt="Pet Boarding"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Pet Boarding</h3>
              <p className="text-xs text-gray-600">Overnight care</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Pet Grooming'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet4.jpg" 
                  alt="Pet Grooming"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Pet Grooming</h3>
              <p className="text-xs text-gray-600">Professional styling</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Pet Training'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet5.jpg" 
                  alt="Pet Training"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Pet Training</h3>
              <p className="text-xs text-gray-600">Behavioral guidance</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Overnight Pet Care'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/pet6.jpg" 
                  alt="Overnight Care"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Overnight Care</h3>
              <p className="text-xs text-gray-600">Extended sitting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services in Popular Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Events and Social</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with other families through organized activities and social gatherings
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Park Playdates&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social1.jpg" 
                  alt="Park Playdates"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Park Playdates</h3>
              <p className="text-xs text-gray-600">Meet other families at local parks</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Coffee Catch-ups&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social2.jpg" 
                  alt="Coffee Catch-ups"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Coffee Catch-ups</h3>
              <p className="text-xs text-gray-600">Parent meetups at local cafes</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Art & Craft&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social3.jpg" 
                  alt="Art & Craft"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Art & Craft</h3>
              <p className="text-xs text-gray-600">Creative sessions for kids and parents</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=New Parent Groups&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social4.jpg" 
                  alt="New Parent Groups"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">New Parent Groups</h3>
              <p className="text-xs text-gray-600">Support groups for new mothers</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Nature Exploration&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social5.jpg" 
                  alt="Nature Exploration"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Nature Exploration</h3>
              <p className="text-xs text-gray-600">Outdoor discovery with children</p>
            </div>
            
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                 onClick={() => window.location.href = '/search?serviceType=Elderly Care Social&location=Sydney, NSW'}>
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                <img 
                  src="/images/social6.jpg" 
                  alt="Elderly Care Social"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Elderly Care Social</h3>
              <p className="text-xs text-gray-600">Companionship and care activities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Nannies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray">Featured caregivers</h2>
            <Link href="/search">
              <Button variant="ghost" className="text-coral hover:text-coral">
                View all
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 ${feature.bgColor} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-warm-gray mb-2 sm:mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </div>
  );
}