import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dog, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Search,
  CheckCircle,
  Heart,
  Home,
  ArrowRight,
  Car,
  Camera
} from "lucide-react";
import { Link } from "wouter";
import AIRecommendations from "@/components/ai-recommendations";

export default function PetCareServices() {
  const [location, setLocation] = useState("");
  const [petType, setPetType] = useState("");

  const serviceTypes = [
    {
      title: "Dog Walking",
      description: "Regular walks to keep your dog healthy and happy",
      icon: <Dog className="h-6 w-6" />,
      features: ["30-60 minute walks", "GPS tracking", "Photo updates"],
      priceRange: "$20-30/walk"
    },
    {
      title: "Pet Sitting",
      description: "In-home care while you're away for extended periods",
      icon: <Home className="h-6 w-6" />,
      features: ["Overnight stays", "Feeding & medication", "Companionship"],
      priceRange: "$45-65/night"
    },
    {
      title: "Drop-in Visits",
      description: "Quick check-ins for feeding, letting out, and care",
      icon: <Clock className="h-6 w-6" />,
      features: ["15-30 minute visits", "Feeding assistance", "Basic care"],
      priceRange: "$15-25/visit"
    },
    {
      title: "Pet Transport",
      description: "Safe transport to vet appointments or grooming",
      icon: <Car className="h-6 w-6" />,
      features: ["Vet appointments", "Grooming trips", "Secure transport"],
      priceRange: "$25-40/trip"
    }
  ];

  const verificationFeatures = [
    { icon: <Shield className="h-5 w-5" />, text: "Police background checks completed" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Pet care experience verified" },
    { icon: <Star className="h-5 w-5" />, text: "References from other pet owners" },
    { icon: <Heart className="h-5 w-5" />, text: "Animal first aid trained" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Dog className="h-16 w-16 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pet Care Services
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Whether you're looking for a dog walker, pet sitter, or someone to check in on your furry friend, 
              VIVALY connects you with trusted, local animal lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Input
                placeholder="Enter your location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Search className="h-4 w-4 mr-2" />
                Find Pet Carers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Types */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Types of Pet Care
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find the perfect care solution for your beloved pets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-600">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    {service.priceRange}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Safety & Verification */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted & Verified Pet Lovers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every pet carer on VIVALY is thoroughly vetted and passionate about animal care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 text-green-600">
                  {feature.icon}
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pet Care Features */}
      <div className="bg-green-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose VIVALY for Pet Care?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Photo Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive photos and updates throughout your pet's care session for peace of mind
              </p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">GPS Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track walks in real-time and see exactly where your dog has been
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Animal Lovers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our carers are genuine animal enthusiasts who treat your pets like family
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get Personalized Pet Care Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Let our AI assistant help you find the perfect pet care solution
            </p>
          </div>
          <AIRecommendations />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-green-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Pet Care Booking Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Search & Filter", desc: "Enter your location and pet type to find suitable carers" },
              { step: "2", title: "Browse Profiles", desc: "View detailed profiles, reviews, and pet experience" },
              { step: "3", title: "Book Securely", desc: "Choose services, confirm details, and pay securely" },
              { step: "4", title: "Track & Review", desc: "Get updates during care and leave a review afterward" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                {index < 3 && <ArrowRight className="h-5 w-5 text-gray-400 mx-auto mt-4 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Your Pet Deserves the Best Care</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of pet owners who trust VIVALY for reliable, loving pet care
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Browse Pet Carers
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/ai-chat" className="flex items-center">
                Get AI Recommendations
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Link href="/" className="text-green-600 hover:text-green-700 mb-4 sm:mb-0">
              ← Back to All Services
            </Link>
            <div className="flex gap-4">
              <Link href="/child-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Child Care Services →
              </Link>
              <Link href="/aged-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Aged Care Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}