import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Calendar, Users } from "lucide-react";
import { Link } from "wouter";

export default function TrialSuccess() {
  useEffect(() => {
    // Track successful signup
    console.log('Trial signup completed');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-800">Welcome to VIVALY!</CardTitle>
          <p className="text-gray-600 text-lg">
            You're now part of Australia's first home-based childcare marketplace
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold">Check Your Email</h4>
                <p className="text-sm text-gray-600">Welcome guide and next steps sent to your inbox</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold">Complete Your Profile</h4>
                <p className="text-sm text-gray-600">Help us match you with the right families/caregivers</p>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold">Start Connecting</h4>
                <p className="text-sm text-gray-600">Browse and connect with verified local matches</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">🎉 Trial Member Benefits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Priority access to top-rated caregivers in your area
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Reduced platform fees for first 6 months
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Direct input on new platform features
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Exclusive community support and resources
              </li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Questions? Our team is here to help you get started.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/">Explore Platform</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@vivaly.com.au">Contact Support</a>
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Follow us for updates and tips:</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="text-blue-600 hover:underline">Facebook</a>
              <a href="#" className="text-blue-600 hover:underline">Instagram</a>
              <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}