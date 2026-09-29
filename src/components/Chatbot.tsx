import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  RefreshCw, 
  Paperclip, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import { SensorData } from '../services/mockData';
import { askGemini } from '../services/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  image?: string; // Optional attached image thumbnail
}

interface ChatbotProps {
  currentSensor: SensorData;
  irEventsToday: number;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export default function Chatbot({ 
  currentSensor, 
  irEventsToday, 
  initialQuestion, 
  onClearInitialQuestion 
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am AgriTrap AI, your agricultural advisory assistant. I monitor your field's IoT sensors, UV attractions, and estimated insect activity to provide actionable insights. Upload an insect/crop image or select a quick action to start!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Crop configuration states
  const [crop, setCrop] = useState('Tomato');
  const [stage, setStage] = useState('Flowering');

  // Trigger auto-submit if initialQuestion is passed on mount
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSend(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  // Image Upload state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { label: "📊 Analyze My Field", query: "Analyze my field sensor conditions." },
    { label: "🐛 Analyze Insect Image", query: "Analyze this insect image." },
    { label: "🧪 Pest Management", query: "Give me pest management recommendations." },
    { label: "🌡 Analyze Sensor Conditions", query: "Provide a detailed analysis of environmental sensor conditions." },
    { label: "📈 Summarize Today's Activity", query: "Summarize today's insect activity logs." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() && !attachedImage) return;
    if (loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend || "Analyzing attached image.",
      timestamp: new Date(),
      image: attachedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const imageToSend = attachedImage;
    setAttachedImage(null); // Clear preview input

    try {
      const reply = await askGemini(
        textToSend, 
        currentSensor, 
        irEventsToday, 
        imageToSend, 
        { crop, stage }
      );
      
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "⚠️ I had trouble connecting to the AgriTrap AI server. Please make sure the backend is active or try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'ai',
        text: "Chat history cleared. I'm ready to analyze new field logs!",
        timestamp: new Date()
      }
    ]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[700px] max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">🤖 AgriTrap AI</h3>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Assistant Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center space-x-1 font-semibold"
            title="Clear Conversation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Multimodal field intelligence badge & Info */}
      <div className="bg-slate-950 px-6 py-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center space-x-2 text-emerald-400">
          <span className="bg-emerald-950 px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider border border-emerald-900">
            ⚡ MULTIMODAL FIELD INTELLIGENCE
          </span>
          <span className="text-[10px] text-slate-400">Image + IoT Sensors + AI</span>
        </div>
        
        {/* Crop Config */}
        <div className="flex items-center space-x-3">
          <select 
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="bg-slate-900 border border-slate-850 rounded px-2 py-0.5 text-[10px] text-slate-350 focus:outline-none focus:border-emerald-650 cursor-pointer"
          >
            <option value="Tomato">🍅 Tomato</option>
            <option value="Rice">🌾 Rice</option>
            <option value="Cotton">🌱 Cotton</option>
            <option value="Chilli">🌶️ Chilli</option>
          </select>
          <select 
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="bg-slate-900 border border-slate-850 rounded px-2 py-0.5 text-[10px] text-slate-350 focus:outline-none focus:border-emerald-650 cursor-pointer"
          >
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative</option>
            <option value="Flowering">Flowering</option>
            <option value="Fruiting">Fruiting</option>
          </select>
        </div>
      </div>

      {/* Collapsible Context Panel */}
      <div className="border-b border-slate-200">
        <button 
          onClick={() => setShowContext(!showContext)}
          className="w-full bg-slate-50 px-6 py-2 flex items-center justify-between text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-green"></span>
            <span>📡 Current Field Context ({showContext ? 'Expanded' : '7 live signals'})</span>
          </span>
          {showContext ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
        </button>

        {showContext && (
          <div className="bg-slate-50/50 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 border-t border-slate-150">
            <div>
              <span className="text-slate-400 block mb-0.5">Temperature</span>
              <span className="text-slate-800 font-extrabold">
                {currentSensor.temperature !== null && currentSensor.temperature !== undefined ? `${currentSensor.temperature}°C` : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Humidity</span>
              <span className="text-slate-800 font-extrabold">
                {currentSensor.humidity !== null && currentSensor.humidity !== undefined ? `${currentSensor.humidity}%` : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Light (LDR)</span>
              <span className="text-slate-800 font-extrabold">
                {currentSensor.ldr !== null && currentSensor.ldr !== undefined ? `${currentSensor.ldr} ADC` : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">UV Trap Status</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold border border-emerald-100">
                {currentSensor.uvStatus !== null && currentSensor.uvStatus !== undefined ? (currentSensor.uvStatus ? 'UV ON' : 'UV OFF') : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">IR Sensor Value</span>
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-extrabold border border-rose-100">
                {currentSensor.irValue !== null && currentSensor.irValue !== undefined ? `${currentSensor.irValue} ADC` : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Insect Presence</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-extrabold border border-amber-100">
                {currentSensor.irDetected !== null && currentSensor.irDetected !== undefined ? (currentSensor.irDetected ? 'INSECT' : 'NO INSECT') : 'No Data'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Detections Today</span>
              <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-extrabold border border-slate-200">
                {irEventsToday !== null && irEventsToday !== undefined ? `${irEventsToday} events` : 'No Data'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
        {messages.map((msg, index) => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={index}
              className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm leading-relaxed text-sm ${
                isAI 
                  ? 'bg-white border border-slate-150 text-slate-800 rounded-tl-none relative group' 
                  : 'bg-emerald-800 text-white rounded-tr-none'
              }`}>
                {/* User Image Attachment rendering inside message bubbles */}
                {msg.image && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 max-h-48 max-w-sm">
                    <img src={msg.image} alt="User attachment" className="object-cover w-full h-full" />
                  </div>
                )}

                {/* Structured formatting renderer */}
                <div className="space-y-2.5 whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-bold text-base mt-3 text-emerald-850">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('🔎') || line.startsWith('🧪') || line.startsWith('🌱') || line.startsWith('🐛')) {
                      return <h4 key={lIdx} className="font-bold text-sm text-emerald-950 mt-3">{line}</h4>;
                    }
                    if (line.startsWith('* ') || line.startsWith('• ')) {
                      return <li key={lIdx} className="ml-4 list-disc text-xs sm:text-sm">{line.substring(2)}</li>;
                    }
                    return <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">{line}</p>;
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  {isAI && (
                    <button 
                      onClick={() => copyToClipboard(msg.text, index)}
                      className="opacity-0 group-hover:opacity-100 hover:text-emerald-700 transition-all flex items-center space-x-1"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-bold">🤖 AgriTrap AI is analyzing field intelligence</span>
              <div className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload preview drawer */}
      {attachedImage && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-16 w-16 rounded-xl border border-slate-300 overflow-hidden bg-white">
              <img src={attachedImage} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block">📷 Image Attachment ready</span>
              <span className="text-[10px] text-slate-400">Will be analyzed with real-time IoT context.</span>
            </div>
          </div>
          <button 
            onClick={() => setAttachedImage(null)}
            className="text-slate-400 hover:text-rose-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Suggested Quick actions */}
      <div className="p-4 border-t border-slate-100 bg-white flex flex-wrap gap-2">
        {suggestions.map((sug, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(sug.query)}
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all border border-slate-250/60"
          >
            {sug.label}
          </button>
        ))}
      </div>

      {/* Form Input panel */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-slate-100 bg-white flex items-center space-x-3"
      >
        {/* Image upload button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*"
          className="hidden" 
        />
        <button
          type="button"
          onClick={triggerUpload}
          className="p-3 text-slate-450 hover:text-emerald-700 bg-slate-100 hover:bg-slate-150 rounded-xl transition-colors focus:outline-none"
          title="Attach Crop/Insect Image"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={attachedImage ? "Add comments or submit to analyze..." : "Ask AgriTrap AI about your crop conditions..."}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-semibold"
        />
        
        <button
          type="submit"
          disabled={(!input.trim() && !attachedImage) || loading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-colors flex items-center space-x-2 font-bold text-sm shadow-md shadow-emerald-950/10 focus:outline-none"
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
