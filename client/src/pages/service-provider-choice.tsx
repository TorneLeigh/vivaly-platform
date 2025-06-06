import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, ArrowRight, ArrowLeft } from "lucide-react";

export default function ServiceProviderChoice() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Service Type
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the type of childcare service you want to offer on VIVALY
          </p>
        </div>

        {/* Service Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Care Services */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-orange-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Care Services
                </h3>
                <p className="text-gray-600 mb-6 text-left">
                  Offer specialized care services across multiple categories:
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-8">
                  <li>• Baby and childcare services</li>
                  <li>• Elderly care and companionship</li>
                  <li>• Pet care and animal services</li>
                  <li>• In-home and flexible care</li>
                  <li>• Specialized support services</li>
                </ul>
                <Link href="/become-caregiver">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium group">
                    Sign Up for Care Services
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Childcare Center */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-orange-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                  <Building2 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Childcare Center
                </h3>
                <p className="text-gray-600 mb-6 text-left">
                  Ideal for established childcare centers, daycares, and family daycare homes that provide:
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-8">
                  <li>• Licensed childcare facilities</li>
                  <li>• Full-day and part-day programs</li>
                  <li>• Group childcare services</li>
                  <li>• Educational and developmental programs</li>
                  <li>• Multiple children enrollment</li>
                </ul>
                <Link href="/become-childcare-provider">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium group">
                    Sign Up as Childcare Center
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Not sure which option is right for you?
          </p>
          <p className="text-sm text-gray-500">
            You can always change your service type later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}