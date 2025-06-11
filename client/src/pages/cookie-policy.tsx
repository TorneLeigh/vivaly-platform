import { useEffect } from "react";

export default function CookiePolicy() {
  useEffect(() => {
    document.title = "Cookie Policy | VIVALY";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Cookie Policy</h1>
        
        <p className="text-xs text-gray-600 mb-4">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">What Are Cookies</h2>
        <p className="text-sm mb-4">
          Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">How We Use Cookies</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Essential Cookies</h3>
        <p className="text-sm mb-2">These cookies are necessary for our website to function properly:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>User authentication and session management</li>
          <li>Security features and fraud prevention</li>
          <li>Basic website functionality and navigation</li>
          <li>Shopping cart and booking functionality</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Performance Cookies</h3>
        <p className="text-sm mb-2">These cookies help us understand how visitors use our website:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Page view analytics and user behavior</li>
          <li>Error tracking and performance monitoring</li>
          <li>A/B testing for website improvements</li>
          <li>Load time optimization</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Functional Cookies</h3>
        <p className="text-sm mb-2">These cookies enhance your experience:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Language and region preferences</li>
          <li>Accessibility settings and customizations</li>
          <li>Search filters and preferences</li>
          <li>Recently viewed profiles and services</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Marketing Cookies</h3>
        <p className="text-sm mb-2">With your consent, these cookies enable personalized advertising:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Targeted advertisements based on interests</li>
          <li>Social media integration and sharing</li>
          <li>Retargeting campaigns for relevant services</li>
          <li>Cross-platform advertising coordination</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Managing Your Cookie Preferences</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Browser Settings</h3>
        <p className="text-sm mb-2">You can control cookies through your browser settings:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Block all cookies (may affect website functionality)</li>
          <li>Delete existing cookies from our website</li>
          <li>Set preferences for different types of cookies</li>
          <li>Receive notifications when cookies are set</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Our Cookie Preference Center</h3>
        <p className="text-sm mb-2">Manage your preferences directly on our website:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Accept or decline non-essential cookies</li>
          <li>Choose specific cookie categories</li>
          <li>Update preferences at any time</li>
          <li>View detailed information about each cookie type</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Cookie Retention</h2>
        <p className="text-sm mb-2">Different cookies have different retention periods:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Session cookies: Deleted when you close your browser</li>
          <li>Persistent cookies: Remain for specified periods (up to 2 years)</li>
          <li>Third-party cookies: Controlled by respective organizations</li>
          <li>Marketing cookies: Typically retained for 6-12 months</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Third-Party Cookies</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Analytics Services</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Google Analytics for website performance tracking</li>
          <li>Hotjar for user behavior analysis</li>
          <li>Facebook Pixel for advertising optimization</li>
          <li>LinkedIn Insight Tag for professional targeting</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Service Integration</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Stripe for secure payment processing</li>
          <li>Twilio for SMS communication services</li>
          <li>SendGrid for email delivery services</li>
          <li>Google Maps for location services</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Impact of Disabling Cookies</h2>
        <p className="text-sm mb-2">Disabling certain cookies may affect:</p>
        <ul className="text-sm space-y-1 mb-4">
          <li>Website functionality and user experience</li>
          <li>Ability to stay logged in during visits</li>
          <li>Personalized content and recommendations</li>
          <li>Analytics that help us improve our services</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Children's Privacy</h2>
        <p className="text-sm mb-4">
          We do not knowingly collect cookies from children under 18. Parents can manage cookie settings on behalf of their children through browser controls.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Updates to This Policy</h2>
        <p className="text-sm mb-4">
          We may update this cookie policy to reflect changes in technology or regulations. Continued use of our website constitutes acceptance of any updates.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Contact Information</h2>
        <p className="text-sm mb-4">
          For questions about our use of cookies: <strong>support@vivaly.com.au</strong>
        </p>

        <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Transparency:</strong> This cookie policy complies with Australian privacy laws and provides transparency about our data collection practices.
          </p>
        </div>
      </div>
    </div>
  );
}