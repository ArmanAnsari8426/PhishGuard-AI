import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { registerUser } from '../utils/auth';

export default function RegisterPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = registerUser(name, email, password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Email already registered');
      }
      setLoading(false);
    }, 800);
  };

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-rose-500', 'bg-orange-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-emerald-400'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative w-full max-w-md rounded-2xl p-8 ${
          isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-xl'
        }`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-cyber-blue" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Create Account
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Start protecting yourself from phishing attacks
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i < passwordStrength() ? strengthColors[passwordStrength()] : isDark ? 'bg-slate-700' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {strengthLabels[passwordStrength()]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyber-green mt-0.5 flex-shrink-0" />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-cyber-blue hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
