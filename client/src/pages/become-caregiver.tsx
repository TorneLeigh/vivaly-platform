import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Shield, 
  DollarSign, 
  Calendar,
  Award,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function BecomeCaregiver() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join VIVALY as a Caregiver
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect with families who need your caring support. Whether you're an experienced professional 
              or just starting your journey in care, VIVALY provides the platform to build meaningful relationships 
              and grow your care career.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4" />
              Created by a Mom, for caring communities
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-orange-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Set Your Own Rates</h3>
                <p className="text-gray-600 text-sm">
                  Control your earning potential with flexible hourly rates, overnight fees, and package deals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-orange-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-gray-600 text-sm">
                  Choose your availability and work when it suits your lifestyle
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-orange-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                <p className="text-gray-600 text-sm">
                  Background checks, verification, and secure payment processing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Offer */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What VIVALY Offers You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Comprehensive Profile</h4>
                      <p className="text-sm text-gray-600">
                        Showcase your experience, certifications, and personal approach to care
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Direct Family Connections</h4>
                      <p className="text-sm text-gray-600">
                        Connect directly with families in your area who need your services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Secure Payments</h4>
                      <p className="text-sm text-gray-600">
                        Get paid safely and on time through our secure payment system
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Professional Support</h4>
                      <p className="text-sm text-gray-600">
                        Access resources, training, and ongoing support for your care career
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Insurance Coverage</h4>
                      <p className="text-sm text-gray-600">
                        Protection and peace of mind while you provide care services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Community Network</h4>
                      <p className="text-sm text-gray-600">
                        Join a supportive community of caregivers sharing experiences and tips
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Care Journey?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of caregivers who are making a difference in families' lives
              </p>
              
              <div className="space-y-4">
                <Link href="/enhanced-caregiver-registration">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-4">
                    Start Your Registration
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-sm opacity-75">
                  Registration takes about 10-15 minutes • Free to join
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Process Preview */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Simple Registration Process</h3>
            
            <div className="grid md:grid-cols-6 gap-4">
              {[
                { icon: Users, title: "Personal Info", desc: "Basic details & location" },
                { icon: Heart, title: "About You", desc: "Your story & approach" },
                { icon: Award, title: "Experience", desc: "Skills & services" },
                { icon: Calendar, title: "Availability", desc: "Schedule & rates" },
                { icon: Globe, title: "Languages", desc: "Transport & travel" },
                { icon: Shield, title: "Verification", desc: "Background checks" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}