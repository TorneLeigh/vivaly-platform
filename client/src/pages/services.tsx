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
import newbornCareImage from "@assets/b1bc54b815bb1f418342a8203ae3e8e3_1749182535016.jpg";
import newbornWithToyImage from "@assets/2d55b12ae13df50f6fbabfa2be240f07_1749182535016.jpg";
import motherBabyBondingImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749182535016.jpg";
import motherHoldingBabyImage from "@assets/f01acbf088d9ff9aa3b69419fa01ff03_1749182535016.jpg";
import birthEducationClassImage from "@assets/5c1756efeffe31b87ae42255a1e625b5_1749182535016.jpg";
import parentingClassImage from "@assets/300ce6a6e339c054c341d15ef56cabbb_1749182535016.jpg";
import babyFeetImage from "@assets/9717a7e59d32ac45c39a7f027a3230af_1749182897295.jpg";
import laborSupportImage from "@assets/f087158c54b76ecf0250c6866d218c92_1749182897295.jpg";
import birthCoachingImage from "@assets/8da0e0735821d20e3f8cb769e40a4c98_1749182897295.jpg";
import breastfeedingLatchImage from "@assets/c18480e234907faffa31784936ac8816_1749182897295.jpg";
import newbornHandsImage from "@assets/79c40dcc41bd092f6f03b26fd4cf94d8_1749182897295.jpg";
import breastpadsImage from "@assets/d81ff6e441430a5c581dc3a72149844e_1749182897295.jpg";
import birthBallImage from "@assets/f116334957ff9c74101be0e0c41edcda_1749182897295.jpg";
import pregnancyMassageImage from "@assets/eba1794568e9061d6c6e016750154ee7_1749182897295.jpg";

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
    title: "Newborn Care",
    description: "Essential baby care skills and techniques",
    image: babyFeetImage,
    serviceType: "Birth education"
  },
  {
    title: "Labor Support",
    description: "Comfort techniques and birth preparation",
    image: laborSupportImage,
    serviceType: "Birth education"
  },
  {
    title: "Birth Coaching",
    description: "Personalized birthing guidance and support",
    image: birthCoachingImage,
    serviceType: "Birth education"
  },
  {
    title: "Breastfeeding Latch",
    description: "Proper breastfeeding techniques and positioning",
    image: breastfeedingLatchImage,
    serviceType: "Birth education"
  },
  {
    title: "Newborn Bonding",
    description: "Building connection with your newborn",
    image: newbornHandsImage,
    serviceType: "Birth education"
  },
  {
    title: "Breastfeeding Support",
    description: "Comprehensive lactation consultation",
    image: breastpadsImage,
    serviceType: "Birth education"
  },
  {
    title: "Birth Ball Techniques",
    description: "Exercise and comfort during pregnancy",
    image: birthBallImage,
    serviceType: "Birth education"
  },
  {
    title: "Pregnancy Massage",
    description: "Prenatal massage and wellness support",
    image: pregnancyMassageImage,
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
      case "midwife":
        return sectionType === "midwife" || sectionType === "birth-education";
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
                onClick={() => setSelectedCategory("midwife")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "midwife"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Midwife Services
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

      {/* Birth Education Classes */}
      {shouldShowSection("birth-education") && (
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
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
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{classType.title}</h3>
                    <p className="text-xs text-gray-600">{classType.description}</p>
                  </div>
                </div>
              ))}
            </ServiceCarousel>
          </div>
        </section>
      )}

      {/* Midwife Services */}
      {shouldShowSection("midwife") && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
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

    </div>
  );
}