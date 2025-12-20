import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/AboutPage";
import TravelAIPage from "./pages/TravelAIPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import UserProfilePage from "./pages/UserProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import SellerDashboard from "./pages/SellerDashboard";
import CityChallengesPage from "./pages/CityChallengesPage";
import { useAuthSync } from "@/hooks/useAuthSync";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/SmoothScroll";

function AppContent() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/travel-ai" || location.pathname === "/admin";
  const hideNavbar = location.pathname === "/admin";

  return (
    <>
      <SmoothScroll />
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "pt-12"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/booking/:serviceType/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/travel-ai" element={<TravelAIPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/city-challenges" element={<CityChallengesPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </>
  );
}

function App() {
  useAuthSync();

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
