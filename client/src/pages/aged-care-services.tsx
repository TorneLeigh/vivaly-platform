import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Search,
  CheckCircle,
  Home,
  ArrowRight,
  Car,
  Stethoscope,
  Coffee
} from "lucide-react";
import { Link } from "wouter";
import AIRecommendations from "@/components/ai-recommendations";

export default function AgedCareServices() {
  const [location, setLocation] = useState("");
  const [careType, setCareType] = useState("");

  const serviceTypes = [
    {
      title: "Companion Care",
      description: "Social interaction and emotional support for elderly individuals",
      icon: <Coffee className="h-6 w-6" />,
      features: ["Conversation & activities", "Meal companionship", "Light housekeeping"],
      priceRange: "$30-40/hour"
    },
    {
      title: "Personal Care",
      description: "Assistance with daily activities and personal hygiene",
      icon: <Heart className="h-6 w-6" />,
      features: ["Bathing assistance", "Medication reminders", "Mobility support"],
      priceRange: "$35-50/hour"
    },
    {
      title: "Respite Care",
      description: "Temporary relief for family caregivers",
      icon: <Home className="h-6 w-6" />,
      features: ["Short-term care", "Overnight stays", "Weekend support"],
      priceRange: "$40-60/hour"
    },
    {
      title: "Transport & Errands",
      description: "Safe transport to appointments and assistance with errands",
      icon: <Car className="h-6 w-6" />,
      features: ["Medical appointments", "Shopping assistance", "Social outings"],
      priceRange: "$35-45/hour"
    }
  ];

  const verificationFeatures = [
    { icon: <Shield className="h-5 w-5" />, text: "Police background checks completed" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Aged care experience verified" },
    { icon: <Star className="h-5 w-5" />, text: "References from other families" },
    { icon: <Stethoscope className="h-5 w-5" />, text: "First aid and dementia care trained" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Aged Care Support
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Compassionate, verified carers to support the elderly with companionship, transport, 
              daily tasks, and more — in the comfort of their own home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Input
                placeholder="Enter your location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Search className="h-4 w-4 mr-2" />
                Find Aged Carers
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
              Types of Aged Care Support
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Dignified, person-centered care tailored to individual needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-600">
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
            <Shield className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted & Experienced Aged Care Professionals
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every aged care provider on VIVALY is thoroughly vetted with specialized training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 text-purple-600">
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

      {/* Care Features */}
      <div className="bg-purple-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose VIVALY for Aged Care?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Compassionate Care</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our carers are selected for their empathy, patience, and genuine care for elderly individuals
              </p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                From hourly visits to overnight care, we accommodate varying needs and schedules
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Family Communication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Regular updates and open communication with family members for peace of mind
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
              Get Personalized Aged Care Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Let our AI assistant help you find the perfect aged care solution
            </p>
          </div>
          <AIRecommendations />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-purple-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Aged Care Booking Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Assess Needs", desc: "Discuss care requirements and preferences with our team" },
              { step: "2", title: "Match Carers", desc: "We match you with suitable carers based on experience and personality" },
              { step: "3", title: "Meet & Greet", desc: "Arrange a meeting to ensure compatibility before booking" },
              { step: "4", title: "Start Care", desc: "Begin ongoing care with regular check-ins and support" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Quality Care for Your Loved Ones</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join families across Australia who trust VIVALY for compassionate aged care support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Browse Aged Carers
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
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
            <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 sm:mb-0">
              ← Back to All Services
            </Link>
            <div className="flex gap-4">
              <Link href="/child-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Child Care Services →
              </Link>
              <Link href="/pet-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pet Care Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}