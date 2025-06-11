import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import companionshipImage from "@assets/72a1a9c0773aeb45b624a5e05e355eb0_1749360121452.jpg";
import personalCareImage from "@assets/79c40dcc41bd092f6f03b26fd4cf94d8_1749360121452.jpg";
import mobilityAssistanceImage from "@assets/6a343ff11de7689d7a8361bbc05075a5_1749360121452.jpg";
import medicationManagementImage from "@assets/43d1ada7714ec38aef8a9c6639cf3182_1749360121452.jpg";
import householdSupportImage from "@assets/702b767994f2c076bab98adb9368662e_1749360121452.jpg";
import respiteCareImage from "@assets/2211c4a4f0b5f624766fb6ce4c54de99_1749360121452.jpg";

export default function AgedCare() {
  const agedCareServices = [
    {
      title: "Companionship",
      description: "Friendly companions to provide social interaction, conversation, and emotional support for seniors.",
      image: companionshipImage,
      link: "/book/companionship",
      buttonText: "Book Now"
    },
    {
      title: "Personal Care",
      description: "Assistance with daily personal care tasks including bathing, dressing, and grooming.",
      image: personalCareImage,
      link: "/book/personal-care",
      buttonText: "Learn More"
    },
    {
      title: "Mobility Assistance",
      description: "Support with movement, transfers, and maintaining independence around the home.",
      image: mobilityAssistanceImage,
      link: "/book/mobility-assistance",
      buttonText: "Book Now"
    },
    {
      title: "Medication Management",
      description: "Professional assistance with medication schedules and health monitoring.",
      image: medicationManagementImage,
      link: "/book/medication-management",
      buttonText: "Learn More"
    },
    {
      title: "Household Support",
      description: "Help with cooking, cleaning, shopping, and maintaining a comfortable living environment.",
      image: householdSupportImage,
      link: "/book/household-support",
      buttonText: "Book Now"
    },
    {
      title: "Respite Care",
      description: "Temporary care services to give family caregivers a well-deserved break.",
      image: respiteCareImage,
      link: "/book/respite-care",
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
            <span className="text-gray-900 font-medium">Aged Care</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compassionate Care for Seniors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional aged care services designed to support independence, dignity, and quality of life for seniors in their own homes.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agedCareServices.map((service, index) => (
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding the Right Care?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our care coordinators are here to help you find the perfect aged care support tailored to your loved one's specific needs.
              </p>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200">
                  Get Personalized Care Plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}