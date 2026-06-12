import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Shield, Globe, Lock, Calendar, Server,
  AlertTriangle, CheckCircle2, XCircle, FileText, ExternalLink,
  ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getScanHistory } from '../utils/storage';
import { downloadPDF } from '../utils/pdfGenerator';
import type { ScanResult } from '../utils/urlAnalyzer';

import RiskGauge from '../components/RiskGauge';

export default function ScanResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    features: true,
    virustotal: true,
    whois: true,
    ssl: true,
    recommendations: true,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const history = getScanHistory();
    const scan = history.find(s => s.id === id);
    if (scan) {
      setResult(scan);
    }
  }, [id]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Scan result not found</p>
          <button
            onClick={() => navigate('/scan')}
            className="mt-4 text-cyber-blue hover:underline"
          >
            Go to Scanner
          </button>
        </div>
      </div>
    );
  }

  const featureItems = [
    { label: 'URL Length', value: `${result.features.urlLength} characters`, icon: FileText },
    { label: 'Dot Count', value: result.features.dotCount.toString(), icon: Globe },
    { label: 'Hyphen Count', value: result.features.hyphenCount.toString(), icon: FileText },
    { label: 'Has @ Symbol', value: result.features.hasAtSymbol ? 'Yes' : 'No', icon: result.features.hasAtSymbol ? XCircle : CheckCircle2, danger: result.features.hasAtSymbol },
    { label: 'HTTPS Available', value: result.features.hasHTTPS ? 'Yes' : 'No', icon: result.features.hasHTTPS ? CheckCircle2 : XCircle, danger: !result.features.hasHTTPS },
    { label: 'SSL Valid', value: result.features.sslValid ? 'Valid' : 'Invalid', icon: result.features.sslValid ? CheckCircle2 : XCircle, danger: !result.features.sslValid },
    { label: 'Domain Age', value: `${result.features.domainAge} days`, icon: Calendar },
    { label: 'Domain Expiry', value: `${result.features.domainExpiry} days`, icon: Calendar },
    { label: 'Subdomain Count', value: result.features.subdomainCount.toString(), icon: Server },
    { label: 'Redirect Count', value: result.features.redirectCount.toString(), icon: ExternalLink },
    { label: 'IP Address', value: result.features.ipAddress ? 'Yes' : 'No', icon: result.features.ipAddress ? XCircle : CheckCircle2, danger: result.features.ipAddress },
    { label: 'Has Port', value: result.features.hasPort ? 'Yes' : 'No', icon: result.features.hasPort ? XCircle : CheckCircle2, danger: result.features.hasPort },
    { label: 'Path Length', value: `${result.features.pathLength} chars`, icon: FileText },
    { label: 'Query Length', value: `${result.features.queryLength} chars`, icon: FileText },
    { label: 'Has Iframe', value: result.features.hasIframe ? 'Yes' : 'No', icon: result.features.hasIframe ? AlertTriangle : CheckCircle2, danger: result.features.hasIframe },
    { label: 'Has Popup', value: result.features.hasPopup ? 'Yes' : 'No', icon: result.features.hasPopup ? AlertTriangle : CheckCircle2, danger: result.features.hasPopup },
    { label: 'Login Form', value: result.features.hasLoginForm ? 'Detected' : 'Not Found', icon: result.features.hasLoginForm ? AlertTriangle : CheckCircle2, danger: result.features.hasLoginForm },
    { label: 'Tiny URL', value: result.features.tinyURL ? 'Yes' : 'No', icon: result.features.tinyURL ? AlertTriangle : CheckCircle2, danger: result.features.tinyURL },
  ];

  const SectionHeader = ({ title, icon: Icon, section }: { title: string; icon: typeof Shield; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`flex items-center justify-between w-full p-4 rounded-xl transition-all ${
        isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-cyber-blue" />
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</span>
      </div>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Scan Result
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 hover:border-cyber-blue/30'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
            <button
              onClick={() => downloadPDF(result)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:opacity-90 transition-all"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* URL & Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <div className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target URL</div>
              <div className={`p-3 rounded-xl font-mono text-sm break-all ${isDark ? 'bg-cyber-darker' : 'bg-slate-50'}`}>
                <span className="text-cyber-blue">{result.url}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {result.features.suspiciousKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 rounded-md text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {kw}
                  </span>
                ))}
                {result.features.brandImpersonation.map((brand, i) => (
                  <span key={i} className="px-2 py-1 rounded-md text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    impersonates: {brand}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <RiskGauge score={result.riskScore} category={result.category} size={180} />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl mb-6 overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <SectionHeader title="URL Analysis Features" icon={FileText} section="features" />
          {expandedSections.features && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featureItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className={`w-4 h-4 ${item.danger ? 'text-rose-400' : 'text-cyber-blue'}`} />
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</span>
                    </div>
                    <div className={`text-sm font-semibold ${item.danger ? 'text-rose-400' : isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* VirusTotal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl mb-6 overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <SectionHeader title="VirusTotal Intelligence" icon={Shield} section="virustotal" />
          {expandedSections.virustotal && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-2xl font-bold gradient-text">{result.virusTotal.reputation}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reputation Score</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-2xl font-bold" style={{ color: result.virusTotal.detections > 0 ? '#ff3366' : '#00ff88' }}>
                    {result.virusTotal.detections}
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Detections</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                  <div className="text-2xl font-bold text-cyber-blue">{result.virusTotal.totalEngines}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Engines</div>
                </div>
              </div>
              <div className="space-y-2">
                {result.virusTotal.details.map((detail, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-cyber-darker/30' : 'bg-slate-50'}`}>
                    <AlertTriangle className="w-4 h-4 text-cyber-blue flex-shrink-0" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* WHOIS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-2xl mb-6 overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <SectionHeader title="WHOIS Information" icon={Globe} section="whois" />
          {expandedSections.whois && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Registrar', value: result.whois.registrar },
                  { label: 'Created', value: result.whois.created },
                  { label: 'Expires', value: result.whois.expires },
                  { label: 'Updated', value: result.whois.updated },
                  { label: 'Country', value: result.whois.country },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                    <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* SSL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl mb-6 overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <SectionHeader title="SSL Certificate" icon={Lock} section="ssl" />
          {expandedSections.ssl && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Issuer', value: result.ssl.issuer },
                  { label: 'Valid From', value: result.ssl.validFrom },
                  { label: 'Valid To', value: result.ssl.validTo },
                  { label: 'Cipher', value: result.ssl.cipher },
                  { label: 'Protocol', value: result.ssl.protocol },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                    <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-2xl mb-6 overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <SectionHeader title="Recommendations" icon={CheckCircle2} section="recommendations" />
          {expandedSections.recommendations && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 p-3 rounded-xl ${
                      result.riskScore > 50
                        ? 'bg-rose-500/5 border border-rose-500/10'
                        : 'bg-emerald-500/5 border border-emerald-500/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      result.riskScore > 50 ? 'bg-rose-500/10' : 'bg-emerald-500/10'
                    }`}>
                      <span className={`text-xs font-bold ${result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {i + 1}
                      </span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
