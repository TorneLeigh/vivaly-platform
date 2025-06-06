import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ServiceCarousel from "@/components/service-carousel";
import petSittingServiceImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import newbornCareImage from "@assets/b1bc54b815bb1f418342a8203ae3e8e3_1749182535016.jpg";
import newbornWithToyImage from "@assets/2d55b12ae13df50f6fbabfa2be240f07_1749182535016.jpg";
import motherBabyBondingImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749182535016.jpg";
import motherHoldingBabyImage from "@assets/f01acbf088d9ff9aa3b69419fa01ff03_1749182535016.jpg";
import birthEducationClassImage from "@assets/5c1756efeffe31b87ae42255a1e625b5_1749182535016.jpg";
import parentingClassImage from "@assets/300ce6a6e339c054c341d15ef56cabbb_1749182535016.jpg";

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

const birthEducationClasses = [
  {
    title: "Hypnobirthing Classes",
    description: "Relaxation techniques for natural birth",
    image: "/images/hypnobirthing.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Sleeping Classes",
    description: "Learn healthy sleep patterns for babies",
    image: "/images/sleeping-classes.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Lamaze Method",
    description: "Traditional breathing and relaxation",
    image: "/images/lamaze.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Bradley Method",
    description: "Natural childbirth preparation",
    image: "/images/bradley.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Water Birth Classes",
    description: "Preparation for water delivery",
    image: "/images/waterbirth.jpg",
    serviceType: "Birth education"
  },
  {
    title: "Newborn Care Classes",
    description: "Essential baby care skills",
    image: "/images/newborn-care.jpg",
    serviceType: "Birth education"
  }
];

const midwifeServices = [
  {
    title: "Postnatal Care",
    description: "Recovery and newborn support",
    image: motherHoldingBabyImage,
    serviceType: "Midwife services"
  },
  {
    title: "Newborn Care",
    description: "Specialized care for newborns",
    image: newbornWithToyImage,
    serviceType: "Midwife services"
  },
  {
    title: "Breastfeeding Support",
    description: "Expert lactation consultation",
    image: motherBabyBondingImage,
    serviceType: "Midwife services"
  },
  {
    title: "Birth Education",
    description: "Comprehensive birth preparation classes",
    image: birthEducationClassImage,
    serviceType: "Midwife services"
  },
  {
    title: "Parenting Classes",
    description: "Baby care and parenting education",
    image: parentingClassImage,
    serviceType: "Midwife services"
  },
  {
    title: "Sleep Support",
    description: "Newborn sleep guidance and support",
    image: newbornCareImage,
    serviceType: "Midwife services"
  }
];

const petSittingServices = [
  {
    title: "Dog Walking",
    description: "Daily exercise and companionship",
    image: petSittingServiceImage,
    serviceType: "Pet sitting"
  },
  {
    title: "Pet Boarding",
    description: "Overnight care in your home",
    image: "/images/pet-boarding.jpg",
    serviceType: "Pet sitting"
  },
  {
    title: "Cat Sitting",
    description: "Specialized feline care",
    image: "/images/cat-sitting.jpg",
    serviceType: "Pet sitting"
  },
  {
    title: "Pet Grooming",
    description: "Professional grooming services",
    image: "/images/pet-grooming.jpg",
    serviceType: "Pet sitting"
  },
  {
    title: "Vet Visits",
    description: "Transportation to appointments",
    image: "/images/vet-visits.jpg",
    serviceType: "Pet sitting"
  },
  {
    title: "Pet Training",
    description: "Basic obedience and behavior",
    image: "/images/pet-training.jpg",
    serviceType: "Pet sitting"
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

      {/* Birth Education Classes */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Birth Education Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive childbirth preparation and education programs
            </p>
          </div>
          
          <ServiceCarousel>
            {birthEducationClasses.map((classType, index) => (
              <div 
                key={index}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-48"
                onClick={() => {
                  const searchParams = new URLSearchParams({
                    serviceType: classType.serviceType,
                    location: 'Sydney, NSW'
                  });
                  window.location.href = `/search?${searchParams.toString()}`;
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                  <img 
                    src={classType.image} 
                    alt={classType.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.backgroundColor = '#f9fafb';
                        e.currentTarget.parentElement.innerHTML = `
                          <div class="flex items-center justify-center h-full">
                            <span class="text-gray-400 text-xs">${classType.title}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{classType.title}</h3>
                  <p className="text-xs text-gray-600">{classType.description}</p>
                </div>
              </div>
            ))}
          </ServiceCarousel>
        </div>
      </section>

      {/* Midwife Services */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Midwife Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional midwifery care from prenatal to postnatal support
            </p>
          </div>
          
          <ServiceCarousel>
            {midwifeServices.map((service, index) => (
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
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </ServiceCarousel>
        </div>
      </section>

      {/* Pet Sitting Services */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-600">{service.description}</p>
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
                      <p className="text-sm font-medium text-gray-900 truncate">{nanny.suburb}</p>
                      <div className="flex items-center gap-0.5">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium">{nanny.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {nanny.user?.firstName} {nanny.user?.lastName}
                    </p>
                    
                    <p className="text-sm text-gray-500 truncate">
                      {nanny.services?.[0] || 'Care provider'}
                    </p>
                    
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">${nanny.hourlyRate}</span>
                      <span className="text-gray-500"> /hour</span>
                    </p>
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


    </div>
  );
}