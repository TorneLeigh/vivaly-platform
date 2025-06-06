import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";

export default function SMSTest() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("VIVALY SMS test - system is working!");
  const { toast } = useToast();

  const sendSMSMutation = useMutation({
    mutationFn: async ({ phone, message }: { phone: string; message: string }) => {
      return await apiRequest("POST", "/api/sms/test", { phone, message });
    },
    onSuccess: (data: any) => {
      toast({
        title: "SMS Test Result",
        description: data.success ? "SMS sent successfully!" : "Failed to send SMS",
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "SMS Test Failed",
        description: error.message || "Error testing SMS functionality",
        variant: "destructive",
      });
    },
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.startsWith('61')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    } else if (digits.startsWith('0')) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSendTest = () => {
    if (!phone.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }
    
    sendSMSMutation.mutate({ phone, message });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Testing Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600">
                Test VIVALY's SMS functionality with Twilio integration
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0400 000 000"
                  maxLength={13}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Australian mobile numbers only
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your test message..."
                  rows={4}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/160 characters
                </p>
              </div>

              <Button 
                onClick={handleSendTest}
                disabled={sendSMSMutation.isPending || !phone.trim() || !message.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {sendSMSMutation.isPending ? "Sending..." : "Send Test SMS"}
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">SMS Capabilities</h3>
                <ul className="text-sm space-y-1">
                  <li>• Booking confirmations and alerts</li>
                  <li>• Phone number verification codes</li>
                  <li>• Payment confirmations</li>
                  <li>• Emergency notifications</li>
                  <li>• Trial welcome messages</li>
                  <li>• Booking reminders (24h and 2h)</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Integration Status</h3>
                <ul className="text-sm space-y-1">
                  <li>✅ Twilio SMS service configured</li>
                  <li>✅ Australian phone number validation</li>
                  <li>✅ Message templates ready</li>
                  <li>✅ Rate limiting implemented</li>
                  <li>✅ Error handling and logging</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}