import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock, Shield, ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WWCCVerificationProps {
  nannyId?: number;
  currentStatus?: string;
  hasWwcc?: boolean;
}

export default function WWCCVerification({ 
  nannyId, 
  currentStatus = "pending",
  hasWwcc = false
}: WWCCVerificationProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    wwccNumber: "",
    state: "",
    expiryDate: ""
  });

  const verifyWWCCMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/wwcc/verify", {
        wwccNumber: data.wwccNumber,
        state: data.state,
        expiryDate: data.expiryDate
      });
    },
    onSuccess: () => {
      toast({
        title: "WWCC Verified",
        description: "Your Working with Children Check has been verified successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/nannies/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "WWCC Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.wwccNumber || !formData.state || !formData.expiryDate) {
      toast({
        title: "Required Information Missing",
        description: "Please provide your WWCC number, state, and expiry date.",
        variant: "destructive",
      });
      return;
    }

    verifyWWCCMutation.mutate(formData);
  };

  const getManualVerificationLink = (state: string) => {
    const links: { [key: string]: string } = {
      NSW: "https://www.kidsguardian.nsw.gov.au/child-safe-organisations/working-with-children-check/verify-wwcc",
      VIC: "https://www.workingwithchildren.vic.gov.au/home/applications+and+renewals/check+the+status+of+a+check",
      QLD: "https://www.bluecard.qld.gov.au/blue-card-register",
      WA: "https://www.workingwithchildren.wa.gov.au/check-registration/online-register",
      SA: "https://screening.sa.gov.au/types-of-check/working-with-children-check",
      TAS: "https://www.justice.tas.gov.au/working_with_children",
      ACT: "https://www.accesscanberra.act.gov.au/app/answers/detail/a_id/1804",
      NT: "https://pfes.nt.gov.au/police/community-safety/working-with-children-clearances"
    };
    return links[state] || "";
  };

  if (hasWwcc && currentStatus === "approved") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">WWCC Verified</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your Working with Children Check has been verified and is current.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">Government Clearance Valid</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Working with Children Check (WWCC)
        </CardTitle>
        <CardDescription>
          Verify your government-issued Working with Children Check clearance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State/Territory *</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NSW">New South Wales</SelectItem>
                  <SelectItem value="VIC">Victoria</SelectItem>
                  <SelectItem value="QLD">Queensland</SelectItem>
                  <SelectItem value="WA">Western Australia</SelectItem>
                  <SelectItem value="SA">South Australia</SelectItem>
                  <SelectItem value="TAS">Tasmania</SelectItem>
                  <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                  <SelectItem value="NT">Northern Territory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="wwccNumber">WWCC Number *</Label>
            <Input
              id="wwccNumber"
              value={formData.wwccNumber}
              onChange={(e) => setFormData({ ...formData, wwccNumber: e.target.value })}
              placeholder="Enter your WWCC/Blue Card number"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">WWCC Requirements by State:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• NSW: Working with Children Check (WWC1234567E)</li>
              <li>• VIC: Working with Children Check (12345678)</li>
              <li>• QLD: Blue Card (123456/21)</li>
              <li>• WA: Working with Children Check (HCW1234567)</li>
              <li>• Other states: State-specific clearance numbers</li>
            </ul>
          </div>

          {formData.state && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manual Verification Available</span>
                <a 
                  href={getManualVerificationLink(formData.state)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Verify on Government Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Families can independently verify your WWCC using the official government verification system.
              </p>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">💰 Certification Refund Available</span>
            </div>
            <p className="text-xs text-green-700 mb-2">
              Get 30% of your WWCC certification fee refunded (up to $35) after completing 2+ successful bookings on Aircare!
            </p>
            <div className="text-xs text-green-600">
              Complete your WWCC verification first, then after 2 completed bookings you can submit your receipt for a refund.
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={verifyWWCCMutation.isPending}
          >
            {verifyWWCCMutation.isPending ? "Verifying WWCC..." : "Verify WWCC"}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Government Integration</p>
              <p className="text-xs text-yellow-700">
                Platform integrates with government WWCC databases for verification. 
                All childcare providers must maintain current WWCC clearance as required by Australian law.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}