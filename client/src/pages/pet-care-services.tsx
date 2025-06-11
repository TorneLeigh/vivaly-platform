import { Link } from 'wouter';
import { ChevronRight, Home, Dog, Clock, Car, Heart } from 'lucide-react';

export default function PetCareServices() {
  const petCareServices = [
    {
      title: "Dog Walking",
      description: "Regular walks to keep your dog healthy and happy with professional pet carers.",
      icon: <Dog className="w-16 h-16 text-green-600" />,
      link: "/book/dog-walking",
      buttonText: "Book Now"
    },
    {
      title: "Pet Sitting",
      description: "In-home care while you're away for extended periods with trusted animal lovers.",
      icon: <Home className="w-16 h-16 text-blue-600" />,
      link: "/book/pet-sitting",
      buttonText: "Learn More"
    },
    {
      title: "Drop-in Visits",
      description: "Quick check-ins for feeding, letting out, and basic care when you're busy.",
      icon: <Clock className="w-16 h-16 text-orange-600" />,
      link: "/book/drop-in-visits",
      buttonText: "Book Now"
    },
    {
      title: "Pet Transport",
      description: "Safe and secure transport to vet appointments, grooming, or boarding facilities.",
      icon: <Car className="w-16 h-16 text-purple-600" />,
      link: "/book/pet-transport",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {petCareServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    {service.icon}
                  </div>
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