import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, User, MapPin, Clock, Award, Star, MessageCircle } from "lucide-react";

interface CaregiverApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    parentId: string;
    parentName: string;
    location: string;
    hourlyRate: string;
    description: string;
  };
  caregiverProfile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    experience: string;
    location: string;
    hourlyRate: string;
    services: string[];
    certificates: string[];
    yearsOfExperience: number;
    averageRating: string;
    profilePhoto?: string;
  };
}

export default function CaregiverApplicationModal({ 
  isOpen, 
  onClose, 
  job, 
  caregiverProfile 
}: CaregiverApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const { toast } = useToast();

  // Generate professional CV-style message
  const generateProfileMessage = () => {
    const profileMessage = `Hello ${job.parentName},

I am interested in your childcare position "${job.title}" and would like to introduce myself.

👋 About Me: ${caregiverProfile.firstName} ${caregiverProfile.lastName}
📍 Location: ${caregiverProfile.location}
⭐ Experience: ${caregiverProfile.yearsOfExperience} years
💰 Rate: $${caregiverProfile.hourlyRate}/hour
⭐ Rating: ${caregiverProfile.averageRating}/5.0

🎓 Qualifications & Services:
${caregiverProfile.services.map(service => `• ${service}`).join('\n')}

📜 Certifications:
${caregiverProfile.certificates.map(cert => `• ${cert}`).join('\n')}

📝 About My Experience:
${caregiverProfile.bio}

💬 Personal Message:
${coverLetter || "I would love to discuss how I can help your family and answer any questions you may have about my experience and approach to childcare."}

I am available to start immediately and would be happy to arrange a meet-and-greet at your convenience.

Looking forward to hearing from you!

Best regards,
${caregiverProfile.firstName} ${caregiverProfile.lastName}`;

    return profileMessage;
  };

  // Send application with automatic message
  const sendApplicationMutation = useMutation({
    mutationFn: async () => {
      const profileMessage = generateProfileMessage();
      
      // First create the job application
      await apiRequest("POST", "/api/job-applications", {
        jobId: job.id,
        message: profileMessage,
        proposedRate: caregiverProfile.hourlyRate,
        availability: "Available immediately"
      });

      // Then send the message directly
      await apiRequest("POST", "/api/sendMessage", {
        senderId: caregiverProfile.id,
        receiverId: job.parentId,
        content: profileMessage
      });

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Application Sent Successfully!",
        description: "Your profile and message have been sent to the parent. You can continue the conversation in Messages.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/my"] });
      onClose();
      
      // Redirect to messages after short delay
      setTimeout(() => {
        window.location.href = "/messages";
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-coral" />
            Apply for Job: {job.title}
          </DialogTitle>
          <DialogDescription>
            Your professional profile will be automatically sent as a message to the parent
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{job.parentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>${job.hourlyRate}/hour</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Your Profile Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {caregiverProfile.profilePhoto && (
                  <img 
                    src={caregiverProfile.profilePhoto} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{caregiverProfile.firstName} {caregiverProfile.lastName}</p>
                  <p className="text-sm text-gray-600">{caregiverProfile.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{caregiverProfile.averageRating}/5.0</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{caregiverProfile.yearsOfExperience} years exp</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {caregiverProfile.services.slice(0, 3).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {caregiverProfile.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{caregiverProfile.services.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cover Letter */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Personal Message (Optional)
            </label>
            <Textarea
              placeholder="Add a personal message about why you're interested in this position and what makes you a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be included in your professional profile message
            </p>
          </div>
        </div>

        {/* Message Preview */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Message Preview</CardTitle>
            <p className="text-sm text-gray-600">This is what the parent will see:</p>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generateProfileMessage()}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => sendApplicationMutation.mutate()}
            disabled={sendApplicationMutation.isPending}
            className="bg-coral hover:bg-coral/90"
          >
            {sendApplicationMutation.isPending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Application & Message
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}