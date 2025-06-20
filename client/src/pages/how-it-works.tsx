import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  CreditCard, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Home
} from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const bookingSteps = [
    {
      step: "1",
      title: "Search for care",
      description: "Enter your location and choose your care category.",
      details: "Browse through verified carers in your area, filter by availability, experience, and rates.",
      icon: <Search className="h-8 w-8" />,
      color: "blue"
    },
    {
      step: "2", 
      title: "Browse verified carers",
      description: "View profiles, reviews, availability, and rates.",
      details: "Each profile includes photos, experience details, certifications, and reviews from other families.",
      icon: <Users className="h-8 w-8" />,
      color: "green"
    },
    {
      step: "3",
      title: "Book and pay securely",
      description: "Pay through VIVALY's secure system with peace of mind.",
      details: "Choose your dates, confirm details, and pay securely through our encrypted payment system.",
      icon: <CreditCard className="h-8 w-8" />,
      color: "purple"
    },
    {
      step: "4",
      title: "Leave a review",
      description: "After the care is complete, share your experience to help others.",
      details: "Rate your experience and provide feedback to help other families make informed decisions.",
      icon: <Star className="h-8 w-8" />,
      color: "yellow"
    }
  ];

  const safetyFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Background Checks",
      description: "All carers undergo comprehensive police checks and Working with Children Check verification"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Identity Verification",
      description: "Photo ID verification and address confirmation for all registered carers"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Reviews & Ratings",
      description: "Transparent review system from verified families who have used their services"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support and emergency assistance when needed"
    }
  ];

  const paymentFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "All transactions are processed through Stripe with bank-level encryption"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Billing",
      description: "Pay per session or set up recurring payments for regular care arrangements"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Protection Coverage",
      description: "Insurance coverage for all bookings through our platform"
    }
  ];

  const getStepColor = (color: string) => {
    const colors = {
      blue: "bg-blue-600",
      green: "bg-green-600", 
      purple: "bg-purple-600",
      yellow: "bg-yellow-600"
    };
    return colors[color as keyof typeof colors] || "bg-blue-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How VIVALY Works
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Finding trusted care has never been easier. Here's how VIVALY connects 
              families with verified, reliable carers in just a few simple steps.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Steps */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Journey to Finding Care
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Four simple steps to connect with the perfect carer for your needs
            </p>
          </div>

          <div className="space-y-12">
            {bookingSteps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
                <div className={`flex-shrink-0 order-1 lg:order-${index % 2 === 0 ? '1' : '2'}`}>
                  <div className={`w-20 h-20 ${getStepColor(step.color)} text-white rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    {step.icon}
                  </div>
                  <div className={`w-12 h-12 ${getStepColor(step.color)} text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold`}>
                    {step.step}
                  </div>
                </div>

                <div className={`flex-1 order-2 lg:order-${index % 2 === 0 ? '2' : '1'} text-center lg:text-${index % 2 === 0 ? 'left' : 'right'}`}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        {step.description}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {step.details}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {index < bookingSteps.length - 1 && (
                  <div className="order-3 lg:hidden">
                    <ArrowRight className="h-8 w-8 text-gray-400 mx-auto transform rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety & Security */}
      <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Safety & Security First
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your family's safety is our top priority. Every aspect of our platform 
              is designed with security and trust in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-700 dark:text-orange-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Payment & Billing */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Secure Payment & Billing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and transparent pricing with multiple payment options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Support Every Step of the Way
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our team is here to help you find the perfect care solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Round-the-clock assistance for any questions or concerns
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get instant recommendations and answers from our AI chat assistant
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Matching</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our team helps match you with carers who fit your specific needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families who have found trusted care through VIVALY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Find Care Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/ai-chat" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
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
              <Home className="h-4 w-4 inline mr-2" />
              Back to Home
            </Link>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/child-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Child Care
              </Link>
              <Link href="/pet-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pet Care
              </Link>
              <Link href="/aged-care-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Aged Care
              </Link>
              <Link href="/faqs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}