import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, Calendar, Briefcase, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleToggle from "@/components/RoleToggle";
import { Button } from "@/components/ui/button";
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
    closeMenu();
  };

  const renderParentNavLinks = () => (
    <>
      <Link href="/search-caregivers" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <User className="h-4 w-4 mr-3" />
        Find Caregivers
      </Link>
      <Link href="/parent-bookings" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Calendar className="h-4 w-4 mr-3" />
        My Bookings
      </Link>
      <Link href="/post-job" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Briefcase className="h-4 w-4 mr-3" />
        Post Job
      </Link>
      <Link href="/profile" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <User className="h-4 w-4 mr-3" />
        Profile
      </Link>
      <Link href="/messages" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <MessageSquare className="h-4 w-4 mr-3" />
        Messages
      </Link>
      
      {/* Role Toggle */}
      {roles && roles.length > 1 && (
        <div className="py-3 px-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Switch Role:</p>
          <RoleToggle 
            roles={roles} 
            activeRole={activeRole || 'parent'} 
            onSwitch={(role) => {
              switchRole(role);
              closeMenu();
            }} 
          />
        </div>
      )}
      
      <button
        onClick={handleLogout}
        className="flex items-center py-3 px-4 text-left w-full text-gray-700 hover:bg-gray-50 hover:text-red-600"
      >
        Log Out
      </button>
    </>
  );

  const renderCaregiverNavLinks = () => (
    <>
      <Link href="/job-board" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Briefcase className="h-4 w-4 mr-3" />
        Job Board
      </Link>
      <Link href="/caregiver-bookings" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Calendar className="h-4 w-4 mr-3" />
        My Bookings
      </Link>
      <Link href="/profile" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <User className="h-4 w-4 mr-3" />
        Profile
      </Link>
      <Link href="/messages" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <MessageSquare className="h-4 w-4 mr-3" />
        Messages
      </Link>
      
      {/* Role Toggle */}
      {roles && roles.length > 1 && (
        <div className="py-3 px-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Switch Role:</p>
          <RoleToggle 
            roles={roles} 
            activeRole={activeRole || 'parent'} 
            onSwitch={(role) => {
              switchRole(role);
              closeMenu();
            }} 
          />
        </div>
      )}
      
      <button
        onClick={handleLogout}
        className="flex items-center py-3 px-4 text-left w-full text-gray-700 hover:bg-gray-50 hover:text-red-600"
      >
        Log Out
      </button>
    </>
  );

  const renderUnauthenticatedNavLinks = () => (
    <>
      <Link href="/working-auth" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        Log In
      </Link>
      <Link href="/signup" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <img 
            src={logoImage} 
            alt="VIVALY" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold text-black hover:text-gray-800 transition-colors">
            VIVALY
          </span>
        </Link>

        {/* Desktop Navigation for Parents */}
        {isAuthenticated && activeRole === 'parent' && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search-caregivers" className="text-gray-700 hover:text-black font-medium transition-colors">
              Find Caregivers
            </Link>
            <Link href="/parent-bookings" className="text-gray-700 hover:text-black font-medium transition-colors">
              My Bookings
            </Link>
            <Link href="/post-job" className="text-gray-700 hover:text-black font-medium transition-colors">
              Post Job
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-black font-medium transition-colors">
              Profile
            </Link>
            <Link href="/messages" className="text-gray-700 hover:text-black font-medium transition-colors">
              Messages
            </Link>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Auth buttons for unauthenticated users */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/working-auth" className="text-gray-700 hover:text-black font-medium transition-colors">
                Log In
              </Link>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40">
          <div className="max-w-6xl mx-auto">
            {!isAuthenticated ? (
              <div className="py-2">
                {renderUnauthenticatedNavLinks()}
              </div>
            ) : activeRole === 'parent' ? (
              <div className="py-2">
                {renderParentNavLinks()}
              </div>
            ) : (
              <div className="py-2">
                {renderCaregiverNavLinks()}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}