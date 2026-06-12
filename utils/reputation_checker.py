"""
PhishGuard AI - Reputation Checker
Check domain reputation using VirusTotal and other sources
"""

import requests
import os
import hashlib
import base64

def check_virustotal(url):
    """Check URL reputation using VirusTotal API"""
    api_key = os.getenv('VIRUSTOTAL_API_KEY')
    
    if not api_key:
        return {
            'reputation': 0,
            'detections': 0,
            'total_engines': 0,
            'details': ['VirusTotal API key not configured'],
            'available': False
        }
    
    try:
        # Encode URL for VirusTotal
        url_id = base64.urlsafe_b64encode(url.encode()).decode().rstrip('=')
        
        headers = {
            'x-apikey': api_key,
            'Accept': 'application/json'
        }
        
        response = requests.get(
            f'https://www.virustotal.com/api/v3/urls/{url_id}',
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            attributes = data.get('data', {}).get('attributes', {})
            stats = attributes.get('last_analysis_stats', {})
            
            return {
                'reputation': attributes.get('reputation', 0),
                'detections': stats.get('malicious', 0),
                'suspicious': stats.get('suspicious', 0),
                'harmless': stats.get('harmless', 0),
                'undetected': stats.get('undetected', 0),
                'total_engines': stats.get('total', 0) if 'total' in stats else 70,
                'last_analysis_date': attributes.get('last_analysis_date'),
                'details': [
                    f"Malicious: {stats.get('malicious', 0)}",
                    f"Suspicious: {stats.get('suspicious', 0)}",
                    f"Harmless: {stats.get('harmless', 0)}"
                ],
                'available': True
            }
        elif response.status_code == 404:
            return {
                'reputation': 0,
                'detections': 0,
                'total_engines': 0,
                'details': ['URL not found in VirusTotal database'],
                'available': True
            }
        else:
            return {
                'reputation': 0,
                'detections': 0,
                'total_engines': 0,
                'details': [f'VirusTotal API error: {response.status_code}'],
                'available': False
            }
    except Exception as e:
        return {
            'reputation': 0,
            'detections': 0,
            'total_engines': 0,
            'details': [f'VirusTotal check failed: {str(e)}'],
            'available': False
        }


def check_google_safe_browsing(url):
    """Check URL with Google Safe Browsing API"""
    api_key = os.getenv('GOOGLE_SAFE_BROWSING_API_KEY')
    
    if not api_key:
        return {
            'safe': True,
            'threats': [],
            'details': ['Google Safe Browsing API key not configured'],
            'available': False
        }
    
    try:
        response = requests.post(
            f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}',
            json={
                'client': {
                    'clientId': 'phishguard-ai',
                    'clientVersion': '1.0.0'
                },
                'threatInfo': {
                    'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                    'platformTypes': ['ANY_PLATFORM'],
                    'threatEntryTypes': ['URL'],
                    'threatEntries': [{'url': url}]
                }
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            matches = data.get('matches', [])
            
            if matches:
                return {
                    'safe': False,
                    'threats': [m.get('threatType') for m in matches],
                    'details': [f"Google Safe Browsing detected: {m.get('threatType')}" for m in matches],
                    'available': True
                }
            else:
                return {
                    'safe': True,
                    'threats': [],
                    'details': ['No threats detected by Google Safe Browsing'],
                    'available': True
                }
    except Exception as e:
        pass
    
    return {
        'safe': True,
        'threats': [],
        'details': ['Google Safe Browsing check failed'],
        'available': False
    }


def check_phishtank(url):
    """Check URL against PhishTank database"""
    api_key = os.getenv('PHISHTANK_API_KEY')
    
    if not api_key:
        return {
            'is_phish': False,
            'in_database': False,
            'details': ['PhishTank API key not configured'],
            'available': False
        }
    
    try:
        response = requests.post(
            'https://checkurl.phishtank.com/checkurl/',
            data={
                'url': url,
                'format': 'json',
                'app_key': api_key
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', {})
            
            return {
                'is_phish': results.get('in_database', False) and results.get('verified', False),
                'in_database': results.get('in_database', False),
                'verified': results.get('verified', False),
                'phish_id': results.get('phish_id'),
                'phish_detail_page': results.get('phish_detail_page'),
                'details': ['Verified phishing site'] if results.get('verified') else ['Not in PhishTank database'],
                'available': True
            }
    except Exception as e:
        pass
    
    return {
        'is_phish': False,
        'in_database': False,
        'details': ['PhishTank check failed'],
        'available': False
    }


def get_reputation_score(virustotal, google_safe_browsing, phishtank):
    """Calculate overall reputation score from multiple sources"""
    score = 100
    
    # VirusTotal scoring
    if virustotal.get('available'):
        detections = virustotal.get('detections', 0)
        if detections > 10:
            score -= 50
        elif detections > 5:
            score -= 30
        elif detections > 0:
            score -= 15
    
    # Google Safe Browsing scoring
    if google_safe_browsing.get('available') and not google_safe_browsing.get('safe', True):
        score -= 40
    
    # PhishTank scoring
    if phishtank.get('available') and phishtank.get('is_phish'):
        score -= 60
    
    return max(0, min(100, score))
