import { Link } from 'wouter';
import doulaImage1 from "@assets/71f27a774a4b4ecaa46e30332bf23131_1749360121452.jpg";
import birthEducationClassImage from "@assets/5c1756efeffe31b87ae42255a1e625b5_1749182535016.jpg";
import motherHoldingBabyImage from "@assets/e3806ba7e7119fb379b95ce4d570e105_1749182535016.jpg";
import newbornCareImage from "@assets/b1bc54b815bb1f418342a8203ae3e8e3_1749182535016.jpg";
import breastfeedingLatchImage from "@assets/c18480e234907faffa31784936ac8816_1749182897295.jpg";
import doulaImage5 from "@assets/2c4a91a9b547f50bb709e6399c12a2a0_1749360121452.jpg";

export default function PrenatalServices() {
  const prenatalServices = [
    {
      title: "Birth Doula Support",
      description: "Experienced doulas providing continuous emotional, physical, and informational support throughout labor and delivery.",
      image: doulaImage1,
      link: "/book/doula",
      buttonText: "Book Now"
    },
    {
      title: "Prenatal Education",
      description: "Comprehensive childbirth education classes covering breathing techniques, pain management, and what to expect during labor.",
      image: birthEducationClassImage,
      link: "/book/education",
      buttonText: "Learn More"
    },
    {
      title: "Pregnancy Support",
      description: "Personalized prenatal care assistance including appointment accompaniment, meal preparation, and emotional support.",
      image: motherHoldingBabyImage,
      link: "/book/pregnancy-support",
      buttonText: "Get Support"
    },
    {
      title: "Newborn Care",
      description: "Expert newborn care assistance helping new parents with feeding, sleeping schedules, and early childcare routines.",
      image: newbornCareImage,
      link: "/book/newborn",
      buttonText: "Book Now"
    },
    {
      title: "Breastfeeding Support",
      description: "Certified lactation consultants providing guidance on proper latch, positioning, and troubleshooting feeding challenges.",
      image: breastfeedingLatchImage,
      link: "/book/lactation",
      buttonText: "Get Help"
    },
    {
      title: "Postpartum Doula",
      description: "Specialized postpartum support including recovery assistance, newborn care education, and family adjustment guidance.",
      image: doulaImage5,
      link: "/book/postpartum",
      buttonText: "Learn More"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="breadcrumb py-4 px-8 text-sm text-gray-600 bg-gray-50">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium">Prenatal Services</span>
      </section>

      <section className="services-wrapper py-12 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Support for Every Stage of Pregnancy
        </h2>
        
        <div className="services-grid grid gap-8 max-w-5xl mx-auto" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {prenatalServices.map((service, index) => (
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