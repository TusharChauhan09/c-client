import { Link } from "react-router-dom";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.header
        layout
        initial={{ y: -100 }}
        animate={{ 
          y: isScrolled ? 12 : 0,
          width: isScrolled ? "90%" : "100%",
          borderRadius: isScrolled ? "0.5rem" : "0px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          flex items-center justify-between px-4 h-14 
          bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/10
          border-b border-border/60 dark:border-border shadow-sm
          ${isScrolled ? "border shadow-md" : ""}
        `}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left Side: Logo/Name */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold font-serif tracking-tight">
                Travel Planner
              </span>
            </Link>
          </motion.div>

          {/* Right Side: Theme & Profile */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ModeToggle />
            </motion.div>

            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
                    }
                  }}
                />
              </motion.div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
