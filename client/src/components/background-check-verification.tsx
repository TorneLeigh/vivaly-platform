import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Clock, FileText, Shield } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BackgroundCheckVerificationProps {
  nannyId?: number;
  currentStatus?: string;
  backgroundCheckId?: string;
}

export default function BackgroundCheckVerification({ 
  nannyId, 
  currentStatus = "pending",
  backgroundCheckId 
}: BackgroundCheckVerificationProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    address: "",
    licenseNumber: "",
    agreeToChecks: false
  });

  const initiateCheckMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/background-check/initiate", {
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        licenseNumber: data.licenseNumber || undefined,
        checkTypes: [
          "national-police-check",
          "working-with-children",
          "identity-verification", 
          "reference-verification"
        ]
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Background Check Initiated",
        description: "Your professional background verification has been started. You'll receive updates via email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/nannies/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: checkStatus } = useQuery({
    queryKey: ["/api/background-check/status", backgroundCheckId],
    enabled: !!backgroundCheckId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToChecks) {
      toast({
        title: "Agreement Required",
        description: "You must agree to professional background checks to continue.",
        variant: "destructive",
      });
      return;
    }

    initiateCheckMutation.mutate(formData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
      case "in_review":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "in_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (currentStatus === "approved") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Verification Complete</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your professional background verification has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">Verified Professional Caregiver</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStatus === "pending" && backgroundCheckId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Background Check in Progress
          </CardTitle>
          <CardDescription>
            Your background verification is being processed by our certified partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">National Police Check</span>
              <Badge className={getStatusColor("pending")}>In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Working with Children Check</span>
              <Badge className={getStatusColor("pending")}>In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Identity Verification</span>
              <Badge className={getStatusColor("pending")}>In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Reference Verification</span>
              <Badge className={getStatusColor("pending")}>In Progress</Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <strong>Processing Time:</strong> 5-10 business days<br />
            <strong>Status Updates:</strong> You'll receive email notifications as each check completes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Professional Background Verification
        </CardTitle>
        <CardDescription>
          Complete mandatory background checks to become a verified caregiver on Aircare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">Driver's License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="Optional for identity verification"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Current Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full residential address"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Required Professional Checks:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• National Police Check (Criminal History)</li>
              <li>• Working with Children Check (Childcare Providers)</li>
              <li>• Identity Verification (Government ID)</li>
              <li>• Professional Reference Verification</li>
            </ul>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToChecks"
              checked={formData.agreeToChecks}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, agreeToChecks: checked as boolean })
              }
            />
            <Label htmlFor="agreeToChecks" className="text-sm leading-5">
              I consent to professional background checks being conducted by certified screening 
              agencies. I understand this is mandatory for caregiver verification and platform safety.
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!formData.agreeToChecks || initiateCheckMutation.isPending}
          >
            {initiateCheckMutation.isPending ? "Initiating Verification..." : "Start Background Verification"}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Privacy Notice:</strong> All personal information is handled securely according to 
            Australian Privacy Principles. Background check results are processed by accredited agencies 
            and stored with enterprise-grade security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}