import { MoreVertical } from 'lucide-react';

const statusColors = {
  Sent: 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20',
  Scheduled: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  Draft: 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20',
  Paused: 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
};

export function RecentCampaigns({ campaigns }: { campaigns: Array<Record<string, unknown>> }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-display)] text-xl text-white">Recent Campaigns</h2>
        <button className="text-sm text-primary hover:text-primary/80">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-3 text-sm text-muted-foreground">Campaign</th>
              <th className="text-left pb-3 text-sm text-muted-foreground">Status</th>
              <th className="text-right pb-3 text-sm text-muted-foreground">Sent</th>
              <th className="text-right pb-3 text-sm text-muted-foreground">Open Rate</th>
              <th className="text-right pb-3 text-sm text-muted-foreground">Click Rate</th>
              <th className="text-right pb-3 text-sm text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign: any, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="py-4 text-sm text-white">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{campaign.date}</div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${
                      statusColors[campaign.status as keyof typeof statusColors]
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-right text-muted-foreground">{campaign.sent}</td>
                <td className="py-4 text-sm text-right text-muted-foreground">
                  {campaign.openRate}
                </td>
                <td className="py-4 text-sm text-right text-muted-foreground">
                  {campaign.clickRate}
                </td>
                <td className="py-4 text-right">
                  <button className="p-1 hover:bg-secondary rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
