import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  CreditCard,
  Clock,
  DollarSign
} from "lucide-react";

interface CaregiverPayoutSetupProps {
  userId: string;
  email: string;
}

interface ConnectStatus {
  status: 'not_connected' | 'pending' | 'connected';
  accountId?: string;
  requirements?: any;
}

export default function CaregiverPayoutSetup({ userId, email }: CaregiverPayoutSetupProps) {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectStatus();
  }, [userId]);

  const checkConnectStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/stripe/connect/status');
      setConnectStatus(response);
    } catch (error: any) {
      console.error('Error checking connect status:', error);
      setConnectStatus({ status: 'not_connected' });
    }
  };

  const handleSetupPayout = () => {
    // Navigate to the dedicated connect page for form filling
    window.location.href = '/caregiver-connect';
  };

  const getStatusBadge = () => {
    switch (connectStatus?.status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Setup
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Connected
          </Badge>
        );
    }
  };

  const getStatusMessage = () => {
    switch (connectStatus?.status) {
      case 'connected':
        return "Your payout account is fully set up and ready to receive payments.";
      case 'pending':
        return "Your payout account is being reviewed. You may need to complete additional steps.";
      default:
        return "You need to set up a payout account to receive payments from jobs.";
    }
  };

  if (connectStatus?.status === 'connected') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-green-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payout Account
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 mb-3">
            {getStatusMessage()}
          </p>
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Payments will be automatically transferred to your account 24 hours after job completion
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-orange-800 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Set Up Your Payouts
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-orange-700 mb-4">
          {getStatusMessage()}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start text-xs text-orange-600">
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Secure bank account connection via Stripe</span>
          </div>
          <div className="flex items-start text-xs text-orange-600">
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Automatic payments 24 hours after job completion</span>
          </div>
          <div className="flex items-start text-xs text-orange-600">
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>90% of payment (10% platform fee automatically deducted)</span>
          </div>
        </div>

        {onboardingUrl ? (
          <div className="space-y-3">
            <Button 
              onClick={() => window.open(onboardingUrl, '_blank')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Complete Stripe Setup
            </Button>
            <Button 
              variant="outline" 
              onClick={checkConnectStatus}
              className="w-full text-orange-600 border-orange-300 hover:bg-orange-100"
            >
              Check Status
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleSetupPayout} 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Start Payout Setup
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}