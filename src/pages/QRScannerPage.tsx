import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Camera, AlertTriangle, CheckCircle2, Shield, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function QRScannerPage() {
  const { isDark } = useTheme();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setResult(null);

    setTimeout(() => {
      // Simulate QR scan
      const mockResult = {
        type: 'url',
        content: 'https://example-bank-login.tk/verify-account',
        url: 'https://example-bank-login.tk/verify-account',
        analysis: {
          risk_score: 87,
          category: 'Phishing',
          features: {
            has_https: false,
            suspicious_keywords: 3,
            brand_impersonation: 1,
            domain_age: 5,
            url_length: 47,
          },
          warnings: [
            'URL contains suspicious keywords',
            'Possible brand impersonation detected',
            'Domain is only 5 days old',
            'No HTTPS encryption'
          ]
        }
      };
      setResult(mockResult);
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-purple/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <QrCode className="w-10 h-10 text-cyber-purple" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            QR Code <span className="gradient-text">Security Scanner</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Scan QR codes to detect phishing URLs, malicious links, and security threats
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className={`rounded-2xl p-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Upload className="w-5 h-5 inline mr-2 text-cyber-blue" />
              Upload QR Image
            </h2>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            <div onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDark ? 'border-cyber-border hover:border-cyber-blue/50 bg-cyber-darker/30' : 'border-slate-300 hover:border-cyber-blue/50 bg-slate-50'
              }`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Click to upload QR code image
              </p>
              <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            <button className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}>
              <Camera className="w-4 h-4" /> Use Camera
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className={`rounded-2xl p-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Shield className="w-5 h-5 inline mr-2 text-cyber-blue" />
              Scan Result
            </h2>

            {scanning && (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mb-4" />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Scanning QR code...</p>
              </div>
            )}

            {!scanning && !result && (
              <div className="text-center py-12">
                <QrCode className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Upload a QR code to see the security analysis
                </p>
              </div>
            )}

            {result && !scanning && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className={`p-4 rounded-xl border-2 ${
                  result.analysis.risk_score > 60
                    ? 'bg-rose-500/5 border-rose-500/30'
                    : result.analysis.risk_score > 30
                    ? 'bg-yellow-500/5 border-yellow-500/30'
                    : 'bg-emerald-500/5 border-emerald-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {result.analysis.risk_score > 60 ? '🚨 Dangerous' : result.analysis.risk_score > 30 ? '⚠️ Suspicious' : '✅ Safe'}
                    </span>
                    <span className="text-2xl font-bold"
                      style={{ color: result.analysis.risk_score > 60 ? '#ff3366' : result.analysis.risk_score > 30 ? '#ffdd00' : '#00ff88' }}>
                      {result.analysis.risk_score}/100
                    </span>
                  </div>
                  <div className="text-xs font-mono break-all p-2 rounded bg-black/20">
                    {result.content}
                  </div>
                </div>

                {result.analysis.warnings.length > 0 && (
                  <div>
                    <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <AlertTriangle className="w-4 h-4 inline mr-1 text-rose-400" /> Warnings
                    </h3>
                    <ul className="space-y-1">
                      {result.analysis.warnings.map((warning: string, i: number) => (
                        <li key={i} className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <X className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <CheckCircle2 className="w-4 h-4 inline mr-1 text-cyber-blue" /> Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>HTTPS</span>
                      <span className="ml-2 font-semibold">{result.analysis.features.has_https ? 'Yes' : 'No'}</span>
                    </div>
                    <div className={`p-2 rounded ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Length</span>
                      <span className="ml-2 font-semibold">{result.analysis.features.url_length}</span>
                    </div>
                    <div className={`p-2 rounded ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Domain Age</span>
                      <span className="ml-2 font-semibold">{result.analysis.features.domain_age}d</span>
                    </div>
                    <div className={`p-2 rounded ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Suspicious</span>
                      <span className="ml-2 font-semibold">{result.analysis.features.suspicious_keywords}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-4`}>
          {[
            { icon: Shield, title: 'Quishing Protection', desc: 'Detect QR phishing attacks' },
            { icon: AlertTriangle, title: 'Real-time Analysis', desc: 'Instant threat detection' },
            { icon: CheckCircle2, title: 'Safe Browsing', desc: 'Know before you scan' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl text-center ${isDark ? 'glass' : 'bg-white border border-slate-200'}`}>
              <item.icon className="w-6 h-6 mx-auto mb-2 text-cyber-blue" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
