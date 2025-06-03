import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  MenuIcon, 
  MessageCircle, 
  User,
  Search,
  Plus,
  Heart,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-coral cursor-pointer">
                CareConnect
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/search">
              <a className={`text-warm-gray hover:text-coral transition-colors ${
                location.startsWith('/search') ? 'text-coral' : ''
              }`}>
                Find Care
              </a>
            </Link>
            <Link href="/become-nanny">
              <a className={`text-warm-gray hover:text-coral transition-colors ${
                location === '/become-nanny' ? 'text-coral' : ''
              }`}>
                Sign Up as Caregiver
              </a>
            </Link>
            <Link href="/verification">
              <a className={`text-warm-gray hover:text-coral transition-colors ${
                location === '/verification' ? 'text-coral' : ''
              }`}>
                Offer Your Services
              </a>
            </Link>
            <Link href="/gift-cards">
              <a className={`text-warm-gray hover:text-coral transition-colors ${
                location === '/gift-cards' ? 'text-coral' : ''
              }`}>
                Gift Cards
              </a>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {!isAuthenticated && (
              <Link href="/login">
                <Button className="bg-coral hover:bg-coral/90 text-white">
                  Login
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <MenuIcon className="h-4 w-4" />
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated && (
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                )}


                
                {isAuthenticated && (
                  <DropdownMenuItem>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                )}
                
                {isAuthenticated && (
                  <>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </>
                )}
                

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
