import { Link } from "react-router-dom";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  IconMenu2,
  IconX,
  IconLayoutDashboard,
  IconTicket,
  IconBuildingStore,
} from "@tabler/icons-react";
import useUIStore from "@/store/useUIStore";
import useAuthStore from "@/store/useAuthStore";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isSignedIn } = useUser();
  const { dbUser, syncUser } = useAuthStore();

  // Check if user is admin
  const isAdmin = dbUser?.role === "admin";

  useEffect(() => {
    if (isSignedIn && user) {
      // Pass full user object so syncUser can create user if needed
      syncUser(user.id, user);
    }
  }, [isSignedIn, user, syncUser]);

  const theme = useUIStore((state) => state.theme);
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/city-challenges", label: "City Challenges" },
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
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
            duration: 0.2,
          }}
          className={`
          flex items-center justify-between px-4 h-12 
          transition-all duration-150
          ${
            isScrolled
              ? "bg-background/[0.01] backdrop-blur-[5px] supports-[backdrop-filter]:bg-transparent border border-white/5 shadow-lg"
              : "bg-background/[0.01] backdrop-blur-lg supports-[backdrop-filter]:bg-transparent"
          }
        `}
        >
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Left Side: Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <svg
                  fill="none"
                  height="32"
                  viewBox="0 0 40 48"
                  width="28"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <g className="fill-current">
                    <path d="m28.6446 39.168c-.6032 1.3404-1.353 2.6531-2.2519 3.7888 7.4581-2.5137 12.9483-9.3054 13.5527-17.4568h-2.6549c-3.2399 0-5.8424 2.5861-6.369 5.7829-.4855 2.9468-1.2621 5.6301-2.2769 7.8851z" />
                    <path d="m22.7724 25.5c3.3921 0 6.167 2.8299 5.5439 6.1643-1.3533 7.2424-4.5667 12.3357-8.3155 12.3357-4.7435 0-8.6299-8.1549-8.975-18.5z" />
                    <path d="m30.9904 17.1502c.4961 3.2267 3.1106 5.8498 6.3752 5.8498h2.6107c-.4123-8.3729-5.9735-15.39183-13.5836-17.95683.8989 1.13575 1.6487 2.44843 2.2519 3.78878 1.0643 2.36505 1.8666 5.20115 2.3458 8.31825z" />
                    <path d="m28.4165 16.8957c.5674 3.3176-2.1954 6.1043-5.5612 6.1043h-11.8434c.2344-10.5811 4.1693-19 8.9889-19 3.8447 0 7.1263 5.35721 8.4157 12.8957z" />
                    <path d="m8.51131 23c.11359-5.4083 1.14536-10.3894 2.84579-14.16805.6031-1.34035 1.3529-2.65303 2.2519-3.78878-7.61011 2.565-13.171316 9.58393-13.5836094 17.95683z" />
                    <path d="m.0562286 25.5c.6043994 8.1514 6.0946514 14.9431 13.5527714 17.4568-.899-1.1357-1.6488-2.4484-2.2519-3.7888-1.6479-3.6619-2.66781-8.4531-2.83264-13.668z" />
                  </g>
                </svg>
              </Link>
            </div>

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
              <ModeToggle />

              {/* My Bookings Button - Visible for signed in users */}
              <SignedIn>
                <Link to="/my-bookings">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  >
                    <IconTicket size={16} />
                    <span className="text-xs font-medium">My Bookings</span>
                  </Button>
                </Link>
              </SignedIn>

              <SignedIn>
                <Link to="/seller">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  >
                    <IconBuildingStore size={16} />
                    <span className="text-xs font-medium">Become a Seller</span>
                  </Button>
                </Link>
              </SignedIn>

              {/* Admin Dashboard Button - Only visible to admins */}
              <SignedIn>
                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-1.5 border-border/60 hover:border-border hover:bg-accent/50"
                    >
                      <IconLayoutDashboard size={16} />
                      <span className="text-xs font-medium">Dashboard</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              {/* Auth Buttons */}
              <SignedIn>
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
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: isDark
                        ? "bg-[#0a0a0a] border border-white/10 shadow-lg"
                        : "bg-white border border-black/10 shadow-lg",
                      userButtonPopoverActionButton: isDark
                        ? "!text-white hover:bg-white/10"
                        : "!text-black hover:bg-black/5",
                      userButtonPopoverActionButtonText: isDark
                        ? "!text-white"
                        : "!text-black",
                      userButtonPopoverActionButtonIcon: isDark
                        ? "!text-white"
                        : "!text-black",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/user-profile"
                />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </SignedOut>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-md hover:bg-accent/50 transition-colors ${
                  isMobileMenuOpen ? "hidden" : ""
                }`}
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
                    <svg
                      fill="none"
                      height="32"
                      viewBox="0 0 40 48"
                      width="28"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <g className="fill-current">
                        <path d="m28.6446 39.168c-.6032 1.3404-1.353 2.6531-2.2519 3.7888 7.4581-2.5137 12.9483-9.3054 13.5527-17.4568h-2.6549c-3.2399 0-5.8424 2.5861-6.369 5.7829-.4855 2.9468-1.2621 5.6301-2.2769 7.8851z" />
                        <path d="m22.7724 25.5c3.3921 0 6.167 2.8299 5.5439 6.1643-1.3533 7.2424-4.5667 12.3357-8.3155 12.3357-4.7435 0-8.6299-8.1549-8.975-18.5z" />
                        <path d="m30.9904 17.1502c.4961 3.2267 3.1106 5.8498 6.3752 5.8498h2.6107c-.4123-8.3729-5.9735-15.39183-13.5836-17.95683.8989 1.13575 1.6487 2.44843 2.2519 3.78878 1.0643 2.36505 1.8666 5.20115 2.3458 8.31825z" />
                        <path d="m28.4165 16.8957c.5674 3.3176-2.1954 6.1043-5.5612 6.1043h-11.8434c.2344-10.5811 4.1693-19 8.9889-19 3.8447 0 7.1263 5.35721 8.4157 12.8957z" />
                        <path d="m8.51131 23c.11359-5.4083 1.14536-10.3894 2.84579-14.16805.6031-1.34035 1.3529-2.65303 2.2519-3.78878-7.61011 2.565-13.171316 9.58393-13.5836094 17.95683z" />
                        <path d="m.0562286 25.5c.6043994 8.1514 6.0946514 14.9431 13.5527714 17.4568-.899-1.1357-1.6488-2.4484-2.2519-3.7888-1.6479-3.6619-2.66781-8.4531-2.83264-13.668z" />
                      </g>
                    </svg>
                    <span className="text-lg font-serif">Travel Buddy</span>
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

                  {/* My Bookings Link - Mobile (for signed in users) */}
                  <SignedIn>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                    >
                      <IconTicket size={18} />
                      My Bookings
                    </Link>
                  </SignedIn>

                  <SignedIn>
                    <Link
                      to="/seller"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                    >
                      <IconBuildingStore size={18} />
                      Become a Seller
                    </Link>
                  </SignedIn>

                  {/* Admin Dashboard Link - Mobile */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-2"
                    >
                      <IconLayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
