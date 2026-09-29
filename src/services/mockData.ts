// Data types and schemas for AgriTrap

export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  ldr: number | null;
  irDetected: boolean | null;
  uvStatus: boolean | null;
  timestamp: string | null;
  irValue: number | null;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  irDetected: boolean;
  ldrValue: number | null;
  temperature: number | null;
  humidity: number | null;
  uvStatus: boolean | null;
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Insect Activity' | 'Environment' | 'Sensor' | 'Connectivity' | 'System';
  severity: 'Critical' | 'Warning' | 'Information';
  resolved: boolean;
}

// Configurable thresholds for insect activity
export interface ActivityThresholds {
  lowMax: number;     // e.g. 10
  mediumMax: number;  // e.g. 25
  highMax: number;    // e.g. 50
  sensitivity: 'Low' | 'Medium' | 'High';
}

export const defaultThresholds: ActivityThresholds = {
  lowMax: 10,
  mediumMax: 25,
  highMax: 50,
  sensitivity: 'Medium'
};

// Map detection count to activity level based on thresholds
export function classifyActivity(eventsCount: number, thresholds: ActivityThresholds = defaultThresholds): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (eventsCount <= thresholds.lowMax) return 'LOW';
  if (eventsCount <= thresholds.mediumMax) return 'MEDIUM';
  if (eventsCount <= thresholds.highMax) return 'HIGH';
  return 'CRITICAL';
}

