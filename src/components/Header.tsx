import React from 'react';
import { Bell, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  firebaseConnected: boolean | null;
  esp32Online: boolean;
  activeFieldName: string;
  setActiveFieldName: (name: string) => void;
  formattedLastUpdated: string;
}

export default function Header({ 
  firebaseConnected, 
  esp32Online, 
  activeFieldName, 
  setActiveFieldName,
  formattedLastUpdated 
}: HeaderProps) {
  const fields = ['Main Agricultural Field', 'North Vineyard Sector', 'South Orchard Block'];

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Field Selector */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Field</label>
          <select 
            value={activeFieldName}
            onChange={(e) => setActiveFieldName(e.target.value)}
            className="text-slate-800 font-semibold text-sm bg-transparent border-0 p-0 focus:ring-0 focus:outline-none cursor-pointer hover:text-emerald-700 transition-colors"
          >
            {fields.map(field => (
              <option key={field} value={field} className="bg-white text-slate-800">
                {field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Connection status banner */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-slate-105 px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}></span>
          <span className="text-slate-600">
            {firebaseConnected ? '🟢 Firebase Connected' : '🔴 Firebase Disconnected'}
          </span>
        </div>

        <div className="hidden md:flex flex-col text-right">
          <span className={`text-xs font-extrabold ${esp32Online ? 'text-emerald-600' : 'text-rose-600'}`}>
            {esp32Online ? '🟢 ESP32 ONLINE' : '🔴 ESP32 OFFLINE'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Last Update: {formattedLastUpdated}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-full transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200 shadow-sm">
            AG
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800">Field Manager</p>
            <p className="text-[10px] text-slate-500">AgriTrap Specialist</p>
          </div>
        </div>
      </div>
    </header>
  );
}

