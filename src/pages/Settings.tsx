import React from 'react';
import { Save, Shield, Settings as SettingsIcon, Sun, Eye } from 'lucide-react';
import { ActivityThresholds } from '../services/mockData';
import confetti from 'canvas-confetti';

interface SettingsProps {
  thresholds: ActivityThresholds;
  setThresholds: (val: ActivityThresholds) => void;
  trapName: string;
  setTrapName: (val: string) => void;
  trapId: string;
  setTrapId: (val: string) => void;
  assistantEnabled: boolean;
  setAssistantEnabled: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Settings({
  thresholds,
  setThresholds,
  trapName,
  setTrapName,
  trapId,
  setTrapId,
  assistantEnabled,
  setAssistantEnabled,
  darkMode,
  setDarkMode
}: SettingsProps) {

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5 text-emerald-700" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Configure insect thresholds, environment values, and AI modules</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Trap Registration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Trap Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trap Name</label>
              <input
                type="text"
                value={trapName}
                onChange={(e) => setTrapName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trap ID / Serial Key</label>
              <input
                type="text"
                value={trapId}
                onChange={(e) => setTrapId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Activity thresholds */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Detection Threshold Classifier</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Low Limit Max</label>
                <input
                  type="number"
                  value={thresholds.lowMax}
                  onChange={(e) => setThresholds({ ...thresholds, lowMax: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Medium Limit Max</label>
                <input
                  type="number"
                  value={thresholds.mediumMax}
                  onChange={(e) => setThresholds({ ...thresholds, mediumMax: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">High Limit Max</label>
                <input
                  type="number"
                  value={thresholds.highMax}
                  onChange={(e) => setThresholds({ ...thresholds, highMax: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-500 leading-relaxed">
              * The threshold matrix categorizes detections count as follows: 
              <br />
              0 - {thresholds.lowMax} (LOW) | {thresholds.lowMax + 1} - {thresholds.mediumMax} (MEDIUM) | {thresholds.mediumMax + 1} - {thresholds.highMax} (HIGH) | {thresholds.highMax + 1}+ (CRITICAL).
            </div>
          </div>
        </div>

        {/* AI Modules Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Advisory & AI Model Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Enable Google Gemini AI Assistant</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">Connect chatbot dialogs to context-aware sensor queries.</p>
              </div>
              <input
                type="checkbox"
                checked={assistantEnabled}
                onChange={(e) => setAssistantEnabled(e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Appearance Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Force Dark Theme Mode</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">Toggle premium deep contrast UI styles.</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-emerald-950/10 focus:outline-none"
          >
            <Save className="h-4.5 w-4.5" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
