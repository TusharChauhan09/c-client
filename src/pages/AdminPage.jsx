import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconDashboard, 
  IconBuilding, 
  IconPlane, 
  IconTrain, 
  IconBus, 
  IconCar, 
  IconToolsKitchen2, 
  IconUserCheck, 
  IconCalendarEvent,
  IconUsers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconCheck,
  IconCurrencyRupee,
  IconTrendingUp,
  IconLoader2,
  IconRefresh,
  IconLock,
  IconHome,
  IconPhoto,
  IconUpload,
  IconArrowLeft,
  IconDotsVertical,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

// Tab configuration
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard },
  { id: "hotels", label: "Hotels", icon: IconBuilding },
  { id: "flights", label: "Flights", icon: IconPlane },
  { id: "trains", label: "Trains", icon: IconTrain },
  { id: "buses", label: "Buses", icon: IconBus },
  { id: "taxis", label: "Taxis", icon: IconCar },
  { id: "restaurants", label: "Restaurants", icon: IconToolsKitchen2 },
  { id: "guides", label: "Guides", icon: IconUserCheck },
  { id: "bookings", label: "Bookings", icon: IconCalendarEvent },
  { id: "users", label: "Users", icon: IconUsers },
];

// Access Denied Component
const AccessDenied = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <IconLock size={40} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access the admin dashboard. Only administrators can view this page.
        </p>
        <Button onClick={() => navigate("/")} className="gap-2">
          <IconHome size={16} />
          Go to Homepage
        </Button>
      </motion.div>
    </div>
  );
};

// Modern Stat Card Component
const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden bg-card rounded-2xl border border-border p-6 group hover:shadow-lg transition-all duration-300"
  >
    <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", gradient)} />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", gradient)}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>}
    </div>
  </motion.div>
);

// Image Upload Component
const ImageUploadField = ({ value, onChange, label }) => {
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Preview / Placeholder */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/20 border-2 border-dashed border-border/50 group">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => { setPreview(""); onChange(""); }}
                className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <IconTrash size={16} />
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <IconPhoto size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No image selected</p>
          </div>
        )}
      </div>
      
      {/* URL Input */}
      <div className="relative">
        <IconPhoto size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="Paste image URL here..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground">Tip: Use Unsplash, Pexels, or any direct image URL</p>
    </div>
  );
};


// Modern Data Table Component
const DataTable = ({ columns, data, onEdit, onDelete, onView, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <IconLoader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <IconSearch size={24} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No data found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.label}
              </th>
            ))}
            <th className="text-right py-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {data.map((row, idx) => (
            <motion.tr 
              key={row._id || idx} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="hover:bg-muted/30 transition-colors group"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-4 text-sm">
                  {col.render ? col.render(row[col.key], row) : row[col.key] || "-"}
                </td>
              ))}
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onView && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(row)}>
                      <IconEye size={15} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(row)}>
                    <IconEdit size={15} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(row._id)}>
                    <IconTrash size={15} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Modern Form Modal Component - Wide Layout
const FormModal = ({ isOpen, onClose, title, fields, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Separate image fields from other fields
  const imageFields = fields.filter(f => f.type === "image");
  const otherFields = fields.filter(f => f.type !== "image");
  const halfIndex = Math.ceil(otherFields.length / 2);
  const leftFields = otherFields.slice(0, halfIndex);
  const rightFields = otherFields.slice(halfIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-card to-card/95 backdrop-blur-sm px-8 py-5 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below</p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/50" onClick={onClose}>
            <IconX size={20} />
          </Button>
        </div>
        
        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-8">
            {/* Image Section */}
            {imageFields.length > 0 && (
              <div className="mb-8 pb-8 border-b border-border/50">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {imageFields.map((field) => (
                    <ImageUploadField
                      key={field.key}
                      value={formData[field.key]}
                      onChange={(val) => setFormData({ ...formData, [field.key]: val })}
                      label={field.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {/* Left Column */}
              <div className="space-y-5">
                {leftFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-destructive text-xs">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        required={field.required}
                      >
                        <option value="">Select...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] resize-none text-sm"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === "array" ? (
                      <input
                        type="text"
                        value={Array.isArray(formData[field.key]) ? formData[field.key].join(", ") : formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value.split(",").map(s => s.trim()) })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        placeholder="Comma separated values..."
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === "number" ? parseFloat(e.target.value) || "" : e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {rightFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-destructive text-xs">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        required={field.required}
                      >
                        <option value="">Select...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] resize-none text-sm"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === "array" ? (
                      <input
                        type="text"
                        value={Array.isArray(formData[field.key]) ? formData[field.key].join(", ") : formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value.split(",").map(s => s.trim()) })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        placeholder="Comma separated values..."
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === "number" ? parseFloat(e.target.value) || "" : e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Actions - Fixed Footer */}
          <div className="flex-shrink-0 bg-card border-t border-border/50 px-8 py-5 flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-11 px-6">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl h-11 px-8 min-w-[140px]" disabled={loading}>
              {loading ? (
                <>
                  <IconLoader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                initialData?._id ? "Save Changes" : "Create"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Field configurations for each service type
const serviceFields = {
  hotels: [
    { key: "name", label: "Hotel Name", required: true },
    { key: "image", label: "Cover Image", type: "image" },
    { key: "location", label: "Location", required: true },
    { key: "rating", label: "Rating (1-5)", type: "number" },
    { key: "price", label: "Price Display (e.g. ₹8,500/night)", required: true },
    { key: "priceValue", label: "Price Value (number only)", type: "number", required: true },
    { key: "amenities", label: "Amenities", type: "array" },
    { key: "greenScore", label: "Green/Eco Score" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  flights: [
    { key: "airline", label: "Airline Name", required: true },
    { key: "image", label: "Airline Logo", type: "image" },
    { key: "from", label: "Departure City", required: true },
    { key: "to", label: "Arrival City", required: true },
    { key: "departure", label: "Departure Time", required: true },
    { key: "arrival", label: "Arrival Time", required: true },
    { key: "duration", label: "Flight Duration", required: true },
    { key: "price", label: "Price Display", required: true },
    { key: "priceValue", label: "Price Value", type: "number", required: true },
    { key: "class", label: "Travel Class", type: "select", options: [
      { value: "Economy", label: "Economy" },
      { value: "Business", label: "Business" },
      { value: "First", label: "First Class" },
    ]},
    { key: "stops", label: "Stops (e.g. Non-stop, 1 Stop)" },
  ],
  trains: [
    { key: "name", label: "Train Name", required: true },
    { key: "image", label: "Train Image", type: "image" },
    { key: "trainNo", label: "Train Number", required: true },
    { key: "from", label: "Departure Station", required: true },
    { key: "to", label: "Arrival Station", required: true },
    { key: "departure", label: "Departure Time", required: true },
    { key: "arrival", label: "Arrival Time", required: true },
    { key: "duration", label: "Journey Duration", required: true },
    { key: "price", label: "Price Display", required: true },
    { key: "priceValue", label: "Price Value", type: "number", required: true },
    { key: "class", label: "Class" },
    { key: "availability", label: "Availability", type: "select", options: [
      { value: "Available", label: "Available" },
      { value: "RAC", label: "RAC" },
      { value: "Waitlist", label: "Waitlist" },
    ]},
  ],
  buses: [
    { key: "operator", label: "Bus Operator", required: true },
    { key: "image", label: "Bus Image", type: "image" },
    { key: "type", label: "Bus Type (AC Sleeper, etc.)", required: true },
    { key: "from", label: "Departure City", required: true },
    { key: "to", label: "Arrival City", required: true },
    { key: "departure", label: "Departure Time", required: true },
    { key: "arrival", label: "Arrival Time", required: true },
    { key: "duration", label: "Journey Duration", required: true },
    { key: "price", label: "Price Display", required: true },
    { key: "priceValue", label: "Price Value", type: "number", required: true },
    { key: "seats", label: "Available Seats", type: "number" },
    { key: "rating", label: "Rating", type: "number" },
  ],
  taxis: [
    { key: "type", label: "Vehicle Type (Sedan, SUV, etc.)", required: true },
    { key: "image", label: "Vehicle Image", type: "image" },
    { key: "model", label: "Vehicle Model", required: true },
    { key: "capacity", label: "Seating Capacity", required: true },
    { key: "pricePerKm", label: "Price Per Km", required: true },
    { key: "basePrice", label: "Base Price Display", required: true },
    { key: "basePriceValue", label: "Base Price Value", type: "number", required: true },
    { key: "features", label: "Features", type: "array" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "eco", label: "Eco-Friendly", type: "select", options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ]},
  ],
  restaurants: [
    { key: "name", label: "Restaurant Name", required: true },
    { key: "image", label: "Restaurant Image", type: "image" },
    { key: "cuisine", label: "Cuisine Type", required: true },
    { key: "location", label: "Location", required: true },
    { key: "rating", label: "Rating", type: "number" },
    { key: "priceRange", label: "Price Range (₹, ₹₹, ₹₹₹)", required: true },
    { key: "specialty", label: "Specialty Dish" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  guides: [
    { key: "name", label: "Guide Name", required: true },
    { key: "image", label: "Profile Photo", type: "image" },
    { key: "location", label: "Service Area", required: true },
    { key: "rating", label: "Rating", type: "number" },
    { key: "tours", label: "Tours Completed", type: "number" },
    { key: "specialty", label: "Specialty (Heritage, Adventure, etc.)" },
    { key: "languages", label: "Languages", type: "array" },
    { key: "price", label: "Price Display", required: true },
    { key: "priceValue", label: "Price Value", type: "number", required: true },
    { key: "priceUnit", label: "Price Unit (per day, per tour)" },
    { key: "description", label: "Bio", type: "textarea" },
  ],
};

// Column configurations with image support
const serviceColumns = {
  hotels: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconPhoto size={16} className="text-muted-foreground" /></div> },
    { key: "name", label: "Name", render: (v) => <span className="font-medium">{v}</span> },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating", render: (v) => v ? <span className="text-amber-500">★ {v.toFixed(1)}</span> : "-" },
    { key: "price", label: "Price" },
  ],
  flights: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconPlane size={16} className="text-muted-foreground" /></div> },
    { key: "airline", label: "Airline", render: (v) => <span className="font-medium">{v}</span> },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "price", label: "Price" },
    { key: "class", label: "Class", render: (v) => <Badge variant="outline">{v}</Badge> },
  ],
  trains: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconTrain size={16} className="text-muted-foreground" /></div> },
    { key: "name", label: "Name", render: (v) => <span className="font-medium">{v}</span> },
    { key: "trainNo", label: "Train No" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "availability", label: "Status", render: (v) => (
      <Badge variant={v === "Available" ? "default" : v === "RAC" ? "secondary" : "destructive"} className="text-xs">{v}</Badge>
    )},
  ],
  buses: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconBus size={16} className="text-muted-foreground" /></div> },
    { key: "operator", label: "Operator", render: (v) => <span className="font-medium">{v}</span> },
    { key: "type", label: "Type" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "price", label: "Price" },
  ],
  taxis: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconCar size={16} className="text-muted-foreground" /></div> },
    { key: "type", label: "Type", render: (v) => <span className="font-medium">{v}</span> },
    { key: "model", label: "Model" },
    { key: "capacity", label: "Capacity" },
    { key: "basePrice", label: "Base Price" },
    { key: "eco", label: "Eco", render: (v) => v === true || v === "true" ? <Badge className="bg-emerald-500">Eco</Badge> : null },
  ],
  restaurants: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><IconToolsKitchen2 size={16} className="text-muted-foreground" /></div> },
    { key: "name", label: "Name", render: (v) => <span className="font-medium">{v}</span> },
    { key: "cuisine", label: "Cuisine" },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating", render: (v) => v ? <span className="text-amber-500">★ {v.toFixed(1)}</span> : "-" },
    { key: "priceRange", label: "Price" },
  ],
  guides: [
    { key: "image", label: "", render: (v) => v ? <img src={v} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"><IconUserCheck size={16} className="text-muted-foreground" /></div> },
    { key: "name", label: "Name", render: (v) => <span className="font-medium">{v}</span> },
    { key: "location", label: "Area" },
    { key: "specialty", label: "Specialty" },
    { key: "rating", label: "Rating", render: (v) => v ? <span className="text-amber-500">★ {v.toFixed(1)}</span> : "-" },
    { key: "price", label: "Price" },
  ],
};

const bookingColumns = [
  { key: "confirmationCode", label: "Code", render: (v) => <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">{v}</span> },
  { key: "serviceName", label: "Service", render: (v) => <span className="font-medium">{v}</span> },
  { key: "serviceType", label: "Type", render: (v) => <Badge variant="outline" className="capitalize">{v}</Badge> },
  { key: "userName", label: "Customer" },
  { key: "totalPrice", label: "Amount", render: (v) => <span className="font-medium">₹{v?.toLocaleString()}</span> },
  { key: "status", label: "Status", render: (v) => (
    <Badge className={cn(
      "text-xs",
      v === "confirmed" && "bg-emerald-500",
      v === "pending" && "bg-amber-500",
      v === "cancelled" && "bg-destructive"
    )}>{v}</Badge>
  )},
];

// Role and Tier mappings
const roleLabels = { admin: "Admin", traveller: "Traveller", seller: "Service Provider" };
const tierLabels = { bronze: "Bronze", silver: "Silver", gold: "Gold" };

const userColumns = [
  { key: "avatar", label: "", render: (v) => v ? <img src={v} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-muted/50" /> },
  { key: "email", label: "Email", render: (v) => <span className="font-medium">{v}</span> },
  { key: "firstName", label: "Name", render: (v, row) => `${v || ""} ${row.lastName || ""}`.trim() || "-" },
  { key: "role", label: "Role", render: (v) => (
    <Badge variant={v === "admin" ? "default" : v === "seller" ? "outline" : "secondary"}>
      {roleLabels[v] || v}
    </Badge>
  )},
  { key: "subscriptionTier", label: "Tier", render: (v) => (
    <Badge className={cn(
      v === "gold" && "bg-amber-500",
      v === "silver" && "bg-slate-400",
      v === "bronze" && "bg-orange-600"
    )}>{tierLabels[v] || v}</Badge>
  )},
  { key: "standardCredits", label: "Credits" },
];

export default function AdminPage() {
  const { dbUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Check if user is admin
  const isAdmin = dbUser?.role === "admin";

  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Fetch data for current tab
  const fetchData = async () => {
    if (activeTab === "dashboard") {
      fetchStats();
      return;
    }

    setLoading(true);
    try {
      let url = "";
      if (activeTab === "bookings") {
        url = `${API_URL}/api/admin/bookings?page=${pagination.page}&search=${search}`;
      } else if (activeTab === "users") {
        url = `${API_URL}/api/admin/users?page=${pagination.page}&search=${search}`;
      } else {
        url = `${API_URL}/api/admin/services/${activeTab}?page=${pagination.page}&search=${search}`;
      }

      const res = await axios.get(url);
      setData(res.data.data);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: res.data.data?.length || 0 });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab !== "dashboard") {
        fetchData();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle create/update
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editItem?._id) {
        // Update
        let url = "";
        if (activeTab === "bookings") {
          url = `${API_URL}/api/admin/bookings/${editItem._id}`;
        } else if (activeTab === "users") {
          url = `${API_URL}/api/admin/users/${editItem._id}`;
        } else {
          url = `${API_URL}/api/admin/services/${activeTab}/${editItem._id}`;
        }
        await axios.put(url, formData);
        toast.success("Updated successfully");
      } else {
        // Create
        await axios.post(`${API_URL}/api/admin/services/${activeTab}`, formData);
        toast.success("Created successfully");
      }
      setModalOpen(false);
      setEditItem(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      let url = "";
      if (activeTab === "bookings") {
        url = `${API_URL}/api/admin/bookings/${id}`;
      } else if (activeTab === "users") {
        url = `${API_URL}/api/admin/users/${id}`;
      } else {
        url = `${API_URL}/api/admin/services/${activeTab}/${id}`;
      }
      await axios.delete(url);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete");
    }
  };

  // Get current columns and fields
  const getColumns = () => {
    if (activeTab === "bookings") return bookingColumns;
    if (activeTab === "users") return userColumns;
    return serviceColumns[activeTab] || [];
  };

  const getFields = () => {
    if (activeTab === "bookings") {
      return [
        { key: "status", label: "Status", type: "select", options: [
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "cancelled", label: "Cancelled" },
          { value: "completed", label: "Completed" },
        ]},
      ];
    }
    if (activeTab === "users") {
      return [
        { key: "role", label: "Role", type: "select", options: [
          { value: "traveller", label: "Traveller" },
          { value: "seller", label: "Service Provider" },
          { value: "admin", label: "Admin" },
        ]},
        { key: "subscriptionTier", label: "Subscription Tier", type: "select", options: [
          { value: "bronze", label: "Bronze" },
          { value: "silver", label: "Silver" },
          { value: "gold", label: "Gold" },
        ]},
        { key: "standardCredits", label: "AI Credits", type: "number" },
      ];
    }
    return serviceFields[activeTab] || [];
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Modern Sidebar */}
        <aside className="w-64 min-h-screen bg-card/50 backdrop-blur-sm border-r border-border/50 p-4 sticky top-0 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <IconArrowLeft size={16} />
              <span className="text-sm">Back to Site</span>
            </Link>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground mt-1">Manage your platform</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                  setPagination({ page: 1, pages: 1, total: 0 });
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-2">
              {dbUser?.avatar ? (
                <img src={dbUser.avatar} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium">{dbUser?.firstName?.[0]}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{dbUser?.firstName} {dbUser?.lastName}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {/* Dashboard View */}
            {activeTab === "dashboard" && stats && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
                  </div>
                  <Button variant="outline" onClick={fetchStats} className="gap-2 rounded-xl">
                    <IconRefresh size={16} />
                    Refresh
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <StatCard
                    title="Total Services"
                    value={stats.services.total}
                    icon={IconBuilding}
                    gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                    subtitle="Across all categories"
                  />
                  <StatCard
                    title="Total Bookings"
                    value={stats.bookings.totalBookings}
                    icon={IconCalendarEvent}
                    gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                    subtitle={`${stats.bookings.confirmedBookings} confirmed`}
                  />
                  <StatCard
                    title="Revenue"
                    value={`₹${(stats.bookings.totalRevenue || 0).toLocaleString()}`}
                    icon={IconCurrencyRupee}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                    subtitle="Total earnings"
                  />
                  <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={IconUsers}
                    gradient="bg-gradient-to-br from-orange-500 to-amber-500"
                    subtitle="Registered accounts"
                  />
                </div>

                {/* Services Grid */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-5">Services by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.entries(stats.services).filter(([k]) => k !== "total").map(([key, value]) => (
                      <motion.div 
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setActiveTab(key)}
                      >
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Booking Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  <div className="bg-card rounded-2xl border border-border/50 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">Confirmed Bookings</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.bookings.confirmedBookings}</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border/50 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium">Pending Bookings</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.bookings.pendingBookings}</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border/50 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Cancelled</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.bookings.cancelledBookings}</p>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                  </div>
                  <DataTable
                    columns={bookingColumns}
                    data={stats.recentBookings}
                    onEdit={(item) => {
                      setActiveTab("bookings");
                      setEditItem(item);
                      setModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              </motion.div>
            )}

            {/* Data List Views */}
            {activeTab !== "dashboard" && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10")}>
                      {currentTab && <currentTab.icon size={24} className="text-primary" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                      <p className="text-muted-foreground">{pagination.total} items total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-all"
                      />
                    </div>
                    
                    {/* Add Button */}
                    {!["bookings", "users", "dashboard"].includes(activeTab) && (
                      <Button onClick={() => { setEditItem(null); setModalOpen(true); }} className="gap-2 rounded-xl">
                        <IconPlus size={16} />
                        Add New
                      </Button>
                    )}
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <DataTable
                    columns={getColumns()}
                    data={data}
                    loading={loading}
                    onEdit={(item) => { setEditItem(item); setModalOpen(true); }}
                    onDelete={handleDelete}
                  />
                  
                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                          disabled={pagination.page <= 1}
                        >
                          <IconChevronLeft size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                          disabled={pagination.page >= pagination.pages}
                        >
                          <IconChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <FormModal
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditItem(null); }}
            title={editItem?._id ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
            fields={getFields()}
            initialData={editItem}
            onSubmit={handleSubmit}
            loading={formLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
