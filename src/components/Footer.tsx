import { Link } from 'react-router-dom';
import { Shield, Mail, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  const footerLinks = {
    company: [
      { label: 'About', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
      { label: 'API Docs', path: '/api-docs' },
      { label: 'Careers', path: '/about' },
    ],
    tools: [
      { label: 'URL Scanner', path: '/scan' },
      { label: 'Password Checker', path: '/password-checker' },
      { label: 'QR Scanner', path: '/qr-scanner' },
      { label: 'Bulk Scanner', path: '/bulk-scanner' },
      { label: 'Domain Monitor', path: '/domain-monitor' },
    ],
    resources: [
      { label: 'Documentation', path: '/api-docs' },
      { label: 'Help Center', path: '/contact' },
      { label: 'Community', path: '/blog' },
      { label: 'Status', path: '/about' },
      { label: 'Changelog', path: '/blog' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'GDPR', path: '/gdpr' },
      { label: 'Security', path: '/about' },
    ],
  };

  return (
    <footer className={`${isDark ? 'bg-cyber-darker border-t border-cyber-border' : 'bg-slate-50 border-t border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-cyber-blue" />
              <span className="text-xl font-bold">
                <span className="gradient-text">PhishGuard</span>
                <span className={isDark ? 'text-white' : 'text-slate-800'}> AI</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Advanced AI-powered phishing detection platform protecting millions of users worldwide from cyber threats.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Mail, href: 'mailto:contact@phishguard.ai' },
                { Icon: MessageCircle, href: '#' },
                { Icon: Send, href: '#' },
                { Icon: ExternalLink, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-cyber-blue hover:bg-cyber-blue/10' : 'text-slate-500 hover:text-cyber-blue hover:bg-cyber-blue/5'}`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-cyber-blue' : 'text-slate-500 hover:text-cyber-blue'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Tools</h4>
            <ul className="space-y-2.5">
              {footerLinks.tools.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-cyber-blue' : 'text-slate-500 hover:text-cyber-blue'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-cyber-blue' : 'text-slate-500 hover:text-cyber-blue'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-cyber-blue' : 'text-slate-500 hover:text-cyber-blue'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Stay Updated
              </h4>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Get security tips and product updates
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input type="email" placeholder="Enter your email"
                className={`flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                  isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
                }`} />
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-8 pt-8 border-t ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                &copy; {new Date().getFullYear()} PhishGuard AI. All rights reserved.
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Made with ❤️ for a safer internet. <span className="font-semibold gradient-text">Arman Ansari</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Powered by</span>
              <span className="text-xs font-bold gradient-text">AI & Machine Learning</span>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>•</span>
              <span className="text-xs font-bold text-cyber-green">99.7% Accuracy</span>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>•</span>
              <span className="text-xs font-bold text-cyber-purple">100+ Features</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
