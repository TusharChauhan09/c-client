import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-12">
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/explore" element={<ExplorePage />}/>
          <Route path="/about" element={<AboutPage />}/>
          <Route path="/travel-ai" element={<TravelAIPage />}/>
          <Route path="/pricing" element={<PricingPage />}/>
          <Route path="/contact" element={<ContactPage />}/>
          <Route path="/user-profile" element={<UserProfilePage />}/>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
