import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Aircare";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Aircare Australia ("we," "our," or "the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Aircare is a digital marketplace platform that facilitates connections between families seeking care services and independent caregivers. <strong>IMPORTANT: Aircare does not provide care services directly, does not employ caregivers, and acts solely as a technology platform for introductions.</strong> All care services are provided by independent contractors who are solely responsible for their services.
        </p>

        <h2>3. User Accounts and Registration</h2>
        <h3>3.1 Account Creation</h3>
        <ul>
          <li>Users must provide accurate and complete information during registration</li>
          <li>You are responsible for maintaining the confidentiality of your account</li>
          <li>One account per person is permitted</li>
          <li>Accounts are non-transferable</li>
        </ul>

        <h3>3.2 Government Verification Integration</h3>
        <ul>
          <li><strong>Working with Children Check (WWCC):</strong> All childcare providers must provide valid WWCC clearance as required by Australian state law</li>
          <li><strong>Identity Verification:</strong> Government-issued photo ID verification required for all caregivers</li>
          <li><strong>WWCC Integration:</strong> Platform integrates with government WWCC databases to verify current clearance status</li>
          <li><strong>Reference Verification:</strong> Caregivers must provide verifiable professional references</li>
          <li><strong>Ongoing Compliance:</strong> Automatic monitoring of WWCC expiry dates and renewal requirements</li>
          <li>Verification badges indicate current government clearance status</li>
          <li>Caregivers without valid WWCC cannot provide childcare services through the platform</li>
        </ul>

        <h2>4. Platform Usage</h2>
        <h3>4.1 Permitted Uses</h3>
        <ul>
          <li>Searching for and connecting with caregivers</li>
          <li>Posting legitimate care opportunities</li>
          <li>Communicating through our messaging system</li>
          <li>Leaving honest reviews and feedback</li>
        </ul>

        <h3>4.2 Prohibited Activities</h3>
        <ul>
          <li>Creating fake profiles or providing false information</li>
          <li>Harassment, discrimination, or inappropriate behavior</li>
          <li>Circumventing platform fees or payment systems</li>
          <li>Posting illegal or harmful content</li>
          <li>Spamming or unsolicited marketing</li>
        </ul>

        <h2>5. Payments and Fees</h2>
        <h3>5.1 Platform Fees</h3>
        <ul>
          <li>Service fees apply to completed bookings</li>
          <li>Payment processing fees are non-refundable</li>
          <li>Fee structures are clearly displayed before payment</li>
        </ul>

        <h3>5.2 Payment Processing</h3>
        <ul>
          <li>Payments are processed through secure third-party providers</li>
          <li>Families pay through the platform for protection</li>
          <li>Caregivers receive payments according to our schedule</li>
        </ul>

        <h2>6. Safety and Government Compliance</h2>
        <p><strong>GOVERNMENT CLEARANCE VERIFICATION:</strong></p>
        <ul>
          <li><strong>Working with Children Check (WWCC) Compliance:</strong> Platform integrates with government WWCC systems to verify current clearance status for all childcare providers</li>
          <li><strong>Government Database Integration:</strong> Real-time verification of WWCC validity and expiry dates through official government APIs</li>
          <li><strong>State Law Compliance:</strong> Full adherence to individual state WWCC requirements across Australia</li>
          <li><strong>Identity Verification:</strong> Government-issued photo ID verification for all caregivers</li>
          <li><strong>Reference Requirements:</strong> Professional reference verification from previous employers or clients</li>
          <li><strong>Automatic Compliance Monitoring:</strong> System alerts for WWCC renewals and expiry notifications</li>
          <li>Caregivers without valid government clearances cannot access childcare bookings</li>
          <li>All caregivers are independent contractors subject to government safety regulations</li>
        </ul>

        <h2>7. Liability and Disclaimers</h2>
        <h3>7.1 LIMITED LIABILITY</h3>
        <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong></p>
        <ul>
          <li><strong>Aircare disclaims all liability for any injuries, damages, losses, or claims arising from care services</strong></li>
          <li>We are not liable for caregiver actions, negligence, theft, abuse, or misconduct</li>
          <li>Platform provided "AS IS" without warranties of any kind</li>
          <li>We do not guarantee caregiver qualifications, reliability, or safety</li>
          <li>Maximum liability limited to platform fees paid in the 12 months prior to any claim</li>
        </ul>

        <h3>7.2 User Assumption of Risk</h3>
        <ul>
          <li><strong>Users acknowledge they assume all risks when engaging caregivers</strong></li>
          <li>Families must independently verify all caregiver credentials, references, and insurance</li>
          <li>Users waive claims against Aircare for caregiver-related incidents</li>
          <li>Follow all appropriate safety protocols and local laws</li>
        </ul>

        <h3>7.3 Indemnification</h3>
        <p>
          Users agree to indemnify and hold harmless Aircare from any claims, damages, or expenses arising from their use of the platform or engagement with caregivers.
        </p>

        <h2>8. Intellectual Property</h2>
        <ul>
          <li>Platform content and design are protected by copyright</li>
          <li>Users retain rights to their own content</li>
          <li>Grant us license to use content for platform operations</li>
          <li>Respect intellectual property rights of others</li>
        </ul>

        <h2>9. Privacy and Data Protection</h2>
        <ul>
          <li>Your privacy is governed by our Privacy Policy</li>
          <li>We comply with Australian Privacy Principles</li>
          <li>Data is used to facilitate care connections</li>
          <li>You control your privacy settings</li>
        </ul>

        <h2>10. Termination</h2>
        <h3>10.1 User Termination</h3>
        <ul>
          <li>You may terminate your account at any time</li>
          <li>Some data may be retained per legal requirements</li>
          <li>Outstanding obligations remain after termination</li>
        </ul>

        <h3>10.2 Platform Termination</h3>
        <ul>
          <li>We may suspend or terminate accounts for violations</li>
          <li>Notice will be provided when reasonably possible</li>
          <li>Repeat violations may result in permanent bans</li>
        </ul>

        <h2>11. Dispute Resolution</h2>
        <h3>11.1 Internal Resolution</h3>
        <ul>
          <li>Contact our support team for initial dispute resolution</li>
          <li>We provide mediation services for platform-related disputes</li>
          <li>Good faith cooperation is expected from all parties</li>
        </ul>

        <h3>11.2 Legal Remedies</h3>
        <ul>
          <li>Australian Consumer Law protections apply</li>
          <li>Disputes may be resolved through appropriate courts</li>
          <li>Alternative dispute resolution options available</li>
        </ul>

        <h2>12. Changes to Terms</h2>
        <ul>
          <li>Terms may be updated to reflect service changes</li>
          <li>Significant changes will be communicated via email</li>
          <li>Continued use constitutes acceptance of new terms</li>
          <li>Previous versions available upon request</li>
        </ul>

        <h2>13. Governing Law</h2>
        <p>
          These terms are governed by Australian law and the laws of New South Wales. Any disputes will be subject to the jurisdiction of Australian courts.
        </p>

        <h2>14. Contact Information</h2>
        <p>
          For questions about these Terms of Service:<br />
          <strong>Email:</strong> legal@careconnect.com.au<br />
          <strong>Phone:</strong> 1800 CARE HELP (1800 2273 4357)<br />
          <strong>Address:</strong> Care Platform Australia Pty Ltd
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Important:</strong> These terms constitute a legally binding agreement. Please read them carefully and contact us if you have any questions before using our platform.
          </p>
        </div>
      </div>
    </div>
  );
}