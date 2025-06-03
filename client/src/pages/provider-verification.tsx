import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Upload, Shield, CreditCard, User } from "lucide-react";

const verificationSchema = z.object({
  // Legal name and identity
  legalFirstName: z.string().min(1, "Legal first name is required"),
  legalLastName: z.string().min(1, "Legal last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  // Address verification
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(4, "Valid postcode is required"),
  
  // Tax and payment info
  abn: z.string().optional(),
  tfn: z.string().min(9, "Tax File Number is required for payments"),
  
  // Banking details
  bankAccountName: z.string().min(1, "Account name is required"),
  bsb: z.string().min(6, "BSB must be 6 digits").max(6, "BSB must be 6 digits"),
  accountNumber: z.string().min(6, "Account number is required"),
  
  // Emergency contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(1, "Relationship is required"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const verificationSteps = [
  {
    id: "identity",
    title: "Identity Verification",
    description: "Legal name and identity documents",
    icon: User,
    required: true
  },
  {
    id: "address",
    title: "Address Verification", 
    description: "Proof of residential address",
    icon: Shield,
    required: true
  },
  {
    id: "payment",
    title: "Payment Information",
    description: "Tax details and bank account for payouts",
    icon: CreditCard,
    required: true
  },
  {
    id: "background",
    title: "Background Checks",
    description: "Police check and Working with Children check",
    icon: CheckCircle,
    required: true
  }
];

export default function ProviderVerification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: boolean}>({});

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      legalFirstName: "",
      legalLastName: "",
      dateOfBirth: "",
      streetAddress: "",
      city: "",
      state: "NSW",
      postcode: "",
      abn: "",
      tfn: "",
      bankAccountName: "",
      bsb: "",
      accountNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
    },
  });

  const handleDocumentUpload = (docType: string) => {
    // Simulate document upload
    setUploadedDocs(prev => ({ ...prev, [docType]: true }));
  };

  const nextStep = () => {
    if (currentStep < verificationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: VerificationFormData) => {
    console.log("Verification data:", data);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Provider Verification</h1>
          <p className="text-lg text-gray-600">Complete your verification to start hosting care services</p>
        </div>

        {/* Important notice */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Required account information</strong><br />
            This information is required for anyone who hosts or helps out with hosting on CareConnect.
            <ul className="mt-2 space-y-1">
              <li>• We'll use this to verify your account</li>
              <li>• These details are required by law</li>
              <li>• Inaccurate or missing information can delay payouts or limit your account access</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {verificationSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-coral text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${
                  isCurrent ? 'text-coral' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {verificationSteps[currentStep].title}
            </CardTitle>
            <CardDescription>
              {verificationSteps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Identity Verification Step */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="legalFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal first name *</FormLabel>
                            <FormControl>
                              <Input placeholder="As shown on ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="legalLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal last name *</FormLabel>
                            <FormControl>
                              <Input placeholder="As shown on ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of birth *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="font-medium">Required Documents</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium mb-1">Driver's License or Passport</p>
                          <p className="text-xs text-gray-500 mb-3">Front and back required</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDocumentUpload('id')}
                          >
                            {uploadedDocs.id ? 'Uploaded ✓' : 'Upload Document'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Verification Step */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Sydney" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input placeholder="NSW" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode *</FormLabel>
                            <FormControl>
                              <Input placeholder="2000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Proof of Address</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium mb-1">Utility Bill or Bank Statement</p>
                        <p className="text-xs text-gray-500 mb-3">Must be within last 3 months</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDocumentUpload('address')}
                        >
                          {uploadedDocs.address ? 'Uploaded ✓' : 'Upload Document'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Information Step */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="abn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ABN (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="12 345 678 901" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tfn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax File Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 456 789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="font-medium">Bank Account Details</h3>
                      <FormField
                        control={form.control}
                        name="bankAccountName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bsb"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BSB *</FormLabel>
                              <FormControl>
                                <Input placeholder="123-456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account number *</FormLabel>
                              <FormControl>
                                <Input placeholder="12345678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Emergency Contact</h3>
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone number *</FormLabel>
                              <FormControl>
                                <Input placeholder="0412 345 678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship *</FormLabel>
                              <FormControl>
                                <Input placeholder="Spouse, Parent, Sibling" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Background Checks Step */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Shield className="h-16 w-16 mx-auto mb-4 text-coral" />
                      <h3 className="text-xl font-semibold mb-2">Background Verification</h3>
                      <p className="text-gray-600 mb-6">
                        Complete your background checks to start offering care services
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Police Background Check</h4>
                          <p className="text-sm text-gray-600">National criminal history check</p>
                        </div>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Working with Children Check</h4>
                          <p className="text-sm text-gray-600">For childcare providers</p>
                        </div>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Reference Verification</h4>
                          <p className="text-sm text-gray-600">Professional references</p>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Background checks typically take 3-5 business days to complete. 
                        You'll receive email updates on the progress.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < verificationSteps.length - 1 ? (
                    <Button type="button" onClick={nextStep}>
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-coral hover:bg-coral/90">
                      Submit for Review
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}