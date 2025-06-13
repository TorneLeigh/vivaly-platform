import { useState } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeeWaiverBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 relative">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="h-5 w-5 text-emerald-100" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              <span className="font-bold">Limited Time:</span> No platform fees for your first booking! 
              <span className="ml-2 text-emerald-100">Save up to $50</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white text-emerald-600 border-white hover:bg-emerald-50 hover:text-emerald-700 text-xs px-3 py-1"
            onClick={() => {
              // Navigate to booking or show referral info
              console.log("Referral program clicked");
            }}
          >
            Learn More
          </Button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-emerald-100 hover:text-white transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}