import { ChevronLeft, ChevronRight, Clock, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';

const scheduledCampaigns = [
  {
    id: '1',
    name: 'Weekly Newsletter #247',
    time: '09:00 AM',
    date: 'Apr 26, 2026',
    segment: 'Newsletter Subscribers',
    count: 32450,
    color: 'bg-[#00D4AA]',
  },
  {
    id: '2',
    name: 'Product Update',
    time: '02:00 PM',
    date: 'Apr 27, 2026',
    segment: 'All Active Users',
    count: 48230,
    color: 'bg-[#8B5CF6]',
  },
  {
    id: '3',
    name: 'Flash Sale Reminder',
    time: '10:30 AM',
    date: 'Apr 28, 2026',
    segment: 'High Engagement',
    count: 12100,
    color: 'bg-[#F5A623]',
  },
  {
    id: '4',
    name: 'Monthly Roundup',
    time: '08:00 AM',
    date: 'May 1, 2026',
    segment: 'All Subscribers',
    count: 54300,
    color: 'bg-[#3B82F6]',
  },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarDays = [
  { day: 28, month: 'prev', events: [] },
  { day: 29, month: 'prev', events: [] },
  { day: 30, month: 'prev', events: [] },
  { day: 1, month: 'current', events: [] },
  { day: 2, month: 'current', events: [] },
  { day: 3, month: 'current', events: [] },
  { day: 4, month: 'current', events: [] },
  { day: 5, month: 'current', events: [] },
  { day: 6, month: 'current', events: [] },
  { day: 7, month: 'current', events: [] },
  { day: 8, month: 'current', events: [] },
  { day: 9, month: 'current', events: [] },
  { day: 10, month: 'current', events: [] },
  { day: 11, month: 'current', events: [] },
  { day: 12, month: 'current', events: [] },
  { day: 13, month: 'current', events: [] },
  { day: 14, month: 'current', events: [] },
  { day: 15, month: 'current', events: [] },
  { day: 16, month: 'current', events: [] },
  { day: 17, month: 'current', events: [] },
  { day: 18, month: 'current', events: [] },
  { day: 19, month: 'current', events: [] },
  { day: 20, month: 'current', events: [] },
  { day: 21, month: 'current', events: [] },
  { day: 22, month: 'current', events: [] },
  { day: 23, month: 'current', events: [] },
  { day: 24, month: 'current', events: [{ name: 'Today', color: 'bg-primary' }] },
  { day: 25, month: 'current', events: [] },
  { day: 26, month: 'current', events: [{ name: 'Weekly Newsletter', color: 'bg-[#00D4AA]' }] },
  { day: 27, month: 'current', events: [{ name: 'Product Update', color: 'bg-[#8B5CF6]' }] },
  { day: 28, month: 'current', events: [{ name: 'Flash Sale', color: 'bg-[#F5A623]' }] },
  { day: 29, month: 'current', events: [] },
  { day: 30, month: 'current', events: [] },
  { day: 1, month: 'next', events: [{ name: 'Monthly Roundup', color: 'bg-[#3B82F6]' }] },
  { day: 2, month: 'next', events: [] },
];

export function Scheduler() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Scheduler</h1>
          <p className="text-muted-foreground">Plan and schedule your campaigns</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-white transition-colors">
            UTC-7 (Pacific)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="font-[var(--font-display)] text-xl text-white">April 2026</h2>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex gap-2">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                    view === v
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`aspect-square border rounded-lg p-2 transition-colors ${
                  dayData.month === 'current'
                    ? dayData.day === 24
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 cursor-pointer'
                    : 'border-border/50 bg-secondary/20'
                }`}
              >
                <div
                  className={`text-sm mb-1 ${
                    dayData.month === 'current'
                      ? dayData.day === 24
                        ? 'text-primary'
                        : 'text-white'
                      : 'text-muted-foreground'
                  }`}
                >
                  {dayData.day}
                </div>
                {dayData.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`${event.color} text-white text-xs px-1 py-0.5 rounded mt-1 truncate`}
                  >
                    {event.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-[var(--font-display)] text-lg text-white mb-4">Upcoming Sends</h3>
            <div className="space-y-3">
              {scheduledCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-3 bg-secondary/30 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-1 h-full ${campaign.color} rounded-full`} />
                    <div className="flex-1">
                      <div className="text-white text-sm mb-1">{campaign.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {campaign.date} at {campaign.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>
                          {campaign.count.toLocaleString()} recipients
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-[#8B5CF6]/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-[var(--font-display)] text-white">Best Time to Send</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your audience engagement patterns, we recommend:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Tuesday</span>
                <span className="text-primary">9:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Thursday</span>
                <span className="text-primary">2:00 PM - 4:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
