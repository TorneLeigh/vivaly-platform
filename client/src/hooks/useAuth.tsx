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
  isSwitchingRole: boolean;
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
    retry: 1,
    staleTime: 0, // Always check for fresh auth data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });



  // Role switching mutation
  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest('POST', '/api/auth/switch-role', { role });
      return response;
    },
    onSuccess: (data) => {
      // Invalidate first then patch the cache to avoid flicker
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.setQueryData(['/api/auth/user'], (oldData: User | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            activeRole: data.activeRole,
          };
        }
        return oldData;
      });
      
      toast({
        title: "Role switched",
        description: `Now viewing as ${data.activeRole}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error switching role",
        description: error.message || "Couldn't switch—please try again.",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
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
    if (role === (user as User)?.activeRole) return;
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
  const roles = (user as User)?.roles || [];
  const activeRole = (user as User)?.activeRole || '';

  return (
    <AuthContext.Provider
      value={{
        user: (user as User) || null,
        isAuthenticated,
        isLoading: !isInitialized,
        roles,
        activeRole,
        switchRole,
        isSwitchingRole: switchRoleMutation.isPending,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}