import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  AlertCircle, 
  Shield, 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Cancellation Policy</h1>
            <p className="mt-2 text-gray-600">
              Fair policies that protect both families and caregivers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Our cancellation policies are designed to be fair to both families and caregivers. 
              We understand that life happens, and flexibility is important when caring for children.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Protected by VIVALY</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    All bookings are covered by our platform protection and dispute resolution process.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For Families */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              For Families (Parents)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Flexible Policy */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">Flexible Cancellation</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Most Popular
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Full refund if cancelled 24+ hours before</p>
                    <p className="text-sm text-green-700">Get 100% refund for any reason</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">50% refund if cancelled 12-24 hours before</p>
                    <p className="text-sm text-green-700">Partial compensation for caregiver preparation time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">No refund if cancelled less than 12 hours before</p>
                    <p className="text-sm text-gray-600">Caregiver has likely declined other opportunities</p>
                  </div>
                </div>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* For Caregivers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              For Caregivers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Caregiver Cancellation Policy</h4>
                  <p className="text-amber-700 text-sm mt-1">
                    Caregivers who cancel bookings may face penalties to maintain platform reliability.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">24+ Hours Notice</h4>
                  <p className="text-gray-600 text-sm">No penalty - life happens and we understand emergencies occur.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">12-24 Hours Notice</h4>
                  <p className="text-gray-600 text-sm">Warning issued - families may have difficulty finding replacement care.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Less than 12 Hours Notice</h4>
                  <p className="text-gray-600 text-sm">
                    Penalty fee may apply - families rely on committed care arrangements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Situations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Emergency Situations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We understand that genuine emergencies occur. The following situations may qualify for 
              policy exceptions with proper documentation:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Medical Emergencies</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Child illness requiring immediate care</li>
                  <li>• Caregiver illness preventing safe childcare</li>
                  <li>• Family medical emergencies</li>
                  <li>• Hospital admissions</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Extraordinary Circumstances</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Severe weather conditions</li>
                  <li>• Public transport failures</li>
                  <li>• Family bereavement</li>
                  <li>• Natural disasters</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Documentation Required:</strong> Emergency exceptions require verification 
                such as medical certificates, official weather warnings, or other relevant documentation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Refunds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Payment & Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Refund Processing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Refunds processed within 3-5 business days</li>
                  <li>• Original payment method used</li>
                  <li>• Email confirmation sent when processed</li>
                  <li>• Platform fees may be deducted</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Caregiver Payment</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Payment released after service completion</li>
                  <li>• Cancellation fees paid to affected party</li>
                  <li>• Dispute resolution available</li>
                  <li>• VIVALY protection covers all transactions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recurring Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recurring Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Special considerations apply to regular, ongoing childcare arrangements:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Weekly/Monthly Arrangements</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cancellation must be given with at least one week's notice to avoid penalty. 
                  Single session cancellations follow standard policy.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Long-term Contracts</h4>
                <p className="text-sm text-gray-600 mt-1">
                  3+ month arrangements require 2 weeks notice for termination. 
                  Early termination may result in partial refund based on notice period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have questions about cancellation policies, our support team is here to help.
            </p>
            <div className="text-center">
              <p className="font-medium text-gray-900">General Inquiries</p>
              <p className="text-sm text-gray-600">support@vivaly.com.au</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500">
          <p>Last updated: June 2025</p>
          <p>
            By using VIVALY, you agree to these cancellation policies. 
            Policies may be updated periodically with advance notice.
          </p>
        </div>
      </div>
    </div>
  );
}