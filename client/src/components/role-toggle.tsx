import { useLocation } from "wouter";

interface RoleToggleProps {
  className?: string;
  variant?: 'default' | 'vivaly';
}

export default function RoleToggle({ className = "", variant = 'default' }: RoleToggleProps) {
  const [location, setLocation] = useLocation();
  
  // Determine current role based on route
  const isProviderRoute = location.includes('/provider-dashboard') || 
                         location.includes('/childcare-dashboard') || 
                         location.includes('/become-nanny') || 
                         location.includes('/become-childcare-provider') ||
                         location.includes('/become-caregiver');
  
  const currentRole = isProviderRoute ? 'provider' : 'seeker';

  const handleToggle = () => {
    if (currentRole === 'seeker') {
      setLocation('/become-caregiver');
    } else {
      setLocation('/');
    }
  };

  if (variant === 'vivaly') {
    return (
      <div className={`vivaly-role-toggle ${className}`}>
        <span className={`font-medium ${currentRole === 'seeker' ? 'text-gray-900' : 'text-gray-500'}`}>
          Parent
        </span>
        
        <label className="vivaly-switch">
          <input
            type="checkbox"
            checked={currentRole === 'provider'}
            onChange={handleToggle}
          />
          <span className="vivaly-slider"></span>
        </label>
        
        <span className={`font-medium ${currentRole === 'provider' ? 'text-gray-900' : 'text-gray-500'}`}>
          Caregiver
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      <span className={`font-medium ${currentRole === 'seeker' ? 'text-gray-900' : 'text-gray-500'}`}>
        Parent/Seeker
      </span>
      
      <label className="relative inline-block w-12 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={currentRole === 'provider'}
          onChange={handleToggle}
          className="opacity-0 w-0 h-0"
        />
        <span className={`absolute inset-0 rounded-full transition-all duration-400 ${
          currentRole === 'provider' ? 'bg-coral' : 'bg-gray-300'
        }`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-400 ${
            currentRole === 'provider' ? 'transform translate-x-6' : ''
          }`} />
        </span>
      </label>
      
      <span className={`font-medium ${currentRole === 'provider' ? 'text-gray-900' : 'text-gray-500'}`}>
        Caregiver/Provider
      </span>
    </div>
  );
}