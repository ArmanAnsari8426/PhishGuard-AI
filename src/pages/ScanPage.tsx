import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Globe, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { analyzeURL } from '../utils/urlAnalyzer';
import { addScanResult } from '../utils/storage';
import { updateUserScanCount } from '../utils/auth';

export default function ScanPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState('');

  const scanSteps = [
    'Parsing URL structure...',
    'Extracting features...',
    'Checking SSL certificate...',
    'Querying threat intelligence...',
    'Running ML prediction...',
    'Generating report...',
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError('');
    setScanning(true);
    setScanStep(0);

    // Simulate scanning steps
    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    }

    try {
      const result = analyzeURL(url.trim());
      addScanResult(result);
      updateUserScanCount();
      navigate(`/scan/${result.id}`);
    } catch (err) {
      setError('Failed to analyze URL. Please try again.');
      setScanning(false);
    }
  };

  const sampleUrls = [
    'https://google.com',
    'https://github.com',
    'https://suspicious-bank-login.tk/verify',
    'http://192.168.1.1/login',
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-cyber-blue" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            URL <span className="gradient-text">Scanner</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Enter a URL to analyze it with our AI-powered phishing detection engine
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}
        >
          <form onSubmit={handleScan} className="relative">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL to scan (e.g., https://example.com)"
                  disabled={scanning}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all outline-none ${
                    isDark
                      ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                  } disabled:opacity-50`}
                />
              </div>
              <button
                type="submit"
                disabled={scanning || !url.trim()}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Scan
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* Scanning Progress */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="space-y-3">
                  {scanSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: i <= scanStep ? 1 : 0.3, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        i < scanStep ? 'bg-cyber-green' : i === scanStep ? 'bg-cyber-blue animate-pulse' : isDark ? 'bg-slate-700' : 'bg-slate-200'
                      }`}>
                        {i < scanStep ? (
                          <Lock className="w-3 h-3 text-white" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${i === scanStep ? 'bg-white' : isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                        )}
                      </div>
                      <span className={`text-sm ${
                        i <= scanStep ? (isDark ? 'text-slate-200' : 'text-slate-700') : (isDark ? 'text-slate-600' : 'text-slate-400')
                      }`}>
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 h-1 rounded-full overflow-hidden bg-cyber-border">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sample URLs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try these examples:
          </h3>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((sampleUrl) => (
              <button
                key={sampleUrl}
                onClick={() => setUrl(sampleUrl)}
                disabled={scanning}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  isDark
                    ? 'glass hover:border-cyber-blue/30 text-slate-300'
                    : 'bg-white border border-slate-200 hover:border-cyber-blue/30 text-slate-600 shadow-sm'
                } disabled:opacity-50`}
              >
                {sampleUrl}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
