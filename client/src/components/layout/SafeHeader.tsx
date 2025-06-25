import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/Screenshot 2025-06-16 at 15.57.36_1750053474312.png";

// Safe header that doesn't use hooks that might fail
export default function SafeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
            <img src={logoImage} alt="VIVALY" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/find-care" className="text-gray-700 hover:text-black font-medium">
              Find Care
            </Link>
            <Link href="/nanny-sharing" className="text-gray-700 hover:text-black font-medium">
              Nanny Sharing
            </Link>
            <Link href="/become-nanny" className="text-gray-700 hover:text-black font-medium">
              Become a Caregiver
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            <Link href="/find-care" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={closeMenu}>
              Find Care
            </Link>
            <Link href="/nanny-sharing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={closeMenu}>
              Nanny Sharing
            </Link>
            <Link href="/become-nanny" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={closeMenu}>
              Become a Caregiver
            </Link>
            <div className="border-t border-gray-200 pt-3">
              <Button variant="ghost" className="w-full mb-2" onClick={() => { navigate("/auth"); closeMenu(); }}>
                Log In
              </Button>
              <Button className="w-full" onClick={() => { navigate("/auth"); closeMenu(); }}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}