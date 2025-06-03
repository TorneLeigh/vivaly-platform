import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import NannyCard from "@/components/nanny-card";
import SearchFilters from "@/components/search-filters";
import { 
  User, 
  Users, 
  Puzzle, 
  Clock, 
  Heart,
  Shield,
  IdCard,
  MessageCircle,
  ShieldCheck,
  Plus,
  Search,
  Sun,
  Coffee,
  TreePine,
  Palette,
  Music,
  BookOpen,
  Utensils,
  Baby,
  Dog,
  PawPrint
} from "lucide-react";
import type { Nanny, User as UserType } from "@shared/schema";
import familyImage1 from "@assets/a320779cd5ae5ce8e8ecf846003d8ff9.jpg";
import familyImage2 from "@assets/aba916b517ced96c85496925fb8b71d5.jpg";
import familyImage3 from "@assets/2df543a46e343b349dce96a9b74e7bf3.jpg";
import familyImage4 from "@assets/20fcca984f823e55d0f52349c0cccfeb.jpg";
import familyImage5 from "@assets/9c49b20a043b475fc92f416a52da3a32.jpg";
import familyImage6 from "@assets/988a042ea7f506d78efe22b6305455a5.jpg";
import familyImage7 from "@assets/d2c9077f10c1c428951da90b33e957a5.jpg";
import familyImage8 from "@assets/f704b593bd69474039d82dca97cc06fd.jpg";
import familyImage9 from "@assets/a4f0736b1ec779769d49614140142c82.jpg";
import familyImage10 from "@assets/f2918dba9993260327d6b33966a5b786.jpg";
import familyImage11 from "@assets/e84b82177ddf914b2846c3f2490fa10a.jpg";
import familyImage12 from "@assets/f10beba35ec5214939f1d06bcfd05903.jpg";
import familyImage13 from "@assets/f3c4f3cbd16d170cf3b4abab28ecfa25.jpg";
import familyImage14 from "@assets/51eb7e79d90e3a22f5628012c3866e10.jpg";
import familyImage15 from "@assets/ffa2aa122968ee48921e5c120e550899.jpg";
import familyImage16 from "@assets/da9a8502c75f58f7f36a01b9e533d46d.jpg";
import familyImage17 from "@assets/5c49767488148ac28757a08c6753fd68.jpg";
import familyImage18 from "@assets/ad23d9f10c69e3bfc73ffe82a1bac618.jpg";
import familyImage19 from "@assets/de1126eedd477730852d8c5558d5228f.jpg";
import familyImage20 from "@assets/5204c0c48d0dc2e1af450973bc115d18.jpg";
import familyImage21 from "@assets/b627296d6422d36b84161b43496d3c54.jpg";
import familyImage22 from "@assets/793a2a82f337ec12518b35b4b0886681.jpg";
import familyImage23 from "@assets/62ef39ef76f7405a227796a6b8ad607d.jpg";
import familyImage24 from "@assets/46c0702d1b48d35f894a0fe16f437b43.jpg";
import familyImage25 from "@assets/0322f50abf3a7fc6d8def12b41336e6a.jpg";
import familyImage26 from "@assets/c5e4a7514e214eb119a5a0d459aa6bdf.jpg";
import familyImage27 from "@assets/0c25205c3003fd2bf70fa884ad5fe1f5.jpg";
import familyImage28 from "@assets/540c7ede798b410d249591160f8b4b9f.jpg";
import familyImage29 from "@assets/58268e04ad7e7126279d8950565a0cd6.jpg";
import companionshipImage from "@assets/7111567ee33e7fbd156e36bd454e1ed4.jpg";

const serviceCategories = [
  {
    title: "1-on-1 Care",
    description: "Personal attention",
    image: familyImage19, // Mother reading to baby
    serviceType: "1-on-1 Care"
  },
  {
    title: "Group Care", 
    description: "Small groups",
    image: familyImage17, // Two children playing with blocks
    serviceType: "Group Care"
  },
  {
    title: "Midwife Services",
    description: "Birth & postnatal support", 
    image: familyImage20, // Mother playing blocks with child
    serviceType: "Midwife Services"
  },
  {
    title: "Drop & Dash",
    description: "Quick care",
    image: familyImage22, // Child playing with wooden toys
    serviceType: "Drop & Dash"
  },
  {
    title: "Postpartum",
    description: "New parent support",
    image: familyImage16, // Girl caring for baby doll
    serviceType: "Postpartum Support"
  },
  {
    title: "Breastfeeding",
    description: "Lactation support",
    image: familyImage27, // Colorful wooden stacking toy
    serviceType: "Breastfeeding Support"
  },
  {
    title: "Birth Education",
    description: "Preparation classes",
    image: familyImage26, // Children building blocks together
    serviceType: "Birth Education"
  },
  {
    title: "Elderly Care",
    description: "Senior assistance",
    image: familyImage11, // Elderly exercise group
    serviceType: "Elderly Care"
  },
  {
    title: "Companionship",
    description: "Social visits",
    image: companionshipImage, // Hands showing care and support
    serviceType: "Elderly Companionship"
  }
];

const popularActivities = [
  {
    title: "Park Playdates",
    description: "Meet other families at local parks",
    image: familyImage18, // Happy toddler with shape toys
    serviceType: "Park Playdates"
  },
  {
    title: "Beach Days", 
    description: "Family beach outings and activities",
    image: familyImage13, // Children playing at beach
    serviceType: "Beach Days"
  },
  {
    title: "Coffee Catch-ups",
    description: "Parent meetups at local cafes", 
    image: familyImage29, // Three mothers with babies at cafe
    serviceType: "Coffee Catch-ups"
  },
  {
    title: "Nature Walks",
    description: "Explore trails with other families",
    image: familyImage28, // Children exploring nature outdoors
    serviceType: "Nature Walks"
  },
  {
    title: "Art & Craft",
    description: "Creative sessions for kids and parents",
    image: familyImage23, // Child hands playing with letters
    serviceType: "Art & Craft"
  },
  {
    title: "Picnic Gatherings",
    description: "Family picnics and shared meals",
    image: familyImage24, // Two children playing with wooden letters
    serviceType: "Picnic Gatherings"
  }
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Background Checks",
    description: "Every caregiver undergoes thorough background verification",
    bgColor: "bg-soft-green bg-opacity-10",
    iconColor: "text-soft-green"
  },
  {
    icon: ShieldCheck,
    title: "Certified",
    description: "All providers are certified professionals",
    bgColor: "bg-trust-blue bg-opacity-10",
    iconColor: "text-trust-blue"
  },
  {
    icon: IdCard,
    title: "Identity Verified",
    description: "Profile photos and IDs are verified",
    bgColor: "bg-coral bg-opacity-10",
    iconColor: "text-coral"
  }
];

export default function Home() {
  const { data: featuredNannies, isLoading } = useQuery({
    queryKey: ["/api/nannies/featured"],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Find care you can trust
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Book trusted caregivers in your neighborhood for all your family needs.
              </p>
              
              <div className="space-y-4 mb-8">
                <SearchFilters onSearch={(filters) => {
                  const searchParams = new URLSearchParams(filters);
                  window.location.href = `/search?${searchParams.toString()}`;
                }} />
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">👩‍⚕️</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Professional Care</h3>
                    <p className="text-xs text-gray-600">Qualified caregivers</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🏠</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">In Your Home</h3>
                    <p className="text-xs text-gray-600">Comfort & convenience</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Verified Safe</h3>
                    <p className="text-xs text-gray-600">Background checked</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Highly Rated</h3>
                    <p className="text-xs text-gray-600">Trusted by families</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by service type
            </h2>
            <p className="text-xl text-gray-600">
              Whatever you need, we have trusted caregivers ready to help
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {serviceCategories.map((category, index) => {
              return (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: category.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 group-hover:bg-opacity-0"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.title}</h3>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services in Popular Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Events and Social</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with other families through organized activities and social gatherings
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularActivities.map((activity, index) => {
              return (
                <div 
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => {
                    const searchParams = new URLSearchParams({
                      serviceType: activity.serviceType,
                      location: 'Sydney, NSW'
                    });
                    window.location.href = `/search?${searchParams.toString()}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 group-hover:bg-opacity-0"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Nannies */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-warm-gray">Featured caregivers</h2>
            <Link href="/search">
              <Button variant="ghost" className="text-coral hover:text-coral">
                View all
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : featuredNannies && Array.isArray(featuredNannies) && featuredNannies.length > 0 ? (
              featuredNannies.slice(0, 8).map((nanny: Nanny & { user: UserType }) => (
                <NannyCard key={nanny.id} nanny={nanny} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No caregivers available today.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-warm-gray mb-4">Safety and trust first</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every caregiver on CareConnect goes through our comprehensive verification process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 ${feature.bgColor} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-warm-gray mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-coral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect caregiver?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of Sydney families who trust CareConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button className="bg-white text-coral px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Searching
              </Button>
            </Link>
            <Link href="/become-nanny">
              <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-coral transition-all bg-transparent">
                Become a Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}