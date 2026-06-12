import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Brain, Globe, Lock, Zap, BarChart3, FileText,
  ChevronRight, CheckCircle2, ArrowRight, Activity, Eye, Server
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import FeatureCard from '../components/FeatureCard';
import StatCard from '../components/StatCard';

export default function LandingPage() {
  const { isDark } = useTheme();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Protecting you from phishing attacks';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms trained on millions of phishing samples for real-time threat detection.',
    },
    {
      icon: Globe,
      title: 'URL Analysis Engine',
      description: 'Deep URL inspection analyzing 20+ features including domain age, SSL validity, and suspicious patterns.',
    },
    {
      icon: Lock,
      title: 'SSL Verification',
      description: 'Comprehensive SSL certificate analysis to detect invalid, expired, or self-signed certificates.',
    },
    {
      icon: Zap,
      title: 'Real-Time Scanning',
      description: 'Instant threat assessment with sub-second response times and continuous monitoring capabilities.',
    },
    {
      icon: BarChart3,
      title: 'Threat Intelligence',
      description: 'Integration with VirusTotal and global threat databases for comprehensive reputation analysis.',
    },
    {
      icon: FileText,
      title: 'PDF Reports',
      description: 'Generate detailed, professional PDF reports with risk scores, recommendations, and technical details.',
    },
  ];

  const stats = [
    { icon: Shield, value: '99.7%', label: 'Detection Accuracy' },
    { icon: Activity, value: '50M+', label: 'URLs Scanned' },
    { icon: Eye, value: '2M+', label: 'Threats Blocked' },
    { icon: Server, value: '<100ms', label: 'Scan Response' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Enter URL',
      description: 'Paste any suspicious URL into our scanner interface.',
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our ML engine analyzes 20+ security features instantly.',
    },
    {
      step: '03',
      title: 'Get Results',
      description: 'Receive a detailed risk score with actionable insights.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for personal use',
      features: ['50 scans/month', 'Basic URL analysis', 'Risk score', 'Community support'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For security professionals',
      features: ['Unlimited scans', 'Advanced ML analysis', 'PDF reports', 'API access', 'Priority support'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For organizations',
      features: ['Everything in Pro', 'Custom ML models', 'SSO integration', 'Dedicated support', 'SLA guarantee'],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-bg opacity-50" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                AI-Powered Phishing Detection
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Defend Against </span>
              <span className="gradient-text">Phishing</span>
              <br />
              <span className={isDark ? 'text-white' : 'text-slate-900'}>with </span>
              <span className="gradient-text">AI Intelligence</span>
            </h1>

            <p className={`text-xl md:text-2xl mb-4 typing-cursor ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {typedText}
            </p>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Advanced machine learning models analyze URLs in real-time to detect phishing, malware, and fraudulent websites before they can harm you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
              >
                Start Scanning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/scan"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border transition-all hover:scale-105 ${
                  isDark
                    ? 'border-cyber-border text-slate-300 hover:border-cyber-blue/50 hover:text-white'
                    : 'border-slate-300 text-slate-600 hover:border-cyber-blue/50 hover:text-slate-900'
                }`}
              >
                Try Demo Scan
              </Link>
            </div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 relative"
          >
            <div className={`relative mx-auto max-w-4xl rounded-2xl overflow-hidden ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-xl'}`}>
              <div className="scan-line" />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className={`text-sm font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>phishguard-ai.scanner</div>
                </div>
                
                <div className={`p-4 rounded-xl mb-4 font-mono text-sm ${isDark ? 'bg-cyber-darker' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyber-blue">$</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>analyze-url</span>
                    <span className="text-cyber-green">https://suspicious-bank-login.tk/verify</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-blue">{'>'}</span>
                      <span className="text-cyber-green">Analyzing URL structure...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-blue">{'>'}</span>
                      <span className="text-cyber-green">Checking SSL certificate...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-blue">{'>'}</span>
                      <span className="text-cyber-green">Running ML prediction...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-blue">{'>'}</span>
                      <span className="text-rose-400 font-bold">Risk Score: 87/100 - PHISHING DETECTED</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'URL Length', value: '45 chars', status: 'warning' },
                    { label: 'SSL Valid', value: 'Invalid', status: 'danger' },
                    { label: 'Domain Age', value: '3 days', status: 'danger' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-cyber-darker' : 'bg-slate-50'}`}>
                      <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                      <div className={`text-sm font-semibold ${
                        item.status === 'danger' ? 'text-rose-400' : item.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyber-blue text-sm font-semibold uppercase tracking-wider">Features</span>
            <h2 className={`text-4xl font-bold mt-3 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything You Need for <span className="gradient-text">URL Security</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Comprehensive phishing detection powered by cutting-edge AI and threat intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-20 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyber-blue text-sm font-semibold uppercase tracking-wider">Process</span>
            <h2 className={`text-4xl font-bold mt-3 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-slate-800' : 'text-slate-100'}`}>
                  {step.step}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {step.description}
                </p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-8 h-8 text-cyber-blue/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyber-blue text-sm font-semibold uppercase tracking-wider">Pricing</span>
            <h2 className={`text-4xl font-bold mt-3 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Choose Your <span className="gradient-text">Plan</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'gradient-border'
                    : isDark
                    ? 'glass'
                    : 'bg-white border border-slate-200'
                } ${plan.highlighted ? 'scale-105' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyber-green flex-shrink-0" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white'
                      : isDark
                      ? 'border border-cyber-border text-slate-300 hover:border-cyber-blue/50'
                      : 'border border-slate-300 text-slate-600 hover:border-cyber-blue/50'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-cyber-blue text-sm font-semibold uppercase tracking-wider">Free Tools</span>
            <h2 className={`text-4xl font-bold mt-3 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Security <span className="gradient-text">Tools Suite</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Free online tools to keep you safe online
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'URL Scanner', path: '/scan', emoji: '🔍' },
              { label: 'Password Checker', path: '/password-checker', emoji: '🔐' },
              { label: 'QR Scanner', path: '/qr-scanner', emoji: '📱' },
              { label: 'Bulk Scanner', path: '/bulk-scanner', emoji: '📊' },
              { label: 'Domain Monitor', path: '/domain-monitor', emoji: '🌐' },
              { label: 'API Docs', path: '/api-docs', emoji: '⚡' },
              { label: 'Blog', path: '/blog', emoji: '📝' },
              { label: 'About', path: '/about', emoji: 'ℹ️' },
            ].map((tool, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={tool.path}
                  className={`block p-4 rounded-2xl text-center transition-all hover:scale-105 ${
                    isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 hover:border-cyber-blue/30 shadow-sm'
                  }`}>
                  <div className="text-3xl mb-2">{tool.emoji}</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tool.label}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative rounded-3xl p-12 text-center overflow-hidden ${isDark ? 'glass-strong' : 'bg-white border border-slate-200'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10" />
            <div className="relative z-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ready to Secure Your <span className="gradient-text">Digital World</span>?
              </h2>
              <p className={`text-lg mb-8 max-w-xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                Join thousands of security professionals using PhishGuard AI to protect against phishing attacks.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
