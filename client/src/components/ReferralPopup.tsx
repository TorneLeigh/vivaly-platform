import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Gift, Users, Star, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralPopupProps {
  userRole: 'parent' | 'caregiver';
  userName: string;
}

export default function ReferralPopup({ userRole, userName }: ReferralPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already dismissed the popup today
    const dismissedDate = localStorage.getItem('referralPopupDismissed');
    const today = new Date().toDateString();
    
    if (dismissedDate !== today) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Remember dismissal for today
    localStorage.setItem('referralPopupDismissed', new Date().toDateString());
  };

  const handleCopyReferralLink = () => {
    const referralCode = `VIVALY-${userName.toUpperCase()}-${userRole.toUpperCase()}`;
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Referral Link Copied!",
        description: "Share this link with friends to earn rewards",
      });
    });
  };

  if (!isVisible || isDismissed) return null;

  const rewards = {
    title: "Invite Family & Friends",
    reward: "3 fee-free bookings",
    description: "Invite family and friends to join the Vivaly community and get 3 fee-free bookings!",
    actionText: "Share Your Link"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white shadow-xl border-2 border-green-200">
        <CardHeader className="relative pb-4">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {rewards.title}
            </CardTitle>
            <Badge className="bg-green-100 text-green-800 mt-2">
              <Star className="w-3 h-3 mr-1" />
              Earn {rewards.reward}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {rewards.description}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">How it works:</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Share your referral link</li>
              <li>• Friends & family sign up using your link</li>
              <li>• They join the Vivaly community</li>
              <li>• You get 3 fee-free bookings!</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleCopyReferralLink}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {rewards.actionText}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="px-4"
            >
              Later
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Terms apply. Rewards credited after successful completion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}