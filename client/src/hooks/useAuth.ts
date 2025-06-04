import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const isProvider = user?.isNanny || user?.isCaregiver || user?.isChildcareProvider;
  const isSeeker = !isProvider && !!user;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isProvider,
    isSeeker,
  };
}