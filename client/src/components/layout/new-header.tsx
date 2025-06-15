import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NewHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, activeRole, logout } = useAuth();
  const [, navigate] = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderMobileLinks = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link href="/auth" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
            Log In
          </Link>
          <Link href="/signup" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
            Sign Up
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
          Dashboard
        </Link>
        {activeRole === "parent" && (
          <Link href="/post-job" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
            Post a Job
          </Link>
        )}
        {activeRole === "caregiver" && (
          <Link href="/find-jobs" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
            Find Jobs
          </Link>
        )}
        <Link href="/messages" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
          Messages
        </Link>
        <Link href="/profile" className="block py-2 text-gray-700 hover:text-black" onClick={closeMenu}>
          Profile
        </Link>
        <button 
          onClick={() => { handleLogout(); closeMenu(); }}
          className="block py-2 text-left w-full text-gray-600 hover:text-black"
        >
          Logout
        </button>
      </>
    );
  };

  const renderDesktopLinks = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link href="/auth" className="text-gray-700 hover:text-black">
            Log In
          </Link>
          <Link href="/signup" className="text-gray-700 hover:text-black">
            Sign Up
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/dashboard" className="text-gray-700 hover:text-black">
          Dashboard
        </Link>
        {activeRole === "parent" && (
          <Link href="/post-job" className="text-gray-700 hover:text-black">
            Post a Job
          </Link>
        )}
        {activeRole === "caregiver" && (
          <Link href="/find-jobs" className="text-gray-700 hover:text-black">
            Find Jobs
          </Link>
        )}
        <Link href="/messages" className="text-gray-700 hover:text-black">
          Messages
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <span className="text-sm font-medium">{user.firstName}</span>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-black ml-2"
          >
            Logout
          </button>
        </div>
      </>
    );
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-black">
            VIVALY
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {renderDesktopLinks()}
          </nav>

          {/* Mobile Header Right Side */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <span className="text-sm font-medium">{user.firstName}</span>
              </div>
            ) : null}
            
            {/* Mobile Menu Toggle */}
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3 shadow-md">
          <div className="flex flex-col space-y-3">
            {renderMobileLinks()}
          </div>
        </div>
      )}
    </header>
  );
}