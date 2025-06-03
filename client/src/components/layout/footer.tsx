import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-warm-gray text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-coral mb-4">Aircare</h3>
            <p className="text-gray-300 mb-4">
              Connecting families with trusted caregivers across Australia.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/search?type=nanny" className="hover:text-white transition-colors">Nannies</Link></li>
              <li><Link href="/search?type=babysitter" className="hover:text-white transition-colors">Babysitters</Link></li>
              <li><Link href="/search?type=elder" className="hover:text-white transition-colors">Elder Care</Link></li>
              <li><Link href="/search?type=pet" className="hover:text-white transition-colors">Pet Care</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Caregivers</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/become-nanny" className="hover:text-white transition-colors">Join as Caregiver</Link></li>
              <li><Link href="/safety-center" className="hover:text-white transition-colors">Safety Center</Link></li>
              <li><Link href="/background-checks" className="hover:text-white transition-colors">Background Checks</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Aircare. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/help" className="text-gray-400 text-sm hover:text-white transition-colors">Help Center</Link>
            <Link href="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
