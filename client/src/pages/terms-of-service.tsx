import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | VIVALY";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        
        <p className="text-xs text-gray-600 mb-4">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Acceptance of Terms</h2>
        <p className="text-sm mb-4">
          By accessing and using VIVALY ("we," "our," or "the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Description of Service</h2>
        <p className="text-sm mb-4">
          VIVALY is a digital marketplace platform that facilitates connections between families seeking care services and independent caregivers. <strong>IMPORTANT: VIVALY does not provide care services directly, does not employ caregivers, and acts solely as a technology platform for introductions.</strong> All care services are provided by independent contractors who are solely responsible for their services.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">User Eligibility</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Age Requirements</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Users must be at least 18 years old</li>
          <li>Minors may use the platform with parental supervision</li>
          <li>Age verification may be required for certain services</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Identity Verification</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Accurate personal information required</li>
          <li>Government-issued ID verification for caregivers</li>
          <li>Background checks completed as legally permitted</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Platform Rules</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Prohibited Activities</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Providing false or misleading information</li>
          <li>Harassment or inappropriate communication</li>
          <li>Circumventing platform payment systems</li>
          <li>Soliciting services outside the platform</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Account Responsibilities</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Maintain account security and confidentiality</li>
          <li>Report suspicious activity immediately</li>
          <li>Keep profile information current and accurate</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Payments and Fees</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Service Fees</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Platform charges processing fees on transactions</li>
          <li>Caregivers pay service fees for bookings</li>
          <li>Payment processing fees are non-refundable</li>
          <li>Fee structure is transparent and disclosed upfront</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Payment Terms</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Payments processed securely through authorized providers</li>
          <li>Automatic payment authorization for confirmed bookings</li>
          <li>Dispute resolution available for payment issues</li>
          <li>Refunds subject to cancellation policy terms</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Safety and Liability</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Platform Safety Measures</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Background verification for caregivers</li>
          <li>Emergency contact systems during services</li>
          <li>Incident reporting and resolution procedures</li>
          <li>Safety resources and training materials</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Limitation of Liability</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Platform facilitates connections only</li>
          <li>Users engage services at their own risk</li>
          <li>Caregivers are independent contractors</li>
          <li>Additional safety measures are user responsibility</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Intellectual Property</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Platform Content</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>VIVALY owns all platform technology and design</li>
          <li>Users retain rights to their personal content</li>
          <li>License granted to use platform materials</li>
          <li>Unauthorized copying or distribution prohibited</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">User Content</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Users responsible for content accuracy</li>
          <li>Grant platform license to display user content</li>
          <li>Remove content that violates terms</li>
          <li>Respect intellectual property of others</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Account Termination</h2>
        <h3 className="text-base font-medium mt-4 mb-2">User Termination</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Users may close accounts at any time</li>
          <li>Outstanding obligations must be fulfilled</li>
          <li>Data retention per privacy policy</li>
          <li>Some information may be retained for legal compliance</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Platform Termination</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Accounts may be suspended for terms violations</li>
          <li>Immediate termination for serious safety issues</li>
          <li>Notice provided when reasonably possible</li>
          <li>Appeal process available for disputed actions</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Dispute Resolution</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Internal Resolution</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Contact support team for initial dispute resolution</li>
          <li>Mediation services provided for platform-related disputes</li>
          <li>Good faith cooperation expected from all parties</li>
          <li>Documentation maintained throughout process</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Legal Remedies</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Australian Consumer Law protections apply</li>
          <li>Disputes resolved through appropriate courts</li>
          <li>Alternative dispute resolution options available</li>
          <li>Legal costs may apply for frivolous claims</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Changes to Terms</h2>
        <ul className="text-sm space-y-1 mb-4">
          <li>Terms may be updated to reflect service changes</li>
          <li>Significant changes communicated via email</li>
          <li>Continued use constitutes acceptance of new terms</li>
          <li>Previous versions available upon request</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Governing Law</h2>
        <p className="text-sm mb-4">
          These terms are governed by Australian law and the laws of New South Wales. Any disputes will be subject to the jurisdiction of Australian courts.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Contact Information</h2>
        <p className="text-sm mb-4">
          For questions about these Terms of Service: <strong>support@vivaly.com.au</strong>
        </p>

        <div className="mt-6 p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-800">
            <strong>Legal Agreement:</strong> These terms constitute a legally binding agreement. Please read them carefully and contact us if you have any questions before using our platform.
          </p>
        </div>
      </div>
    </div>
  );
}