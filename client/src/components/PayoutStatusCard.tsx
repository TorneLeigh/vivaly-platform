import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Banknote, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Settings
} from "lucide-react";

export default function PayoutStatusCard() {
  const { toast } = useToast();
  const [payoutStatus, setPayoutStatus] = useState<'loading' | 'not_connected' | 'pending' | 'connected'>('loading');
  const [accountDetails, setAccountDetails] = useState<any>(null);

  useEffect(() => {
    checkPayoutStatus();
  }, []);

  const checkPayoutStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/stripe/connect/status');
      const data = await response.json();
      setPayoutStatus(data.status);
      setAccountDetails(data);
    } catch (error) {
      console.error('Failed to check payout status:', error);
      setPayoutStatus('not_connected');
    }
  };

  const handleSetupPayout = () => {
    window.location.href = '/caregiver-connect';
  };

  const getStatusDisplay = () => {
    switch (payoutStatus) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payouts Ready',
          description: 'Your bank account is connected. You\'ll receive payments automatically 24 hours after job completion.',
          badge: { text: 'Active', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' }
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Setup In Progress',
          description: 'Complete your payout setup to start receiving payments.',
          badge: { text: 'Action Needed', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Setup Required',
          description: 'Set up your payout account to receive payments from completed jobs.',
          badge: { text: 'Not Connected', variant: 'secondary' as const, className: 'bg-red-100 text-red-800' }
        };
    }
  };

  if (payoutStatus === 'loading') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-gray-600">Checking payout status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <Card className={`${status.borderColor} ${status.bgColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className={`h-5 w-5 ${status.color}`} />
            <span>Payout Account</span>
          </div>
          <Badge className={status.badge.className}>
            {status.badge.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <StatusIcon className={`h-5 w-5 ${status.color} mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-medium ${status.color}`}>{status.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{status.description}</p>
          </div>
        </div>

        {payoutStatus === 'connected' && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <p><strong>Account Status:</strong> Active</p>
              <p><strong>Payment Schedule:</strong> 24h after job completion</p>
              <p><strong>Platform Fee:</strong> 10% (You keep 90%)</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {payoutStatus !== 'connected' && (
            <Button 
              onClick={handleSetupPayout}
              className="bg-[#FF5F7E] hover:bg-[#e54c6b] text-white"
              size="sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Set Up Payout Account
            </Button>
          )}
          
          {payoutStatus === 'connected' && (
            <Button 
              onClick={handleSetupPayout}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Account
            </Button>
          )}
        </div>

        {payoutStatus === 'pending' && accountDetails?.requirements && (
          <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
            <p><strong>Next Steps:</strong> Complete your Stripe onboarding to activate payouts.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}