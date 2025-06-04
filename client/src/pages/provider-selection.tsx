import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Baby } from "lucide-react";

export default function ProviderSelection() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<"service" | "childcare" | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join VIVALY as a Care Provider
          </h1>
          <p className="text-xl text-gray-600">
            Help families across Australia while building your care career
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">What type of care do you provide?</CardTitle>
              <p className="text-gray-600">
                Choose the option that best describes your care services
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setSelectedType("service")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedType === "service" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Events & Socials</h3>
                    <p className="text-sm text-gray-600">
                      Create group activities, playdates, educational workshops, and social events for families
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("childcare")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedType === "childcare" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Childcare Center</h3>
                    <p className="text-sm text-gray-600">
                      Run a licensed home-based childcare for multiple children
                    </p>
                  </div>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Different requirements apply:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Events & Socials:</strong> Basic verification, public liability insurance recommended</li>
                      <li><strong>Childcare Center:</strong> Educator certificate, insurance, safety assessment required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    if (selectedType === "service") {
                      setLocation("/create-experience");
                    } else if (selectedType === "childcare") {
                      setLocation("/become-childcare-provider");
                    }
                  }}
                  disabled={!selectedType}
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Join VIVALY?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Work</h3>
              <p className="text-gray-600">
                Set your own schedule and rates. Work when it suits you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                We verify all providers and families for everyone's safety and peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Make a Difference</h3>
              <p className="text-gray-600">
                Help families access quality care while building rewarding relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}