import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const performanceData = [
  { month: 'Jan', opens: 28000, clicks: 8400, conversions: 1680 },
  { month: 'Feb', opens: 32000, clicks: 9600, conversions: 1920 },
  { month: 'Mar', opens: 35000, clicks: 10500, conversions: 2100 },
  { month: 'Apr', opens: 38000, clicks: 11400, conversions: 2280 },
];

const deviceData = [
  { name: 'Desktop', value: 45, color: '#00D4AA' },
  { name: 'Mobile', value: 42, color: '#8B5CF6' },
  { name: 'Tablet', value: 13, color: '#F5A623' },
];

const topCampaigns = [
  { name: 'Spring Product Launch', sent: 45230, opens: 17288, clicks: 4116, openRate: 38.2, clickRate: 9.1 },
  { name: 'Customer Feedback Survey', sent: 18450, opens: 7841, clicks: 2823, openRate: 42.5, clickRate: 15.3 },
  { name: 'Abandoned Cart Recovery', sent: 8945, opens: 3758, clicks: 1431, openRate: 42.0, clickRate: 16.0 },
  { name: 'Weekly Newsletter #245', sent: 32100, opens: 11214, clicks: 2889, openRate: 34.9, clickRate: 9.0 },
  { name: 'Flash Sale Alert', sent: 12100, opens: 3473, clicks: 750, openRate: 28.7, clickRate: 6.2 },
];

export function Analytics() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Analytics</h1>
          <p className="text-muted-foreground">Track performance and insights</p>
        </div>
        <button className="px-6 py-3 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Sent</span>
            <div className="flex items-center gap-1 text-xs text-[#00D4AA]">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5%</span>
            </div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white mb-1">248,543</div>
          <div className="text-xs text-muted-foreground">vs last period</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Deliveries</span>
            <div className="flex items-center gap-1 text-xs text-[#00D4AA]">
              <TrendingUp className="w-3 h-3" />
              <span>+11.8%</span>
            </div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white mb-1">245,892</div>
          <div className="text-xs text-muted-foreground">98.9% delivery rate</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Opens</span>
            <div className="flex items-center gap-1 text-xs text-[#00D4AA]">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2%</span>
            </div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white mb-1">84,096</div>
          <div className="text-xs text-muted-foreground">34.2% open rate</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Clicks</span>
            <div className="flex items-center gap-1 text-xs text-[#F5A623]">
              <TrendingDown className="w-3 h-3" />
              <span>-1.4%</span>
            </div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white mb-1">21,623</div>
          <div className="text-xs text-muted-foreground">8.7% click rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="font-[var(--font-display)] text-lg text-white mb-6">Performance Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1D24',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="opens" fill="#00D4AA" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" fill="#F5A623" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-[var(--font-display)] text-lg text-white mb-6">Device Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1D24',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm text-white">{device.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-[var(--font-display)] text-lg text-white mb-6">Top Performing Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3 text-sm text-muted-foreground">Campaign</th>
                <th className="text-right pb-3 text-sm text-muted-foreground">Sent</th>
                <th className="text-right pb-3 text-sm text-muted-foreground">Opens</th>
                <th className="text-right pb-3 text-sm text-muted-foreground">Clicks</th>
                <th className="text-right pb-3 text-sm text-muted-foreground">Open Rate</th>
                <th className="text-right pb-3 text-sm text-muted-foreground">Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-4 text-sm text-white">{campaign.name}</td>
                  <td className="py-4 text-sm text-right text-muted-foreground">
                    {campaign.sent.toLocaleString()}
                  </td>
                  <td className="py-4 text-sm text-right text-muted-foreground">
                    {campaign.opens.toLocaleString()}
                  </td>
                  <td className="py-4 text-sm text-right text-muted-foreground">
                    {campaign.clicks.toLocaleString()}
                  </td>
                  <td className="py-4 text-sm text-right text-white">{campaign.openRate}%</td>
                  <td className="py-4 text-sm text-right text-white">{campaign.clickRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
