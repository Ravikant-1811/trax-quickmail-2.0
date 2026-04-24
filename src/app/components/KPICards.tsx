import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const kpiData = [
  {
    id: 'total-sent',
    label: 'Total Sent',
    value: '248,543',
    change: '+12.5%',
    trend: 'up',
    sparklineData: [
      { id: 'ts-1', value: 30 },
      { id: 'ts-2', value: 45 },
      { id: 'ts-3', value: 38 },
      { id: 'ts-4', value: 52 },
      { id: 'ts-5', value: 48 },
      { id: 'ts-6', value: 65 },
      { id: 'ts-7', value: 72 },
    ],
  },
  {
    id: 'open-rate',
    label: 'Open Rate',
    value: '34.2%',
    change: '+3.8%',
    trend: 'up',
    sparklineData: [
      { id: 'or-1', value: 28 },
      { id: 'or-2', value: 32 },
      { id: 'or-3', value: 30 },
      { id: 'or-4', value: 35 },
      { id: 'or-5', value: 33 },
      { id: 'or-6', value: 36 },
      { id: 'or-7', value: 34 },
    ],
  },
  {
    id: 'click-rate',
    label: 'Click Rate',
    value: '8.7%',
    change: '+1.2%',
    trend: 'up',
    sparklineData: [
      { id: 'cr-1', value: 6 },
      { id: 'cr-2', value: 7 },
      { id: 'cr-3', value: 8 },
      { id: 'cr-4', value: 7.5 },
      { id: 'cr-5', value: 8.2 },
      { id: 'cr-6', value: 8.5 },
      { id: 'cr-7', value: 8.7 },
    ],
  },
  {
    id: 'unsubscribes',
    label: 'Unsubscribes',
    value: '342',
    change: '-2.1%',
    trend: 'down',
    sparklineData: [
      { id: 'us-1', value: 15 },
      { id: 'us-2', value: 12 },
      { id: 'us-3', value: 18 },
      { id: 'us-4', value: 14 },
      { id: 'us-5', value: 13 },
      { id: 'us-6', value: 11 },
      { id: 'us-7', value: 10 },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue Attributed',
    value: '$127,450',
    change: '+24.3%',
    trend: 'up',
    sparklineData: [
      { id: 'rv-1', value: 80 },
      { id: 'rv-2', value: 90 },
      { id: 'rv-3', value: 85 },
      { id: 'rv-4', value: 100 },
      { id: 'rv-5', value: 110 },
      { id: 'rv-6', value: 120 },
      { id: 'rv-7', value: 127 },
    ],
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <div
                className={`flex items-center gap-1 text-xs ${
                  kpi.trend === 'up' ? 'text-[#00D4AA]' : 'text-[#F5A623]'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{kpi.change}</span>
              </div>
            </div>

            <div className="text-2xl font-[var(--font-display)] text-white">
              {kpi.value}
            </div>

            <div className="h-12 w-full -mx-2">
              <ResponsiveContainer width="100%" height={48} minWidth={0}>
                <LineChart data={kpi.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={kpi.trend === 'up' ? '#00D4AA' : '#F5A623'}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
