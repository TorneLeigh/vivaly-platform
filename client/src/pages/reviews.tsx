import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  User,
  CheckCircle,
  Clock
} from "lucide-react";
import type { Booking, Review, User as UserType, Nanny } from "@shared/schema";

type BookingWithCaregiver = Booking & { caregiver: Nanny & { user: UserType } };
type ReviewWithReviewer = Review & { reviewer: UserType };

export default function Reviews() {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithCaregiver | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: completedBookings = [], isLoading } = useQuery<BookingWithCaregiver[]>({
    queryKey: ["/api/bookings/completed"],
  });

  const { data: myReviews = [], isLoading: reviewsLoading } = useQuery<ReviewWithReviewer[]>({
    queryKey: ["/api/reviews/my-reviews"],
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: { bookingId: number; rating: number; comment: string; revieweeId: number }) => {
      return apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setSelectedBooking(null);
      setRating(0);
      setComment("");
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Submit Review",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!selectedBooking || rating === 0) return;

    submitReviewMutation.mutate({
      bookingId: selectedBooking.id,
      rating,
      comment,
      revieweeId: selectedBooking.caregiver.id,
    });
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              star <= (interactive ? (hoveredStar || currentRating) : currentRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Feedback</h1>
          <p className="text-gray-600 mt-2">Rate your experiences and help improve our community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading bookings...</div>
              ) : completedBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No completed bookings to review</p>
                  <p className="text-sm">Book a caregiver to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.caregiver.user.profileImage || ""} />
                          <AvatarFallback>
                            {booking.caregiver.user.firstName[0]}{booking.caregiver.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {booking.caregiver.user.firstName} {booking.caregiver.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.serviceType}</p>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="mt-3"
                                style={{ backgroundColor: '#FF6B35' }}
                                onClick={() => setSelectedBooking(booking)}
                              >
                                Write Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rate Your Experience</DialogTitle>
                              </DialogHeader>
                              
                              {selectedBooking && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                      <AvatarImage src={selectedBooking.caregiver.user.profileImage || ""} />
                                      <AvatarFallback>
                                        {selectedBooking.caregiver.user.firstName[0]}{selectedBooking.caregiver.user.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">
                                        {selectedBooking.caregiver.user.firstName} {selectedBooking.caregiver.user.lastName}
                                      </h3>
                                      <p className="text-sm text-gray-600">{selectedBooking.serviceType}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Rating *</Label>
                                    <div className="mt-2">
                                      {renderStars(rating, true)}
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="comment">Share your experience</Label>
                                    <Textarea
                                      id="comment"
                                      placeholder="Tell us about your experience with this caregiver..."
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      rows={4}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleSubmitReview}
                                      disabled={rating === 0 || submitReviewMutation.isPending}
                                      style={{ backgroundColor: '#FF6B35' }}
                                    >
                                      {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                My Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading reviews...</div>
              ) : myReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Complete a booking to leave your first review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <Badge variant="outline" className="text-xs">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>Review for booking #{review.bookingId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Review Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What makes a helpful review?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be honest and specific about your experience</li>
                  <li>• Mention punctuality, communication, and care quality</li>
                  <li>• Include details about activities or special needs handled</li>
                  <li>• Be constructive with any feedback</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Community Standards</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep reviews respectful and professional</li>
                  <li>• Focus on the service provided</li>
                  <li>• Avoid personal information or contact details</li>
                  <li>• Report inappropriate content to our team</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}