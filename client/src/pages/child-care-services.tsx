import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { ChildCareIcon, NannyIcon, BabysittingIcon } from '../components/ServiceIcons';
import OptimizedImage from '../components/OptimizedImage';
import infantCareImage from "@assets/5204c0c48d0dc2e1af450973bc115d18_1749703983977.jpg";
import toddlerProgramImage from "@assets/988a042ea7f506d78efe22b6305455a5_1749703983977.jpg";
import preschoolEducationImage from "@assets/540c7ede798b410d249591160f8b4b9f_1749703983977.jpg";
import afterSchoolCareImage from "@assets/20fcca984f823e55d0f52349c0cccfeb_1749703983977.jpg";
import babysittingImage from "@assets/774b96f629bd098da386885d9025876d_1749703983977.jpg";
import nannyCareImage from "@assets/a4f0736b1ec779769d49614140142c82_1749703983977.jpg";

export default function ChildCareServices() {
  const childCareServices = [
    {
      title: "1-on-1 Care",
      description: "Personalized one-on-one childcare with dedicated attention tailored to your child's specific needs and development stage.",
      image: toddlerProgramImage,
      link: "/book/one-on-one-care",
      buttonText: "Book Now",
      features: ["Individual attention", "Customized activities", "Flexible scheduling", "Developmental focus", "Parent communication"]
    },
    {
      title: "1-2 Hour Group Care", 
      description: "Short-term group childcare sessions perfect for quick errands, appointments, or brief social interactions with other children.",
      image: nannyCareImage,
      link: "/book/group-care",
      buttonText: "Book Now",
      features: ["Flexible timing", "Social interaction", "Supervised play", "Age-appropriate groups", "Convenient booking"]
    },
    {
      title: "Drop and Dash",
      description: "Quick drop-off childcare service for busy parents who need immediate, reliable care for short periods.",
      image: preschoolEducationImage,
      link: "/book/drop-dash",
      buttonText: "Quick Book",
      features: ["Immediate availability", "No advance booking", "Safe environment", "Trained staff", "Flexible duration"]
    },
    {
      title: "Park Playdates",
      description: "Meet other families at local parks while children enjoy supervised outdoor activities and social interaction.",
      image: afterSchoolCareImage,
      link: "/book/park-playdates",
      buttonText: "Join Playdate",
      features: ["Outdoor activities", "Family connections", "Fresh air & exercise", "Social skills", "Community building"]
    },
    {
      title: "Art & Craft Sessions",
      description: "Creative sessions for kids and parents to explore artistic expression, develop fine motor skills, and bond through shared activities.",
      image: babysittingImage,
      link: "/book/art-craft",
      buttonText: "Join Session",
      features: ["Creative expression", "Parent-child bonding", "Skill development", "All materials provided", "Age-appropriate projects"]
    },
    {
      title: "Coffee Catch-ups",
      description: "Parent meetups at local cafes where children can play while parents connect and build supportive community relationships.",
      image: infantCareImage,
      link: "/book/coffee-meetups",
      buttonText: "Join Meetup",
      features: ["Parent networking", "Child-friendly venues", "Community support", "Regular meetups", "Relaxed atmosphere"]
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
            <span className="text-gray-900 font-medium">Child Care Services</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reliable and Caring Child Care Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional caregivers providing safe, nurturing, and educational experiences for children of all ages.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {childCareServices.map((service, index) => (
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding the Right Care?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our care coordinators are here to help you find the perfect childcare solution for your family's unique needs.
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