import { useEffect } from "react";

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy | Aircare AU";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
        
        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2>Overview</h2>
        <p>
          Care Platform Australia is committed to providing excellent service. This refund policy outlines the circumstances under which refunds may be provided for services booked through our platform.
        </p>

        <h2>Service Fees and Platform Charges</h2>
        <h3>Booking Fees</h3>
        <ul>
          <li>Platform service fees are non-refundable once a booking is confirmed</li>
          <li>Payment processing fees are non-refundable</li>
          <li>Service fees support platform operations and safety measures</li>
        </ul>

        <h3>Caregiver Service Payments</h3>
        <ul>
          <li>Payments for completed services are non-refundable</li>
          <li>Partial refunds may be considered for services not rendered due to extraordinary circumstances</li>
        </ul>

        <h2>Refund Eligibility</h2>
        <h3>Full Refunds Available For:</h3>
        <ul>
          <li>Cancellations made more than 24 hours before scheduled service</li>
          <li>Services cancelled by the caregiver with less than 4 hours notice</li>
          <li>Safety concerns that prevent service delivery</li>
          <li>Platform technical issues preventing service connection</li>
        </ul>

        <h3>Partial Refunds May Apply For:</h3>
        <ul>
          <li>Services partially completed due to unforeseen circumstances</li>
          <li>Early termination due to mutual agreement</li>
          <li>Weather-related cancellations for outdoor services</li>
        </ul>

        <h3>No Refunds For:</h3>
        <ul>
          <li>Cancellations made less than 24 hours before service</li>
          <li>Services completed as agreed</li>
          <li>Personality conflicts or minor dissatisfaction</li>
          <li>Changes in family circumstances after booking</li>
        </ul>

        <h2>Refund Process</h2>
        <h3>How to Request a Refund</h3>
        <ol>
          <li>Contact our support team within 48 hours of the incident</li>
          <li>Provide booking reference number and detailed explanation</li>
          <li>Submit any relevant documentation or evidence</li>
          <li>Allow 3-5 business days for review</li>
        </ol>

        <h3>Review Process</h3>
        <ul>
          <li>All refund requests are reviewed individually</li>
          <li>Documentation and communication records are examined</li>
          <li>Both parties may be contacted for clarification</li>
          <li>Decisions are based on platform terms and circumstances</li>
        </ul>

        <h3>Refund Timeline</h3>
        <ul>
          <li>Approved refunds processed within 5-7 business days</li>
          <li>Refunds issued to original payment method</li>
          <li>Processing time may vary by payment provider</li>
          <li>Email confirmation sent when refund is processed</li>
        </ul>

        <h2>Special Circumstances</h2>
        <h3>Emergency Situations</h3>
        <ul>
          <li>Medical emergencies affecting either party</li>
          <li>Natural disasters or extreme weather</li>
          <li>Government restrictions or lockdowns</li>
          <li>Family emergencies requiring immediate attention</li>
        </ul>

        <h3>Caregiver Performance Issues</h3>
        <ul>
          <li>Failure to arrive for scheduled service</li>
          <li>Inadequate qualifications for specialized care</li>
          <li>Safety violations or inappropriate behavior</li>
          <li>Misrepresentation of skills or experience</li>
        </ul>

        <h3>Platform Issues</h3>
        <ul>
          <li>Technical problems preventing booking completion</li>
          <li>Payment processing errors</li>
          <li>Incorrect matching or service details</li>
          <li>System outages affecting service delivery</li>
        </ul>

        <h2>Dispute Resolution</h2>
        <h3>Internal Resolution</h3>
        <ul>
          <li>Initial review by customer service team</li>
          <li>Escalation to management for complex cases</li>
          <li>Mediation between parties when appropriate</li>
          <li>Documentation of all communications</li>
        </ul>

        <h3>External Options</h3>
        <ul>
          <li>Australian Consumer Law protections apply</li>
          <li>State fair trading offices for unresolved disputes</li>
          <li>Small claims court for significant amounts</li>
          <li>Industry ombudsman services where applicable</li>
        </ul>

        <h2>Consumer Rights</h2>
        <h3>Australian Consumer Law</h3>
        <ul>
          <li>Statutory guarantees for services apply</li>
          <li>Right to refund for major failures</li>
          <li>Remedies for misleading conduct</li>
          <li>Protection against unfair contract terms</li>
        </ul>

        <h3>Platform Commitment</h3>
        <ul>
          <li>Fair and transparent refund process</li>
          <li>Timely response to all requests</li>
          <li>Clear communication throughout process</li>
          <li>Continuous improvement based on feedback</li>
        </ul>

        <h2>Contact Information</h2>
        <h3>Refund Requests</h3>
        <p>
          <strong>Email:</strong> refunds@careconnect.com.au<br />
          <strong>Phone:</strong> 1800 CARE HELP (1800 2273 4357)<br />
          <strong>Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM AEST
        </p>

        <h3>Escalations</h3>
        <p>
          <strong>Email:</strong> disputes@careconnect.com.au<br />
          <strong>Manager Review:</strong> Available for complex cases
        </p>

        <h2>Policy Updates</h2>
        <p>
          This refund policy may be updated to reflect changes in our services or legal requirements. Users will be notified of material changes via email and platform notifications.
        </p>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Fair Protection:</strong> This refund policy complies with Australian Consumer Law and provides fair protection for both service providers and families using our platform.
          </p>
        </div>
      </div>
    </div>
  );
}