import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | CareConnect Australia";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2>1. Information We Collect</h2>
        <h3>1.1 Personal Information</h3>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Address and location information</li>
          <li>Payment and billing information</li>
          <li>Profile photos and biographical information</li>
          <li>Identity verification documents</li>
        </ul>

        <h3>1.2 Service Information</h3>
        <ul>
          <li>Care preferences and requirements</li>
          <li>Booking and service history</li>
          <li>Reviews and ratings</li>
          <li>Communication records through our platform</li>
        </ul>

        <h3>1.3 Technical Information</h3>
        <ul>
          <li>Device and browser information</li>
          <li>IP address and location data</li>
          <li>Usage patterns and preferences</li>
          <li>Cookies and tracking technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <h3>2.1 Service Provision</h3>
        <ul>
          <li>Matching families with suitable caregivers</li>
          <li>Processing bookings and payments</li>
          <li>Facilitating communication between users</li>
          <li>Providing customer support</li>
        </ul>

        <h3>2.2 Safety and Security</h3>
        <ul>
          <li>Identity verification and background checks</li>
          <li>Fraud prevention and detection</li>
          <li>Platform security monitoring</li>
          <li>Compliance with legal obligations</li>
        </ul>

        <h3>2.3 Platform Improvement</h3>
        <ul>
          <li>Analyzing usage patterns to enhance services</li>
          <li>Developing new features and functionality</li>
          <li>Personalizing user experience</li>
          <li>Market research and analytics</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <h3>3.1 With Other Users</h3>
        <ul>
          <li>Profile information visible to potential matches</li>
          <li>Contact information shared after booking confirmation</li>
          <li>Reviews and ratings from completed services</li>
          <li>Communication through our messaging system</li>
        </ul>

        <h3>3.2 With Service Providers</h3>
        <ul>
          <li>Payment processors for transaction handling</li>
          <li>Background check providers for verification</li>
          <li>Cloud storage providers for data hosting</li>
          <li>Analytics providers for service improvement</li>
        </ul>

        <h3>3.3 Legal Requirements</h3>
        <ul>
          <li>Law enforcement when legally required</li>
          <li>Court orders and legal proceedings</li>
          <li>Regulatory compliance obligations</li>
          <li>Child protection and safety concerns</li>
        </ul>

        <h2>4. Data Security</h2>
        <h3>4.1 Protection Measures</h3>
        <ul>
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Regular security audits and assessments</li>
          <li>Access controls and authentication systems</li>
          <li>Secure data centers and infrastructure</li>
        </ul>

        <h3>4.2 User Responsibilities</h3>
        <ul>
          <li>Protecting account credentials</li>
          <li>Reporting suspected security breaches</li>
          <li>Using secure internet connections</li>
          <li>Following platform safety guidelines</li>
        </ul>

        <h2>5. Your Privacy Rights</h2>
        <h3>5.1 Access and Control</h3>
        <ul>
          <li>View and update your personal information</li>
          <li>Download your data in portable format</li>
          <li>Delete your account and associated data</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h3>5.2 Australian Privacy Rights</h3>
        <ul>
          <li>Access to personal information we hold</li>
          <li>Correction of inaccurate information</li>
          <li>Complaint procedures for privacy concerns</li>
          <li>Protection under Australian Privacy Principles</li>
        </ul>

        <h2>6. Data Retention</h2>
        <h3>6.1 Retention Periods</h3>
        <ul>
          <li>Account information: Retained while account is active</li>
          <li>Booking records: 7 years for legal compliance</li>
          <li>Payment information: As required by financial regulations</li>
          <li>Communication records: 3 years for dispute resolution</li>
        </ul>

        <h3>6.2 Deletion Process</h3>
        <ul>
          <li>Automatic deletion after retention periods</li>
          <li>Secure deletion procedures for sensitive data</li>
          <li>Anonymization of research and analytics data</li>
          <li>Legal hold procedures when required</li>
        </ul>

        <h2>7. Cookies and Tracking</h2>
        <h3>7.1 Cookie Types</h3>
        <ul>
          <li>Essential cookies for platform functionality</li>
          <li>Performance cookies for analytics</li>
          <li>Preference cookies for personalization</li>
          <li>Marketing cookies for advertising (with consent)</li>
        </ul>

        <h3>7.2 Cookie Management</h3>
        <ul>
          <li>Browser settings to control cookies</li>
          <li>Opt-out options for marketing cookies</li>
          <li>Cookie preference center on our platform</li>
          <li>Regular review and updates of cookie practices</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <ul>
          <li>Platform not intended for children under 18</li>
          <li>Parental consent required for minor care recipients</li>
          <li>Enhanced protection for child-related information</li>
          <li>Immediate deletion of improperly collected child data</li>
        </ul>

        <h2>9. International Data Transfers</h2>
        <ul>
          <li>Data primarily stored within Australia</li>
          <li>International transfers only to adequate protection countries</li>
          <li>Contractual safeguards for international service providers</li>
          <li>Compliance with Australian cross-border privacy laws</li>
        </ul>

        <h2>10. Privacy Policy Updates</h2>
        <ul>
          <li>Regular review and updating of privacy practices</li>
          <li>Email notification for material changes</li>
          <li>Prominent display of updated policies</li>
          <li>Archive of previous policy versions</li>
        </ul>

        <h2>11. Contact Information</h2>
        <h3>11.1 Privacy Officer</h3>
        <p>
          <strong>Email:</strong> privacy@careconnect.com.au<br />
          <strong>Phone:</strong> 1800 CARE HELP (1800 2273 4357)<br />
          <strong>Mail:</strong> Privacy Officer, Care Platform Australia Pty Ltd
        </p>

        <h3>11.2 Complaints</h3>
        <p>
          If you have concerns about our privacy practices that we cannot resolve, you may contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.
        </p>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy and handling your personal information responsibly. If you have any questions about this policy or our privacy practices, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}