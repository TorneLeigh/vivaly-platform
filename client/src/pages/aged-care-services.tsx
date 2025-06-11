import { Link } from 'wouter';
import { ChevronRight, Home, Heart, Coffee, Car, Stethoscope } from 'lucide-react';

export default function AgedCareServices() {
  const agedCareServices = [
    {
      title: "Companion Care",
      description: "Social interaction and emotional support for elderly individuals in their daily lives.",
      icon: <Coffee className="w-16 h-16 text-purple-600" />,
      link: "/book/companion-care",
      buttonText: "Book Now"
    },
    {
      title: "Personal Care",
      description: "Assistance with daily activities and personal hygiene with dignity and respect.",
      icon: <Heart className="w-16 h-16 text-pink-600" />,
      link: "/book/personal-care",
      buttonText: "Learn More"
    },
    {
      title: "Respite Care",
      description: "Temporary relief for family caregivers while ensuring continuous quality care.",
      icon: <Home className="w-16 h-16 text-blue-600" />,
      link: "/book/respite-care",
      buttonText: "Book Now"
    },
    {
      title: "Transport & Errands",
      description: "Safe transport to appointments and assistance with shopping and errands.",
      icon: <Car className="w-16 h-16 text-green-600" />,
      link: "/book/transport-errands",
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
            <span className="text-gray-900 font-medium">Aged Care Services</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compassionate Aged Care Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dignified, person-centered care services to support elderly individuals with companionship, daily tasks, and specialized care needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agedCareServices.map((service, index) => (
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding the Right Aged Care?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our care coordinators are here to help you find the perfect aged care solution for your loved ones' unique needs.
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