import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Users, Heart } from "lucide-react";

interface RoleToggleProps {
  className?: string;
}

export default function RoleToggle({ className = "" }: RoleToggleProps) {
  const [location, setLocation] = useLocation();
  
  // Determine current role based on route
  const isProviderRoute = location.includes('/provider-dashboard') || 
                         location.includes('/childcare-dashboard') || 
                         location.includes('/become-nanny') || 
                         location.includes('/become-childcare-provider') ||
                         location.includes('/become-caregiver');
  
  const currentRole = isProviderRoute ? 'provider' : 'seeker';

  const handleRoleSwitch = (role: 'seeker' | 'provider') => {
    if (role === 'seeker') {
      setLocation('/');
    } else {
      setLocation('/become-caregiver');
    }
  };

  return (
    <div className={`flex items-center bg-gray-100 rounded-full p-1 ${className}`}>
      <Button
        variant={currentRole === 'seeker' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleRoleSwitch('seeker')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          currentRole === 'seeker'
            ? 'bg-coral text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
        }`}
      >
        <Users className="h-4 w-4 mr-2" />
        Parent/Seeker
      </Button>
      <Button
        variant={currentRole === 'provider' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleRoleSwitch('provider')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          currentRole === 'provider'
            ? 'bg-coral text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
        }`}
      >
        <Heart className="h-4 w-4 mr-2" />
        Caregiver/Provider
      </Button>
    </div>
  );
}