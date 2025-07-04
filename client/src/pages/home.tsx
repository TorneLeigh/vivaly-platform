import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import NannyCard from "@/components/nanny-card";
import AirbnbSearch from "@/components/airbnb-search-new";
import FloatingActionButton from "@/components/floating-action-button";
import ServiceCarousel from "@/components/service-carousel";
import AIRecommendations from "@/components/ai-recommendations";
import PWAInstallButton from "@/components/PWAInstallButton";

import { FeeWaiverBanner } from "@/components/FeeWaiverBanner";

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

interface SearchFilters {
  location: string;
  date: string;
  careFor: string;
  serviceType: string;
}
import petSittingImage from "@assets/b3a7dde99de0043cc2a382fe7c16f0fc.jpg";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import nannySharingImage from "@assets/988a042ea7f506d78efe22b6305455a5_1750892014035.jpg";
import pregnancyImage from "@assets/f116334957ff9c74101be0e0c41edcda_1749267005194.jpg";
import postnatalImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import overnightCareImage from "@assets/02a899c095b5a44d96492e700bf8fd0c_1749275818681.jpg";
import breastfeedingImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import birthingImage from "@assets/f087158c54b76ecf0250c6866d218c92_1749267022177.jpg";
import groupCareImage from "@assets/62ef39ef76f7405a227796a6b8ad607d_1750199252634.jpg";
import oneOnOneCareImage from "@assets/b311470ecb8ff04ca3b4a03ea5ad8f71_1750199604239.jpg";
import dropAndDashImage from "@assets/da9a8502c75f58f7f36a01b9e533d46d_1750199648538.jpg";

// Individual women's portrait photos - individual faces only
import caregiverPortrait1 from "@assets/2df543a46e343b349dce96a9b74e7bf3.jpg";
import caregiverPortrait2 from "@assets/854be3a55da7cc24c19d02cd9ed2eb70.jpg";
import caregiverPortrait3 from "@assets/de1126eedd477730852d8c5558d5228f.jpg";

// Individual women's professional portrait SVGs as fallback
const createCaregiverPortrait = (name: string, hairColor: string, skinTone: string) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="faceGrad" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%" style="stop-color:${skinTone};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d4a574;stop-opacity:1" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="#f0f8ff"/>
      <circle cx="60" cy="45" r="22" fill="url(#faceGrad)"/>
      <path d="M38 38 Q60 28 82 38 Q82 26 60 22 Q38 26 38 38" fill="${hairColor}"/>
      <circle cx="53" cy="42" r="2" fill="#2c3e50"/>
      <circle cx="67" cy="42" r="2" fill="#2c3e50"/>
      <ellipse cx="60" cy="48" rx="1" ry="2" fill="#8b4513"/>
      <path d="M55 52 Q60 55 65 52" stroke="#8b4513" stroke-width="1.5" fill="none"/>
      <rect x="40" y="65" width="40" height="45" fill="#3498db" rx="4"/>
      <text x="60" y="95" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" font-weight="bold">${name}</text>
    </svg>
  `)}`
};

// Professional caregiver portraits for the available today section
const caregiverImages = [
  createCaregiverPortrait("Sarah", "#8B4513", "#FDBCB4"),
  createCaregiverPortrait("Emma", "#DAA520", "#F5DEB3"),
  createCaregiverPortrait("Lisa", "#A0522D", "#DEB887"),
  createCaregiverPortrait("Anna", "#2F4F4F", "#8D5524"),
  createCaregiverPortrait("Kate", "#CD853F", "#FDBCB4"),
  createCaregiverPortrait("Mia", "#8B008B", "#F5DEB3"),
  createCaregiverPortrait("Zoe", "#8B4513", "#DEB887")
];

// Sydney location data for caregivers
const sydneyLocations = [
  "Bondi Beach", "Surry Hills", "Newtown", "Manly", "Paddington", 
  "Darlinghurst", "Balmain", "Leichhardt", "Rozelle", "Potts Point",
  "Double Bay", "Woollahra", "Randwick", "Coogee", "Marrickville"
];

export default function Home() {
  const { data: featuredNannies, isLoading } = useQuery<Nanny[]>({
    queryKey: ["/api/nannies/featured"],
  });

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
  });

  const handleReferralClick = () => {
    // Navigate to referral program page or show modal
    console.log("Referral program clicked");
  };

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
      {/* Referral Banner */}
      <FeeWaiverBanner />
      
      {/* Hero Section - Airbnb Style */}
      <section className="bg-white pb-8 pt-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 pt-8">
            <PWAInstallButton />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto px-4 leading-tight">
              Finding care, faster than your baby can lose a sock.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              <span className="font-medium text-gray-900">Created by a mom</span> for moms seeking<br />
              trusted safe childcare
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto mb-12">
            <AirbnbSearch onSearch={(filters) => console.log('Search filters:', filters)} />
          </div>

          {/* Trust Indicators */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  🛡️
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Identity Verified</h4>
                <p className="text-gray-600 leading-relaxed">Your family's safety is our mission. Choose confidently with clear visibility of each caregiver's credentials and documents.</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  🧒
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">WWCC Verified</h4>
                <p className="text-gray-600 leading-relaxed">All caregivers working with children upload a valid WWCC clearance, which we cross-check for validity.</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  💼
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">References Provided by Caregivers</h4>
                <p className="text-gray-600 leading-relaxed">Caregivers submit references from previous families or employers, which you can view and follow up on directly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Main Service Categories - Horizontal Scroll */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Mum Backup Crew
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you need sleep, a fitness class, a shower, or just a moment to breathe — we've got your back. Book reliable, verified care for your mini-mes
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
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* PRE & POST NATAL */}
              <div className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72">
                <div className="relative h-48">
                  <img 
                    src={pregnancyImage} 
                    alt="Pre & Post Natal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    Pre & Post Natal
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Specialized support for new and expecting mothers, including doulas, lactation consultants, and postpartum recovery assistance.
                  </p>
                </div>
              </div>

              {/* INFANT CARE */}
              <div className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72">
                <div className="relative h-48">
                  <img 
                    src={overnightCareImage} 
                    alt="Infant Care"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    Infant Care
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Specialized care for babies 0-12 months with trained caregivers experienced in infant development and safety.
                  </p>
                </div>
              </div>

              {/* 1-ON-1 CARE */}
              <div className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72">
                <div className="relative h-48">
                  <img 
                    src={oneOnOneCareImage} 
                    alt="1-on-1 Care"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    1-on-1 Care
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Personalized one-on-one childcare with dedicated attention tailored to your child's specific needs and development.
                  </p>
                </div>
              </div>

              {/* DROP AND DASH */}
              <div className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72">
                <div className="relative h-48">
                  <img 
                    src={dropAndDashImage} 
                    alt="Drop and Dash"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    Drop and Dash
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Quick drop-off childcare service for busy parents who need immediate, reliable care for short periods.
                  </p>
                </div>
              </div>

              {/* 2-3 HOUR GROUP CARE */}
              <div className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72">
                <div className="relative h-48">
                  <img 
                    src={groupCareImage} 
                    alt="2-3 Hour Group Care"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    2-3 Hour Group Care
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Short-term group childcare sessions perfect for errands, appointments, or social interactions with other children.
                  </p>
                </div>
              </div>

              {/* NANNY SHARING */}
              <Link href="/nanny-sharing" className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64 md:w-72 block">
                <div className="relative h-48">
                  <img 
                    src={nannySharingImage} 
                    alt="Nanny Sharing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-black mb-1">
                    Nanny Sharing
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-3">
                    Share the cost of quality childcare with other families. Connect with local parents and find the perfect shared nanny arrangement.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Caregivers Available Today */}
      <section className="pt-2 pb-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Caregivers Available Today
            </h2>
            <p className="text-sm text-gray-600">
              Connect with verified caregivers ready to help your family right now
            </p>
          </div>

          {/* Featured Caregivers Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-24 bg-gray-200 animate-pulse"></div>
                  <div className="p-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && Array.isArray(featuredNannies) && featuredNannies.length > 0 ? (
              featuredNannies.map((nanny: any, index: number) => (
                <div key={nanny.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="relative h-24">
                    <img 
                      src={caregiverImages[index % caregiverImages.length]} 
                      alt="Caregiver Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-gray-900">
                        {nanny.user?.firstName} {nanny.user?.lastName}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-2.5 w-2.5 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700 ml-0.5">
                          {nanny.averageRating || "4.9"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        📍 {sydneyLocations[index % sydneyLocations.length]}
                      </span>
                      <span className="text-xs font-bold text-black">
                        ${nanny.hourlyRate || "38"}/hr
                      </span>
                    </div>
                    <Link href={`/nanny/${nanny.id}`}>
                      <Button className="w-full bg-coral hover:bg-coral/90 text-white text-xs py-1">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-500 text-sm">No caregivers available at the moment</p>
                <p className="text-gray-400 text-xs mt-1">Check back soon for new caregivers</p>
              </div>
            )}
          </div>

          {/* See All Caregivers Button */}
          <div className="text-center">
            <Link href="/search-caregivers">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm">
                See All Available Caregivers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Phone Mockup Style */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All the tools you need<br />
              to find care, easily.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone 1 - Search & Book */}
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-64 h-80 bg-white rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
                {/* Phone Header */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-3 bg-gray-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                </div>
                
                {/* Screen Content */}
                <div className="pt-8 px-4 h-full bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-gray-400 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4">Find Care</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-coral rounded"></div>
                        <span className="text-sm">Sydney, NSW</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm">Today, 2:00 PM</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm">Infant Care</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium">
                      Search Caregivers
                    </button>
                  </div>
                </div>
                
                {/* Bottom cut-off gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"></div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Search & Book</h3>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Find the perfect caregiver for your needs and book instantly
              </p>
            </div>

            {/* Phone 2 - Meet Your Caregiver */}
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-64 h-80 bg-white rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
                {/* Phone Header */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-3 bg-gray-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                </div>
                
                {/* Screen Content */}
                <div className="pt-8 px-4 h-full bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-gray-400 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-coral rounded-full mx-auto mb-3 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-lg">Sarah M.</h3>
                    <p className="text-sm text-gray-600">Infant Care Specialist</p>
                    <div className="flex items-center justify-center mt-1">
                      <div className="flex text-yellow-400">
                        ★★★★★
                      </div>
                      <span className="text-xs text-gray-600 ml-1">4.9 (127)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-coral text-white py-2 rounded-lg text-sm font-medium">
                      Message Sarah
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
                
                {/* Bottom cut-off gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"></div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Meet Your Caregiver</h3>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Connect before your booking to ensure a perfect match
              </p>
            </div>

            {/* Phone 3 - Enjoy Peace of Mind */}
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-64 h-80 bg-white rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
                {/* Phone Header */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-3 bg-gray-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                </div>
                
                {/* Screen Content */}
                <div className="pt-8 px-4 h-full bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-gray-400 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4">Active Booking</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Live Session</span>
                    </div>
                    <p className="text-xs text-green-700">Sarah is currently caring for Emma</p>
                    <p className="text-xs text-green-600 mt-1">Started: 2:00 PM • Duration: 2h 15m</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Location tracking</span>
                      <span className="text-green-600 font-medium">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Emergency contacts</span>
                      <span className="text-green-600 font-medium">✓ Notified</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Background check</span>
                      <span className="text-green-600 font-medium">✓ Verified</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom cut-off gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"></div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enjoy Peace of Mind</h3>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Relax knowing your family is in trusted, qualified hands
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}