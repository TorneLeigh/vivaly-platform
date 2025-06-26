import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    const contentType = res.headers.get("content-type");
    
    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${res.status}`;
      } else {
        const text = await res.text();
        errorMessage = text || res.statusText || `HTTP ${res.status}`;
      }
    } catch (parseError) {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
}

const getBaseURL = () => {
  // In Replit environment, always use relative URLs (same origin)
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit.dev')) {
    return '';
  }
  
  // For production builds, detect if we're on Vercel and use relative URLs
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    // If VITE_API_BASE_URL is set, use it; otherwise check domain for vivaly.com.au
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    // If we're on vivaly.com.au, use the Replit backend (without port specification)
    if (window.location.hostname === 'vivaly.com.au' || window.location.hostname.includes('vivaly')) {
      return 'https://db0de57c-0227-4a6d-a48b-bd0f45c473a6-00-srrgnf845gfb.riker.replit.dev';
    }
    
    // Otherwise use relative URLs for same-origin deployment
    return '';
  }
  // For development, use the configured API URL or default to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const baseURL = getBaseURL();
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
  
  console.log(`API Request: ${method} ${fullUrl}`, data ? { body: data } : '');
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`API Response: ${res.status} ${res.statusText}`);
    
    await throwIfResNotOk(res);
    return await res.json();
  } catch (error) {
    console.error(`API Error for ${method} ${fullUrl}:`, error);
    throw error;
  }
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
    
    const url = queryKey[0] as string;
    const baseURL = getBaseURL();
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    
    const res = await fetch(fullUrl, {
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
      refetchOnWindowFocus: true,
      staleTime: 0, // Always check for fresh data
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
