import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Search, AlertTriangle, CheckCircle2, ArrowRight,
  BarChart3, Activity, Globe
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser } from '../utils/auth';
import { getScanHistory, getScanStats } from '../utils/storage';
import type { ScanResult } from '../utils/urlAnalyzer';
import { getCategoryColor } from '../utils/urlAnalyzer';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function DashboardPage() {
  const { isDark } = useTheme();
  const user = getCurrentUser();
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState({
    total: 0, safe: 0, lowRisk: 0, suspicious: 0, highRisk: 0, phishing: 0,
    dailyScans: {} as Record<string, number>, last7Days: [] as string[],
    averageRiskScore: 0,
  });

  useEffect(() => {
    const history = getScanHistory();
    setRecentScans(history.slice(0, 5));
    setStats(getScanStats());
  }, []);

  const chartData = stats.last7Days.map(day => ({
    date: day.slice(5),
    scans: stats.dailyScans[day] || 0,
  }));

  const pieData = [
    { name: 'Safe', value: stats.safe, color: '#00ff88' },
    { name: 'Low Risk', value: stats.lowRisk, color: '#00d4ff' },
    { name: 'Suspicious', value: stats.suspicious, color: '#ffdd00' },
    { name: 'High Risk', value: stats.highRisk, color: '#ffaa00' },
    { name: 'Phishing', value: stats.phishing, color: '#ff3366' },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: Search, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10' },
    { label: 'Safe URLs', value: stats.safe, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Threats Found', value: stats.suspicious + stats.highRisk + stats.phishing, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Avg Risk Score', value: stats.averageRiskScore, icon: Activity, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back, <span className="gradient-text">{user?.name.split(' ')[0] || 'User'}</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Here's what's happening with your security scans
          </p>
        </motion.div>

        {/* Quick Scan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyber-blue" />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Scan a URL
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter a suspicious URL to analyze it with our AI engine
                </p>
              </div>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all hover:scale-105"
            >
              Start Scanning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Daily Scan Activity
              </h3>
              <BarChart3 className="w-5 h-5 text-cyber-blue" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="scans" stroke="#00d4ff" fill="url(#scanGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Threat Distribution
              </h3>
              <Globe className="w-5 h-5 text-cyber-blue" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111827' : '#fff',
                    border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Scans
            </h3>
            <Link to="/history" className="text-sm text-cyber-blue hover:underline">
              View All
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No scans yet. Start by scanning your first URL!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/scan/${scan.id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: `${getCategoryColor(scan.category)}20`, color: getCategoryColor(scan.category) }}
                  >
                    {scan.riskScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {scan.url}
                    </div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getCategoryColor(scan.category)}15`,
                      color: getCategoryColor(scan.category),
                    }}
                  >
                    {scan.category}
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
