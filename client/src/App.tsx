import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NewHeader from "@/components/layout/new-header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import NannyProfile from "@/pages/nanny-profile";
import CaregiverProfile from "@/pages/caregiver-profile";
import BookingFlow from "@/pages/booking-flow";
import SearchResults from "@/pages/search-results";
import BecomeNanny from "@/pages/become-nanny";
import Messages from "@/pages/messages";
import MessagingPage from "@/pages/messaging";
import Login from "@/pages/login";
import SimpleLogin from "@/pages/simple-login";
import WorkingLogin from "@/pages/working-login";
import LoginDirect from "@/pages/login-direct";
import Auth from "@/pages/auth";
import ProviderVerification from "@/pages/provider-verification";
import GiftCards from "@/pages/gift-cards";
import GiftCardCheckout from "@/pages/gift-card-checkout";
import Checkout from "@/pages/checkout";
import PaymentCheckout from "@/pages/payment-checkout";
import AdminDashboard from "@/pages/admin-dashboard";
import TrialSignup from "@/pages/trial-signup";
import TrialSuccess from "@/pages/trial-success";
import SMSTest from "@/pages/sms-test";
import EmailTest from "@/pages/email-test";
import EmailPreview from "@/pages/email-preview";
import BookingConfirmation from "@/pages/booking-confirmation";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import RefundPolicy from "@/pages/refund-policy";
import CancellationPolicy from "@/pages/cancellation-policy";
import CookiePolicy from "@/pages/cookie-policy";
import Accessibility from "@/pages/accessibility";
import QuickStart from "@/pages/quick-start";
import CaregiverOnboarding from "@/pages/caregiver-onboarding";
import NannyDashboard from "@/pages/nanny-dashboard";
import CreateExperience from "@/pages/create-experience";
import ProviderSelection from "@/pages/provider-selection";
import BecomeChildcareProvider from "@/pages/become-childcare-provider";
import FindCare from "@/pages/find-care";
import ChildcareEnroll from "@/pages/childcare-enroll";
import ProviderDashboard from "@/pages/provider-dashboard";
import ChildcareDashboard from "@/pages/childcare-dashboard";
import AIChat from "@/pages/ai-chat";
import ChildCareServices from "@/pages/child-care-services";
import PetCareServices from "@/pages/pet-care-services";
import AgedCareServices from "@/pages/aged-care-services";
import PrenatalServices from "@/pages/prenatal-services";
import AgedCare from "@/pages/aged-care";
import PetCare from "@/pages/pet-care";
import Childcare from "@/pages/childcare";
import HowItWorks from "@/pages/how-it-works";
import FAQs from "@/pages/faqs";
import Services from "@/pages/services";
import PersonalityProfile from "@/pages/profile";
import FindCareSignup from "@/pages/find-care-signup";
import BecomeCaregiver from "@/pages/become-caregiver";
import BecomeSeeker from "@/pages/become-seeker";
import ServiceProviderChoice from "@/pages/service-provider-choice";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";
import ParentProfile from "@/pages/parent-profile";
import AccountSettings from "@/pages/account-settings";
import Help from "@/pages/help";
import CoSupport from "@/pages/co-support";
import EmergencyInformation from "@/pages/emergency-information";
import CaregiverRegistrationSimple from "@/pages/caregiver-registration-simple";
import CaregiverRegistration from "@/pages/caregiver-registration";
import EnhancedCaregiverRegistration from "@/pages/enhanced-caregiver-registration";
import RegistrationTypeSelection from "@/pages/registration-type-selection";
import ServiceProviderRegistration from "@/pages/service-provider-registration";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Welcome from "@/pages/welcome";
import CaregiverSignup from "@/pages/caregiver-signup";
import ParentProfileComplete from "@/pages/parent-profile-complete";
import ParentDirectory from "@/pages/parent-directory";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NewHeader />
      <main className="flex-1">
        <Switch>
          {/* Role-based home route */}
          <Route path="/">
            {() => {
              if (isLoading) {
                return (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                );
              }
              
              return <Home />;
            }}
          </Route>

          {/* Public routes */}
          <Route path="/nanny/:id" component={NannyProfile} />
          <Route path="/caregiver/:id" component={CaregiverProfile} />
          <Route path="/booking/:id" component={BookingFlow} />
          <Route path="/search" component={SearchResults} />
          <Route path="/services" component={Services} />
          <Route path="/become-nanny" component={BecomeNanny} />
          <Route path="/become-caregiver" component={BecomeCaregiver} />
          <Route path="/become-seeker" component={BecomeSeeker} />
          <Route path="/become-service-provider" component={ServiceProviderChoice} />
          <Route path="/signup-parent" component={FindCareSignup} />
          <Route path="/signup-caregiver" component={CaregiverSignup} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/registration-type-selection" component={RegistrationTypeSelection} />
          <Route path="/caregiver-registration" component={CaregiverRegistration} />
          <Route path="/enhanced-caregiver-registration" component={EnhancedCaregiverRegistration} />
          <Route path="/service-provider-registration" component={ServiceProviderRegistration} />
          <Route path="/signup" component={Signup} />
          <Route path="/co-support" component={CoSupport} />
          <Route path="/provider-selection" component={ProviderSelection} />
          <Route path="/become-childcare-provider" component={BecomeChildcareProvider} />
          <Route path="/find-care" component={FindCare} />
          <Route path="/childcare-enroll/:id" component={ChildcareEnroll} />
          <Route path="/login" component={Auth} />
          <Route path="/working-login" component={WorkingLogin} />
          <Route path="/auth" component={Auth} />
          <Route path="/signin" component={Auth} />
          <Route path="/sign-in" component={Auth} />
          <Route path="/profile" component={ParentProfile} />
          <Route path="/parent-profile" component={ParentProfile} />
          <Route path="/parent-profile-complete" component={ParentProfileComplete} />
          <Route path="/parent-directory" component={ParentDirectory} />
          <Route path="/caregiver-profile" component={CaregiverProfile} />
          <Route path="/basic-profile" component={PersonalityProfile} />
          <Route path="/account-settings" component={AccountSettings} />
          <Route path="/verification" component={ProviderVerification} />
          <Route path="/gift-cards" component={GiftCards} />
          <Route path="/gift-card-checkout" component={GiftCardCheckout} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/payment-checkout" component={PaymentCheckout} />
          <Route path="/trial" component={TrialSignup} />
          <Route path="/trial-signup" component={TrialSignup} />
          <Route path="/trial-success" component={TrialSuccess} />
          <Route path="/sms-test" component={SMSTest} />
          <Route path="/email-test" component={EmailTest} />
          <Route path="/email-preview" component={EmailPreview} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/ai-chat" component={AIChat} />
          <Route path="/child-care-services" component={ChildCareServices} />
          <Route path="/pet-care-services" component={PetCareServices} />
          <Route path="/aged-care-services" component={AgedCareServices} />
          <Route path="/prenatal-services" component={PrenatalServices} />
          <Route path="/aged-care" component={AgedCare} />
          <Route path="/pet-care" component={PetCare} />
          <Route path="/childcare" component={Childcare} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/about" component={About} />
          <Route path="/faqs" component={FAQs} />
          <Route path="/booking-confirmed" component={BookingConfirmation} />
          <Route path="/booking-confirmation" component={BookingConfirmation} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/cancellation-policy" component={CancellationPolicy} />
          <Route path="/cookie-policy" component={CookiePolicy} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/help" component={Help} />
          <Route path="/emergency-information" component={EmergencyInformation} />
          <Route path="/quick-start" component={QuickStart} />

          {/* Provider-only routes */}
          <Route path="/provider-dashboard" component={ProviderDashboard} />
          <Route path="/childcare-dashboard" component={ChildcareDashboard} />
          <Route path="/nanny-dashboard" component={NannyDashboard} />
          <Route path="/create-experience" component={CreateExperience} />
          <Route path="/caregiver-onboarding" component={CaregiverOnboarding} />

          {/* Authenticated user routes */}
          <Route path="/messages" component={Messages} />
          <Route path="/messaging" component={MessagingPage} />
          
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
