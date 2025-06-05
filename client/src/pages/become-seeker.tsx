import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, Shield, Clock, Users, Star } from "lucide-react";

export default function BecomeSeeker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/5 to-warm-gray/10">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find trusted care for your family
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with verified caregivers in your area. From childcare to elderly care, 
              find the perfect match for your family's needs.
            </p>
            <div className="flex flex-col gap-6 items-center">
              <Button 
                size="lg" 
                className="bg-coral hover:bg-coral/90 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg"
                onClick={() => window.location.href = '/signup?role=seeker'}
              >
                Get Started with Google
              </Button>
              <div className="flex items-center gap-2 text-base text-gray-700">
                <span>Already have an account?</span>
                <Button 
                  variant="link" 
                  className="text-coral hover:text-coral/80 p-0 h-auto font-semibold underline"
                  onClick={() => window.location.href = '/login'}
                >
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why families choose VIVALY
          </h2>
          <p className="text-lg text-gray-600">
            We make finding quality care simple, safe, and affordable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center border-2 hover:border-coral/20 transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 text-coral mx-auto mb-4" />
              <CardTitle>Verified Caregivers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All caregivers undergo background checks and verification processes 
                to ensure your family's safety and peace of mind.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-coral/20 transition-colors">
            <CardHeader>
              <Clock className="h-12 w-12 text-coral mx-auto mb-4" />
              <CardTitle>Flexible Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Book care when you need it - whether it's regular childcare, 
                emergency babysitting, or specialized elderly care.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-coral/20 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-coral mx-auto mb-4" />
              <CardTitle>Community Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join our co-support community where local families help each other 
                with free childcare exchanges and support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* How it Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-coral text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Create your profile</h3>
            <p className="text-gray-600">
              Tell us about your family and what type of care you need
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-coral text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse & connect</h3>
            <p className="text-gray-600">
              Search verified caregivers in your area and read reviews
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-coral text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Book with confidence</h3>
            <p className="text-gray-600">
              Schedule care and enjoy peace of mind with our safety features
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-coral text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find the perfect caregiver?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Australian families who trust VIVALY for their care needs
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-coral hover:bg-gray-50 px-8 py-3"
            onClick={() => window.location.href = '/signup?role=seeker'}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}