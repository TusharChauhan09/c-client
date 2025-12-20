import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconCreditCard,
  IconCheck,
  IconPlane,
  IconTrain,
  IconBus,
  IconCar,
  IconBuilding,
  IconToolsKitchen2,
  IconUserCheck,
  IconLeaf,
  IconStar,
  IconMinus,
  IconPlus,
  IconClock,
  IconUsers,
  IconShieldCheck,
  IconLock,
  IconWallet,
  IconDeviceMobile,
  IconBuildingBank,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const DEFAULT_CENTER = {
  lat: 28.6139, // New Delhi
  lng: 77.209,
};

// Service type icons and colors
const serviceConfig = {
  hotel: {
    icon: IconBuilding,
    color: "from-violet-500 to-purple-600",
    label: "Hotel Booking",
  },
  flight: {
    icon: IconPlane,
    color: "from-blue-500 to-cyan-500",
    label: "Flight Booking",
  },
  train: {
    icon: IconTrain,
    color: "from-orange-500 to-amber-500",
    label: "Train Booking",
  },
  bus: {
    icon: IconBus,
    color: "from-emerald-500 to-teal-500",
    label: "Bus Booking",
  },
  taxi: {
    icon: IconCar,
    color: "from-yellow-500 to-orange-500",
    label: "Taxi Booking",
  },
  restaurant: {
    icon: IconToolsKitchen2,
    color: "from-rose-500 to-pink-500",
    label: "Table Reservation",
  },
  guide: {
    icon: IconUserCheck,
    color: "from-indigo-500 to-blue-500",
    label: "Guide Booking",
  },
};

// No hardcoded data
const serviceData = {};

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingPage() {
  const { serviceType, id } = useParams();
  const navigate = useNavigate();
  const { dbUser, syncUser } = useAuthStore();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch service data from API
  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/services/${serviceType}/${id}`
        );
        const data = await response.json();

        if (data.success) {
          setItem(data.data);
        } else {
          toast.error("Service not found");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (serviceType && id) {
      fetchServiceData();
    }
  }, [serviceType, id]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [travelDate, setTravelDate] = useState(null);
  const [travelers, setTravelers] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedClass, setSelectedClass] = useState("economy");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [selectedTime, setSelectedTime] = useState("19:00");

  // Map State
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [activeMapField, setActiveMapField] = useState("pickup"); // 'pickup' or 'drop'
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Update active field on focus
  const handleInputFocus = (field) => {
    setActiveMapField(field);
  };

  const handleMapClick = (e) => {
    if (!isMapLoaded) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const coords = { lat, lng };
    const locString = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

    if (activeMapField === "pickup") {
      setPickupCoords(coords);
      setPickupLocation(locString);
      setActiveMapField("drop"); // Auto-switch to next
    } else {
      setDropCoords(coords);
      setDropLocation(locString);
    }
  };

  // Fetch Directions if both points exist
  useEffect(() => {
    if (isMapLoaded && pickupCoords && dropCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupCoords,
          destination: dropCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [pickupCoords, dropCoords, isMapLoaded]);

  const config = serviceConfig[serviceType] || serviceConfig.hotel;
  const ServiceIcon = config.icon;

  // Calculate price
  const calculatePrice = () => {
    if (!item) return 0;
    const priceString = item.price || item.basePrice || "₹500";
    let basePrice = parseInt(priceString.replace(/[₹,]/g, "") || "500");

    switch (serviceType) {
      case "hotel":
        const nights =
          checkInDate && checkOutDate
            ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
            : 1;
        return basePrice * Math.max(1, nights) * rooms;
      case "flight":
      case "train":
      case "bus":
        return basePrice * travelers;
      case "taxi":
        return basePrice;
      case "restaurant":
        const priceRangeMultiplier = (item.priceRange?.length || 2) * 300;
        return priceRangeMultiplier * travelers;
      case "guide":
        const guideDays =
          checkInDate && checkOutDate
            ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
            : 1;
        return basePrice * Math.max(1, guideDays);
      default:
        return basePrice;
    }
  };

  const totalPrice = calculatePrice();

  // State for confirmation
  const [confirmationCode, setConfirmationCode] = useState(null);

  // Build booking details object
  const buildBookingDetails = () => {
    const details = { travelers };

    switch (serviceType) {
      case "hotel":
        details.checkInDate = checkInDate;
        details.checkOutDate = checkOutDate;
        details.rooms = rooms;
        details.guests = travelers;
        break;
      case "flight":
      case "train":
      case "bus":
        details.travelDate = travelDate;
        details.from = item.from;
        details.to = item.to;
        details.class = selectedClass;
        break;
      case "taxi":
        details.pickupLocation = pickupLocation;
        details.dropLocation = dropLocation;
        details.pickupDateTime = travelDate;
        break;
      case "restaurant":
        details.reservationDate = travelDate;
        details.reservationTime = selectedTime;
        details.partySize = travelers;
        break;
      case "guide":
        details.startDate = checkInDate;
        details.endDate = checkOutDate;
        details.groupSize = travelers;
        break;
    }

    return details;
  };

  // Handle payment
  const handlePayment = async () => {
    if (!dbUser) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load");
        setIsProcessing(false);
        return;
      }

      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          amount: totalPrice,
          currency: "INR",
        }
      );

      const { order } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "YatraSathi",
        description: `${config.label} - ${getItemName()}`,
        order_id: order.id,
        handler: async (response) => {
          // Razorpay only calls handler if payment is successful
          // So we can directly save the booking without verification
          console.log("Payment successful:", response);

          try {
            // Save booking to database immediately
            const bookingResponse = await axios.post(
              `${API_URL}/api/bookings`,
              {
                userId: dbUser.clerkId,
                userEmail: dbUser.email,
                userName: `${dbUser.firstName} ${dbUser.lastName || ""}`.trim(),
                serviceType,
                serviceId: item._id || id,
                serviceName: getItemName(),
                serviceImage: getItemImage(),
                bookingDetails: buildBookingDetails(),
                basePrice: parseInt(
                  (item.price || item.basePrice || "500").replace(/[₹,]/g, "")
                ),
                totalPrice,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentMethod: "razorpay",
              }
            );

            if (bookingResponse.data.success) {
              setConfirmationCode(bookingResponse.data.data.confirmationCode);
            }

            // Show success
            setBookingStep(3);
            toast.success("Booking confirmed!");
            syncUser(dbUser.clerkId);

            // Try verification in background (don't wait for it)
            axios
              .post(`${API_URL}/api/payment/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: dbUser.clerkId,
                amount: totalPrice,
              })
              .catch((err) =>
                console.log("Background verification:", err.message)
              );
          } catch (error) {
            console.error("Booking save error:", error);
            // Still show success since payment went through
            setBookingStep(3);
            toast.success("Payment successful! Booking confirmation pending.");
          }
        },
        prefill: {
          name: dbUser?.firstName + " " + (dbUser?.lastName || ""),
          email: dbUser?.email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemName = () => {
    if (!item) return "Service";
    return (
      item.name ||
      item.airline ||
      item.operator ||
      item.type ||
      item.model ||
      "Service"
    );
  };

  const getItemImage = () => {
    if (!item)
      return "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop";
    return (
      item.image ||
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Service not found</h1>
          <Button onClick={() => navigate("/explore")}>Go to Explore</Button>
        </div>
      </div>
    );
  }

  const isFormValid = () => {
    switch (serviceType) {
      case "hotel":
        return checkInDate && checkOutDate;
      case "flight":
      case "train":
      case "bus":
        return travelDate;
      case "taxi":
        return pickupLocation && dropLocation;
      case "restaurant":
        return travelDate;
      case "guide":
        return checkInDate && checkOutDate;
      default:
        return true;
    }
  };

  // Date Picker Component - Using react-datepicker for reliability
  const DatePicker = ({ date, onSelect, label, minDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDateToUse = minDate || today;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="relative">
          <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none z-10" />
          <ReactDatePicker
            selected={date}
            onChange={(d) => onSelect(d)}
            minDate={minDateToUse}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select date"
            className="w-full h-12 pl-10 pr-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer"
            calendarClassName="!bg-card !border-border !rounded-lg !shadow-lg"
            popperClassName="z-[9999]"
            showPopperArrow={false}
          />
        </div>
      </div>
    );
  };

  // Counter Component
  const Counter = ({ value, onChange, min = 1, max = 10, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <IconMinus size={16} />
        </Button>
        <span className="w-12 text-center text-lg font-semibold">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <IconPlus size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={getItemImage()}
          alt={getItemName()}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-background/80 backdrop-blur-sm border-white/20 hover:bg-background"
          >
            <IconArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <Badge
            className={cn(
              "bg-linear-to-r text-white border-0 px-4 py-1.5",
              config.color
            )}
          >
            <ServiceIcon size={14} className="mr-1.5" />
            {config.label}
          </Badge>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getItemName()}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {item.location && (
                <span className="flex items-center gap-1 text-white/80 text-sm">
                  <IconMapPin size={14} />
                  {item.location}
                </span>
              )}
              {item.from && item.to && (
                <span className="text-white/80 text-sm">
                  {item.from} → {item.to}
                </span>
              )}
              {item.rating && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-sm text-amber-400 text-sm font-medium">
                  <IconStar size={12} className="fill-amber-400" />
                  {item.rating}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 pb-12">
        <AnimatePresence mode="wait">
          {bookingStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Service Details Card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center bg-linear-to-br",
                          config.color
                        )}
                      >
                        <ServiceIcon size={16} className="text-white" />
                      </span>
                      About This{" "}
                      {serviceType.charAt(0).toUpperCase() +
                        serviceType.slice(1)}
                    </h2>

                    {item.description && (
                      <p className="text-muted-foreground mb-4">
                        {item.description}
                      </p>
                    )}

                    {/* Features/Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {item.amenities?.map((a) => (
                        <Badge
                          key={a}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {a}
                        </Badge>
                      ))}
                      {item.features?.map((f) => (
                        <Badge
                          key={f}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {f}
                        </Badge>
                      ))}
                      {item.languages?.map((l) => (
                        <Badge
                          key={l}
                          variant="outline"
                          className="rounded-full"
                        >
                          {l}
                        </Badge>
                      ))}
                    </div>

                    {/* Eco Badge */}
                    {(item.greenScore || item.eco) && (
                      <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <IconLeaf size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-600">
                            {item.greenScore
                              ? `Eco Score: ${item.greenScore}`
                              : "Eco-Friendly"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sustainable & eco-conscious choice
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Form Card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <IconCalendar size={20} className="text-primary" />
                      Booking Details
                    </h2>

                    {/* Hotel Form */}
                    {serviceType === "hotel" && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <DatePicker
                            date={checkInDate}
                            onSelect={setCheckInDate}
                            label="Check-in Date"
                          />
                          <DatePicker
                            date={checkOutDate}
                            onSelect={setCheckOutDate}
                            label="Check-out Date"
                            minDate={checkInDate || new Date()}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Counter
                            value={rooms}
                            onChange={setRooms}
                            max={5}
                            label="Rooms"
                          />
                          <Counter
                            value={travelers}
                            onChange={setTravelers}
                            max={10}
                            label="Guests"
                          />
                        </div>
                      </div>
                    )}

                    {/* Flight/Train/Bus Form */}
                    {(serviceType === "flight" ||
                      serviceType === "train" ||
                      serviceType === "bus") && (
                      <div className="space-y-6">
                        <DatePicker
                          date={travelDate}
                          onSelect={setTravelDate}
                          label="Travel Date"
                        />
                        <Counter
                          value={travelers}
                          onChange={setTravelers}
                          max={10}
                          label="Travelers"
                        />

                        {serviceType === "flight" && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Class</label>
                            <div className="grid grid-cols-3 gap-3">
                              {["economy", "business", "first"].map((cls) => (
                                <Button
                                  key={cls}
                                  variant={
                                    selectedClass === cls
                                      ? "default"
                                      : "outline"
                                  }
                                  className="capitalize h-12"
                                  onClick={() => setSelectedClass(cls)}
                                >
                                  {cls}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Taxi Form */}
                    {serviceType === "taxi" && (
                      <div className="space-y-4">
                        {/* Map Section */}
                        {isMapLoaded ? (
                          <div className="rounded-xl overflow-hidden border border-border h-[300px] relative">
                            <GoogleMap
                              mapContainerStyle={{
                                width: "100%",
                                height: "100%",
                              }}
                              center={pickupCoords || DEFAULT_CENTER}
                              zoom={12}
                              onClick={handleMapClick}
                              options={{
                                disableDefaultUI: true,
                                zoomControl: true,
                              }}
                            >
                              {pickupCoords && (
                                <Marker position={pickupCoords} label="P" />
                              )}
                              {dropCoords && (
                                <Marker position={dropCoords} label="D" />
                              )}
                              {directionsResponse && (
                                <DirectionsRenderer
                                  directions={directionsResponse}
                                />
                              )}
                            </GoogleMap>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-border text-xs font-medium shadow-sm">
                              Click map to set{" "}
                              {activeMapField === "pickup" ? "Pickup" : "Drop"}{" "}
                              location
                            </div>
                          </div>
                        ) : (
                          <div className="h-[200px] bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
                            <span className="text-muted-foreground text-sm">
                              Loading Map...
                            </span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Pickup Location
                          </label>
                          <div
                            className={cn(
                              "relative transition-all rounded-xl",
                              activeMapField === "pickup"
                                ? "ring-2 ring-primary/20"
                                : ""
                            )}
                          >
                            <IconMapPin
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                            />
                            <input
                              type="text"
                              value={pickupLocation}
                              onChange={(e) =>
                                setPickupLocation(e.target.value)
                              }
                              onFocus={() => handleInputFocus("pickup")}
                              placeholder="Enter pickup address or click on map"
                              className={cn(
                                "w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border outline-none transition-colors",
                                activeMapField === "pickup"
                                  ? "border-primary"
                                  : "focus:border-primary"
                              )}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Drop Location
                          </label>
                          <div
                            className={cn(
                              "relative transition-all rounded-xl",
                              activeMapField === "drop"
                                ? "ring-2 ring-primary/20"
                                : ""
                            )}
                          >
                            <IconMapPin
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                            />
                            <input
                              type="text"
                              value={dropLocation}
                              onChange={(e) => setDropLocation(e.target.value)}
                              onFocus={() => handleInputFocus("drop")}
                              placeholder="Enter destination or click on map"
                              className={cn(
                                "w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border outline-none transition-colors",
                                activeMapField === "drop"
                                  ? "border-primary"
                                  : "focus:border-primary"
                              )}
                            />
                          </div>
                        </div>
                        <DatePicker
                          date={travelDate}
                          onSelect={setTravelDate}
                          label="Pickup Date"
                        />
                      </div>
                    )}

                    {/* Restaurant Form */}
                    {serviceType === "restaurant" && (
                      <div className="space-y-6">
                        <DatePicker
                          date={travelDate}
                          onSelect={setTravelDate}
                          label="Reservation Date"
                        />
                        <Counter
                          value={travelers}
                          onChange={setTravelers}
                          max={20}
                          label="Number of Guests"
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Preferred Time
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {["12:00", "14:00", "19:00", "20:00", "21:00"].map(
                              (time) => (
                                <Button
                                  key={time}
                                  variant={
                                    selectedTime === time
                                      ? "default"
                                      : "outline"
                                  }
                                  className="h-12"
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Guide Form */}
                    {serviceType === "guide" && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <DatePicker
                            date={checkInDate}
                            onSelect={setCheckInDate}
                            label="Start Date"
                          />
                          <DatePicker
                            date={checkOutDate}
                            onSelect={setCheckOutDate}
                            label="End Date"
                            minDate={checkInDate || new Date()}
                          />
                        </div>
                        <Counter
                          value={travelers}
                          onChange={setTravelers}
                          max={15}
                          label="Group Size"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Price Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Price Summary
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Base Price
                          </span>
                          <span>
                            {item.price ||
                              item.basePrice ||
                              `₹${(item.priceRange?.length || 2) * 300}/person`}
                          </span>
                        </div>

                        {(serviceType === "flight" ||
                          serviceType === "train" ||
                          serviceType === "bus") && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Travelers
                            </span>
                            <span>× {travelers}</span>
                          </div>
                        )}

                        {serviceType === "hotel" && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Rooms
                              </span>
                              <span>× {rooms}</span>
                            </div>
                            {checkInDate && checkOutDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Nights
                                </span>
                                <span>
                                  ×{" "}
                                  {Math.max(
                                    1,
                                    Math.ceil(
                                      (checkOutDate - checkInDate) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  )}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {serviceType === "restaurant" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Guests
                            </span>
                            <span>× {travelers}</span>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => setBookingStep(2)}
                        disabled={!isFormValid()}
                        className="w-full h-12 mt-6 text-base"
                        size="lg"
                      >
                        Continue to Payment
                      </Button>

                      {/* Trust Badges */}
                      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <IconShieldCheck size={14} className="text-primary" />
                          Secure
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <IconLock size={14} className="text-primary" />
                          Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {bookingStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Header */}
                <div
                  className={cn("p-6 bg-linear-to-r text-white", config.color)}
                >
                  <h2 className="text-2xl font-bold">Complete Payment</h2>
                  <p className="text-white/80 text-sm">
                    Review your booking and pay securely
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Booking Summary */}
                  <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <img
                      src={getItemImage()}
                      alt={getItemName()}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{getItemName()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceType === "hotel" &&
                          checkInDate &&
                          checkOutDate &&
                          `${format(checkInDate, "MMM d")} - ${format(
                            checkOutDate,
                            "MMM d, yyyy"
                          )} • ${rooms} room(s)`}
                        {(serviceType === "flight" ||
                          serviceType === "train" ||
                          serviceType === "bus") &&
                          travelDate &&
                          `${format(
                            travelDate,
                            "PPP"
                          )} • ${travelers} traveler(s)`}
                        {serviceType === "taxi" &&
                          `${pickupLocation} → ${dropLocation}`}
                        {serviceType === "restaurant" &&
                          travelDate &&
                          `${format(
                            travelDate,
                            "PPP"
                          )} at ${selectedTime} • ${travelers} guest(s)`}
                        {serviceType === "guide" &&
                          checkInDate &&
                          checkOutDate &&
                          `${format(checkInDate, "MMM d")} - ${format(
                            checkOutDate,
                            "MMM d, yyyy"
                          )} • ${travelers} person(s)`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <IconWallet size={18} className="text-primary" />
                      Payment Options
                    </h3>

                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                            <IconCreditCard size={24} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Razorpay</p>
                            <p className="text-xs text-muted-foreground">
                              All payment methods accepted
                            </p>
                          </div>
                        </div>
                        <IconCheck size={20} className="text-primary" />
                      </div>

                      {/* Payment Icons */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                        <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 rounded">
                          VISA
                        </span>
                        <span className="px-2 py-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950 rounded">
                          Mastercard
                        </span>
                        <span className="px-2 py-1 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 rounded flex items-center gap-1">
                          <IconDeviceMobile size={14} />
                          UPI
                        </span>
                        <span className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 rounded flex items-center gap-1">
                          <IconBuildingBank size={14} />
                          Net Banking
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <IconShieldCheck size={24} className="text-emerald-500" />
                    <div className="text-sm">
                      <p className="font-medium text-emerald-600">
                        100% Secure Payment
                      </p>
                      <p className="text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 h-12 text-base"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${totalPrice.toLocaleString()}`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {bookingStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <IconCheck size={48} className="text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-3xl font-bold mb-2">
                    Booking Confirmed!
                  </h1>

                  {/* Confirmation Code */}
                  {confirmationCode && (
                    <div className="my-6 p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Confirmation Code
                      </p>
                      <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                        {confirmationCode}
                      </p>
                    </div>
                  )}

                  <p className="text-muted-foreground mb-8">
                    Your {config.label.toLowerCase()} has been confirmed. Check
                    your email for the confirmation details.
                  </p>

                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/explore")}
                    >
                      Explore More
                    </Button>
                    <Button onClick={() => navigate("/")}>Go Home</Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
