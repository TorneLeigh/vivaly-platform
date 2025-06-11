import { Link } from 'wouter';
import { Heart, Baby, Moon, Users, BookOpen, Stethoscope } from 'lucide-react';

export default function PrenatalServices() {
  const birthEducationServices = [
    {
      title: "Newborn Care",
      description: "Sleep guidance, swaddling & feeding techniques",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Overnight Newborn Support",
      description: "Night doulas for the fourth trimester - help during those crucial early weeks",
      icon: <Moon className="w-6 h-6" />
    },
    {
      title: "Drop-in Care",
      description: "Flexible childcare when you need it - gym visits, appointments, errands",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Labor Support",
      description: "Comfort techniques and birth preparation",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Birth Coaching",
      description: "Personalized birthing guidance and support",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Breastfeeding Latch",
      description: "Proper breastfeeding techniques and positioning",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Newborn Bonding",
      description: "Building connection with your newborn",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Breastfeeding Support",
      description: "Comprehensive lactation consultation",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Birth Ball Techniques",
      description: "Exercise and comfort during pregnancy",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Pregnancy Massage",
      description: "Prenatal massage and wellness support",
      icon: <Heart className="w-6 h-6" />
    }
  ];

  const doulaServices = [
    {
      title: "Birth Doula Support",
      description: "Continuous labor and delivery support",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Postpartum Doula Care",
      description: "Recovery and newborn adjustment support",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Emotional Support",
      description: "Mental health and emotional guidance",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Breastfeeding Guidance",
      description: "Lactation support and positioning help",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Birth Plan Preparation",
      description: "Creating your personalized birth plan",
      icon: <BookOpen className="w-6 h-6" />
    }
  ];

  const midwifeServices = [
    {
      title: "Postnatal Care",
      description: "Recovery and newborn support",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Newborn Care",
      description: "Specialized care for newborns",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Breastfeeding Support",
      description: "Expert lactation consultation",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Birth Education",
      description: "Comprehensive birth preparation classes",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Parenting Classes",
      description: "Baby care and parenting education",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Sleep Support",
      description: "Newborn sleep guidance and support",
      icon: <Moon className="w-6 h-6" />
    }
  ];

  const ServiceCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-pink-600 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pre & Post Natal Services
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive support for your pregnancy journey and early parenthood. From birth preparation to postpartum care, our experienced professionals are here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Birth Education Classes Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Birth Education Classes</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prepare for your birth journey with comprehensive education and hands-on support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {birthEducationServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>

      {/* Doula Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Doula Services</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive birth and postpartum doula support for your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doulaServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>

      {/* Midwife Services Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Stethoscope className="w-8 h-8 text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Midwife Services</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional midwifery care from prenatal to postnatal support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {midwifeServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-pink-100 text-lg mb-8">
            Connect with experienced professionals who understand your unique needs and provide personalized care every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors no-underline"
            >
              Find Care Providers
            </Link>
            <Link 
              href="/how-it-works" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors no-underline"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}