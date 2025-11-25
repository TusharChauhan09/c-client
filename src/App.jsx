import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <header className="p-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Travel Planner</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Routes>
        <Route path="/" element={
            <div className="p-4">
                <SignedIn>
                    <p>Welcome back! You are signed in.</p>
                </SignedIn>
                <SignedOut>
                    <p>Please sign in to continue.</p>
                </SignedOut>
            </div>
        } />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
