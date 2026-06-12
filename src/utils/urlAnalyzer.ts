export interface URLFeatures {
  urlLength: number;
  dotCount: number;
  hyphenCount: number;
  hasAtSymbol: boolean;
  hasHTTPS: boolean;
  sslValid: boolean;
  domainAge: number;
  domainExpiry: number;
  suspiciousKeywords: string[];
  redirectCount: number;
  subdomainCount: number;
  ipAddress: boolean;
  tinyURL: boolean;
  hasPort: boolean;
  pathLength: number;
  queryLength: number;
  hasIframe: boolean;
  hasPopup: boolean;
  hasLoginForm: boolean;
  brandImpersonation: string[];
}

export interface ScanResult {
  id: string;
  url: string;
  riskScore: number;
  category: 'Safe' | 'Low Risk' | 'Suspicious' | 'High Risk' | 'Phishing';
  features: URLFeatures;
  timestamp: string;
  virusTotal: {
    reputation: number;
    detections: number;
    totalEngines: number;
    details: string[];
  };
  whois: {
    registrar: string;
    created: string;
    expires: string;
    updated: string;
    country: string;
  };
  ssl: {
    issuer: string;
    validFrom: string;
    validTo: string;
    cipher: string;
    protocol: string;
  };
  recommendations: string[];
}

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'account', 'update', 'confirm', 'secure',
  'banking', 'password', 'credential', 'authenticate', 'validation',
  'suspend', 'limited', 'access', 'security', 'alert', 'warning',
  'paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon',
  'netflix', 'bank', 'chase', 'wells-fargo', 'citibank', 'amex',
  'free', 'gift', 'prize', 'winner', 'lottery', 'claim',
  'urgent', 'immediate', 'action-required', 'expires-soon'
];

const BRAND_NAMES = [
  'paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon',
  'netflix', 'spotify', 'instagram', 'twitter', 'linkedin',
  'chase', 'bankofamerica', 'wellsfargo', 'citi', 'amex',
  'visa', 'mastercard', 'discover', 'coinbase', 'binance'
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function analyzeURL(url: string): ScanResult {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const search = urlObj.search.toLowerCase();
    const fullUrl = url.toLowerCase();

    // Feature extraction
    const urlLength = url.length;
    const dotCount = (url.match(/\./g) || []).length;
    const hyphenCount = (url.match(/-/g) || []).length;
    const hasAtSymbol = url.includes('@');
    const hasHTTPS = urlObj.protocol === 'https:';
    const pathLength = pathname.length;
    const queryLength = search.length;
    const hasPort = urlObj.port !== '';
    const ipAddress = /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.startsWith('0x');
    const tinyURL = hostname.length < 10 && dotCount <= 1;

    const subdomainParts = hostname.split('.');
    const subdomainCount = subdomainParts.length > 2 ? subdomainParts.length - 2 : 0;

    const suspiciousKeywords = SUSPICIOUS_KEYWORDS.filter(kw => 
      fullUrl.includes(kw) || pathname.includes(kw) || search.includes(kw)
    );

    const brandImpersonation = BRAND_NAMES.filter(brand => {
      const domainParts = hostname.split('.');
      const mainDomain = domainParts.length >= 2 ? domainParts[domainParts.length - 2] : hostname;
      return hostname.includes(brand) && mainDomain !== brand;
    });

    // Deterministic "random" values based on URL hash
    const urlHash = hashString(url);
    const sslValid = hasHTTPS && (urlHash % 100 > 15);
    const domainAge = 30 + (urlHash % 1825); // 1 month to 5 years
    const domainExpiry = 30 + (urlHash % 730); // 1 month to 2 years
    const redirectCount = urlHash % 5;
    const hasIframe = urlHash % 100 < 30;
    const hasPopup = urlHash % 100 < 25;
    const hasLoginForm = suspiciousKeywords.some(k => ['login', 'signin', 'authenticate'].includes(k));

    // Calculate risk score
    let riskScore = 0;

    if (!hasHTTPS) riskScore += 15;
    if (!sslValid && hasHTTPS) riskScore += 10;
    if (urlLength > 75) riskScore += 10;
    if (dotCount > 3) riskScore += 10;
    if (hyphenCount > 2) riskScore += 8;
    if (hasAtSymbol) riskScore += 15;
    if (ipAddress) riskScore += 20;
    if (tinyURL) riskScore += 10;
    if (hasPort) riskScore += 5;
    if (subdomainCount > 2) riskScore += 10;
    if (redirectCount > 2) riskScore += 8;
    if (hasIframe) riskScore += 5;
    if (hasPopup) riskScore += 5;
    if (hasLoginForm) riskScore += 10;
    if (pathLength > 50) riskScore += 5;
    if (queryLength > 30) riskScore += 5;
    if (suspiciousKeywords.length > 0) riskScore += suspiciousKeywords.length * 3;
    if (brandImpersonation.length > 0) riskScore += brandImpersonation.length * 15;
    if (domainAge < 90) riskScore += 15;
    if (domainExpiry < 30) riskScore += 10;

    riskScore = Math.min(100, Math.max(0, riskScore));

    // Override for known safe domains
    const safeDomains = ['google.com', 'github.com', 'stackoverflow.com', 'microsoft.com', 'apple.com', 'amazon.com', 'linkedin.com', 'twitter.com', 'facebook.com', 'youtube.com', 'wikipedia.org', 'reddit.com', 'netflix.com'];
    if (safeDomains.some(d => hostname.endsWith(d))) {
      riskScore = Math.min(riskScore, 10);
    }

    // Override for known phishing patterns
    const phishingPatterns = ['bit.ly', 'tinyurl', 'short.link', 'phish', 'fake', 'clone', 'mirror'];
    if (phishingPatterns.some(p => hostname.includes(p))) {
      riskScore = Math.max(riskScore, 75);
    }

    let category: ScanResult['category'];
    if (riskScore <= 20) category = 'Safe';
    else if (riskScore <= 40) category = 'Low Risk';
    else if (riskScore <= 60) category = 'Suspicious';
    else if (riskScore <= 80) category = 'High Risk';
    else category = 'Phishing';

    // VirusTotal simulation
    const detections = Math.floor((riskScore / 100) * (urlHash % 70));
    const virusTotalDetails = [];
    if (riskScore > 50) {
      virusTotalDetails.push('Flagged by heuristic analysis');
      if (riskScore > 70) virusTotalDetails.push('Detected as phishing by 3+ engines');
      if (brandImpersonation.length > 0) virusTotalDetails.push('Brand impersonation detected');
    }
    if (sslValid) virusTotalDetails.push('Valid SSL certificate');
    else virusTotalDetails.push('Invalid or missing SSL certificate');

    // WHOIS simulation
    const registrars = ['GoDaddy', 'Namecheap', 'Cloudflare', 'Google Domains', 'AWS Route53', 'Dynadot'];
    const countries = ['US', 'CA', 'GB', 'DE', 'NL', 'SG', 'IN', 'RU', 'CN'];
    const registrar = registrars[urlHash % registrars.length];
    const country = countries[urlHash % countries.length];

    const now = new Date();
    const created = new Date(now.getTime() - domainAge * 24 * 60 * 60 * 1000);
    const expires = new Date(now.getTime() + domainExpiry * 24 * 60 * 60 * 1000);
    const updated = new Date(created.getTime() + (urlHash % 365) * 24 * 60 * 60 * 1000);

    // SSL simulation
    const sslIssuers = ['DigiCert Inc', 'Let\'s Encrypt', 'GlobalSign', 'Sectigo', 'GoDaddy'];
    const ciphers = ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256', 'ECDHE-RSA-AES256-GCM-SHA384'];
    const protocols = ['TLS 1.3', 'TLS 1.2'];

    const sslIssuer = sslIssuers[urlHash % sslIssuers.length];
    const cipher = ciphers[urlHash % ciphers.length];
    const protocol = protocols[urlHash % protocols.length];
    const sslValidFrom = new Date(now.getTime() - (urlHash % 365) * 24 * 60 * 60 * 1000);
    const sslValidTo = new Date(now.getTime() + (365 + urlHash % 365) * 24 * 60 * 60 * 1000);

    // Recommendations
    const recommendations: string[] = [];
    if (!hasHTTPS) recommendations.push('Enable HTTPS for secure communication');
    if (!sslValid) recommendations.push('Renew or fix SSL certificate');
    if (suspiciousKeywords.length > 0) recommendations.push('Remove suspicious keywords from URL');
    if (brandImpersonation.length > 0) recommendations.push('Avoid brand impersonation in domain name');
    if (domainAge < 90) recommendations.push('New domain - exercise caution');
    if (redirectCount > 2) recommendations.push('Reduce number of redirects');
    if (hasAtSymbol) recommendations.push('Remove @ symbol from URL');
    if (ipAddress) recommendations.push('Use domain name instead of IP address');
    if (subdomainCount > 2) recommendations.push('Reduce excessive subdomains');
    if (recommendations.length === 0) {
      recommendations.push('URL appears safe - maintain current security practices');
      recommendations.push('Continue monitoring for changes');
    }

    return {
      id: generateId(),
      url,
      riskScore,
      category,
      features: {
        urlLength,
        dotCount,
        hyphenCount,
        hasAtSymbol,
        hasHTTPS,
        sslValid,
        domainAge,
        domainExpiry,
        suspiciousKeywords,
        redirectCount,
        subdomainCount,
        ipAddress,
        tinyURL,
        hasPort,
        pathLength,
        queryLength,
        hasIframe,
        hasPopup,
        hasLoginForm,
        brandImpersonation,
      },
      timestamp: now.toISOString(),
      virusTotal: {
        reputation: Math.max(0, 100 - riskScore),
        detections,
        totalEngines: 70,
        details: virusTotalDetails,
      },
      whois: {
        registrar,
        created: created.toISOString().split('T')[0],
        expires: expires.toISOString().split('T')[0],
        updated: updated.toISOString().split('T')[0],
        country,
      },
      ssl: {
        issuer: sslIssuer,
        validFrom: sslValidFrom.toISOString().split('T')[0],
        validTo: sslValidTo.toISOString().split('T')[0],
        cipher,
        protocol,
      },
      recommendations,
    };
  } catch (error) {
    // Return a high-risk result for invalid URLs
    return {
      id: generateId(),
      url,
      riskScore: 85,
      category: 'High Risk',
      features: {
        urlLength: url.length,
        dotCount: 0,
        hyphenCount: 0,
        hasAtSymbol: url.includes('@'),
        hasHTTPS: false,
        sslValid: false,
        domainAge: 0,
        domainExpiry: 0,
        suspiciousKeywords: ['invalid-url'],
        redirectCount: 0,
        subdomainCount: 0,
        ipAddress: false,
        tinyURL: false,
        hasPort: false,
        pathLength: 0,
        queryLength: 0,
        hasIframe: false,
        hasPopup: false,
        hasLoginForm: false,
        brandImpersonation: [],
      },
      timestamp: new Date().toISOString(),
      virusTotal: {
        reputation: 15,
        detections: 12,
        totalEngines: 70,
        details: ['Invalid URL format detected', 'Unable to verify domain'],
      },
      whois: {
        registrar: 'Unknown',
        created: 'Unknown',
        expires: 'Unknown',
        updated: 'Unknown',
        country: 'Unknown',
      },
      ssl: {
        issuer: 'None',
        validFrom: 'N/A',
        validTo: 'N/A',
        cipher: 'N/A',
        protocol: 'None',
      },
      recommendations: [
        'Invalid URL format - verify the URL',
        'Do not proceed with this URL',
        'Report suspicious URL to security team',
      ],
    };
  }
}

export function getCategoryColor(category: ScanResult['category']): string {
  switch (category) {
    case 'Safe': return '#00ff88';
    case 'Low Risk': return '#00d4ff';
    case 'Suspicious': return '#ffdd00';
    case 'High Risk': return '#ffaa00';
    case 'Phishing': return '#ff3366';
  }
}

export function getCategoryBg(category: ScanResult['category']): string {
  switch (category) {
    case 'Safe': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    case 'Low Risk': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    case 'Suspicious': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    case 'High Risk': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    case 'Phishing': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  }
}
