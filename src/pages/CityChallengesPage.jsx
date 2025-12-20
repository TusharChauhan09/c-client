import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Truck,
  Leaf,
  Archive,
  Send,
  Loader2,
  ThumbsUp,
  MapPin,
  Crosshair,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Use API Service URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

const DEFAULT_CENTER = {
  lat: 28.6139, // New Delhi
  lng: 77.209,
};

const CityChallengesPage = () => {
  const { user, isLoaded } = useUser();
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    problemDescription: "",
    solutionProposal: "",
    impact: "",
    location: "",
    coordinates: null,
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ideas`);
      if (res.data.success) {
        setIdeas(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (val) => {
    setFormData({ ...formData, category: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit an idea.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/ideas`, {
        clerkId: user.id,
        ...formData,
      });

      if (res.data.success) {
        toast.success("Idea submitted successfully!");
        setFormData({
          title: "",
          category: "",
          problemDescription: "",
          solutionProposal: "",
          impact: "",
          location: "",
          coordinates: null,
        });
        fetchIdeas(); // Refresh list
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit idea. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    try {
      await axios.post(`${API_URL}/api/ideas/${id}/vote`);
      fetchIdeas(); // Optimistic update would be better, but this is simple
      toast.success("Voted!");
    } catch (error) {
      toast.error("Failed to vote.");
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData({
      ...formData,
      coordinates: { lat, lng },
      location: formData.location || `${lat.toFixed(4)}, ${lng.toFixed(4)}`, // Auto-fill text if empty
    });
  };

  const categories = [
    {
      id: "Transport Networks",
      icon: Truck,
      color: "text-blue-500",
      desc: "Traffic congestion, public transit efficiency, smart parking.",
    },
    {
      id: "City Resources",
      icon: Leaf,
      color: "text-green-500",
      desc: "Water management, energy consumption, waste reduction.",
    },
    {
      id: "Logistic Infrastructure",
      icon: Archive,
      color: "text-orange-500",
      desc: "Supply chain, last-mile delivery, warehousing optimization.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm border-primary/20 text-primary bg-primary/5"
          >
            Smart City Initiative
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Innovate for a Better Tomorrow
          </h1>
          <p className="text-lg text-muted-foreground">
            Our city faces growing pressures. We need YOUR ideas to solve
            challenges in resources, transport, and logistics. Join the movement
            to build a smarter, sustainable future.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader>
                <cat.icon className={`h-10 w-10 ${cat.color} mb-2`} />
                <CardTitle>{cat.id}</CardTitle>
                <CardDescription>{cat.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main Content: Form & Gallery */}
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Submission Form (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Submit Your Proposal
                </CardTitle>
                <CardDescription>
                  Have a solution? Share it with city planners and the
                  community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idea Title</label>
                    <Input
                      name="title"
                      placeholder="e.g., Smart Traffic Lights AI"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      onValueChange={handleSelectChange}
                      value={formData.category}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.id}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="location"
                        placeholder="e.g., Central Station, 5th Avenue"
                        value={formData.location}
                        onChange={handleChange}
                        className="pl-9"
                      />
                    </div>

                    {isMapLoaded ? (
                      <div className="rounded-lg overflow-hidden border border-border mt-2">
                        <GoogleMap
                          mapContainerStyle={MAP_CONTAINER_STYLE}
                          center={formData.coordinates || DEFAULT_CENTER}
                          zoom={12}
                          onClick={handleMapClick}
                        >
                          {formData.coordinates && (
                            <Marker position={formData.coordinates} />
                          )}
                        </GoogleMap>
                        <p className="text-[10px] text-muted-foreground mt-1 text-center">
                          Click on map to pin location
                        </p>
                      </div>
                    ) : (
                      <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed text-xs text-muted-foreground p-4 text-center">
                        Map requires Google Maps API Key.
                        <br />
                        Please add VITE_GOOGLE_MAPS_API_KEY to .env
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Problem Description
                    </label>
                    <Textarea
                      name="problemDescription"
                      placeholder="Describe the issue you are addressing..."
                      value={formData.problemDescription}
                      onChange={handleChange}
                      required
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Proposed Solution
                    </label>
                    <Textarea
                      name="solutionProposal"
                      placeholder="Detailed explanation of your idea..."
                      value={formData.solutionProposal}
                      onChange={handleChange}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Expected Impact
                    </label>
                    <Input
                      name="impact"
                      placeholder="e.g., Reduces commute time by 20%"
                      value={formData.impact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit Proposal
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ideas Gallery (Right) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Community Proposals</h2>
              <Badge variant="secondary">{ideas.length} Ideas Submitted</Badge>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12 border rounded-xl border-dashed">
                <p className="text-muted-foreground">
                  No ideas submitted yet. Be the first!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ideas.map((idea) => (
                  <motion.div
                    key={idea._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-1">
                              {idea.title}
                            </CardTitle>
                            <div className="flex gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {idea.category}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] ${
                                  idea.status === "Implemented"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : idea.status === "Accepted"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                    : idea.status === "Under Review"
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {idea.status}
                              </Badge>
                            </div>
                          </div>
                          {idea.location && (
                            <div
                              className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md w-fit cursor-pointer hover:bg-muted/50 transition-colors"
                              title="View on Map"
                              onClick={() => {
                                if (idea.coordinates?.lat) {
                                  window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${idea.coordinates.lat},${idea.coordinates.lng}`,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              <MapPin className="h-3 w-3" />
                              <span>{idea.location}</span>
                              {idea.coordinates?.lat && (
                                <Crosshair className="h-3 w-3 ml-1 opacity-50" />
                              )}
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto py-2 hover:bg-transparent"
                            onClick={() => handleVote(idea._id)}
                          >
                            <ThumbsUp className="h-5 w-5 text-primary" />
                            <span className="text-xs font-bold">
                              {idea.votes}
                            </span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-3">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                            Problem
                          </h4>
                          <p className="text-sm text-foreground/90">
                            {idea.problemDescription}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                            Solution
                          </h4>
                          <p className="text-sm text-foreground/90">
                            {idea.solutionProposal}
                          </p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                          <p className="text-xs font-medium flex items-center gap-2 text-primary">
                            <span className="font-bold">Impact:</span>{" "}
                            {idea.impact}
                          </p>
                        </div>

                        {idea.aiAnalysis?.analyzed && (
                          <div className="mt-2 bg-primary/5 p-3 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Loader2 className="h-4 w-4 text-primary animate-pulse" />
                              <span className="text-xs font-bold text-primary uppercase">
                                AI Feasibility Analysis
                              </span>
                            </div>
                            <div className="flex gap-4 mb-2">
                              <div className="text-center">
                                <div className="text-lg font-bold text-foreground">
                                  {idea.aiAnalysis.feasibilityScore}/10
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase">
                                  Feasibility
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-foreground">
                                  {idea.aiAnalysis.impactScore}/10
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase">
                                  Impact
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                              "{idea.aiAnalysis.feedback}"
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {idea.userId?.avatar && (
                            <img
                              src={idea.userId.avatar}
                              alt="User"
                              className="w-5 h-5 rounded-full"
                            />
                          )}
                          <span>
                            By {idea.userId?.firstName || "Anonymous"}
                          </span>
                        </div>
                        <span>
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityChallengesPage;
