import React from 'react';
import { 
  Bug, 
  Thermometer, 
  Droplets, 
  Wifi, 
  TrendingUp, 
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SensorData } from '../services/mockData';
import SensorCard from '../components/SensorCard';
import AIInsight from '../components/AIInsight';

interface DashboardProps {
  currentSensor: SensorData;
  irEventsToday: number;
  onNavigate: (page: string, question?: string) => void;
  activeFieldName: string;
  history: any[];
  firebaseConnected: boolean | null;
  esp32Online: boolean;
  formattedLastUpdated: string;
}

export default function Dashboard({ 
  currentSensor, 
  irEventsToday, 
  onNavigate, 
  activeFieldName,
  history,
  firebaseConnected,
  esp32Online,
  formattedLastUpdated
}: DashboardProps) {

  const displayVal = (val: any, suffix: string = '') => {
    return val !== null && val !== undefined ? `${val}${suffix}` : 'No Data';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl shadow-emerald-950/20">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Good Morning 👋</h2>
          <p className="text-emerald-200 text-sm mt-1 font-semibold max-w-xl">
            Monitor your field status and manage insect presence levels with AgriTrap IoT.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">Field Active</span>
        </div>
      </div>

      {/* Summary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard 
          title="Insect Activity"
          value={displayVal(irEventsToday)}
          unit="Events"
          statusText={currentSensor.irDetected !== null ? (currentSensor.irDetected ? "INSECT DETECTED" : "NO INSECT") : "No Data"}
          statusType={currentSensor.irDetected ? "error" : "success"}
          icon={Bug}
          description="Accumulated session events count"
        />
        <SensorCard 
          title="Temperature"
          value={currentSensor.temperature !== null ? currentSensor.temperature : "No Data"}
          unit={currentSensor.temperature !== null ? "°C" : ""}
          statusText="Normal Threshold"
          statusType="success"
          icon={Thermometer}
          description="Real-time ambient field temperature"
        />
        <SensorCard 
          title="Humidity"
          value={currentSensor.humidity !== null ? currentSensor.humidity : "No Data"}
          unit={currentSensor.humidity !== null ? "%" : ""}
          statusText="Moderate Level"
          statusType="neutral"
          icon={Droplets}
          description="DHT22 Sensor Reading"
        />
        <SensorCard 
          title="Trap Status"
          value={esp32Online ? "ONLINE" : "OFFLINE"}
          statusText={`Sync: ${formattedLastUpdated}`}
          statusType={esp32Online ? "success" : "error"}
          icon={Wifi}
          description="ESP32 hardware registration feed"
        />
      </div>

      {/* Charts & Insights Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Insect Activity Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Insect Activity — Realtime</h3>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Real-time Detections Flow</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>LIVE</span>
              </div>
            </div>

            <div className="h-64 mt-6">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-450 text-xs font-semibold">
                  Waiting for live telemetry readings history...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="ldr" name="LDR Level" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Data interpretation: Real-time correlation metrics.</span>
            <button 
              onClick={() => onNavigate('insect-activity')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center space-x-1"
            >
              <span>View Detailed Log</span>
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Insight Card */}
        <AIInsight 
          currentSensor={currentSensor} 
          irEventsToday={irEventsToday} 
          onAskAI={(msg) => onNavigate('ai-assistant', msg)}
        />
      </div>

      {/* Field Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Field Status card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover-premium">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">🌱 {activeFieldName.toUpperCase()}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500 font-semibold">Trap Status</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <span className={`h-2 w-2 rounded-full ${esp32Online ? 'bg-emerald-500 pulse-green' : 'bg-rose-500'}`}></span>
                  <span>{esp32Online ? 'Online' : 'Offline'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500 font-semibold">Monitoring Scope</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-green"></span>
                  <span>Active</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500 font-semibold">Last Sync</span>
                <span className="text-xs font-bold text-slate-700">{formattedLastUpdated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Today's Detections</span>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {displayVal(irEventsToday)} Events
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Checklist info */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover-premium">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Hardware Telemetry Verification</h3>
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>IR Sensor presence beam: {displayVal(currentSensor.irValue)} ADC</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>LDR sensor ambient light: {displayVal(currentSensor.ldr)} ADC</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>DHT22 air temperature: {displayVal(currentSensor.temperature, '°C')} functioning.</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>UV Light Attraction: {currentSensor.uvStatus !== null ? (currentSensor.uvStatus ? 'UV ON' : 'UV OFF') : 'No Data'} active.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

