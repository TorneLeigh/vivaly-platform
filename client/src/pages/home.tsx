import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AirbnbSearch from "@/components/airbnb-search-new";
import AIRecommendations from "@/components/ai-recommendations";
import { 
  Baby,
  Heart,
  Calendar,
  PawPrint,
  Users,
  Clock,
  Shield,
  Star,
  MapPin,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle,
  Award,
  Phone,
  MessageCircle
} from "lucide-react";

// Import service images
import childcareImage from "@assets/f116334957ff9c74101be0e0c41edcda_1749267005194.jpg";
import elderlyImage from "@assets/c18480e234907faffa31784936ac8816_1749267000694.jpg";
import eventsImage from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618_1749267219539.jpg";
import petcareImage from "@assets/969c7a3eeacf469a3a4c50a32a9b3d57.jpg";
import doulaImage from "@assets/72a1a9c0773aeb45b624a5e05e355eb0_1749359311276.jpg";
import overnightImage from "@assets/02a899c095b5a44d96492e700bf8fd0c_1749275818681.jpg";

const mainServices = [
  {
    id: 'childcare',
    title: 'Childcare',
    description: 'Professional childcare including nannies, babysitters, and doula services',
    image: childcareImage,
    icon: Baby,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    services: [
      'Live-in Nannies',
      'Part-time Babysitters', 
      'Newborn Care Specialists',
      'Birth Doulas',
      'Postpartum Doulas',
      'Night Nannies'
    ],
    route: '/search?category=childcare'
  },
  {
    id: 'elderly',
    title: 'Elderly Care',
    description: 'Compassionate aged care and companion services for seniors',
    image: elderlyImage,
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    services: [
      'Personal Care Assistants',
      'Companion Care',
      'Meal Preparation',
      'Medication Reminders',
      'Transportation',
      'Respite Care'
    ],
    route: '/search?category=elderly'
  },
  {
    id: 'events',
    title: 'Events & Social',
    description: 'Special event childcare and social occasion support',
    image: eventsImage,
    icon: Calendar,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    services: [
      'Wedding Childcare',
      'Party Babysitting',
      'Corporate Events',
      'Holiday Care',
      'Special Occasions',
      'Group Activities'
    ],
    route: '/search?category=events'
  },
  {
    id: 'petcare',
    title: 'Pet Care',
    description: 'Trusted pet sitting and dog walking services',
    image: petcareImage,
    icon: PawPrint,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    services: [
      'Pet Sitting',
      'Dog Walking',
      'Overnight Pet Care',
      'Pet Transportation',
      'Grooming Assistance',
      'Pet Taxi Services'
    ],
    route: '/search?category=pets'
  }
];

const features = [
  {
    icon: Shield,
    title: 'Verified Caregivers',
    description: 'All caregivers undergo comprehensive background checks and verification'
  },
  {
    icon: Star,
    title: 'Quality Assured',
    description: 'Rated and reviewed by families across Australia'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support and emergency assistance'
  },
  {
    icon: Award,
    title: 'Premium Service',
    description: 'Australia\'s most trusted care marketplace since 2024'
  }
];

const stats = [
  { number: '50,000+', label: 'Families Served' },
  { number: '10,000+', label: 'Verified Caregivers' },
  { number: '500,000+', label: 'Hours of Care' },
  { number: '4.9★', label: 'Average Rating' }
];

export default function Home() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Australia's Most Trusted
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Care Marketplace
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with verified caregivers for childcare, elderly care, events, and pet services. 
              Safe, reliable, and available when you need it most.
            </p>
            
            {/* Quick Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <AirbnbSearch />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional, verified caregivers for every stage of life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-10`} />
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 rounded-full bg-white shadow-lg`}>
                      <service.icon className={`h-6 w-6 text-blue-600`} />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.services.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <Link href={service.route}>
                    <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                      Find {service.title} Providers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                AI-Powered Care Matching
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized care recommendations powered by ChatGPT
            </p>
          </div>
          
          <AIRecommendations />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VIVALY?
            </h2>
            <p className="text-xl text-gray-600">
              The most comprehensive care platform in Australia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Caregiver?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Australian families who trust VIVALY for their care needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                <Search className="h-5 w-5 mr-2" />
                Find Care Now
              </Button>
            </Link>
            <Link href="/become-caregiver">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                <Users className="h-5 w-5 mr-2" />
                Become a Caregiver
              </Button>
            </Link>
            <Link href="/ai-chat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with AI
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>1800 VIVALY</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Bar */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Phone className="h-4 w-4" />
            <span className="font-semibold">Emergency Care Hotline: 1800 CARE NOW</span>
            <span>•</span>
            <span>Available 24/7 for urgent care needs</span>
          </div>
        </div>
      </div>
    </div>
  );
}