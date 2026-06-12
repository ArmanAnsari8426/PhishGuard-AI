import { motion } from 'framer-motion';
import { Shield, Users, Globe, Award, Target, Heart, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function AboutPage() {
  const { isDark } = useTheme();

  const team = [
    { name: 'PhishGuard Team', role: 'AI Engineers', initial: 'AI' },
    { name: 'Security Experts', role: 'Cybersecurity', initial: 'SE' },
    { name: 'ML Researchers', role: 'Data Science', initial: 'ML' },
    { name: 'DevOps Engineers', role: 'Infrastructure', initial: 'DE' },
  ];

  const stats = [
    { value: '50M+', label: 'URLs Scanned', icon: Globe },
    { value: '2M+', label: 'Threats Blocked', icon: Shield },
    { value: '500K+', label: 'Active Users', icon: Users },
    { value: '99.7%', label: 'Detection Rate', icon: Award },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Shield className="w-12 h-12 text-cyber-blue" />
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            About <span className="gradient-text">PhishGuard AI</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Protecting millions of users worldwide with AI-powered phishing detection
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <stat.icon className="w-8 h-8 text-cyber-blue mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className={`p-8 rounded-2xl ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
            <Target className="w-10 h-10 text-cyber-blue mb-4" />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              To make the internet a safer place by providing free, accessible, and accurate phishing detection tools to everyone. We believe cybersecurity should not be a privilege but a right.
            </p>
          </div>
          <div className={`p-8 rounded-2xl ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
            <Heart className="w-10 h-10 text-cyber-purple mb-4" />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Values</h2>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Privacy, transparency, and user empowerment. We never store your scan data without consent, and we believe in educating users about online safety.
            </p>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Built by <span className="gradient-text">Security Experts</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <div key={i} className={`p-6 rounded-2xl text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {member.initial}
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.name}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`p-8 rounded-2xl text-center ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-cyber-blue" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>contact@phishguard.ai</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6 text-cyber-blue" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>+1 (555) 123-4567</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-cyber-blue" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>San Francisco, CA</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
