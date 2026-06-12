import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ContactPage() {
  const { isDark } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'contact@phishguard.ai', desc: '24/7 support' },
    { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9am-5pm' },
    { icon: MapPin, title: 'Office', value: 'San Francisco, CA', desc: 'United States' },
    { icon: MessageSquare, title: 'Live Chat', value: 'Available 24/7', desc: 'Instant support' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-purple/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Mail className="w-10 h-10 text-cyber-purple" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Have questions? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {contactInfo.map((info, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className={`p-4 rounded-2xl text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <info.icon className="w-6 h-6 text-cyber-blue mx-auto mb-2" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{info.title}</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{info.value}</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{info.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl p-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-cyber-green mx-auto mb-4" />
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Sent!</h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>We'll get back to you within 24 hours</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" required placeholder="Your Name" value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className={`px-4 py-3 rounded-xl text-sm transition-all outline-none ${
                    isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                  }`} />
                <input type="email" required placeholder="Your Email" value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className={`px-4 py-3 rounded-xl text-sm transition-all outline-none ${
                    isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                  }`} />
              </div>
              <input type="text" required placeholder="Subject" value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`} />
              <textarea required placeholder="Your Message" rows={6} value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none ${
                  isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`} />
              <button type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
