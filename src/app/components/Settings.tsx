import { User, Globe, Key, Users, CreditCard, Bell, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'domains', label: 'Sending Domains', icon: Globe },
  { id: 'api', label: 'API & Integrations', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const integrations = [
  { name: 'Zapier', description: 'Connect with 5,000+ apps', status: 'Connected', logo: 'bg-[#FF4A00]' },
  { name: 'Shopify', description: 'Sync your store data', status: 'Not Connected', logo: 'bg-[#96BF48]' },
  { name: 'WordPress', description: 'Embed signup forms', status: 'Not Connected', logo: 'bg-[#21759B]' },
  { name: 'HubSpot', description: 'CRM integration', status: 'Connected', logo: 'bg-[#FF7A59]' },
  { name: 'Slack', description: 'Get campaign notifications', status: 'Connected', logo: 'bg-[#4A154B]' },
];

const teamMembers = [
  { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Admin', status: 'Active' },
  { name: 'Michael Chen', email: 'michael@company.com', role: 'Editor', status: 'Active' },
  { name: 'Emma Williams', email: 'emma@company.com', role: 'Viewer', status: 'Active' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('account');

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
                      defaultValue="John Doe"
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue="john@company.com"
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Timezone</label>
                      <select className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>UTC-7 (Pacific)</option>
                        <option>UTC-5 (Eastern)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Language</label>
                      <select className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
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
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  Add Domain
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { domain: 'mail.company.com', dkim: true, spf: true },
                  { domain: 'news.company.com', dkim: true, spf: false },
                ].map((domain, index) => (
                  <div key={index} className="p-4 bg-secondary/30 border border-border rounded-lg">
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
                      <button className="px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-secondary transition-colors">
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
                      <div className="font-[var(--font-mono)] text-sm text-muted-foreground">trax_••••••••••••••••••••3x7k</div>
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
                  {integrations.map((integration, index) => (
                    <div key={index} className="p-4 bg-secondary/30 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${integration.logo} rounded-lg`} />
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
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-4 bg-secondary/30 border border-border rounded-lg">
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
                      <div className="text-2xl font-[var(--font-display)] text-white mb-1">Pro Plan</div>
                      <div className="text-muted-foreground">$99/month</div>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                      Upgrade
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Emails Sent</div>
                      <div className="text-lg text-white">248,543 / 500,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Contacts</div>
                      <div className="text-lg text-white">54,300 / 100,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Team Members</div>
                      <div className="text-lg text-white">3 / 10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-[var(--font-display)] text-xl text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Campaign sent successfully', enabled: true },
                  { label: 'Campaign failed to send', enabled: true },
                  { label: 'Daily performance summary', enabled: false },
                  { label: 'Weekly reports', enabled: true },
                  { label: 'New subscriber notifications', enabled: false },
                  { label: 'Automation completed', enabled: true },
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-lg">
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
