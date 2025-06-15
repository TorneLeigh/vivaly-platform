import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Users, DollarSign, Clock, FileText, Briefcase } from "lucide-react";

interface JobFormData {
  title: string;
  startDate: string;
  numChildren: number;
  rate: string;
  hoursPerWeek: string;
  description: string;
}

export default function PostJob() {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    startDate: '',
    numChildren: 1,
    rate: '',
    hoursPerWeek: '',
    description: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const postJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const res = await fetch('/api/postJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to post job');
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Job posted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      // Reset form
      setFormData({
        title: '',
        startDate: '',
        numChildren: 1,
        rate: '',
        hoursPerWeek: '',
        description: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startDate || !formData.rate || !formData.hoursPerWeek || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    postJobMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Post a Childcare Job
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Find the perfect caregiver for your family
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Job Heading *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. After School Care for 8-year-old, Weekend Babysitter Needed, Full-time Nanny for Twins"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full"
                  required
                />
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Create a title that describes exactly what you need</p>
                  <div className="text-gray-400">
                    <strong>Good examples:</strong> "Gentle Nanny for Newborn", "Active Babysitter for School Holidays", "Patient Caregiver for Special Needs Child"
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Number of Children */}
              <div className="space-y-2">
                <Label htmlFor="numChildren" className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Number of Children *
                </Label>
                <Input
                  id="numChildren"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.numChildren}
                  onChange={(e) => handleInputChange('numChildren', Number(e.target.value))}
                  className="w-full"
                  required
                />
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Hourly Rate (AUD) *
                </Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.50"
                  min="0"
                  placeholder="25.00"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Hours per Week */}
              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Hours per Week *
                </Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  min="1"
                  max="168"
                  placeholder="20"
                  value={formData.hoursPerWeek}
                  onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your childcare needs, any special requirements, preferred experience level, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full min-h-[120px] resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                disabled={postJobMutation.isPending}
              >
                {postJobMutation.isPending ? "Posting Job..." : "Post Job"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Your job will be visible to verified caregivers immediately after posting.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}