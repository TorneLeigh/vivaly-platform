import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Shield, 
  CreditCard, 
  Users,
  Phone,
  MessageCircle,
  Home,
  HelpCircle
} from "lucide-react";
import { Link } from "wouter";

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      category: "Verification & Safety",
      icon: <Shield className="h-5 w-5" />,
      questions: [
        {
          question: "How are carers verified?",
          answer: "Each carer undergoes comprehensive verification including ID verification, Working With Children Check (WWCC), police background checks, and reference verification. For aged care providers, we also verify relevant qualifications and experience. All documentation must be current and valid before a carer can accept bookings."
        },
        {
          question: "What background checks do you perform?",
          answer: "We conduct national police background checks, verify Working With Children Checks where applicable, confirm identity through photo ID, and check references from previous employers or families. For specialized care roles, we also verify relevant certifications and training."
        },
        {
          question: "Are carers insured?",
          answer: "Yes, all carers on VIVALY carry professional indemnity insurance. Additionally, our platform provides coverage for bookings made through VIVALY. We recommend discussing specific insurance details with your chosen carer before beginning care."
        },
        {
          question: "What happens in case of an emergency?",
          answer: "All carers are trained in first aid and emergency procedures. They have access to our 24/7 emergency support line. Emergency contact details are always available, and carers are instructed to call emergency services first, then notify families and VIVALY support."
        }
      ]
    },
    {
      category: "Booking & Payment",
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          question: "Is payment secure?",
          answer: "Yes. All bookings and payments are handled securely through Stripe with bank-level encryption. We never store your full payment details on our servers. All transactions are protected by SSL encryption and meet PCI compliance standards."
        },
        {
          question: "Can I get recurring bookings?",
          answer: "Yes, VIVALY supports both one-time and recurring care bookings. You can set up weekly, bi-weekly, or monthly recurring sessions during the booking process. You can modify or cancel recurring bookings at any time with appropriate notice."
        },
        {
          question: "What are the cancellation policies?",
          answer: "Cancellation policies vary by service type and carer. Generally, we require 24-48 hours notice for standard bookings. Emergency cancellations are handled case-by-case. Recurring bookings can be paused or cancelled with one week's notice. Check specific carer profiles for their individual policies."
        },
        {
          question: "How do I pay for services?",
          answer: "Payment is processed through our secure platform using credit/debit cards or bank transfers. You can pay per session or set up automatic payments for recurring bookings. Payment is typically processed after the service is completed, unless otherwise arranged."
        }
      ]
    },
    {
      category: "Finding Care",
      icon: <Users className="h-5 w-5" />,
      questions: [
        {
          question: "How do I find the right carer for my needs?",
          answer: "Use our search filters to narrow down carers by location, availability, experience, and specializations. Read profiles carefully, check reviews from other families, and consider using our AI assistant for personalized recommendations. We also offer consultation calls to help match you with suitable carers."
        },
        {
          question: "Can I meet the carer before booking?",
          answer: "Absolutely! We encourage meet-and-greet sessions before confirming ongoing care arrangements. This can be arranged through our messaging system and helps ensure compatibility between your family and the carer."
        },
        {
          question: "What if I'm not satisfied with a carer?",
          answer: "If you're not satisfied with a carer's service, contact our support team immediately. We'll work to resolve any issues and can help you find an alternative carer if needed. Our goal is to ensure you're completely happy with your care arrangement."
        },
        {
          question: "Do you offer emergency or last-minute care?",
          answer: "Many of our carers offer emergency or last-minute availability, though this may be limited and subject to higher rates. Use our urgent care filter when searching, or contact our support team who can help find available carers quickly."
        }
      ]
    },
    {
      category: "Platform & Support",
      icon: <Phone className="h-5 w-5" />,
      questions: [
        {
          question: "Is there customer support available?",
          answer: "Yes, we provide 24/7 customer support through multiple channels including phone, email, and live chat. Our AI assistant is also available instantly for common questions and recommendations. For urgent matters, our emergency support line is always available."
        },
        {
          question: "How does the review system work?",
          answer: "After each completed booking, both families and carers can leave reviews and ratings. Reviews are verified and can only be left by users who have completed actual bookings. This helps maintain transparency and quality across our platform."
        },
        {
          question: "Can I use VIVALY on my mobile device?",
          answer: "Yes, our website is fully mobile-responsive and works seamlessly on smartphones and tablets. You can search for carers, make bookings, communicate with carers, and manage your account from any device with internet access."
        },
        {
          question: "What information do I need to provide when signing up?",
          answer: "Basic registration requires your name, email, phone number, and location. For booking services, you'll need to provide more details about your care needs, emergency contacts, and payment information. All information is kept secure and private."
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const itemKey = categoryIndex * 100 + questionIndex;
    setOpenItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const isItemOpen = (categoryIndex: number, questionIndex: number) => {
    const itemKey = categoryIndex * 100 + questionIndex;
    return openItems.includes(itemKey);
  };

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Find answers to common questions about VIVALY's care services, 
              safety measures, and booking process.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No FAQs found matching your search. Try different keywords or browse all categories below.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3 text-purple-600">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => (
                      <Card key={questionIndex} className="overflow-hidden">
                        <button
                          onClick={() => toggleItem(categoryIndex, questionIndex)}
                          className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                              {faq.question}
                            </h3>
                            {isItemOpen(categoryIndex, questionIndex) ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        
                        {isItemOpen(categoryIndex, questionIndex) && (
                          <CardContent className="pt-0 pb-6 px-6">
                            <div className="border-t pt-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Our support team and AI assistant are here to help you find the answers you need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">24/7 Phone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Speak directly with our support team anytime
              </p>
              <p className="text-purple-600 font-semibold">1800-VIVALY</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Get instant answers and recommendations
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/ai-chat">Chat Now</Link>
              </Button>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Chat with our support team in real-time
              </p>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Start Chat
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-purple-50 dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn more about the different types of care available on VIVALY
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button asChild variant="outline" className="h-auto p-6 flex-col">
              <Link href="/child-care-services">
                <div className="text-center">
                  <div className="text-2xl mb-2">👶</div>
                  <div className="font-semibold">Child Care Services</div>
                  <div className="text-sm text-gray-500 mt-1">Nannies, babysitters, after-school care</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-6 flex-col">
              <Link href="/pet-care-services">
                <div className="text-center">
                  <div className="text-2xl mb-2">🐕</div>
                  <div className="font-semibold">Pet Care Services</div>
                  <div className="text-sm text-gray-500 mt-1">Dog walking, pet sitting, visits</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-6 flex-col">
              <Link href="/aged-care-services">
                <div className="text-center">
                  <div className="text-2xl mb-2">❤️</div>
                  <div className="font-semibold">Aged Care Support</div>
                  <div className="text-sm text-gray-500 mt-1">Companionship, personal care, transport</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 sm:mb-0">
              <Home className="h-4 w-4 inline mr-2" />
              Back to Home
            </Link>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                How It Works
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Find Care
              </Link>
              <Link href="/ai-chat" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}