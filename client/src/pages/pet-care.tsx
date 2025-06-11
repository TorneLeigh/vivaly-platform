import { Link } from 'wouter';
import petSittingImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import dogWalkingImage from "@assets/540c7ede798b410d249591160f8b4b9f.jpg";
import petGroomingImage from "@assets/5204c0c48d0dc2e1af450973bc115d18.jpg";
import overnightPetCareImage from "@assets/51eb7e79d90e3a22f5628012c3866e10.jpg";
import holidayPetCareImage from "@assets/8a24c5a3f190ad6dab3bdec778071075.jpg";
import petTrainingImage from "@assets/58268e04ad7e7126279d8950565a0cd6.jpg";

export default function PetCare() {
  const petCareServices = [
    {
      title: "Pet Sitting",
      description: "Loving in-home pet sitting services providing companionship, feeding, and care while you're away from home.",
      image: petSittingImage,
      link: "/book/pet-sitting",
      buttonText: "Book Now"
    },
    {
      title: "Dog Walking",
      description: "Regular dog walking services ensuring your furry friends get the exercise and outdoor time they need daily.",
      image: dogWalkingImage,
      link: "/book/dog-walking",
      buttonText: "Schedule Walks"
    },
    {
      title: "Pet Grooming",
      description: "Professional pet grooming services including bathing, brushing, nail trimming, and styling for all breeds.",
      image: petGroomingImage,
      link: "/book/grooming",
      buttonText: "Book Grooming"
    },
    {
      title: "Overnight Pet Care",
      description: "Trusted overnight pet care for extended trips, ensuring your pets receive constant attention and companionship.",
      image: overnightPetCareImage,
      link: "/book/overnight-pet",
      buttonText: "Learn More"
    },
    {
      title: "Holiday Pet Care",
      description: "Specialized holiday pet care services for vacation periods, maintaining routines and providing extra attention.",
      image: holidayPetCareImage,
      link: "/book/holiday-pet",
      buttonText: "Book Now"
    },
    {
      title: "Pet Training",
      description: "Professional pet training sessions helping with obedience, behavior modification, and socialization skills.",
      image: petTrainingImage,
      link: "/book/training",
      buttonText: "Start Training"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="breadcrumb py-4 px-8 text-sm text-gray-600 bg-gray-50">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium">Pet Care Services</span>
      </section>

      <section className="services-wrapper py-12 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Loving Care for Your Furry Family
        </h2>
        
        <div className="services-grid grid gap-8 max-w-5xl mx-auto" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {petCareServices.map((service, index) => (
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