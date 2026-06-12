import { motion } from 'framer-motion';
import { Code, Copy, Check, Terminal, Book, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function APIDocsPage() {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState('');

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/register',
      description: 'Register a new user account',
      code: `curl -X POST https://api.phishguard.ai/api/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'`
    },
    {
      method: 'POST',
      path: '/api/login',
      description: 'Authenticate and get JWT token',
      code: `curl -X POST https://api.phishguard.ai/api/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'`
    },
    {
      method: 'POST',
      path: '/api/scan',
      description: 'Scan a URL for phishing threats',
      code: `curl -X POST https://api.phishguard.ai/api/scan \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }'`
    },
    {
      method: 'GET',
      path: '/api/history',
      description: 'Get user scan history',
      code: `curl -X GET https://api.phishguard.ai/api/history \\
  -H "Authorization: Bearer YOUR_TOKEN"`
    },
    {
      method: 'GET',
      path: '/api/stats',
      description: 'Get user statistics',
      code: `curl -X GET https://api.phishguard.ai/api/stats \\
  -H "Authorization: Bearer YOUR_TOKEN"`
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/30';
      case 'POST': return 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30';
      case 'PUT': return 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30';
      case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-green/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Code className="w-10 h-10 text-cyber-blue" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            API <span className="gradient-text">Documentation</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Integrate PhishGuard AI into your applications with our REST API
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Zap, label: '99.7% Accuracy', desc: 'Industry-leading detection' },
            { icon: Terminal, label: 'REST API', desc: 'Simple HTTP requests' },
            { icon: Book, label: 'Full Documentation', desc: 'Complete guides' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl text-center ${isDark ? 'glass' : 'bg-white border border-slate-200'}`}>
              <item.icon className="w-6 h-6 text-cyber-blue mx-auto mb-2" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Base URL</h2>
          <div className={`p-3 rounded-lg font-mono text-sm ${isDark ? 'bg-cyber-darker' : 'bg-slate-50'}`}>
            <code className="text-cyber-blue">https://api.phishguard.ai/api</code>
          </div>
        </motion.div>

        <div className="space-y-4">
          {endpoints.map((endpoint, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="p-4 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </span>
                <code className={`text-sm font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{endpoint.path}</code>
                <span className={`text-xs ml-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{endpoint.description}</span>
              </div>
              <div className="relative">
                <pre className={`p-4 overflow-x-auto text-xs ${isDark ? 'bg-cyber-darker' : 'bg-slate-900 text-slate-100'}`}>
                  <code>{endpoint.code}</code>
                </pre>
                <button onClick={() => copyCode(endpoint.code, endpoint.path)}
                  className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  {copied === endpoint.path ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4 text-slate-300" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className={`mt-8 p-6 rounded-2xl text-center ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Need API Access?
          </h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Sign up for a free account to get your API key
          </p>
          <a href="/register" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all">
            Get Free API Key
          </a>
        </motion.div>
      </div>
    </div>
  );
}
