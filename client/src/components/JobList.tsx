import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  parentId: string;
  startDate: string;
  numChildren: number;
  rate: string;
  hoursPerWeek: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/getJobs')
      .then(res => res.json())
      .then(setJobs)
      .catch(error => {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch('/api/applyToJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to apply to job');
      }
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Application Sent",
          description: "Your profile was sent to the parent. They'll be in touch if interested.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send application",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error applying to job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Available Jobs</h1>
      
      <div className="grid gap-6">
        {jobs.map(job => (
          <Card key={job.id} className="job-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Childcare Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Children:</strong> {job.numChildren}
                </div>
                <div>
                  <strong>Rate:</strong> ${job.rate}/hr
                </div>
                <div>
                  <strong>Hours:</strong> {job.hoursPerWeek} per week
                </div>
              </div>
              
              <div>
                <strong>Description:</strong>
                <p className="mt-2 text-gray-700">{job.description}</p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => handleApply(job.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  I'm Interested
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {jobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No jobs available at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}