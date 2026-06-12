import { motion } from 'framer-motion';
import { Shield, FileText, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function TermsOfServicePage() {
  const { isDark } = useTheme();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using PhishGuard AI ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.'
    },
    {
      title: '2. Description of Service',
      content: 'PhishGuard AI provides AI-powered phishing detection and URL analysis services. The Service includes URL scanning, threat intelligence, security reports, and related cybersecurity tools.'
    },
    {
      title: '3. User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account. You are responsible for all activities that occur under your account.'
    },
    {
      title: '4. Acceptable Use',
      content: 'You agree not to use the Service for any unlawful purpose, to scan URLs that you do not own or have authorization to test, to attempt to reverse-engineer our detection algorithms, or to distribute malicious content through our platform.'
    },
    {
      title: '5. API Usage',
      content: 'API access is subject to rate limits based on your subscription plan. Abuse of the API may result in temporary or permanent suspension. API keys must be kept secure and not shared publicly.'
    },
    {
      title: '6. Intellectual Property',
      content: 'The Service and its original content, features, and functionality are owned by PhishGuard AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
    },
    {
      title: '7. Limitation of Liability',
      content: 'PhishGuard AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. Our detection accuracy is provided on a best-effort basis.'
    },
    {
      title: '8. Disclaimer',
      content: 'The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free. PhishGuard AI is a detection tool and should not be your sole security measure.'
    },
    {
      title: '9. Termination',
      content: 'We may terminate or suspend your account immediately, without prior notice, for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users of the Service, us, or third parties.'
    },
    {
      title: '10. Changes to Terms',
      content: 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.'
    },
    {
      title: '11. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.'
    },
    {
      title: '12. Contact',
      content: 'If you have any questions about these Terms, please contact us at legal@phishguard.ai.'
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-purple/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-cyber-purple" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Last Updated: December 15, 2024
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Welcome to PhishGuard AI. These Terms of Service govern your use of our website and phishing detection services operated by Arman Ansari and the PhishGuard AI team. By using our Service, you agree to these terms.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.title}</h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{section.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`mt-8 rounded-2xl p-6 text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <Shield className="w-8 h-8 text-cyber-purple mx-auto mb-3" />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal Questions?</h3>
          <a href="mailto:legal@phishguard.ai" className="inline-flex items-center gap-2 text-cyber-blue hover:underline text-sm">
            <Mail className="w-4 h-4" /> legal@phishguard.ai
          </a>
        </motion.div>
      </div>
    </div>
  );
}
