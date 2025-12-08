import { SignedIn, SignedOut } from "@clerk/clerk-react";
import HeroCarousel from "@/components/HeroCarousel";
import BentoGrid from "@/components/BentoGrid";
import DotGrid from "@/components/ui/DotGrid";

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
        <div className="min-h-screen relative">
            {/* DotGrid Background */}
            <div className="fixed inset-0 -z-10">
                <DotGrid
                    dotSize={2}
                    gap={20}
                    baseColor="#10b981"
                    activeColor="#34d399"
                    proximity={100}
                    shockRadius={200}
                    shockStrength={3}
                    resistance={900}
                    returnDuration={1.5}
                />
            </div>

            {/* Hero Carousel Section */}
            <div className="w-full px-2 relative z-10">
                <HeroCarousel slides={heroSlides} autoPlayInterval={30000} />
            </div>

            {/* Bento Grid Section */}
            <div className="relative z-10">
                <BentoGrid />
            </div>

            {/* Additional Content Section */}
            <SignedIn>
                <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                    <p className="text-center text-muted-foreground">Welcome back! You are signed in.</p>
                </div>
            </SignedIn>
            <SignedOut>
                <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                    <p className="text-center text-muted-foreground">Please sign in to unlock all features.</p>
                </div>
            </SignedOut>
        </div>
    );
}