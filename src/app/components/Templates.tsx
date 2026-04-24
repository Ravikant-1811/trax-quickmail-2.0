import { Plus, Search, Eye, Copy } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'Welcome', 'Promotional', 'Transactional', 'Newsletter', 'Re-engagement', 'Event'];

const templates = [
  {
    id: '1',
    name: 'Welcome Email',
    category: 'Welcome',
    preview: 'A warm welcome message for new subscribers',
    thumbnail: 'linear-gradient(135deg, #00D4AA 0%, #0EA5E9 100%)',
  },
  {
    id: '2',
    name: 'Product Launch',
    category: 'Promotional',
    preview: 'Announce your latest product with style',
    thumbnail: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  },
  {
    id: '3',
    name: 'Order Confirmation',
    category: 'Transactional',
    preview: 'Professional order receipt and details',
    thumbnail: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
  },
  {
    id: '4',
    name: 'Weekly Newsletter',
    category: 'Newsletter',
    preview: 'Clean newsletter layout with content blocks',
    thumbnail: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  },
  {
    id: '5',
    name: 'Flash Sale',
    category: 'Promotional',
    preview: 'Eye-catching sale announcement',
    thumbnail: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
  },
  {
    id: '6',
    name: 'We Miss You',
    category: 'Re-engagement',
    preview: 'Win back inactive subscribers',
    thumbnail: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  },
  {
    id: '7',
    name: 'Event Invitation',
    category: 'Event',
    preview: 'Elegant event invitation template',
    thumbnail: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
  },
  {
    id: '8',
    name: 'Password Reset',
    category: 'Transactional',
    preview: 'Simple and secure password reset',
    thumbnail: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
  },
  {
    id: '9',
    name: 'Customer Feedback',
    category: 'Newsletter',
    preview: 'Request reviews and testimonials',
    thumbnail: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  {
    id: '10',
    name: 'Cart Abandonment',
    category: 'Promotional',
    preview: 'Recover abandoned shopping carts',
    thumbnail: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
  {
    id: '11',
    name: 'Webinar Reminder',
    category: 'Event',
    preview: 'Remind attendees about upcoming webinars',
    thumbnail: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  },
  {
    id: '12',
    name: 'Thank You',
    category: 'Welcome',
    preview: 'Express gratitude to your customers',
    thumbnail: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  },
];

export function Templates() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Template Library</h1>
          <p className="text-muted-foreground">Choose from pre-built email templates</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
          <Plus className="w-5 h-5" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="group bg-card border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="text-center">
            <div className="text-white mb-1">Blank Template</div>
            <div className="text-sm text-muted-foreground">Start from scratch</div>
          </div>
        </div>

        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer"
          >
            <div
              className="h-48 relative"
              style={{ background: template.thumbnail }}
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>Use</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">{template.name}</h3>
                <span className="px-2 py-1 rounded-md text-xs bg-secondary text-muted-foreground">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{template.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
