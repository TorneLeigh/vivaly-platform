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
      title: "Infant Care",
      description: "Professional caregivers providing attentive and nurturing care for your infants.",
      icon: <Baby className="h-15 w-15" />,
      ctaText: "Book Now",
      ctaLink: "/book/infant-care"
    },
    {
      title: "Toddler Programs",
      description: "Engaging activities designed to support the development of toddlers in a safe environment.",
      icon: <Users className="h-15 w-15" />,
      ctaText: "Learn More",
      ctaLink: "/book/toddler-programs"
    },
    {
      title: "Preschool Education",
      description: "Structured learning experiences to prepare preschoolers for their educational journey.",
      icon: <BookOpen className="h-15 w-15" />,
      ctaText: "Enroll Now",
      ctaLink: "/book/preschool-education"
    }
  ];

  const verificationFeatures = [
    { icon: <Shield className="h-5 w-5" />, text: "Working with Children Check verified" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Police background checks completed" },
    { icon: <Star className="h-5 w-5" />, text: "References from other families" },
    { icon: <Users className="h-5 w-5" />, text: "First aid and CPR certified" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span>Child Care Services</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-normal text-gray-900 dark:text-white mb-8">
              Reliable and Caring Child Care Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-200 shadow-sm hover:shadow-lg">
                <CardContent className="text-center p-0">
                  <div className="w-15 h-15 mx-auto mb-4 text-gray-900 dark:text-white">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href={service.ctaLink}>
                    <Button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-200">
                      {service.ctaText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}