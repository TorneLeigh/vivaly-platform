import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign,
  Baby,
  Users,
  Heart,
  MessageCircle,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

interface CareRecommendation {
  message: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export default function AIRecommendations() {
  const [careType, setCareType] = useState("");
  const [location, setLocation] = useState("");
  const [childAge, setChildAge] = useState("");
  const [budget, setBudget] = useState("");
  const [schedule, setSchedule] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [recommendations, setRecommendations] = useState<CareRecommendation | null>(null);
  const { toast } = useToast();

  const recommendationMutation = useMutation({
    mutationFn: async (careData: any) => {
      return await apiRequest("POST", "/api/ai/care-recommendations", careData);
    },
    onSuccess: (data: CareRecommendation) => {
      setRecommendations(data);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to get recommendations",
        description: "Please try again or chat with our AI assistant for personalized help.",
        variant: "destructive",
      });
    },
  });

  const handleGetRecommendations = () => {
    if (!careType || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a care type and enter your location.",
        variant: "destructive",
      });
      return;
    }

    const careData = {
      careType,
      location,
      ...(childAge && { childAge: parseInt(childAge) }),
      ...(budget && { budget: parseInt(budget) }),
      ...(schedule && { schedule }),
      ...(specialNeeds && { specialNeeds }),
    };

    recommendationMutation.mutate(careData);
  };

  const getCareTypeIcon = (type: string) => {
    switch (type) {
      case 'nanny': return <Baby className="h-4 w-4" />;
      case 'childcare': return <Users className="h-4 w-4" />;
      case 'elderly': return <Heart className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-blue-600" />
            AI-Powered Care Recommendations
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Get personalized care suggestions powered by ChatGPT
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="careType" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Care Type *
              </Label>
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nanny">Nanny</SelectItem>
                  <SelectItem value="childcare">Childcare Center</SelectItem>
                  <SelectItem value="elderly">Elderly Care</SelectItem>
                  <SelectItem value="disability">Disability Support</SelectItem>
                  <SelectItem value="companionship">Companionship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Sydney, Melbourne, Brisbane"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="childAge" className="flex items-center gap-2">
                <Baby className="h-4 w-4" />
                Child Age (if applicable)
              </Label>
              <Input
                id="childAge"
                type="number"
                placeholder="Age in years"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget (per hour)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 25"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </Label>
              <Input
                id="schedule"
                placeholder="e.g., Weekdays 9-5, Weekends"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Special Requirements</Label>
              <Input
                id="specialNeeds"
                placeholder="Any specific needs or preferences"
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleGetRecommendations}
              disabled={recommendationMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {recommendationMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Get AI Recommendations
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/ai-chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Link>
            </Button>
          </div>

          {recommendations && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                  <Sparkles className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{recommendations.message}</p>
                </div>

                {recommendations.suggestions && recommendations.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Key Suggestions:</h4>
                    <div className="space-y-2">
                      {recommendations.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="secondary" className="mt-1">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendations.followUpQuestions && recommendations.followUpQuestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Questions to Consider:</h4>
                    <div className="space-y-1">
                      {recommendations.followUpQuestions.map((question, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          • {question}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/ai-chat">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Continue conversation with AI
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Powered by ChatGPT
              </Badge>
              <Badge variant="outline" className="text-xs">
                Australian Care Specialist
              </Badge>
              <Badge variant="outline" className="text-xs">
                Personalized Recommendations
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI recommendations are suggestions only. Always verify caregiver credentials and conduct interviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}