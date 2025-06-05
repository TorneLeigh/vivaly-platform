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
            <div className="flex flex-col gap-4 items-center">
              <Button 
                size="lg" 
                className="bg-coral hover:bg-coral/90 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg border-0"
                onClick={() => window.location.href = '/signup?role=seeker'}
                style={{ color: '#FFFFFF', backgroundColor: '#FF6B35' }}
              >
                Create an Account
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 px-12 py-4 text-lg font-semibold rounded-lg flex items-center gap-3"
                onClick={() => window.location.href = '/api/login'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>
              <div className="flex items-center gap-2 text-base text-gray-700 mt-2">
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