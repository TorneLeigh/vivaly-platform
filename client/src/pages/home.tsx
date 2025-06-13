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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight mb-3">
            CREATED BY A MOM
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-coral font-medium mb-6 italic">
            Because it takes a village
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
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-3">
                🛡️
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Background Checks</h4>
              <p className="text-gray-600 text-sm">All caregivers undergo comprehensive background verification.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:-rotate-3">
                📄
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Certified Professionals</h4>
              <p className="text-gray-600 text-sm">Providers possess relevant certifications and training.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-2">
                🪪
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h4>
              <p className="text-gray-600 text-sm">Profile photos and IDs are verified for authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Categories */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book verified, reliable care for your whole household.
            </p>
          </div>

          {/* Five Service Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* PRE & POST NATAL */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={pregnancyImage} 
                  alt="Pre & Post Natal Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Baby className="mr-2" size={20} />
                    Pre & Post Natal
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Specialized support for new and expecting mothers, including doulas, lactation consultants, and postpartum recovery assistance.
                </p>
                <Link href="/prenatal-services">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* INFANT CARE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={pregnancyImage} 
                  alt="Infant Care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Baby className="mr-2" size={20} />
                    Infant Care
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Specialized care for babies 0-12 months with trained caregivers experienced in infant development and safety.
                </p>
                <Link href="/child-care-services">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* 1-ON-1 CARE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={groupCareImage} 
                  alt="1-on-1 Care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Users className="mr-2" size={20} />
                    1-on-1 Care
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Personalized one-on-one childcare with dedicated attention tailored to your child's specific needs and development.
                </p>
                <Link href="/child-care-services">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* DROP AND DASH */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={groupCareImage} 
                  alt="Drop and Dash"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Clock className="mr-2" size={20} />
                    Drop and Dash
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Quick drop-off childcare service for busy parents who need immediate, reliable care for short periods.
                </p>
                <Link href="/child-care-services">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Quick Book
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2-3 HOUR GROUP CARE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={groupCareImage} 
                  alt="2-3 Hour Group Care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Users className="mr-2" size={20} />
                    2-3 Hour Group Care
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Short-term group childcare sessions perfect for errands, appointments, or social interactions with other children.
                </p>
                <Link href="/child-care-services">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>



          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">The easy process</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Top-to-bottom support, included every time you book care on Vivaly.
            </p>
          </div>
          
          <div className="space-y-1 max-w-2xl mx-auto">
            {/* Find trusted carers */}
            <div className="border-b border-gray-200">
              <div className="flex items-start sm:items-center justify-between py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4 flex-1">Find trusted carers</h3>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pb-2 sm:pb-3 text-xs sm:text-sm text-gray-600">
                Browse verified caregivers in your area and read reviews from other families
              </div>
            </div>

            {/* Get quality care */}
            <div className="border-b border-gray-200">
              <div className="flex items-start sm:items-center justify-between py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4 flex-1">Get quality care</h3>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pb-2 sm:pb-3 text-xs sm:text-sm text-gray-600">
                All caregivers are background checked and certified for your peace of mind
              </div>
            </div>

            {/* Book with confidence */}
            <div className="border-b border-gray-200">
              <div className="flex items-start sm:items-center justify-between py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4 flex-1">Book with confidence</h3>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pb-2 sm:pb-3 text-xs sm:text-sm text-gray-600">
                Secure payments and insurance coverage protect every booking you make
              </div>
            </div>

            {/* Stay connected */}
            <div className="border-b border-gray-200">
              <div className="flex items-start sm:items-center justify-between py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4 flex-1">Stay connected</h3>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pb-2 sm:pb-3 text-xs sm:text-sm text-gray-600">
                Quickly message caregivers and get support
              </div>
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