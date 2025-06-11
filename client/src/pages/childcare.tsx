import { Link } from 'wouter';
import nannyCareImage from "@assets/31d064b6874d9bd38e6f664bff0e8352_1749267180596.jpg";
import afterSchoolCareImage from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618_1749267219539.jpg";
import babysittingImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import emergencyCareImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749267017855.jpg";
import overnightCareImage from "@assets/9717a7e59d32ac45c39a7f027a3230af_1749182897295.jpg";
import holidayCareImage from "@assets/d81ff6e441430a5c581dc3a72149844e_1749182897295.jpg";

export default function Childcare() {
  const childcareServices = [
    {
      title: "Nanny Services",
      description: "Professional in-home nannies providing personalized, one-on-one care for your children in the comfort of your own home.",
      image: nannyCareImage,
      link: "/book/nanny",
      buttonText: "Book Now"
    },
    {
      title: "After School Care",
      description: "Safe and engaging after-school programs with homework help, activities, and nutritious snacks for school-age children.",
      image: afterSchoolCareImage,
      link: "/book/after-school",
      buttonText: "Learn More"
    },
    {
      title: "Babysitting",
      description: "Reliable occasional babysitting services for date nights, appointments, or whenever you need trusted childcare support.",
      image: babysittingImage,
      link: "/book/babysitting",
      buttonText: "Book Now"
    },
    {
      title: "Emergency Care",
      description: "Last-minute childcare solutions when unexpected situations arise, with vetted caregivers available on short notice.",
      image: emergencyCareImage,
      link: "/book/emergency",
      buttonText: "Get Help"
    },
    {
      title: "Overnight Care",
      description: "Trusted overnight childcare for business trips, special events, or when you need extended care coverage.",
      image: overnightCareImage,
      link: "/book/overnight",
      buttonText: "Book Now"
    },
    {
      title: "Holiday Care",
      description: "Special holiday and school break programs keeping children engaged with fun activities and learning opportunities.",
      image: holidayCareImage,
      link: "/book/holiday",
      buttonText: "Learn More"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="breadcrumb py-4 px-8 text-sm text-gray-600 bg-gray-50">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium">Childcare Services</span>
      </section>

      <section className="services-wrapper py-12 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Nurturing Care for Growing Minds
        </h2>
        
        <div className="services-grid grid gap-8 max-w-5xl mx-auto" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {childcareServices.map((service, index) => (
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