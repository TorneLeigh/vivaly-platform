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
  Clock,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";

export default function BecomeCaregiver() {
  return (
    <div className="min-h-screen bg-white">
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
            
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 text-coral" />
              Created by a Mom, for caring communities
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Set Your Own Rates</h3>
                <p className="text-gray-600 text-sm">
                  Control your earning potential with flexible hourly rates, overnight fees, and package deals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-gray-600 text-sm">
                  Choose your availability and work when it suits your lifestyle
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                <p className="text-gray-600 text-sm">
                  Background checks, verification, and secure payment processing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caregiver Tools */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All the tools you need to be a caregiver, all in one place.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Create your profile in just a few steps
                </h3>
                <p className="text-gray-600">
                  Go at your own pace and make changes whenever
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your calendar and messages
                </h3>
                <p className="text-gray-600">
                  Manage bookings and communicate with families easily
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-coral" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get 1:1 support from experienced hosts at any time
                </h3>
                <p className="text-gray-600">
                  Quickly message guests and get support when you need it
                </p>
              </div>
            </div>
          </div>

          {/* Registration Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Choose Your Registration Path</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Select the option that best describes how you'd like to provide care services
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Individual Caregiver */}
              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                      <Heart className="w-10 h-10 text-coral" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Individual Caregiver
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Provide direct, personal care services. Perfect for babysitters, 
                      nannies, aged care assistants, pet sitters, and support workers 
                      offering one-on-one care.
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-8">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>Child care, pet care, aged care support</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Personal, in-home services</span>
                      </div>
                    </div>

                    <Link href="/enhanced-caregiver-registration">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white py-3">
                        Register as Individual Caregiver
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Service Provider */}
              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                      <Users className="w-10 h-10 text-gray-700" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Service Provider
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Offer structured programs and services. Ideal for daycare centers, 
                      learning programs, activity classes, training workshops, and 
                      organized care services.
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-8">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Classes, programs, workshops</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Daycare centers, group services</span>
                      </div>
                    </div>

                    <Link href="/service-provider-registration">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white py-3">
                        Register as Service Provider
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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