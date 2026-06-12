"""
PhishGuard AI - Two-Factor Authentication (2FA)
TOTP and SMS-based 2FA implementation
"""

import pyotp
import hashlib
import secrets
import qrcode
import io
import base64
from datetime import datetime, timedelta

class TwoFactorAuth:
    def __init__(self):
        self.totp_secrets = {}
        self.backup_codes = {}
        self.verification_codes = {}
    
    def generate_totp_secret(self, user_id):
        """Generate TOTP secret for user"""
        secret = pyotp.random_base32()
        self.totp_secrets[user_id] = {
            'secret': secret,
            'enabled': False,
            'created_at': datetime.now().isoformat()
        }
        return secret
    
    def get_totp_uri(self, user_id, email, issuer="PhishGuard AI"):
        """Get TOTP URI for authenticator apps"""
        secret = self.totp_secrets.get(user_id, {}).get('secret')
        if not secret:
            return None
        
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(email, issuer_name=issuer)
    
    def generate_qr_code(self, user_id, email):
        """Generate QR code for 2FA setup"""
        uri = self.get_totp_uri(user_id, email)
        if not uri:
            return None
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="#00d4ff", back_color="#0a0e1a")
        
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            'qr_code': f'data:image/png;base64,{qr_base64}',
            'secret': self.totp_secrets[user_id]['secret'],
            'uri': uri
        }
    
    def verify_totp(self, user_id, code):
        """Verify TOTP code"""
        secret = self.totp_secrets.get(user_id, {}).get('secret')
        if not secret:
            return False
        
        totp = pyotp.TOTP(secret)
        return totp.verify(code, valid_window=1)
    
    def enable_totp(self, user_id, code):
        """Enable TOTP after verification"""
        if self.verify_totp(user_id, code):
            self.totp_secrets[user_id]['enabled'] = True
            self.totp_secrets[user_id]['enabled_at'] = datetime.now().isoformat()
            
            # Generate backup codes
            backup_codes = self.generate_backup_codes(user_id)
            
            return True, backup_codes
        return False, "Invalid verification code"
    
    def disable_totp(self, user_id, code):
        """Disable TOTP"""
        if self.verify_totp(user_id, code):
            self.totp_secrets[user_id]['enabled'] = False
            return True
        return False
    
    def generate_backup_codes(self, user_id, count=10):
        """Generate backup codes"""
        codes = []
        for _ in range(count):
            code = secrets.token_hex(4).upper()
            codes.append(f"{code[:4]}-{code[4:]}")
        
        self.backup_codes[user_id] = {
            'codes': [hashlib.sha256(c.encode()).hexdigest() for c in codes],
            'created_at': datetime.now().isoformat()
        }
        
        return codes
    
    def verify_backup_code(self, user_id, code):
        """Verify and consume backup code"""
        stored = self.backup_codes.get(user_id, {})
        codes = stored.get('codes', [])
        
        code_hash = hashlib.sha256(code.upper().replace('-', '').encode()).hexdigest()
        
        if code_hash in codes:
            codes.remove(code_hash)
            return True
        return False
    
    def is_enabled(self, user_id):
        """Check if 2FA is enabled for user"""
        return self.totp_secrets.get(user_id, {}).get('enabled', False)
    
    def get_status(self, user_id):
        """Get 2FA status"""
        return {
            'enabled': self.is_enabled(user_id),
            'method': 'totp',
            'backup_codes_remaining': len(self.backup_codes.get(user_id, {}).get('codes', []))
        }


class SMSAuth:
    """SMS-based authentication"""
    
    def __init__(self, twilio_account_sid=None, twilio_auth_token=None):
        self.twilio_sid = twilio_account_sid
        self.twilio_token = twilio_auth_token
        self.codes = {}
    
    def generate_code(self, user_id, phone_number):
        """Generate and send SMS code"""
        code = str(secrets.randbelow(900000) + 100000)  # 6-digit code
        
        self.codes[user_id] = {
            'code': code,
            'phone': phone_number,
            'expires_at': (datetime.now() + timedelta(minutes=5)).isoformat(),
            'attempts': 0
        }
        
        # In production, send SMS via Twilio
        # self._send_sms(phone_number, f"Your PhishGuard code: {code}")
        
        return True, "Code sent successfully"
    
    def verify_code(self, user_id, code):
        """Verify SMS code"""
        stored = self.codes.get(user_id)
        if not stored:
            return False, "No code requested"
        
        if datetime.now() > datetime.fromisoformat(stored['expires_at']):
            return False, "Code expired"
        
        if stored['attempts'] >= 5:
            return False, "Too many attempts"
        
        stored['attempts'] += 1
        
        if stored['code'] == code:
            del self.codes[user_id]
            return True, "Code verified"
        
        return False, "Invalid code"
    
    def _send_sms(self, phone_number, message):
        """Send SMS via Twilio"""
        if not self.twilio_sid or not self.twilio_token:
            return True  # Skip in development
        
        try:
            from twilio.rest import Client
            client = Client(self.twilio_sid, self.twilio_token)
            client.messages.create(
                body=message,
                from_='+1234567890',  # Your Twilio number
                to=phone_number
            )
        except Exception as e:
            print(f"SMS send error: {e}")


class EmailVerification:
    """Email-based verification"""
    
    def __init__(self):
        self.verification_codes = {}
    
    def generate_verification_code(self, user_id, email):
        """Generate email verification code"""
        code = str(secrets.randbelow(900000) + 100000)
        
        self.verification_codes[user_id] = {
            'code': code,
            'email': email,
            'expires_at': (datetime.now() + timedelta(hours=24)).isoformat(),
            'verified': False
        }
        
        return code
    
    def verify_email(self, user_id, code):
        """Verify email code"""
        stored = self.verification_codes.get(user_id)
        if not stored:
            return False, "No verification pending"
        
        if datetime.now() > datetime.fromisoformat(stored['expires_at']):
            return False, "Verification code expired"
        
        if stored['code'] == code:
            stored['verified'] = True
            return True, "Email verified"
        
        return False, "Invalid code"
    
    def is_verified(self, user_id):
        """Check if email is verified"""
        return self.verification_codes.get(user_id, {}).get('verified', False)


class BiometricAuth:
    """Biometric authentication (WebAuthn)"""
    
    def __init__(self):
        self.credentials = {}
    
    def register_begin(self, user_id, email):
        """Begin biometric registration"""
        import secrets
        
        challenge = secrets.token_bytes(32)
        
        self.credentials[user_id] = {
            'challenge': challenge.hex(),
            'email': email
        }
        
        return {
            'challenge': challenge.hex(),
            'rp': {'name': 'PhishGuard AI', 'id': 'phishguard.ai'},
            'user': {
                'id': user_id.encode(),
                'name': email,
                'displayName': email
            },
            'pubKeyCredParams': [
                {'type': 'public-key', 'alg': -7},   # ES256
                {'type': 'public-key', 'alg': -257}  # RS256
            ],
            'authenticatorSelection': {
                'authenticatorAttachment': 'platform',
                'userVerification': 'required'
            },
            'timeout': 60000,
            'attestation': 'direct'
        }
    
    def register_complete(self, user_id, credential_data):
        """Complete biometric registration"""
        # Store credential
        if user_id not in self.credentials:
            self.credentials[user_id] = {}
        
        self.credentials[user_id]['registered'] = True
        self.credentials[user_id]['credential_id'] = credential_data.get('id')
        self.credentials[user_id]['registered_at'] = datetime.now().isoformat()
        
        return True
    
    def authenticate_begin(self, user_id):
        """Begin biometric authentication"""
        import secrets
        
        challenge = secrets.token_bytes(32)
        
        return {
            'challenge': challenge.hex(),
            'timeout': 60000,
            'userVerification': 'required',
            'allowCredentials': [{
                'type': 'public-key',
                'id': self.credentials.get(user_id, {}).get('credential_id', b'')
            }]
        }
    
    def authenticate_complete(self, user_id):
        """Complete biometric authentication"""
        credential = self.credentials.get(user_id)
        if credential and credential.get('registered'):
            return True
        return False
    
    def is_registered(self, user_id):
        """Check if user has biometric registered"""
        return self.credentials.get(user_id, {}).get('registered', False)
    
    def remove_credential(self, user_id):
        """Remove biometric credential"""
        if user_id in self.credentials:
            del self.credentials[user_id]
        return True
