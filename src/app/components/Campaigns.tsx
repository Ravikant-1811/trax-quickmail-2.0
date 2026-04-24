import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const statusColors = {
  Sent: 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20',
  Scheduled: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  Draft: 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20',
  Paused: 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
  Active: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
};

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadCampaigns = async () => {
    const data = await api.campaigns(searchQuery);
    setCampaigns(data as Array<any>);
  };

  useEffect(() => {
    loadCampaigns().catch(() => setCampaigns([]));
  }, [searchQuery]);

  const filteredCampaigns = useMemo(
    () => campaigns.filter((campaign) => {
      const query = searchQuery.toLowerCase();
      return [campaign.name, campaign.subject, campaign.segment, campaign.status]
        .some((value) => String(value || '').toLowerCase().includes(query));
    }),
    [campaigns, searchQuery]
  );

  const handleCreateCampaign = async () => {
    setIsSaving(true);
    try {
      await api.createCampaign({
        name: `New Campaign ${new Date().toLocaleDateString()}`,
        subject: 'Draft subject line',
        segment: 'All Subscribers',
        scheduledAt: '',
      });
      await loadCampaigns();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your email campaigns</p>
        </div>
        <button
          onClick={handleCreateCampaign}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
          disabled={isSaving}
        >
          <Plus className="w-5 h-5" />
          <span>{isSaving ? 'Creating...' : 'New Campaign'}</span>
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="px-4 py-2.5 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Campaign Name</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Segment</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">Sent</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">Open Rate</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">Click Rate</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">Date</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white mb-1">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${
                        statusColors[campaign.status as keyof typeof statusColors]
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.segment}</td>
                  <td className="px-6 py-4 text-sm text-right text-white">
                    {campaign.sent > 0 ? campaign.sent.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-white">
                    {campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-white">
                    {campaign.clickRate > 0 ? `${campaign.clickRate}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                    {campaign.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      onClick={async () => {
                        if (campaign.status !== 'Sent') {
                          await api.sendCampaign(campaign.id);
                          await loadCampaigns();
                        }
                      }}
                      title={campaign.status !== 'Sent' ? 'Send campaign' : 'Already sent'}
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
