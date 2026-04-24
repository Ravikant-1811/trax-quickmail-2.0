import { Plus } from 'lucide-react';
import { KPICards } from './KPICards';
import { RecentCampaigns } from './RecentCampaigns';
import { AudienceGrowthChart } from './AudienceGrowthChart';

export function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
        </div>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentCampaigns />
        <AudienceGrowthChart />
      </div>

      <button
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        aria-label="New Campaign"
      >
        <Plus className="w-5 h-5" />
        <span>New Campaign</span>
      </button>
    </div>
  );
}
