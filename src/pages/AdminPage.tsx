import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Shield, Trash2, Ban, Activity, Search, BarChart3,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getAllUsers, deleteUser, isAdmin } from '../utils/auth';
import { getScanHistory, getScanStats, getBlockedDomains, blockDomain, unblockDomain } from '../utils/storage';
import type { User } from '../utils/auth';
import type { ScanResult } from '../utils/urlAnalyzer';
import { getCategoryColor } from '../utils/urlAnalyzer';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function AdminPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState({
    total: 0, safe: 0, lowRisk: 0, suspicious: 0, highRisk: 0, phishing: 0,
    dailyScans: {} as Record<string, number>, last7Days: [] as string[],
    averageRiskScore: 0,
  });
  const [blockedDomains, setBlockedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'scans' | 'blocked'>('overview');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    setUsers(getAllUsers());
    setScans(getScanHistory());
    setStats(getScanStats());
    setBlockedDomains(getBlockedDomains());
  }, [navigate]);

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setUsers(getAllUsers());
    }
  };

  const handleBlockDomain = () => {
    if (newDomain.trim()) {
      blockDomain(newDomain.trim());
      setBlockedDomains(getBlockedDomains());
      setNewDomain('');
    }
  };

  const handleUnblockDomain = (domain: string) => {
    unblockDomain(domain);
    setBlockedDomains(getBlockedDomains());
  };

  const chartData = stats.last7Days.map(day => ({
    date: day.slice(5),
    scans: stats.dailyScans[day] || 0,
  }));

  const statCards = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10' },
    { label: 'Total Scans', value: stats.total, icon: BarChart3, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10' },
    { label: 'Threats Found', value: stats.suspicious + stats.highRisk + stats.phishing, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Blocked Domains', value: blockedDomains.length, icon: Ban, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'scans' as const, label: 'Scan Logs', icon: Search },
    { id: 'blocked' as const, label: 'Blocked', icon: Ban },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-cyber-blue" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage users, monitor scans, and control blocked domains
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white'
                  : isDark
                  ? 'glass text-slate-300 hover:border-cyber-blue/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-cyber-blue/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`rounded-2xl p-5 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div className="text-2xl font-bold gradient-text">{card.value}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
              >
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Daily Scan Activity
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="date" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={12} />
                    <YAxis stroke={isDark ? '#475569' : '#94a3b8'} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#111827' : '#fff',
                        border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                      }}
                    />
                    <Area type="monotone" dataKey="scans" stroke="#00d4ff" fill="url(#adminGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
              >
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Threat Categories
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Safe', value: stats.safe },
                    { name: 'Low Risk', value: stats.lowRisk },
                    { name: 'Suspicious', value: stats.suspicious },
                    { name: 'High Risk', value: stats.highRisk },
                    { name: 'Phishing', value: stats.phishing },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={12} />
                    <YAxis stroke={isDark ? '#475569' : '#94a3b8'} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#111827' : '#fff',
                        border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                      }}
                    />
                    <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>User</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Role</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Scans</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Joined</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/20">
                  {users.map((user) => (
                    <tr key={user.id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-colors`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-cyber-purple/10 text-cyber-purple'
                            : 'bg-cyber-blue/10 text-cyber-blue'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{user.scanCount}</td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'scans' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>URL</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Score</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/20">
                  {scans.slice(0, 50).map((scan) => (
                    <tr key={scan.id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-colors`}>
                      <td className="px-4 py-3">
                        <div className={`text-sm truncate max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{scan.url}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: getCategoryColor(scan.category) }}>
                          {scan.riskScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getCategoryColor(scan.category)}15`,
                            color: getCategoryColor(scan.category),
                          }}
                        >
                          {scan.category}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(scan.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'blocked' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Enter domain to block"
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
              />
              <button
                onClick={handleBlockDomain}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                Block
              </button>
            </div>

            <div className="space-y-2">
              {blockedDomains.length === 0 ? (
                <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Ban className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No blocked domains</p>
                </div>
              ) : (
                blockedDomains.map((domain) => (
                  <div
                    key={domain}
                    className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Ban className="w-4 h-4 text-rose-400" />
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{domain}</span>
                    </div>
                    <button
                      onClick={() => handleUnblockDomain(domain)}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-500'}`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
