import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VoucherClaimProps {
  caregiverId?: number;
}

export default function VoucherClaim({ caregiverId }: VoucherClaimProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    voucherType: "",
    receiptAmount: "",
    receiptImageUrl: "",
    certificationDate: "",
    expiryDate: "",
    state: ""
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: eligibleVouchers } = useQuery({
    queryKey: ["/api/vouchers/eligible"],
  });

  const { data: myClaims } = useQuery({
    queryKey: ["/api/vouchers/my-claims"],
  });

  const { data: eligibility } = useQuery({
    queryKey: ["/api/vouchers/eligibility"],
  });

  const submitClaimMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // In production, upload receipt image to cloud storage first
      const receiptImageUrl = receiptFile ? `receipt_${Date.now()}.jpg` : "";
      
      return await apiRequest("POST", "/api/vouchers/claim", {
        ...data,
        receiptAmount: parseFloat(data.receiptAmount),
        receiptImageUrl
      });
    },
    onSuccess: () => {
      toast({
        title: "Voucher Claim Submitted",
        description: "Your certification refund claim has been submitted for review. You'll receive an email update within 3-5 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/my-claims"] });
      
      // Reset form
      setFormData({
        voucherType: "",
        receiptAmount: "",
        receiptImageUrl: "",
        certificationDate: "",
        expiryDate: "",
        state: ""
      });
      setReceiptFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Claim Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Receipt image must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.voucherType || !formData.receiptAmount || !receiptFile) {
      toast({
        title: "Required Information Missing",
        description: "Please provide voucher type, receipt amount, and upload receipt image.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.receiptAmount);
    if (amount < 10 || amount > 500) {
      toast({
        title: "Invalid Amount",
        description: "Receipt amount must be between $10 and $500.",
        variant: "destructive",
      });
      return;
    }

    submitClaimMutation.mutate(formData);
  };

  const getVoucherInfo = (type: string) => {
    const voucher = eligibleVouchers?.find((v: any) => v.type === type);
    return voucher || { refundRate: "0%", maxRefund: 0 };
  };

  const calculateRefund = () => {
    if (!formData.voucherType || !formData.receiptAmount) return 0;
    
    const amount = parseFloat(formData.receiptAmount);
    const voucherInfo = getVoucherInfo(formData.voucherType);
    const refundRate = parseFloat(voucherInfo.refundRate.replace('%', '')) / 100;
    const calculatedRefund = amount * refundRate;
    
    return Math.min(calculatedRefund, voucherInfo.maxRefund);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Status */}
      {eligibility && !eligibility.isEligible && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              Complete More Bookings to Unlock Refunds
            </CardTitle>
            <CardDescription className="text-yellow-700">
              You need to complete {eligibility.remainingBookings} more booking{eligibility.remainingBookings > 1 ? 's' : ''} to become eligible for certification refunds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-sm text-yellow-800">
                Progress: <strong>{eligibility.completedBookings} of {eligibility.requiredBookings} bookings completed</strong>
              </div>
              <div className="flex-1 bg-yellow-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${(eligibility.completedBookings / eligibility.requiredBookings) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-yellow-700 mt-3">
              This requirement ensures caregivers are actively using the platform and providing quality service before receiving rebates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Eligible Vouchers Info */}
      <Card className={!eligibility?.isEligible ? "opacity-60" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Certification Refund Program
            {eligibility?.isEligible && (
              <Badge className="bg-green-100 text-green-800 border-green-200">Eligible</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Get reimbursed for professional certification costs. Submit your receipt to claim your refund.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eligibleVouchers?.map((voucher: any) => (
              <div key={voucher.type} className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h4 className="font-medium text-green-900 mb-2">{voucher.description}</h4>
                <div className="space-y-1 text-sm text-green-800">
                  <div>Refund Rate: <strong>{voucher.refundRate}</strong></div>
                  <div>Max Refund: <strong>${voucher.maxRefund}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claim Form */}
      <Card className={!eligibility?.isEligible ? "opacity-60" : ""}>
        <CardHeader>
          <CardTitle>Submit Refund Claim</CardTitle>
          <CardDescription>
            {eligibility?.isEligible 
              ? "Upload your certification receipt to claim your refund."
              : `Complete ${eligibility?.remainingBookings || 2} more bookings to unlock certification refunds.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voucherType">Certification Type *</Label>
                <Select value={formData.voucherType} onValueChange={(value) => setFormData({ ...formData, voucherType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wwcc-certification">Working with Children Check</SelectItem>
                    <SelectItem value="first-aid">First Aid Certification</SelectItem>
                    <SelectItem value="police-check">National Police Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="receiptAmount">Receipt Amount ($) *</Label>
                <Input
                  id="receiptAmount"
                  type="number"
                  step="0.01"
                  min="10"
                  max="500"
                  value={formData.receiptAmount}
                  onChange={(e) => setFormData({ ...formData, receiptAmount: e.target.value })}
                  placeholder="e.g. 85.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certificationDate">Certification Date *</Label>
                <Input
                  id="certificationDate"
                  type="date"
                  value={formData.certificationDate}
                  onChange={(e) => setFormData({ ...formData, certificationDate: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            {formData.voucherType === "wwcc-certification" && (
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
            )}

            <div>
              <Label htmlFor="receipt">Receipt Image *</Label>
              <div className="mt-1">
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload clear image of your certification receipt (JPG, PNG, PDF, max 5MB)
                </p>
                {receiptFile && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {receiptFile.name} ({(receiptFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {formData.voucherType && formData.receiptAmount && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Refund Calculation</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>Receipt Amount: <strong>${formData.receiptAmount}</strong></div>
                  <div>Refund Rate: <strong>{getVoucherInfo(formData.voucherType).refundRate}</strong></div>
                  <div>Your Refund: <strong>${calculateRefund().toFixed(2)}</strong></div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitClaimMutation.isPending || !eligibility?.isEligible}
            >
              {submitClaimMutation.isPending 
                ? "Submitting Claim..." 
                : !eligibility?.isEligible 
                  ? `Complete ${eligibility?.remainingBookings || 2} More Bookings First`
                  : "Submit Refund Claim"
              }
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Claims */}
      {myClaims && myClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Voucher Claims</CardTitle>
            <CardDescription>
              Track the status of your refund claims.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myClaims.map((claim: any) => (
                <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{claim.voucherType.replace('-', ' ').toUpperCase()}</div>
                    <div className="text-sm text-gray-600">
                      Submitted: {new Date(claim.submissionDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Refund Amount: ${claim.refundAmount}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(claim.status)}>
                      {getStatusIcon(claim.status)}
                      {claim.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}