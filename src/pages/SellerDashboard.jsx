import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Store,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  Plane,
  Utensils,
  Car,
  UserCheck,
} from "lucide-react";

// You might need to adjust this based on your API structure
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SellerDashboard = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("apply");
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    serviceLocation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchApplicationStatus();
    }
  }, [isLoaded, user]);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/seller/status`, {
        params: { clerkId: user.id },
      });
      if (res.data.success) {
        setApplicationStatus(res.data.request);
        if (res.data.request) {
          setActiveTab("status");
        }
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, businessType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessType) {
      toast.error("Please select a business type.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/seller/request`, {
        clerkId: user.id,
        ...formData,
      });

      if (res.data.success) {
        toast.success("Application submitted successfully!");
        setApplicationStatus(res.data.request);
        setActiveTab("status");
        setFormData({
          businessName: "",
          businessType: "",
          description: "",
          serviceLocation: "",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "rejected":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5" />;
      case "rejected":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground">
            Apply to become a verified seller and list your services on our
            platform.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="apply">Apply</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="apply">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Partner Application</CardTitle>
                    <CardDescription>
                      Fill out the form below to request seller access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applicationStatus?.status === "pending" ||
                    applicationStatus?.status === "approved" ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div
                          className={`p-4 rounded-full ${getStatusColor(
                            applicationStatus.status
                          )} bg-opacity-20`}
                        >
                          {getStatusIcon(applicationStatus.status)}
                        </div>
                        <h3 className="text-xl font-semibold">
                          Application{" "}
                          {applicationStatus.status.charAt(0).toUpperCase() +
                            applicationStatus.status.slice(1)}
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          You already have an active application. Please check
                          the Status tab for updates.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("status")}
                        >
                          View Status
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <div className="relative">
                              <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="businessName"
                                name="businessName"
                                placeholder="Enter your business name"
                                className="pl-9"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="businessType">Service Type</Label>
                            <Select
                              value={formData.businessType}
                              onValueChange={handleSelectChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hotel">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> Hotel
                                  </div>
                                </SelectItem>
                                <SelectItem value="transport">
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" /> Transport
                                  </div>
                                </SelectItem>
                                <SelectItem value="guide">
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" /> Tour Guide
                                  </div>
                                </SelectItem>
                                <SelectItem value="restaurant">
                                  <div className="flex items-center gap-2">
                                    <Utensils className="h-4 w-4" /> Restaurant
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="serviceLocation">
                            Service Location
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="serviceLocation"
                              name="serviceLocation"
                              placeholder="e.g., Shimla, India"
                              className="pl-9"
                              value={formData.serviceLocation}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">
                            Business Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Tell us about your services, experience, and what makes you unique..."
                            className="min-h-[120px] resize-none"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full md:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="status">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !applicationStatus ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <Briefcase className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No applications found
                      </p>
                      <p className="text-sm mb-4">
                        You haven't submitted a seller application yet.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("apply")}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Application Status</CardTitle>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            applicationStatus.status
                          )}`}
                        >
                          {getStatusIcon(applicationStatus.status)}
                          <span className="capitalize">
                            {applicationStatus.status}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        Submitted on{" "}
                        {new Date(
                          applicationStatus.createdAt
                        ).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground mb-1 block text-xs uppercase tracking-wide">
                            Business Name
                          </Label>
                          <p className="font-medium text-lg">
                            {applicationStatus.businessName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground mb-1 block text-xs uppercase tracking-wide">
                            Type
                          </Label>
                          <p className="font-medium capitalize">
                            {applicationStatus.businessType}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground mb-1 block text-xs uppercase tracking-wide">
                            Location
                          </Label>
                          <p className="font-medium">
                            {applicationStatus.serviceLocation}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-1 block text-xs uppercase tracking-wide">
                          Description
                        </Label>
                        <p className="text-sm leading-relaxed p-4 bg-muted/50 rounded-lg">
                          {applicationStatus.description}
                        </p>
                      </div>

                      {applicationStatus.adminComments && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                          <Label className="text-blue-600 dark:text-blue-400 mb-1 block text-xs uppercase tracking-wide font-bold">
                            Admin Comments
                          </Label>
                          <p className="text-sm">
                            {applicationStatus.adminComments}
                          </p>
                        </div>
                      )}

                      {applicationStatus.status === "rejected" && (
                        <div className="flex justify-end">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setApplicationStatus(null);
                              setActiveTab("apply");
                              setFormData({
                                businessName: "",
                                businessType: "",
                                description: "",
                                serviceLocation: "",
                              });
                            }}
                          >
                            Submit New Application
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
