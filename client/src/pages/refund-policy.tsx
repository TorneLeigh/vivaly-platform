import { useEffect } from "react";

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy | VIVALY";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Refund Policy</h1>
        
        <p className="text-xs text-gray-600 mb-4">
          <strong>Effective Date:</strong> June 3, 2025<br />
          <strong>Last Updated:</strong> June 3, 2025
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Overview</h2>
        <p className="text-sm mb-4">
          VIVALY is committed to providing excellent service. This refund policy outlines circumstances under which refunds may be provided for services booked through our platform.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Service Fees and Platform Charges</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Booking Fees</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Platform service fees are non-refundable once a booking is confirmed</li>
          <li>Payment processing fees are non-refundable</li>
          <li>Service fees support platform operations and safety measures</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Caregiver Service Payments</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Payments for completed services are non-refundable</li>
          <li>Partial refunds may be considered for services not rendered due to extraordinary circumstances</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Refund Eligibility</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Full Refunds Available For:</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Cancellations made more than 24 hours before scheduled service</li>
          <li>Services cancelled by the caregiver with less than 4 hours notice</li>
          <li>Safety concerns that prevent service delivery</li>
          <li>Platform technical issues preventing service connection</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Partial Refunds May Apply For:</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Services partially completed due to unforeseen circumstances</li>
          <li>Early termination due to mutual agreement</li>
          <li>Weather-related cancellations for outdoor services</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">No Refunds For:</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Cancellations made less than 24 hours before service</li>
          <li>Client dissatisfaction with caregiver personality or style</li>
          <li>Change of mind or schedule conflicts</li>
          <li>Services completed as agreed</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Refund Request Process</h2>
        <h3 className="text-base font-medium mt-4 mb-2">How to Request</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Submit requests through the platform within 48 hours</li>
          <li>Provide detailed explanation and supporting evidence</li>
          <li>Include relevant documentation or communications</li>
          <li>Response provided within 2 business days</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Review Process</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Initial review by customer service team</li>
          <li>Investigation including caregiver input when relevant</li>
          <li>Decision based on policy guidelines and circumstances</li>
          <li>Appeals process available for disputed decisions</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Processing Timeline</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Approved refunds processed within 5-7 business days</li>
          <li>Refunds issued to original payment method</li>
          <li>Processing time may vary by payment provider</li>
          <li>Email confirmation sent when refund is processed</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Special Circumstances</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Emergency Situations</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Medical emergencies affecting either party</li>
          <li>Natural disasters or extreme weather</li>
          <li>Government restrictions or lockdowns</li>
          <li>Family emergencies requiring immediate attention</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Caregiver Performance Issues</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Failure to arrive for scheduled service</li>
          <li>Inadequate qualifications for specialized care</li>
          <li>Safety violations or inappropriate behavior</li>
          <li>Misrepresentation of skills or experience</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Platform Issues</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Technical problems preventing booking completion</li>
          <li>Payment processing errors</li>
          <li>Incorrect matching or service details</li>
          <li>System outages affecting service delivery</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Dispute Resolution</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Internal Resolution</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Initial review by customer service team</li>
          <li>Escalation to management for complex cases</li>
          <li>Mediation between parties when appropriate</li>
          <li>Documentation of all communications</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">External Options</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Australian Consumer Law protections apply</li>
          <li>State fair trading offices for unresolved disputes</li>
          <li>Small claims court for significant amounts</li>
          <li>Industry ombudsman services where applicable</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Consumer Rights</h2>
        <h3 className="text-base font-medium mt-4 mb-2">Australian Consumer Law</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Statutory guarantees for services apply</li>
          <li>Right to refund for major failures</li>
          <li>Remedies for misleading conduct</li>
          <li>Protection against unfair contract terms</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">Platform Commitment</h3>
        <ul className="text-sm space-y-1 mb-4">
          <li>Fair and transparent refund process</li>
          <li>Timely response to all requests</li>
          <li>Clear communication throughout process</li>
          <li>Continuous improvement based on feedback</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">Contact Information</h2>
        <p className="text-sm mb-4">
          For refund requests or assistance: <strong>support@vivaly.com.au</strong>
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3">Policy Updates</h2>
        <p className="text-sm mb-4">
          This refund policy may be updated to reflect changes in our services or legal requirements. Users will be notified of material changes via email and platform notifications.
        </p>

        <div className="mt-6 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>Fair Protection:</strong> This refund policy complies with Australian Consumer Law and provides fair protection for both service providers and families using our platform.
          </p>
        </div>
      </div>
    </div>
  );
}