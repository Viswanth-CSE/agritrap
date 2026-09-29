import React from 'react';
import { 
  Scan, 
  Lightbulb, 
  Thermometer, 
  Droplets,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SensorData } from '../services/mockData';

interface MonitoringProps {
  currentSensor: SensorData;
  activeFieldName: string;
}

export default function Monitoring({ currentSensor, activeFieldName }: MonitoringProps) {
  
  const displayVal = (val: any, suffix: string = '') => {
    return val !== null && val !== undefined ? `${val}${suffix}` : 'No Data';
  };

  const sensors = [
    {
      id: 'ir',
      name: 'IR Sensor',
      title: 'IR Value & Insect Detected Status',
      value: currentSensor.irValue !== null ? `${currentSensor.irValue} ADC` : 'No Data',
      status: currentSensor.irDetected !== null ? (currentSensor.irDetected ? 'RED: INSECT DETECTED' : 'GREEN: NO INSECT') : 'No Data',
      timeLabel: currentSensor.irDetected !== null ? (currentSensor.irDetected ? 'INSECT DETECTED' : 'NO INSECT') : 'No Data',
      icon: Scan,
      color: currentSensor.irDetected ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-700'
    },
    {
      id: 'ldr',
      name: 'LDR Light Sensor',
      title: 'Light Intensity',
      value: displayVal(currentSensor.ldr),
      status: 'ADC',
      timeLabel: currentSensor.ldr !== null && currentSensor.ldr < 500 ? 'Night Conditions' : 'Daylight Conditions',
      icon: Lightbulb,
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
      id: 'dht22',
      name: 'DHT22 Sensor',
      title: 'Environment Metrics',
      value: displayVal(currentSensor.temperature, '°C'),
      status: `Humidity: ${displayVal(currentSensor.humidity, '%')}`,
      timeLabel: 'Normal air thresholds',
      icon: Thermometer,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    {
      id: 'uv',
      name: 'UV Light Attraction',
      title: 'UV Attraction',
      value: currentSensor.uvStatus !== null ? (currentSensor.uvStatus ? 'UV ON' : 'UV OFF') : 'No Data',
      status: 'UV Light State',
      timeLabel: currentSensor.uvStatus ? 'Active' : 'Inactive',
      icon: Lightbulb,
      color: currentSensor.uvStatus ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-700'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Live Sensor Monitoring</h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Real-time hardware status of AgriTrap system components</p>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div 
              key={sensor.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between h-48 shadow-sm transition-all duration-300 hover:shadow-md ${sensor.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{sensor.name}</span>
                <div className="p-2 bg-white rounded-xl shadow-sm text-current">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="my-3">
                <h3 className="text-xs uppercase font-semibold opacity-70">{sensor.title}</h3>
                <p className="text-3xl font-extrabold tracking-tight mt-1">{sensor.value}</p>
              </div>

              <div className="border-t border-current/10 pt-3 flex items-center justify-between text-xs font-semibold">
                <span>{sensor.status}</span>
                <span className="opacity-80">{sensor.timeLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trap Camera Simulation (Visual demonstration instead of generic placeholder) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">IoT Trap Visual Simulation</h3>
        
        <div className="relative aspect-video max-h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] z-10"></div>
          
          {/* Simulated UV Glow */}
          {currentSensor.uvStatus && (
            <div className="absolute h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
          )}

          {/* Camera Frame details */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-black/40 px-3 py-1 rounded-md border border-white/5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>FEED: AGRITRAP_ESP32_SEC1</span>
          </div>

          <div className="absolute top-4 right-4 z-20 text-xs font-mono text-slate-300 bg-black/40 px-3 py-1 rounded-md border border-white/5">
            <span>2026-08-11 10:32:00</span>
          </div>

          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

          <div className="z-20 text-center space-y-3 px-6">
            <Scan className="h-12 w-12 text-purple-400 mx-auto animate-bounce" />
            <h4 className="text-white font-bold text-sm">Visual Trap Camera System</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              Camera identification module offline. Upgrading with computer vision libraries will allow direct species identification in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
