import { motion } from 'framer-motion';
import { Shield, Cookie, Settings, BarChart3, Target } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function CookiePolicyPage() {
  const { isDark } = useTheme();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
  });

  const cookieTypes = [
    {
      icon: Shield,
      name: 'Essential Cookies',
      key: 'essential' as const,
      required: true,
      description: 'These cookies are necessary for the website to function. They enable core features like security, authentication, and account management.',
      examples: ['Session ID', 'CSRF Token', 'Auth Token', 'Theme Preference'],
    },
    {
      icon: BarChart3,
      name: 'Analytics Cookies',
      key: 'analytics' as const,
      required: false,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Google Analytics', 'Page Views', 'Feature Usage', 'Error Tracking'],
    },
    {
      icon: Target,
      name: 'Marketing Cookies',
      key: 'marketing' as const,
      required: false,
      description: 'These cookies are used to track visitors across websites to display ads that are relevant and engaging for individual users.',
      examples: ['Ad Tracking', 'Conversion Pixels', 'Social Media Pixels'],
    },
    {
      icon: Settings,
      name: 'Functional Cookies',
      key: 'functional' as const,
      required: false,
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
      examples: ['Language Preference', 'Dashboard Layout', 'Notification Settings', 'Last Scan URL'],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-orange/20 to-cyber-yellow/20 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-cyber-orange" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Cookie <span className="gradient-text">Policy</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Last Updated: December 15, 2024
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 sm:p-8 mb-8 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>What Are Cookies?</h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and understanding how you use our service.
          </p>
        </motion.div>

        {/* Cookie Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`rounded-2xl p-6 sm:p-8 mb-8 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="w-5 h-5 inline mr-2 text-cyber-blue" />
            Cookie Preferences
          </h2>
          <div className="space-y-6">
            {cookieTypes.map((type, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-cyber-blue/10' : 'bg-cyber-blue/5'}`}>
                      <type.icon className="w-5 h-5 text-cyber-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {type.name}
                        </h3>
                        {type.required && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-cyber-blue/10 text-cyber-blue">
                            Required
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {type.examples.map((ex, ei) => (
                          <span key={ei} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-cyber-darker text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" checked={preferences[type.key]} disabled={type.required}
                      onChange={(e) => setPreferences({ ...preferences, [type.key]: e.target.checked })}
                      className="sr-only peer" />
                    <div className={`w-11 h-6 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      isDark ? 'bg-slate-700 peer-checked:bg-cyber-blue' : 'bg-slate-300 peer-checked:bg-cyber-blue'
                    } ${type.required ? 'opacity-70' : ''}`} />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold hover:opacity-90 transition-all">
            Save Preferences
          </button>
        </motion.div>

        {/* Additional Info */}
        <div className="space-y-4">
          {[
            { title: 'How to Manage Cookies', content: 'You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect website functionality.' },
            { title: 'Third-Party Cookies', content: 'Some cookies are placed by third-party services that appear on our pages, such as Google Analytics. We do not control these cookies. Please refer to the respective third party\'s privacy policy.' },
            { title: 'Cookie Duration', content: 'Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. Our essential cookies expire after 30 days.' },
            { title: 'Updates to This Policy', content: 'We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.' },
            { title: 'Contact Us', content: 'If you have questions about our use of cookies, please contact us at privacy@phishguard.ai.' },
          ].map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
