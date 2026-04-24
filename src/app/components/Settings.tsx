import { User, Globe, Key, Users, CreditCard, Bell, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'domains', label: 'Sending Domains', icon: Globe },
  { id: 'api', label: 'API & Integrations', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState<any>(null);
  const [account, setAccount] = useState({
    name: '',
    email: '',
    timezone: 'Asia/Kolkata',
    language: 'English',
  });

  const loadSettings = async () => {
    const data = (await api.settings()) as any;
    setSettings(data);
    setAccount({
      name: data.account?.name || '',
      email: data.account?.email || '',
      timezone: data.account?.timezone || 'Asia/Kolkata',
      language: data.account?.language || 'English',
    });
  };

  useEffect(() => {
    loadSettings().catch(() => setSettings(null));
  }, []);

  const integrations = settings?.integrations || [];
  const teamMembers = settings?.team || [];
  const domains = settings?.domains || [];
  const billing = settings?.billing || {};
  const notifications = settings?.notifications || [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-white mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-white hover:border-primary/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'account' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl text-white mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={account.name}
                      onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={account.email}
                      onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Timezone</label>
                      <select
                        value={account.timezone}
                        onChange={(e) => setAccount((prev) => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC-7 (Pacific)">UTC-7 (Pacific)</option>
                        <option value="UTC-5 (Eastern)">UTC-5 (Eastern)</option>
                        <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Language</label>
                      <select
                        value={account.language}
                        onChange={(e) => setAccount((prev) => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await api.updateSettings({ account });
                      await loadSettings();
                    }}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[var(--font-display)] text-xl text-white">Sending Domains</h2>
                <button
                  onClick={async () => {
                    await api.addDomain({ domain: `mail-${Date.now()}.example.com` });
                    await loadSettings();
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  Add Domain
                </button>
              </div>
              <div className="space-y-3">
                {domains.map((domain: any) => (
                  <div key={domain.id} className="p-4 bg-secondary/30 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white mb-2">{domain.domain}</div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            {domain.dkim ? (
                              <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                            )}
                            <span className={domain.dkim ? 'text-[#00D4AA]' : 'text-[#EF4444]'}>DKIM</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            {domain.spf ? (
                              <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                            )}
                            <span className={domain.spf ? 'text-[#00D4AA]' : 'text-[#EF4444]'}>SPF</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await api.verifyDomain(domain.id);
                          await loadSettings();
                        }}
                        className="px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl text-white mb-4">API Keys</h2>
                <div className="p-4 bg-secondary/30 border border-border rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white mb-1">Production API Key</div>
                      <div className="font-[var(--font-mono)] text-sm text-muted-foreground">
                        trax_••••••••••••••••••••3x7k
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors">
                      Reveal
                    </button>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  Generate New Key
                </button>
              </div>

              <div>
                <h2 className="font-[var(--font-display)] text-xl text-white mb-4">Integrations</h2>
                <div className="space-y-3">
                  {integrations.map((integration: any) => (
                    <div key={integration.id} className="p-4 bg-secondary/30 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: integration.color }} />
                          <div>
                            <div className="text-white">{integration.name}</div>
                            <div className="text-sm text-muted-foreground">{integration.description}</div>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            integration.status === 'Connected'
                              ? 'bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20'
                              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          }`}
                        >
                          {integration.status === 'Connected' ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[var(--font-display)] text-xl text-white">Team Members</h2>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  Invite Member
                </button>
              </div>
              <div className="space-y-3">
                {teamMembers.map((member: any) => (
                  <div key={member.id} className="p-4 bg-secondary/30 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#8B5CF6] flex items-center justify-center text-white">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select className="px-3 py-1.5 bg-card border border-border rounded-lg text-white text-sm">
                          <option>{member.role}</option>
                          <option>Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                        <span className="px-2.5 py-1 rounded-full text-xs bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl text-white mb-4">Current Plan</h2>
                <div className="p-6 bg-gradient-to-br from-primary/10 to-[#8B5CF6]/10 border border-primary/20 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-[var(--font-display)] text-white mb-1">{billing.plan || 'Pro Plan'}</div>
                      <div className="text-muted-foreground">
                        ${billing.price || 99}/{billing.period || 'month'}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                      Upgrade
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Emails Sent</div>
                      <div className="text-lg text-white">
                        {(billing.sent || 0).toLocaleString()} / {(billing.limit || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Contacts</div>
                      <div className="text-lg text-white">{(settings?.team?.length || 0).toLocaleString()} team members</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Renewal</div>
                      <div className="text-lg text-white">{billing.renewalDate || 'May 2026'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-[var(--font-display)] text-xl text-white mb-4">Invoice History</h2>
                <div className="space-y-3">
                  {(billing.invoices || []).map((invoice: any) => (
                    <div key={invoice.id} className="p-4 bg-secondary/30 border border-border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-white">{invoice.number}</div>
                        <div className="text-sm text-muted-foreground">{invoice.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">${invoice.amount}</div>
                        <div className="text-sm text-[#00D4AA]">{invoice.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-[var(--font-display)] text-xl text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {notifications.map((notification: any) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-lg">
                    <span className="text-white">{notification.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
