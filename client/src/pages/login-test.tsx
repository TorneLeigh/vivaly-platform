import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function LoginTest() {
  const [email, setEmail] = useState("test@vivaly.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("parent");
  const { toast } = useToast();
  const { isAuthenticated, user, roles, activeRole, switchRole, logout } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; role: string }) => {
      return await apiRequest("POST", "/api/login", data);
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password, role });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Logged In Successfully</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p><strong>User:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Roles:</strong> {roles?.join(", ")}</p>
                <p><strong>Active Role:</strong> {activeRole}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Look at the header - you should see the role toggle in the center!
                </p>
              </div>

              {roles && roles.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Switch Role:</p>
                  {roles.map((r) => (
                    <Button
                      key={r}
                      variant={r === activeRole ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchRole(r)}
                      className="mr-2"
                    >
                      {r === "parent" ? "Parent" : "Caregiver"}
                    </Button>
                  ))}
                </div>
              )}

              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Login - Role Toggle Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Login as</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={role === "parent" ? "default" : "outline"}
                    onClick={() => setRole("parent")}
                    className="flex-1"
                  >
                    Parent
                  </Button>
                  <Button
                    type="button"
                    variant={role === "caregiver" ? "default" : "outline"}
                    onClick={() => setRole("caregiver")}
                    className="flex-1"
                  >
                    Caregiver
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p><strong>Instructions:</strong></p>
              <p>1. Login with the test account</p>
              <p>2. Check the header - role toggle should appear in center</p>
              <p>3. Try switching roles to test functionality</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}