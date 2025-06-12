import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle, Building, MapPin, Clock, Users } from "lucide-react";
import { Link } from "wouter";

export default function ServiceProviderRegistration() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber <= step ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 mx-2 ${stepNumber < step ? 'bg-orange-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-6 h-6 text-orange-600" />
          Service Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="businessName">Business/Service Name *</Label>
            <Input id="businessName" placeholder="Little Stars Daycare" />
          </div>
          <div>
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daycare">Daycare Center</SelectItem>
                <SelectItem value="preschool">Preschool</SelectItem>
                <SelectItem value="afterschool">After School Program</SelectItem>
                <SelectItem value="classes">Educational Classes</SelectItem>
                <SelectItem value="workshops">Workshops & Training</SelectItem>
                <SelectItem value="camps">Holiday Camps</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Service Description *</Label>
          <Textarea 
            id="description" 
            placeholder="Describe your service, what makes it unique, your approach to care/education..."
            className="min-h-32"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="capacity">Maximum Capacity</Label>
            <Input id="capacity" type="number" placeholder="20" />
          </div>
          <div>
            <Label htmlFor="ageGroups">Age Groups Served *</Label>
            <div className="space-y-2 mt-2">
              {['0-12 months', '1-2 years', '3-5 years', '6-12 years', '13+ years'].map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox id={age} />
                  <Label htmlFor={age}>{age}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-orange-600" />
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input id="address" placeholder="123 Care Street" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="suburb">Suburb *</Label>
            <Input id="suburb" placeholder="Melbourne" />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSW">NSW</SelectItem>
                <SelectItem value="VIC">VIC</SelectItem>
                <SelectItem value="QLD">QLD</SelectItem>
                <SelectItem value="WA">WA</SelectItem>
                <SelectItem value="SA">SA</SelectItem>
                <SelectItem value="TAS">TAS</SelectItem>
                <SelectItem value="ACT">ACT</SelectItem>
                <SelectItem value="NT">NT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="postcode">Postcode *</Label>
            <Input id="postcode" placeholder="3000" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" placeholder="+61 xxx xxx xxx" />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" placeholder="hello@littlestars.com.au" />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input id="website" placeholder="https://www.littlestars.com.au" />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-600" />
          Operating Hours & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Operating Hours</Label>
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <Checkbox id={`${day}-open`} />
                  <Label htmlFor={`${day}-open`} className="ml-2">{day}</Label>
                </div>
                <Input placeholder="9:00 AM" className="w-32" />
                <span>to</span>
                <Input placeholder="5:00 PM" className="w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pricing">Pricing Structure *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
                <SelectItem value="daily">Daily Rate</SelectItem>
                <SelectItem value="weekly">Weekly Rate</SelectItem>
                <SelectItem value="session">Per Session</SelectItem>
                <SelectItem value="package">Package Deals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rate">Rate (AUD) *</Label>
            <Input id="rate" placeholder="50" type="number" />
          </div>
        </div>

        <div>
          <Label htmlFor="additionalInfo">Additional Pricing Information</Label>
          <Textarea 
            id="additionalInfo" 
            placeholder="Sibling discounts, package deals, trial offers..."
            className="min-h-20"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-600" />
          Credentials & Final Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Licenses & Certifications</Label>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox id="childcareLicense" />
              <Label htmlFor="childcareLicense">Licensed Childcare Provider</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="firstAid" />
              <Label htmlFor="firstAid">First Aid Certified Staff</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="wwcc" />
              <Label htmlFor="wwcc">All Staff Have Working with Children Checks</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="insurance" />
              <Label htmlFor="insurance">Public Liability Insurance</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="staffNumber">Number of Staff</Label>
          <Input id="staffNumber" type="number" placeholder="5" />
        </div>

        <div>
          <Label htmlFor="experience">Years of Operation</Label>
          <Input id="experience" type="number" placeholder="3" />
        </div>

        <div>
          <Label htmlFor="specialties">Specialties & Unique Features</Label>
          <Textarea 
            id="specialties" 
            placeholder="Montessori approach, bilingual program, outdoor education, special needs support..."
            className="min-h-24"
          />
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="font-medium">
              I agree to VIVALY's Terms of Service and Provider Agreement
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="backgroundCheck" />
            <Label htmlFor="backgroundCheck" className="font-medium">
              I consent to background verification for my service
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card>
      <CardContent className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for joining VIVALY as a service provider. We're reviewing your application 
          and will notify you within 1-2 business days.
        </p>
        
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">What happens next?</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• We'll verify your credentials and licensing</p>
            <p>• Our team will contact you for any additional information</p>
            <p>• Once approved, your service will be listed on VIVALY</p>
            <p>• You'll receive access to your provider dashboard</p>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/dashboard">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/registration-type-selection" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to registration options
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Registration</h1>
            <p className="text-gray-600">Register your childcare service, program, or educational offering</p>
          </div>

          {step <= 4 && renderStepIndicator()}

          {/* Form Steps */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderSuccessStep()}

          {/* Navigation */}
          {step <= 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={step === 4 ? () => setStep(5) : nextStep}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                {step === 4 ? 'Submit Registration' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}