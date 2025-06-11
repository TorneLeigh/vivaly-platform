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
    <div className="min-h-screen bg-white">
      <section className="breadcrumb py-4 px-8 text-sm text-gray-600 bg-gray-50">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium">Aged Care Services</span>
      </section>

      <section className="services-wrapper py-12 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Supportive, Trusted Aged Care Services
        </h2>
        
        <div className="services-grid grid gap-8 max-w-5xl mx-auto" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {agedCareServices.map((service, index) => (
            <div key={index} className="service-card bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:transform hover:-translate-y-1 transition-all duration-200">
              <img
                src={service.image}
                alt={service.title}
                className="w-16 h-16 mb-4 mx-auto"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {service.description}
              </p>
              <Link href={service.link}>
                <button className="cta-button inline-block bg-black text-white py-2 px-5 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
                  {service.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}