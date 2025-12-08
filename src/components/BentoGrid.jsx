import { motion } from "motion/react";
import { IconArrowRight, IconMapPin, IconStar, IconHeart, IconSparkles, IconCompass } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const BentoCard = ({ image, title, location, rating, className, delay = 0, featured = false }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.4 }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${className}`}
    >
      {/* Border with hover effect */}
      <div className="absolute inset-0 rounded-2xl border border-border/50 group-hover:border-primary/40 transition-colors duration-300 z-10 pointer-events-none" />

      {/* Inner card */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-background">
        {/* Image */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
            <IconSparkles size={12} />
            Featured
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all duration-200"
        >
          <IconHeart
            size={18}
            className={`transition-colors duration-200 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
        </button>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <IconStar size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-medium">{rating}</span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">{title}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <IconMapPin size={14} className="text-primary" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <IconSparkles size={16} />
          Popular Destinations
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500">World</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover breathtaking destinations handpicked for unforgettable experiences
        </p>
      </motion.div>

      {/* Outer dashed border wrapper */}
      <div className="relative p-2 md:p-3 rounded-3xl border-2 border-dashed border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
          {/* Bali Island - Tall Vertical */}
          <BentoCard
            image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
            title="Bali Island"
            location="Indonesia"
            rating="4.9"
            featured
            className="md:col-span-1 md:row-span-2 h-[300px] md:h-[400px]"
            delay={0.1}
          />

          {/* Tuscany - Tall Vertical */}
          <BentoCard
            image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop"
            title="Tuscany"
            location="Italy"
            rating="4.8"
            className="md:col-span-1 md:row-span-2 h-[300px] md:h-[400px]"
            delay={0.15}
          />

          {/* Kyoto - Short */}
          <BentoCard
            image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop"
            title="Kyoto"
            location="Japan"
            rating="4.9"
            className="md:col-span-1 h-[150px] md:h-[195px]"
            delay={0.2}
          />

          {/* Venice - Short */}
          <BentoCard
            image="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1000&auto=format&fit=crop"
            title="Venice"
            location="Italy"
            rating="4.7"
            className="md:col-span-1 h-[150px] md:h-[195px]"
            delay={0.25}
          />

          {/* Bottom Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="md:col-span-2 h-[120px] relative group rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900" />
            
            <div className="relative h-full px-6 flex items-center justify-between">
              <div className="text-white">
                <p className="text-xl font-bold">Ready to explore?</p>
                <p className="text-sm text-white/60">Let AI plan your perfect adventure</p>
              </div>
              <Link to="/travel-ai">
                <Button className="bg-white text-emerald-900 hover:bg-white/90 rounded-full px-6 py-5 font-semibold shadow-xl">
                  Get Started <IconArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Santorini - Short */}
          <BentoCard
            image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop"
            title="Santorini"
            location="Greece"
            rating="4.9"
            className="md:col-span-1 h-[120px]"
            delay={0.35}
          />
        </div>
      </div>
    </section>
  );
}
