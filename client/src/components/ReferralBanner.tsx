import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Users, X } from "lucide-react";

interface ReferralBannerProps {
  onClose?: () => void;
}

export const ReferralBanner = ({ onClose }: ReferralBannerProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [, setLocation] = useLocation();

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
              Refer & Save
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
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Know someone who needs quality childcare? Share Vivaly and save when they book their first service.
          </p>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={() => {
              setLocation("/parent-signup");
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