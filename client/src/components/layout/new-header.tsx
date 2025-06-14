import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Menu } from "lucide-react";

export default function NewHeader() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user, roles, activeRole, switchRole, isSwitchingRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="relative flex justify-between items-center p-5 bg-white border-b border-gray-200 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-black no-underline">
          <img 
            src="/attached_assets/LOGO UPLOAD VIVALY_1749697003124.jpeg" 
            alt="Vivaly Logo" 
            className="h-8 w-8 rounded-lg object-cover"
          />
          Vivaly
        </Link>
        
        <nav className="hidden md:flex gap-5">
          {/* Navigation items - About Us moved to dropdown */}
        </nav>
        
        <div className="hidden md:flex items-center gap-5">
          
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
              <Link href="/messages" className="text-black font-medium no-underline">
                Messages
              </Link>
              <Link href="/profile" className="text-black font-medium no-underline">
                Profile
              </Link>
              <Button 
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', {
                      method: 'POST',
                      credentials: 'include'
                    });
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Logout failed:', error);
                    window.location.href = '/';
                  }
                }}
                className="px-4 py-2 bg-black text-white border-none rounded cursor-pointer font-medium hover:bg-gray-800"
              >
                Log Out
              </Button>
            </div>
          ) : null}
          
          {/* Dropdown Menu - Far Right */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-black font-medium py-2 hover:text-gray-600 transition-colors"
            >
              <Menu size={20} />
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link 
                  href="/gift-card" 
                  className="block px-4 py-3 text-black hover:bg-gray-50 no-underline border-b border-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Gift Card
                </Link>
                {!isAuthenticated && !isLoading && (
                  <Link 
                    href="/about" 
                    className="block px-4 py-3 text-black hover:bg-gray-50 no-underline border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    About Us
                  </Link>
                )}
                <Link 
                  href="/help" 
                  className="block px-4 py-3 text-black hover:bg-gray-50 no-underline"
                  onClick={() => setDropdownOpen(false)}
                >
                  Help
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 cursor-pointer border border-gray-300 rounded bg-white hover:bg-gray-50" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="w-5 h-0.5 bg-black mb-1"></div>
          <div className="w-5 h-0.5 bg-black mb-1"></div>
          <div className="w-5 h-0.5 bg-black"></div>
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="bg-white px-4 py-4 border-t border-gray-200 space-y-2">
            {/* If logged in */}
            {isAuthenticated && user ? (
              <>
                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className="block py-2 text-black border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {/* Role-specific links */}
                {activeRole === "parent" && (
                  <Link
                    href="/job-board"
                    className="block py-2 text-black border-b border-gray-100 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Job Board
                  </Link>
                )}

                {activeRole === "caregiver" && (
                  <Link
                    href="/find-jobs"
                    className="block py-2 text-black border-b border-gray-100 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                )}

                <Link
                  href="/messages"
                  className="block py-2 text-black border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>

                <Link
                  href="/profile"
                  className="block py-2 text-black border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                {/* Role switcher if user has both roles */}
                {roles.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-1">Switch Role</p>
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => switchRole(role)}
                        disabled={role === activeRole || isSwitchingRole}
                        className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
                          role === activeRole
                            ? "bg-gray-200 text-black font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    try {
                      await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                      });
                      window.location.href = '/';
                    } catch (error) {
                      console.error('Logout failed:', error);
                      window.location.href = '/';
                    }
                  }}
                  className="block w-full text-left py-2 text-black font-medium bg-transparent border-none cursor-pointer border-b border-gray-100"
                >
                  Log Out
                </button>
              </>
            ) : (
              // If NOT logged in, show login/signup
              <>
                <Link href="/auth" className="block py-2 text-black font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" className="block py-2 text-black font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}