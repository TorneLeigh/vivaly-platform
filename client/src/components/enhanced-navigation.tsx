import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Heart, 
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";


export default function EnhancedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Find Care", href: "/search", icon: Search },
    { label: "Become a Caregiver", href: "/caregiver-onboarding", icon: User },
    { label: "How it Works", href: "/how-it-works", icon: null },
    { label: "Safety", href: "/safety", icon: null }
  ];

  const userMenuItems = [
    { label: "My Bookings", href: "/bookings", icon: Calendar },
    { label: "Favorites", href: "/favorites", icon: Heart },
    { label: "Messages", href: "/messages", icon: MessageCircle },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Logout", href: "/logout", icon: LogOut }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center shadow-sm border">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-600">
                  <path 
                    d="M2 3.5C2 3.5 3.5 3 5 8.5C6.5 3 8 3.5 8 3.5C8.5 3.5 9 4 9 4.5C9 5 8.5 5.5 8 5.5C7.5 5.5 7 5 6.5 6L5 12L3.5 6C3 5 2.5 5.5 2 5.5C1.5 5.5 1 5 1 4.5C1 4 1.5 3.5 2 3.5Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">VIVALY</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <span className="text-gray-700 hover:text-black font-medium transition-colors duration-200 cursor-pointer">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-black">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
              {navigationItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div 
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}