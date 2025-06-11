import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Baby, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Search,
  CheckCircle,
  Heart,
  BookOpen,
  Home,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import AIRecommendations from "@/components/ai-recommendations";

export default function ChildCareServices() {
  const [location, setLocation] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  const serviceTypes = [
    {
      title: "Babysitting",
      description: "Casual care for date nights, events, or short-term needs",
      icon: <Baby className="h-6 w-6" />,
      features: ["Flexible hours", "Evening care", "Emergency availability"],
      priceRange: "$25-35/hour"
    },
    {
      title: "Nanny Services",
      description: "Regular, ongoing care in your home environment",
      icon: <Home className="h-6 w-6" />,
      features: ["Full-time or part-time", "Educational activities", "Meal preparation"],
      priceRange: "$28-45/hour"
    },
    {
      title: "After School Care",
      description: "Structured care and activities after school hours",
      icon: <BookOpen className="h-6 w-6" />,
      features: ["Homework help", "Activity supervision", "Transport assistance"],
      priceRange: "$30-40/hour"
    },
    {
      title: "Newborn Care",
      description: "Specialized care for infants and new parents",
      icon: <Heart className="h-6 w-6" />,
      features: ["Night care", "Feeding support", "New parent guidance"],
      priceRange: "$35-55/hour"
    }
  ];

  const verificationFeatures = [
    { icon: <Shield className="h-5 w-5" />, text: "Working with Children Check verified" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Police background checks completed" },
    { icon: <Star className="h-5 w-5" />, text: "References from other families" },
    { icon: <Users className="h-5 w-5" />, text: "First aid and CPR certified" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Baby className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Child Care Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find experienced babysitters, nannies, and after-school carers in your area. 
              All carers are WWCC verified and reviewed by other parents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Input
                placeholder="Enter your location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Search className="h-4 w-4 mr-2" />
                Find Carers
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
              Types of Child Care
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the care option that best fits your family's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
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
              Your Child's Safety is Our Priority
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every carer on VIVALY undergoes comprehensive background checks and verification
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

      {/* AI Recommendations */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get Personalized Care Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Let our AI assistant help you find the perfect childcare solution
            </p>
          </div>
          <AIRecommendations />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Child Care Booking Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Search & Filter", desc: "Enter your location and child's age to find suitable carers" },
              { step: "2", title: "Browse Profiles", desc: "View detailed profiles, reviews, and availability" },
              { step: "3", title: "Book Securely", desc: "Choose dates, confirm details, and pay securely through VIVALY" },
              { step: "4", title: "Leave Review", desc: "Rate your experience to help other families" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Carer?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families who trust VIVALY for their childcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Browse Carers
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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
            <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 sm:mb-0">
              ← Back to All Services
            </Link>
            <div className="flex gap-4">
              <Link href="/pet-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pet Care Services →
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