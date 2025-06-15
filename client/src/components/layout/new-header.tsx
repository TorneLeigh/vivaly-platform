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
        {activeRole === "parent" && (
          <Link href="/post-job" className="block py-2 text-gray-700 hover:text-black">
            Post a Job
          </Link>
        )}
        {activeRole === "caregiver" && (
          <Link href="/job-board" className="block py-2 text-gray-700 hover:text-black">
            Find Jobs
          </Link>
        )}
        <Link href="/messages" className="block py-2 text-gray-700 hover:text-black">
          Messages
        </Link>
        <Link href="/profile" className="block py-2 text-gray-700 hover:text-black">
          Profile
        </Link>
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
        <Link href="/" className="text-xl font-bold text-black">
          VIVALY
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

          {/* Desktop nav (optional) */}
          <nav className="hidden md:flex space-x-6 items-center">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-black font-medium transition-colors">Dashboard</Link>

                {activeRole === 'parent' && (
                  <Link href="/post-job" className="text-gray-700 hover:text-black font-medium transition-colors">Post Job</Link>
                )}

                {activeRole === 'caregiver' && (
                  <Link href="/job-board" className="text-gray-700 hover:text-black font-medium transition-colors">Find Jobs</Link>
                )}

                <Link href="/messages" className="text-gray-700 hover:text-black font-medium transition-colors">Messages</Link>
                <Link href="/profile" className="text-gray-700 hover:text-black font-medium transition-colors">Profile</Link>
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