import { Plus, Search, Filter, Download, Tag, List, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const tagColors = [
  'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20',
  'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
  'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
  'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
];

export function Audience() {
  const [selected, setSelected] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [query, setQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadContacts = async () => {
    const data = await api.contacts(query);
    setContacts(data as Array<any>);
  };

  useEffect(() => {
    loadContacts().catch(() => setContacts([]));
  }, [query]);

  const handleCreateContact = async () => {
    setIsCreating(true);
    try {
      await api.createContact({
        name: `New Contact ${new Date().toLocaleDateString()}`,
        email: `new.contact.${Date.now()}@example.com`,
        tags: ['New'],
        list: 'All Subscribers',
        status: 'Active',
        openRate: 0,
        lastActivity: 'Just now',
      });
      await loadContacts();
    } finally {
      setIsCreating(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredContacts = useMemo(() => contacts, [contacts]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Audience</h1>
          <p className="text-muted-foreground">Manage your contacts and segments</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleCreateContact}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
            disabled={isCreating}
          >
            <Plus className="w-5 h-5" />
            <span>{isCreating ? 'Adding...' : 'Add Contact'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Total Contacts</div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white">{contacts.length.toLocaleString()}</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#00D4AA]" />
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white">
            {contacts.filter((contact) => contact.status === 'Active').length.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div className="text-sm text-muted-foreground">Segments</div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white">
            {new Set(contacts.flatMap((contact) => [contact.list, ...(contact.tags || [])])).size.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
              <List className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="text-sm text-muted-foreground">Lists</div>
          </div>
          <div className="text-2xl font-[var(--font-display)] text-white">
            {new Set(contacts.map((contact) => contact.list)).size.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="px-4 py-2.5 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {selected.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-6 py-3 flex items-center justify-between">
          <span className="text-white">
            {selected.length} contact{selected.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Add Tag</span>
            </button>
            <button className="px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors flex items-center gap-2">
              <List className="w-4 h-4" />
              <span>Move List</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Contact</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Tags</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">List</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Last Activity</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">Open Rate</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selected.includes(contact.id)}
                      onChange={() => toggleSelect(contact.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#8B5CF6] flex items-center justify-center text-white">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {contact.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-2 py-1 rounded-md text-xs border ${
                            tagColors[tagIndex % tagColors.length]
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{contact.list}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{contact.lastActivity}</td>
                  <td className="px-6 py-4 text-sm text-right text-white">{contact.openRate}%</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs border ${
                        contact.status === 'Active'
                          ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20'
                          : 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20'
                      }`}
                    >
                      {contact.status}
                    </span>
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
