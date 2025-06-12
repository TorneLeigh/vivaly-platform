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
                  Get support
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

          {/* How It Works - Airbnb Style */}
          <section className="py-20 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">The easy process</h2>
                <p className="text-xl text-gray-600">Simple steps to join our community</p>
              </div>
              
              {/* Mobile Mockups Section */}
              <div className="grid md:grid-cols-3 gap-12 items-center mb-20">
                {/* Step 1 - Create Profile */}
                <div className="text-center">
                  <div className="relative mb-8 overflow-hidden">
                    <div className="w-64 h-[400px] mx-auto bg-black rounded-t-[3rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-t-[2.5rem] overflow-hidden relative">
                        {/* Phone UI Header */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10">
                          <div className="flex justify-center items-center h-full">
                            <div className="w-32 h-6 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="pt-16 px-6 h-full bg-gray-50">
                          <div className="text-left mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Create Your Profile</h3>
                          </div>
                          
                          {/* Profile Form */}
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="text-sm text-gray-600 mb-2">About You</div>
                              <div className="text-gray-900 font-medium">Tell families about your experience...</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="text-sm text-gray-600 mb-2">Services</div>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs bg-coral text-white px-2 py-1 rounded">Childcare</span>
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Pet Care</span>
                              </div>
                            </div>
                            
                            <div className="bg-coral text-white rounded-lg p-3 text-center font-medium">
                              Save Profile
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Create your profile</h3>
                  <p className="text-gray-600">Build a profile that showcases your experience and personality</p>
                </div>

                {/* Step 2 - Set Availability */}
                <div className="text-center">
                  <div className="relative mb-8 overflow-hidden">
                    <div className="w-64 h-[400px] mx-auto bg-black rounded-t-[3rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-t-[2.5rem] overflow-hidden relative">
                        {/* Phone UI Header */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10">
                          <div className="flex justify-center items-center h-full">
                            <div className="w-32 h-6 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="pt-16 px-6 h-full bg-gray-50">
                          <div className="text-left mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Your Calendar</h3>
                          </div>
                          
                          {/* Calendar View */}
                          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                            <div className="grid grid-cols-7 gap-1 text-xs">
                              <div className="text-center font-medium text-gray-600">M</div>
                              <div className="text-center font-medium text-gray-600">T</div>
                              <div className="text-center font-medium text-gray-600">W</div>
                              <div className="text-center font-medium text-gray-600">T</div>
                              <div className="text-center font-medium text-gray-600">F</div>
                              <div className="text-center font-medium text-gray-600">S</div>
                              <div className="text-center font-medium text-gray-600">S</div>
                              
                              <div className="text-center p-1 bg-coral text-white rounded text-xs">15</div>
                              <div className="text-center p-1 text-gray-400 text-xs">16</div>
                              <div className="text-center p-1 bg-coral text-white rounded text-xs">17</div>
                              <div className="text-center p-1 text-gray-400 text-xs">18</div>
                              <div className="text-center p-1 bg-coral text-white rounded text-xs">19</div>
                              <div className="text-center p-1 text-gray-400 text-xs">20</div>
                              <div className="text-center p-1 text-gray-400 text-xs">21</div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Hourly Rate</div>
                            <div className="text-lg font-bold text-gray-900">$35/hour</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Set your schedule</h3>
                  <p className="text-gray-600">Choose when you're available and set your own rates</p>
                </div>

                {/* Step 3 - Start Earning */}
                <div className="text-center">
                  <div className="relative mb-8 overflow-hidden">
                    <div className="w-64 h-[400px] mx-auto bg-black rounded-t-[3rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-t-[2.5rem] overflow-hidden relative">
                        {/* Phone UI Header */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10">
                          <div className="flex justify-center items-center h-full">
                            <div className="w-32 h-6 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="pt-16 px-6 h-full bg-gray-50">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <div className="text-2xl">💰</div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">New Booking!</h3>
                            <p className="text-sm text-gray-600 mt-2">You have a new request<br/>from the Johnson family</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <div className="text-sm font-medium text-gray-900 mb-2">Booking Details</div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div>Monday, 9:00 AM - 3:00 PM</div>
                              <div>2 children (ages 3, 5)</div>
                              <div className="font-medium text-coral">$210 total</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full bg-coral text-white py-2 rounded-lg text-sm">Accept Booking</button>
                            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm">View Profile</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Start earning</h3>
                  <p className="text-gray-600">Receive booking requests and build lasting relationships with families</p>
                </div>
              </div>
            </div>
          </section>


        </div>
      </div>
    </div>
  );
}