import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CreditCard,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import type { Nanny, User as UserType } from "@shared/schema";

type CaregiverWithUser = Nanny & { user: UserType };

export default function BookingFlow() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookingData, setBookingData] = useState({
    startTime: "",
    endTime: "",
    serviceType: "",
    notes: "",
    childrenCount: 1,
    childrenAges: "",
    specialRequirements: "",
    emergencyContact: "",
    emergencyPhone: "",
    totalAmount: 0
  });

  const { data: caregiver, isLoading } = useQuery<CaregiverWithUser>({
    queryKey: ["/api/nannies", id],
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: async (booking: any) => {
      return apiRequest("POST", "/api/bookings", booking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent to the caregiver for approval.",
      });
      setStep(4); // Success step
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = () => {
    if (!caregiver || !bookingData.startTime || !bookingData.endTime) return 0;
    
    const start = new Date(`2000-01-01 ${bookingData.startTime}`);
    const end = new Date(`2000-01-01 ${bookingData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return Math.max(0, hours * parseFloat(caregiver.hourlyRate || "0"));
  };

  const handleSubmitBooking = () => {
    if (!selectedDate || !caregiver) return;

    const booking = {
      nannyId: caregiver.id,
      parentId: 1, // TODO: Get from auth context
      date: selectedDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      serviceType: bookingData.serviceType,
      notes: bookingData.notes,
      totalAmount: calculateTotal().toString(),
      status: "pending"
    };

    bookingMutation.mutate(booking);
  };

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Caregiver Not Found</h1>
          <p className="text-gray-600">Unable to find the caregiver for booking.</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Choose a date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={bookingData.startTime} onValueChange={(value) => setBookingData({...bookingData, startTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Select value={bookingData.endTime} onValueChange={(value) => setBookingData({...bookingData, endTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={bookingData.serviceType} onValueChange={(value) => setBookingData({...bookingData, serviceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(caregiver.services || []).map((service) => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {bookingData.startTime && bookingData.endTime && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {((new Date(`2000-01-01 ${bookingData.endTime}`).getTime() - new Date(`2000-01-01 ${bookingData.startTime}`).getTime()) / (1000 * 60 * 60)).toFixed(1)} hours × ${caregiver.hourlyRate}/hour
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childrenCount">Number of Children</Label>
                  <Select value={bookingData.childrenCount.toString()} onValueChange={(value) => setBookingData({...bookingData, childrenCount: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="childrenAges">Children's Ages</Label>
                  <Input
                    id="childrenAges"
                    placeholder="e.g. 3, 5, 8"
                    value={bookingData.childrenAges}
                    onChange={(e) => setBookingData({...bookingData, childrenAges: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Emergency contact person"
                  value={bookingData.emergencyContact}
                  onChange={(e) => setBookingData({...bookingData, emergencyContact: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="Emergency phone number"
                  value={bookingData.emergencyPhone}
                  onChange={(e) => setBookingData({...bookingData, emergencyPhone: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special instructions, allergies, or requirements..."
                  value={bookingData.specialRequirements}
                  onChange={(e) => setBookingData({...bookingData, specialRequirements: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information for the caregiver..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Confirm Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{bookingData.startTime} - {bookingData.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{bookingData.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children:</span>
                    <span>{bookingData.childrenCount}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your booking request will be sent to {caregiver.user.firstName}</li>
                  <li>• They have 24 hours to accept or decline</li>
                  <li>• You'll receive a notification with their response</li>
                  <li>• Payment will be processed once the booking is confirmed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h2>
              <p className="text-gray-600 mb-6">
                Your booking request has been sent to {caregiver.user.firstName}. 
                You'll receive a notification when they respond.
              </p>
              <div className="space-y-3">
                <Button onClick={() => setLocation("/bookings")} className="w-full">
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} className="w-full">
                  Continue Browsing
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedDate && bookingData.startTime && bookingData.endTime && bookingData.serviceType;
      case 2:
        return bookingData.emergencyContact && bookingData.emergencyPhone;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => step > 1 ? setStep(step - 1) : setLocation(`/caregiver/${id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={caregiver.user.profileImage || ""} />
                <AvatarFallback>
                  {caregiver.user.firstName[0]}{caregiver.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Book with {caregiver.user.firstName} {caregiver.user.lastName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {caregiver.suburb}
                  <Badge variant="secondary">${caregiver.hourlyRate}/hour</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 ${
                      step > stepNum ? 'bg-orange-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
        
        {step < 4 && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => step > 1 ? setStep(step - 1) : setLocation(`/caregiver/${id}`)}
            >
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button 
              onClick={() => step === 3 ? handleSubmitBooking() : setStep(step + 1)}
              disabled={!canProceed() || bookingMutation.isPending}
              style={{ backgroundColor: '#FF6B35' }}
              className="text-white"
            >
              {bookingMutation.isPending ? 'Sending...' : step === 3 ? 'Send Booking Request' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}