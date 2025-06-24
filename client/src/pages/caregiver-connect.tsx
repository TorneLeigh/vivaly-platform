import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Building2, 
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Banknote
} from "lucide-react";

export default function CaregiverConnect() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [connectStatus, setConnectStatus] = useState<'pending' | 'connected' | 'incomplete'>('pending');
  const [accountData, setAccountData] = useState({
    businessType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postcode: '',
      country: 'AU'
    },
    bankAccount: {
      accountHolderName: '',
      bsb: '',
      accountNumber: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAccountData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setAccountData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleStripeConnect = async () => {
    setLoading(true);
    try {
      // Create Stripe Connect account
      const response = await apiRequest('POST', '/api/stripe/connect/create-account', accountData);
      const data = await response.json();

      if (data.accountLink) {
        // Redirect to Stripe onboarding
        window.location.href = data.accountLink;
      } else {
        setConnectStatus('connected');
        toast({
          title: "Account Connected",
          description: "Your bank account has been successfully connected for payouts.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect your account. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSkipForNow = () => {
    toast({
      title: "Setup Incomplete",
      description: "You can complete payout setup later in your account settings.",
      variant: "destructive",
    });
    navigate('/caregiver-dashboard');
  };

  if (connectStatus === 'connected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Payout Account Connected!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your bank account is now connected. You'll receive payments automatically 24 hours after each completed job.
            </p>
            <Button 
              onClick={() => navigate('/caregiver-dashboard')} 
              className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/caregiver-dashboard')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-6 w-6 text-[#FF5F7E]" />
                Set Up Payouts
              </CardTitle>
              <p className="text-gray-600">
                Connect your bank account to receive payments automatically after completing jobs.
              </p>
            </CardHeader>
          </Card>

          {/* Benefits */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-900 mb-3">Why Connect Your Bank Account?</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">Automatic payments 24 hours after job completion</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">Secure bank-level encryption via Stripe</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">No manual invoicing or payment collection needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#FF5F7E]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={accountData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Sarah"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={accountData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Johnson"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="sarah@example.com"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={accountData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address.line1">Street Address</Label>
                <Input
                  id="address.line1"
                  value={accountData.address.line1}
                  onChange={(e) => handleInputChange('address.line1', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    id="address.city"
                    value={accountData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="Sydney"
                  />
                </div>
                <div>
                  <Label htmlFor="address.state">State</Label>
                  <Input
                    id="address.state"
                    value={accountData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="NSW"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address.postcode">Postcode</Label>
                <Input
                  id="address.postcode"
                  value={accountData.address.postcode}
                  onChange={(e) => handleInputChange('address.postcode', e.target.value)}
                  placeholder="2000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#FF5F7E]" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bankAccount.accountHolderName">Account Holder Name</Label>
                <Input
                  id="bankAccount.accountHolderName"
                  value={accountData.bankAccount.accountHolderName}
                  onChange={(e) => handleInputChange('bankAccount.accountHolderName', e.target.value)}
                  placeholder="Sarah Johnson"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankAccount.bsb">BSB</Label>
                  <Input
                    id="bankAccount.bsb"
                    value={accountData.bankAccount.bsb}
                    onChange={(e) => handleInputChange('bankAccount.bsb', e.target.value)}
                    placeholder="062-000"
                    maxLength={7}
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccount.accountNumber">Account Number</Label>
                  <Input
                    id="bankAccount.accountNumber"
                    value={accountData.bankAccount.accountNumber}
                    onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
                    placeholder="12345678"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-1">Your Information is Secure</h4>
                  <p>All data is encrypted and processed securely through Stripe Connect. VIVALY never stores your bank account details.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleStripeConnect}
              disabled={loading}
              className="w-full bg-[#FF5F7E] hover:bg-[#e54c6b] text-white h-12"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Connecting Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Connect Bank Account Securely
                </div>
              )}
            </Button>
            
            <Button 
              onClick={handleSkipForNow}
              variant="outline"
              className="w-full"
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}