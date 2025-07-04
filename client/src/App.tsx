import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import SimpleHeader from "@/components/layout/SimpleHeader";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/layout/footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { lazy, Suspense } from "react";
import Home from "@/pages/home";
import NannyProfile from "@/pages/nanny-profile";
import CaregiverProfile from "@/pages/caregiver-profile";
import BookingFlow from "@/pages/booking-flow";
import SearchResults from "@/pages/search-results";
import BecomeNanny from "@/pages/become-nanny";
import Messages from "@/pages/messages";
import MessagingPage from "@/pages/messaging";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SimpleLogin from "@/pages/simple-login";
import WorkingLogin from "@/pages/working-login";
import WorkingAuth from "@/pages/working-auth";
import LoginDirect from "@/pages/login-direct";
import Auth from "@/pages/auth";
import ResetPassword from "@/pages/reset-password";
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
import AuthTest from "@/pages/auth-test";
import LoginTest from "@/pages/login-test";
import PaymentTestSimple from "@/pages/payment-test-simple";

// Lazy-load Stripe pages to prevent loading conflicts
const TestPaymentLazy = lazy(() => import("@/pages/test-payment"));
const PaymentDemoLazy = lazy(() => import("@/pages/payment-demo"));
const PaymentSuccessLazy = lazy(() => import("@/pages/payment-success"));
const BookingConfirmationLazy = lazy(() => import("@/pages/booking-confirmation"));
const BookingSummaryLazy = lazy(() => import("@/pages/booking-summary"));
const CaregiverConnectLazy = lazy(() => import("@/pages/caregiver-connect"));
const TestBookingFlowLazy = lazy(() => import("@/pages/test-booking-flow"));

import BookingConfirmation from "@/pages/booking-confirmation";
import BookingSummaryCard from "@/components/BookingSummaryCard";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import RefundPolicy from "@/pages/refund-policy";
import CancellationPolicy from "@/pages/cancellation-policy";
import CookiePolicy from "@/pages/cookie-policy";
import Accessibility from "@/pages/accessibility";
import QuickStart from "@/pages/quick-start";
import ParentBookings from "@/pages/parent-bookings";
import Bookings from "@/pages/bookings";
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
import RoleAuthDemo from "@/pages/role-auth-demo";
import Help from "@/pages/help";
import CoSupport from "@/pages/co-support";
import EmergencyInformation from "@/pages/emergency-information";
import CaregiverRegistrationSimple from "@/pages/caregiver-registration-simple";
import CaregiverRegistration from "@/pages/caregiver-registration";
import EnhancedCaregiverRegistration from "@/pages/enhanced-caregiver-registration";
import ImprovedCaregiverRegistration from "@/pages/improved-caregiver-registration";
import RegistrationTypeSelection from "@/pages/registration-type-selection";
import ServiceProviderRegistration from "@/pages/service-provider-registration";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Welcome from "@/pages/welcome";
import CaregiverSignup from "@/pages/caregiver-signup";
import ForgotPassword from "@/pages/forgot-password";
import ParentProfileComplete from "@/pages/parent-profile-complete";
import ParentDirectory from "@/pages/parent-directory";
import JobBoard from "@/pages/job-board";
import PostJob from "@/pages/post-job";
import EditJob from "@/pages/edit-job";
import BrowseJobs from "@/pages/browse-jobs";
import ParentDashboard from "@/pages/parent-dashboard";
import CaregiverDashboard from "@/pages/caregiver-dashboard";
import CaregiverBookings from "@/pages/caregiver-bookings";
import CaregiverSchedule from "@/pages/caregiver-schedule";
import JobDetails from "@/pages/job-details";
import SearchCaregivers from "@/pages/search-caregivers";
import NannySharingPage from "@/pages/nanny-sharing";
import CreateNannyShare from "@/pages/create-nanny-share";
import NannyShareDetails from "@/pages/nanny-share-details";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRoute from "@/components/RoleRoute";
import SafetyVerification from "@/components/safety-verification";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
        <Switch>
          {/* Role-based home route */}
          <Route path="/" component={Home} />

          {/* Public routes */}
          <Route path="/nanny/:id" component={NannyProfile} />
          <Route path="/caregiver/:id" component={CaregiverProfile} />
          <Route path="/booking/:id" component={BookingFlow} />
          <Route path="/search" component={SearchResults} />
          <Route path="/search-caregivers" component={SearchCaregivers} />
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
          <Route path="/improved-caregiver-registration" component={ImprovedCaregiverRegistration} />
          <Route path="/service-provider-registration" component={ServiceProviderRegistration} />
          <Route path="/signup" component={Signup} />
          <Route path="/co-support" component={CoSupport} />
          <Route path="/provider-selection" component={ProviderSelection} />
          <Route path="/become-childcare-provider" component={BecomeChildcareProvider} />
          <Route path="/find-care" component={FindCare} />
          <Route path="/childcare-enroll/:id" component={ChildcareEnroll} />
          <Route path="/login" component={WorkingAuth} />
          <Route path="/register" component={WorkingAuth} />
          <Route path="/working-login" component={WorkingLogin} />
          <Route path="/working-auth" component={WorkingAuth} />
          <Route path="/auth" component={WorkingAuth} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/signin" component={WorkingAuth} />
          <Route path="/sign-in" component={WorkingAuth} />
          <Route path="/auth-test" component={AuthTest} />
          <Route path="/login-test" component={LoginTest} />

          {/* Role-based dashboard */}
          <Route path="/dashboard">
            <ProtectedRoute>
              <RoleRoute parent={ParentDashboard} caregiver={CaregiverDashboard} />
            </ProtectedRoute>
          </Route>

          {/* Role-based profile */}
          <Route path="/profile">
            <ProtectedRoute>
              <RoleRoute parent={ParentProfile} caregiver={CaregiverProfile} />
            </ProtectedRoute>
          </Route>

          {/* Specific role routes */}
          <Route path="/parent-profile" component={ParentProfile} />
          <Route path="/parent-profile-complete" component={ParentProfileComplete} />
          <Route path="/parent-directory" component={ParentDirectory} />
          <Route path="/caregiver-profile" component={CaregiverProfile} />

          {/* Role-based job functionality */}
          <Route path="/job-board" component={JobBoard} />

          <Route path="/post-job" component={PostJob} />
          <Route path="/edit-job/:id" component={EditJob} />
          <Route path="/browse-jobs" component={BrowseJobs} />
          <Route path="/job-details/:id" component={JobDetails} />
          <Route path="/nanny-sharing" component={NannySharingPage} />
          <Route path="/create-nanny-share" component={CreateNannyShare} />
          <Route path="/nanny-share/:id" component={NannyShareDetails} />
          <Route path="/basic-profile" component={PersonalityProfile} />
          <Route path="/account-settings" component={AccountSettings} />
          <Route path="/verification" component={ProviderVerification} />
          <Route path="/gift-cards" component={GiftCards} />
          <Route path="/gift-card-checkout" component={GiftCardCheckout} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/payment-checkout" component={PaymentCheckout} />
          <Route path="/test-payment">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <TestPaymentLazy />
            </Suspense>
          </Route>
          <Route path="/payment-demo">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <PaymentDemoLazy />
            </Suspense>
          </Route>
          <Route path="/payment-test-simple" component={PaymentTestSimple} />
          <Route path="/payment-success">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <PaymentSuccessLazy />
            </Suspense>
          </Route>
          <Route path="/booking-confirmation">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <BookingConfirmationLazy />
            </Suspense>
          </Route>
          <Route path="/booking-summary">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <BookingSummaryLazy />
            </Suspense>
          </Route>
          <Route path="/caregiver-connect">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <CaregiverConnectLazy />
            </Suspense>
          </Route>
          <Route path="/test-booking-flow">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <TestBookingFlowLazy />
            </Suspense>
          </Route>
          <Route path="/test-booking-summary">
            <div className="min-h-screen bg-gray-50 py-8">
              <BookingSummaryCard
                caregiver={{
                  name: 'Sarah Johnson',
                  photoUrl: '/images/sample-caregiver.jpg',
                  email: 'sarah@email.com',
                  phone: '0412 345 678',
                }}
                parent={{
                  name: 'Jane Smith',
                  email: 'jane@email.com',
                  phone: '0400 123 456',
                }}
                startDate="2025-07-01"
                endDate="2025-07-03"
                hoursPerDay={6}
                ratePerHour={30}
                status="confirmed"
                paymentStatus="paid_unreleased"
                personalDetailsVisible={true}
              />
            </div>
          </Route>
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
          
          {/* Parent specific routes */}
          <Route path="/parent/bookings" component={ParentBookings} />
          <Route path="/parent-bookings" component={ParentBookings} />
          <Route path="/my-bookings" component={ParentBookings} />
          <Route path="/bookings" component={ParentDashboard} />

          {/* Provider-only routes */}
          <Route path="/provider-dashboard" component={ProviderDashboard} />
          <Route path="/childcare-dashboard" component={ChildcareDashboard} />
          <Route path="/nanny-dashboard" component={NannyDashboard} />
          <Route path="/create-experience" component={CreateExperience} />
          <Route path="/caregiver-onboarding" component={CaregiverOnboarding} />
          <Route path="/find-care" component={FindCare} />

          {/* Authenticated user routes */}
          <Route path="/messages">
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          </Route>
          <Route path="/messaging">
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          </Route>
          
          {/* Role-based dashboards */}
          <Route path="/parent-dashboard" component={ParentDashboard} />
          <Route path="/caregiver-dashboard" component={CaregiverDashboard} />
          <Route path="/caregiver-bookings" component={CaregiverBookings} />
          
          {/* Booking pages */}
          <Route path="/parent/bookings">
            {() => (
              <ProtectedRoute>
                <RoleRoute allowedRoles={["parent"]}>
                  <ParentBookings />
                </RoleRoute>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/caregiver/bookings">
            {() => (
              <ProtectedRoute>
                <RoleRoute allowedRoles={["caregiver"]}>
                  <CaregiverBookings />
                </RoleRoute>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/caregiver/schedule">
            {() => (
              <ProtectedRoute>
                <RoleRoute allowedRoles={["caregiver"]}>
                  <CaregiverSchedule />
                </RoleRoute>
              </ProtectedRoute>
            )}
          </Route>

          {/* Unify parent & caregiver job browsing */}
          <Route path="/browse-jobs" component={JobBoard} />
          <Route path="/job-board" component={JobBoard} />
          
          {/* Role-based authentication demo */}
          <Route path="/role-auth-demo" component={RoleAuthDemo} />
          
          {/* Additional booking routes */}
          <Route path="/my-bookings" component={ParentBookings} />
          
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </main>
      <Footer />
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
