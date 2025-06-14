import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black flex items-center">
          <img 
            src="/attached_assets/LOGO UPLOAD VIVALY_1749697003124.jpeg" 
            alt="Vivaly Logo" 
            className="h-6 w-auto mr-2 rounded-lg object-cover"
          />
          Vivaly
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded ml-2">NEW</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/messages" className="text-black font-medium">Messages</Link>
          <Link href="/profile" className="text-black font-medium">Profile</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-black font-medium">Log Out</button>
          ) : (
            <>
              <Link href="/auth" className="text-black font-medium">Log In</Link>
              <Link href="/signup" className="text-black font-medium">Sign Up</Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden z-50 bg-white px-4 py-4 border-t border-gray-200 space-y-2">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="block py-2 text-black border-b border-gray-100 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

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

              {roles.length > 1 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-1">Switch Role</p>
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setMobileMenuOpen(false);
                      }}
                      disabled={role === activeRole}
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
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-black font-medium"
              >
                Log Out
              </button>
            </>
          ) : (
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
      )}
    </header>
  );
}