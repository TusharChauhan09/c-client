import { Link } from "react-router-dom";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import useStore from "@/store/useStore";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const theme = useStore((state) => state.theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/about", label: "About" },
    { to: "/travel-ai", label: "Travel-AI" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.header
        layout
        initial={{ y: -100 }}
        animate={{ 
          y: isScrolled ? 12 : 0,
          width: isScrolled ? "90%" : "100%",
          borderRadius: isScrolled ? "0.5rem" : "0px",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 40, duration: 0.2 }}
        className={`
          flex items-center justify-between px-4 h-12 
          transition-all duration-150
          ${isScrolled 
            ? "bg-background/[0.01] backdrop-blur-[5px] supports-[backdrop-filter]:bg-transparent border border-white/5 shadow-lg" 
            : "bg-background/[0.01] backdrop-blur-lg supports-[backdrop-filter]:bg-transparent"
          }
        `}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left Side: Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
            </Link>
          </motion.div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Theme & Profile + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ModeToggle />
            </motion.div>

            {/* Auth Buttons */}
            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    variables: {
                      colorPrimary: isDark ? "#ffffff" : "#000000",
                      colorBackground: isDark ? "#0a0a0a" : "#ffffff",
                      colorInputBackground: isDark ? "#1a1a1a" : "#f5f5f5",
                      colorText: isDark ? "#ffffff" : "#000000",
                      colorTextSecondary: isDark ? "#a1a1a1" : "#6b7280",
                    },
                    elements: {
                      avatarBox: "h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/30 transition-all",
                      userButtonPopoverCard: isDark ? "bg-[#0a0a0a] border border-white/10 shadow-lg" : "bg-white border border-black/10 shadow-lg",
                      userButtonPopoverActionButton: isDark ? "!text-white hover:bg-white/10" : "!text-black hover:bg-black/5",
                      userButtonPopoverActionButtonText: isDark ? "!text-white" : "!text-black",
                      userButtonPopoverActionButtonIcon: isDark ? "!text-white" : "!text-black",
                      userButtonPopoverFooter: "hidden",
                    }
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/user-profile"
                />
              </motion.div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-md hover:bg-accent/50 transition-colors ${isMobileMenuOpen ? 'hidden' : ''}`}
              aria-label="Toggle menu"
            >
              <IconMenu2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>
    </div>

    {/* Mobile Sidebar Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-2/3 bg-background border-l border-border z-50 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">T</span>
                  </div>
                  <span className="text-lg font-serif">Travel Planner</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
