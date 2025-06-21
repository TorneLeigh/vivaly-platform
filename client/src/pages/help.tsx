import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  HelpCircle, 
  FileText, 
  Shield, 
  CreditCard,
  Users,
  Clock,
  ChevronRight,
  Send
} from "lucide-react";

const faqData = [
  {
    category: "Getting Started",
    icon: <Users className="h-5 w-5" />,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top right corner and follow the simple registration process. You'll need to provide basic information and verify your email address."
      },
      {
        q: "How do I find caregivers in my area?",
        a: "Use our search function on the homepage. Enter your location and the type of care you need, then browse through verified caregivers near you."
      },
      {
        q: "Are all caregivers background checked?",
        a: "Yes, all caregivers on VIVALY undergo comprehensive background checks including Working with Children Checks (WWCC) and identity verification."
      }
    ]
  },
  {
    category: "Booking & Payments",
    icon: <CreditCard className="h-5 w-5" />,
    questions: [
      {
        q: "How do I book a caregiver?",
        a: "Browse caregivers, select your preferred provider, choose your dates and times, then complete the booking process with secure payment."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and digital payment methods. All payments are processed securely through Stripe."
      },
      {
        q: "Can I cancel or modify a booking?",
        a: "Yes, you can cancel or modify bookings through your account dashboard. Cancellation policies vary by caregiver and timing."
      }
    ]
  },
  {
    category: "Safety & Security",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        q: "How do you ensure caregiver quality?",
        a: "All caregivers complete identity verification, background checks, WWCC verification, and undergo a comprehensive application review process."
      },
      {
        q: "What if I'm not satisfied with a caregiver?",
        a: "Contact our support team immediately. We'll work to resolve any issues and can help arrange alternative care if needed."
      },
      {
        q: "Is my personal information secure?",
        a: "Yes, we use industry-standard encryption and security measures to protect all personal and payment information."
      }
    ]
  }
];

export default function Help() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async (data: typeof emailForm) => {
      return await apiRequest("POST", "/api/help/send-email", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setEmailForm({ name: "", email: "", subject: "", message: "" });
      setShowEmailForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.name || !emailForm.email || !emailForm.subject || !emailForm.message) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    sendEmailMutation.mutate(emailForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Email Form Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Support</h3>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="How can we help you?"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  rows={4}
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={sendEmailMutation.isPending}
                    className="flex-1 bg-coral hover:bg-coral/90"
                  >
                    {sendEmailMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowEmailForm(true)}
          >
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-coral mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">Send us a detailed message</p>
              <Button variant="outline">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {category.icon}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-coral" />
                          {faq.q}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed pl-6">{faq.a}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <p className="text-sm text-gray-600">Can't find what you're looking for? Send us a message.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea 
                    placeholder="Describe your question or issue in detail..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-green-50">Low</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-yellow-50">Medium</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-red-50">High</Badge>
                  </div>
                </div>
                
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Send Message
                </Button>
                
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Support Hours</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Mon-Fri 8AM-8PM AEST
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resource Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Helpful Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/terms-of-service" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">Terms of Service</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="/privacy-policy" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">Privacy Policy</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="/refund-policy" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">Refund Policy</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="/accessibility" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">Accessibility</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}