"""
PhishGuard AI - SSO/SAML Integration
Single Sign-On with OAuth2, SAML, and SSO providers
"""

import secrets
import hashlib
import json
from datetime import datetime, timedelta
from urllib.parse import urlencode, quote

class OAuth2Provider:
    """OAuth2 authentication provider"""
    
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.authorization_codes = {}
        self.access_tokens = {}
    
    def get_authorization_url(self, state=None):
        """Generate OAuth2 authorization URL"""
        if not state:
            state = secrets.token_urlsafe(32)
        
        params = {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'response_type': 'code',
            'scope': 'openid email profile',
            'state': state
        }
        
        return {
            'url': f'https://accounts.google.com/o/oauth2/auth?{urlencode(params)}',
            'state': state
        }
    
    def exchange_code(self, code, state):
        """Exchange authorization code for tokens"""
        # Simulate token exchange
        access_token = secrets.token_urlsafe(32)
        refresh_token = secrets.token_urlsafe(32)
        
        self.access_tokens[access_token] = {
            'user_id': 'user_123',
            'email': 'user@example.com',
            'expires_at': (datetime.now() + timedelta(hours=1)).isoformat()
        }
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': 3600
        }
    
    def refresh_token(self, refresh_token):
        """Refresh access token"""
        access_token = secrets.token_urlsafe(32)
        
        self.access_tokens[access_token] = {
            'user_id': 'user_123',
            'email': 'user@example.com',
            'expires_at': (datetime.now() + timedelta(hours=1)).isoformat()
        }
        
        return {
            'access_token': access_token,
            'token_type': 'Bearer',
            'expires_in': 3600
        }
    
    def validate_token(self, access_token):
        """Validate access token"""
        token_data = self.access_tokens.get(access_token)
        if not token_data:
            return None
        
        if datetime.now() > datetime.fromisoformat(token_data['expires_at']):
            return None
        
        return token_data
    
    def revoke_token(self, access_token):
        """Revoke access token"""
        if access_token in self.access_tokens:
            del self.access_tokens[access_token]
        return True


class GoogleOAuth(OAuth2Provider):
    """Google OAuth2 integration"""
    
    def __init__(self, client_id, client_secret, redirect_uri):
        super().__init__(client_id, client_secret, redirect_uri)
        self.provider = 'google'
    
    def get_authorization_url(self, state=None):
        """Get Google authorization URL"""
        result = super().get_authorization_url(state)
        result['url'] = f'https://accounts.google.com/o/oauth2/auth?{urlencode(self._get_params(state))}'
        return result
    
    def _get_params(self, state):
        return {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'response_type': 'code',
            'scope': 'openid email profile',
            'state': state,
            'access_type': 'offline',
            'prompt': 'consent'
        }


class GitHubOAuth(OAuth2Provider):
    """GitHub OAuth2 integration"""
    
    def __init__(self, client_id, client_secret, redirect_uri):
        super().__init__(client_id, client_secret, redirect_uri)
        self.provider = 'github'
    
    def get_authorization_url(self, state=None):
        """Get GitHub authorization URL"""
        result = super().get_authorization_url(state)
        result['url'] = f'https://github.com/login/oauth/authorize?client_id={self.client_id}&redirect_uri={quote(self.redirect_uri)}&scope=user:email&state={result["state"]}'
        return result


class SAMLProvider:
    """SAML 2.0 identity provider"""
    
    def __init__(self, entity_id, sso_url, certificate):
        self.entity_id = entity_id
        self.sso_url = sso_url
        self.certificate = certificate
        self.service_provider_entity_id = 'phishguard.ai'
    
    def generate_authn_request(self, request_id):
        """Generate SAML authentication request"""
        import xml.etree.ElementTree as ET
        from xml.dom import minidom
        
        # Create SAML AuthnRequest
        request = f"""<?xml version="1.0" encoding="UTF-8"?>
        <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                           xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                           ID="{request_id}"
                           Version="2.0"
                           IssueInstant="{datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}"
                           AssertionConsumerServiceURL="{self.service_provider_entity_id}/acs"
                           ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
            <saml:Issuer>{self.service_provider_entity_id}</saml:Issuer>
            <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
                                 AllowCreate="true"/>
        </samlp:AuthnRequest>"""
        
        return {
            'request': request,
            'url': f'{self.sso_url}?SAMLRequest={self._encode_request(request)}',
            'request_id': request_id
        }
    
    def validate_response(self, saml_response):
        """Validate SAML response"""
        # In production, validate signature, certificate, etc.
        return {
            'valid': True,
            'user': {
                'email': 'user@company.com',
                'name': 'John Doe',
                'attributes': {
                    'department': 'Engineering',
                    'role': 'admin'
                }
            }
        }
    
    def _encode_request(self, request):
        """Encode SAML request"""
        import base64
        import zlib
        compressed = zlib.compress(request.encode())
        return base64.b64encode(compressed).decode()


class SSOManager:
    """Manage SSO providers and sessions"""
    
    def __init__(self):
        self.providers = {}
        self.sso_sessions = {}
        self.pending_auth = {}
    
    def register_provider(self, provider_type, name, config):
        """Register SSO provider"""
        provider_id = hashlib.md5(f"{provider_type}:{name}".encode()).hexdigest()[:12]
        
        if provider_type == 'google':
            provider = GoogleOAuth(config['client_id'], config['client_secret'], config['redirect_uri'])
        elif provider_type == 'github':
            provider = GitHubOAuth(config['client_id'], config['client_secret'], config['redirect_uri'])
        elif provider_type == 'saml':
            provider = SAMLProvider(config['entity_id'], config['sso_url'], config['certificate'])
        else:
            return None
        
        self.providers[provider_id] = {
            'id': provider_id,
            'type': provider_type,
            'name': name,
            'provider': provider,
            'enabled': True,
            'created_at': datetime.now().isoformat()
        }
        
        return self.providers[provider_id]
    
    def initiate_sso(self, provider_id, user_email=None):
        """Initiate SSO login"""
        provider_data = self.providers.get(provider_id)
        if not provider_data:
            return None, "Provider not found"
        
        provider = provider_data['provider']
        state = secrets.token_urlsafe(32)
        
        if isinstance(provider, SAMLProvider):
            request_id = secrets.token_urlsafe(16)
            result = provider.generate_authn_request(request_id)
        else:
            result = provider.get_authorization_url(state)
        
        self.pending_auth[state] = {
            'provider_id': provider_id,
            'created_at': datetime.now().isoformat()
        }
        
        return result, None
    
    def complete_sso(self, state, auth_code):
        """Complete SSO authentication"""
        pending = self.pending_auth.get(state)
        if not pending:
            return None, "Invalid or expired SSO session"
        
        provider_data = self.providers.get(pending['provider_id'])
        if not provider_data:
            return None, "Provider not found"
        
        provider = provider_data['provider']
        
        if isinstance(provider, SAMLProvider):
            user = provider.validate_response(auth_code)
        else:
            tokens = provider.exchange_code(auth_code, state)
            user = {'email': 'user@example.com', 'name': 'SSO User'}  # Simulated
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        self.sso_sessions[session_token] = {
            'provider_id': pending['provider_id'],
            'user': user,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(hours=24)).isoformat()
        }
        
        del self.pending_auth[state]
        
        return {
            'session_token': session_token,
            'user': user,
            'provider': provider_data['name']
        }, None
    
    def validate_session(self, session_token):
        """Validate SSO session"""
        session = self.sso_sessions.get(session_token)
        if not session:
            return None
        
        if datetime.now() > datetime.fromisoformat(session['expires_at']):
            return None
        
        return session
    
    def logout(self, session_token):
        """Logout SSO session"""
        if session_token in self.sso_sessions:
            del self.sso_sessions[session_token]
        return True
    
    def get_enabled_providers(self):
        """Get all enabled SSO providers"""
        return [
            {'id': p['id'], 'type': p['type'], 'name': p['name']}
            for p in self.providers.values() if p['enabled']
        ]


class EnterpriseSSO:
    """Enterprise SSO features"""
    
    def __init__(self):
        self.domains = {}
        self.sso_configs = {}
    
    def add_domain(self, domain, provider_id, enforce_sso=False):
        """Add domain for SSO enforcement"""
        self.domains[domain] = {
            'provider_id': provider_id,
            'enforce_sso': enforce_sso,
            'created_at': datetime.now().isoformat()
        }
        return True
    
    def remove_domain(self, domain):
        """Remove domain"""
        if domain in self.domains:
            del self.domains[domain]
            return True
        return False
    
    def check_domain_sso(self, email):
        """Check if domain requires SSO"""
        domain = email.split('@')[1] if '@' in email else ''
        return self.domains.get(domain)
    
    def get_domain_config(self, domain):
        """Get domain SSO configuration"""
        return self.domains.get(domain)
    
    def list_domains(self):
        """List all configured domains"""
        return self.domains
    
    def enforce_sso_for_domain(self, domain):
        """Enable SSO enforcement for domain"""
        if domain in self.domains:
            self.domains[domain]['enforce_sso'] = True
            return True
        return False
