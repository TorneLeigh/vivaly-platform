import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Star,
  Shield,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Heart,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MobileBookingFlowProps {
  caregiver: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    hourlyRate: string;
    rating: string;
    reviewCount: number;
    location: string;
    bio: string;
    isVerified: boolean;
    serviceTypes: string[];
  };
  onClose: () => void;
}

export default function MobileBookingFlow({ caregiver, onClose }: MobileBookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("2");
  const [serviceType, setServiceType] = useState("");
  const [childAge, setChildAge] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [notes, setNotes] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      // First create the booking
      const bookingResponse = await apiRequest("POST", "/api/bookings", bookingData);
      const booking = await bookingResponse.json();
      
      // Then create payment intent
      const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        bookingId: booking.id,
        amount: bookingData.totalAmount,
        caregiverId: caregiver.id
      });
      const paymentData = await paymentResponse.json();
      
      return { booking, paymentData };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      // Store data for payment page
      localStorage.setItem('pendingBooking', JSON.stringify({
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        duration: selectedDuration,
        serviceType: selectedServiceType,
        specialRequests,
        caregiver,
        totalAmount: data.booking.totalAmount
      }));
      localStorage.setItem('pendingPayment', JSON.stringify(data.paymentData));
      
      toast({
        title: "Booking Created!",
        description: `Platform fee: $${data.paymentData.platformFee.toFixed(2)}. Redirecting to payment...`,
      });
      
      // Redirect to payment page
      setTimeout(() => {
        window.location.href = '/payment-checkout';
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateEndTime = (startTime: string, hours: string) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const endHour = hour + parseInt(hours);
    return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const totalAmount = selectedTime && duration ? 
    (parseFloat(caregiver.hourlyRate) * parseFloat(duration)).toFixed(2) : "0.00";

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !serviceType || !childAge) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const endTime = calculateEndTime(selectedTime, duration);

    bookingMutation.mutate({
      nannyId: caregiver.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTime,
      serviceType,
      childAge,
      specialNeeds,
      notes,
      emergencyContact,
      emergencyPhone,
      totalAmount: parseFloat(totalAmount),
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">When do you need care?</h3>
              <p className="text-sm text-gray-600">Select your preferred date and time</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !selectedDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Choose date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Start Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="5">5 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTime && duration && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Cost:</span>
                    <span className="text-lg font-semibold text-blue-600">${totalAmount}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTime} - {calculateEndTime(selectedTime, duration)} • {duration} hours
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Care Details</h3>
              <p className="text-sm text-gray-600">Tell us about your care needs</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type *</label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {caregiver.serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Child's Age *</label>
                <Select value={childAge} onValueChange={setChildAge}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-6 months">0-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
                    <SelectItem value="2-3 years">2-3 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5-8 years">5-8 years</SelectItem>
                    <SelectItem value="8-12 years">8-12 years</SelectItem>
                    <SelectItem value="12+ years">12+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Special Requirements</label>
                <Textarea
                  placeholder="Any allergies, medications, or special care instructions..."
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
              <p className="text-sm text-gray-600">Required for safety purposes</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Emergency Contact Name</label>
                <Input
                  placeholder="Full name"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Emergency Contact Phone</label>
                <Input
                  placeholder="Phone number"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes</label>
                <Textarea
                  placeholder="Anything else the caregiver should know..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Booking</h3>
              <p className="text-sm text-gray-600">Review your booking details</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm font-medium">
                      {selectedDate && format(selectedDate, "MMM d")} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service:</span>
                    <span className="text-sm font-medium">{serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Child Age:</span>
                    <span className="text-sm font-medium">{childAge}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-coral">${totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                  <Clock className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Booking Process</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Your caregiver will contact you within 15 minutes to confirm details and arrange meeting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-md mx-4 mb-0 md:mb-4 rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <p className="text-sm font-medium">Step {step} of 4</p>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-1 rounded ${
                    i <= step ? 'bg-coral' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* Caregiver Info */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={caregiver.user.profileImage} />
              <AvatarFallback>
                {caregiver.user.firstName[0]}{caregiver.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">
                  {caregiver.user.firstName} {caregiver.user.lastName}
                </h4>
                {caregiver.isVerified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  {caregiver.rating} ({caregiver.reviewCount})
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {caregiver.location}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-coral">${caregiver.hourlyRate}</p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex space-x-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
              disabled={
                step === 4 ? bookingMutation.isPending : 
                step === 1 ? !selectedDate || !selectedTime :
                step === 2 ? !serviceType || !childAge : false
              }
              className="flex-1 bg-coral hover:bg-coral/90"
            >
              {step === 4 ? (
                bookingMutation.isPending ? "Booking..." : "Confirm Booking"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}