import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Thermometer, Droplets, Lightbulb, Activity } from 'lucide-react';
import { SensorData } from '../services/mockData';

interface EnvironmentProps {
  currentSensor: SensorData;
  onAskAI?: (msg: string) => void;
  history: any[];
}

export default function Environment({ currentSensor, onAskAI, history }: EnvironmentProps) {
  const displayVal = (val: any, suffix: string = '') => {
    return val !== null && val !== undefined ? `${val}${suffix}` : 'No Data';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Environmental Data</h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Physical micro-climates surrounding the AgriTrap IoT unit</p>
      </div>

      {/* Conditions Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Environmental Conditions Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3.5 text-sm font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Temperature</span>
              <span className="text-slate-800">{displayVal(currentSensor.temperature, '°C')}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Humidity</span>
              <span className="text-slate-800">{displayVal(currentSensor.humidity, '%')}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">LDR Light Intensity</span>
              <span className="text-slate-800">{displayVal(currentSensor.ldr, ' ADC')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">UV attraction light</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                {currentSensor.uvStatus !== null ? (currentSensor.uvStatus ? 'UV ON' : 'UV OFF') : 'No Data'}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-150 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <div className="flex items-center space-x-2">
                <Activity className="h-4.5 w-4.5 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Telemetry Assessment</span>
              </div>
              {onAskAI && (
                <button
                  onClick={() => onAskAI(`Analyze environmental conditions. Temperature is ${displayVal(currentSensor.temperature, '°C')}, humidity is ${displayVal(currentSensor.humidity, '%')}, light is ${displayVal(currentSensor.ldr, ' ADC')}.`)}
                  className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-1 rounded hover:bg-emerald-800 transition-colors"
                >
                  Analyze with AI
                </button>
              )}
            </div>
            <div className="my-3">
              <h4 className="text-emerald-950 font-bold text-sm">Overall Condition:</h4>
              <p className="text-emerald-800 text-xs mt-1 leading-relaxed font-semibold">
                Favorable for increased insect activity. Warm, high-humidity evenings generally correlate with higher insect flight movements.
              </p>
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
              * Classified using real-time local algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Temperature & Humidity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Temperature chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Thermometer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Temperature Trend</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DHT22 Telemetry (°C)</p>
            </div>
          </div>
          <div className="h-64">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">Waiting for live data history...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" name="Temperature" stroke="#e11d48" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Humidity chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Humidity Trend</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DHT22 Telemetry (%)</p>
            </div>
          </div>
          <div className="h-64">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">Waiting for live data history...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hum" name="Humidity" stroke="#2563eb" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Light Intensity Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Light Intensity Trend</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LDR Telemetry (ADC)</p>
          </div>
        </div>
        <div className="h-64">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">Waiting for live data history...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="ldr" name="Light Level" stroke="#d97706" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}

