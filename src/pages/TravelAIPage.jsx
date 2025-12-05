import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { 
  IconPlayerPlay, 
  IconPlayerStop, 
  IconMicrophone,
  IconMicrophoneOff,
  IconBrandOpenai,
  IconBrandGoogle
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
  const [selectedModel, setSelectedModel] = useState('openai'); // 'openai' or 'gemini'
  
  // OpenAI Refs
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  
  // Gemini Refs
  const websocketRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);
  
  // State Refs for AudioWorklet
  const isSpeakingRef = useRef(false);
  const isAISpeakingRef = useRef(false);

  // Sync refs with state
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isAISpeakingRef.current = isAISpeaking; }, [isAISpeaking]);
  
  const audioElementRef = useRef(null);
  const sessionStartTime = useRef(Date.now());
  const { addConversation } = useTravelStore();

  // ================== OPENAI IMPLEMENTATION (WebRTC) ==================
  const startOpenAISession = async () => {
    try {
      toast.loading('Connecting to OpenAI...', { id: 'connecting' });

      // 1. Get Token
      const tokenResponse = await axios.get('http://localhost:3000/api/voice-agent/ephemeral-token');
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
        toast.success('Connected to OpenAI!');
        
        // Initial Instructions
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are a travel guide helping with ${destination}. User: ${user?.firstName}.`,
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
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
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
      toast.error('OpenAI Connection Failed');
      disconnectSession();
    }
  };

  // ================== GEMINI IMPLEMENTATION (WebSocket) ==================
  const startGeminiSession = async () => {
    try {
      toast.loading('Connecting to Gemini...', { id: 'connecting' });

      // 1. Setup Audio Context (24kHz is standard for Gemini output, 16kHz for input)
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      
      // Input stream (Microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      mediaStreamRef.current = stream;

      // 2. Connect to Backend Proxy
      const ws = new WebSocket('ws://localhost:3000');
      websocketRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        toast.dismiss('connecting');
        toast.success('Connected to Gemini!');
        
        // Send Initial Context
        const msg = {
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
              }
            }
          }
        };
        ws.send(JSON.stringify(msg));

        // Send Initial Prompt
        const initialPrompt = {
          client_content: {
            turns: [{
              role: "user",
              parts: [{ text: `You are a travel guide helping with ${destination}. User: ${user?.firstName}. Keep answers short.` }]
            }],
            turn_complete: true
          }
        };
        ws.send(JSON.stringify(initialPrompt));
        
        // Start Recording using AudioWorklet
        await startGeminiRecording(stream, ws);
      };

      ws.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        
        // Handle Audio Output
        if (response.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
          const base64Audio = response.serverContent.modelTurn.parts[0].inlineData.data;
          playGeminiAudio(base64Audio);
        }

        // Handle Text Transcript
        if (response.serverContent?.modelTurn?.parts?.[0]?.text) {
           addLog('assistant', response.serverContent.modelTurn.parts[0].text);
        }
        
        // Handle Interruption (Server VAD)
        if (response.serverContent?.turnComplete) {
           setIsAISpeaking(false);
        }
      };
      
      ws.onclose = () => disconnectSession();

    } catch (error) {
      console.error(error);
      toast.error('Gemini Connection Failed');
      disconnectSession();
    }
  };

  const startGeminiRecording = async (stream, ws) => {
    const inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    
    // Define AudioWorklet inline to avoid external file issues
    const workletCode = `
      class GeminiAudioProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
          this.bufferSize = 2048;
          this.buffer = new Float32Array(this.bufferSize);
          this.bufferIndex = 0;
        }

        process(inputs, outputs, parameters) {
          const input = inputs[0];
          if (!input || !input.length) return true;
          const channel = input[0];
          
          for (let i = 0; i < channel.length; i++) {
            this.buffer[this.bufferIndex++] = channel[i];
            if (this.bufferIndex === this.bufferSize) {
              this.flush();
            }
          }
          return true;
        }

        flush() {
          const inputData = this.buffer;
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += Math.abs(inputData[i]);
          }
          const volume = sum / inputData.length;

          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
          }

          this.port.postMessage({
            pcmData: pcmData.buffer,
            volume: volume
          }, [pcmData.buffer]);

          this.bufferIndex = 0;
        }
      }
      registerProcessor('gemini-audio-processor', GeminiAudioProcessor);
    `;

    const blob = new Blob([workletCode], { type: 'application/javascript' });
    const workletUrl = URL.createObjectURL(blob);

    try {
      await inputContext.audioWorklet.addModule(workletUrl);
      
      const source = inputContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(inputContext, 'gemini-audio-processor');

      workletNode.port.onmessage = (event) => {
        if (ws.readyState === WebSocket.OPEN) {
          const { pcmData, volume } = event.data;
          
          // VAD Logic using Refs to avoid stale state
          if (volume > 0.01 && !isSpeakingRef.current) {
             setIsSpeaking(true);
             if (isAISpeakingRef.current) {
               stopGeminiAudio();
             }
          } else if (volume < 0.01 && isSpeakingRef.current) {
             setTimeout(() => setIsSpeaking(false), 500);
          }

          // Send Audio
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData)));
          ws.send(JSON.stringify({
            realtime_input: {
              media_chunks: [{
                mime_type: "audio/pcm",
                data: base64Audio
              }]
            }
          }));
        }
      };

      source.connect(workletNode);
      workletNode.connect(inputContext.destination); // Keep node alive
      
      audioWorkletNodeRef.current = { node: workletNode, context: inputContext, url: workletUrl };
    } catch (err) {
      console.error("Error loading AudioWorklet:", err);
    }
  };

  // Queue for audio chunks to play smoothly
  const audioQueue = useRef([]);
  const nextStartTimeRef = useRef(0);

  const playGeminiAudio = (base64String) => {
    setIsAISpeaking(true);
    
    // Decode Base64 to Float32
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 0x8000;
    }

    // Schedule Playback
    const ctx = audioContextRef.current;
    const buffer = ctx.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    // Ensure smooth playback timing
    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;

    // Keep track of active sources for interruption
    audioQueue.current.push(source);
    
    source.onended = () => {
      audioQueue.current = audioQueue.current.filter(s => s !== source);
      if (audioQueue.current.length === 0) {
        setIsAISpeaking(false);
      }
    };
  };

  const stopGeminiAudio = () => {
    // Stop all currently playing audio sources
    audioQueue.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    audioQueue.current = [];
    nextStartTimeRef.current = 0;
    setIsAISpeaking(false);
  };

  // ================== SHARED LOGIC ==================
  const createSession = () => {
    if (!isSignedIn || !destination.trim()) return;
    if (selectedModel === 'openai') startOpenAISession();
    else startGeminiSession();
  };

  const disconnectSession = () => {
    // Cleanup OpenAI
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (dataChannelRef.current) dataChannelRef.current.close();
    
    // Cleanup Gemini
    if (websocketRef.current) websocketRef.current.close();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    
    // Cleanup AudioWorklet
    if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.node.disconnect();
        audioWorkletNodeRef.current.context.close();
        URL.revokeObjectURL(audioWorkletNodeRef.current.url);
    }

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
          
          {/* Model Selector */}
          {!isConnected && (
            <div className="flex justify-center gap-4 mb-6">
              <Button 
                variant={selectedModel === 'openai' ? 'default' : 'outline'}
                onClick={() => setSelectedModel('openai')}
                className="gap-2"
              >
                <IconBrandOpenai size={20} /> OpenAI GPT-4o
              </Button>
              <Button 
                variant={selectedModel === 'gemini' ? 'default' : 'outline'}
                onClick={() => setSelectedModel('gemini')}
                className="gap-2"
              >
                <IconBrandGoogle size={20} /> Google Gemini 2.0
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-6 border shadow-sm">
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
              <Button onClick={createSession} size="lg" className="w-full h-14 text-lg" disabled={!destination.trim()}>
                <IconPlayerPlay className="mr-2" /> Start Conversation ({selectedModel === 'openai' ? 'OpenAI' : 'Gemini'})
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="font-bold text-xl mb-2">
                  Using {selectedModel === 'openai' ? 'OpenAI GPT-4o' : 'Google Gemini 2.0'}
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
