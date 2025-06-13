import React from "react";

interface ReferralBannerProps {
  feeWaiverCount?: number;
  onRegisterClick?: () => void;
  referralLink?: string;
}

export default function ReferralBanner({ 
  feeWaiverCount = 0, 
  onRegisterClick,
  referralLink 
}: ReferralBannerProps) {
  const hasWaivers = feeWaiverCount && feeWaiverCount > 0;

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: hasWaivers ? "#d4edda" : "#FFA07A",
        color: hasWaivers ? "#155724" : "#8B0000",
        padding: "8px 16px",
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex-1">
          {hasWaivers ? (
            <span className="font-semibold text-sm sm:text-base">
              🎉 Great news! You have{" "}
              <strong>{feeWaiverCount}</strong> free booking
              {feeWaiverCount > 1 ? "s" : ""} available. Book now and save on platform fees!
            </span>
          ) : (
            <span className="font-semibold text-sm sm:text-base">
              🎁 Invite family and friends to join the Vivaly community and get{" "}
              <strong>up to 3 fee-free bookings!</strong>
            </span>
          )}
        </div>
        
        {!hasWaivers && (
          <button
            onClick={onRegisterClick}
            className="px-4 py-2 bg-red-700 text-white text-sm font-bold rounded-md hover:bg-red-800 transition-colors whitespace-nowrap"
          >
            LOG IN TO INVITE FRIENDS
          </button>
        )}
      </div>
    </div>
  );
}