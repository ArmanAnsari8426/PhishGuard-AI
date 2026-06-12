import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Calendar, AlertTriangle, CheckCircle2, Trash2, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function DomainMonitorPage() {
  const { isDark } = useTheme();
  const [domain, setDomain] = useState('');
  const [monitors, setMonitors] = useState([
    { id: 1, domain: 'mycompany.com', expiry: '2025-08-15', daysLeft: 245, ssl: 'Valid', status: 'Active' },
    { id: 2, domain: 'phishguard.ai', expiry: '2025-12-30', daysLeft: 351, ssl: 'Valid', status: 'Active' },
    { id: 3, domain: 'old-site.tk', expiry: '2025-01-10', daysLeft: 5, ssl: 'Expiring', status: 'Warning' },
  ]);

  const addMonitor = () => {
    if (!domain.trim()) return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 365);
    setMonitors([...monitors, {
      id: Date.now(),
      domain: domain.trim(),
      expiry: expiry.toISOString().split('T')[0],
      daysLeft: 365,
      ssl: 'Valid',
      status: 'Active'
    }]);
    setDomain('');
  };

  const removeMonitor = (id: number) => {
    setMonitors(monitors.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-orange/20 to-cyber-yellow/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Globe className="w-10 h-10 text-cyber-orange" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Domain <span className="gradient-text">Monitor</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track domain expiration, SSL certificates, and DNS changes
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMonitor()}
              placeholder="Enter domain to monitor (e.g., example.com)"
              className={`flex-1 px-4 py-3 rounded-xl text-sm transition-all outline-none ${
                isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
              }`}
            />
            <button onClick={addMonitor}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Domain
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Globe, label: 'Monitored Domains', value: monitors.length, color: 'text-cyber-blue' },
            { icon: AlertTriangle, label: 'Expiring Soon', value: monitors.filter(m => m.daysLeft < 30).length, color: 'text-rose-400' },
            { icon: Shield, label: 'SSL Valid', value: monitors.filter(m => m.ssl === 'Valid').length, color: 'text-cyber-green' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Domain</th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expiry</th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days Left</th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SSL</th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/20">
                {monitors.map(m => (
                  <tr key={m.id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyber-blue" />
                        <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.domain}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {m.expiry}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${m.daysLeft < 30 ? 'text-rose-400' : m.daysLeft < 90 ? 'text-yellow-400' : 'text-cyber-green'}`}>
                        {m.daysLeft}d
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        m.ssl === 'Valid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {m.ssl}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {m.daysLeft < 30 ? (
                        <span className="flex items-center gap-1 text-rose-400 text-sm">
                          <AlertTriangle className="w-3 h-3" /> Expiring
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-cyber-green text-sm">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeMonitor(m.id)}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
