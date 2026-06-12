"""
PhishGuard AI - URL Feature Extractor
Extract features from URLs for phishing detection
"""

import re
from urllib.parse import urlparse

def extract_features(url):
    """Extract comprehensive features from URL"""
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or parsed.netloc
        path = parsed.path
        query = parsed.query
        
        # URL-based features
        features = {
            'url_length': len(url),
            'dot_count': url.count('.'),
            'hyphen_count': url.count('-'),
            'has_at': 1 if '@' in url else 0,
            'has_https': 1 if parsed.scheme == 'https' else 0,
            'path_length': len(path),
            'query_length': len(query),
        }
        
        # Domain features
        subdomains = hostname.split('.') if hostname else []
        features['subdomain_count'] = len(subdomains) - 2 if len(subdomains) > 2 else 0
        
        # Check for IP address
        features['ip_address'] = 1 if re.match(r'^\d+\.\d+\.\d+\.\d+$', hostname or '') else 0
        
        # Check for tiny URL
        features['tiny_url'] = 1 if len(hostname or '') < 10 else 0
        
        # Check for port
        features['has_port'] = 1 if ':' in (hostname or '') else 0
        
        # Suspicious keywords
        suspicious_keywords = [
            'login', 'signin', 'verify', 'account', 'update', 'confirm', 'secure',
            'banking', 'password', 'credential', 'authenticate', 'validation',
            'suspend', 'limited', 'access', 'security', 'alert', 'warning',
            'free', 'gift', 'prize', 'winner', 'lottery', 'claim',
            'urgent', 'immediate', 'action-required'
        ]
        features['suspicious_keywords'] = sum(1 for kw in suspicious_keywords if kw in url.lower())
        
        # Brand impersonation
        brands = ['paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon',
                 'netflix', 'spotify', 'instagram', 'twitter', 'linkedin',
                 'chase', 'bankofamerica', 'wellsfargo', 'citi', 'amex']
        features['brand_impersonation'] = sum(1 for brand in brands if brand in (hostname or '').lower())
        
        return features
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None


def extract_domain_features(hostname):
    """Extract features specific to domain"""
    features = {}
    
    # Check for suspicious TLDs
    suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.ws']
    features['suspicious_tld'] = 1 if any(tld in hostname.lower() for tld in suspicious_tlds) else 0
    
    # Check for numeric domain
    domain_parts = hostname.split('.')
    if len(domain_parts) >= 2:
        main_domain = domain_parts[-2]
        features['numeric_domain'] = 1 if main_domain.isdigit() else 0
    else:
        features['numeric_domain'] = 0
    
    # Check for excessive length
    features['long_domain'] = 1 if len(hostname) > 30 else 0
    
    return features
