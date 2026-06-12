import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Trash2, ArrowRight, Shield,
  FileDown, FileSpreadsheet
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getScanHistory, deleteScanResult, exportHistoryAsJSON, exportHistoryAsCSV } from '../utils/storage';
import type { ScanResult } from '../utils/urlAnalyzer';
import { getCategoryColor } from '../utils/urlAnalyzer';

export default function HistoryPage() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ScanResult['category'] | 'All'>('All');
  const [history, setHistory] = useState(getScanHistory());

  const filteredHistory = useMemo(() => {
    return history.filter(scan => {
      const matchesSearch = scan.url.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || scan.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [history, search, filter]);

  const handleDelete = (id: string) => {
    deleteScanResult(id);
    setHistory(getScanHistory());
  };

  const handleExportJSON = () => {
    const blob = new Blob([exportHistoryAsJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phishguard-history.json';
    a.click();
  };

  const handleExportCSV = () => {
    const blob = new Blob([exportHistoryAsCSV()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phishguard-history.csv';
    a.click();
  };

  const categories: Array<ScanResult['category'] | 'All'> = ['All', 'Safe', 'Low Risk', 'Suspicious', 'High Risk', 'Phishing'];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Scan <span className="gradient-text">History</span>
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {filteredHistory.length} scan{filteredHistory.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 hover:border-cyber-blue/30'
              }`}
            >
              <FileDown className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 hover:border-cyber-blue/30'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 mb-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search URLs..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    filter === cat
                      ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white'
                      : isDark
                      ? 'glass text-slate-300 hover:border-cyber-blue/30'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-cyber-blue/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          {filteredHistory.length === 0 ? (
            <div className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No scans found</p>
              <Link to="/scan" className="text-cyber-blue hover:underline text-sm mt-2 inline-block">
                Start scanning
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-cyber-border/20">
              {filteredHistory.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 p-4 transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${getCategoryColor(scan.category)}15`,
                      color: getCategoryColor(scan.category),
                    }}
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
                    className="px-2.5 py-1 rounded-full text-xs font-medium hidden sm:block"
                    style={{
                      backgroundColor: `${getCategoryColor(scan.category)}15`,
                      color: getCategoryColor(scan.category),
                    }}
                  >
                    {scan.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/scan/${scan.id}`}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5 text-slate-400 hover:text-cyber-blue' : 'hover:bg-slate-100 text-slate-400 hover:text-cyber-blue'}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
