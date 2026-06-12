import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle2,
  Activity, Globe, Clock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getScanHistory, getScanStats } from '../utils/storage';
import type { ScanResult } from '../utils/urlAnalyzer';
import { getCategoryColor } from '../utils/urlAnalyzer';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    total: 0, safe: 0, lowRisk: 0, suspicious: 0, highRisk: 0, phishing: 0,
    dailyScans: {} as Record<string, number>, last7Days: [] as string[],
    averageRiskScore: 0,
  });
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    setStats(getScanStats());
    setHistory(getScanHistory());
  }, []);

  const chartData = stats.last7Days.map(day => ({
    date: day.slice(5),
    scans: stats.dailyScans[day] || 0,
    safe: history.filter(h => h.timestamp.startsWith(day) && h.category === 'Safe').length,
    threats: history.filter(h => h.timestamp.startsWith(day) && ['Suspicious', 'High Risk', 'Phishing'].includes(h.category)).length,
  }));

  const pieData = [
    { name: 'Safe', value: stats.safe, color: '#00ff88' },
    { name: 'Low Risk', value: stats.lowRisk, color: '#00d4ff' },
    { name: 'Suspicious', value: stats.suspicious, color: '#ffdd00' },
    { name: 'High Risk', value: stats.highRisk, color: '#ffaa00' },
    { name: 'Phishing', value: stats.phishing, color: '#ff3366' },
  ].filter(d => d.value > 0);

  const threatTrend = history.slice(0, 30).reverse().map((h, i) => ({
    index: i + 1,
    score: h.riskScore,
    date: new Date(h.timestamp).toLocaleDateString(),
  }));

  const topThreats = history
    .filter(h => h.riskScore > 50)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: BarChart3, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', trend: '+12%' },
    { label: 'Safe URLs', value: stats.safe, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: '+8%' },
    { label: 'Phishing Detected', value: stats.phishing, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10', trend: '-5%' },
    { label: 'Avg Response Time', value: '<100ms', icon: Clock, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10', trend: 'Stable' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Threat <span className="gradient-text">Analytics</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Comprehensive security insights and threat intelligence
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`rounded-2xl p-5 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' :
                  card.trend.startsWith('-') ? 'bg-rose-500/10 text-rose-400' :
                  'bg-cyber-blue/10 text-cyber-blue'
                }`}>
                  {card.trend}
                </span>
              </div>
              <div className="text-2xl font-bold gradient-text">{card.value}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Scan Activity (7 Days)
              </h3>
              <Activity className="w-5 h-5 text-cyber-blue" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
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
                <Legend />
                <Area type="monotone" dataKey="safe" stroke="#00ff88" fill="url(#safeGrad)" strokeWidth={2} name="Safe" />
                <Area type="monotone" dataKey="threats" stroke="#ff3366" fill="url(#threatGrad)" strokeWidth={2} name="Threats" />
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
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Risk Score Trend (Last 30)
              </h3>
              <TrendingUp className="w-5 h-5 text-cyber-blue" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={threatTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis dataKey="index" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#475569' : '#94a3b8'} fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111827' : '#fff',
                    border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                  }}
                  formatter={(value) => [`Risk Score: ${value}`, '']}
                />
                <Bar dataKey="score" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Top Threats
              </h3>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin">
              {topThreats.length === 0 ? (
                <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No threats detected yet</p>
                </div>
              ) : (
                topThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: `${getCategoryColor(threat.category)}15`,
                        color: getCategoryColor(threat.category),
                      }}
                    >
                      {threat.riskScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {threat.url}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(threat.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getCategoryColor(threat.category)}15`,
                        color: getCategoryColor(threat.category),
                      }}
                    >
                      {threat.category}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
