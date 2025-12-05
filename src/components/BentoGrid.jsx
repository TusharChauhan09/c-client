import { motion } from "motion/react";
import { IconArrowRight, IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BentoCard = ({ image, title, location, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`relative group overflow-hidden rounded-[32px] ${className}`}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    
    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
      <div className="text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <div className="flex items-center gap-1 text-white/90 text-xs">
          <IconMapPin size={14} />
          <span>{location}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BentoGrid() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Bali Island - Tall Vertical (Row 1-2) */}
        <BentoCard
          image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
          title="Bali Island"
          location="Bali, Indonesia"
          className="md:col-span-1 md:row-span-2 h-[300px] md:h-[320px]"
          delay={0.1}
        />

        {/* Raja Ampat - Tall Vertical (Row 1-2) */}
        <BentoCard
          image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop"
          title="Raja Empat"
          location="Papua, Indonesia"
          className="md:col-span-1 md:row-span-2 h-[300px] md:h-[320px]"
          delay={0.2}
        />

        {/* Portland - Short Horizontal (Row 1) */}
        <BentoCard
          image="https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000&auto=format&fit=crop"
          title="Portland"
          location="Illinois, US"
          className="md:col-span-1 h-[140px] md:h-[150px]"
          delay={0.3}
        />

        {/* Toledo Island - Tall Vertical (Row 2-3) */}
        <BentoCard
          image="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop"
          title="Toledo Island"
          location="Toledo, US"
          className="md:col-span-1 md:row-span-2 h-[240px] md:h-[250px]"
          delay={0.4}
        />

        {/* Bottom Banner - Spanning 2 Columns (Row 3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 bg-black rounded-[32px] p-6 flex items-center justify-between relative overflow-hidden h-[80px]"
        >
          <div className="relative z-10 flex items-center gap-4">
            <span className="text-5xl font-bold text-white">100+</span>
            <div className="flex flex-col">
              <span className="text-sm text-white/90">Top Destination</span>
              <span className="text-xs text-white/70">In Global</span>
            </div>
          </div>

          <Link to="/explore" className="relative z-10">
            <Button 
              variant="secondary" 
              className="rounded-full bg-white text-black hover:bg-gray-200 border-none px-6 h-10 text-sm font-medium group"
            >
              Explore Destination
              <IconArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
