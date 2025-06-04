import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ServiceCarousel from "@/components/service-carousel";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";

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

const serviceCategories = [
  {
    title: "Midwife services",
    description: "Professional midwife care",
    image: "/images/midwife.jpg",
    serviceType: "Midwife services"
  },
  {
    title: "Breastfeeding support",
    description: "Expert breastfeeding guidance",
    image: "/images/breastfeeding.jpg",
    serviceType: "Breastfeeding support"
  },
  {
    title: "Birth education",
    description: "Childbirth preparation classes",
    image: "/images/birthed.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Newborn support",
    description: "Specialized newborn care",
    image: "/images/newborn.jpg",
    serviceType: "Newborn support"
  },
  {
    title: "Pregnancy assistance",
    description: "Support during pregnancy",
    image: "/images/pregnancy.jpg",
    serviceType: "Pregnancy assistance"
  },
  {
    title: "Postnatal care",
    description: "Care after childbirth",
    image: "/images/postnatal.jpg",
    serviceType: "Postnatal care"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover professional care services, connect with trusted caregivers, and join community events
            </p>
            
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setSelectedCategory("midwife")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "midwife"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Midwife Services
              </button>
              <button
                onClick={() => setSelectedCategory("pet")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "pet"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pet Care
              </button>
              <button
                onClick={() => setSelectedCategory("elderly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "elderly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Elderly Care
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized care services by qualified professionals
            </p>
          </div>
          
          <ServiceCarousel>
            {serviceCategories.map((category, index) => (
              <div 
                key={index}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
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
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.title}</h3>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </ServiceCarousel>
        </div>
      </section>

      {/* Featured Caregivers */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Caregivers</h2>
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
                  onClick={() => window.location.href = `/nanny/${nanny.id}`}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={nanny.user?.profileImage || "/images/default-avatar.jpg"} 
                      alt={`${nanny.user?.firstName} ${nanny.user?.lastName}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {nanny.isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ {nanny.rating}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {nanny.user?.firstName} {nanny.user?.lastName}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">{nanny.suburb}</p>
                    <p className="text-xs text-blue-600 font-medium">${nanny.hourlyRate}/hour</p>
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

      {/* Social Events & Activities */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Events and Social</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with other families through organized activities and social gatherings
            </p>
          </div>
          
          <ServiceCarousel>
            {socialEvents.map((event, index) => (
              <div 
                key={index}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                onClick={() => window.location.href = `/search?serviceType=${event.serviceType}&location=Sydney, NSW`}
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
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </ServiceCarousel>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Experiences</h2>
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

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find the perfect care service?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our verified caregivers and specialized services to find exactly what your family needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Browse All Services
              </button>
            </Link>
            <Link href="/become-nanny">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Become a Provider
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}