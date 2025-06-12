import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Heart, BookOpen, Baby } from "lucide-react";

export default function RegistrationTypeSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join the VIVALY Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to contribute to our care marketplace. 
              Whether you're an individual caregiver or provide structured services, 
              we have a place for you.
            </p>
          </div>

          {/* Registration Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Individual Caregiver */}
            <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                    <Heart className="w-10 h-10 text-orange-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Individual Caregiver
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Provide direct, personal care services. Perfect for babysitters, 
                    nannies, aged care assistants, pet sitters, and support workers 
                    offering one-on-one care.
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <Baby className="w-4 h-4" />
                      <span>Child care, pet care, aged care support</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Personal, in-home services</span>
                    </div>
                  </div>

                  <Link href="/caregiver-registration">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
                      Register as Individual Caregiver
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Service Provider */}
            <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                    <BookOpen className="w-10 h-10 text-orange-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Service Provider
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Offer structured programs and services. Ideal for daycare centers, 
                    learning programs, activity classes, training workshops, and 
                    organized care services.
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Classes, programs, workshops</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Daycare centers, group services</span>
                    </div>
                  </div>

                  <Link href="/service-provider-registration">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
                      Register as Service Provider
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-400">
              Not sure which option is right for you? Contact our support team for guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}