"""
PhishGuard AI - SSL Certificate Checker
Verify SSL certificates for URLs
"""

import ssl
import socket
from datetime import datetime

def check_ssl_certificate(hostname):
    """Check SSL certificate validity and details"""
    try:
        context = ssl.create_default_context()
        conn = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=hostname
        )
        conn.settimeout(5.0)
        conn.connect((hostname, 443))
        cert = conn.getpeercert()
        
        # Parse certificate details
        issuer = dict(x[0] for x in cert.get('issuer', []))
        subject = dict(x[0] for x in cert.get('subject', []))
        
        # Parse dates
        not_before = datetime.strptime(cert.get('notBefore'), '%b %d %H:%M:%S %Y %Z')
        not_after = datetime.strptime(cert.get('notAfter'), '%b %d %H:%M:%S %Y %Z')
        
        # Calculate days until expiry
        days_until_expiry = (not_after - datetime.now()).days
        
        conn.close()
        
        return {
            'valid': True,
            'issuer': issuer.get('organizationName', 'Unknown'),
            'subject': subject.get('commonName', hostname),
            'valid_from': not_before.strftime('%Y-%m-%d'),
            'valid_to': not_after.strftime('%Y-%m-%d'),
            'days_until_expiry': days_until_expiry,
            'serial_number': cert.get('serialNumber'),
            'version': cert.get('version')
        }
    except ssl.SSLCertVerificationError:
        return {
            'valid': False,
            'error': 'SSL certificate verification failed'
        }
    except socket.timeout:
        return {
            'valid': False,
            'error': 'Connection timeout'
        }
    except Exception as e:
        return {
            'valid': False,
            'error': str(e)
        }


def check_ssl_protocol(hostname):
    """Check supported SSL/TLS protocols"""
    protocols = {
        'TLSv1.3': ssl.TLSVersion.TLSv1_3,
        'TLSv1.2': ssl.TLSVersion.TLSv1_2,
        'TLSv1.1': ssl.TLSVersion.TLSv1_1,
        'TLSv1.0': ssl.TLSVersion.TLSv1,
    }
    
    supported = []
    for name, version in protocols.items():
        try:
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            context.minimum_version = version
            context.maximum_version = version
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            conn = context.wrap_socket(
                socket.socket(socket.AF_INET),
                server_hostname=hostname
            )
            conn.settimeout(3.0)
            conn.connect((hostname, 443))
            supported.append(name)
            conn.close()
        except:
            pass
    
    return supported
