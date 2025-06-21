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
  
  // Debug logging for mobile testing
  console.log("Header render - isAuthenticated:", isAuthenticated, "user:", user, "roles:", roles, "activeRole:", activeRole);
  const [, navigate] = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    closeMenu();
  };

  const renderParentDropdownLinks = () => (
    <>
      {/* Role Toggle at top */}
      {roles && roles.length > 1 && (
        <div className="py-3 px-4 border-b border-gray-100">
          <p className="text-sm font-medium text-orange-600 mb-2">Switch Role:</p>
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
      
      <Link href="/search-caregivers" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold" onClick={closeMenu}>
        <User className="h-4 w-4 mr-3" />
        FIND CAREGIVERS
      </Link>
      <Link href="/post-job" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold" onClick={closeMenu}>
        <Briefcase className="h-4 w-4 mr-3" />
        POST A JOB
      </Link>
      <Link href="/job-board" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Briefcase className="h-4 w-4 mr-3" />
        Job Board
      </Link>
      <Link href="/parent/bookings" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
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
      
      <button
        onClick={handleLogout}
        className="flex items-center py-3 px-4 text-left w-full text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
      >
        Log Out
      </button>
    </>
  );

  const renderCaregiverDropdownLinks = () => (
    <>
      {/* Role Toggle at top */}
      {roles && roles.length > 1 && (
        <div className="py-3 px-4 border-b border-gray-100">
          <p className="text-sm font-medium text-orange-600 mb-2">Switch Role:</p>
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
      <Link href="/help" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
        <Settings className="h-4 w-4 mr-3" />
        Help
      </Link>
      
      <button
        onClick={handleLogout}
        className="flex items-center py-3 px-4 text-left w-full text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
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

        {/* Center Navigation - Role Toggle (visible on all devices) */}
        {isAuthenticated && (
          <div className="flex items-center justify-center flex-1">
            {roles && roles.length > 1 ? (
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-medium text-orange-600 hidden md:block">Switch Role</span>
                <RoleToggle 
                  roles={roles} 
                  activeRole={activeRole || 'parent'} 
                  onSwitch={switchRole}
                />
              </div>
            ) : (
              <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                {activeRole === 'parent' ? 'Parent' : 'Caregiver'}
              </span>
            )}
          </div>
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
            ) : (
              <div className="py-2">
                {/* User Info Header with Role Toggle */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName || user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Currently viewing as: <span className="font-medium text-orange-600">
                          {activeRole === 'parent' ? 'Parent' : 'Caregiver'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Mobile Menu Role Toggle */}
                  {roles && roles.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-orange-600 mb-3">Switch Role:</p>
                      <div className="flex justify-center">
                        <RoleToggle 
                          roles={roles} 
                          activeRole={activeRole || 'parent'} 
                          onSwitch={(role) => {
                            switchRole(role);
                            closeMenu();
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Role-specific navigation */}
                <div className="border-b border-gray-100">
                  {activeRole === 'parent' ? (
                    <>
                      <Link href="/search-caregivers" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold border-l-4 border-orange-500" onClick={closeMenu}>
                        <User className="h-4 w-4 mr-3" />
                        FIND CAREGIVERS
                      </Link>
                      <Link href="/post-job" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold border-l-4 border-orange-500" onClick={closeMenu}>
                        <Briefcase className="h-4 w-4 mr-3" />
                        POST A JOB
                      </Link>
                      <Link href="/job-board" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                        <Briefcase className="h-4 w-4 mr-3" />
                        Job Board
                      </Link>
                      <Link href="/parent-bookings" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                        <Calendar className="h-4 w-4 mr-3" />
                        My Bookings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/job-board" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold border-l-4 border-orange-500" onClick={closeMenu}>
                        <Briefcase className="h-4 w-4 mr-3" />
                        JOB BOARD
                      </Link>
                      <Link href="/caregiver-profile" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold border-l-4 border-orange-500" onClick={closeMenu}>
                        <User className="h-4 w-4 mr-3" />
                        MY PROFILE
                      </Link>
                      <Link href="/caregiver-bookings" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                        <Calendar className="h-4 w-4 mr-3" />
                        My Bookings
                      </Link>
                    </>
                  )}
                </div>
                
                {/* Common menu items for both roles */}
                <Link href="/profile" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Link>
                <Link href="/messages" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Messages
                </Link>
                <Link href="/help" className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-black" onClick={closeMenu}>
                  <Settings className="h-4 w-4 mr-3" />
                  Help
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center py-3 px-4 text-left w-full text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}