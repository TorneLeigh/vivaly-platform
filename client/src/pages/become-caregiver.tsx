import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, Users, Baby, Calendar, Shield, DollarSign, ArrowRight, Star, CheckCircle
} from "lucide-react";

const serviceTypes = [
  {
    id: 'social',
    title: 'Social & Events',
    description: 'Organize activities and social events for families',
    icon: Users,
    color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    id: 'midwife',
    title: 'Midwife Services',
    description: 'Professional prenatal and postnatal care',
    icon: Heart,
    color: 'bg-pink-50 text-pink-600 border-pink-200'
  },
  {
    id: 'caregiver',
    title: 'Caregiver',
    description: 'Personal care and companionship services',
    icon: Shield,
    color: 'bg-green-50 text-green-600 border-green-200'
  },
  {
    id: 'daycare',
    title: 'Daycare',
    description: 'Licensed childcare and early education',
    icon: Baby,
    color: 'bg-orange-50 text-orange-600 border-orange-200'
  }
];

export default function BecomeCaregiver() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleServiceSelect = (serviceId: string) => {
    setDialogOpen(false);
    window.location.href = `/signup?role=caregiver&service=${serviceId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/5 to-warm-gray/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Earn money as a caregiver
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of caregivers earning money by sharing their skills and passion for caring. 
              Set your own rates, choose your schedule, and make a real difference in families' lives.
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-coral hover:bg-coral/90 text-white px-12 py-4 text-lg font-semibold rounded-lg"
                >
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-2">
                    What services do you offer?
                  </DialogTitle>
                  <p className="text-gray-600 text-center">
                    Choose the type of care services you'd like to provide
                  </p>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {serviceTypes.map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer border-2 hover:border-coral/50 transition-all duration-200 hover:shadow-lg ${service.color}`}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <IconComponent className="h-12 w-12 mx-auto mb-4" />
                          <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                          <p className="text-sm opacity-80">{service.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <span>Already have an account?</span>
              <Button 
                variant="link" 
                className="text-coral hover:text-coral/80 p-0 h-auto"
                onClick={() => window.location.href = '/login'}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-coral/10"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-coral/5"></div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why caregivers choose VIVALY
          </h2>
          <p className="text-xl text-gray-600">
            Join a platform built for care professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-coral/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-10 w-10 text-coral" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Set your own rates</h3>
            <p className="text-gray-600 text-lg">
              You decide how much you charge. Keep 90% of what you earn - we only take a small service fee.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-coral/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-coral" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Flexible schedule</h3>
            <p className="text-gray-600 text-lg">
              Work when it suits you. Accept bookings that fit your lifestyle and availability.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-coral/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-coral" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Safety & support</h3>
            <p className="text-gray-600 text-lg">
              Background checks, insurance coverage, and 24/7 support to keep you protected.
            </p>
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Earn what you deserve
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Australian caregivers on VIVALY earn competitive rates while building meaningful relationships with families.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Average $35-65/hour</h4>
                    <p className="text-gray-600">Competitive rates based on your experience and services</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Weekly payments</h4>
                    <p className="text-gray-600">Get paid reliably every week via direct deposit</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Performance bonuses</h4>
                    <p className="text-gray-600">Earn extra for excellent reviews and repeat bookings</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-coral/10 to-coral/5 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-coral mb-2">$1,200+</div>
              <div className="text-xl text-gray-700 mb-4">Average weekly earnings</div>
              <div className="text-gray-600">Based on 20 hours of care per week</div>
              
              <div className="flex justify-center items-center gap-2 mt-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">4.9/5 caregiver satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-coral text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start earning as a caregiver?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of caregivers who've found financial freedom and meaningful work through VIVALY
          </p>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-coral hover:bg-gray-50 px-12 py-4 text-lg font-semibold rounded-lg"
              >
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-2">
                  What services do you offer?
                </DialogTitle>
                <p className="text-gray-600 text-center">
                  Choose the type of care services you'd like to provide
                </p>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {serviceTypes.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer border-2 hover:border-coral/50 transition-all duration-200 hover:shadow-lg ${service.color}`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <IconComponent className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <p className="text-sm opacity-80">{service.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}