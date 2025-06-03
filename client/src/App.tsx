import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import NannyProfile from "@/pages/nanny-profile";
import SearchResults from "@/pages/search-results";
import BecomeNanny from "@/pages/become-nanny";
import Messages from "@/pages/messages";
import Login from "@/pages/login";
import ProviderVerification from "@/pages/provider-verification";
import GiftCards from "@/pages/gift-cards";
import GiftCardCheckout from "@/pages/gift-card-checkout";
import Checkout from "@/pages/checkout";
import BookingConfirmation from "@/pages/booking-confirmation";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import RefundPolicy from "@/pages/refund-policy";
import CookiePolicy from "@/pages/cookie-policy";
import Accessibility from "@/pages/accessibility";
import QuickStart from "@/pages/quick-start";
import CaregiverOnboarding from "@/pages/caregiver-onboarding";
import NannyDashboard from "@/pages/nanny-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/nanny/:id" component={NannyProfile} />
          <Route path="/search" component={SearchResults} />
          <Route path="/become-nanny" component={BecomeNanny} />
          <Route path="/nanny-dashboard" component={NannyDashboard} />
          <Route path="/messages" component={Messages} />
          <Route path="/login" component={Login} />
          <Route path="/verification" component={ProviderVerification} />
          <Route path="/gift-cards" component={GiftCards} />
          <Route path="/gift-card-checkout" component={GiftCardCheckout} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/booking-confirmed" component={BookingConfirmation} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/cookie-policy" component={CookiePolicy} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/quick-start" component={QuickStart} />
          <Route path="/caregiver-onboarding" component={CaregiverOnboarding} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
