import { Link } from "wouter";
import logoImage from "@assets/Screenshot 2025-06-16 at 15.57.36_1750053474312.png";

// Minimal header without hooks to prevent React errors
export default function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img src={logoImage} alt="VIVALY" className="h-8 w-auto" />
          </Link>

          {/* Simple navigation */}
          <nav className="flex items-center space-x-8">
            <Link href="/find-care" className="text-gray-700 hover:text-black font-medium">
              Find Care
            </Link>
            <Link href="/nanny-sharing" className="text-gray-700 hover:text-black font-medium">
              Nanny Sharing
            </Link>
            <Link href="/become-nanny" className="text-gray-700 hover:text-black font-medium">
              Become a Caregiver
            </Link>
            <Link href="/auth" className="bg-[#FF5F7E] hover:bg-[#e54c6b] text-white px-4 py-2 rounded-lg font-medium">
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}