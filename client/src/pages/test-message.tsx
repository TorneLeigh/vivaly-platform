import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, User } from "lucide-react";

export default function TestMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageContent, setMessageContent] = useState(
    "Hi! I'm Emma Wilson, a qualified caregiver with 5 years of experience. I specialize in childcare for children aged 2-12 and am passionate about creating a safe, nurturing environment. I'm available for both regular weekly care and occasional babysitting. I would love to discuss your family's specific needs and see if we would be a good match. Could we schedule a meet-and-greet?"
  );
  const { toast } = useToast();

  const sendTestMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: 'caregiver_test_123',
          receiverId: '-2EGQ1xRVMZ7y9n4w3JV_', // tornevelk1@gmail.com user ID
          content: messageContent
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "The caregiver message has been sent to tornevelk1@gmail.com and email notification dispatched.",
        });
        setMessageContent("Hi! I'm Emma Wilson, a qualified caregiver with 5 years of experience...");
      } else {
        toast({
          title: "Failed to Send Message",
          description: result.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-coral" />
              Test Message to Parent
            </CardTitle>
            <p className="text-gray-600">
              Send a test message from caregiver Emma Wilson to tornevelk1@gmail.com
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sender Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">From: Emma Wilson (Caregiver)</span>
              </div>
              <p className="text-sm text-blue-700">testcaregiver@vivaly.com • Professional Caregiver</p>
            </div>

            {/* Receiver Info */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">To: Torne Velk (Parent)</span>
              </div>
              <p className="text-sm text-green-700">tornevelk1@gmail.com • Parent Account</p>
            </div>

            {/* Message Content */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Message Content:
              </label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter message content..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Character count: {messageContent.length}
              </p>
            </div>

            {/* Send Button */}
            <Button 
              onClick={sendTestMessage}
              disabled={isLoading || !messageContent.trim()}
              className="w-full bg-coral hover:bg-coral/90"
              size="lg"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Message
                </>
              )}
            </Button>

            {/* Info */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">What happens when you send:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Message is stored in the platform database</li>
                <li>• Email notification sent to tornevelk1@gmail.com</li>
                <li>• Parent can view message in their messages section</li>
                <li>• Platform owner receives activity notification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}