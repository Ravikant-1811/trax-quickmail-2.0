import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Campaigns } from './components/Campaigns';
import { Automations } from './components/Automations';
import { Audience } from './components/Audience';
import { Templates } from './components/Templates';
import { Scheduler } from './components/Scheduler';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="size-full flex bg-background dark">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'campaigns' && <Campaigns />}
        {activeView === 'automations' && <Automations />}
        {activeView === 'audience' && <Audience />}
        {activeView === 'templates' && <Templates />}
        {activeView === 'scheduler' && <Scheduler />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'settings' && <Settings />}
      </main>
    </div>
  );
}