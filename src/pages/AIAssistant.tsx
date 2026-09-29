import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { SensorData } from '../services/mockData';
import Chatbot from '../components/Chatbot';

interface AIAssistantProps {
  currentSensor: SensorData;
  irEventsToday: number;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export default function AIAssistant({ 
  currentSensor, 
  irEventsToday, 
  initialQuestion, 
  onClearInitialQuestion 
}: AIAssistantProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <span>🤖 AgriTrap AI Assistant</span>
        </h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Your intelligent agricultural monitoring assistant</p>
      </div>

      {/* Main Chat component */}
      <Chatbot 
        currentSensor={currentSensor} 
        irEventsToday={irEventsToday} 
        initialQuestion={initialQuestion}
        onClearInitialQuestion={onClearInitialQuestion}
      />
    </div>
  );
}
