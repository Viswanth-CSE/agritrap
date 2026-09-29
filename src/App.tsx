import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import InsectActivity from './pages/InsectActivity';
import Environment from './pages/Environment';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';

import { 
  SensorData, 
  DetectionEvent, 
  Alert, 
  ActivityThresholds,
  defaultThresholds,
  classifyActivity
} from './services/mockData';

import { db } from './services/firebase';
import { ref, onValue } from 'firebase/database';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeFieldName, setActiveFieldName] = useState('Main Agricultural Field');
  const [chatbotQuestion, setChatbotQuestion] = useState<string>('');

  // Firebase connection and ESP32 status
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);
  const [esp32Online, setEsp32Online] = useState<boolean>(false);
  const [lastUpdatedVal, setLastUpdatedVal] = useState<number | null>(null);
  const [formattedLastUpdated, setFormattedLastUpdated] = useState<string>('No Data');

  // Loading state
  const [loading, setLoading] = useState(true);

  // Telemetry state
  const [currentSensor, setCurrentSensor] = useState<SensorData>({
    temperature: null,
    humidity: null,
    ldr: null,
    irDetected: null,
    uvStatus: null,
    timestamp: null,
    irValue: null
  });

  const [detections, setDetections] = useState<DetectionEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [irEventsToday, setIrEventsToday] = useState(0);

  // Rolling history list for Recharts (max 20)
  const [history, setHistory] = useState<any[]>([]);

  // Settings state
  const [thresholds, setThresholds] = useState<ActivityThresholds>(defaultThresholds);
  const [trapName, setTrapName] = useState('AgriTrap ESP32 Monitor');
  const [trapId, setTrapId] = useState('ESP32_AGRI_902X');
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Track insectDetected state transitions to count today's events
  const [prevInsectDetected, setPrevInsectDetected] = useState<boolean | null>(null);

  const navigateToChatWithQuestion = (question: string) => {
    setChatbotQuestion(question);
    setActivePage('ai-assistant');
  };

  // 1. Listen to Firebase Connection Status
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    return onValue(connectedRef, (snap) => {
      setFirebaseConnected(snap.val() === true);
    });
  }, []);

  // 2. Listen to ESP32 Realtime Database Path
  useEffect(() => {
    const trapRef = ref(db, '/agritrap/trap01');
    return onValue(trapRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const sensorUpdate: SensorData = {
          temperature: val.temperature !== undefined ? parseFloat(val.temperature) : null,
          humidity: val.humidity !== undefined ? parseFloat(val.humidity) : null,
          ldr: val.ldrValue !== undefined ? parseInt(val.ldrValue) : null,
          irDetected: val.insectDetected !== undefined ? !!val.insectDetected : null,
          uvStatus: val.uvStatus !== undefined ? !!val.uvStatus : null,
          timestamp: val.lastUpdated ? new Date(val.lastUpdated * 1000).toISOString() : null,
          irValue: val.irValue !== undefined ? parseInt(val.irValue) : null
        };

        setCurrentSensor(sensorUpdate);
        setLastUpdatedVal(val.lastUpdated || null);
        setLoading(false);

        // Track state transitions of insectDetected to log live events
        const isDetected = !!val.insectDetected;
        if (isDetected && prevInsectDetected === false) {
          setIrEventsToday(prev => prev + 1);
          
          // Log new detection event
          const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newEvent: DetectionEvent = {
            id: `det_${Date.now()}`,
            timestamp: timestampStr,
            irDetected: true,
            ldrValue: sensorUpdate.ldr,
            temperature: sensorUpdate.temperature,
            humidity: sensorUpdate.humidity,
            uvStatus: sensorUpdate.uvStatus,
            activityLevel: classifyActivity(irEventsToday + 1, thresholds)
          };
          setDetections(prev => [newEvent, ...prev]);

          // Trigger alert if threshold is breached
          if (irEventsToday + 1 > thresholds.mediumMax) {
            const newAlert: Alert = {
              id: `alert_${Date.now()}`,
              title: 'HIGH INSECT ACTIVITY',
              message: `AgriTrap registered high activity classification with ${irEventsToday + 1} events.`,
              timestamp: timestampStr,
              category: 'Insect Activity',
              severity: 'Warning',
              resolved: false
            };
            setAlerts(prev => [newAlert, ...prev]);
          }
        }
        setPrevInsectDetected(isDetected);
      }
    });
  }, [prevInsectDetected, irEventsToday, thresholds]);

  // 3. Track rolling history for charts
  useEffect(() => {
    if (currentSensor.temperature !== null) {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory(prev => {
        if (prev.length > 0 && prev[prev.length - 1].time === timeString) {
          return prev;
        }
        const updated = [...prev, {
          time: timeString,
          temp: currentSensor.temperature,
          hum: currentSensor.humidity,
          ldr: currentSensor.ldr
        }];
        if (updated.length > 20) {
          return updated.slice(updated.length - 20);
        }
        return updated;
      });
    }
  }, [currentSensor.temperature, currentSensor.humidity, currentSensor.ldr]);

  // 4. Track ESP32 online/offline status via Unix timestamp check
  useEffect(() => {
    if (lastUpdatedVal === null) {
      setEsp32Online(false);
      setFormattedLastUpdated('No Data');
      return;
    }

    const checkStatus = () => {
      const currentUnixTime = Math.floor(Date.now() / 1000);
      const diff = currentUnixTime - lastUpdatedVal;
      setEsp32Online(diff <= 10);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    try {
      const date = new Date(lastUpdatedVal * 1000);
      const formatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setFormattedLastUpdated(formatted);
    } catch (e) {
      setFormattedLastUpdated('No Data');
    }

    return () => clearInterval(interval);
  }, [lastUpdatedVal]);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            currentSensor={currentSensor} 
            irEventsToday={irEventsToday} 
            onNavigate={(page, question) => {
              if (question) {
                navigateToChatWithQuestion(question);
              } else {
                setActivePage(page);
              }
            }}
            activeFieldName={activeFieldName}
            history={history}
            firebaseConnected={firebaseConnected}
            esp32Online={esp32Online}
            formattedLastUpdated={formattedLastUpdated}
          />
        );
      case 'monitoring':
        return <Monitoring currentSensor={currentSensor} activeFieldName={activeFieldName} />;
      case 'insect-activity':
        return <InsectActivity detections={detections} irEventsToday={irEventsToday} />;
      case 'environment':
        return <Environment currentSensor={currentSensor} onAskAI={navigateToChatWithQuestion} history={history} />;
      case 'alerts':
        return <Alerts alerts={alerts} onResolveAlert={handleResolveAlert} onAskAI={navigateToChatWithQuestion} />;
      case 'analytics':
        return <Analytics irEventsToday={irEventsToday} history={history} />;
      case 'ai-assistant':
        return (
          <AIAssistant 
            currentSensor={currentSensor} 
            irEventsToday={irEventsToday} 
            initialQuestion={chatbotQuestion}
            onClearInitialQuestion={() => setChatbotQuestion('')}
          />
        );
      case 'settings':
        return (
          <Settings 
            thresholds={thresholds}
            setThresholds={setThresholds}
            trapName={trapName}
            setTrapName={setTrapName}
            trapId={trapId}
            setTrapId={setTrapId}
            assistantEnabled={assistantEnabled}
            setAssistantEnabled={setAssistantEnabled}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      default:
        return (
          <Dashboard 
            currentSensor={currentSensor} 
            irEventsToday={irEventsToday} 
            onNavigate={setActivePage}
            activeFieldName={activeFieldName}
            history={history}
            firebaseConnected={firebaseConnected}
            esp32Online={esp32Online}
            formattedLastUpdated={formattedLastUpdated}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
        <h2 className="text-emerald-800 font-extrabold text-lg">Loading live sensor data...</h2>
        <p className="text-slate-500 text-xs">Waiting for live data feed from Firebase Realtime Database...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Container */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Header toolbar */}
        <Header 
          firebaseConnected={firebaseConnected}
          esp32Online={esp32Online}
          activeFieldName={activeFieldName}
          setActiveFieldName={setActiveFieldName}
          formattedLastUpdated={formattedLastUpdated}
        />

        {/* Content viewport */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

    </div>
  );
}

