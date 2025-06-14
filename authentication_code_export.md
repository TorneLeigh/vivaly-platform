# Authentication & Role Switching Code Export

## Problem Description
User can log in successfully (backend confirms authentication) but frontend doesn't show authenticated state. After login, page redirects to home but doesn't display role toggle, dashboard links, or authenticated UI elements.

## Key Files for Debugging

### 1. Authentication Hook (`client/src/hooks/useAuth.tsx`)
```typescript
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
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Debug user data changes
  console.log("useAuth hook - user data:", user);
  console.log("useAuth hook - isLoading:", isLoading);
  console.log("useAuth hook - error:", error);

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
```

### 2. Login Component (`client/src/pages/auth.tsx` - relevant parts)
```typescript
const loginMutation = useMutation({
  mutationFn: async (data: LoginForm) => {
    return await apiRequest("POST", "/api/login", data);
  },
  onSuccess: async (user: any) => {
    // Set the user data in the query cache first
    queryClient.setQueryData(["/api/auth/user"], user);
    
    // Invalidate and refetch to ensure fresh data
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
    
    // Navigate after ensuring cache is updated
    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  },
  onError: (error: any) => {
    toast({
      title: "Login Failed",
      description: error.message || "Invalid email or password.",
      variant: "destructive",
    });
  },
});
```

### 3. Query Client Configuration (`client/src/lib/queryClient.ts`)
```typescript
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: HeadersInit = { 
      credentials: "include" 
    };
    
    // For auth endpoints, add cache-busting headers
    if (queryKey[0] === '/api/auth/user') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Allow refetching for auth queries
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### 4. Header Component (`client/src/components/layout/new-header.tsx` - auth section)
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function NewHeader() {
  const { isAuthenticated, isLoading, user, roles, activeRole, switchRole, isSwitchingRole, logout } = useAuth();

  // Auth section in header
  {!isAuthenticated && !isLoading ? (
    <>
      <div className="flex gap-4">
        <Link href="/auth" className="text-black font-medium no-underline">
          Log In
        </Link>
        <Link href="/signup" className="text-black font-medium no-underline">
          Sign Up
        </Link>
      </div>
    </>
  ) : isAuthenticated ? (
    <div className="flex items-center gap-4">
      {/* Parent/Caregiver Toggles */}
      {roles.length > 1 && (
        <div 
          className="flex items-center gap-2 bg-gray-100 rounded-lg p-1"
          role="group"
          aria-label="Switch role"
        >
          {roles.map((role) => (
            <button 
              key={role}
              onClick={() => switchRole(role)}
              disabled={isSwitchingRole || role === activeRole}
              aria-pressed={role === activeRole}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                role === activeRole
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600 hover:bg-white hover:text-black'
              }`}
            >
              {isSwitchingRole && role !== activeRole ? 'Switching...' : role === 'parent' ? 'Parent' : 'Caregiver'}
            </button>
          ))}
        </div>
      )}
      <Link href={activeRole === 'parent' ? "/dashboard" : "/job-board"} className="text-black font-medium no-underline">
        {activeRole === 'parent' ? 'Dashboard' : 'Job Board'}
      </Link>
      
      <Button
        onClick={logout}
        variant="outline"
        size="sm"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Log Out
      </Button>
    </div>
  ) : null}
}
```

### 5. Backend Authentication Endpoints (server/routes.ts)
```typescript
// Get current user endpoint
app.get('/api/auth/user', requireAuth, async (req, res) => {
  try {
    // `requireAuth` has already loaded the user onto req.user
    const user = (req as any).user;
    const activeRole = req.session.activeRole || user.roles?.[0] || 'parent';
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || ['parent'],
      activeRole: activeRole,
      isNanny: user.isNanny || false,
    });
  } catch (err) {
    console.error('Error in /api/auth/user:', err);
    res.status(500).json({ message: 'Could not fetch user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  // ... login logic ...
  
  // Set session
  req.session.userId = user.id;
  req.session.activeRole = requestedRole;
  
  // Return user data
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: userRoles,
    activeRole: requestedRole,
    isNanny: user.isNanny || false
  });
});
```

## Backend Test Results (Working)
```bash
# Login works
curl -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"multiuser@example.com","password":"password123","role":"parent"}' \
  http://localhost:5000/api/login
# Returns: {"id":"user_123","email":"multiuser@example.com",...,"activeRole":"parent"}

# User endpoint works
curl -b cookies.txt http://localhost:5000/api/auth/user
# Returns: {"id":"user_123","email":"multiuser@example.com",...,"activeRole":"parent"}

# Role switching works
curl -b cookies.txt -H "Content-Type: application/json" \
  -d '{"role":"caregiver"}' \
  http://localhost:5000/api/auth/switch-role
# Returns: {"activeRole":"caregiver","roles":["parent","caregiver"]}
```

## Problem Symptoms
1. Login API call succeeds (returns user data)
2. Page redirects to home
3. Frontend doesn't show authenticated state (no role toggle, no dashboard link)
4. Console shows "useAuth hook - user data: null" despite successful login
5. The `/api/auth/user` endpoint works in curl but frontend query might not be fetching correctly

## Test User Credentials
- Email: multiuser@example.com
- Password: password123
- Has both parent and caregiver roles

## Questions for Debugging
1. Why is the frontend useAuth hook not detecting the authenticated state after login?
2. Is the session cookie being properly set/sent by the browser?
3. Is there a timing issue with the query cache invalidation?
4. Is the React Query cache not properly updating after login?