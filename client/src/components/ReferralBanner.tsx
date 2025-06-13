import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Users, X } from "lucide-react";

interface ReferralBannerProps {
  onClose?: () => void;
}

export const ReferralBanner = ({ onClose }: ReferralBannerProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        >
          <Gift className="h-4 w-4 mr-2" />
          Referral Program
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Refer & Earn
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Minimize</span>
              <div className="w-3 h-0.5 bg-gray-500"></div>
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Star className="h-3 w-3 mr-1" />
              $50 Credit
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              for each successful referral
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            Know someone who needs quality childcare? Share Vivaly and earn credits when they book their first service.
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Users className="h-3 w-3" />
            <span>Join 2,000+ families earning rewards</span>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={() => {
              console.log("Referral program clicked");
              // Here you would typically open a referral modal or navigate to referral page
            }}
          >
            Start Referring
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralBanner;