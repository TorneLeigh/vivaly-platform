import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, Users, Calendar, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Signup() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              JOIN VIVALY
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Choose how you'd like to be part of our childcare community
            </p>
          </div>

          {/* Role Selection Boxes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Parent/Seeker Option */}
            <Card className="border-2 border-gray-200 hover:border-coral hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-coral/10 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-coral" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Seeking Help
                </h3>
                <p className="text-gray-600 mb-6">
                  As a parent looking for services
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Find trusted childcare, drop & dash services, and postpartum support for your family
                </p>
                <Link href="/parent-profile-creator">
                  <Button className="w-full bg-coral hover:bg-coral/90 text-white">
                    Get Started as Parent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Caregiver Option */}
            <Card className="border-2 border-gray-200 hover:border-coral hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-black/10 rounded-full flex items-center justify-center">
                  <Heart className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Caregiver
                </h3>
                <p className="text-gray-600 mb-6">
                  Babysitters and nannies offering different types of support
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Provide 1-on-1 childcare, drop & dash services, group care, or postpartum support
                </p>
                <Link href="/caregiver-profile-creator">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Get Started as Caregiver
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>



          {/* Already have account */}
          <div className="text-center">
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
  );
}