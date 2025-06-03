import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  MapPin,
  Star,
  Shield,
  Calendar
} from "lucide-react";

const onboardingSteps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Services", description: "What care do you provide?" },
  { id: 3, title: "Availability", description: "When are you available?" },
  { id: 4, title: "Pricing", description: "Set your rates" },
  { id: 5, title: "Verification", description: "Upload documents" },
  { id: 6, title: "Photos", description: "Add your profile photo" },
];

export default function CaregiverOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    services: [],
    hourlyRate: "",
    availability: [],
    location: ""
  });

  const progressPercentage = (currentStep / onboardingSteps.length) * 100;

  const serviceOptions = [
    { id: "babysitting", label: "Babysitting", icon: "👶" },
    { id: "nanny", label: "Nanny Services", icon: "🧑‍🍼" },
    { id: "eldercare", label: "Elder Care", icon: "👴" },
    { id: "petcare", label: "Pet Care", icon: "🐕" },
    { id: "housekeeping", label: "Housekeeping", icon: "🏠" },
    { id: "tutoring", label: "Tutoring", icon: "📚" }
  ];

  const availabilityOptions = [
    "Monday Morning", "Monday Afternoon", "Monday Evening",
    "Tuesday Morning", "Tuesday Afternoon", "Tuesday Evening",
    "Wednesday Morning", "Wednesday Afternoon", "Wednesday Evening",
    "Thursday Morning", "Thursday Afternoon", "Thursday Evening",
    "Friday Morning", "Friday Afternoon", "Friday Evening",
    "Saturday Morning", "Saturday Afternoon", "Saturday Evening",
    "Sunday Morning", "Sunday Afternoon", "Sunday Evening"
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+61 4XX XXX XXX"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Sydney, NSW"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What services do you provide?</h3>
            <div className="grid grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <Button
                  key={service.id}
                  variant={formData.services.includes(service.id) ? "default" : "outline"}
                  className="h-16 flex-col"
                  onClick={() => {
                    const updatedServices = formData.services.includes(service.id)
                      ? formData.services.filter(s => s !== service.id)
                      : [...formData.services, service.id];
                    setFormData({...formData, services: updatedServices});
                  }}
                >
                  <span className="text-2xl mb-1">{service.icon}</span>
                  <span className="text-sm">{service.label}</span>
                </Button>
              ))}
            </div>
            <div>
              <Label htmlFor="bio">Tell families about yourself</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Share your experience, qualifications, and what makes you special..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">When are you available?</h3>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {availabilityOptions.map((slot) => (
                <Button
                  key={slot}
                  variant={formData.availability.includes(slot) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    const updatedAvailability = formData.availability.includes(slot)
                      ? formData.availability.filter(a => a !== slot)
                      : [...formData.availability, slot];
                    setFormData({...formData, availability: updatedAvailability});
                  }}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Set your hourly rate</h3>
            <div className="text-center space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  placeholder="25"
                  className="pl-10 text-2xl text-center font-semibold"
                />
              </div>
              <p className="text-sm text-gray-600">per hour</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Average rates in your area: $20-35/hour for babysitting
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload verification documents</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Working with Children Check</p>
                <Button variant="outline" size="sm">Upload Document</Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">First Aid Certificate</p>
                <Button variant="outline" size="sm">Upload Document</Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">ID Document</p>
                <Button variant="outline" size="sm">Upload Document</Button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add your profile photo</h3>
            <div className="text-center space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  A friendly photo helps families feel comfortable choosing you
                </p>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-800">
                  Photos with smiling faces get 40% more bookings!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Become a Caregiver</h1>
          <span className="text-sm text-gray-600">
            Step {currentStep} of {onboardingSteps.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Current Step */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center text-sm font-bold">
              {currentStep}
            </span>
            {onboardingSteps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {onboardingSteps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep === onboardingSteps.length ? (
          <Button onClick={() => console.log("Submit form")}>
            Complete Registration
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
          </Button>
        )}
      </div>

      {/* Benefits Footer */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Why join CareConnect?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>Earn $20-50/hour</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Flexible scheduling</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Safe payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}