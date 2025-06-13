import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to VIVALY!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your account has been created successfully. You can now
          access all the services you selected.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => setLocation("/")}
            className="w-full bg-black hover:bg-gray-800 text-white py-3"
          >
            Explore VIVALY
          </Button>
          
          <Button 
            onClick={() => setLocation("/parent-profile")}
            variant="outline"
            className="w-full py-3"
          >
            Complete Your Profile
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Check your email for a welcome message with tips to get started.
          </p>
        </div>
      </div>
    </div>
  );
}