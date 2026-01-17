import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconMicrophone,
  IconPlayerStop,
  IconLock,
  IconMapPin,
  IconSparkles,
  IconCrown,
  IconTestPipe,
} from "@tabler/icons-react";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import DotGrid from "@/components/ui/DotGrid";
import useAuthStore from "@/store/useAuthStore";

// Demo mode flag - set to true to test UI without API calls
const DEMO_MODE = false;

export default function TravelAIPage() {
  const { user, isSignedIn } = useUser();
  const { dbUser } = useAuthStore();
  const [searchParams] = useSearchParams();

  // Read from URL params if available
  const urlDestination = searchParams.get("destination") || "";
  const urlContext = searchParams.get("context") || "";

  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [destination, setDestination] = useState(urlDestination);
  const [description, setDescription] = useState(urlContext);
  const [conversationLog, setConversationLog] = useState([]);

  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const audioElementRef = useRef(null);

  const [selectedModel, setSelectedModel] = useState(
    "gpt-4o-mini-realtime-preview"
  );

  // Check if user has premium (silver or gold)
  const isPremium =
    dbUser?.subscriptionTier === "silver" ||
    dbUser?.subscriptionTier === "gold";

  // Demo mode simulation
  useEffect(() => {
    if (!DEMO_MODE || !isConnected) return;

    // Simulate AI greeting after connection
    const greetingTimer = setTimeout(() => {
      setIsAISpeaking(true);
      // Replace entire log with just this message
      setConversationLog([
        {
          role: "assistant",
          content: `Hello! I'm your AI travel guide for ${destination}. How can I help you?`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setTimeout(() => setIsAISpeaking(false), 2000);
    }, 1500);

    // Simulate alternating speaking states
    const interval = setInterval(() => {
      setIsSpeaking((prev) => {
        if (prev) {
          // User stopped speaking, AI responds
          setTimeout(() => {
            setIsAISpeaking(true);
            const responses = [
              `Great question! The best time to visit ${destination} is during spring.`,
              `I recommend the local markets and historical sites.`,
              `The food scene is amazing. Try the local cuisine!`,
              `For transport, use public transit or walk.`,
            ];
            // Replace with just 1 message
            setConversationLog([
              {
                role: "assistant",
                content:
                  responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date().toISOString(),
              },
            ]);
            setTimeout(() => setIsAISpeaking(false), 2500);
          }, 500);
        }
        return !prev;
      });
    }, 5000);

    return () => {
      clearTimeout(greetingTimer);
      clearInterval(interval);
    };
  }, [isConnected, destination]);

  const addLog = (role, text) => {
    // Only keep the latest message - replace instead of append
    setConversationLog([
      { role, content: text, timestamp: new Date().toISOString() },
    ]);
  };

  // Demo mode start session
  const startDemoSession = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    toast.loading("Connecting...", { id: "connecting" });
    setTimeout(() => {
      setIsConnected(true);
      toast.dismiss("connecting");
      toast.success("Demo Mode: Connected!");
    }, 1000);
  };

  const startOpenAISession = async () => {
    try {
      toast.loading("Connecting to AI Travel Guide...", { id: "connecting" });
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const tokenResponse = await axios.get(
        `${API_URL}/api/voice-agent/ephemeral-token?model=${selectedModel}&userId=${user?.id}`
      );
      const EPHEMERAL_KEY = tokenResponse.data.tempApiKey;

      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };

      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(ms.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        setIsConnected(true);
        toast.dismiss("connecting");
        toast.success("Connected! Start speaking...");

        const contextInfo = description
          ? `The user says: "${description}"`
          : "The user wants to explore this destination.";

        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are an expert travel guide for ${destination}. ${contextInfo} User's name: ${
              user?.firstName || "Traveler"
            }. Be friendly, helpful, and provide concise travel tips. Keep responses under 3 sentences. Don't use markdown.`,
            voice: "alloy",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: { type: "server_vad" },
          },
        };
        dc.send(JSON.stringify(sessionUpdate));
      };

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);
        if (event.type === "input_audio_buffer.speech_started") {
          setIsSpeaking(true);
          setIsAISpeaking(false);
        }
        if (event.type === "input_audio_buffer.speech_stopped")
          setIsSpeaking(false);
        if (event.type === "response.audio.delta") setIsAISpeaking(true);
        if (event.type === "response.audio.done") setIsAISpeaking(false);

        if (
          event.type === "conversation.item.created" &&
          event.item.role === "user"
        ) {
          addLog("user", event.item.content?.[0]?.transcript || "(audio)");
        }
        if (
          event.type === "response.done" &&
          event.response.output?.[0]?.role === "assistant"
        ) {
          addLog(
            "assistant",
            event.response.output[0].content?.[0]?.transcript ||
              "(audio response)"
          );
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";

      const sdpResponse = await fetch(`${baseUrl}?model=${selectedModel}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = { type: "answer", sdp: await sdpResponse.text() };
      await pc.setRemoteDescription(answer);
    } catch (error) {
      console.error(error);
      toast.dismiss("connecting");
      if (error.response?.status === 403) {
        toast.error("Insufficient Credits! Upgrade your plan.");
      } else {
        toast.error("Connection Failed. Please try again.");
      }
      disconnectSession();
    }
  };

  const createSession = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    // Use demo mode if enabled
    if (DEMO_MODE) {
      startDemoSession();
      return;
    }

    if (!isSignedIn) {
      toast.error("Please sign in to continue");
      return;
    }
    startOpenAISession();
  };

  const disconnectSession = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (dataChannelRef.current) dataChannelRef.current.close();

    setIsConnected(false);
    setIsSpeaking(false);
    setIsAISpeaking(false);
    setConversationLog([]);
    toast.success("Conversation ended");
  };

  const handleModelSelect = (model) => {
    if (model === "gpt-4o-realtime-preview" && !isPremium) {
      toast.error("Upgrade to Silver or Gold to access Premium AI");
      return;
    }
    setSelectedModel(model);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* DotGrid Background */}
      <div className="absolute inset-0 -z-10">
        <DotGrid
          dotSize={2}
          gap={20}
          baseColor="#10b981"
          activeColor="#34d399"
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          resistance={900}
          returnDuration={1.5}
        />
      </div>

      <audio ref={audioElementRef} autoPlay />

      {/* Main Content - Centered */}
      <div className="h-full w-full flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    <IconSparkles className="w-4 h-4" />
                    <span>AI Travel Guide</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Where are you traveling?
                  </h1>
                  <p className="text-muted-foreground">
                    Start a voice conversation with your personal travel
                    assistant
                  </p>
                </div>

                {/* Main Card */}
                <Card className="p-4 backdrop-blur-md bg-card/80 border-border/50 shadow-2xl">
                  <div className="space-y-5">
                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Select AI Model
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Base Model */}
                        <button
                          onClick={() =>
                            handleModelSelect("gpt-4o-mini-realtime-preview")
                          }
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            selectedModel === "gpt-4o-mini-realtime-preview"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <IconSparkles className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm">
                              Standard
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Fast & Efficient
                          </p>
                        </button>

                        {/* Premium Model */}
                        <button
                          onClick={() =>
                            handleModelSelect("gpt-4o-realtime-preview")
                          }
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            selectedModel === "gpt-4o-realtime-preview"
                              ? "border-primary bg-primary/10"
                              : isPremium
                              ? "border-border hover:border-primary/50"
                              : "border-border/50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          {!isPremium && (
                            <div className="absolute top-2 right-2">
                              <IconLock className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <IconCrown className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-sm">
                              Premium
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isPremium
                              ? "Advanced Intelligence"
                              : "Silver/Gold Only"}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Location Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="destination"
                        className="flex items-center gap-2"
                      >
                        <IconMapPin className="w-4 h-4" />
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Paris, Tokyo, New York..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="flex items-center justify-between"
                      >
                        <span>Context (Optional)</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          You can share this later in conversation
                        </span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., I'm planning a 5-day trip... or I'm already here exploring..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none h-20"
                      />
                    </div>

                    {/* Start Button */}
                    <Button
                      onClick={createSession}
                      disabled={
                        !destination.trim() || (!isSignedIn && !DEMO_MODE)
                      }
                      className="w-full h-12 gap-2 text-base"
                      size="lg"
                    >
                      <IconMicrophone className="w-5 h-5" />
                      {DEMO_MODE
                        ? "Start Demo Conversation"
                        : "Start Conversation"}
                    </Button>

                    {DEMO_MODE && (
                      <div className="flex items-center justify-center gap-2 text-sm text-amber-500 bg-amber-500/10 rounded-lg py-2">
                        <IconTestPipe className="w-4 h-4" />
                        Demo Mode Active - No API calls
                      </div>
                    )}

                    {!isSignedIn && !DEMO_MODE && (
                      <p className="text-center text-sm text-muted-foreground">
                        Sign in to start talking with AI
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {/* Active Session Card */}
                <Card className="p-6 backdrop-blur-md bg-card/80 border-border/50 shadow-2xl">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Compact Header */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {destination}
                        </span>
                      </div>
                      <Button
                        onClick={disconnectSession}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <IconPlayerStop className="w-4 h-4 mr-1" />
                        End
                      </Button>
                    </div>

                    {/* Voice Visualizer - Compact */}
                    <div className="flex items-center gap-6 py-4">
                      {/* User Side */}
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        animate={{ scale: isSpeaking ? 1.05 : 1 }}
                      >
                        <motion.div
                          className={`w-12 h-12 rounded-full overflow-hidden ring-2 transition-all ${
                            isSpeaking
                              ? "ring-primary ring-offset-2 ring-offset-background"
                              : "ring-border"
                          }`}
                          animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
                          transition={{
                            duration: 0.5,
                            repeat: isSpeaking ? Infinity : 0,
                          }}
                        >
                          {user?.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt="You"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                              {user?.firstName?.[0] || "U"}
                            </div>
                          )}
                        </motion.div>
                        <span className="text-xs text-muted-foreground">
                          You
                        </span>
                      </motion.div>

                      {/* Sound Waves */}
                      <div className="flex items-center gap-0.5 h-8">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-1 rounded-full ${
                              isSpeaking
                                ? "bg-primary"
                                : isAISpeaking
                                ? "bg-primary"
                                : "bg-muted-foreground/30"
                            }`}
                            animate={{
                              height:
                                isSpeaking || isAISpeaking
                                  ? [8, 20 + Math.random() * 12, 8]
                                  : 8,
                            }}
                            transition={{
                              duration: 0.3,
                              repeat: Infinity,
                              delay: i * 0.08,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>

                      {/* AI Side */}
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        animate={{ scale: isAISpeaking ? 1.05 : 1 }}
                      >
                        <motion.div
                          className={`w-12 h-12 rounded-full overflow-hidden ring-2 transition-all flex items-center justify-center ${
                            isAISpeaking
                              ? "ring-primary ring-offset-2 ring-offset-background bg-primary/20"
                              : "ring-border bg-muted"
                          }`}
                          animate={{ scale: isAISpeaking ? [1, 1.1, 1] : 1 }}
                          transition={{
                            duration: 0.5,
                            repeat: isAISpeaking ? Infinity : 0,
                          }}
                        >
                          <IconSparkles
                            className={`w-6 h-6 ${
                              isAISpeaking
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </motion.div>
                        <span className="text-xs text-muted-foreground">
                          AI
                        </span>
                      </motion.div>
                    </div>

                    {/* Status Text - Professional */}
                    <p className="text-sm text-muted-foreground">
                      {isSpeaking
                        ? "Listening to you..."
                        : isAISpeaking
                        ? "AI is responding..."
                        : "Ready to listen"}
                    </p>
                  </div>
                </Card>

                {/* Chat Messages - Fade Effect */}
                {/* Chat Messages - Only last 2, older ones disappear */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {conversationLog.slice(-2).map((msg) => (
                      <motion.div
                        key={msg.timestamp}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className={`flex items-start gap-3 ${
                          msg.role === "assistant" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden ${
                            msg.role === "assistant"
                              ? "bg-primary/10 flex items-center justify-center"
                              : ""
                          }`}
                        >
                          {msg.role === "user" ? (
                            user?.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt="You"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                                {user?.firstName?.[0] || "U"}
                              </div>
                            )
                          ) : (
                            <IconSparkles className="w-4 h-4 text-primary" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <motion.div
                          className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                            msg.role === "user"
                              ? "bg-muted rounded-tl-sm"
                              : "bg-primary text-primary-foreground rounded-tr-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
