import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import doulaImage1 from "@assets/71f27a774a4b4ecaa46e30332bf23131_1749360121452.jpg";
import birthEducationClassImage from "@assets/5c1756efeffe31b87ae42255a1e625b5_1749182535016.jpg";
import motherHoldingBabyImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749182535016.jpg";
import newbornCareImage from "@assets/b1bc54b815bb1f418342a8203ae3e8e3_1749182535016.jpg";
import breastfeedingLatchImage from "@assets/c18480e234907faffa31784936ac8816_1749182897295.jpg";
import doulaImage5 from "@assets/2c4a91a9b547f50bb709e6399c12a2a0_1749360121452.jpg";

export default function PrenatalServices() {
  const prenatalServices = [
    {
      title: "Doula Support",
      description: "Certified doulas to guide you emotionally and physically during pregnancy, labor, and postpartum recovery with personalized care.",
      image: doulaImage1,
      link: "/book/doula",
      buttonText: "Book Now"
    },
    {
      title: "Prenatal Classes",
      description: "Comprehensive birth education classes covering labor preparation, breathing techniques, pain management, and newborn care essentials.",
      image: birthEducationClassImage,
      link: "/book/classes",
      buttonText: "Learn More"
    },
    {
      title: "Infant Care",
      description: "Specialized care for babies aged 0-12 months with certified caregivers trained in infant development, feeding schedules, sleep routines, and safety protocols.",
      image: newbornCareImage,
      link: "/book/infant-care",
      buttonText: "Book Now"
    },
    {
      title: "1-on-1 Care",
      description: "Personalized one-on-one support tailored to your specific needs during pregnancy and postpartum recovery.",
      image: motherHoldingBabyImage,
      link: "/book/one-on-one",
      buttonText: "Book Now"
    },
    {
      title: "New Parent Groups",
      description: "Support groups for new mothers to connect, share experiences, and receive guidance from other parents and professionals.",
      image: doulaImage5,
      link: "/book/parent-groups",
      buttonText: "Join Group"
    },
    {
      title: "Coffee Catch-ups",
      description: "Parent meetups at local cafes to connect with other families and build supportive community relationships.",
      image: doulaImage5,
      link: "/book/coffee-meetups",
      buttonText: "Join Meetup"
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
            <span className="text-gray-900 font-medium">Prenatal Services</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support for Every Stage of Pregnancy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive prenatal and postnatal care services to support you and your growing family throughout your journey.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {prenatalServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
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
            <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Choosing the Right Service?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our care coordinators are here to help you find the perfect prenatal or postnatal support for your unique needs.
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