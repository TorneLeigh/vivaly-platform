import { Button } from "@/components/ui/button";

interface RoleToggleProps {
  roles: string[];
  activeRole: string;
  onSwitch: (role: string) => void;
  disabled?: boolean;
}

export default function RoleToggle({ roles, activeRole, onSwitch, disabled = false }: RoleToggleProps) {
  console.log("RoleToggle render - roles:", roles, "activeRole:", activeRole);
  
  if (roles.length <= 1) {
    return null; // Don't show toggle if user only has one role
  }

  return (
    <div className="flex rounded-lg border border-gray-300 p-0.5 bg-white shadow-sm">
      {roles.map((role) => (
        <Button
          key={role}
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("RoleToggle button clicked - switching to role:", role);
            console.log("Current activeRole:", activeRole);
            console.log("Button disabled:", disabled || role === activeRole);
            onSwitch(role);
          }}
          disabled={disabled || role === activeRole}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all min-w-[70px] ${
            role === activeRole 
              ? 'bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] text-white shadow-sm' 
              : 'text-gray-700 hover:text-black hover:bg-gray-100'
          }`}
        >
          {role === 'parent' ? 'Parent' : 'Caregiver'}
        </Button>
      ))}
    </div>
  );
}