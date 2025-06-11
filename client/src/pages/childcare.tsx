import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import nannyCareImage from "@assets/31d064b6874d9bd38e6f664bff0e8352_1749267180596.jpg";
import afterSchoolCareImage from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618_1749267219539.jpg";
import babysittingImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import emergencyCareImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749267017855.jpg";
import overnightCareImage from "@assets/9717a7e59d32ac45c39a7f027a3230af_1749182897295.jpg";
import holidayCareImage from "@assets/d81ff6e441430a5c581dc3a72149844e_1749182897295.jpg";

export default function Childcare() {
  const childcareServices = [
    {
      title: "Nanny Care",
      description: "Professional full-time or part-time nannies to provide personalized care for your children.",
      image: nannyCareImage,
      link: "/book/nanny",
      buttonText: "Book Now"
    },
    {
      title: "After School Care",
      description: "Safe and engaging after-school supervision with homework help and activities.",
      image: afterSchoolCareImage,
      link: "/book/after-school",
      buttonText: "Learn More"
    },
    {
      title: "Babysitting",
      description: "Trusted babysitters for date nights, appointments, or when you need a few hours away.",
      image: babysittingImage,
      link: "/book/babysitting",
      buttonText: "Book Now"
    },
    {
      title: "Emergency Care",
      description: "Last-minute childcare support when unexpected situations arise.",
      image: emergencyCareImage,
      link: "/book/emergency-care",
      buttonText: "Learn More"
    },
    {
      title: "Overnight Care",
      description: "Reliable overnight supervision for work trips, special events, or emergencies.",
      image: overnightCareImage,
      link: "/book/overnight",
      buttonText: "Book Now"
    },
    {
      title: "Holiday Care",
      description: "Childcare during school holidays with fun activities and educational programs.",
      image: holidayCareImage,
      link: "/book/holiday-care",
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
            <span className="text-gray-900 font-medium">Childcare</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Childcare Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional childcare services providing safe, nurturing, and engaging care for children of all ages when you need it most.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {childcareServices.map((service, index) => (
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
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding the Right Childcare?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our childcare coordinators are here to help you find the perfect care solution that matches your family's unique needs and schedule.
              </p>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200">
                  Get Personalized Childcare Plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}