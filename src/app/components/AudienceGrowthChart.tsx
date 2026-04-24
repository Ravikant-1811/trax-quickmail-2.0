import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data30 = [
  { date: 'Mar 25', subscribers: 42000 },
  { date: 'Mar 28', subscribers: 43200 },
  { date: 'Apr 1', subscribers: 44500 },
  { date: 'Apr 5', subscribers: 46800 },
  { date: 'Apr 10', subscribers: 48200 },
  { date: 'Apr 15', subscribers: 50100 },
  { date: 'Apr 20', subscribers: 52400 },
  { date: 'Apr 24', subscribers: 54300 },
];

const data60 = [
  { date: 'Feb 24', subscribers: 35000 },
  { date: 'Mar 5', subscribers: 37200 },
  { date: 'Mar 15', subscribers: 39800 },
  { date: 'Mar 25', subscribers: 42000 },
  { date: 'Apr 5', subscribers: 46800 },
  { date: 'Apr 15', subscribers: 50100 },
  { date: 'Apr 24', subscribers: 54300 },
];

const data90 = [
  { date: 'Jan 24', subscribers: 28000 },
  { date: 'Feb 10', subscribers: 32000 },
  { date: 'Feb 25', subscribers: 36500 },
  { date: 'Mar 12', subscribers: 40200 },
  { date: 'Mar 28', subscribers: 45000 },
  { date: 'Apr 12', subscribers: 49800 },
  { date: 'Apr 24', subscribers: 54300 },
];

const dataMap = {
  '30': data30,
  '60': data60,
  '90': data90,
};

export function AudienceGrowthChart() {
  const [period, setPeriod] = useState<'30' | '60' | '90'>('30');

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-display)] text-xl text-white">Audience Growth</h2>
        <div className="flex gap-2">
          {(['30', '60', '90'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                period === days
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-white'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataMap[period]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1D24',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Subscribers']}
            />
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#00D4AA"
              strokeWidth={3}
              dot={{ fill: '#00D4AA', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div>
          <div className="text-2xl font-[var(--font-display)] text-white">54,300</div>
          <div className="text-sm text-muted-foreground">Total Subscribers</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="text-lg text-[#00D4AA]">+12,300</div>
          <div className="text-sm text-muted-foreground">Last {period} days</div>
        </div>
      </div>
    </div>
  );
}
