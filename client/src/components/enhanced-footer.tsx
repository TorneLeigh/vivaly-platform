import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Award,
  Shield,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnhancedFooter() {
  const serviceLinks = [
    { label: "Find Childcare", href: "/search?serviceType=Childcare" },
    { label: "Find Nannies", href: "/search?serviceType=Nanny" },
    { label: "Elderly Care", href: "/search?serviceType=Elderly Care" },
    { label: "Pet Sitting", href: "/search?serviceType=Pet Sitting" },
    { label: "Babysitting", href: "/search?serviceType=Babysitting" }
  ];

  const supportLinks = [
    { label: "Safety Center", href: "/safety" },
    { label: "Help Center", href: "/help" },
    { label: "Trust & Safety", href: "/trust-safety" },
    { label: "Contact Us", href: "/contact" },
    { label: "Community Guidelines", href: "/guidelines" }
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Investor Relations", href: "/investors" },
    { label: "Partnerships", href: "/partnerships" }
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Accessibility", href: "/accessibility" }
  ];

  const trustBadges = [
    { icon: Shield, text: "WWCC Verified" },
    { icon: Award, text: "Insured Platform" },
    { icon: Star, text: "4.9★ Rating" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay connected with our community
            </h3>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Get weekly tips, featured caregivers, and exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">Carely</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Australia's most trusted care marketplace connecting families with verified, background-checked caregivers across childcare, elderly care, and pet services.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              {trustBadges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                    <IconComponent className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">1800 CARELY (1800 227 359)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">hello@aircareau.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Sydney, Australia</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-orange-400 transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-orange-400 transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-orange-400 transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Legal */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <span className="text-gray-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Carely Pty Ltd. All rights reserved. ABN: 12 345 678 901
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Carely is a registered trademark. Background checks powered by ASIC Connect.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}