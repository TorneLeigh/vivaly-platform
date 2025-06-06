import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Heart, Shield, Clock, DollarSign, Users, Star } from "lucide-react";

export default function TrialSignup() {
  const [userType, setUserType] = useState<"parent" | "caregiver" | "">("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    suburb: "",
    childrenAges: "",
    careNeeds: "",
    hasWWCC: false,
    experience: "",
    agreedToTerms: false
  });

  const { toast } = useToast();

  const trialSignupMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/trial-signup", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to VIVALY!",
        description: "You're now part of our trial community. Check your email for next steps.",
      });
      // Redirect to success page after successful signup
      window.location.href = "/trial-success";
    },
    onError: () => {
      toast({
        title: "Signup Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    trialSignupMutation.mutate({
      ...formData,
      userType,
      signupSource: "trial-landing"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Australia's First Home-Based 
              <span className="text-blue-600"> Childcare Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Skip the 18-month daycare waitlists. Connect with verified local caregivers for flexible, 
              affordable home-based care that works around YOUR schedule.
            </p>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Flexible Scheduling</h3>
                <p className="text-sm text-gray-600">Care when you need it</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Save 30-50%</h3>
                <p className="text-sm text-gray-600">Compared to daycare</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Verified Caregivers</h3>
                <p className="text-sm text-gray-600">WWCC & police checked</p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">1-on-1 Care</h3>
                <p className="text-sm text-gray-600">Personal attention</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-blue-50 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.9/5 from early users</span>
              </div>
              <p className="text-gray-700 italic">
                "VIVALY solved our childcare crisis. No more waitlists, no more rigid schedules. 
                Our caregiver Sarah comes to our home and my daughter loves her!"
              </p>
              <p className="text-sm text-gray-600 mt-2">- Michelle K, Bondi Parent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Join the VIVALY Trial Community
              </CardTitle>
              <p className="text-center text-gray-600">
                Be among the first 100 families to experience flexible, affordable childcare
              </p>
            </CardHeader>
            <CardContent>
              {!userType ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center mb-6">I'm looking to:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-blue-50"
                      onClick={() => setUserType("parent")}
                    >
                      <Users className="h-8 w-8 mb-2 text-blue-600" />
                      <span className="font-semibold">Find Childcare</span>
                      <span className="text-sm text-gray-600">I'm a parent/family</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-green-50"
                      onClick={() => setUserType("caregiver")}
                    >
                      <Heart className="h-8 w-8 mb-2 text-green-600" />
                      <span className="font-semibold">Provide Childcare</span>
                      <span className="text-sm text-gray-600">I'm a caregiver</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
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
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        // Format Australian phone number
                        const digits = e.target.value.replace(/\D/g, '');
                        let formatted = '';
                        if (digits.startsWith('61')) {
                          formatted = `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
                        } else if (digits.startsWith('0')) {
                          formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
                        } else if (digits.length <= 10) {
                          formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
                        } else {
                          formatted = e.target.value;
                        }
                        setFormData({...formData, phone: formatted});
                      }}
                      placeholder="0400 000 000"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Australian mobile number required for SMS notifications</p>
                  </div>

                  <div>
                    <Label htmlFor="suburb">Suburb</Label>
                    <Input
                      id="suburb"
                      value={formData.suburb}
                      onChange={(e) => setFormData({...formData, suburb: e.target.value})}
                      placeholder="e.g. Bondi, Manly, Parramatta"
                      required
                    />
                  </div>

                  {userType === "parent" ? (
                    <>
                      <div>
                        <Label htmlFor="childrenAges">Children's Ages</Label>
                        <Input
                          id="childrenAges"
                          value={formData.childrenAges}
                          onChange={(e) => setFormData({...formData, childrenAges: e.target.value})}
                          placeholder="e.g. 2 years, 4 years"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="careNeeds">Care Needs</Label>
                        <Select onValueChange={(value) => setFormData({...formData, careNeeds: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your care needs" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="occasional">Occasional care (date nights, appointments)</SelectItem>
                            <SelectItem value="regular-parttime">Regular part-time (2-3 days/week)</SelectItem>
                            <SelectItem value="regular-fulltime">Regular full-time (4-5 days/week)</SelectItem>
                            <SelectItem value="emergency">Emergency/backup care</SelectItem>
                            <SelectItem value="school-holidays">School holiday care</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasWWCC"
                          checked={formData.hasWWCC}
                          onCheckedChange={(checked) => setFormData({...formData, hasWWCC: checked as boolean})}
                        />
                        <Label htmlFor="hasWWCC" className="text-sm">
                          I have a current Working with Children Check (WWCC)
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Select onValueChange={(value) => setFormData({...formData, experience: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional caregiver/educator</SelectItem>
                            <SelectItem value="experienced-parent">Experienced parent</SelectItem>
                            <SelectItem value="some-experience">Some childcare experience</SelectItem>
                            <SelectItem value="new-but-eager">New to childcare but eager to learn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked as boolean})}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and privacy policy
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUserType("")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={trialSignupMutation.isPending}
                      className="flex-1"
                    >
                      {trialSignupMutation.isPending ? "Joining..." : "Join Trial"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-6">Why Families Trust VIVALY</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Rigorous Verification</h4>
                <p className="text-sm text-gray-600">All caregivers undergo WWCC, police checks, and reference verification</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Insurance Coverage</h4>
                <p className="text-sm text-gray-600">Comprehensive insurance protection for all families and caregivers</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Community Reviews</h4>
                <p className="text-sm text-gray-600">Real reviews from verified families in your local community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}