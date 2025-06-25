import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface CaregiverInfo {
  name: string;
  photoUrl?: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
}

interface ParentInfo {
  name: string;
  email: string;
  phone: string;
}

interface BookingSummaryCardProps {
  caregiver: CaregiverInfo;
  parent: ParentInfo;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  ratePerHour: number;
  status?: string;
  paymentStatus?: string;
  personalDetailsVisible?: boolean;
  showContactDetails?: boolean;
}

export default function BookingSummaryCard({ 
  caregiver, 
  parent, 
  startDate, 
  endDate, 
  hoursPerDay, 
  ratePerHour,
  status = 'pending',
  paymentStatus = 'unpaid',
  personalDetailsVisible = false,
  showContactDetails = true
}: BookingSummaryCardProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateBookingDetails = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const subtotal = hoursPerDay * ratePerHour * days;
    const serviceFee = Math.round(subtotal * 0.10 * 100) / 100;
    const total = subtotal + serviceFee;
    const caregiverAmount = subtotal;
    
    return { days, subtotal, serviceFee, total, caregiverAmount };
  };

  const { days, subtotal, serviceFee, total, caregiverAmount } = calculateBookingDetails();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      unpaid: { color: 'bg-gray-100 text-gray-800', label: 'Unpaid' },
      payment_initiated: { color: 'bg-orange-100 text-orange-800', label: 'Payment Processing' },
      paid_unreleased: { color: 'bg-blue-100 text-blue-800', label: 'Payment Held' },
      released: { color: 'bg-green-100 text-green-800', label: 'Payment Released' }
    };
    
    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.unpaid;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Summary
          </CardTitle>
          <div className="flex gap-2">
            {getStatusBadge(status)}
            {getPaymentStatusBadge(paymentStatus)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Caregiver Information */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {(caregiver.photoUrl || caregiver.profileImageUrl) ? (
              <img 
                src={caregiver.photoUrl || caregiver.profileImageUrl} 
                alt={caregiver.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {caregiver.name.split(' ').map(n => n.charAt(0)).join('')}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{caregiver.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${ratePerHour}/hour
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {hoursPerDay} hours/day
              </span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Service Dates</p>
              <p className="text-sm text-gray-600">
                {formatDate(startDate)} — {formatDate(endDate)}
              </p>
              <p className="text-xs text-gray-500">{days} day{days !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Daily Schedule</p>
              <p className="text-sm text-gray-600">
                {hoursPerDay} hour{hoursPerDay !== 1 ? 's' : ''} per day
              </p>
              <p className="text-xs text-gray-500">Total: {hoursPerDay * days} hours</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payment Breakdown
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service Cost ({days} days × {hoursPerDay}h × ${ratePerHour})</span>
              <span>${caregiverAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Platform Fee (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Security Notice */}
          {paymentStatus === 'paid_unreleased' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium">Payment Secured</p>
                  <p>Funds held safely until 24 hours after job completion</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Details */}
        {showContactDetails && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Contact Information</h3>
              {personalDetailsVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {personalDetailsVisible ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parent Contact */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Parent</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{parent.name}</p>
                    <div className="flex items-center gap-2 text-green-700">
                      <Mail className="h-3 w-3" />
                      <span>{parent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <Phone className="h-3 w-3" />
                      <span>{parent.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Caregiver Contact */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Caregiver</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{caregiver.name}</p>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Mail className="h-3 w-3" />
                      <span>{caregiver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Phone className="h-3 w-3" />
                      <span>{caregiver.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Contact Details Protected</p>
                    <p>
                      Contact information will be available after payment is processed and released. 
                      This protects both parties and ensures quality service delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}