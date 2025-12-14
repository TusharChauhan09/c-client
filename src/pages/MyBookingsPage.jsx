import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  IconTicket,
  IconPlane,
  IconTrain,
  IconBus,
  IconCar,
  IconBuilding,
  IconToolsKitchen2,
  IconUserCheck,
  IconCalendar,
  IconMapPin,
  IconCopy,
  IconCheck,
  IconX,
  IconLoader2,
  IconArrowLeft,
  IconReceipt,
  IconClock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";

// Service icons map
const serviceIcons = {
  hotel: IconBuilding,
  flight: IconPlane,
  train: IconTrain,
  bus: IconBus,
  taxi: IconCar,
  restaurant: IconToolsKitchen2,
  guide: IconUserCheck,
};

// Status badge colors
const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function MyBookingsPage() {
  const { dbUser } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (dbUser?.clerkId) {
      fetchBookings();
    }
  }, [dbUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${dbUser.clerkId}`
      );
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const copyConfirmationCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Confirmation code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/cancel`,
        { reason: "Cancelled by user" }
      );
      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatBookingDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy");
  };

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <IconTicket size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view your bookings</h2>
          <p className="text-muted-foreground mb-4">Please sign in to access your booking history</p>
          <Link to="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <IconArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <IconTicket className="text-primary" size={28} />
                My Bookings
              </h1>
              <p className="text-muted-foreground text-sm">
                View and manage all your travel bookings
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "completed", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
                {status !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({bookings.filter((b) => b.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <IconLoader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <IconReceipt size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings found`}
            </p>
            <Link to="/explore">
              <Button>Explore Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredBookings.map((booking, index) => {
                const ServiceIcon = serviceIcons[booking.serviceType] || IconTicket;
                
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 h-32 md:h-auto relative">
                        {booking.serviceImage ? (
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <ServiceIcon size={40} className="text-primary/50" />
                          </div>
                        )}
                        <Badge
                          className={`absolute top-2 left-2 ${statusColors[booking.status]} border`}
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            {/* Service Type Badge */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <ServiceIcon size={14} className="text-primary" />
                              </div>
                              <span className="text-xs text-muted-foreground capitalize">
                                {booking.serviceType} Booking
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2">
                              {booking.serviceName}
                            </h3>

                            {/* Booking Details */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <IconCalendar size={14} />
                                Booked: {formatBookingDate(booking.bookingDate)}
                              </span>
                              {booking.bookingDetails?.checkInDate && (
                                <span className="flex items-center gap-1">
                                  <IconClock size={14} />
                                  Check-in: {formatBookingDate(booking.bookingDetails.checkInDate)}
                                </span>
                              )}
                              {booking.bookingDetails?.travelDate && (
                                <span className="flex items-center gap-1">
                                  <IconClock size={14} />
                                  Travel: {formatBookingDate(booking.bookingDetails.travelDate)}
                                </span>
                              )}
                            </div>

                            {/* Confirmation Code */}
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                              <span className="text-xs text-muted-foreground">
                                Confirmation:
                              </span>
                              <code className="text-sm font-mono font-semibold">
                                {booking.confirmationCode}
                              </code>
                              <button
                                onClick={() => copyConfirmationCode(booking.confirmationCode)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                {copiedCode === booking.confirmationCode ? (
                                  <IconCheck size={14} className="text-green-500" />
                                ) : (
                                  <IconCopy size={14} className="text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total Paid</p>
                              <p className="text-xl font-bold text-primary">
                                ₹{booking.totalPrice?.toLocaleString()}
                              </p>
                            </div>

                            {booking.status === "confirmed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                                onClick={() => cancelBooking(booking._id)}
                              >
                                <IconX size={14} className="mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
