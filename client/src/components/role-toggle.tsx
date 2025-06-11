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

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value;
    if (selectedRole === 'provider') {
      setLocation('/become-caregiver');
    } else {
      setLocation('/');
    }
  };

  return (
    <div className={`role-toggle ${className}`}>
      <select
        id="roleToggle"
        value={currentRole}
        onChange={handleRoleChange}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral bg-white"
      >
        <option value="seeker">Parent / Seeker</option>
        <option value="provider">Caregiver / Provider</option>
      </select>
    </div>
  );
}