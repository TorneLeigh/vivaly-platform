import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Mail, Send, Users, Calendar } from "lucide-react";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailType, setEmailType] = useState("");
  const { toast } = useToast();

  const sendTestEmailMutation = useMutation({
    mutationFn: async ({ email, name, type }: { email: string; name: string; type: string }) => {
      return await apiRequest("POST", "/api/email/test", { email, name, type });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Email Test Result",
        description: data.success ? "Email sent successfully!" : "Failed to send email",
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Email Test Failed",
        description: error.message || "Error testing email functionality",
        variant: "destructive",
      });
    },
  });

  const handleSendTest = () => {
    if (!email.trim() || !name.trim() || !emailType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    sendTestEmailMutation.mutate({ email, name, type: emailType });
  };

  const emailTypes = [
    { value: "parent-welcome", label: "Parent Welcome Email" },
    { value: "caregiver-welcome", label: "Caregiver Welcome Email" },
    { value: "booking-confirmation", label: "Booking Confirmation" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Email Test Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Testing Dashboard
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Test VIVALY's email marketing system with SendGrid integration
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emailType">Email Type</Label>
                    <Select value={emailType} onValueChange={setEmailType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email type to test" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleSendTest}
                    disabled={sendTestEmailMutation.isPending || !email.trim() || !name.trim() || !emailType}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendTestEmailMutation.isPending ? "Sending..." : "Send Test Email"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Email System Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Email Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Parent Trial Sequence</span>
                      <span className="text-green-600 font-medium">7 emails</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Caregiver Sequence</span>
                      <span className="text-green-600 font-medium">5 emails</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Weekly Newsletters</span>
                      <span className="text-blue-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Booking Notifications</span>
                      <span className="text-blue-600 font-medium">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Email Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">Parent Sequence:</div>
                      <div className="text-gray-600">Days 1, 2, 4, 6, 8, 10, 12, 14</div>
                    </div>
                    <div>
                      <div className="font-medium">Caregiver Sequence:</div>
                      <div className="text-gray-600">Days 1, 3, 5, 7, 10</div>
                    </div>
                    <div>
                      <div className="font-medium">Newsletters:</div>
                      <div className="text-gray-600">Every Monday 9 AM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SendGrid API Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Email Templates Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Automation Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Analytics Tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Features Overview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Email Marketing Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Welcome Sequences</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Beautiful HTML templates</li>
                    <li>• Personalized messaging</li>
                    <li>• Progressive value delivery</li>
                    <li>• Clear call-to-actions</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Trial Campaigns</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• 14-day parent sequence</li>
                    <li>• 10-day caregiver sequence</li>
                    <li>• Social proof integration</li>
                    <li>• Urgency and scarcity</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Ongoing Engagement</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Weekly newsletters</li>
                    <li>• Booking confirmations</li>
                    <li>• Re-engagement campaigns</li>
                    <li>• Performance analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}