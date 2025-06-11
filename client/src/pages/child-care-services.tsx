import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { ChildCareIcon, NannyIcon, BabysittingIcon } from '../components/ServiceIcons';
import OptimizedImage from '../components/OptimizedImage';
import infantCareImage from "@assets/b1bc54b815bb1f418342a8203ae3e8e3_1749182535016.jpg";
import toddlerProgramImage from "@assets/32b2abcfc1fddbe1118ee928059ce66b_1749183011871.jpg";
import preschoolEducationImage from "@assets/5c1756efeffe31b87ae42255a1e625b5_1749182535016.jpg";
import afterSchoolCareImage from "@assets/994aad74ac4664d9bd56815d3fda5f88_1749183011870.jpg";
import babysittingImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749182535016.jpg";
import nannyCareImage from "@assets/f01acbf088d9ff9aa3b69419fa01ff03_1749182535016.jpg";

export default function ChildCareServices() {
  const childCareServices = [
    {
      title: "Infant Care",
      description: "Specialized care for babies aged 0-12 months with certified caregivers trained in infant development, feeding schedules, sleep routines, and safety protocols.",
      image: infantCareImage,
      link: "/book/infant-care",
      buttonText: "Book Now",
      features: ["Bottle feeding & burping", "Diaper changing & hygiene", "Sleep schedule management", "Developmental activities", "Safety monitoring"]
    },
    {
      title: "Toddler Programs", 
      description: "Interactive learning and play programs for children aged 1-3 years, focusing on motor skills, language development, and social interaction in a nurturing environment.",
      image: toddlerProgramImage,
      link: "/book/toddler-programs",
      buttonText: "Learn More",
      features: ["Potty training support", "Language development", "Creative play activities", "Social skills building", "Meal time assistance"]
    },
    {
      title: "Preschool Education",
      description: "Structured early learning programs for ages 3-5 that prepare children for kindergarten through educational activities, social skills, and cognitive development.",
      image: preschoolEducationImage,
      link: "/book/preschool-education",
      buttonText: "Enroll Now",
      features: ["Pre-literacy activities", "Number recognition", "Art & creativity", "Social interaction", "School readiness prep"]
    },
    {
      title: "After School Care",
      description: "Safe, supervised care for school-age children with homework assistance, recreational activities, healthy snacks, and transportation options available.",
      image: afterSchoolCareImage,
      link: "/book/after-school-care",
      buttonText: "Book Now",
      features: ["Homework supervision", "Physical activities", "Healthy snacks", "Transportation", "Educational games"]
    },
    {
      title: "Babysitting Services",
      description: "Flexible, occasional care for date nights, events, or emergencies with background-checked sitters who provide engaging activities and maintain routines.",
      image: babysittingImage,
      link: "/book/babysitting",
      buttonText: "Book Now",
      features: ["Evening & weekend care", "Activity planning", "Bedtime routines", "Emergency protocols", "Photo updates"]
    },
    {
      title: "Nanny Services",
      description: "Long-term, personalized in-home care with dedicated nannies who become part of your family, providing consistent care, educational support, and household assistance.",
      image: nannyCareImage,
      link: "/book/nanny-services",
      buttonText: "Learn More",
      features: ["Full-time or part-time", "Educational activities", "Light housekeeping", "Meal preparation", "Transportation"]
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Link href={service.link}>
                      <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center mx-auto w-full">
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