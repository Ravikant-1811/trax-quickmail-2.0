import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

type KPIItem = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  sparklineData: Array<{ value: number }>;
};

export function KPICards({ items }: { items: KPIItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((kpi) => (
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
