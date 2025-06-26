import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const url = queryKey[0] as string;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
      }
      throw error;
    }
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
