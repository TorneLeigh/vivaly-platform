import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift } from "lucide-react";

export function ReferralBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 relative mb-6 rounded-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5" />
          <span className="font-medium">
            Invite family and friends to join the Vivaly community and get 3 fee-free bookings!
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 border-white bg-white hover:bg-gray-100 hover:text-purple-700"
          >
            Share Your Link
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
}