import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
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
  PawPrint,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Nanny, User as UserType } from "@shared/schema";
import petSittingImage from "@assets/b3a7dde99de0043cc2a382fe7c16f0fc.jpg";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import pregnancyImage from "@assets/f116334957ff9c74101be0e0c41edcda_1749267005194.jpg";
import postnatalImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import overnightCareImage from "@assets/02a899c095b5a44d96492e700bf8fd0c_1749275818681.jpg";
import breastfeedingImage from "@assets/21c8892bc58e04dac4ddace75b5e5b5e_1749266984777.jpg";
import birthingImage from "@assets/f087158c54b76ecf0250c6866d218c92_1749267022177.jpg";
import groupCareImage from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618_1749267219539.jpg";
import doulaImage from "@assets/72a1a9c0773aeb45b624a5e05e355eb0_1749359311276.jpg";

// Caregiver images for the available today section
const caregiverImages = [
  pregnancyImage,
  postnatalImage,
  overnightCareImage,
  breastfeedingImage,
  birthingImage,
  groupCareImage,
  doulaImage
];

// Sydney location data for caregivers
const sydneyLocations = [
  "Bondi Beach", "Surry Hills", "Newtown", "Manly", "Paddington", 
  "Darlinghurst", "Balmain", "Leichhardt", "Rozelle", "Potts Point",
  "Double Bay", "Woollahra", "Randwick", "Coogee", "Marrickville"
];

// Service category colors
const serviceColors = [
  "bg-gradient-to-br from-blue-100 to-blue-200",
  "bg-gradient-to-br from-purple-100 to-purple-200",
  "bg-gradient-to-br from-pink-100 to-pink-200",
  "bg-gradient-to-br from-green-100 to-green-200",
  "bg-gradient-to-br from-yellow-100 to-yellow-200"
];

const serviceCategories = [
  {
    icon: Baby,
    title: "Pre & Post Natal",
    description: "Specialized support for new and expecting mothers, including doulas, lactation consultants, and postpartum recovery assistance.",
    category: "prenatal",
    color: serviceColors[0],
    iconColor: "text-blue-600",
    image: pregnancyImage
  },
  {
    icon: Baby,
    title: "Infant Care",
    description: "Specialized care for babies 0-12 months with trained caregivers experienced in infant development and safety.",
    category: "infant",
    color: serviceColors[1],
    iconColor: "text-purple-600",
    image: overnightCareImage
  },
  {
    icon: User,
    title: "1-on-1 Care",
    description: "Personalized one-on-one childcare with dedicated attention tailored to your child's specific needs and development.",
    category: "one-on-one",
    color: serviceColors[2],
    iconColor: "text-pink-600",
    image: groupCareImage
  },
  {
    icon: Clock,
    title: "Drop and Dash",
    description: "Quick drop-off childcare service for busy parents who need immediate, reliable care for short periods.",
    category: "drop-dash",
    color: serviceColors[3],
    iconColor: "text-green-600",
    image: doulaImage
  },
  {
    icon: Users,
    title: "2-3 Hour Group Care",
    description: "Short-term group childcare sessions perfect for errands, appointments, or social interactions with other children.",
    category: "group",
    color: serviceColors[4],
    iconColor: "text-yellow-600",
    image: breastfeedingImage
  }
];

export default function Home() {
  const { data: featuredNannies, isLoading } = useQuery<Nanny[]>({
    queryKey: ["/api/nannies/featured"],
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Airbnb Style */}
      <section className="bg-white pb-8 pt-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find your family's perfect childcare match in{" "}
              <span className="text-coral">Sydney</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              <span className="font-medium text-gray-900">Created by a Mom</span> for Australian families seeking trusted childcare, postnatal care and early childhood support
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto mb-12">
            <AirbnbSearch />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-2">
                🛡️
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Police Checked</h4>
              <p className="text-gray-600 text-sm">All caregivers undergo thorough background screening.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-2">
                ✅
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">WWCC Verified</h4>
              <p className="text-gray-600 text-sm">Working with Children Check verification completed.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 text-2xl transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-2">
                💬
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Reference Checked</h4>
              <p className="text-gray-600 text-sm">Previous employers and families provide detailed references.</p>
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

      {/* Main Service Categories - Horizontal Scroll */}
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

          {/* Horizontal Scroll Container */}
          <div className="relative mb-16">
            {/* Navigation Arrows */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {serviceCategories.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 w-80 h-96 flex flex-col">
                  <div className="relative h-56">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold flex items-center">
                        <service.icon className="mr-2" size={20} />
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {service.description}
                    </p>
                    <Link href="/child-care-services">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Caregivers Available Today */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Caregivers Available Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with verified caregivers ready to help your family right now
            </p>
          </div>

          {/* Featured Caregivers Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-32 bg-gray-200 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && Array.isArray(featuredNannies) ? (
              featuredNannies.map((nanny: any, index: number) => (
                <div key={nanny.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-32">
                    <img 
                      src={caregiverImages[index % caregiverImages.length]} 
                      alt="Caregiver Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        Sarah M.
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700 ml-1">
                          {nanny.rating || "4.9"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        📍 {sydneyLocations[index % sydneyLocations.length]}
                      </span>
                      <span className="text-sm font-bold text-black">
                        ${nanny.hourlyRate || "38"}/hr
                      </span>
                    </div>
                    <Link href={`/nanny/${nanny.id}`}>
                      <Button className="w-full bg-coral hover:bg-coral/90 text-white text-xs py-2">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No caregivers available at the moment</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for new caregivers</p>
              </div>
            )}
          </div>

          {/* See All Caregivers Button */}
          <div className="text-center">
            <Link href="/find-care">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
                See All Available Caregivers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Search & Book</h3>
              <p className="text-gray-600 text-sm sm:text-base">Find the perfect caregiver for your needs and book instantly.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Meet Your Caregiver</h3>
              <p className="text-gray-600 text-sm sm:text-base">Connect before your booking to ensure a perfect match.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Enjoy Peace of Mind</h3>
              <p className="text-gray-600 text-sm sm:text-base">Relax knowing your family is in trusted, qualified hands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-coral">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect caregiver?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Australian families who trust Vivaly for their childcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-white text-coral hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Find Childcare
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold">
                Become a Caregiver
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}