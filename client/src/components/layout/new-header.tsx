import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RoleToggle } from "@/components/role-toggle";
import { useAuth } from "@/hooks/useAuth";

export default function NewHeader() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Button 
                onClick={() => window.location.href = '/become-caregiver'}
                className="px-4 py-2 bg-black text-white border-none rounded cursor-pointer font-medium hover:bg-gray-800"
              >
                Become a Carer
              </Button>
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
        </div>
        
        <div className="md:hidden flex flex-col cursor-pointer" onClick={toggleMobileMenu}>
          <div className="w-6 h-0.5 bg-black my-1"></div>
          <div className="w-6 h-0.5 bg-black my-1"></div>
          <div className="w-6 h-0.5 bg-black my-1"></div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden flex-col absolute top-15 right-5 bg-white border border-gray-200 p-2.5 shadow-lg ${mobileMenuOpen ? 'flex' : 'hidden'}`}>
        <Link href="/child-care-services" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
          Childcare
        </Link>
        <Link href="/pet-care-services" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
          Pet Care
        </Link>
        <Link href="/aged-care-services" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
          Aged Care
        </Link>
        
        {!isAuthenticated && !isLoading ? (
          <>
            <Link href="/auth" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
              Log In
            </Link>
            <Link href="/signup" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
            <Link href="/become-caregiver" className="py-2.5 text-black no-underline" onClick={() => setMobileMenuOpen(false)}>
              Become a Carer
            </Link>
          </>
        ) : isAuthenticated ? (
          <>
            <Link href="/messages" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
              Messages
            </Link>
            <Link href="/profile" className="py-2.5 text-black border-b border-gray-200 no-underline" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </Link>
            <Link href="/logout" className="py-2.5 text-black no-underline" onClick={() => setMobileMenuOpen(false)}>
              Log Out
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
}