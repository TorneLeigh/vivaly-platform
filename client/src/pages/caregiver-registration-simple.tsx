import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  DollarSign, 
  Award, 
  FileText,
  Shield,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function CaregiverRegistrationSimple() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    bio: "",
    hourlyRate: "25",
    services: [] as string[],
  });

  const serviceTypes = [
    "1-on-1 care",
    "1-2 hours group care", 
    "Childcare",
    "Drop and dash",
    "Midwife services",
    "Doula services",
    "Breastfeeding support",
    "Birth education",
    "Newborn support",
    "Pregnancy assistance",
    "Postnatal care",
    "Pet sitting",
    "Elderly care",
    "Elderly companionship"
  ];

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const progress = (step / 4) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0412 345 678"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street, Suburb, State, Postcode"
                />
              </div>

              <div>
                <Label htmlFor="suburb">Suburb *</Label>
                <Input
                  id="suburb"
                  value={formData.suburb}
                  onChange={(e) => setFormData(prev => ({ ...prev, suburb: e.target.value }))}
                  placeholder="Suburb"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Experience & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="bio">About You *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell families about yourself, your experience, and what makes you special..."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  {formData.bio.length}/50 characters minimum
                </p>
              </div>

              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (AUD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="15"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    className="pl-8"
                    placeholder="25"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Minimum $15/hour as per Australian standards
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Services You Offer *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <div
                      key={service}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.services.includes(service)
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.services.length} service{formData.services.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification & Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Required Documentation</h4>
                <p className="text-blue-800 text-sm mb-3">
                  The following documents are required for all caregivers in Australia:
                </p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Working with Children Check (WWCC)</li>
                  <li>• Police Check (within 6 months)</li>
                  <li>• First Aid Certificate (recommended)</li>
                  <li>• Two professional references</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Background Verification</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    We'll conduct a comprehensive background check including identity verification,
                    employment history, and reference checks.
                  </p>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consent" className="rounded" />
                    <Label htmlFor="consent" className="text-sm">
                      I consent to background verification checks
                    </Label>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Terms & Conditions</h5>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Registration Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Thank You for Joining VIVALY!</h3>
                <p className="text-gray-600 mb-4">
                  Your caregiver profile has been submitted for review. Our team will verify your
                  documents and get back to you within 2-3 business days.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">What's Next?</h4>
                <ul className="text-left text-orange-800 text-sm space-y-1">
                  <li>• Check your email for verification instructions</li>
                  <li>• Upload your documents via the verification portal</li>
                  <li>• Complete your profile once approved</li>
                  <li>• Start connecting with families!</li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-black hover:bg-gray-800"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join VIVALY as a Caregiver
          </h1>
          <p className="text-lg text-gray-600">
            Help Australian families while building your care career
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && step < 4 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          
          {step < 3 && (
            <Button
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-2 bg-black hover:bg-gray-800"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {step === 3 && (
            <Button
              onClick={() => setStep(4)}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Submit Registration
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Selected Services Summary */}
        {formData.services.length > 0 && step > 1 && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">Selected Services:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service) => (
                <Badge key={service} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}