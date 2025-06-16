import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Users, 
  Heart, 
  UserCheck, 
  PawPrint, 
  CheckCircle, 
  Star,
  Camera,
  Edit,
  Play
} from "lucide-react";

export default function ParentProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("basic-info");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "0412 345 678",
    homeAddress: "123 Main Street, Sydney NSW 2000",
    suburb: "Bondi Beach",
  });

  // Navigation menu items
  const menuItems = [
    { id: "basic-info", label: "Basic Info", icon: User, active: true },
    { id: "family-children", label: "Family & Children", icon: Users },
    { id: "children-details", label: "Children Details", icon: Users },
    { id: "health-medical", label: "Health & Medical", icon: Heart },
    { id: "elderly-care", label: "Elderly Care", icon: UserCheck },
    { id: "pet-care", label: "Pet Care", icon: PawPrint },
    { id: "essential-requirements", label: "Essential Requirements", icon: CheckCircle },
    { id: "position-details", label: "Position Details", icon: Star },
    { id: "responsibilities", label: "Responsibilities", icon: CheckCircle },
    { id: "caregiver-references", label: "Caregiver References", icon: UserCheck }
  ];

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.homeAddress,
      formData.suburb
    ];
    const completedFields = fields.filter(field => field && field.trim()).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
              <Button onClick={() => setLocation("/auth")}>
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input
          id="homeAddress"
          value={formData.homeAddress}
          onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
          placeholder="Enter home address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suburb">Suburb</Label>
        <Input
          id="suburb"
          value={formData.suburb}
          onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
          placeholder="Enter suburb"
        />
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Intro Video</h3>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <Play className="h-8 w-8 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Upload a short video introducing yourself and your family
            </p>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Profile</h1>
              <p className="text-gray-600 mt-1">Complete your profile to find the perfect caregiver</p>
            </div>
            <Button onClick={() => setLocation("/dashboard")}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Profile Completion</span>
              <span>{calculateProfileCompletion()}% Complete</span>
            </div>
            <Progress value={calculateProfileCompletion()} className="w-full" />
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-80 bg-white border-r min-h-screen">
            <div className="p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-black text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSection === "basic-info" && renderBasicInfo()}
                {activeSection !== "basic-info" && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      This section is under development. Please complete the Basic Information section first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}