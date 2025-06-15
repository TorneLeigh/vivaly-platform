import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function NewHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, roles, activeRole, switchRole, isSwitchingRole, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (mobileMenuOpen) {
      console.log("MOBILE MENU DEBUG:");
      console.log("isAuthenticated:", isAuthenticated);
      console.log("user:", user);
      console.log("roles:", roles);
      console.log("activeRole:", activeRole);
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900 flex items-center">
          <img 
            src="/attached_assets/LOGO UPLOAD VIVALY_1749697003124.jpeg" 
            alt="Vivaly Logo" 
            className="h-8 w-8 mr-3 rounded-lg object-cover"
          />
          Vivaly
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link href="/messages" className="text-gray-700 hover:text-black font-medium transition-colors">Messages</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-black font-medium transition-colors">Dashboard</Link>
            </>
          )}
          
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-black text-white text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth" className="text-gray-700 hover:text-black font-medium transition-colors">Log In</Link>
                <Link href="/signup" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden z-50 bg-white px-4 py-4 border-t border-gray-100 shadow-lg">
          {isAuthenticated && user ? (
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-black hover:text-white rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {activeRole === "parent" && (
                <Link
                  href="/job-board"
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-black hover:text-white rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Job Board
                </Link>
              )}

              {activeRole === "caregiver" && (
                <Link
                  href="/find-jobs"
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-black hover:text-white rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
              )}

              <Link
                href="/messages"
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-black hover:text-white rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </Link>

              <Link
                href="/profile"
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-black hover:text-white rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>

              {roles.length > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-3 px-4">Switch Role</p>
                  <div className="space-y-1">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setMobileMenuOpen(false);
                        }}
                        disabled={role === activeRole}
                        className={`block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          role === activeRole
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Link 
                href="/auth" 
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center py-3 px-4 bg-black text-white hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}