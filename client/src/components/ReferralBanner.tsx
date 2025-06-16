export function ReferralBanner() {
  return (
    <div className="bg-gray-100 text-black border border-gray-200 p-4 rounded-md mb-6">
      <h2 className="text-lg font-semibold">Earn 3 fee-free bookings</h2>
      <p className="mt-1 text-sm">
        Invite family and friends to join the Vivaly community and get 3 fee-free bookings!
      </p>
      <ul className="text-sm mt-2 list-disc list-inside">
        <li>Share your referral link</li>
        <li>Friends & family sign up using your link</li>
        <li>They join the Vivaly community and use the service</li>
        <li>You get 3 fee-free bookings!</li>
      </ul>
      <button className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors">
        Share Your Link Later
      </button>
    </div>
  );
}