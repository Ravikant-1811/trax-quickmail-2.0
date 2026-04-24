import { Plus, Play, Pause, Users, Mail, Clock, GitBranch } from 'lucide-react';

const automations = [
  {
    id: '1',
    name: 'Welcome Series',
    status: 'Active',
    trigger: 'Subscribed to list',
    enrolled: 1245,
    completed: 987,
    conversionRate: 23.4,
    nodes: 5,
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    status: 'Active',
    trigger: 'Cart abandoned',
    enrolled: 834,
    completed: 412,
    conversionRate: 18.7,
    nodes: 4,
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    status: 'Paused',
    trigger: 'No opens in 90 days',
    enrolled: 2341,
    completed: 1456,
    conversionRate: 8.2,
    nodes: 6,
  },
  {
    id: '4',
    name: 'Birthday Campaign',
    status: 'Active',
    trigger: 'Birthday date',
    enrolled: 567,
    completed: 534,
    conversionRate: 31.2,
    nodes: 3,
  },
];

const templates = [
  { name: 'Welcome Series', icon: Mail, description: '3-email onboarding sequence' },
  { name: 'Abandoned Cart', icon: GitBranch, description: 'Recover lost sales automatically' },
  { name: 'Re-engagement', icon: Clock, description: 'Win back inactive subscribers' },
  { name: 'Drip Sequence', icon: Users, description: 'Nurture leads over time' },
];

export function Automations() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Automations</h1>
          <p className="text-muted-foreground">Build automated email workflows</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
          <Plus className="w-5 h-5" />
          <span>New Automation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {templates.map((template, index) => {
          const Icon = template.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="font-[var(--font-display)] text-xl text-white mb-4">Active Automations</h2>
        <div className="space-y-3">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      automation.status === 'Active'
                        ? 'bg-[#00D4AA]/10 text-[#00D4AA] hover:bg-[#00D4AA]/20'
                        : 'bg-[#9CA3AF]/10 text-[#9CA3AF] hover:bg-[#9CA3AF]/20'
                    }`}
                  >
                    {automation.status === 'Active' ? (
                      <Play className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <Pause className="w-5 h-5" fill="currentColor" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-lg">{automation.name}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs border ${
                          automation.status === 'Active'
                            ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20'
                            : 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20'
                        }`}
                      >
                        {automation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>Trigger: {automation.trigger}</span>
                      <span>•</span>
                      <span>{automation.nodes} steps</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl text-white">{automation.enrolled}</div>
                    <div className="text-xs text-muted-foreground">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-white">{automation.completed}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#00D4AA]">{automation.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
