import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { AgedCareIcon, CompanionshipIcon } from '../components/ServiceIcons';
import OptimizedImage from '../components/OptimizedImage';
import companionCareImage from "@assets/e84b82177ddf914b2846c3f2490fa10a_1749704143559.jpg";
import personalCareImage from "@assets/4cc0a7574cdc29223b8258323d959476_1749704162733.jpg";
import respiteCareImage from "@assets/3cac5e050bdabc4fff29304ef9af2d1e_1749704239514.jpg";
import transportErrandsImage from "@assets/7111567ee33e7fbd156e36bd454e1ed4_1749704162733.jpg";
import medicalSupportImage from "@assets/3762ad3936751689a7cd687f78482609_1749704239514.jpg";
import housekeepingImage from "@assets/1479ae8eb70d8fd487ceda250ec4dd79_1749704239514.jpg";
import elderlySocialImage from "@assets/f2918dba9993260327d6b33966a5b786_1749704143559.jpg";

export default function AgedCareServices() {
  const agedCareServices = [
    {
      title: "Companion Care",
      description: "Professional companionship services providing social interaction, conversation, activities, and emotional support to prevent isolation and enhance quality of life for elderly individuals.",
      image: companionCareImage,
      link: "/book/companion-care",
      buttonText: "Book Now",
      features: ["Social conversation", "Activity planning", "Meal companionship", "Emotional support", "Reading & entertainment"]
    },
    {
      title: "Personal Care",
      description: "Dignified assistance with activities of daily living including bathing, grooming, dressing, and mobility support from trained caregivers who respect individual preferences and privacy.",
      image: personalCareImage,
      link: "/book/personal-care",
      buttonText: "Learn More",
      features: ["Bathing assistance", "Grooming & hygiene", "Dressing support", "Mobility assistance", "Medication reminders"]
    },
    {
      title: "Respite Care",
      description: "Temporary relief care allowing family caregivers to rest while ensuring loved ones receive quality supervision, companionship, and assistance with daily needs in a familiar environment.",
      image: respiteCareImage,
      link: "/book/respite-care",
      buttonText: "Book Now",
      features: ["Short-term relief", "Overnight stays", "Weekend support", "Emergency coverage", "Routine maintenance"]
    },
    {
      title: "Transport & Errands",
      description: "Safe, reliable transportation and assistance with errands including medical appointments, grocery shopping, pharmacy visits, and social outings with experienced drivers.",
      image: transportErrandsImage,
      link: "/book/transport-errands",
      buttonText: "Learn More",
      features: ["Medical appointments", "Grocery shopping", "Pharmacy visits", "Social outings", "Banking assistance"]
    },
    {
      title: "Medical Support",
      description: "Specialized care assistance including medication management, appointment coordination, health monitoring, and communication with healthcare providers for comprehensive health support.",
      image: medicalSupportImage,
      link: "/book/medical-support",
      buttonText: "Book Now",
      features: ["Medication management", "Appointment scheduling", "Health monitoring", "Provider communication", "Treatment follow-up"]
    },
    {
      title: "Light Housekeeping",
      description: "Home maintenance assistance including cleaning, laundry, meal preparation, and organization to help elderly individuals maintain a clean, safe, and comfortable living environment.",
      image: housekeepingImage,
      link: "/book/light-housekeeping",
      buttonText: "Learn More",
      features: ["Light cleaning", "Laundry assistance", "Meal preparation", "Home organization", "Safety checks"]
    },
    {
      title: "Elderly Care Social",
      description: "Companionship and care through organized social events, group activities, and community engagement programs run by experienced service providers to enhance social connections and wellbeing.",
      image: elderlySocialImage,
      link: "/book/elderly-social",
      buttonText: "Join Events",
      features: ["Group activities", "Social events", "Community engagement", "Peer connections", "Professional facilitation"]
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {agedCareServices.map((service, index) => (
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