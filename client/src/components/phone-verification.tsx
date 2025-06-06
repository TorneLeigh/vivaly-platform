import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Phone, MessageSquare } from "lucide-react";

interface PhoneVerificationProps {
  onVerified: (phone: string) => void;
  phone?: string;
  required?: boolean;
}

export default function PhoneVerification({ onVerified, phone: initialPhone = "", required = false }: PhoneVerificationProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { toast } = useToast();

  const sendCodeMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      return await apiRequest("POST", "/api/auth/send-verification", { phone: phoneNumber });
    },
    onSuccess: () => {
      setCodeSent(true);
      setCountdown(60);
      toast({
        title: "Verification Code Sent",
        description: "Check your phone for the 6-digit code",
      });
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please check your phone number and try again",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      return await apiRequest("POST", "/api/auth/verify-phone", { phone, code });
    },
    onSuccess: () => {
      setVerified(true);
      onVerified(phone);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please try again",
        variant: "destructive",
      });
      setVerificationCode("");
    },
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Australian number
    if (digits.startsWith('61')) {
      // International format
      return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    } else if (digits.startsWith('0')) {
      // Australian format
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    } else if (digits.length <= 10) {
      // Format as 04XX XXX XXX
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSendCode = () => {
    if (!phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }
    
    sendCodeMutation.mutate(phone);
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    
    verifyCodeMutation.mutate({ phone, code: verificationCode });
  };

  if (verified) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-green-800">Phone Verified</h3>
            <p className="text-sm text-gray-600">{phone}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Verify Phone Number
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">
          We'll send you a verification code to confirm your number
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!codeSent ? (
          <>
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
            
            <Button 
              onClick={handleSendCode}
              disabled={sendCodeMutation.isPending || !phone.trim()}
              className="w-full"
            >
              {sendCodeMutation.isPending ? "Sending..." : "Send Verification Code"}
            </Button>
          </>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Code Sent</span>
              </div>
              <p className="text-sm text-blue-700">
                We sent a 6-digit code to {phone}
              </p>
            </div>
            
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            <Button 
              onClick={handleVerifyCode}
              disabled={verifyCodeMutation.isPending || verificationCode.length !== 6}
              className="w-full"
            >
              {verifyCodeMutation.isPending ? "Verifying..." : "Verify Code"}
            </Button>
            
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCodeSent(false);
                    setVerificationCode("");
                  }}
                  className="text-sm"
                >
                  Use different number
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}