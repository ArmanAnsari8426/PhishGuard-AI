import { motion } from 'framer-motion';
import { Shield, Lock, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function PrivacyPolicyPage() {
  const { isDark } = useTheme();

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly, including your name, email address, and URLs you submit for scanning. We also collect usage data such as pages visited, features used, and scan results to improve our service.`
    },
    {
      title: '2. How We Use Your Information',
      content: `Your information is used to provide and maintain our phishing detection service, process URL scans, send security alerts and reports, improve our machine learning models, and communicate with you about your account.`
    },
    {
      title: '3. Data Security',
      content: `We implement industry-standard security measures including encryption at rest and in transit, secure authentication with JWT tokens, regular security audits, and compliance with GDPR, CCPA, and SOC 2 standards.`
    },
    {
      title: '4. Third-Party Services',
      content: `We integrate with VirusTotal, Google Safe Browsing, and PhishTank for threat intelligence. These services only receive URLs you explicitly submit for scanning. We do not share personal information with third parties.`
    },
    {
      title: '5. Data Retention',
      content: `Scan history is retained for 90 days by default. You can delete your scan history at any time. Account data is retained until you delete your account. We comply with data deletion requests within 30 days.`
    },
    {
      title: '6. Cookies and Tracking',
      content: `We use essential cookies for authentication and session management. We use Google Analytics for understanding website usage. You can opt out of non-essential cookies in your browser settings.`
    },
    {
      title: '7. Your Rights (GDPR)',
      content: `Under GDPR, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. Contact us at privacy@phishguard.ai to exercise these rights.`
    },
    {
      title: '8. Children\'s Privacy',
      content: `Our service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.`
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`
    },
    {
      title: '10. Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us at privacy@phishguard.ai or visit our contact page.`
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-cyber-blue" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Last Updated: December 15, 2024
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            At PhishGuard AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our phishing detection services.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {section.title}
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`mt-8 rounded-2xl p-6 text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <Shield className="w-8 h-8 text-cyber-blue mx-auto mb-3" />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Questions?</h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Contact our privacy team at
          </p>
          <a href="mailto:privacy@phishguard.ai"
            className="inline-flex items-center gap-2 text-cyber-blue hover:underline text-sm">
            <Mail className="w-4 h-4" /> privacy@phishguard.ai
          </a>
        </motion.div>
      </div>
    </div>
  );
}
