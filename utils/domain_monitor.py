"""
PhishGuard AI - Domain Monitoring System
Track domain changes, SSL certificates, and expiration dates
"""

import json
import hashlib
from datetime import datetime, timedelta
from database.models import Database

class DomainMonitor:
    def __init__(self):
        self.db = Database()
        self.monitored_domains = {}
    
    def add_domain(self, user_id, domain, alert_days_before=30):
        """Add a domain to monitor"""
        monitor_id = hashlib.md5(f"{user_id}:{domain}".encode()).hexdigest()[:12]
        
        domain_info = self._get_domain_info(domain)
        
        monitor = {
            'id': monitor_id,
            'user_id': user_id,
            'domain': domain,
            'alert_days_before': alert_days_before,
            'status': 'active',
            'created_at': datetime.now().isoformat(),
            'last_checked': None,
            'domain_info': domain_info,
            'changes': []
        }
        
        self.monitored_domains[monitor_id] = monitor
        return monitor
    
    def _get_domain_info(self, domain):
        """Get domain information"""
        try:
            import whois
            w = whois.whois(domain)
            
            return {
                'registrar': w.registrar,
                'creation_date': str(w.creation_date) if w.creation_date else None,
                'expiration_date': str(w.expiration_date) if w.expiration_date else None,
                'name_servers': w.name_servers if w.name_servers else [],
                'status': w.status if w.status else [],
                'registrant': w.org if hasattr(w, 'org') else None,
                'country': w.country if hasattr(w, 'country') else None
            }
        except:
            return {
                'registrar': 'Unknown',
                'creation_date': None,
                'expiration_date': None,
                'name_servers': [],
                'status': [],
                'error': 'Could not fetch domain info'
            }
    
    def check_domain(self, monitor_id):
        """Check domain for changes"""
        monitor = self.monitored_domains.get(monitor_id)
        if not monitor:
            return None
        
        domain = monitor['domain']
        old_info = monitor.get('domain_info', {})
        new_info = self._get_domain_info(domain)
        
        changes = []
        
        # Check for expiration
        if new_info.get('expiration_date'):
            try:
                exp_date = datetime.strptime(new_info['expiration_date'], '%Y-%m-%d')
                days_until_expiry = (exp_date - datetime.now()).days
                
                if days_until_expiry <= monitor['alert_days_before']:
                    changes.append({
                        'type': 'expiry_warning',
                        'message': f'Domain expires in {days_until_expiry} days',
                        'severity': 'high' if days_until_expiry <= 7 else 'medium',
                        'data': {
                            'expiration_date': new_info['expiration_date'],
                            'days_until_expiry': days_until_expiry
                        }
                    })
            except:
                pass
        
        # Check for nameserver changes
        old_ns = set(str(ns) for ns in old_info.get('name_servers', []))
        new_ns = set(str(ns) for ns in new_info.get('name_servers', []))
        if old_ns and old_ns != new_ns:
            changes.append({
                'type': 'nameserver_change',
                'message': 'Domain nameservers have changed',
                'severity': 'high',
                'data': {
                    'old_nameservers': list(old_ns),
                    'new_nameservers': list(new_ns)
                }
            })
        
        # Check for registrar changes
        if old_info.get('registrar') and old_info['registrar'] != new_info.get('registrar'):
            changes.append({
                'type': 'registrar_change',
                'message': 'Domain registrar has changed',
                'severity': 'critical',
                'data': {
                    'old_registrar': old_info['registrar'],
                    'new_registrar': new_info.get('registrar')
                }
            })
        
        # Update monitor
        monitor['domain_info'] = new_info
        monitor['last_checked'] = datetime.now().isoformat()
        
        if changes:
            monitor['changes'].extend(changes)
        
        return {
            'domain': domain,
            'changes': changes,
            'info': new_info
        }
    
    def get_expiry_status(self, domain):
        """Get domain expiration status"""
        info = self._get_domain_info(domain)
        
        if not info.get('expiration_date'):
            return {'status': 'unknown', 'message': 'Could not retrieve expiration date'}
        
        try:
            exp_date = datetime.strptime(info['expiration_date'], '%Y-%m-%d')
            days_until_expiry = (exp_date - datetime.now()).days
            
            if days_until_expiry < 0:
                status = 'expired'
                message = f'Domain expired {abs(days_until_expiry)} days ago'
            elif days_until_expiry <= 7:
                status = 'critical'
                message = f'Expires in {days_until_expiry} days - IMMEDIATE ACTION REQUIRED'
            elif days_until_expiry <= 30:
                status = 'warning'
                message = f'Expires in {days_until_expiry} days'
            else:
                status = 'ok'
                message = f'Expires in {days_until_expiry} days'
            
            return {
                'status': status,
                'message': message,
                'days_until_expiry': days_until_expiry,
                'expiration_date': info['expiration_date']
            }
        except:
            return {'status': 'error', 'message': 'Could not parse expiration date'}
    
    def get_user_domains(self, user_id):
        """Get all monitored domains for a user"""
        return [m for m in self.monitored_domains.values() if m['user_id'] == user_id]
    
    def remove_domain(self, monitor_id):
        """Remove a domain from monitoring"""
        if monitor_id in self.monitored_domains:
            del self.monitored_domains[monitor_id]
            return True
        return False
    
    def get_all_changes(self, user_id):
        """Get all changes for user's monitored domains"""
        domains = self.get_user_domains(user_id)
        all_changes = []
        
        for domain in domains:
            for change in domain.get('changes', []):
                all_changes.append({
                    'domain': domain['domain'],
                    **change
                })
        
        all_changes.sort(key=lambda x: x.get('severity', ''), reverse=True)
        return all_changes


class CertificateMonitor:
    """Monitor SSL certificates across multiple domains"""
    
    def __init__(self):
        self.certificates = {}
    
    def add_certificate(self, domain, user_id=None):
        """Add certificate to monitor"""
        from utils.ssl_checker import check_ssl_certificate
        
        cert_info = check_ssl_certificate(domain)
        
        cert = {
            'domain': domain,
            'user_id': user_id,
            'added_at': datetime.now().isoformat(),
            'last_checked': datetime.now().isoformat(),
            'certificate': cert_info
        }
        
        self.certificates[domain] = cert
        return cert
    
    def check_certificate(self, domain):
        """Check certificate status"""
        from utils.ssl_checker import check_ssl_certificate
        
        cert = self.certificates.get(domain)
        if not cert:
            return None
        
        old_info = cert.get('certificate', {})
        new_info = check_ssl_certificate(domain)
        
        changes = []
        
        # Check for expiry warning
        if new_info.get('days_until_expiry'):
            if new_info['days_until_expiry'] <= 30:
                changes.append({
                    'type': 'cert_expiring',
                    'domain': domain,
                    'days_left': new_info['days_until_expiry'],
                    'severity': 'high' if new_info['days_until_expiry'] <= 7 else 'medium'
                })
        
        # Check for validity change
        if old_info.get('valid') and not new_info.get('valid'):
            changes.append({
                'type': 'cert_invalid',
                'domain': domain,
                'severity': 'critical'
            })
        
        cert['certificate'] = new_info
        cert['last_checked'] = datetime.now().isoformat()
        
        return {
            'domain': domain,
            'certificate': new_info,
            'changes': changes
        }
    
    def get_expiring_certificates(self, days=30):
        """Get certificates expiring within specified days"""
        expiring = []
        
        for domain, cert in self.certificates.items():
            cert_info = cert.get('certificate', {})
            if cert_info.get('days_until_expiry', 999) <= days:
                expiring.append({
                    'domain': domain,
                    'days_left': cert_info.get('days_until_expiry'),
                    'expiration_date': cert_info.get('valid_to')
                })
        
        expiring.sort(key=lambda x: x['days_left'])
        return expiring
