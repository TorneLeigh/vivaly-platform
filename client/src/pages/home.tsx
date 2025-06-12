import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import NannyCard from "@/components/nanny-card";
import AirbnbSearch from "@/components/airbnb-search-new";
import FloatingActionButton from "@/components/floating-action-button";
import ServiceCarousel from "@/components/service-carousel";
import AIRecommendations from "@/components/ai-recommendations";
import { RoleToggle } from "@/components/role-toggle";
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
import petSittingImage from "@assets/b3a7dde99de0043cc2a382fe7c16f0fc.jpg";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import pregnancyImage from "@assets/f116334957ff9c74101be0e0c41edcda_1749267005194.jpg";
import postnatalImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import overnightCareImage from "@assets/02a899c095b5a44d96492e700bf8fd0c_1749275818681.jpg";
import breastfeedingImage from "@assets/31d064b6874d9bd38e6f664bff0e8352_1749267180596.jpg";
import birthingImage from "@assets/f087158c54b76ecf0250c6866d218c92_1749267022177.jpg";
import groupCareImage from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618_1749267219539.jpg";
import doulaImage from "@assets/72a1a9c0773aeb45b624a5e05e355eb0_1749359311276.jpg";

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
    title: "1-on-1 care", 
    description: "Personalized one-on-one care",
    image: "/images/childcare.jpg",
    serviceType: "1-on-1 care"
  },
  {
    title: "1-2 hours group care",
    description: "Short-term group childcare sessions", 
    image: groupCareImage,
    serviceType: "1-2 hours group care"
  },
  {
    title: "Childcare",
    description: "Licensed home-based care (max 7 children)",
    image: "/images/daycare.jpg",
    serviceType: "Childcare"
  },
  {
    title: "Drop and dash",
    description: "Quick drop-off childcare",
    image: "/images/babysitter.jpg",
    serviceType: "Drop and dash"
  },
  {
    title: "Breastfeeding support",
    description: "Expert breastfeeding guidance",
    image: breastfeedingImage,
    serviceType: "Breastfeeding support"
  },
  {
    title: "Birth education",
    description: "Childbirth preparation classes",
    image: doulaImage,
    serviceType: "Birth education"
  },
  {
    title: "Newborn support",
    description: "Sleep guidance, swaddling & feeding techniques",
    image: "/images/newborn.jpg",
    serviceType: "Newborn support"
  },
  {
    title: "Overnight newborn support",
    description: "Night doulas for the fourth trimester",
    image: overnightCareImage,
    serviceType: "Overnight newborn support"
  },
  {
    title: "Drop-in care",
    description: "Flexible care when you need it - gym, appointments, errands",
    image: "/images/dropin.jpg", 
    serviceType: "Drop-in care"
  },
  {
    title: "Pregnancy assistance",
    description: "Support during pregnancy",
    image: pregnancyImage,
    serviceType: "Pregnancy assistance"
  },
  {
    title: "Postnatal care",
    description: "Care after childbirth",
    image: postnatalImage,
    serviceType: "Postnatal care"
  },
  {
    title: "Doula services",
    description: "Birth and emotional support",
    image: pregnancyImage,
    serviceType: "Doula services"
  },
  {
    title: "Pet sitting",
    description: "Professional pet care",
    image: petSittingServiceImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Elderly care",
    description: "Senior care services",
    image: "/images/elderly.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Elderly companionship",
    description: "Social companionship for seniors",
    image: "/images/companionship.jpg",
    serviceType: "Elderly companionship"
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
    description: "All caregivers complete background verification",
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
    title: "Certified Helpers",
    description: "IDs are verified for authenticity",
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
      <section className="bg-white relative min-h-[45vh] flex items-center pt-8 md:pt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-2">
            All Your Care, Covered
          </h1>
          <p className="text-lg sm:text-xl text-coral font-medium mb-6 italic">
            Book trusted care in minutes
          </p>
          
          {/* Airbnb-style Search Bar - Fixed positioning to prevent movement */}
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto mb-12 px-4">
              <AirbnbSearch 
                onSearch={(filters) => {
                  const params = new URLSearchParams();
                  if (filters.location) params.set("location", filters.location);
                  if (filters.date) params.set("date", filters.date);
                  if (filters.careFor) params.set("careFor", filters.careFor);
                  if (filters.serviceType) params.set("serviceType", filters.serviceType);
                  
                  const searchUrl = `/find-care${params.toString() ? `?${params.toString()}` : ""}`;
                  window.location.href = searchUrl;
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 text-2xl">
                🛡️
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Background Checks</h4>
              <p className="text-gray-600 text-sm">All caregivers undergo comprehensive background verification.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 text-2xl">
                📄
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Certified Professionals</h4>
              <p className="text-gray-600 text-sm">Providers possess relevant certifications and training.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 text-2xl">
                🪪
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h4>
              <p className="text-gray-600 text-sm">Profile photos and IDs are verified for authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Categories */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book verified, reliable care for your whole household.
            </p>
          </div>

          {/* Four Main Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* CHILDCARE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src="/images/childcare.jpg" 
                  alt="Childcare Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <Baby className="mr-2" size={24} />
                    Childcare
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Trusted nannies and babysitters for your little ones.
                </p>
                <Link href="/child-care-services">
                  <Button className="w-full bg-coral hover:bg-coral/90 text-white">
                    Find Childcare
                  </Button>
                </Link>
              </div>
            </div>

            {/* PETS */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src={petSittingServiceImage} 
                  alt="Pet Care Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <PawPrint className="mr-2" size={24} />
                    Pet Care
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Reliable pet sitters and dog walkers.
                </p>
                <Link href="/pet-care-services">
                  <Button className="w-full bg-coral hover:bg-coral/90 text-white">
                    Find Pet Care
                  </Button>
                </Link>
              </div>
            </div>

            {/* ELDERLY CARE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src="/images/elderly.jpg" 
                  alt="Elderly Care Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <Heart className="mr-2" size={24} />
                    Aged Care
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Compassionate care for your elderly loved ones.
                </p>
                <Link href="/aged-care-services">
                  <Button className="w-full bg-coral hover:bg-coral/90 text-white">
                    Find Aged Care
                  </Button>
                </Link>
              </div>
            </div>

            {/* PRE & POSTNATAL SUPPORT */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src={pregnancyImage} 
                  alt="Pre & Postnatal Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <Baby className="mr-2" size={24} />
                    Pre & Postnatal
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Professional doulas and parenting classes to support new and expecting parents.
                </p>
                <Link href="/prenatal-services">
                  <Button className="w-full bg-coral hover:bg-coral/90 text-white">
                    Explore Support
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find quality care</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group relative transform hover:-translate-y-2 transition-all duration-300 hover:scale-105 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-coral/10 rounded-full flex items-center justify-center group-hover:bg-coral/20 transition-colors duration-300 text-2xl">
                🧭
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Carers</h3>
              <p className="text-gray-600 text-sm">Enter your location and care category to view available carers. Instant booking and available today.</p>
            </div>
            
            <div className="text-center group relative transform hover:-translate-y-2 transition-all duration-300 hover:scale-105 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-coral/10 rounded-full flex items-center justify-center group-hover:bg-coral/20 transition-colors duration-300 text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Profiles</h3>
              <p className="text-gray-600 text-sm">Review qualifications, experience, and user reviews.</p>
            </div>
            
            <div className="text-center group relative transform hover:-translate-y-2 transition-all duration-300 hover:scale-105 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-coral/10 rounded-full flex items-center justify-center group-hover:bg-coral/20 transition-colors duration-300 text-2xl">
                🔒
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Securely</h3>
              <p className="text-gray-600 text-sm">Utilize the platform's secure payment system.</p>
            </div>
            
            <div className="text-center group relative transform hover:-translate-y-2 transition-all duration-300 hover:scale-105 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-coral/10 rounded-full flex items-center justify-center group-hover:bg-coral/20 transition-colors duration-300 text-2xl">
                💬
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Post-Care Review</h3>
              <p className="text-gray-600 text-sm">Leave feedback and rebook as needed.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Floating Action Button - Hidden on mobile */}
      <div className="hidden lg:block">
        <FloatingActionButton />
      </div>
    </div>
  );
}