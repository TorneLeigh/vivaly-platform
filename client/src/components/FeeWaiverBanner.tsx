import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift } from "lucide-react";

const FeeWaiverBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleReferralClick = () => {
    console.log("Referral program clicked");
    // Add referral program logic here
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5" />
          <div>
            <div className="font-bold text-lg mb-1">Refer & Earn</div>
            <div className="text-sm">
              Know someone who needs quality childcare or caregivers looking for work? Share Vivaly and save when they book their first service.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 border-white hover:bg-white hover:text-purple-600"
            onClick={handleReferralClick}
          >
            LOG IN
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { FeeWaiverBanner };
export default FeeWaiverBanner;