import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Menu } from "lucide-react";

export default function NewHeader() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
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
          {!isAuthenticated && !isLoading && (
            <Link href="/about" className="text-black font-medium no-underline hover:text-orange-600">
              About Us
            </Link>
          )}
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
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button className="px-3 py-1 text-sm font-medium rounded-md bg-white text-black shadow-sm">
                  Parent
                </button>
                <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-600 hover:bg-white hover:text-black transition-colors">
                  Caregiver
                </button>
              </div>
              <Link href="/job-board" className="text-black font-medium no-underline">
                Job Board
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
                <Link 
                  href="/about" 
                  className="block px-4 py-3 text-black hover:bg-gray-50 no-underline border-b border-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  About
                </Link>
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
          <div className="px-5 py-2">

            <Link href="/gift-card" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
              Gift Card
            </Link>
            <Link href="/help" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
              Help
            </Link>
            
            {!isAuthenticated && !isLoading ? (
              <div className="pt-4 pb-2">
                <Link href="/auth" className="block mb-3 px-4 py-3 bg-black text-white text-center rounded-lg no-underline font-medium hover:bg-gray-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" className="block px-4 py-3 bg-black text-white text-center rounded-lg no-underline font-medium hover:bg-gray-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            ) : isAuthenticated ? (
              <>
                <Link href="/messages" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
                <Link href="/profile" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/logout" className="block py-3 text-black no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Log Out
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}