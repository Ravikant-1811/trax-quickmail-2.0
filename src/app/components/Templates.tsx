import { Plus, Search, Eye, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const categories = ['All', 'Welcome', 'Promotional', 'Transactional', 'Newsletter', 'Re-engagement', 'Event'];

export function Templates() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Array<any>>([]);

  useEffect(() => {
    api.templates()
      .then((data) => setTemplates(data as Array<any>))
      .catch(() => setTemplates([]));
  }, []);

  const filteredTemplates = useMemo(() => templates.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery, templates]);

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
