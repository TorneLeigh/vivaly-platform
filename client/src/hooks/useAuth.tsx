import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  activeRole: string;
  isNanny: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  activeRole: string;
  switchRole: (role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: true,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Role switching mutation
  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest('/api/auth/switch-role', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      return response;
    },
    onSuccess: (data) => {
      // Update the user query cache with new active role
      queryClient.setQueryData(['/api/auth/user'], (oldData: User | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            activeRole: data.activeRole,
          };
        }
        return oldData;
      });
      
      // Invalidate relevant queries that might depend on role
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Role switched",
        description: `Now viewing as ${data.activeRole}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error switching role",
        description: error.message || "Failed to switch role",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      queryClient.clear();
      window.location.href = '/';
    },
  });

  const switchRole = async (role: string) => {
    if (role === user?.activeRole) return;
    await switchRoleMutation.mutateAsync(role);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Initialize auth state
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  const isAuthenticated = !!user && !error;
  const roles = user?.roles || [];
  const activeRole = user?.activeRole || '';

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated,
        isLoading: !isInitialized,
        roles,
        activeRole,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}