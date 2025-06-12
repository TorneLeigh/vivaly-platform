import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { PetCareIcon } from '../components/ServiceIcons';
import OptimizedImage from '../components/OptimizedImage';
import dogWalkingImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import petSittingImage from "@assets/8da0e0735821d20e3f8cb769e40a4c98_1749182897295.jpg";
import dropInVisitsImage from "@assets/9717a7e59d32ac45c39a7f027a3230af_1749182897295.jpg";
import petTransportImage from "@assets/d81ff6e441430a5c581dc3a72149844e_1749182897295.jpg";
import petGroomingImage from "@assets/f087158c54b76ecf0250c6866d218c92_1749182897295.jpg";
import overnightCareImage from "@assets/eba1794568e9061d6c6e016750154ee7_1749182897295.jpg";

export default function PetCareServices() {
  const petCareServices = [
    {
      title: "Dog Walking",
      description: "Professional dog walking services with experienced walkers who understand canine behavior, exercise needs, and safety protocols for all dog breeds and sizes.",
      image: dogWalkingImage,
      link: "/book/dog-walking",
      buttonText: "Book Now",
      features: ["Daily exercise routines", "Behavioral monitoring", "GPS tracking updates", "Weather-appropriate gear", "Group or solo walks"]
    },
    {
      title: "Pet Sitting",
      description: "Comprehensive in-home pet care while you're away, maintaining your pet's routine with feeding, playtime, companionship, and regular updates with photos.",
      image: petSittingImage,
      link: "/book/pet-sitting",
      buttonText: "Learn More",
      features: ["Feeding & medication", "Playtime & exercise", "Companionship care", "Photo updates", "Home security checks"]
    },
    {
      title: "Drop-in Visits",
      description: "Convenient 30-minute visits for busy pet parents, including feeding, bathroom breaks, medication administration, and quality time with your pets.",
      image: dropInVisitsImage,
      link: "/book/drop-in-visits",
      buttonText: "Book Now",
      features: ["Feeding & fresh water", "Bathroom breaks", "Quick exercise", "Medication admin", "Love & attention"]
    },
    {
      title: "Pet Transport",
      description: "Safe, reliable transportation for vet visits, grooming appointments, or daycare with secure pet carriers and experienced drivers who prioritize animal comfort.",
      image: petTransportImage,
      link: "/book/pet-transport",
      buttonText: "Learn More",
      features: ["Vet appointments", "Grooming transport", "Secure carriers", "Climate control", "Door-to-door service"]
    },
    {
      title: "Pet Grooming",
      description: "Professional grooming services in the comfort of your home including bathing, brushing, nail trimming, and basic hygiene care for dogs and cats.",
      image: petGroomingImage,
      link: "/book/pet-grooming",
      buttonText: "Book Now",
      features: ["Bathing & drying", "Brushing & detangling", "Nail trimming", "Ear cleaning", "Basic hygiene care"]
    },
    {
      title: "Overnight Care",
      description: "Round-the-clock care in your home with overnight stays, ensuring your pets maintain their routines while receiving constant supervision and companionship.",
      image: overnightCareImage,
      link: "/book/overnight-care",
      buttonText: "Learn More",
      features: ["24-hour supervision", "Routine maintenance", "Emergency response", "Multiple pet care", "Home security"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-gray-900 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Pet Care Services</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Pet Care Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with trusted, local animal lovers for reliable pet care services when you need them most.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {petCareServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Service Image */}
                <div className="h-48 overflow-hidden bg-gray-100">
                  <OptimizedImage 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ aspectRatio: '16/9' }}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-center leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="text-center">
                    <Link href={service.link}>
                      <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center mx-auto">
                        {service.buttonText}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding the Right Pet Care?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our care coordinators are here to help you find the perfect pet care solution for your furry family members.
              </p>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200">
                  Get Personalized Guidance
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}