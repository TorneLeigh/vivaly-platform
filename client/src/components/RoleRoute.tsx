import { useAuth } from "@/hooks/useAuth";

interface RoleRouteProps {
  parent?: React.ComponentType;
  caregiver?: React.ComponentType;
  fallback?: React.ComponentType;
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export function RoleRoute({ 
  parent: ParentComponent, 
  caregiver: CaregiverComponent, 
  fallback: FallbackComponent,
  allowedRoles,
  children 
}: RoleRouteProps) {
  const { activeRole } = useAuth();

  // If using allowedRoles with children pattern
  if (allowedRoles && children) {
    if (allowedRoles.includes(activeRole || '')) {
      return <>{children}</>;
    }
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">Your current role does not have access to this page.</p>
        </div>
      </div>
    );
  }

  // Legacy component pattern
  if (activeRole === 'parent' && ParentComponent) {
    return <ParentComponent />;
  }
  
  if (activeRole === 'caregiver' && CaregiverComponent) {
    return <CaregiverComponent />;
  }
  
  if (FallbackComponent) {
    return <FallbackComponent />;
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600">Your current role does not have access to this page.</p>
      </div>
    </div>
  );
}

export default RoleRoute;