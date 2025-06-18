import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleToggle from "@/components/RoleToggle";
import logoImage from "@assets/Screenshot 2025-06-16 at 15.57.36_1750053474312.png";

export default function NewHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, activeRole, roles, switchRole, logout } = useAuth();
  const [, navigate] = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderNavLinks = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link href="/working-auth" className="block py-2 text-gray-700 hover:text-black">
            Log In
          </Link>
          <Link href="/signup" className="block py-2 text-gray-700 hover:text-black">
            Sign Up
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-black">
          Dashboard
        </Link>
        <Link href={`/${activeRole}/bookings`} className="block py-2 text-gray-700 hover:text-black">
          My Bookings
        </Link>
        <Link href="/job-board" className="block py-2 text-gray-700 hover:text-black">
          Job Board
        </Link>
        {activeRole === "parent" && (
          <Link href="/post-job" className="block py-2 text-gray-700 hover:text-black">
            Post Job
          </Link>
        )}
        <Link href="/profile" className="block py-2 text-gray-700 hover:text-black">
          Profile
        </Link>
        <Link href="/messages" className="block py-2 text-gray-700 hover:text-black">
          Messages
        </Link>
        
        {/* Mobile Role Toggle */}
        {roles && roles.length > 1 && (
          <div className="py-2 border-b border-gray-100 mb-2">
            <p className="text-xs text-gray-500 mb-2">Switch Role:</p>
            <RoleToggle 
              roles={roles} 
              activeRole={activeRole || 'parent'} 
              onSwitch={switchRole} 
            />
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="block py-2 text-left w-full text-gray-700 hover:text-red-600"
        >
          Log Out
        </button>
      </>
    );
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src={logoImage} 
            alt="VIVALY" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold text-black hover:text-gray-800 transition-colors">
            VIVALY
          </span>
        </Link>

        {/* Right side (desktop + mobile avatar) */}
        <div className="flex items-center space-x-4">
          {/* Avatar (always visible when logged in) */}
          {isAuthenticated && user && (
            <Link href="/profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{user.firstName}</span>
            </Link>
          )}

          {/* Burger menu toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-black font-medium transition-colors">Dashboard</Link>
                <Link href={`/${activeRole}/bookings`} className="text-gray-700 hover:text-black font-medium transition-colors">My Bookings</Link>
                <Link href="/job-board" className="text-gray-700 hover:text-black font-medium transition-colors">Job Board</Link>
                
                {activeRole === 'parent' && (
                  <Link href="/post-job" className="text-gray-700 hover:text-black font-medium transition-colors">Post Job</Link>
                )}

                <Link href="/profile" className="text-gray-700 hover:text-black font-medium transition-colors">Profile</Link>
                <Link href="/messages" className="text-gray-700 hover:text-black font-medium transition-colors">Messages</Link>
                
                {/* Role Toggle */}
                {roles && roles.length > 1 && (
                  <RoleToggle 
                    roles={roles}
                    activeRole={activeRole || 'parent'}
                    onSwitch={switchRole}
                  />
                )}
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/working-auth" className="text-gray-700 hover:text-black">Log In</Link>
                <Link href="/signup" className="text-black font-medium">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200 bg-white shadow">
          {renderNavLinks()}
        </div>
      )}
    </header>
  );
}