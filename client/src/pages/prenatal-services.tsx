import { Link } from 'wouter';
import { Heart, Baby, BookOpen, Stethoscope, ChevronRight, Home } from 'lucide-react';

export default function PrenatalServices() {
  const prenatalServices = [
    {
      title: "Doula Support",
      description: "Certified doulas to guide you emotionally and physically during pregnancy and labor.",
      icon: <Heart className="w-12 h-12 text-pink-500" />,
      link: "/book/doula",
      buttonText: "Book Now"
    },
    {
      title: "Prenatal Classes",
      description: "Join small group or one-on-one prenatal education sessions tailored to your needs.",
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      link: "/book/classes",
      buttonText: "Learn More"
    },
    {
      title: "Midwife Services",
      description: "Professional midwifery care from prenatal to postnatal support with personalized attention.",
      icon: <Stethoscope className="w-12 h-12 text-green-500" />,
      link: "/book/midwife",
      buttonText: "Book Now"
    },
    {
      title: "Newborn Care",
      description: "Expert guidance on sleep, feeding, swaddling and bonding with your newborn.",
      icon: <Baby className="w-12 h-12 text-purple-500" />,
      link: "/book/newborn-care",
      buttonText: "Learn More"
    },
    {
      title: "Lactation Support",
      description: "Comprehensive breastfeeding support and lactation consultation from certified specialists.",
      icon: <Heart className="w-12 h-12 text-rose-500" />,
      link: "/book/lactation",
      buttonText: "Book Now"
    },
    {
      title: "Postpartum Care",
      description: "Recovery support and guidance through the fourth trimester with experienced caregivers.",
      icon: <Baby className="w-12 h-12 text-indigo-500" />,
      link: "/book/postpartum",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prenatalServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
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