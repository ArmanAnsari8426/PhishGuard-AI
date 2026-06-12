import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, RefreshCw, Database } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function PasswordCheckerPage() {
  const { isDark } = useTheme();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzePassword = (pwd: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      const score = calculateScore(pwd);
      const entropy = calculateEntropy(pwd);
      const crackTime = estimateCrackTime(entropy);
      const checks = runChecks(pwd);
      setResult({ score, entropy, crackTime, checks, password: pwd });
      setAnalyzing(false);
    }, 500);
  };

  const calculateScore = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else if (pwd.length >= 6) score += 5;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[!@#$%^&*]/.test(pwd)) score += 20;
    if (!/(.)\1{2,}/.test(pwd)) score += 10;
    if (!/123|abc|qwerty/i.test(pwd)) score += 5;
    return Math.min(100, score);
  };

  const calculateEntropy = (pwd: string) => {
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/[0-9]/.test(pwd)) charset += 10;
    if (/[!@#$%^&*]/.test(pwd)) charset += 32;
    return pwd.length * Math.log2(charset || 1);
  };

  const estimateCrackTime = (entropy: number) => {
    const guesses = Math.pow(2, entropy);
    const seconds = guesses / 10000000000;
    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
  };

  const runChecks = (pwd: string) => ({
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    numbers: /[0-9]/.test(pwd),
    special: /[!@#$%^&*]/.test(pwd),
    noCommon: !['password', '123456', 'qwerty', 'admin'].includes(pwd.toLowerCase()),
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 16; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
    analyzePassword(pwd);
  };

  const getStrengthColor = (score: number) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#00d4ff';
    if (score >= 40) return '#ffdd00';
    if (score >= 20) return '#ffaa00';
    return '#ff3366';
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Weak';
    return 'Very Weak';
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Lock className="w-10 h-10 text-cyber-blue" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Password <span className="gradient-text">Strength Analyzer</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Check how strong your password is and get recommendations to improve it
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (e.target.value) analyzePassword(e.target.value); }}
                placeholder="Enter password to analyze..."
                className={`w-full pl-12 pr-12 py-4 rounded-xl text-base transition-all outline-none ${
                  isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
              />
              <button onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button onClick={generatePassword}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Generate
            </button>
          </div>

          {analyzing && (
            <div className="text-center py-4">
              <div className="inline-block w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Analyzing password security...</p>
            </div>
          )}

          {result && !analyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-3xl font-bold" style={{ color: getStrengthColor(result.score) }}>{result.score}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Score</div>
                  <div className="text-sm font-semibold mt-2" style={{ color: getStrengthColor(result.score) }}>
                    {getStrengthLabel(result.score)}
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-3xl font-bold text-cyber-purple">{result.entropy.toFixed(1)}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Entropy (bits)</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-2xl font-bold text-cyber-green">{result.crackTime}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Crack Time</div>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Security Checks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(result.checks).map(([key, passed]) => (
                    <div key={key} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-cyber-darker/30' : 'bg-slate-50'}`}>
                      {passed ? <CheckCircle2 className="w-4 h-4 text-cyber-green" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      <span className={`text-sm capitalize ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Database className="w-4 h-4 inline mr-1" /> Recommendations
                </h3>
                <ul className="space-y-1">
                  {!result.checks.length && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Use at least 12 characters</li>}
                  {!result.checks.uppercase && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Add uppercase letters</li>}
                  {!result.checks.lowercase && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Add lowercase letters</li>}
                  {!result.checks.numbers && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Add numbers</li>}
                  {!result.checks.special && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Add special characters (!@#$%^&*)</li>}
                  {!result.checks.noCommon && <li className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>• Avoid common passwords</li>}
                  {result.score >= 80 && <li className={`text-sm text-cyber-green`}>• Excellent! Your password is very strong 🎉</li>}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
