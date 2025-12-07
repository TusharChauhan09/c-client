import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { 
  IconPlayerPlay, 
  IconPlayerStop, 
  IconBrandOpenai
} from '@tabler/icons-react';
import { toast } from 'sonner';
import axios from 'axios';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import useTravelStore from '@/store/useTravelStore';

export default function TravelAIPage() {
  const { user, isSignedIn } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [destination, setDestination] = useState('');
  const [conversationLog, setConversationLog] = useState([]);
  
  // OpenAI Refs
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const audioElementRef = useRef(null);
  
  const { addConversation } = useTravelStore();

  // Model State
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini-realtime-preview");

  // ================== OPENAI IMPLEMENTATION (WebRTC) ==================
  const startOpenAISession = async () => {
    try {
      toast.loading('Connecting to OpenAI...', { id: 'connecting' });

      // 1. Get Token (Sending selected model + userId)
      const tokenResponse = await axios.get(`http://localhost:3000/api/voice-agent/ephemeral-token?model=${selectedModel}&userId=${user?.id}`);
      const EPHEMERAL_KEY = tokenResponse.data.tempApiKey;

      // 2. Setup WebRTC
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
        toast.dismiss('connecting');
        toast.success(`Connected to OpenAI (${selectedModel === 'gpt-4o-mini-realtime-preview' ? 'Mini' : 'Standard'})!`);
        
        // Initial Instructions
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are a travel guide helping with ${destination}. User: ${user?.firstName}. Keep answers very short, concise, and under 2 sentences. Do not use markdown.`,
            voice: "alloy",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: { type: "server_vad" }
          }
        };
        dc.send(JSON.stringify(sessionUpdate));
      };

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);
        if (event.type === 'input_audio_buffer.speech_started') { setIsSpeaking(true); setIsAISpeaking(false); }
        if (event.type === 'input_audio_buffer.speech_stopped') setIsSpeaking(false);
        if (event.type === 'response.audio.delta') setIsAISpeaking(true);
        if (event.type === 'response.audio.done') setIsAISpeaking(false);
        
        if (event.type === 'conversation.item.created' && event.item.role === 'user') {
           addLog('user', event.item.content?.[0]?.transcript || '(audio)');
        }
        if (event.type === 'response.done' && event.response.output?.[0]?.role === 'assistant') {
           addLog('assistant', event.response.output[0].content?.[0]?.transcript || '(audio response)');
        }
      };

      // 3. Offer/Answer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = selectedModel;
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      const answer = { type: "answer", sdp: await sdpResponse.text() };
      await pc.setRemoteDescription(answer);

    } catch (error) {
      console.error(error);
      toast.dismiss('connecting');
      if (error.response?.status === 403) {
        toast.error('Insufficient Credits! Upgrade to Silver or Gold to use GPT-4o Standard.');
      } else {
        toast.error('OpenAI Connection Failed');
      }
      disconnectSession();
    }
  };

  const createSession = () => {
    if (!isSignedIn || !destination.trim()) return;
    startOpenAISession();
  };

  const disconnectSession = () => {
    // Cleanup OpenAI
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (dataChannelRef.current) dataChannelRef.current.close();
    
    setIsConnected(false);
    setIsSpeaking(false);
    setIsAISpeaking(false);
    toast.success('Conversation ended');
  };

  const addLog = (role, text) => {
    setConversationLog(prev => [...prev, { role, content: text, timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <audio ref={audioElementRef} autoPlay />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🗺️ AI Travel Guide</h1>
          <p className="text-muted-foreground text-lg">Powered by OpenAI GPT-4o Realtime</p>
        </div>

        <div className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-6 border shadow-sm space-y-4">
                {/* Model Selection */}
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium">Select Intelligence Level</label>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedModel('gpt-4o-mini-realtime-preview')}
                        className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${selectedModel === 'gpt-4o-mini-realtime-preview' ? 'bg-primary text-black border-primary' : 'bg-background hover:bg-muted'}`}
                      >
                         🚀 GPT-4o Mini (Fast & Cheap)
                      </button>
                      <button 
                        onClick={() => setSelectedModel('gpt-4o-realtime-preview')}
                        className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${selectedModel === 'gpt-4o-realtime-preview' ? 'bg-primary text-black border-primary' : 'bg-background hover:bg-muted'}`}
                      >
                         🧠 GPT-4o (Smarter)
                      </button>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Where to? ✈️</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Paris, Tokyo..."
                    className="w-full p-4 border rounded-lg bg-background text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && createSession()}
                  />
                </div>
              </div>
              <Button onClick={createSession} size="lg" className="w-full h-14 text-lg" disabled={!destination.trim()}>
                <IconPlayerPlay className="mr-2" /> Start Conversation
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="font-bold text-xl mb-2">
                  Using OpenAI {selectedModel.includes('mini') ? 'GPT-4o Mini' : 'GPT-4o'}
                </p>
                <VoiceVisualizer isActive={isSpeaking || isAISpeaking} />
              </div>
              <Button onClick={disconnectSession} variant="destructive" size="lg" className="w-full">
                <IconPlayerStop className="mr-2" /> End Conversation
              </Button>
              
              {/* Transcript */}
              <div className="bg-card rounded-lg p-4 border h-64 overflow-y-auto space-y-3">
                 {conversationLog.map((msg, i) => (
                   <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-primary/20 ml-auto' : 'bg-muted mr-auto'} max-w-[80%]`}>
                     <p className="text-xs opacity-70">{msg.role}</p>
                     <p>{msg.content}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
