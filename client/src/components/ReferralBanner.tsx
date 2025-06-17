import { Gift } from 'lucide-react';

export function ReferralBanner() {
  return (
    <div className="bg-black text-white py-4 px-6 rounded-lg mb-6">
      <div className="flex items-center space-x-3">
        <Gift className="w-6 h-6 text-white" />
        <div>
          <p className="text-sm font-medium">
            Invite family and friends to join the Vivaly community and get 3 fee-free bookings!
          </p>
        </div>
      </div>
    </div>
  );
}