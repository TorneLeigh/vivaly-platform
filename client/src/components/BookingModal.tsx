import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, User, MapPin, Star } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiver: {
    id: string;
    firstName: string;
    lastName: string;
    location: string;
    hourlyRate: string;
    rating: string;
    profileImageUrl?: string;
    bio: string;
  };
  jobId?: string;
}

export default function BookingModal({ isOpen, onClose, caregiver, jobId }: BookingModalProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    hoursPerDay: 8,
    notes: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate booking details
  const ratePerHour = parseInt(caregiver.hourlyRate) || 35;
  const startDateObj = formData.startDate ? new Date(formData.startDate) : null;
  const endDateObj = formData.endDate ? new Date(formData.endDate) : null;
  const days = startDateObj && endDateObj ? 
    Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;
  const totalHours = days * formData.hoursPerDay;
  const subtotal = totalHours * ratePerHour;
  const serviceFee = Math.round(subtotal * 0.15);
  const totalAmount = subtotal + serviceFee;

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest('POST', '/api/bookings/create', bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent to the caregiver. You'll be notified when they respond.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking request",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    createBookingMutation.mutate({
      caregiverId: caregiver.id,
      jobId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      hoursPerDay: formData.hoursPerDay,
      ratePerHour,
      notes: formData.notes
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Book {caregiver.firstName} {caregiver.lastName}
          </DialogTitle>
          <DialogDescription>
            Create a booking request for this caregiver. They will need to accept before you can proceed to payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Caregiver Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caregiver Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {caregiver.profileImageUrl ? (
                    <img 
                      src={caregiver.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {caregiver.firstName.charAt(0)}{caregiver.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {caregiver.firstName} {caregiver.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-3 w-3" />
                    {caregiver.location}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{caregiver.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">${caregiver.hourlyRate}/hour</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {caregiver.bio}
              </p>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hoursPerDay">Hours per Day</Label>
                  <Input
                    id="hoursPerDay"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.hoursPerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, hoursPerDay: parseInt(e.target.value) || 8 }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or requirements..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Cost Breakdown */}
                {days > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{days} day{days > 1 ? 's' : ''} × {formData.hoursPerDay} hours × ${ratePerHour}/hour</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Service fee (15%)</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>${totalAmount}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={createBookingMutation.isPending || days <= 0}
                  >
                    {createBookingMutation.isPending ? 'Sending...' : 'Send Booking Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Payment Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">How Booking Works</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Send booking request to caregiver</li>
                <li>2. Caregiver accepts or declines</li>
                <li>3. If accepted, you'll be prompted to pay</li>
                <li>4. Payment is held securely until job completion</li>
                <li>5. Caregiver receives payment after job is done</li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}