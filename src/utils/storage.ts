import type { ScanResult } from './urlAnalyzer';

const HISTORY_KEY = 'phishguard_history';
const BLOCKED_DOMAINS_KEY = 'phishguard_blocked';

export function getScanHistory(): ScanResult[] {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addScanResult(result: ScanResult) {
  const history = getScanHistory();
  history.unshift(result);
  // Keep last 500 scans
  if (history.length > 500) {
    history.pop();
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function deleteScanResult(id: string) {
  const history = getScanHistory().filter(s => s.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearScanHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getScanStats() {
  const history = getScanHistory();
  const total = history.length;
  const safe = history.filter(s => s.category === 'Safe').length;
  const lowRisk = history.filter(s => s.category === 'Low Risk').length;
  const suspicious = history.filter(s => s.category === 'Suspicious').length;
  const highRisk = history.filter(s => s.category === 'High Risk').length;
  const phishing = history.filter(s => s.category === 'Phishing').length;
  
  const dailyScans: Record<string, number> = {};
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();
  
  last7Days.forEach(day => {
    dailyScans[day] = history.filter(s => s.timestamp.startsWith(day)).length;
  });

  return {
    total,
    safe,
    lowRisk,
    suspicious,
    highRisk,
    phishing,
    dailyScans,
    last7Days,
    averageRiskScore: total > 0 ? Math.round(history.reduce((sum, s) => sum + s.riskScore, 0) / total) : 0,
  };
}

export function getBlockedDomains(): string[] {
  const data = localStorage.getItem(BLOCKED_DOMAINS_KEY);
  return data ? JSON.parse(data) : [];
}

export function blockDomain(domain: string) {
  const blocked = getBlockedDomains();
  if (!blocked.includes(domain)) {
    blocked.push(domain);
    localStorage.setItem(BLOCKED_DOMAINS_KEY, JSON.stringify(blocked));
  }
}

export function unblockDomain(domain: string) {
  const blocked = getBlockedDomains().filter(d => d !== domain);
  localStorage.setItem(BLOCKED_DOMAINS_KEY, JSON.stringify(blocked));
}

export function isDomainBlocked(domain: string): boolean {
  return getBlockedDomains().includes(domain);
}

export function exportHistoryAsJSON(): string {
  const history = getScanHistory();
  return JSON.stringify(history, null, 2);
}

export function exportHistoryAsCSV(): string {
  const history = getScanHistory();
  const headers = ['ID', 'URL', 'Risk Score', 'Category', 'Timestamp'];
  const rows = history.map(h => [h.id, h.url, h.riskScore, h.category, h.timestamp]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
