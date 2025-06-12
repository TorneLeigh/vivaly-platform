import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RoleToggle } from "@/components/role-toggle";
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
      <header className="flex justify-between items-center p-5 bg-white border-b border-gray-200 sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-black no-underline">
          Vivaly
        </Link>
        
        <nav className="hidden md:flex gap-5">
          <Link href="/child-care-services" className="text-black font-medium py-2 border-b-2 border-transparent hover:border-black transition-colors no-underline">
            Childcare
          </Link>
          <Link href="/pet-care-services" className="text-black font-medium py-2 border-b-2 border-transparent hover:border-black transition-colors no-underline">
            Pet Care
          </Link>
          <Link href="/aged-care-services" className="text-black font-medium py-2 border-b-2 border-transparent hover:border-black transition-colors no-underline">
            Aged Care
          </Link>
          <Link href="/prenatal-services" className="text-black font-medium py-2 border-b-2 border-transparent hover:border-black transition-colors no-underline">
            Pre/Post Natal
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-5">
          <RoleToggle />
          
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
              <Link href="/messages" className="text-black font-medium no-underline">
                Messages
              </Link>
              <Link href="/profile" className="text-black font-medium no-underline">
                Profile
              </Link>
              <Button 
                onClick={() => window.location.href = '/logout'}
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
        
        <div className="md:hidden flex flex-col cursor-pointer" onClick={toggleMobileMenu}>
          <div className="w-6 h-0.5 bg-black my-1"></div>
          <div className="w-6 h-0.5 bg-black my-1"></div>
          <div className="w-6 h-0.5 bg-black my-1"></div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden flex-col absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 ${mobileMenuOpen ? 'flex' : 'hidden'}`}>
        <div className="px-5 py-2">
          <Link href="/child-care-services" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Childcare
          </Link>
          <Link href="/pet-care-services" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Pet Care
          </Link>
          <Link href="/aged-care-services" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Aged Care
          </Link>
          <Link href="/prenatal-services" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Pre/Post Natal
          </Link>
          <Link href="/gift-card" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Gift Card
          </Link>
          <Link href="/help" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
            Help
          </Link>
          
          {!isAuthenticated && !isLoading ? (
            <>
              <Link href="/auth" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/signup" className="block py-3 text-black border-b border-gray-200 no-underline font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
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
    </>
  );
}