import { Button } from "@/components/ui/button";

interface RoleToggleProps {
  roles: string[];
  activeRole: string;
  onSwitch: (role: string) => void;
  disabled?: boolean;
}

export default function RoleToggle({ roles, activeRole, onSwitch, disabled = false }: RoleToggleProps) {
  if (roles.length <= 1) {
    return null; // Don't show toggle if user only has one role
  }

  return (
    <div className="flex rounded-lg border border-gray-300 p-1 bg-white">
      {roles.map((role) => (
        <Button
          key={role}
          variant="ghost"
          size="sm"
          onClick={() => onSwitch(role)}
          disabled={disabled || role === activeRole}
          className={`rounded-md px-3 py-1 text-sm transition-all ${
            role === activeRole 
              ? 'bg-black text-white shadow-sm' 
              : 'text-gray-700 hover:text-black hover:bg-gray-100'
          }`}
        >
          {role === 'parent' ? 'Parent' : 'Caregiver'}
        </Button>
      ))}
    </div>
  );
}