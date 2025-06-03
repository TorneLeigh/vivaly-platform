import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  MenuIcon, 
  MessageCircle, 
  User,
  Search,
  Plus,
  Heart,
  Users,
  X
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
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/search" className={`text-warm-gray hover:text-coral transition-colors ${
              location.startsWith('/search') ? 'text-coral' : ''
            }`}>
              Find Care
            </Link>
            <Link href="/become-nanny" className={`text-warm-gray hover:text-coral transition-colors ${
              location === '/become-nanny' ? 'text-coral' : ''
            }`}>
              Sign Up as Caregiver
            </Link>
            <Link href="/verification" className={`text-warm-gray hover:text-coral transition-colors ${
              location === '/verification' ? 'text-coral' : ''
            }`}>
              Offer Your Services
            </Link>
            <Link href="/gift-cards" className={`text-warm-gray hover:text-coral transition-colors ${
              location === '/gift-cards' ? 'text-coral' : ''
            }`}>
              Gift Cards
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="/search" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Find Care
                  </Link>
                  <Link href="/become-nanny" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up as Caregiver
                  </Link>
                  <Link href="/verification" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Offer Your Services
                  </Link>
                  <Link href="/gift-cards" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Gift Cards
                  </Link>
                  {isAuthenticated && (
                    <Link href="/messages" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Messages
                    </Link>
                  )}
                  {!isAuthenticated ? (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="bg-coral hover:bg-coral/90 text-white w-full">
                        Login
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/search">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Link href="/messages">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {!isAuthenticated && (
              <Link href="/login">
                <Button className="bg-coral hover:bg-coral/90 text-white hidden md:flex">
                  Login
                </Button>
              </Link>
            )}

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    <Link href="/nanny-dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
