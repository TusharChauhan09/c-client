import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { 
  IconSearch, 
  IconMapPin, 
  IconStar, 
  IconHeart,
  IconFilter,
  IconSparkles
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Beaches", "Mountains", "Cities", "Cultural", "Adventure"];

const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop",
    rating: 4.9,
    category: "Beaches",
    price: "₹45,000",
    description: "Tropical paradise with stunning temples"
  },
  {
    id: 2,
    name: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop",
    rating: 4.8,
    category: "Mountains",
    price: "₹1,20,000",
    description: "Majestic peaks and scenic villages"
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop",
    rating: 4.9,
    category: "Cities",
    price: "₹85,000",
    description: "Where tradition meets innovation"
  },
  {
    id: 4,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop",
    rating: 4.9,
    category: "Beaches",
    price: "₹95,000",
    description: "Iconic white and blue paradise"
  },
  {
    id: 5,
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&auto=format&fit=crop",
    rating: 4.8,
    category: "Cultural",
    price: "₹1,10,000",
    description: "Ancient Incan citadel in the clouds"
  },
  {
    id: 6,
    name: "New Zealand",
    image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&auto=format&fit=crop",
    rating: 4.9,
    category: "Adventure",
    price: "₹1,50,000",
    description: "Ultimate adventure destination"
  },
  {
    id: 7,
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop",
    rating: 4.9,
    category: "Beaches",
    price: "₹1,80,000",
    description: "Luxury overwater paradise"
  },
  {
    id: 8,
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop",
    rating: 4.7,
    category: "Cities",
    price: "₹1,00,000",
    description: "The city of love and lights"
  },
];

// Skeleton Card Component
const DestinationCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedDestinations, setLikedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id) => {
    setLikedDestinations(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <IconSparkles size={16} />
            Discover Places
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500">Destinations</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find your next adventure from our curated collection of breathtaking destinations
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            // Skeleton Loading State
            [...Array(8)].map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DestinationCardSkeleton />
              </motion.div>
            ))
          ) : (
            // Actual Destination Cards
            filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {/* Skeleton while image loads */}
                  {!loadedImages[dest.id] && (
                    <Skeleton className="absolute inset-0 rounded-none" />
                  )}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onLoad={() => handleImageLoad(dest.id)}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                      loadedImages[dest.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(dest.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all"
                  >
                    <IconHeart
                      size={18}
                      className={`transition-colors ${likedDestinations.includes(dest.id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                    />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                    {dest.category}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                    <IconStar size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-medium">{dest.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{dest.name}</h3>
                      <p className="text-xs text-muted-foreground">{dest.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <IconMapPin size={14} />
                      <span className="text-xs">View details</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{dest.price}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredDestinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <IconFilter size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
