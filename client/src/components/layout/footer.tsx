import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-coral mb-3">VIVALY</h3>
            <p className="text-gray-700 mb-3">
              Connecting families with trusted caregivers across Australia.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li><Link href="/search?type=nanny" className="hover:text-coral transition-colors">Nannies</Link></li>
              <li><Link href="/search?type=babysitter" className="hover:text-coral transition-colors">Babysitters</Link></li>
              <li><Link href="/child-care-services" className="hover:text-coral transition-colors">Child Care</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Support & Legal</h4>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li><Link href="/help" className="hover:text-coral transition-colors">Help Center</Link></li>
              <li><Link href="/safety-center" className="hover:text-coral transition-colors">Safety Center</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-coral transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-coral transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-4 text-center">
          <div className="text-gray-600 text-sm">
            © 2025 VIVALY. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
