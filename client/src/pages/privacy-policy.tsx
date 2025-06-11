import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | VIVALY";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        
        <p className="text-xs text-gray-600 mb-4">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Information We Collect</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Personal Information</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Name, email address, phone number</li>
          <li>Address and location information</li>
          <li>Payment and billing information</li>
          <li>Profile photos and biographical information</li>
          <li>Identity verification documents</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Service Information</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Care preferences and requirements</li>
          <li>Booking and service history</li>
          <li>Reviews and ratings</li>
          <li>Communication records through our platform</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Technical Information</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Device and browser information</li>
          <li>IP address and location data</li>
          <li>Usage patterns and preferences</li>
          <li>Cookies and tracking technologies</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">How We Use Your Information</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Service Provision</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Matching families with suitable caregivers</li>
          <li>Processing bookings and payments</li>
          <li>Facilitating communication between users</li>
          <li>Providing customer support</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Safety and Security</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Verifying caregiver backgrounds and qualifications</li>
          <li>Monitoring platform for suspicious activity</li>
          <li>Ensuring compliance with safety standards</li>
          <li>Protecting against fraud and misuse</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Platform Improvement</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Analyzing usage patterns to enhance features</li>
          <li>Personalizing user experience</li>
          <li>Developing new services and offerings</li>
          <li>Conducting research and analytics</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Information Sharing</h2>
        <h3 className="text-base font-medium mt-4 mb-2">With Caregivers and Families</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Contact information for confirmed bookings</li>
          <li>Relevant care requirements and preferences</li>
          <li>Reviews and ratings (with consent)</li>
          <li>Location information for service delivery</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">With Service Providers</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Payment processors for transaction handling</li>
          <li>Background check services for verification</li>
          <li>Communication tools for platform messaging</li>
          <li>Analytics services for platform improvement</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Legal Requirements</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Compliance with Australian privacy laws</li>
          <li>Response to legal requests and investigations</li>
          <li>Protection of rights and safety</li>
          <li>Regulatory reporting requirements</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Data Security</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Protection Measures</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Encrypted data transmission and storage</li>
          <li>Regular security audits and assessments</li>
          <li>Access controls and authentication</li>
          <li>Secure payment processing systems</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Data Retention</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Personal information retained as legally required</li>
          <li>Account data deleted upon request</li>
          <li>Transaction records kept for compliance</li>
          <li>Anonymous analytics data may be retained longer</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Your Rights</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Access and Control</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>View and update personal information</li>
          <li>Download your data in portable format</li>
          <li>Delete account and associated data</li>
          <li>Withdraw consent for optional processing</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Privacy Preferences</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Control marketing communications</li>
          <li>Manage cookie and tracking preferences</li>
          <li>Opt out of non-essential data processing</li>
          <li>Request restriction of processing</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Cookies and Tracking</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Essential Cookies</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Authentication and security</li>
          <li>Platform functionality and preferences</li>
          <li>Shopping cart and booking progress</li>
          <li>Error reporting and troubleshooting</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Optional Tracking</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Analytics and usage statistics</li>
          <li>Marketing and advertising optimization</li>
          <li>Social media integration</li>
          <li>Third-party service integration</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Contact Information</h2>
        <p className="text-sm mb-4">
          For privacy questions or requests: <strong>support@vivaly.com.au</strong>
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Policy Updates</h2>
        <p className="text-sm mb-4">
          This privacy policy may be updated to reflect changes in our practices or legal requirements. Users will be notified of material changes via email and platform notifications.
        </p>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Privacy Protection:</strong> This privacy policy complies with Australian Privacy Principles and provides transparent information about how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>
    </div>
  );
}