import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-coral mb-4">VIVALY</h3>
            <p className="text-gray-700 mb-4">
              Connecting families with trusted caregivers across Australia.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-coral cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/search?type=nanny" className="hover:text-coral transition-colors">Nannies</Link></li>
              <li><Link href="/search?type=babysitter" className="hover:text-coral transition-colors">Babysitters</Link></li>
              <li><Link href="/search?type=elder" className="hover:text-coral transition-colors">Elder Care</Link></li>
              <li><Link href="/search?type=pet" className="hover:text-coral transition-colors">Pet Care</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Help Center</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/help" className="hover:text-coral transition-colors">Help Center</Link></li>
              <li><Link href="/emergency-information" className="hover:text-coral transition-colors">Emergency Information</Link></li>
              <li><Link href="/safety-center" className="hover:text-coral transition-colors">Safety Center</Link></li>
              <li><Link href="/background-checks" className="hover:text-coral transition-colors">Background Checks</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/terms-of-service" className="hover:text-coral transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-coral transition-colors">Refund Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-coral transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-coral transition-colors">Cookie Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-coral transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © 2025 VIVALY. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/help" className="text-gray-600 text-sm hover:text-coral transition-colors">Help Center</Link>
            <Link href="/contact" className="text-gray-600 text-sm hover:text-coral transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
