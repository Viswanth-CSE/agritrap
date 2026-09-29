import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Bug, 
  Thermometer, 
  Bell, 
  BarChart3, 
  MessageSquare, 
  Settings as SettingsIcon, 
  HelpCircle,
  Leaf
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', name: 'Live Monitoring', icon: Video },
    { id: 'insect-activity', name: 'Insect Activity', icon: Bug },
    { id: 'environment', name: 'Environment', icon: Thermometer },
    { id: 'alerts', name: 'Alerts', icon: Bell },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'ai-assistant', name: 'AI Assistant', icon: MessageSquare },
  ];

  const bottomItems = [
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center">
          <Leaf className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wider">🌱 AGRITRAP</h1>
          <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">AI IoT Monitor</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}

        <div className="my-6 border-t border-slate-850 px-4"></div>

        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-700 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>AgriTrap Dashboard v1.0</p>
        <p className="mt-1 text-[10px] text-emerald-500">System Connected</p>
      </div>
    </aside>
  );
}
