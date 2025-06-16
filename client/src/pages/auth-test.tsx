import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleToggle from "@/components/RoleToggle";

export default function AuthTest() {
  const { user, isAuthenticated, isLoading, roles, activeRole, switchRole, logout } = useAuth();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to test authentication.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">User Information:</h3>
            <p>Name: {user?.firstName} {user?.lastName}</p>
            <p>Email: {user?.email}</p>
            <p>ID: {user?.id}</p>
          </div>

          <div>
            <h3 className="font-semibold">Roles:</h3>
            <p>Available roles: {roles.join(', ')}</p>
            <p>Active role: {activeRole}</p>
            <p>Has multiple roles: {roles.length > 1 ? 'Yes' : 'No'}</p>
          </div>

          {roles.length > 1 && (
            <div>
              <h3 className="font-semibold mb-2">Role Toggle:</h3>
              <RoleToggle 
                roles={roles}
                activeRole={activeRole}
                onSwitch={switchRole}
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
            <Button onClick={() => window.location.href = '/profile'}>
              Go to Profile
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}