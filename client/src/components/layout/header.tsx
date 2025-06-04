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
  const { isAuthenticated, isLoading, isProvider, user } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'seeker' | 'provider'>(isProvider ? 'provider' : 'seeker');

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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'seeker' ? 'provider' : 'seeker');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-black cursor-pointer" style={{ color: '#FF6B35' }}>
                VIVALY
              </h1>
            </Link>
          </div>

          {/* Role Toggle Buttons */}
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300 p-1 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewMode('seeker');
                  window.location.href = '/';
                }}
                className={`rounded-md px-2 md:px-3 py-1 text-xs md:text-sm transition-all ${
                  viewMode === 'seeker' 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                <span className="hidden md:inline">Search for Care</span>
                <span className="md:hidden">Search</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewMode('provider');
                  window.location.href = '/provider-dashboard';
                }}
                className={`rounded-md px-2 md:px-3 py-1 text-xs md:text-sm transition-all ${
                  viewMode === 'provider' 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                Caregiver
              </Button>
            </div>

            <nav className="hidden md:flex space-x-8">
              {!isAuthenticated || viewMode === 'seeker' ? (
                // Service Seeker Navigation
                <>
                  <Link href="/find-care" className={`text-warm-gray hover:text-coral transition-colors ${
                    location === '/find-care' ? 'text-coral' : ''
                  }`}>
                    Day Care
                  </Link>
                  <Link href="/find-care?category=services" className={`text-warm-gray hover:text-coral transition-colors ${
                    location.includes('/find-care') && location.includes('services') ? 'text-coral' : ''
                  }`}>
                    Services
                  </Link>
                </>
              ) : (
                // Caregiver Navigation
                <>
                  <Link href="/provider-dashboard" className={`text-warm-gray hover:text-coral transition-colors ${
                    location === '/provider-dashboard' ? 'text-coral' : ''
                  }`}>
                    Calendar
                  </Link>
                  <Link href="/messages" className={`text-warm-gray hover:text-coral transition-colors ${
                    location === '/messages' ? 'text-coral' : ''
                  }`}>
                    Messages
                  </Link>
                  <Link href="/provider-dashboard?tab=listings" className={`text-warm-gray hover:text-coral transition-colors ${
                    location.includes('listings') ? 'text-coral' : ''
                  }`}>
                    Services Listed
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <MenuIcon className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Role Toggle */}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={() => { toggleViewMode(); setMobileMenuOpen(false); }}
                    className="w-full text-sm"
                  >
                    {viewMode === 'provider' ? 'Switch to Searching for Care' : 'Switch to Caregiver Mode'}
                  </Button>
                )}

                {/* Mobile Navigation Links */}
                {!isAuthenticated || viewMode === 'seeker' ? (
                  // Service Seeker Navigation
                  <>
                    <Link href="/find-care" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Day Care
                    </Link>
                    <Link href="/find-care?category=services" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Services
                    </Link>
                  </>
                ) : (
                  // Caregiver Navigation
                  <>
                    <Link href="/provider-dashboard" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Calendar
                    </Link>
                    <Link href="/messages" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Messages
                    </Link>
                    <Link href="/provider-dashboard?tab=listings" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                      Services Listed
                    </Link>
                  </>
                )}

                <Link href="/gift-cards" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Gift Cards
                </Link>
                
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

          {!isAuthenticated ? (
            <Link href="/login">
              <Button className="bg-coral hover:bg-coral/90 text-white">
                Login
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/messages" className="flex items-center w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}