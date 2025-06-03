import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Name, email, phone, address</li>
                      <li>Profile photos and ID documents</li>
                      <li>Payment and billing details</li>
                      <li>Background check data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Search preferences</li>
                      <li>Booking history</li>
                      <li>Platform messages</li>
                      <li>Location data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Third-Party Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Social media profiles</li>
                      <li>Background check results</li>
                      <li>Employment references</li>
                      <li>Verification records</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-800 font-medium">
                    We use your information to provide safe, reliable childcare matching services.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Service Provision</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Match families with suitable caregivers</li>
                      <li>Process bookings and payments</li>
                      <li>Verify caregiver credentials</li>
                      <li>Facilitate secure communications</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Improvement</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Analyze usage patterns</li>
                      <li>Develop new features</li>
                      <li>Prevent fraud and ensure safety</li>
                      <li>Comply with legal requirements</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Between Users</h3>
                    <p className="text-gray-700">
                      Profile information is visible to potential matches. Contact details are only shared after confirmed bookings. Reviews and ratings are shared publicly for safety.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Third-Party Partners</h3>
                    <p className="text-gray-700">
                      We share data with payment processors, background check providers, cloud services, and analytics providers only as necessary for platform operation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Requirements</h3>
                    <p className="text-gray-700">
                      We may share information with law enforcement, courts, child safety authorities, and government agencies when legally required.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-medium">
                    We implement industry-standard security measures to protect your personal information.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Protection Measures</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Encryption for data transmission</li>
                      <li>Secure servers with regular updates</li>
                      <li>Multi-factor authentication</li>
                      <li>Regular security audits</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Controls</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Limited employee access</li>
                      <li>Staff background checks</li>
                      <li>Privacy training programs</li>
                      <li>Complete audit trails</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Account Control</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Access and update your information</li>
                      <li>Download your data</li>
                      <li>Delete your account</li>
                      <li>Opt-out of marketing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Settings</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Control profile visibility</li>
                      <li>Manage communication preferences</li>
                      <li>Set location sharing permissions</li>
                      <li>Choose notification settings</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our platform is intended for users 18 years and older. We do not knowingly collect children's personal information. Parents and guardians control children's information in bookings, and we maintain strict verification for anyone providing childcare services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Privacy Officer:</strong> privacy@careconnectau.com<br/>
                    <strong>Data Protection Queries:</strong> dpo@careconnectau.com
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