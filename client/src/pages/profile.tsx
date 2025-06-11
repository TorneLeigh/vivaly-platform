import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles, Star, Smile, Eye, Camera } from "lucide-react";
import ParentPhotoUpload from "@/components/parent-photo-upload";
import MultiPhotoUpload from "@/components/multi-photo-upload";

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  // Personal Touch Questions for display
  const personalQuestions = [
    {
      key: "myLoveLanguage",
      label: "My love language is...",
      placeholder: "acts of service, quality time, words of affirmation...",
      icon: Heart
    },
    {
      key: "littleAboutMe", 
      label: "A little about me...",
      placeholder: "Tell us what makes you unique!",
      icon: Smile
    },
    {
      key: "imProudOf",
      label: "I'm proud of...",
      placeholder: "Share something you're proud of accomplishing",
      icon: Star
    },
    {
      key: "myFamilyIsSpecialBecause",
      label: "My family is special because...",
      placeholder: "What makes your family unique and wonderful?",
      icon: Sparkles
    },
    {
      key: "onePerfectDay",
      label: "One perfect day with my family would be...",
      placeholder: "Describe your ideal family day",
      icon: Heart
    }
  ];

  const caregiverQuestions = [
    {
      key: "myLoveLanguage",
      label: "My love language is...",
      placeholder: "acts of service, quality time, words of affirmation...",
      icon: Heart
    },
    {
      key: "littleAboutMe",
      label: "A little about me...", 
      placeholder: "Tell families what makes you special!",
      icon: Smile
    },
    {
      key: "imProudOf",
      label: "I'm proud of...",
      placeholder: "Share something you're proud of accomplishing",
      icon: Star
    },
    {
      key: "whatMakesMe",
      label: "What makes me a great caregiver is...",
      placeholder: "Share your caregiving strengths and passion",
      icon: Sparkles
    },
    {
      key: "mySuperpowerIs",
      label: "My superpower with kids is...",
      placeholder: "What's your special talent with children?",
      icon: Star
    },
    {
      key: "onePerfectDay",
      label: "One perfect day caring for children would be...",
      placeholder: "Describe your ideal day with the kids you care for",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
              <p className="text-gray-600">Let families get to know the real you with these personal touches</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profile-preview'}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View My Profile
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">As a Parent</TabsTrigger>
            <TabsTrigger value="caregiver">As a Caregiver</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Personal Touch Questions
                </CardTitle>
                <CardDescription>
                  Help caregivers connect with your family by sharing what makes you special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalQuestions.map((question) => {
                  const IconComponent = question.icon;
                  return (
                    <div key={question.key} className="space-y-2">
                      <Label htmlFor={question.key} className="flex items-center gap-2 text-base font-medium">
                        <IconComponent className="h-4 w-4 text-blue-500" />
                        {question.label}
                      </Label>
                      <Textarea
                        id={question.key}
                        placeholder={question.placeholder}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  );
                })}
                
                <div className="flex justify-end pt-4">
                  <Button className="bg-black hover:bg-gray-800">
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload Section for Parents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-500" />
                  Family Photos
                </CardTitle>
                <CardDescription>
                  Share photos of your family activities and home environment (optional - no children's faces required for privacy)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ParentPhotoUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="caregiver" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Personal Touch Questions
                </CardTitle>
                <CardDescription>
                  Help families connect with you by sharing your personality and passion for caregiving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {caregiverQuestions.map((question) => {
                  const IconComponent = question.icon;
                  return (
                    <div key={question.key} className="space-y-2">
                      <Label htmlFor={question.key} className="flex items-center gap-2 text-base font-medium">
                        <IconComponent className="h-4 w-4 text-purple-500" />
                        {question.label}
                      </Label>
                      <Textarea
                        id={question.key}
                        placeholder={question.placeholder}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  );
                })}
                
                <div className="flex justify-end pt-4">
                  <Button className="bg-black hover:bg-gray-800">
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Personal Touch Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">For Parents</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Help caregivers understand your family's personality</li>
                  <li>• Create meaningful connections beyond just logistics</li>
                  <li>• Show what matters most to your family</li>
                  <li>• Get more personalized care recommendations</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">For Caregivers</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stand out from other caregivers with personality</li>
                  <li>• Help families see you as more than just credentials</li>
                  <li>• Attract families who align with your values</li>
                  <li>• Build trust before you even meet</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}