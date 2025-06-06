import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Eye, Calendar, Users } from "lucide-react";

const emailTemplates = {
  "parent-welcome": {
    subject: "🏠 Welcome to VIVALY - Your Childcare Solution Awaits!",
    preview: "You've taken the first step towards stress-free, flexible childcare...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Home-based childcare made simple</p>
        </div>
        
        <h2 style="color: #1F2937;">Welcome to VIVALY, John!</h2>
        
        <p style="color: #374151; line-height: 1.6;">You've taken the first step towards stress-free, flexible childcare. Your VIVALY trial gives you priority access to our verified caregivers in your area.</p>
        
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2px; border-radius: 12px; margin: 25px 0;">
          <div style="background: white; padding: 25px; border-radius: 10px;">
            <h3 style="color: #1F2937; margin-top: 0;">What's Next?</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>✓ Complete your family profile</li>
              <li>✓ Set your childcare preferences</li>
              <li>✓ Browse verified caregivers in your area</li>
              <li>✓ Book your first session with confidence</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Your Profile</a>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">Why Parents Choose VIVALY:</h4>
          <p style="color: #374151; margin: 0;">• Skip daycare waitlists (average 18 months)<br>
          • Save up to 40% on childcare costs<br>
          • Flexible booking from 2 hours to full days<br>
          • All caregivers verified with WWCC</p>
        </div>
      </div>
    `
  },
  "parent-profile-reminder": {
    subject: "📝 Complete Your VIVALY Profile - Find Caregivers Today",
    preview: "We noticed you haven't completed your family profile yet...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Hi there! 👋</h2>
        
        <p style="color: #374151; line-height: 1.6;">We noticed you haven't completed your family profile yet. This only takes 3 minutes and unlocks access to verified caregivers in your area.</p>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F59E0B;">
          <h4 style="color: #92400E; margin-top: 0;">⏰ Did You Know?</h4>
          <p style="color: #92400E; margin: 0;">Families with complete profiles get 3x more caregiver responses and book 50% faster.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Profile (3 min)</a>
        </div>
      </div>
    `
  },
  "parent-success-story": {
    subject: "🌟 How Sarah Found Her Perfect Caregiver in 24 Hours",
    preview: "Real stories from real families using VIVALY...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Real Stories from Real Families</h2>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: #7C3AED; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">S</div>
            <div>
              <h4 style="margin: 0; color: #1F2937;">Sarah M. - Mother of 2</h4>
              <p style="margin: 0; color: #6B7280; font-size: 14px;">Bondi, NSW</p>
            </div>
          </div>
          <p style="color: #374151; font-style: italic; line-height: 1.6; margin: 0;">"I was on 3 daycare waitlists for over a year. With VIVALY, I found Emma within 24 hours. She's been caring for my kids for 6 months now - they absolutely love her! Plus I'm saving $200/week compared to traditional daycare."</p>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📊 VIVALY vs. Traditional Childcare:</h4>
          <ul style="color: #374151; line-height: 1.8; margin: 0;">
            <li>⚡ Find care in 24-48 hours (vs. 18 month waitlists)</li>
            <li>💰 Save 30-50% on childcare costs</li>
            <li>🕒 Book care from 2 hours to full days</li>
            <li>✅ All caregivers verified with WWCC</li>
          </ul>
        </div>
      </div>
    `
  },
  "caregiver-welcome": {
    subject: "🚀 Welcome to VIVALY - Start Earning with Flexible Childcare Work",
    preview: "Thank you for joining Australia's leading home-based childcare marketplace...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Home-based childcare made simple</p>
        </div>
        
        <h2 style="color: #1F2937;">Welcome to VIVALY, Emma!</h2>
        
        <p style="color: #374151; line-height: 1.6;">Thank you for joining Australia's leading home-based childcare marketplace. You're now part of a community that's revolutionizing how families access quality childcare.</p>
        
        <div style="background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); padding: 2px; border-radius: 12px; margin: 25px 0;">
          <div style="background: white; padding: 25px; border-radius: 10px;">
            <h3 style="color: #1F2937; margin-top: 0;">Getting Started - Your Path to Success:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>✓ Complete your caregiver profile</li>
              <li>✓ Upload required verifications (WWCC, First Aid)</li>
              <li>✓ Set your availability and hourly rates</li>
              <li>✓ Start receiving booking requests immediately</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10B981;">
          <h4 style="color: #1F2937; margin-top: 0;">💰 Earning Potential:</h4>
          <p style="color: #374151; margin: 0;">• Set your own rates ($25-45/hour average)<br>
          • Choose your own schedule and availability<br>
          • Work with verified Australian families<br>
          • Instant payment after each session</p>
        </div>
      </div>
    `
  },
  "booking-confirmation": {
    subject: "✅ Booking Confirmed - VIVALY Childcare",
    preview: "Your booking has been confirmed with Emma Wilson...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <div style="background: #10B981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <h2 style="margin: 0 0 10px 0;">✅ Booking Confirmed!</h2>
          <p style="margin: 0; opacity: 0.9;">Your childcare session has been successfully booked</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">Booking Details:</h3>
          <div style="color: #374151; line-height: 1.8;">
            <p><strong>Caregiver:</strong> Emma Wilson</p>
            <p><strong>Date:</strong> Tomorrow, March 15th</p>
            <p><strong>Time:</strong> 9:00 AM - 1:00 PM (4 hours)</p>
            <p><strong>Location:</strong> Your home address</p>
            <p><strong>Total Cost:</strong> $140.00</p>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">Before the Session:</h4>
          <ul style="color: #374151; margin: 0;">
            <li>Emma will arrive 5 minutes early</li>
            <li>She'll text you when she's on her way</li>
            <li>Emergency contact: 1300 VIVALY</li>
          </ul>
        </div>
      </div>
    `
  }
};

export default function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  const template = selectedTemplate ? emailTemplates[selectedTemplate as keyof typeof emailTemplates] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6" />
                VIVALY Email Templates Preview
              </CardTitle>
              <p className="text-gray-600">
                View all email templates that are automatically sent for signups, bookings, and campaigns
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">Trial Sequences</h4>
                    <p className="text-sm text-gray-600">Parent: 7 emails, Caregiver: 5 emails</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Booking Automation</h4>
                    <p className="text-sm text-gray-600">Instant confirmations & alerts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Professional Design</h4>
                    <p className="text-sm text-gray-600">Mobile-responsive templates</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Email Template Selector */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Email Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template to preview" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent-welcome">Parent Welcome Email</SelectItem>
                      <SelectItem value="parent-profile-reminder">Profile Completion Reminder</SelectItem>
                      <SelectItem value="parent-success-story">Success Story Email</SelectItem>
                      <SelectItem value="caregiver-welcome">Caregiver Welcome Email</SelectItem>
                      <SelectItem value="booking-confirmation">Booking Confirmation</SelectItem>
                    </SelectContent>
                  </Select>

                  {template && (
                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold text-sm">Subject Line:</h4>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Preview Text:</h4>
                        <p className="text-sm text-gray-600">{template.preview}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">All Email Templates:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="font-medium text-purple-700">Parent Sequence (7 emails):</div>
                      <ul className="text-gray-600 space-y-1 ml-2">
                        <li>• Day 1: Welcome & Onboarding</li>
                        <li>• Day 2: Profile Completion</li>
                        <li>• Day 4: Success Stories</li>
                        <li>• Day 6: Cost Savings</li>
                        <li>• Day 8: Safety & Verification</li>
                        <li>• Day 10: Trial Urgency</li>
                        <li>• Day 12: Final Notice</li>
                      </ul>
                      
                      <div className="font-medium text-green-700 pt-2">Caregiver Sequence (5 emails):</div>
                      <ul className="text-gray-600 space-y-1 ml-2">
                        <li>• Day 1: Welcome & Opportunity</li>
                        <li>• Day 3: Earning Potential</li>
                        <li>• Day 5: Success Stories</li>
                        <li>• Day 7: Verification Guide</li>
                        <li>• Day 10: Final Push</li>
                      </ul>
                      
                      <div className="font-medium text-blue-700 pt-2">Transactional:</div>
                      <ul className="text-gray-600 space-y-1 ml-2">
                        <li>• Booking Confirmations</li>
                        <li>• Payment Receipts</li>
                        <li>• Weekly Newsletters</li>
                        <li>• Profile Reminders</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Email Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {template ? "Email Preview" : "Select a template to preview"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {template ? (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Subject:</div>
                        <div className="font-semibold">{template.subject}</div>
                      </div>
                      
                      <div className="border rounded-lg bg-white">
                        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                          <div className="text-sm text-gray-600">Email Content Preview:</div>
                        </div>
                        <div 
                          className="p-4 overflow-auto max-h-96"
                          dangerouslySetInnerHTML={{ __html: template.html }}
                        />
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Automation Trigger:</h4>
                        <p className="text-blue-800 text-sm">
                          {selectedTemplate === 'parent-welcome' && "Sent immediately when a parent signs up for trial"}
                          {selectedTemplate === 'parent-profile-reminder' && "Sent 24 hours after signup if profile is incomplete"}
                          {selectedTemplate === 'parent-success-story' && "Sent 4 days after trial signup as part of sequence"}
                          {selectedTemplate === 'caregiver-welcome' && "Sent immediately when a caregiver signs up for trial"}
                          {selectedTemplate === 'booking-confirmation' && "Sent immediately after a booking is successfully created"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Choose an email template from the dropdown to see the preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Automation Status */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Email Automation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold">SendGrid Connected</h4>
                  <p className="text-sm text-gray-600">Ready to send emails</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold">Templates Active</h4>
                  <p className="text-sm text-gray-600">12 email templates ready</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold">Automation Running</h4>
                  <p className="text-sm text-gray-600">Triggers on signup & booking</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold">Mobile Optimized</h4>
                  <p className="text-sm text-gray-600">Responsive design</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}