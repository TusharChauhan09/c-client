import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function LandingPage() {
    return (
        <div className="p-4">
            <SignedIn>
                <p>Welcome back! You are signed in.</p>
            </SignedIn>
            <SignedOut>
                <p>Please sign in to continue.</p>
            </SignedOut>
            <div className="h-screen"></div>
        </div>
    );
}