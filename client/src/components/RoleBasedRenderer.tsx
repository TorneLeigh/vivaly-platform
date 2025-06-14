import { useAuth } from "@/hooks/useAuth";

interface RoleBasedRendererProps {
  role: string;
  children: React.ReactNode;
}

export function RoleBasedRenderer({ role, children }: RoleBasedRendererProps) {
  const { activeRole } = useAuth();
  console.log(`RoleBasedRenderer - required role: ${role}, current activeRole: ${activeRole}`);
  return activeRole === role ? <>{children}</> : null;
}

export default RoleBasedRenderer;