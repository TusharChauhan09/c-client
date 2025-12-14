import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconLeaf,
  IconRoute,
  IconUsers,
  IconPlane,
  IconMicrophone,
  IconChartBar,
  IconArrowRight,
  IconMapPin,
  IconShoppingCart,
  IconUserCheck,
  IconSettings,
  IconBulb,
  IconTrain,
  IconCar,
  IconBuilding,
  IconToolsKitchen2,
  IconCheck,
  IconTarget,
  IconWorld,
} from "@tabler/icons-react";
import { ReactLogo, NodeLogo, TailwindLogo, MongoDBLogo } from "@/components/TechLogos";

// ============================================================
// ENHANCED ANIMATED COMPONENTS
// ============================================================

// Cursor Spotlight Effect
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16,185,129,0.06), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

// Morphing Background Blob
const MorphingBlob = ({ className = "" }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
    animate={{
      scale: [1, 1.1, 1.05, 1],
      x: [0, 30, -20, 0],
      y: [0, -20, 10, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Smooth Reveal Animation
const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text Gradient Animation
const AnimatedGradientText = ({ children, className = "" }) => (
  <motion.span
    className={`text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-[length:200%_auto] ${className}`}
    animate={{ backgroundPosition: ["0% center", "200% center"] }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    {children}
  </motion.span>
);

// Enhanced Dashed Ring with Multiple Beams
const EnhancedOrbitalRing = ({ icons, size = 340 }) => {
  const radius = size / 2 - 40;
  const innerRadius = radius - 50;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pulsing Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Primary Beam Gradient */}
          <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(16 185 129)" stopOpacity="1" />
            <stop offset="70%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          
          {/* Secondary Beam Gradient */}
          <linearGradient id="beamGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgb(20 184 166)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Static Dashed Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="12 8"
          className="text-border"
        />

        {/* Middle Dotted Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 25}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="text-border/40"
        />

        {/* Inner Dashed Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 12"
          className="text-border/60"
        />

        {/* Primary Rotating Beam */}
        <g style={{ transformOrigin: "center" }}>
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#beamGradient1)"
            strokeWidth="3"
            strokeDasharray={`${circumference * 0.2} ${circumference * 0.8}`}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </g>

        {/* Secondary Beam (Opposite Direction) */}
        <g style={{ transformOrigin: "center" }}>
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={innerRadius}
            fill="none"
            stroke="url(#beamGradient2)"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * innerRadius * 0.15} ${2 * Math.PI * innerRadius * 0.85}`}
            strokeLinecap="round"
            initial={{ rotate: 180 }}
            animate={{ rotate: -180 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </g>

        {/* Beam Head Glow Dot */}
        <motion.circle
          cx={size / 2 + radius}
          cy={size / 2}
          r="4"
          fill="rgb(16 185 129)"
          filter="url(#glow)"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
      </svg>

      {/* Center Element */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative">
          {/* Outer Ring */}
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 blur-sm" />
          {/* Main Icon Container */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl shadow-primary/30">
            <IconLeaf size={28} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Orbiting Icons */}
      {icons.map((Icon, index) => {
        const angle = (index * 360) / icons.length - 90;
        const x = Math.cos((angle * Math.PI) / 180) * radius + size / 2 - 18;
        const y = Math.sin((angle * Math.PI) / 180) * radius + size / 2 - 18;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.4, ease: "backOut" }}
            whileHover={{ scale: 1.15, y: -2 }}
            className="absolute w-9 h-9 rounded-xl bg-background border border-border/80 shadow-lg shadow-black/5 flex items-center justify-center cursor-pointer transition-colors hover:border-primary/30"
            style={{ left: x, top: y }}
          >
            <Icon size={16} className="text-muted-foreground" />
          </motion.div>
        );
      })}
    </div>
  );
};

// Animated Stats Counter
const StatCounter = ({ value, label, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(eased * numericValue));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 tabular-nums">
        {displayValue}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
};

// Feature Card with Icon Animation
const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SpotlightCard className="h-full rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors duration-300">
        <div className="p-7 h-full">
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, 0] : 0,
              scale: isHovered ? 1.05 : 1 
            }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center mb-5"
          >
            <Icon size={22} className="text-primary" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

// Role Card with Gradient Border
const RoleCard = ({ icon: Icon, title, subtitle, description, features, gradient, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Gradient Border Effect */}
      <motion.div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]`}
      />
      
      <SpotlightCard className="relative h-full rounded-2xl bg-card border border-border group-hover:border-transparent transition-colors duration-300">
        <div className="p-8 h-full">
          {/* Icon */}
          <motion.div 
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
          >
            <Icon size={26} className="text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-sm text-primary/70 font-medium mb-4">{subtitle}</p>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconCheck size={10} className="text-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

// Timeline Step
const TimelineStep = ({ step, title, desc, index, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
    className="relative pl-16"
  >
    {/* Connecting Line */}
    {!isLast && (
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="absolute left-[18px] top-10 w-px h-[calc(100%+8px)] bg-gradient-to-b from-primary/40 to-primary/10 origin-top"
      />
    )}

    {/* Step Circle */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="absolute left-0 w-10 h-10 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-sm"
    >
      <span className="text-xs font-bold text-primary">{step}</span>
    </motion.div>

    {/* Content Card */}
    <SpotlightCard className="rounded-xl bg-card border border-border hover:border-primary/20 transition-colors duration-300 mb-4">
      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </SpotlightCard>
  </motion.div>
);

// Animated Separator
const Separator = ({ className = "" }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={`h-px bg-gradient-to-r from-transparent via-border to-transparent origin-center ${className}`}
  />
);

// ============================================================
// DATA
// ============================================================

const stats = [
  { value: "3", suffix: "", label: "User Roles" },
  { value: "4", suffix: "+", label: "Core Features" },
  { value: "6", suffix: "+", label: "Service Types" },
  { value: "24", suffix: "/7", label: "AI Support" },
];

const userRoles = [
  {
    icon: IconUsers,
    title: "Traveller",
    subtitle: "Plan and Explore",
    description: "Search destinations, create smart itineraries optimized for time, cost, and sustainability with real-time journey information.",
    features: ["Green Score Rating", "Crowd Avoidance Routing", "Multi-service Booking"],
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: IconShoppingCart,
    title: "Service Provider",
    subtitle: "Hotels, Restaurants, Guides, Transport",
    description: "Manage listings, track bookings, view earnings, and receive demand insights to optimize your resources effectively.",
    features: ["Listing Management", "Analytics Dashboard", "Demand Forecasting"],
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: IconSettings,
    title: "Administrator",
    subtitle: "Platform Oversight",
    description: "Monitor system health, verify sellers, analyze traffic data, and manage tourist flow across the city infrastructure.",
    features: ["Real-time Heatmaps", "Flow Control Tools", "Seller Verification"],
    gradient: "from-violet-500 to-purple-500"
  }
];

const coreFeatures = [
  {
    icon: IconRoute,
    title: "Smart Dispersal",
    description: "Intelligent algorithms suggest alternative attractions during peak hours to reduce congestion and enhance visitor experience."
  },
  {
    icon: IconTrain,
    title: "Integrated Logistics",
    description: "Seamless transport booking from train to taxi to hotel, designed to minimize private vehicle usage within cities."
  },
  {
    icon: IconChartBar,
    title: "Data Analytics",
    description: "Comprehensive real-time heatmaps enabling administrators to visualize and manage city resource strain effectively."
  },
  {
    icon: IconMicrophone,
    title: "AI Voice Guide",
    description: "Natural conversation-powered travel companion using advanced AI for hands-free assistance throughout your journey."
  }
];

const techStack = [
  { Logo: ReactLogo, name: "React 19" },
  { Logo: TailwindLogo, name: "Tailwind CSS" },
  { Logo: NodeLogo, name: "Node.js" },
  { Logo: MongoDBLogo, name: "MongoDB" },
];

const serviceProviderTypes = [
  { icon: IconBuilding, label: "Hotels" },
  { icon: IconToolsKitchen2, label: "Restaurants" },
  { icon: IconUserCheck, label: "Travel Guides" },
  { icon: IconCar, label: "Vehicle Rentals" },
  { icon: IconPlane, label: "Flights" },
  { icon: IconTrain, label: "Trains" },
];

const journeySteps = [
  { step: "01", title: "Onboarding", desc: "Create your account and personalize travel preferences for tailored recommendations" },
  { step: "02", title: "Discovery", desc: "Explore curated destinations, accommodations, dining options, and transport services" },
  { step: "03", title: "Smart Planning", desc: "Generate AI-optimized itineraries balancing time, budget, and environmental impact" },
  { step: "04", title: "Unified Booking", desc: "Reserve hotels, transportation, and guides through a single streamlined checkout" },
  { step: "05", title: "Journey", desc: "Access live itineraries, digital tickets, maps, and real-time AI voice guidance" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background Elements */}
        <MorphingBlob className="w-[600px] h-[600px] bg-primary/5 top-0 left-1/4 -translate-x-1/2" />
        <MorphingBlob className="w-[500px] h-[500px] bg-teal-500/5 bottom-0 right-1/4 translate-x-1/2" />

        {/* Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.025]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-4xl mx-auto text-center z-10"
        >
          {/* Badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium mb-10">
              <IconLeaf size={16} className="text-primary" />
              <span className="text-foreground/80">Sustainable Travel Platform</span>
            </div>
          </Reveal>

          {/* Main Title */}
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
              Smarter Cities.
              <br />
              <AnimatedGradientText>Greener Travel.</AnimatedGradientText>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              A unified platform addressing city resource pressures by connecting 
              Travellers, Service Providers, and Administrators through intelligent travel planning.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/travel-ai">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-xl shadow-primary/20 flex items-center gap-2.5 transition-shadow hover:shadow-2xl hover:shadow-primary/30"
                >
                  <IconMicrophone size={18} />
                  Try AI Voice Guide
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-secondary border border-border font-medium flex items-center gap-2.5 hover:bg-muted transition-all hover:border-primary/20"
                >
                  Explore Destinations
                  <IconArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-9 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-2"
          >
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-primary" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.1}>
                <StatCounter {...stat} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ==================== VISION SECTION ==================== */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Orbital Ring */}
            <div className="flex justify-center order-2 lg:order-1">
              <EnhancedOrbitalRing 
                icons={serviceProviderTypes.map(s => s.icon)}
                size={360}
              />
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <Reveal>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-primary" />
                  <span className="text-primary font-medium text-sm uppercase tracking-widest">Our Vision</span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Optimizing Tourism for Sustainable Cities
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Our platform addresses growing pressures on city resources, transport networks, 
                  and logistic infrastructure by providing smart, sustainable travel planning solutions 
                  that benefit everyone in the ecosystem.
                </p>
              </Reveal>

              {/* Key Points */}
              <Reveal delay={0.2}>
                <div className="space-y-4">
                  {[
                    { icon: IconTarget, text: "Reduce city congestion through smart dispersal" },
                    { icon: IconWorld, text: "Connect travellers with verified local providers" },
                    { icon: IconChartBar, text: "Enable data-driven resource management" },
                  ].map((point, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <point.icon size={16} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">{point.text}</span>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== USER ROLES SECTION ==================== */}
      <section className="py-28 px-4 bg-muted/30 relative">
        <MorphingBlob className="w-[400px] h-[400px] bg-primary/3 top-1/4 right-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-primary font-medium text-sm uppercase tracking-widest">Platform Users</span>
                <div className="w-8 h-px bg-primary" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">Three Roles, One Ecosystem</h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {userRoles.map((role, index) => (
              <RoleCard key={role.title} {...role} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CORE FEATURES SECTION ==================== */}
      <section className="py-28 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-primary font-medium text-sm uppercase tracking-widest">Core Features</span>
                <div className="w-8 h-px bg-primary" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">City Resource Management</h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {coreFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ==================== TECH STACK SECTION ==================== */}
      <section className="py-28 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-primary font-medium text-sm uppercase tracking-widest">Technology</span>
              <div className="w-8 h-px bg-primary" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold mb-14">Built with Modern Stack</h2>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <Reveal key={tech.name} delay={0.15 + index * 0.08} direction="up">
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <tech.Logo />
                  <span className="font-medium">{tech.name}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== JOURNEY TIMELINE ==================== */}
      <section className="py-28 px-4 bg-muted/30 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-primary font-medium text-sm uppercase tracking-widest">Traveller Journey</span>
                <div className="w-8 h-px bg-primary" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">From Discovery to Destination</h2>
            </Reveal>
          </div>

          <div className="relative">
            {journeySteps.map((item, index) => (
              <TimelineStep 
                key={item.step} 
                {...item} 
                index={index}
                isLast={index === journeySteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-28 px-4">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <SpotlightCard className="relative p-12 md:p-16 rounded-3xl border border-border bg-gradient-to-br from-card to-background overflow-hidden">
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-[0.02]" 
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />
              
              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-8"
                >
                  <IconBulb size={30} className="text-primary" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Travel Smarter?
                </h2>
                <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                  Experience the future of sustainable travel planning with our AI-powered platform.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/travel-ai">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 flex items-center gap-2.5"
                    >
                      <IconMicrophone size={18} />
                      Start Voice Conversation
                    </motion.button>
                  </Link>
                  <Link to="/explore">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-full border border-border bg-background font-medium flex items-center gap-2.5 hover:bg-muted hover:border-primary/20 transition-all"
                    >
                      <IconMapPin size={18} />
                      Browse Destinations
                    </motion.button>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
