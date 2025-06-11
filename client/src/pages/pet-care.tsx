import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import dogWalkingImage from "@assets/994aad74ac4664d9bd56815d3fda5f88_1749183011870.jpg";
import petSittingImage from "@assets/d886544ac5e3fae6b42acf55429e1aaa_1749183011871.jpg";
import petGroomingImage from "@assets/32b2abcfc1fddbe1118ee928059ce66b_1749183011871.jpg";
import veterinaryTransportImage from "@assets/1f385011ff2b05a03672385eb150b795_1749183011871.jpg";
import petBoardingImage from "@assets/04d9009db67d6c328f97e3b626b6d305_1749183011871.jpg";
import petTrainingImage from "@assets/8da0e0735821d20e3f8cb769e40a4c98_1749182897295.jpg";

export default function PetCare() {
  const petCareServices = [
    {
      title: "Dog Walking",
      description: "Reliable daily walks to keep your dog happy, healthy, and well-exercised while you're away.",
      image: dogWalkingImage,
      link: "/book/dog-walking",
      buttonText: "Book Now"
    },
    {
      title: "Pet Sitting",
      description: "In-home pet care providing companionship and attention for your pets in their familiar environment.",
      image: petSittingImage,
      link: "/book/pet-sitting",
      buttonText: "Learn More"
    },
    {
      title: "Pet Grooming",
      description: "Professional grooming services including baths, brushing, nail trimming, and styling.",
      image: petGroomingImage,
      link: "/book/pet-grooming",
      buttonText: "Book Now"
    },
    {
      title: "Veterinary Transport",
      description: "Safe and comfortable transportation to veterinary appointments and pet care facilities.",
      image: veterinaryTransportImage,
      link: "/book/vet-transport",
      buttonText: "Learn More"
    },
    {
      title: "Pet Boarding",
      description: "Overnight care in a loving home environment when you need to be away for extended periods.",
      image: petBoardingImage,
      link: "/book/pet-boarding",
      buttonText: "Book Now"
    },
    {
      title: "Pet Training",
      description: "Professional training sessions to help your pet develop good behaviors and social skills.",
      image: petTrainingImage,
      link: "/book/pet-training",
      buttonText: "Learn More"
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
            <span className="text-gray-900 font-medium">Pet Care</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Loving Care for Your Furry Family
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional pet care services to keep your beloved companions happy, healthy, and well-cared for when you can't be there.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petCareServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
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
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Choosing Pet Care Services?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our pet care coordinators are here to help you find the perfect care solution for your furry, feathered, or scaled family members.
              </p>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200">
                  Get Personalized Pet Care Plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}