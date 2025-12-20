import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  IconSearch,
  IconMapPin,
  IconStar,
  IconHeart,
  IconFilter,
  IconSparkles,
  IconPlane,
  IconTrain,
  IconBus,
  IconCar,
  IconBuilding,
  IconToolsKitchen2,
  IconUserCheck,
  IconWorld,
  IconClock,
  IconUsers,
  IconArrowRight,
  IconCalendar,
  IconLeaf,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

// ============================================================
// SERVICE CATEGORIES - Based on Project Overview
// ============================================================

const serviceCategories = [
  { id: "destinations", label: "Destinations", icon: IconWorld },
  { id: "hotels", label: "Hotels", icon: IconBuilding },
  { id: "flights", label: "Flights", icon: IconPlane },
  { id: "trains", label: "Trains", icon: IconTrain },
  { id: "buses", label: "Buses", icon: IconBus },
  { id: "taxis", label: "Taxis", icon: IconCar },
  { id: "restaurants", label: "Restaurants", icon: IconToolsKitchen2 },
  { id: "guides", label: "Travel Guides", icon: IconUserCheck },
];

// ============================================================
// SAMPLE DATA
// ============================================================

// ============================================================
// DATA FETCHED FROM API
// ============================================================

// ============================================================
// SKELETON COMPONENTS
// ============================================================

const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

const TransportSkeleton = () => (
  <div className="rounded-xl bg-card border border-border p-5">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-1 flex-1" />
      <Skeleton className="h-10 w-24" />
    </div>
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

// ============================================================
// CARD COMPONENTS
// ============================================================

// Destination Card
const DestinationCard = ({
  dest,
  isLiked,
  onToggleLike,
  onImageLoad,
  isImageLoaded,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
  >
    <div className="relative h-48 overflow-hidden">
      {!isImageLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={dest.image}
        alt={dest.name}
        onLoad={onImageLoad}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <button
        onClick={onToggleLike}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all"
      >
        <IconHeart
          size={18}
          className={`transition-colors ${
            isLiked ? "text-red-500 fill-red-500" : "text-white"
          }`}
        />
      </button>

      {/* Green Score Badge */}
      {dest.greenScore && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
          <IconLeaf size={12} />
          {dest.greenScore}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
        <IconStar size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-white text-xs font-medium">{dest.rating}</span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold mb-1">{dest.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{dest.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">{dest.category}</span>
        <span className="text-sm font-semibold text-primary">{dest.price}</span>
      </div>
    </div>
  </motion.div>
);

// Hotel Card
const HotelCard = ({ hotel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {hotel.greenScore && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
          <IconLeaf size={12} />
          {hotel.greenScore}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
        <IconStar size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-white text-xs font-medium">{hotel.rating}</span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold mb-1">{hotel.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <IconMapPin size={12} />
        {hotel.location}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {hotel.amenities?.map((a) => (
          <span
            key={a}
            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
          >
            {a}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Per night</span>
        <span className="text-sm font-semibold text-primary">
          {hotel.price}
        </span>
      </div>
    </div>
  </motion.div>
);

// Flight Card
const FlightCard = ({ flight }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all p-5 hover:shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold">{flight.airline}</h3>
        <span className="text-xs text-muted-foreground">{flight.class}</span>
      </div>
      <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
        {flight.stops}
      </span>
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="text-center">
        <div className="text-lg font-bold">{flight.departure}</div>
        <div className="text-xs text-muted-foreground">{flight.from}</div>
      </div>
      <div className="flex-1 relative">
        <div className="h-px bg-border" />
        <IconPlane
          size={16}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary bg-card px-1"
        />
        <div className="text-center text-xs text-muted-foreground mt-1">
          {flight.duration}
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">{flight.arrival}</div>
        <div className="text-xs text-muted-foreground">{flight.to}</div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border">
      <span className="text-lg font-bold text-primary">{flight.price}</span>
      <span className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
        Book Now
      </span>
    </div>
  </motion.div>
);

// Train Card
const TrainCard = ({ train }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all p-5 hover:shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold">{train.name}</h3>
        <span className="text-xs text-muted-foreground">
          #{train.trainNo} | {train.class}
        </span>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${
          train.availability === "Available"
            ? "bg-emerald-500/10 text-emerald-600"
            : train.availability === "RAC"
            ? "bg-amber-500/10 text-amber-600"
            : "bg-red-500/10 text-red-600"
        }`}
      >
        {train.availability}
      </span>
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="text-center">
        <div className="text-lg font-bold">{train.departure}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">
          {train.from}
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-px bg-border" />
        <IconTrain
          size={16}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary bg-card px-1"
        />
        <div className="text-center text-xs text-muted-foreground mt-1">
          {train.duration}
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">{train.arrival}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">
          {train.to}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border">
      <span className="text-lg font-bold text-primary">{train.price}</span>
      <span className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
        Book Now
      </span>
    </div>
  </motion.div>
);

// Bus Card
const BusCard = ({ bus }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all p-5 hover:shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold">{bus.operator}</h3>
        <span className="text-xs text-muted-foreground">{bus.type}</span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        <IconStar size={12} className="text-amber-400 fill-amber-400" />
        <span>{bus.rating}</span>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="text-center">
        <div className="text-lg font-bold">{bus.departure}</div>
        <div className="text-xs text-muted-foreground">{bus.from}</div>
      </div>
      <div className="flex-1 relative">
        <div className="h-px bg-border" />
        <IconBus
          size={16}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary bg-card px-1"
        />
        <div className="text-center text-xs text-muted-foreground mt-1">
          {bus.duration}
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">{bus.arrival}</div>
        <div className="text-xs text-muted-foreground">{bus.to}</div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div>
        <span className="text-lg font-bold text-primary">{bus.price}</span>
        <span className="text-xs text-muted-foreground ml-2">
          {bus.seats} seats left
        </span>
      </div>
      <span className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
        Book Now
      </span>
    </div>
  </motion.div>
);

// Taxi Card
const TaxiCard = ({ taxi }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
  >
    <div className="relative h-40 overflow-hidden">
      <img
        src={taxi.image}
        alt={taxi.model}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {taxi.eco && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
          <IconLeaf size={12} />
          Eco-friendly
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
        <IconStar size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-white text-xs font-medium">{taxi.rating}</span>
      </div>
    </div>

    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{taxi.type}</h3>
          <p className="text-xs text-muted-foreground">{taxi.model}</p>
        </div>
        <span className="text-xs text-muted-foreground">{taxi.capacity}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {taxi.features?.map((f) => (
          <span
            key={f}
            className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Base: {taxi.basePrice} + {taxi.pricePerKm}/km
        </div>
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
          Book
        </button>
      </div>
    </div>
  </motion.div>
);

// Restaurant Card
const RestaurantCard = ({ restaurant }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
        <IconStar size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-white text-xs font-medium">
          {restaurant.rating}
        </span>
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
        {restaurant.priceRange}
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold mb-1">{restaurant.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
        <IconMapPin size={12} />
        {restaurant.location}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-primary font-medium">
          {restaurant.cuisine}
        </span>
        <span className="text-xs text-muted-foreground">
          {restaurant.specialty}
        </span>
      </div>
    </div>
  </motion.div>
);

// Guide Card
const GuideCard = ({ guide }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="rounded-2xl bg-card border border-border hover:border-primary/30 transition-all p-5 hover:shadow-lg"
  >
    <div className="flex items-start gap-4 mb-4">
      <img
        src={guide.image}
        alt={guide.name}
        className="w-16 h-16 rounded-full bg-muted"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{guide.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <IconMapPin size={12} />
          {guide.location}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <IconStar size={12} className="text-amber-400 fill-amber-400" />
            {guide.rating}
          </div>
          <span className="text-xs text-muted-foreground">
            {guide.tours} tours
          </span>
        </div>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-xs text-primary font-medium mb-2">{guide.specialty}</p>
      <div className="flex flex-wrap gap-1">
        {guide.languages?.map((lang) => (
          <span
            key={lang}
            className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div>
        <span className="text-lg font-bold text-primary">{guide.price}</span>
        <span className="text-xs text-muted-foreground">{guide.priceUnit}</span>
      </div>
      <button className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Contact
      </button>
    </div>
  </motion.div>
);

// ============================================================
// DESTINATION SUGGESTIONS DATA
// ============================================================

const allDestinations = [
  // India - Popular
  "Goa",
  "Manali",
  "Jaipur",
  "Kerala",
  "Ladakh",
  "Udaipur",
  "Rishikesh",
  "Varanasi",
  "Shimla",
  "Darjeeling",
  "Agra",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Lucknow",
  "Chandigarh",
  "Amritsar",
  // India - Hill Stations
  "Ooty",
  "Munnar",
  "Kodaikanal",
  "Nainital",
  "Mussoorie",
  "Mount Abu",
  "Coorg",
  "Lonavala",
  // India - Beaches
  "Andaman Islands",
  "Lakshadweep",
  "Pondicherry",
  "Gokarna",
  "Kovalam",
  "Varkala",
  // India - Heritage
  "Hampi",
  "Khajuraho",
  "Ajanta Ellora",
  "Mysore",
  "Jodhpur",
  "Pushkar",
  "Ranthambore",
  // International - Asia
  "Singapore",
  "Sri Lanka",
  "Thailand",
  "Bali",
  "Malaysia",
  "Vietnam",
  "Cambodia",
  "Dubai",
  "Abu Dhabi",
  "Maldives",
  "Nepal",
  "Bhutan",
  "Japan",
  "South Korea",
  // International - Europe
  "Paris",
  "London",
  "Rome",
  "Barcelona",
  "Amsterdam",
  "Switzerland",
  "Greece",
  "Italy",
  "Germany",
  "Austria",
  "Prague",
  "Budapest",
  "Iceland",
  "Norway",
  // International - Americas
  "New York",
  "Los Angeles",
  "San Francisco",
  "Las Vegas",
  "Miami",
  "Canada",
  "Mexico",
  "Brazil",
  "Peru",
  "Argentina",
  // International - Others
  "Australia",
  "New Zealand",
  "Egypt",
  "South Africa",
  "Morocco",
  "Turkey",
];

export default function ExplorePage() {
  const [activeService, setActiveService] = useState("destinations");
  const [likedDestinations, setLikedDestinations] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/services/${activeService}`;

        if (searchQuery) {
          url = `${API_URL}/api/services/${activeService}/search?query=${encodeURIComponent(
            searchQuery
          )}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeService, searchQuery]);

  // Destination Search with Suggestions
  const [toLocation, setToLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Filter suggestions based on starting letters
  const filteredSuggestions =
    toLocation.length > 0
      ? allDestinations
          .filter((dest) =>
            dest.toLowerCase().startsWith(toLocation.toLowerCase())
          )
          .slice(0, 8) // Limit to 8 suggestions
      : [];

  const handleInputChange = (e) => {
    setToLocation(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (destination) => {
    setToLocation(destination);
    setSearchQuery(destination);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectSuggestion(filteredSuggestions[selectedIndex]);
      } else {
        setSearchQuery(toLocation);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const toggleLike = (id) => {
    setLikedDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const renderContent = () => {
    switch (activeService) {
      case "destinations":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : services.map((dest) => (
                    <DestinationCard
                      key={dest._id}
                      dest={dest}
                      isLiked={likedDestinations.includes(dest._id)}
                      onToggleLike={() => toggleLike(dest._id)}
                      onImageLoad={() => handleImageLoad(dest._id)}
                      isImageLoaded={loadedImages[dest._id]}
                    />
                  ))}
            </AnimatePresence>
          </div>
        );

      case "hotels":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : services.map((hotel) => (
                    <Link key={hotel._id} to={`/booking/hotel/${hotel._id}`}>
                      <HotelCard hotel={hotel} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "flights":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <TransportSkeleton key={i} />)
                : services.map((flight) => (
                    <Link key={flight._id} to={`/booking/flight/${flight._id}`}>
                      <FlightCard flight={flight} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "trains":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <TransportSkeleton key={i} />)
                : services.map((train) => (
                    <Link key={train._id} to={`/booking/train/${train._id}`}>
                      <TrainCard train={train} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "buses":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <TransportSkeleton key={i} />)
                : services.map((bus) => (
                    <Link key={bus._id} to={`/booking/bus/${bus._id}`}>
                      <BusCard bus={bus} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "taxis":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : services.map((taxi) => (
                    <Link key={taxi._id} to={`/booking/taxi/${taxi._id}`}>
                      <TaxiCard taxi={taxi} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "restaurants":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : services.map((restaurant) => (
                    <Link
                      key={restaurant._id}
                      to={`/booking/restaurant/${restaurant._id}`}
                    >
                      <RestaurantCard restaurant={restaurant} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      case "guides":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : services.map((guide) => (
                    <Link key={guide._id} to={`/booking/guide/${guide._id}`}>
                      <GuideCard guide={guide} />
                    </Link>
                  ))}
            </AnimatePresence>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <IconSparkles size={16} />
            Discover Services
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500">
              Everything
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find destinations, book transport, reserve hotels, and hire guides —
            all in one place
          </p>
        </motion.div>

        {/* Destination Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            {/* Search Input with Autocomplete */}
            <div className="relative">
              <IconSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
              />
              <input
                type="text"
                placeholder="Where do you want to travel?"
                value={toLocation}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() =>
                  toLocation.length > 0 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 pr-20 py-4 rounded-2xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base shadow-sm"
              />
              {toLocation && (
                <button
                  onClick={() => {
                    setToLocation("");
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                >
                  Clear
                </button>
              )}

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {filteredSuggestions.map((suggestion, index) => {
                        // Highlight matching text (always at start since we use startsWith)
                        const matchedPart = suggestion.slice(
                          0,
                          toLocation.length
                        );
                        const remainingPart = suggestion.slice(
                          toLocation.length
                        );

                        return (
                          <button
                            key={suggestion}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              index === selectedIndex
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <IconMapPin
                              size={16}
                              className={
                                index === selectedIndex
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }
                            />
                            <span>
                              <span className="font-semibold text-primary">
                                {matchedPart}
                              </span>
                              {remainingPart}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2 border-t border-border bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        Use ↑↓ to navigate, Enter to select, Esc to close
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Popular Destinations Quick Select */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-muted-foreground mr-1">
                Popular:
              </span>
              {[
                "Goa",
                "Manali",
                "Jaipur",
                "Kerala",
                "Ladakh",
                "Udaipur",
                "Rishikesh",
                "Varanasi",
              ].map((dest) => (
                <button
                  key={dest}
                  onClick={() => {
                    setToLocation(dest);
                    setShowSuggestions(false);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                    toLocation === dest
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted hover:bg-primary/10 hover:text-primary border-border hover:border-primary/30"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Service Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeService === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveService(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Integrated Logistics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-emerald-500/10 to-teal-500/10 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <IconLeaf size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Integrated Logistics</p>
                <p className="text-sm text-muted-foreground">
                  Book Train → Taxi → Hotel in one seamless flow. Reduce your
                  carbon footprint.
                </p>
              </div>
            </div>
            <Link
              to={`/travel-ai${
                toLocation
                  ? `?destination=${encodeURIComponent(
                      toLocation
                    )}&context=${encodeURIComponent(
                      `I want to plan a trip to ${toLocation}. Help me with train, taxi, and hotel bookings for an eco-friendly journey.`
                    )}`
                  : ""
              }`}
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                Plan with AI
                <IconArrowRight size={16} />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
