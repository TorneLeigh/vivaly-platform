import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ServiceCarousel from "@/components/service-carousel";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import dogPlaytimeImage from "@assets/994aad74ac4664d9bd56815d3fda5f88_1749183011870.jpg";
import dogTrainingImage from "@assets/04d9009db67d6c328f97e3b626b6d305_1749183011871.jpg";
import dogWalkingGroupImage from "@assets/1f385011ff2b05a03672385eb150b795_1749183011871.jpg";
import dogJoggingImage from "@assets/d886544ac5e3fae6b42acf55429e1aaa_1749183011871.jpg";
import cityDogWalkImage from "@assets/32b2abcfc1fddbe1118ee928059ce66b_1749183011871.jpg";


interface Nanny {
  id: number;
  userId: number;
  bio: string;
  experience: number;
  hourlyRate: string;
  location: string;
  suburb: string;
  services: string[];
  certificates: string[];
  isVerified: boolean;
  rating: string;
  reviewCount: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  serviceType: string;
  price: string;
  duration: number;
  maxParticipants: number;
  ageRange: string;
  location: string;
  rating: string;
  reviewCount: number;
  firstName: string;
  lastName: string;
}





const petSittingServices = [
  {
    title: "Dog Playtime",
    description: "Interactive play and companionship for pets",
    image: dogPlaytimeImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Dog Training",
    description: "Professional training and behavior coaching",
    image: dogTrainingImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Group Dog Walking",
    description: "Socialized walks with multiple dogs",
    image: dogWalkingGroupImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Active Dog Jogging",
    description: "High-energy exercise and fitness",
    image: dogJoggingImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Urban Dog Walking",
    description: "City walks and outdoor adventures",
    image: cityDogWalkImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Pet Sitting",
    description: "In-home care and companionship",
    image: petSittingServiceImage,
    serviceType: "Pet sitting"
  }
];

const elderlyCareServices = [
  {
    title: "Companionship Care",
    description: "Social interaction and emotional support",
    image: "/images/elderly.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Personal Care Assistance",
    description: "Help with daily activities and hygiene",
    image: "/images/companionship.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Medication Management",
    description: "Assistance with medication schedules",
    image: "/images/elderly.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Meal Preparation",
    description: "Nutritious meal planning and cooking",
    image: "/images/companionship.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Transportation Services",
    description: "Safe transport to appointments and activities",
    image: "/images/elderly.jpg",
    serviceType: "Elderly care"
  },
  {
    title: "Household Support",
    description: "Light cleaning and home maintenance",
    image: "/images/companionship.jpg",
    serviceType: "Elderly care"
  }
];

const socialEvents = [
  {
    title: "Park Playdates",
    description: "Meet other families at local parks",
    image: "/images/social1.jpg",
    serviceType: "Park Playdates"
  },
  {
    title: "Coffee Catch-ups",
    description: "Parent meetups at local cafes",
    image: "/images/social2.jpg",
    serviceType: "Coffee Catch-ups"
  },
  {
    title: "Art & Craft",
    description: "Creative sessions for kids and parents",
    image: "/images/social3.jpg",
    serviceType: "Art & Craft"
  },
  {
    title: "New Parent Groups",
    description: "Support groups for new mothers",
    image: "/images/social4.jpg",
    serviceType: "New Parent Groups"
  },
  {
    title: "Nature Exploration",
    description: "Outdoor discovery with children",
    image: "/images/social5.jpg",
    serviceType: "Nature Exploration"
  },
  {
    title: "Elderly Care Social",
    description: "Companionship and care activities",
    image: "/images/social6.jpg",
    serviceType: "Elderly Care Social"
  }
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch featured caregivers
  const { data: featuredNannies = [] } = useQuery({
    queryKey: ["/api/nannies/featured"],
  });

  // Fetch featured experiences
  const { data: featuredExperiences = [] } = useQuery({
    queryKey: ["/api/experiences/featured"],
  });

  // Filter function to determine which sections to show
  const shouldShowSection = (sectionType: string) => {
    if (selectedCategory === "all") return true;
    
    switch (selectedCategory) {
      case "pet":
        return sectionType === "pet";
      case "elderly":
        return sectionType === "elderly";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Discover professional care services, connect with trusted caregivers, and join community events
            </p>
            
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setSelectedCategory("pet")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "pet"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pet Care
              </button>
              <button
                onClick={() => setSelectedCategory("elderly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "elderly"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Elderly Care
              </button>
            </div>
          </div>
        </div>
      </section>







      {/* Pet Sitting Services */}
      {shouldShowSection("pet") && (
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Pet Sitting Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional pet care services for your beloved companions
              </p>
            </div>
            
            <ServiceCarousel>
              {petSittingServices.map((service, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: service.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                          e.currentTarget.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <span class="text-gray-400 text-xs">${service.title}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Elderly Care Services */}
      {shouldShowSection("elderly") && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Elderly Care Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Compassionate care and support services for seniors
              </p>
            </div>
            
            <ServiceCarousel>
              {elderlyCareServices.map((service, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: service.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                          e.currentTarget.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <span class="text-gray-400 text-xs">${service.title}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Featured Caregivers */}
      {shouldShowSection("all") && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Available Caregivers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Verified professionals ready to provide specialized care services
              </p>
            </div>
            
            <ServiceCarousel>
              {Array.isArray(featuredNannies) && featuredNannies.length > 0 ? (
                featuredNannies.slice(0, 8).map((nanny: Nanny & { user: User }) => (
                  <div 
                    key={nanny.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                    onClick={() => window.location.href = `/caregiver/${nanny.id}`}
                  >
                    <div className="relative mb-2">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {nanny.user?.profileImage ? (
                          <img 
                            src={nanny.user.profileImage} 
                            alt={`${nanny.user?.firstName} ${nanny.user?.lastName}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-lg font-semibold text-gray-700">
                                {nanny.user?.firstName?.[0]}{nanny.user?.lastName?.[0]}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {nanny.isVerified && (
                        <div className="absolute top-1 right-1">
                          <div className="bg-white rounded-full p-0.5 shadow-sm">
                            <span className="w-4 h-4 text-green-600 text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {nanny.user?.firstName} {nanny.user?.lastName}
                        </h3>
                        <span className="text-xs text-gray-500">⭐ {nanny.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{nanny.location}</p>
                      <p className="text-xs text-blue-600 font-medium">${nanny.hourlyRate}/hr</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-gray-500">No caregivers available at the moment</p>
                </div>
              )}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Social Events & Activities */}
      {shouldShowSection("all") && (
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Events and Social</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with other families through organized activities and social gatherings
              </p>
            </div>
            
            <ServiceCarousel>
              {socialEvents.map((event, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: event.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                          e.currentTarget.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <span class="text-gray-400 text-xs">${event.title}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                    <p className="text-xs text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Featured Experiences */}
      {shouldShowSection("all") && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Experiences</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unique activities and educational programs led by experienced caregivers
              </p>
            </div>
            
            <ServiceCarousel>
              {Array.isArray(featuredExperiences) && featuredExperiences.length > 0 ? (
                featuredExperiences.slice(0, 8).map((experience: Experience) => (
                  <div 
                    key={experience.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                    onClick={() => window.location.href = `/experience/${experience.id}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                      <img 
                        src="/images/default-experience.jpg" 
                        alt={experience.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                            e.currentTarget.parentElement.innerHTML = `
                              <div class="flex items-center justify-center h-full">
                                <span class="text-gray-400 text-xs">${experience.title}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                          ⭐ {experience.rating}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{experience.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">{experience.ageRange} • {experience.location}</p>
                      <p className="text-xs text-blue-600 font-medium">${experience.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-gray-500">No experiences available at the moment</p>
                </div>
              )}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Additional Care Services - Prominent Buttons */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Looking for Specialized Care?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We also provide expert care services for your elderly family members and beloved pets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Elderly Care Button */}
            <div 
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => {
                const searchParams = new URLSearchParams({
                  serviceType: 'Elderly care',
                  location: 'Sydney, NSW'
                });
                window.location.href = `/search?${searchParams.toString()}`;
              }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/elderly.jpg" 
                  alt="Elderly Care Services"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">I am searching for elderly care</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Professional companion care, medication assistance, mobility support, and daily living help for seniors
                  </p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Find elderly care providers</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Care Button */}
            <div 
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => {
                const searchParams = new URLSearchParams({
                  serviceType: 'Pet sitting',
                  location: 'Sydney, NSW'
                });
                window.location.href = `/search?${searchParams.toString()}`;
              }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/dog-walking.jpg" 
                  alt="Pet Care Services"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">I am searching for pet care</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Dog walking, pet sitting, feeding schedules, exercise, and loving companionship for your furry family members
                  </p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Find pet care providers</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note for Caregivers */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">For Caregivers & Babysitters</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  When creating your profile, please include information about any pets in households you work with. 
                  This helps families with allergies find suitable caregivers and ensures the safety and comfort of both children and pets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}