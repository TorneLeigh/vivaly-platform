import { useLocation } from "wouter";

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

  const handleRoleChange = (role: 'seeker' | 'provider') => {
    if (role === 'provider') {
      setLocation('/become-caregiver');
    } else {
      setLocation('/');
    }
  };

  return (
    <div className={`role-button-toggle flex gap-2.5 ${className}`}>
      <button
        onClick={() => handleRoleChange('seeker')}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
          currentRole === 'seeker'
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`}
      >
        Parent / Seeker
      </button>
      <button
        onClick={() => handleRoleChange('provider')}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
          currentRole === 'provider'
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`}
      >
        Caregiver / Provider
      </button>
    </div>
  );
}