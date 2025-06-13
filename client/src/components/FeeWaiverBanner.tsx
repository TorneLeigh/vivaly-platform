import { Button } from "@/components/ui/button";
import { X, Gift } from "lucide-react";
import { useState } from "react";

interface FeeWaiverBannerProps {
  feeWaiverCount?: number;
}

export default function FeeWaiverBanner({ feeWaiverCount = 0 }: FeeWaiverBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || feeWaiverCount <= 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5" />
          <div className="flex-1">
            <span className="font-medium">
              Great news! You have {feeWaiverCount} free booking{feeWaiverCount > 1 ? 's' : ''} available
            </span>
            <span className="ml-2 text-purple-100">
              Book now and save on platform fees
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Find Care Now
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}