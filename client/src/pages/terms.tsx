import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using CareConnect ("Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 VIVALY Property</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>All content, features, functionality, designs, logos, trademarks, and trade names are owned by VIVALY</li>
                      <li>Protected by Australian and international copyright, trademark, patent, trade secret laws</li>
                      <li>No right to copy, modify, distribute, or create derivative works</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Prohibited Uses</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Scraping, copying, or reproducing platform data</li>
                      <li>Reverse engineering platform functionality</li>
                      <li>Creating competing services using our intellectual property</li>
                      <li>Using our branding, design, or business model without permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Platform Usage Rules</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Caregivers</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Must provide accurate credentials and qualifications</li>
                      <li>Undergo verification process before approval</li>
                      <li>Maintain professional conduct at all times</li>
                      <li>Cannot bypass platform for payments or bookings</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Families</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Provide accurate information about care needs</li>
                      <li>Use platform only for legitimate childcare services</li>
                      <li>Cannot discriminate based on protected characteristics</li>
                      <li>Respect caregivers' policies and boundaries</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Business Model Protection</h2>
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <p className="text-amber-800 font-medium">
                    Important: These restrictions protect our business model and ensure fair competition.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Competitive Restrictions</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Users cannot use platform data to create competing services</li>
                      <li>Prohibited to recruit caregivers for competing platforms</li>
                      <li>Cannot copy business processes, matching algorithms, or operational methods</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Non-Circumvention</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>All transactions must go through CareConnect platform</li>
                      <li>Payment processing required through approved methods</li>
                      <li>No direct arrangements that bypass platform fees</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Safety and Verification</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  VIVALY implements comprehensive safety measures including background checks, verification processes, and emergency support systems. However, users remain responsible for their own safety and additional due diligence.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  VIVALY provides platform services "as is" without warranties. We are not liable for actions of caregivers or families, disputes between users, or service interruptions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms are governed by the laws of New South Wales, Australia. Disputes will be resolved through Australian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Legal matters:</strong> legal@careconnectau.com<br/>
                    <strong>General support:</strong> support@careconnectau.com
                  </p>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-center text-gray-500">
                  © 2025 CareConnect Australia. All rights reserved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}