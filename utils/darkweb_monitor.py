"""
PhishGuard AI - Dark Web Monitoring
Monitor dark web for credential leaks and threats
"""

import hashlib
from datetime import datetime

class DarkWebMonitor:
    def __init__(self):
        self.monitored_items = {}
        self.alerts = []
    
    def add_email_monitor(self, email, user_id):
        """Add email to dark web monitoring"""
        monitor_id = hashlib.md5(f"{user_id}:{email}".encode()).hexdigest()[:12]
        
        monitor = {
            'id': monitor_id,
            'type': 'email',
            'value': email,
            'user_id': user_id,
            'created_at': datetime.now().isoformat(),
            'last_checked': None,
            'found': False
        }
        
        self.monitored_items[monitor_id] = monitor
        return monitor
    
    def add_domain_monitor(self, domain, user_id):
        """Add domain to dark web monitoring"""
        monitor_id = hashlib.md5(f"{user_id}:{domain}".encode()).hexdigest()[:12]
        
        monitor = {
            'id': monitor_id,
            'type': 'domain',
            'value': domain,
            'user_id': user_id,
            'created_at': datetime.now().isoformat(),
            'last_checked': None,
            'found': False
        }
        
        self.monitored_items[monitor_id] = monitor
        return monitor
    
    def add_brand_monitor(self, brand_name, user_id):
        """Add brand name to dark web monitoring"""
        monitor_id = hashlib.md5(f"{user_id}:{brand_name}".encode()).hexdigest()[:12]
        
        monitor = {
            'id': monitor_id,
            'type': 'brand',
            'value': brand_name,
            'user_id': user_id,
            'created_at': datetime.now().isoformat(),
            'last_checked': None,
            'found': False
        }
        
        self.monitored_items[monitor_id] = monitor
        return monitor
    
    def check_email_breach(self, email):
        """Check if email has been in data breaches"""
        # Simulate breach check (in production, use Have I Been Pwned API)
        breach_sources = [
            'Adobe', 'LinkedIn', 'Yahoo', 'MySpace', 'Dropbox',
            'Twitter', 'Facebook', 'Netflix', 'Spotify', 'GitHub'
        ]
        
        # Hash email for simulation
        email_hash = hashlib.md5(email.lower().encode()).hexdigest()
        hash_int = int(email_hash[:8], 16)
        
        # Simulate some breaches found
        breaches = []
        if hash_int % 3 == 0:  # ~33% chance of "breach"
            num_breaches = hash_int % 5 + 1
            for i in range(num_breaches):
                breach = {
                    'name': breach_sources[hash_int % len(breach_sources)],
                    'date': f'2024-{(hash_int % 12) + 1:02d}-{(hash_int % 28) + 1:02d}',
                    'data_types': ['Email', 'Password', 'Name'],
                    'records': hash_int * 1000
                }
                breaches.append(breach)
        
        return {
            'email': email,
            'breached': len(breaches) > 0,
            'breach_count': len(breaches),
            'breaches': breaches,
            'data_exposed': list(set(b for breach in breaches for b in breach['data_types']))
        }
    
    def check_password_exposure(self, password):
        """Check if password has been exposed"""
        import hashlib
        
        # Use SHA-1 prefix (like HIBP)
        sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
        
        # Simulate check
        common_passwords = ['password', '123456', 'qwerty', 'admin', 'letmein']
        
        return {
            'exposed': password.lower() in common_passwords,
            'exposure_count': 12345678 if password.lower() in common_passwords else 0,
            'message': 'This password has been exposed in data breaches' if password.lower() in common_passwords else 'Password not found in known breaches'
        }
    
    def check_domain_exposure(self, domain):
        """Check domain exposure on dark web"""
        # Simulate domain check
        domain_hash = hashlib.md5(domain.encode()).hexdigest()
        hash_int = int(domain_hash[:8], 16)
        
        findings = []
        if hash_int % 4 == 0:
            findings.append({
                'type': 'credential_dump',
                'source': 'Dark Web Forum',
                'date': '2024-01-15',
                'credentials_found': hash_int % 1000
            })
        
        if hash_int % 5 == 0:
            findings.append({
                'type': 'malware_config',
                'source': 'Malware Repository',
                'date': '2024-02-20',
                'threat': 'Phishing Kit'
            })
        
        return {
            'domain': domain,
            'exposed': len(findings) > 0,
            'findings': findings,
            'risk_level': 'High' if len(findings) > 1 else 'Medium' if findings else 'Low'
        }
    
    def get_user_alerts(self, user_id):
        """Get all alerts for a user"""
        return [a for a in self.alerts if a.get('user_id') == user_id]
    
    def add_alert(self, user_id, alert_type, message, severity='medium'):
        """Add a new alert"""
        alert = {
            'id': len(self.alerts) + 1,
            'user_id': user_id,
            'type': alert_type,
            'message': message,
            'severity': severity,
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        
        self.alerts.append(alert)
        return alert
    
    def get_user_monitors(self, user_id):
        """Get all monitors for a user"""
        return [m for m in self.monitored_items.values() if m['user_id'] == user_id]
    
    def remove_monitor(self, monitor_id):
        """Remove a monitor"""
        if monitor_id in self.monitored_items:
            del self.monitored_items[monitor_id]
            return True
        return False
    
    def get_threat_intelligence(self):
        """Get general threat intelligence"""
        return {
            'recent_breaches': [
                {'name': 'Major Tech Company', 'date': '2024-12-01', 'records': 50000000, 'data_types': ['Email', 'Password']},
                {'name': 'E-commerce Platform', 'date': '2024-11-15', 'records': 25000000, 'data_types': ['Email', 'Password', 'Credit Card']},
                {'name': 'Social Media App', 'date': '2024-11-01', 'records': 100000000, 'data_types': ['Email', 'Phone', 'Location']}
            ],
            'active_threat_campaigns': [
                {'name': 'Credential Stuffing Attack', 'severity': 'High', 'target': 'Financial Services'},
                {'name': 'Phishing Campaign', 'severity': 'Medium', 'target': 'Tech Companies'}
            ],
            'statistics': {
                'total_breaches_2024': 2847,
                'total_records_exposed': 8_500_000_000,
                'avg_time_to_report': '45 days'
            }
        }


class HaveIBeenPwnedIntegration:
    """Integration with Have I Been Pwned API"""
    
    def __init__(self, api_key=None):
        self.api_key = api_key
        self.base_url = 'https://haveibeenpwned.com/api/v3'
    
    def check_email(self, email):
        """Check email against HIBP database"""
        if not self.api_key:
            return {
                'error': 'API key not configured',
                'breached': None
            }
        
        import requests
        
        headers = {
            'hibp-api-key': self.api_key,
            'user-agent': 'PhishGuard-AI'
        }
        
        try:
            response = requests.get(
                f'{self.base_url}/breachedaccount/{email}',
                headers=headers,
                params={'truncateResponse': 'false'}
            )
            
            if response.status_code == 200:
                breaches = response.json()
                return {
                    'breached': True,
                    'breach_count': len(breaches),
                    'breaches': [{
                        'name': b['Name'],
                        'date': b['BreachDate'],
                        'data_types': b['DataClasses'],
                        'records': b['PwnCount']
                    } for b in breaches]
                }
            elif response.status_code == 404:
                return {
                    'breached': False,
                    'breach_count': 0,
                    'breaches': []
                }
            else:
                return {
                    'error': f'API error: {response.status_code}',
                    'breached': None
                }
                
        except Exception as e:
            return {
                'error': str(e),
                'breached': None
            }
    
    def check_password(self, password):
        """Check password using k-anonymity"""
        import hashlib
        import requests
        
        sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
        prefix = sha1[:5]
        suffix = sha1[5:]
        
        try:
            response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')
            
            if response.status_code == 200:
                hashes = (line.split(':') for line in response.text.splitlines())
                for hash_suffix, count in hashes:
                    if hash_suffix == suffix:
                        return {
                            'exposed': True,
                            'exposure_count': int(count)
                        }
                
                return {
                    'exposed': False,
                    'exposure_count': 0
                }
            else:
                return {
                    'error': f'API error: {response.status_code}',
                    'exposed': None
                }
                
        except Exception as e:
            return {
                'error': str(e),
                'exposed': None
            }
