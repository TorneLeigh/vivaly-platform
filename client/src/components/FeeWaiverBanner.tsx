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
      style={{
        backgroundColor: hasWaivers ? "#d4edda" : "#cce5ff",
        color: hasWaivers ? "#155724" : "#004085",
        padding: "15px 25px",
        borderRadius: "8px",
        maxWidth: "700px",
        margin: "20px auto",
        textAlign: "center",
        fontWeight: "600",
        fontSize: "1.15rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {hasWaivers ? (
        <>
          🎉 Great news! You have{" "}
          <strong>{feeWaiverCount}</strong> free booking
          {feeWaiverCount > 1 ? "s" : ""} available. Book now and save on platform fees!
        </>
      ) : (
        <>
          🎁 Invite family and friends to join the Vivaly community and get{" "}
          <strong>up to 3 fee-free bookings!</strong>
          <br />
          <button
            onClick={onRegisterClick}
            style={{
              marginTop: "12px",
              padding: "10px 20px",
              backgroundColor: "#004085",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
            }}
          >
            {referralLink ? "Share Your Referral Link" : "Join Referral Program"}
          </button>
        </>
      )}
    </div>
  );
}