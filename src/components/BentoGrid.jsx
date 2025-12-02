import { motion } from "motion/react";
import { IconArrowRight, IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BentoCard = ({ image, title, location, price, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`relative group overflow-hidden rounded-3xl ${className}`}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-white/80 text-sm">
          <IconMapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold">${price}</span>
          <span className="text-xs text-white/60"> / Person</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BentoGrid() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
        
        {/* Bali Island - Tall Vertical */}
        <BentoCard
          image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
          title="Bali Island"
          location="Bali, Indonesia"
          price="224"
          className="md:row-span-2"
          delay={0.1}
        />

        {/* Raja Ampat - Tall Vertical */}
        <BentoCard
          image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop"
          title="Raja Ampat"
          location="Papua, Indonesia"
          price="304"
          className="md:row-span-2"
          delay={0.2}
        />

        {/* Portland - Horizontal */}
        <BentoCard
          image="https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000&auto=format&fit=crop"
          title="Portland"
          location="Illinois, US"
          price="224"
          className="md:col-span-1"
          delay={0.3}
        />

        {/* Toledo Island - Horizontal */}
        <BentoCard
          image="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop"
          title="Toledo Island"
          location="Toledo, US"
          price="224"
          className="md:col-span-1"
          delay={0.4}
        />

        {/* Bottom Banner - Spanning 2 Columns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 bg-black rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-black to-black" />
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-white">100+</span>
              <span className="text-xl text-white/80">Top Destination</span>
            </div>
            <span className="text-xl text-white/80 block">In Global</span>
          </div>

          <Link to="/explore" className="relative z-10">
            <Button 
              variant="outline" 
              className="rounded-full bg-white text-black hover:bg-gray-200 border-none px-6 py-6 text-base font-medium group"
            >
              Explore Destination
              <IconArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
