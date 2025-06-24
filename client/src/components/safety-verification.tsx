import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VerificationStatus {
  user: any;
  checks: any[];
  isFullyVerified: boolean;
  summary: {
    wwcc: string;
    policeCheck: string;
    identity: string;
  };
}

interface VerificationCheck {
  id: number;
  checkType: string;
  status: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  verifierNotes?: string;
}

const SafetyVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [wwccForm, setWwccForm] = useState({
    wwccNumber: '',
    state: '',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [policeCheckForm, setPoliceCheckForm] = useState({
    firstName: '',
    lastName: '',
    issueDate: '',
    documentFile: null as File | null
  });
  const [identityForm, setIdentityForm] = useState({
    documentType: '',
    documentNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    documentFile: null as File | null
  });

  const queryClient = useQueryClient();

  // Get verification status
  const { data: verificationStatus, isLoading: statusLoading } = useQuery<VerificationStatus>({
    queryKey: ['/api/verification/status'],
  });

  // WWCC verification mutation
  const wwccMutation = useMutation({
    mutationFn: async (data: typeof wwccForm) => {
      const response = await fetch('/api/verify/wwcc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      setWwccForm({ wwccNumber: '', state: '', firstName: '', lastName: '', dateOfBirth: '' });
    }
  });

  // Police check verification mutation
  const policeCheckMutation = useMutation({
    mutationFn: async (data: typeof policeCheckForm) => {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('issueDate', data.issueDate);
      if (data.documentFile) {
        formData.append('document', data.documentFile);
      }

      const response = await fetch('/api/verify/police-check', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      setPoliceCheckForm({ firstName: '', lastName: '', issueDate: '', documentFile: null });
    }
  });

  // Identity verification mutation
  const identityMutation = useMutation({
    mutationFn: async (data: typeof identityForm) => {
      const formData = new FormData();
      formData.append('documentType', data.documentType);
      formData.append('documentNumber', data.documentNumber);
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('dateOfBirth', data.dateOfBirth);
      if (data.documentFile) {
        formData.append('document', data.documentFile);
      }

      const response = await fetch('/api/verify/identity', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      setIdentityForm({
        documentType: '',
        documentNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        documentFile: null
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (!verificationStatus) return 0;
    const statuses = Object.values(verificationStatus.summary);
    const completed = statuses.filter(status => status === 'verified').length;
    return (completed / statuses.length) * 100;
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety Verification</h1>
        <p className="text-gray-600">Complete your safety checks to start offering childcare services</p>
        
        {verificationStatus && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Verification Progress</span>
              <span className="text-sm text-gray-500">{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wwcc">WWCC</TabsTrigger>
          <TabsTrigger value="police">Police Check</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(verificationStatus?.summary.wwcc || 'pending')}
                    <div>
                      <h3 className="font-medium">Working with Children Check (WWCC)</h3>
                      <p className="text-sm text-gray-600">Required for all childcare providers</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(verificationStatus?.summary.wwcc || 'pending')}>
                    {verificationStatus?.summary.wwcc || 'Not Started'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(verificationStatus?.summary.policeCheck || 'pending')}
                    <div>
                      <h3 className="font-medium">Police Clearance Certificate</h3>
                      <p className="text-sm text-gray-600">Must be within 12 months</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(verificationStatus?.summary.policeCheck || 'pending')}>
                    {verificationStatus?.summary.policeCheck || 'Not Started'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(verificationStatus?.summary.identity || 'pending')}
                    <div>
                      <h3 className="font-medium">Identity Verification</h3>
                      <p className="text-sm text-gray-600">Passport or driver's license</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(verificationStatus?.summary.identity || 'pending')}>
                    {verificationStatus?.summary.identity || 'Not Started'}
                  </Badge>
                </div>
              </div>

              {verificationStatus?.isFullyVerified && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    All verification checks complete! You can now accept bookings on VIVALY.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wwcc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Working with Children Check Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    We verify your WWCC directly with state government databases. 
                    Make sure your WWCC is current and matches your legal name.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wwcc-number">WWCC Number</Label>
                    <Input
                      id="wwcc-number"
                      value={wwccForm.wwccNumber}
                      onChange={(e) => setWwccForm({...wwccForm, wwccNumber: e.target.value})}
                      placeholder="WWC1234567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wwcc-state">State/Territory</Label>
                    <Select value={wwccForm.state} onValueChange={(value) => setWwccForm({...wwccForm, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
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
                    <Label htmlFor="wwcc-firstname">Legal First Name</Label>
                    <Input
                      id="wwcc-firstname"
                      value={wwccForm.firstName}
                      onChange={(e) => setWwccForm({...wwccForm, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wwcc-lastname">Legal Last Name</Label>
                    <Input
                      id="wwcc-lastname"
                      value={wwccForm.lastName}
                      onChange={(e) => setWwccForm({...wwccForm, lastName: e.target.value})}
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wwcc-dob">Date of Birth</Label>
                    <Input
                      id="wwcc-dob"
                      type="date"
                      value={wwccForm.dateOfBirth}
                      onChange={(e) => setWwccForm({...wwccForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => wwccMutation.mutate(wwccForm)}
                  disabled={wwccMutation.isPending || !wwccForm.wwccNumber || !wwccForm.state}
                  className="bg-[#FF5F7E] hover:bg-[#FF4A6B] text-white"
                >
                  {wwccMutation.isPending ? "Verifying..." : "Verify WWCC"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="police" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Police Clearance Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload a clear photo of your Australian Police Clearance Certificate. 
                    The document must be issued within the last 12 months.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="police-firstname">Legal First Name</Label>
                    <Input
                      id="police-firstname"
                      value={policeCheckForm.firstName}
                      onChange={(e) => setPoliceCheckForm({...policeCheckForm, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="police-lastname">Legal Last Name</Label>
                    <Input
                      id="police-lastname"
                      value={policeCheckForm.lastName}
                      onChange={(e) => setPoliceCheckForm({...policeCheckForm, lastName: e.target.value})}
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="police-issue-date">Document Issue Date</Label>
                    <Input
                      id="police-issue-date"
                      type="date"
                      value={policeCheckForm.issueDate}
                      onChange={(e) => setPoliceCheckForm({...policeCheckForm, issueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="police-document">Police Clearance Document</Label>
                    <Input
                      id="police-document"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setPoliceCheckForm({...policeCheckForm, documentFile: e.target.files?.[0] || null})}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => policeCheckMutation.mutate(policeCheckForm)}
                  disabled={policeCheckMutation.isPending || !policeCheckForm.documentFile}
                  className="bg-[#FF5F7E] hover:bg-[#FF4A6B] text-white"
                >
                  {policeCheckMutation.isPending ? "Uploading..." : "Submit Police Check"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identity Document Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload a clear photo of your Australian passport or driver's license. 
                    Make sure all text is clearly visible and the document is current.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="identity-type">Document Type</Label>
                    <Select value={identityForm.documentType} onValueChange={(value) => setIdentityForm({...identityForm, documentType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Australian Passport</SelectItem>
                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="identity-number">Document Number</Label>
                    <Input
                      id="identity-number"
                      value={identityForm.documentNumber}
                      onChange={(e) => setIdentityForm({...identityForm, documentNumber: e.target.value})}
                      placeholder="Document number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="identity-firstname">Legal First Name</Label>
                    <Input
                      id="identity-firstname"
                      value={identityForm.firstName}
                      onChange={(e) => setIdentityForm({...identityForm, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="identity-lastname">Legal Last Name</Label>
                    <Input
                      id="identity-lastname"
                      value={identityForm.lastName}
                      onChange={(e) => setIdentityForm({...identityForm, lastName: e.target.value})}
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="identity-dob">Date of Birth</Label>
                    <Input
                      id="identity-dob"
                      type="date"
                      value={identityForm.dateOfBirth}
                      onChange={(e) => setIdentityForm({...identityForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="identity-document">Document Photo</Label>
                    <Input
                      id="identity-document"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIdentityForm({...identityForm, documentFile: e.target.files?.[0] || null})}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => identityMutation.mutate(identityForm)}
                  disabled={identityMutation.isPending || !identityForm.documentFile}
                  className="bg-[#FF5F7E] hover:bg-[#FF4A6B] text-white"
                >
                  {identityMutation.isPending ? "Uploading..." : "Submit Identity Document"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyVerification;