import { useEffect } from "react";

export default function Accessibility() {
  useEffect(() => {
    document.title = "Accessibility Statement | Aircare";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Accessibility Statement</h1>
        
        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2>Our Commitment</h2>
        <p>
          Care Platform Australia is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.
        </p>

        <h2>Conformance Status</h2>
        <p>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities.
        </p>

        <h2>Accessibility Features</h2>
        <h3>Navigation</h3>
        <ul>
          <li>Keyboard navigation support throughout the platform</li>
          <li>Skip links to main content areas</li>
          <li>Consistent navigation structure across all pages</li>
          <li>Clear heading hierarchy for screen readers</li>
        </ul>

        <h3>Visual Design</h3>
        <ul>
          <li>High contrast color schemes for readability</li>
          <li>Scalable text that can be enlarged up to 200%</li>
          <li>Alternative text for all informative images</li>
          <li>Clear visual focus indicators for interactive elements</li>
        </ul>

        <h3>Content</h3>
        <ul>
          <li>Plain language used throughout the platform</li>
          <li>Important information presented in multiple formats</li>
          <li>Consistent page layouts and functionality</li>
          <li>Error messages that clearly explain required actions</li>
        </ul>

        <h2>Assistive Technology Compatibility</h2>
        <p>Our platform is designed to work with:</p>
        <ul>
          <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
          <li>Voice recognition software</li>
          <li>Keyboard-only navigation</li>
          <li>Screen magnification tools</li>
        </ul>

        <h2>Known Limitations</h2>
        <p>We are working to address the following known accessibility challenges:</p>
        <ul>
          <li>Some complex interactive elements may require additional keyboard support</li>
          <li>Video content accessibility features are being enhanced</li>
          <li>Mobile accessibility improvements are ongoing</li>
        </ul>

        <h2>Feedback and Contact</h2>
        <p>
          We welcome feedback on the accessibility of our platform. If you encounter accessibility barriers, please contact us:
        </p>
        <p>
          <strong>Accessibility Coordinator</strong><br />
          Email: accessibility@careconnect.com.au<br />
          Phone: 1800 CARE HELP (1800 2273 4357)
        </p>

        <p>Please provide:</p>
        <ul>
          <li>The specific page or feature</li>
          <li>Your assistive technology and version</li>
          <li>The problem you encountered</li>
          <li>Your contact information for follow-up</li>
        </ul>

        <p>We aim to respond to accessibility feedback within 2 business days.</p>

        <h2>Technical Specifications</h2>
        <p>Our platform accessibility relies on the following technologies:</p>
        <ul>
          <li>HTML5 semantic markup</li>
          <li>ARIA labels and descriptions</li>
          <li>CSS for visual presentation</li>
          <li>JavaScript for enhanced functionality</li>
        </ul>

        <h2>Assessment and Testing</h2>
        <p>Regular accessibility assessments include:</p>
        <ul>
          <li>Automated testing tools</li>
          <li>Manual testing with screen readers</li>
          <li>Keyboard navigation testing</li>
          <li>User testing with people with disabilities</li>
        </ul>

        <h2>Continuous Improvement</h2>
        <p>We regularly review and update our accessibility practices:</p>
        <ul>
          <li>Annual comprehensive accessibility audits</li>
          <li>Ongoing staff training on accessibility best practices</li>
          <li>User feedback integration into development processes</li>
          <li>Technology updates to improve accessibility features</li>
        </ul>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Inclusive Design:</strong> This statement was prepared in accordance with Australian accessibility requirements and international best practices for digital accessibility.
          </p>
        </div>
      </div>
    </div>
  );
}