import { useEffect } from "react";

export default function CookiePolicy() {
  useEffect(() => {
    document.title = "Cookie Policy | Kindly Australia";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2>How We Use Cookies</h2>
        <p>
          We use cookies to improve your experience by remembering your preferences and optimizing our services.
        </p>
        <h3>Essential Cookies</h3>
        <p>These cookies are necessary for our website to function properly:</p>
        <ul>
          <li>User authentication and session management</li>
          <li>Security features and fraud prevention</li>
          <li>Basic website functionality and navigation</li>
          <li>Shopping cart and booking functionality</li>
        </ul>

        <h3>Performance Cookies</h3>
        <p>These cookies help us understand how visitors use our website:</p>
        <ul>
          <li>Page view analytics and user behavior</li>
          <li>Error tracking and performance monitoring</li>
          <li>A/B testing for website improvements</li>
          <li>Load time optimization</li>
        </ul>

        <h3>Functional Cookies</h3>
        <p>These cookies enhance your experience:</p>
        <ul>
          <li>Language and region preferences</li>
          <li>Accessibility settings and customizations</li>
          <li>Search filters and preferences</li>
          <li>Recently viewed profiles and services</li>
        </ul>

        <h3>Marketing Cookies</h3>
        <p>With your consent, these cookies enable personalized advertising:</p>
        <ul>
          <li>Targeted advertisements based on interests</li>
          <li>Social media integration and sharing</li>
          <li>Retargeting campaigns for relevant services</li>
          <li>Cross-platform advertising coordination</li>
        </ul>

        <h2>Third-Party Cookies</h2>
        <p>We work with trusted partners who may place cookies on your device:</p>
        <ul>
          <li>Google Analytics for website analytics</li>
          <li>Stripe for secure payment processing</li>
          <li>Social media platforms for sharing features</li>
          <li>Advertising networks for relevant ads</li>
        </ul>

        <h2>Managing Your Cookie Preferences</h2>
        <h3>Browser Settings</h3>
        <p>You can control cookies through your browser settings:</p>
        <ul>
          <li>Block all cookies (may affect website functionality)</li>
          <li>Delete existing cookies from our website</li>
          <li>Set preferences for different types of cookies</li>
          <li>Receive notifications when cookies are set</li>
        </ul>

        <h3>Our Cookie Preference Center</h3>
        <p>Manage your preferences directly on our website:</p>
        <ul>
          <li>Accept or decline non-essential cookies</li>
          <li>Choose specific cookie categories</li>
          <li>Update preferences at any time</li>
          <li>View detailed information about each cookie type</li>
        </ul>

        <h2>Cookie Retention</h2>
        <p>Different cookies have different retention periods:</p>
        <ul>
          <li>Session cookies: Deleted when you close your browser</li>
          <li>Persistent cookies: Remain for specified periods (up to 2 years)</li>
          <li>Third-party cookies: Controlled by respective organizations</li>
          <li>Marketing cookies: Typically retained for 6-12 months</li>
        </ul>

        <h2>Impact of Disabling Cookies</h2>
        <p>Disabling certain cookies may affect:</p>
        <ul>
          <li>Website functionality and user experience</li>
          <li>Ability to stay logged in during visits</li>
          <li>Personalized content and recommendations</li>
          <li>Analytics that help us improve our services</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          We do not knowingly collect cookies from children under 18. Parents can manage cookie settings on behalf of their children through browser controls.
        </p>

        <h2>Updates to This Policy</h2>
        <p>
          We may update this cookie policy to reflect changes in technology or regulations. Continued use of our website constitutes acceptance of any updates.
        </p>

        <h2>Contact Us</h2>
        <p>
          For questions about our use of cookies:<br />
          <strong>Email:</strong> privacy@careconnect.com.au<br />
          <strong>Phone:</strong> 1800 CARE HELP (1800 2273 4357)
        </p>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Transparency:</strong> This cookie policy complies with Australian privacy laws and provides transparency about our data collection practices.
          </p>
        </div>
      </div>
    </div>
  );
}