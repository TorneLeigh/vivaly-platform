import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import RoleToggle from '@/components/role-toggle';
import { 
  Search, 
  Calendar, 
  MessageCircle, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 h-16 z-50">
      {/* Logo */}
      <Link href="/">
        <div className="font-bold text-xl text-blue-600 cursor-pointer select-none flex-shrink-0">
          VIVALY
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6 flex-grow ml-8">
        <Link href="/find-care" className="text-gray-700 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition-all">
          Day Care
        </Link>
        <Link href="/services" className="text-gray-700 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition-all">
          All Services
        </Link>
        <Link href="/gift-cards" className="text-gray-700 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition-all">
          Gift Cards
        </Link>
        <Link href="/help" className="text-gray-700 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition-all">
          Help
        </Link>
        <Button 
          onClick={() => window.location.href = '/become-caregiver'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold whitespace-nowrap"
        >
          Become a Carer
        </Button>
      </nav>

      {/* Role Toggle - Desktop */}
      <div className="hidden lg:flex ml-6">
        <RoleToggle />
      </div>

      {/* Auth Buttons - Desktop */}
      <div className="hidden lg:flex items-center gap-4 ml-6">
        {!isAuthenticated && !isLoading ? (
          <>
            <Link href="/auth" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="border-2 border-blue-600 text-blue-600 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
            >
              Sign Up
            </Link>
          </>
        ) : isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/search'} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/bookings'} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/messages'} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : null}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col justify-center w-7 h-6 cursor-pointer ml-4"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`h-0.5 bg-gray-700 mb-1 rounded transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`h-0.5 bg-gray-700 mb-1 rounded transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`h-0.5 bg-gray-700 rounded transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform lg:hidden z-50 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5 p-6">
          {/* Close Button */}
          <button 
            className="self-end text-xl font-bold"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>

          {/* Role Toggle for Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Browse as:</label>
            <RoleToggle />
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <Link 
              href="/find-care" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Day Care Services
            </Link>
            <Link 
              href="/services" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Services
            </Link>
            <Link 
              href="/gift-cards" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gift Cards
            </Link>
            <Link 
              href="/help" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help & Support
            </Link>
            <Link 
              href="/become-caregiver" 
              className="block text-lg font-medium text-blue-600 hover:text-blue-700 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Carer
            </Link>
          </div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="space-y-3 pt-4 border-t">
              <Button 
                onClick={() => { window.location.href = '/auth'; setMobileMenuOpen(false); }}
                variant="outline" 
                className="w-full"
              >
                Log In
              </Button>
              <Button 
                onClick={() => { window.location.href = '/signup'; setMobileMenuOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-4 border-t">
              <Link 
                href="/search" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link 
                href="/bookings" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link 
                href="/messages" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </Link>
              <Button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 border-red-200"
              >
                Log Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}