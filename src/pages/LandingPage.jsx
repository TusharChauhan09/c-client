import { SignedIn, SignedOut } from "@clerk/clerk-react";
import HeroCarousel from "@/components/HeroCarousel";

export default function LandingPage() {
    const heroSlides = [
        {
            image: "/hero-1.png",
            alt: "Scenic mountain road",
        },
        {
            image: "/hero-2.png",
            alt: "Tropical beach paradise",
        },
        {
            image: "/hero-3.png",
            alt: "Mountain peaks at sunrise",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Carousel Section - No Top Margin */}
            <div className="w-full px-2">
                <HeroCarousel slides={heroSlides} autoPlayInterval={30000} />
            </div>

            {/* Additional Content Section */}
            <SignedIn>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <p className="text-center text-muted-foreground">Welcome back! You are signed in.</p>
                </div>
            </SignedIn>
            <SignedOut>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <p className="text-center text-muted-foreground">Please sign in to unlock all features.</p>
                </div>
            </SignedOut>
        </div>
    );
}