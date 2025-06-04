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
  
  // Determine view mode based on current route
  const isProviderRoute = location.includes('/provider-dashboard') || location.includes('/childcare-dashboard') || 
                         location.includes('/become-nanny') || location.includes('/become-childcare-provider');
  const viewMode = isProviderRoute ? 'provider' : 'seeker';

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
      window.location.href = '/';
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
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-black cursor-pointer text-black">
                VIVALY
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation - Only show when authenticated */}
            {isAuthenticated && (
              <nav className="flex space-x-8">
                {viewMode === 'seeker' ? (
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
            )}

            {/* Auth Buttons or User Menu */}
            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => window.location.href = '/login'}>
                  Sign In
                </Button>
                <Button className="bg-coral hover:bg-coral/90" onClick={() => window.location.href = '/auth'}>
                  Join VIVALY
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Role Toggle Buttons */}
                <div className="flex rounded-lg border border-gray-300 p-1 bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/'}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'seeker' 
                        ? 'bg-coral text-white hover:bg-coral/90' 
                        : 'text-gray-700 hover:text-coral'
                    }`}
                  >
                    Search for Care
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/provider-dashboard'}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'provider' 
                        ? 'bg-coral text-white hover:bg-coral/90' 
                        : 'text-gray-700 hover:text-coral'
                    }`}
                  >
                    Caregiver
                  </Button>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/messages'}>
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu - Positioned on the right */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <MenuIcon className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {!isAuthenticated ? (
                    // Show auth buttons when not logged in
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => { window.location.href = '/login'; setMobileMenuOpen(false); }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-coral hover:bg-coral/90"
                        onClick={() => { window.location.href = '/auth'; setMobileMenuOpen(false); }}
                      >
                        Join VIVALY
                      </Button>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 text-center">
                          Sign in to search for care and book services
                        </p>
                      </div>
                    </>
                  ) : (
                    // Show navigation when authenticated
                    <>
                      {/* Mobile Role Toggle */}
                      <div className="flex space-x-2">
                        <Button
                          variant={viewMode === 'seeker' ? 'default' : 'outline'}
                          onClick={() => { window.location.href = '/'; setMobileMenuOpen(false); }}
                          className="flex-1 text-sm"
                        >
                          Search for Care
                        </Button>
                        <Button
                          variant={viewMode === 'provider' ? 'default' : 'outline'}
                          onClick={() => { window.location.href = '/provider-dashboard'; setMobileMenuOpen(false); }}
                          className="flex-1 text-sm"
                        >
                          Caregiver
                        </Button>
                      </div>

                      {/* Mobile Navigation Links */}
                      {viewMode === 'seeker' ? (
                        <>
                          <Link href="/find-care" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                            Day Care
                          </Link>
                          <Link href="/find-care?category=services" className="text-gray-700 hover:text-coral font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                            Services
                          </Link>
                        </>
                      ) : (
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

                      {/* Mobile User Actions */}
                      <div className="border-t pt-4 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => { window.location.href = '/profile'; setMobileMenuOpen(false); }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => { window.location.href = '/messages'; setMobileMenuOpen(false); }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Messages
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}