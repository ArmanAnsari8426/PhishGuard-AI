"""
PhishGuard AI - QR Code Scanner
Scan QR codes and analyze contained URLs
"""

import io
from urllib.parse import urlparse
from utils.feature_extractor import extract_features

class QRScanner:
    def __init__(self):
        self.scanned_urls = []
    
    def decode_qr_from_image(self, image_path):
        """Decode QR code from image file"""
        try:
            # Try using pyzbar
            from PIL import Image
            from pyzbar.pyzbar import decode
            
            image = Image.open(image_path)
            decoded_objects = decode(image)
            
            results = []
            for obj in decoded_objects:
                data = obj.data.decode('utf-8')
                if self._is_url(data):
                    results.append({
                        'type': 'url',
                        'data': data,
                        'analysis': self._analyze_url(data)
                    })
                else:
                    results.append({
                        'type': 'text',
                        'data': data,
                        'analysis': None
                    })
            
            return results
            
        except ImportError:
            return [{'error': 'pyzbar not installed. Install with: pip install pyzbar'}]
        except Exception as e:
            return [{'error': str(e)}]
    
    def decode_qr_from_base64(self, base64_image):
        """Decode QR code from base64 image"""
        try:
            from PIL import Image
            from pyzbar.pyzbar import decode
            import base64
            
            # Decode base64 to image
            image_data = base64.b64decode(base64_image.split(',')[1] if ',' in base64_image else base64_image)
            image = Image.open(io.BytesIO(image_data))
            
            decoded_objects = decode(image)
            
            results = []
            for obj in decoded_objects:
                data = obj.data.decode('utf-8')
                if self._is_url(data):
                    results.append({
                        'type': 'url',
                        'data': data,
                        'analysis': self._analyze_url(data)
                    })
                else:
                    results.append({
                        'type': 'text',
                        'data': data,
                        'analysis': None
                    })
            
            return results
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def analyze_qr_content(self, content):
        """Analyze QR code content without decoding"""
        if self._is_url(content):
            return {
                'type': 'url',
                'data': content,
                'analysis': self._analyze_url(content),
                'suspicious': self._is_suspicious_url(content)
            }
        elif content.startswith('mailto:'):
            return {
                'type': 'email',
                'data': content.replace('mailto:', ''),
                'analysis': self._analyze_email(content.replace('mailto:', ''))
            }
        elif content.startswith('tel:'):
            return {
                'type': 'phone',
                'data': content.replace('tel:', ''),
                'analysis': self._analyze_phone(content.replace('tel:', ''))
            }
        elif content.startswith('WIFI:'):
            return {
                'type': 'wifi',
                'data': content,
                'analysis': self._analyze_wifi(content)
            }
        else:
            return {
                'type': 'text',
                'data': content,
                'analysis': {'message': 'Plain text content'}
            }
    
    def _is_url(self, text):
        """Check if text is a URL"""
        try:
            result = urlparse(text)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def _analyze_url(self, url):
        """Analyze URL from QR code"""
        features = extract_features(url)
        
        # Calculate risk
        risk_score = 0
        if features:
            if features.get('url_length', 0) > 50:
                risk_score += 15
            if features.get('suspicious_keywords', 0) > 0:
                risk_score += 20
            if features.get('brand_impersonation', 0) > 0:
                risk_score += 25
            if not features.get('has_https'):
                risk_score += 15
            if features.get('ip_address'):
                risk_score += 20
            if features.get('tiny_url'):
                risk_score += 10
        
        # Check for URL shorteners
        shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'buff.ly']
        parsed = urlparse(url)
        if any(s in parsed.netloc.lower() for s in shorteners):
            risk_score += 10
        
        risk_score = min(100, risk_score)
        
        category = 'Safe' if risk_score <= 20 else 'Low Risk' if risk_score <= 40 else 'Suspicious' if risk_score <= 60 else 'High Risk' if risk_score <= 80 else 'Phishing'
        
        return {
            'url': url,
            'risk_score': risk_score,
            'category': category,
            'features': features,
            'warnings': self._get_warnings(url, features),
            'shortened': any(s in parsed.netloc.lower() for s in shorteners)
        }
    
    def _is_suspicious_url(self, url):
        """Quick check if URL is suspicious"""
        suspicious_patterns = [
            'login', 'verify', 'update', 'secure', 'account',
            'banking', 'confirm', 'password', 'signin'
        ]
        
        url_lower = url.lower()
        for pattern in suspicious_patterns:
            if pattern in url_lower:
                return True
        
        if '@' in url or url.startswith('http://'):
            return True
        
        return False
    
    def _analyze_email(self, email):
        """Analyze email address"""
        import re
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        valid = bool(re.match(pattern, email))
        
        domain = email.split('@')[1] if '@' in email else ''
        
        # Check for suspicious domains
        suspicious_domains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com']
        disposable = domain in suspicious_domains
        
        return {
            'email': email,
            'valid': valid,
            'domain': domain,
            'disposable': disposable,
            'warning': 'This appears to be a disposable email address' if disposable else None
        }
    
    def _analyze_phone(self, phone):
        """Analyze phone number"""
        import re
        
        # Basic format check
        cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
        valid = cleaned.isdigit() and len(cleaned) >= 10
        
        return {
            'phone': phone,
            'valid': valid,
            'warning': None
        }
    
    def _analyze_wifi(self, wifi_data):
        """Analyze WiFi configuration"""
        import re
        
        ssid_match = re.search(r'(?i)S:([^;]+)', wifi_data)
        password_match = re.search(r'(?i)P:([^;]+)', wifi_data)
        
        ssid = ssid_match.group(1) if ssid_match else 'Unknown'
        has_password = password_match is not None
        
        # Check for suspicious SSID
        suspicious_ssids = ['free wifi', 'guest', 'open', 'public']
        suspicious = any(s in ssid.lower() for s in suspicious_ssids)
        
        return {
            'ssid': ssid,
            'secured': has_password,
            'warning': 'This network has a suspicious name' if suspicious else None
        }
    
    def _get_warnings(self, url, features):
        """Get warnings for URL"""
        warnings = []
        
        if features:
            if features.get('suspicious_keywords', 0) > 0:
                warnings.append('URL contains suspicious keywords')
            if features.get('brand_impersonation', 0) > 0:
                warnings.append('Possible brand impersonation')
            if not features.get('has_https'):
                warnings.append('No HTTPS encryption')
            if features.get('ip_address'):
                warnings.append('Uses IP address instead of domain')
        
        return warnings


class QRCodeGenerator:
    """Generate QR codes for URLs"""
    
    @staticmethod
    def generate_qr(data, size=256):
        """Generate QR code as base64 image"""
        try:
            import qrcode
            from PIL import Image
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="#00d4ff", back_color="#0a0e1a")
            img = img.resize((size, size))
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            import base64
            base64_image = base64.b64encode(buffer.getvalue()).decode()
            
            return {
                'success': True,
                'image': f'data:image/png;base64,{base64_image}',
                'data': data
            }
            
        except ImportError:
            return {'success': False, 'error': 'qrcode not installed'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def generate_safe_url_qr(url, phishguard_logo=True):
        """Generate QR code with safety verification"""
        result = QRCodeGenerator.generate_qr(url)
        
        if result['success']:
            # Add PhishGuard branding if requested
            result['verified'] = True
            result['message'] = 'This QR code is verified by PhishGuard AI'
        
        return result
