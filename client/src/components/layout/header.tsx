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
  X,
  Sparkles
} from "lucide-react";
import vivalyLogo from "@/assets/vivaly-logo-new.jpeg";
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
import RoleToggle from "@/components/RoleToggle";


export default function HeaderOLD_DISABLED() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user, roles, activeRole, switchRole } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  
  // Determine view mode based on current route
  const isProviderRoute = location.includes('/provider-dashboard') || location.includes('/childcare-dashboard') || 
                         location.includes('/become-nanny') || location.includes('/become-childcare-provider');
  const viewMode = isProviderRoute ? 'provider' : 'seeker';

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/logout", {});
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src={vivalyLogo} 
                  alt="VIVALY Logo" 
                  className="w-8 h-8 rounded-md object-cover shadow-sm"
                />
                <h1 className="text-2xl font-black text-coral">
                  VIVALY
                </h1>
              </div>
            </Link>
          </div>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Link href="/find-care" className="text-sm font-medium text-gray-700 hover:text-coral transition-colors">
                Find Care
              </Link>
              <Link href="/nanny-sharing" className="text-sm font-medium text-gray-700 hover:text-coral transition-colors">
                Nanny Sharing
              </Link>
              <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-coral transition-colors">
                Services
              </Link>
              <Link href="/gift-cards" className="text-sm font-medium text-gray-700 hover:text-coral transition-colors">
                Gift Cards
              </Link>
              <Link href="/help" className="text-sm font-medium text-gray-700 hover:text-coral transition-colors">
                Help
              </Link>
            </nav>
            
            {/* Role Toggle */}
            {isAuthenticated && roles.length > 1 && (
              <RoleToggle 
                roles={roles}
                activeRole={activeRole}
                onSwitch={switchRole}
              />
            )}
            
            {!isAuthenticated && !isLoading ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location.href = '/ai-chat'} 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  title="Need help finding the right carer? Use Smart Match"
                >
                  <Sparkles className="h-4 w-4" />
                  Smart Match
                </Button>
                <div className="flex items-center border border-gray-300 rounded-full p-1">
                  <Button variant="ghost" size="sm" className="rounded-full px-4 text-black hover:bg-pink-100 hover:text-gray-700" onClick={() => window.location.href = '/auth'}>
                    Log in
                  </Button>
                  <Button size="sm" className="rounded-full bg-coral hover:bg-pink-100 px-4 font-medium" style={{ color: '#000000' }} onClick={() => window.location.href = '/signup'}>
                    Sign up
                  </Button>
                </div>
              </>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/search'} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/messages'}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/ai-chat'} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative rounded-full p-2">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/account-settings'}>
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/messages'}>
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/help'}>
                      Help
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}
          </div>



          {/* Mobile/Tablet Menu Button - Airbnb style */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2">
                  <MenuIcon className="h-4 w-4" />
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">VIVALY</h2>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="border-t mx-6"></div>

                    {/* Role Toggle for Mobile */}
                    {isAuthenticated && roles.length > 1 && (
                      <div className="p-6">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Switch Role:</label>
                          <RoleToggle 
                            roles={roles}
                            activeRole={activeRole}
                            onSwitch={switchRole}
                          />
                        </div>
                      </div>
                    )}

                    <div className="border-t mx-6"></div>

                    {/* Navigation Links */}
                    <div className="p-6 space-y-4">
                      <Link href="/find-care" className="block text-lg font-medium text-gray-900 hover:text-coral py-3" onClick={() => setMobileMenuOpen(false)}>
                        Find Care
                      </Link>
                      <Link href="/nanny-sharing" className="block text-lg font-medium text-gray-900 hover:text-coral py-3" onClick={() => setMobileMenuOpen(false)}>
                        Nanny Sharing
                      </Link>
                      <Link href="/services" className="block text-lg font-medium text-gray-900 hover:text-coral py-3" onClick={() => setMobileMenuOpen(false)}>
                        All Services
                      </Link>
                      <Link href="/gift-cards" className="block text-lg font-medium text-gray-900 hover:text-coral py-3" onClick={() => setMobileMenuOpen(false)}>
                        Gift Cards
                      </Link>
                      <Link href="/help" className="block text-lg font-medium text-gray-900 hover:text-coral py-3" onClick={() => setMobileMenuOpen(false)}>
                        Help & Support
                      </Link>
                    </div>

                    <div className="border-t mx-6"></div>

                    {/* Auth Section */}
                    {!isAuthenticated ? (
                      <div className="p-6 space-y-4">
                        <div className="space-y-3">
                          <Button 
                            onClick={() => { window.location.href = '/ai-chat'; setMobileMenuOpen(false); }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2"
                          >
                            <Sparkles className="h-4 w-4" />
                            Smart Match
                          </Button>
                          <Button 
                            onClick={() => { window.location.href = '/become-caregiver'; setMobileMenuOpen(false); }}
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                          >
                            Switch to Caregiver
                          </Button>
                          <Button 
                            onClick={() => { window.location.href = '/become-service-provider'; setMobileMenuOpen(false); }}
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                          >
                            Switch to Service Provider
                          </Button>
                        </div>
                        
                        <div className="border-t pt-4 space-y-3">
                          <Button 
                            variant="ghost" 
                            onClick={() => { window.location.href = '/auth'; setMobileMenuOpen(false); }}
                            className="w-full justify-start text-left font-medium"
                          >
                            Log in
                          </Button>
                          <Button 
                            variant="ghost"
                            onClick={() => { window.location.href = '/signup'; setMobileMenuOpen(false); }}
                            className="w-full justify-start text-left font-medium"
                          >
                            Sign up
                          </Button>
                          <Button 
                            variant="ghost"
                            onClick={() => { window.location.href = '/help'; setMobileMenuOpen(false); }}
                            className="w-full justify-start text-left font-medium"
                          >
                            Help
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-4">
                        {/* User Type Switching - Available for authenticated users */}
                        <div className="space-y-3 mb-6">
                          {viewMode === 'seeker' ? (
                            <>
                              <Button 
                                onClick={() => { window.location.href = '/become-caregiver'; setMobileMenuOpen(false); }}
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                              >
                                Switch to Caregiver
                              </Button>
                              <Button 
                                onClick={() => { window.location.href = '/services'; setMobileMenuOpen(false); }}
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                              >
                                Switch to Services
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left font-medium"
                              onClick={() => { window.location.href = '/find-care'; setMobileMenuOpen(false); }}
                            >
                              Switch to Seeker
                            </Button>
                          )}
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          {viewMode === 'seeker' && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left font-medium flex items-center gap-2 text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                              onClick={() => { window.location.href = '/search'; setMobileMenuOpen(false); }}
                            >
                              <Search className="h-4 w-4" />
                              Search
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left font-medium flex items-center gap-2 text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => { window.location.href = '/messages'; setMobileMenuOpen(false); }}
                          >
                            <MessageCircle className="h-4 w-4" />
                            Messages
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => { window.location.href = '/profile'; setMobileMenuOpen(false); }}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => { window.location.href = '/account-settings'; setMobileMenuOpen(false); }}
                          >
                            Account Settings
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => { window.location.href = '/help'; setMobileMenuOpen(false); }}
                          >
                            Help
                          </Button>
                          <div className="border-t pt-4">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                            >
                              Sign out
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}