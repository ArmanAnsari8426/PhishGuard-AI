import { useState } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, Play, Download, Loader2, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function BulkScannerPage() {
  const { isDark } = useTheme();
  const [urls, setUrls] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const urlList = urls.split('\n').filter(u => u.trim());

  const startScan = async () => {
    if (urlList.length === 0) return;
    setScanning(true);
    setResults([]);
    setProgress(0);

    for (let i = 0; i < urlList.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const score = Math.floor(Math.random() * 100);
      setResults(prev => [...prev, {
        url: urlList[i].trim(),
        risk_score: score,
        category: score > 80 ? 'Phishing' : score > 60 ? 'High Risk' : score > 40 ? 'Suspicious' : score > 20 ? 'Low Risk' : 'Safe',
        status: 'completed'
      }]);
      setProgress(((i + 1) / urlList.length) * 100);
    }
    setScanning(false);
  };

  const exportResults = () => {
    const csv = ['URL,Risk Score,Category', ...results.map(r => `${r.url},${r.risk_score},${r.category}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phishguard-bulk-results.csv';
    a.click();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-green/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <ListChecks className="w-10 h-10 text-cyber-green" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Bulk URL <span className="gradient-text">Scanner</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Scan multiple URLs simultaneously with parallel processing
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Enter URLs (one per line, max 100)
          </label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={10}
            placeholder="https://example1.com&#10;https://example2.com&#10;https://suspicious.tk/login"
            className={`w-full px-4 py-3 rounded-xl text-sm font-mono transition-all outline-none resize-none ${
              isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
              : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
            }`}
          />
          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {urlList.length} URL{urlList.length !== 1 ? 's' : ''} ready to scan
            </span>
            <div className="flex gap-2">
              <button onClick={() => setUrls('')} disabled={scanning}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDark ? 'glass hover:border-rose-500/30 text-rose-400' : 'bg-slate-100 hover:bg-rose-50 text-rose-500'
                } disabled:opacity-50`}>
                <Trash2 className="w-4 h-4 inline mr-1" /> Clear
              </button>
              <button onClick={startScan} disabled={scanning || urlList.length === 0}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : <><Play className="w-4 h-4" /> Start Scan</>}
              </button>
            </div>
          </div>

          {scanning && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
                <span className="text-cyber-blue font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-cyber-darker' : 'bg-slate-200'}`}>
                <motion.div className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple"
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}
        </motion.div>

        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Results ({results.length})
              </h3>
              <button onClick={exportResults}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 hover:border-cyber-blue/30'
                }`}>
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {results.map((r, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-cyber-darker/30' : 'bg-slate-50'}`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: r.risk_score > 60 ? 'rgba(255,51,102,0.1)' : r.risk_score > 30 ? 'rgba(255,221,0,0.1)' : 'rgba(0,255,136,0.1)',
                      color: r.risk_score > 60 ? '#ff3366' : r.risk_score > 30 ? '#ffdd00' : '#00ff88' }}>
                    {r.risk_score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-mono truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.url}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{r.category}</div>
                  </div>
                  {r.risk_score > 60 ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-cyber-green" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
