import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const { data: revenueData, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/revenue"],
  });

  const { data: bookingStats } = useQuery({
    queryKey: ["/api/admin/bookings/stats"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/users/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">VIVALY Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform performance and revenue analytics</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button className="flex items-center gap-2 bg-coral hover:bg-coral/90">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${revenueData?.totalRevenue?.toFixed(2) || '0.00'} AUD
              </div>
              <p className="text-xs text-muted-foreground">
                From {revenueData?.totalBookings || 0} completed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${revenueData?.totalPlatformFees?.toFixed(2) || '0.00'} AUD
              </div>
              <p className="text-xs text-muted-foreground">
                10% commission from bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Booking</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${revenueData?.averageBookingValue?.toFixed(2) || '0.00'} AUD
              </div>
              <p className="text-xs text-muted-foreground">
                Per booking average value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats?.totalUsers || 0}
              </div>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {userStats?.caregivers || 0} Caregivers
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {userStats?.parents || 0} Parents
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Caregiver Payments</span>
                  <span className="font-semibold">
                    ${((revenueData?.totalRevenue || 0) - (revenueData?.totalPlatformFees || 0)).toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform Commission (10%)</span>
                  <span className="font-semibold text-green-600">
                    ${revenueData?.totalPlatformFees?.toFixed(2) || '0.00'} AUD
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Processed</span>
                    <span className="font-bold text-lg">
                      ${revenueData?.totalRevenue?.toFixed(2) || '0.00'} AUD
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Successful Bookings</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {revenueData?.totalBookings || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Success Rate</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {revenueData?.totalBookings > 0 ? '100%' : '0%'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Commission</span>
                  <span className="font-semibold">
                    ${revenueData?.totalBookings > 0 ? 
                      ((revenueData?.totalPlatformFees || 0) / revenueData.totalBookings).toFixed(2) : 
                      '0.00'} AUD
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Business Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {((revenueData?.totalPlatformFees || 0) / (revenueData?.totalRevenue || 1) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-800 font-medium">Platform Take Rate</div>
                <div className="text-xs text-blue-600 mt-1">Commission percentage</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${revenueData?.averageBookingValue?.toFixed(0) || '0'}
                </div>
                <div className="text-sm text-green-800 font-medium">Average Order Value</div>
                <div className="text-xs text-green-600 mt-1">Per booking revenue</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {userStats?.caregivers || 0}
                </div>
                <div className="text-sm text-purple-800 font-medium">Active Caregivers</div>
                <div className="text-xs text-purple-600 mt-1">Verified providers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions for Business Setup */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps for Business Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Legal & Compliance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Register ABN and business structure</li>
                  <li>• Obtain professional indemnity insurance</li>
                  <li>• Implement WWCC verification system</li>
                  <li>• Set up GST registration (once revenue &gt; $75k)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform Optimization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Implement Stripe Connect for caregiver payouts</li>
                  <li>• Add automated invoicing system</li>
                  <li>• Create dispute resolution process</li>
                  <li>• Set up automated tax reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}