import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Download, Trash2, AlertTriangle, CheckCircle2, Mail, Globe, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function GDPRPage() {
  const { isDark } = useTheme();
  const [requestType, setRequestType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const rights = [
    { icon: Eye, title: 'Right to Access', description: 'You have the right to request a copy of all personal data we hold about you.' },
    { icon: FileText, title: 'Right to Rectification', description: 'You can request correction of inaccurate or incomplete personal data.' },
    { icon: Trash2, title: 'Right to Erasure', description: 'You can request deletion of your personal data ("right to be forgotten").' },
    { icon: Lock, title: 'Right to Restrict Processing', description: 'You can request restriction of processing of your personal data.' },
    { icon: Download, title: 'Right to Data Portability', description: 'You can request your data in a structured, machine-readable format.' },
    { icon: AlertTriangle, title: 'Right to Object', description: 'You can object to processing of your personal data for certain purposes.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-green/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-cyber-green" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            GDPR <span className="gradient-text">Compliance</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Your data protection rights under the General Data Protection Regulation
          </p>
        </motion.div>

        {/* Your Rights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {rights.map((right, i) => (
            <div key={i} className={`p-5 rounded-2xl ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <right.icon className="w-8 h-8 text-cyber-blue mb-3" />
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{right.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{right.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Data We Collect */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Eye className="w-5 h-5 inline mr-2 text-cyber-blue" />
            Data We Collect
          </h2>
          <div className="space-y-3">
            {[
              { category: 'Account Data', items: ['Name', 'Email address', 'Password (hashed)', 'Account preferences'] },
              { category: 'Usage Data', items: ['URLs scanned', 'Scan results', 'Feature usage', 'Login timestamps'] },
              { category: 'Technical Data', items: ['IP address', 'Browser type', 'Device information', 'Operating system'] },
              { category: 'Communication Data', items: ['Support tickets', 'Feedback', 'Email correspondence'] },
            ].map((data, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.items.map((item, ii) => (
                    <span key={ii} className={`px-2 py-1 rounded-md text-xs ${isDark ? 'bg-cyber-darker text-slate-400' : 'bg-white text-slate-500 border border-slate-200'}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legal Basis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Lock className="w-5 h-5 inline mr-2 text-cyber-purple" />
            Legal Basis for Processing
          </h2>
          <div className="space-y-3">
            {[
              { basis: 'Consent', desc: 'When you sign up for our service and agree to our terms.' },
              { basis: 'Contract', desc: 'Processing necessary to fulfill our service agreement with you.' },
              { basis: 'Legitimate Interest', desc: 'For improving our service, fraud prevention, and security.' },
              { basis: 'Legal Obligation', desc: 'When required by law or regulatory requirements.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.basis}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Request Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Mail className="w-5 h-5 inline mr-2 text-cyber-blue" />
            Submit a Data Request
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-cyber-green mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Request Submitted</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                We will respond to your request within 30 days as required by GDPR.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                  <input type="text" required placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                      isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                  <input type="email" required placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                      isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                    }`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Request Type</label>
                <select required value={requestType} onChange={(e) => setRequestType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                    isDark ? 'bg-cyber-darker border border-cyber-border text-white focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyber-blue'
                  }`}>
                  <option value="">Select request type</option>
                  <option value="access">Data Access Request</option>
                  <option value="rectification">Data Rectification</option>
                  <option value="erasure">Data Erasure (Right to be Forgotten)</option>
                  <option value="portability">Data Portability</option>
                  <option value="restrict">Restrict Processing</option>
                  <option value="object">Object to Processing</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Additional Details</label>
                <textarea rows={4} placeholder="Provide any additional details about your request..."
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all ${
                    isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                  }`} />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all">
                Submit GDPR Request
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact DPO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className={`rounded-2xl p-6 text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <Globe className="w-8 h-8 text-cyber-blue mx-auto mb-3" />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Data Protection Officer
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            For GDPR inquiries, contact our Data Protection Officer:
          </p>
          <div className="space-y-1">
            <a href="mailto:dpo@phishguard.ai" className="block text-sm text-cyber-blue hover:underline">dpo@phishguard.ai</a>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>PhishGuard AI, San Francisco, CA, USA</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
