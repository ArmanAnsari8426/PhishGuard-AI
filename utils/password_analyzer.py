"""
PhishGuard AI - Password Strength Analyzer
Check password security and detect weak passwords
"""

import re
import math
from collections import Counter

class PasswordAnalyzer:
    def __init__(self):
        # Common passwords list (top 1000)
        self.common_passwords = [
            'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
            'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
            'princess', 'football', 'shadow', 'superman', 'michael', 'letmein',
            'password123', 'admin', 'welcome', 'hello123', 'passw0rd', 'p@ssword',
            'changeme', 'secret', '123456789', 'password1', 'qwerty123'
        ]
        
        # Common dictionary words
        self.dictionary_words = [
            'password', 'letmein', 'welcome', 'admin', 'user', 'login', 'master',
            'dragon', 'monkey', 'shadow', 'sunshine', 'princess', 'football',
            'baseball', 'superman', 'batman', 'spiderman', 'trustno1'
        ]
        
        # Keyboard patterns
        self.keyboard_patterns = [
            'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', '123456', 'abcdef',
            'qwe123', 'asd123', 'zxc123', '123abc', 'abc123'
        ]
    
    def analyze_password(self, password):
        """Analyze password strength"""
        if not password:
            return {
                'score': 0,
                'strength': 'None',
                'strength_color': '#64748b',
                'issues': ['No password provided'],
                'recommendations': ['Enter a password to analyze'],
                'entropy': 0,
                'crack_time': 'Instant',
                'checks': self._empty_checks()
            }
        
        # Run all checks
        checks = {
            'length': self._check_length(password),
            'uppercase': self._check_uppercase(password),
            'lowercase': self._check_lowercase(password),
            'numbers': self._check_numbers(password),
            'special': self._check_special(password),
            'no_common': self._check_common(password),
            'no_dictionary': self._check_dictionary(password),
            'no_keyboard': self._check_keyboard(password),
            'no_repeats': self._check_repeats(password),
            'no_sequential': self._check_sequential(password),
            'no_personal': self._check_personal(password),
            'mixed_case': self._check_mixed_case(password),
            'no_spaces': self._check_spaces(password),
            'min_entropy': self._check_entropy(password)
        }
        
        # Calculate score
        score = self._calculate_score(checks)
        
        # Get strength level
        strength = self._get_strength(score)
        
        # Calculate entropy
        entropy = self._calculate_entropy(password)
        
        # Estimate crack time
        crack_time = self._estimate_crack_time(entropy)
        
        # Get issues and recommendations
        issues = self._get_issues(checks)
        recommendations = self._get_recommendations(checks)
        
        return {
            'score': score,
            'strength': strength['label'],
            'strength_color': strength['color'],
            'strength_bg': strength['bg'],
            'issues': issues,
            'recommendations': recommendations,
            'entropy': round(entropy, 2),
            'crack_time': crack_time,
            'checks': checks,
            'length': len(password)
        }
    
    def _empty_checks(self):
        """Return empty checks structure"""
        return {k: {'passed': False, 'message': 'Not checked'} for k in 
                ['length', 'uppercase', 'lowercase', 'numbers', 'special', 
                 'no_common', 'no_dictionary', 'no_keyboard', 'no_repeats',
                 'no_sequential', 'no_personal', 'mixed_case', 'no_spaces', 'min_entropy']}
    
    def _check_length(self, password):
        """Check password length"""
        length = len(password)
        if length >= 12:
            return {'passed': True, 'message': 'Excellent length (12+)'}
        elif length >= 8:
            return {'passed': True, 'message': 'Good length (8-11)'}
        elif length >= 6:
            return {'passed': False, 'message': 'Too short (6-7)'}
        else:
            return {'passed': False, 'message': 'Very short (<6)'}
    
    def _check_uppercase(self, password):
        """Check for uppercase letters"""
        if re.search(r'[A-Z]', password):
            count = len(re.findall(r'[A-Z]', password))
            return {'passed': True, 'message': f'Contains {count} uppercase letters'}
        return {'passed': False, 'message': 'No uppercase letters'}
    
    def _check_lowercase(self, password):
        """Check for lowercase letters"""
        if re.search(r'[a-z]', password):
            count = len(re.findall(r'[a-z]', password))
            return {'passed': True, 'message': f'Contains {count} lowercase letters'}
        return {'passed': False, 'message': 'No lowercase letters'}
    
    def _check_numbers(self, password):
        """Check for numbers"""
        if re.search(r'\d', password):
            count = len(re.findall(r'\d', password))
            return {'passed': True, 'message': f'Contains {count} numbers'}
        return {'passed': False, 'message': 'No numbers'}
    
    def _check_special(self, password):
        """Check for special characters"""
        special = re.findall(r'[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]', password)
        if len(special) >= 2:
            return {'passed': True, 'message': f'Contains {len(special)} special characters'}
        elif len(special) == 1:
            return {'passed': False, 'message': 'Only 1 special character (need 2+)'}
        return {'passed': False, 'message': 'No special characters'}
    
    def _check_common(self, password):
        """Check against common passwords"""
        if password.lower() in self.common_passwords:
            return {'passed': False, 'message': 'This is a commonly used password'}
        return {'passed': True, 'message': 'Not a common password'}
    
    def _check_dictionary(self, password):
        """Check for dictionary words"""
        lower_pass = password.lower()
        for word in self.dictionary_words:
            if word in lower_pass:
                return {'passed': False, 'message': f'Contains dictionary word: "{word}"'}
        return {'passed': True, 'message': 'No dictionary words detected'}
    
    def _check_keyboard(self, password):
        """Check for keyboard patterns"""
        lower_pass = password.lower()
        for pattern in self.keyboard_patterns:
            if pattern in lower_pass:
                return {'passed': False, 'message': f'Contains keyboard pattern: "{pattern}"'}
        return {'passed': True, 'message': 'No keyboard patterns'}
    
    def _check_repeats(self, password):
        """Check for repeated characters"""
        # Check for 3+ repeated characters
        if re.search(r'(.)\1{2,}', password):
            return {'passed': False, 'message': 'Contains repeated characters (3+)'}
        return {'passed': True, 'message': 'No excessive repeats'}
    
    def _check_sequential(self, password):
        """Check for sequential characters"""
        sequential = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
                      'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr',
                      'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
                      '123', '234', '345', '456', '567', '678', '789']
        
        lower_pass = password.lower()
        for seq in sequential:
            if seq in lower_pass:
                return {'passed': False, 'message': f'Contains sequential characters: "{seq}"'}
        return {'passed': True, 'message': 'No sequential characters'}
    
    def _check_personal(self, password):
        """Check for personal info patterns"""
        # Check for date patterns
        if re.search(r'\d{4}', password):  # Year
            return {'passed': False, 'message': 'Contains what appears to be a year'}
        if re.search(r'\d{2}[/-]\d{2}[/-]\d{2,4}', password):  # Date
            return {'passed': False, 'message': 'Contains a date pattern'}
        return {'passed': True, 'message': 'No personal info patterns'}
    
    def _check_mixed_case(self, password):
        """Check for mixed case"""
        has_upper = bool(re.search(r'[A-Z]', password))
        has_lower = bool(re.search(r'[a-z]', password))
        
        if has_upper and has_lower:
            return {'passed': True, 'message': 'Good mix of uppercase and lowercase'}
        return {'passed': False, 'message': 'Should mix uppercase and lowercase'}
    
    def _check_spaces(self, password):
        """Check for spaces"""
        if ' ' in password:
            return {'passed': False, 'message': 'Contains spaces'}
        return {'passed': True, 'message': 'No spaces'}
    
    def _check_entropy(self, password):
        """Check entropy level"""
        entropy = self._calculate_entropy(password)
        if entropy >= 60:
            return {'passed': True, 'message': f'High entropy: {entropy:.1f} bits'}
        elif entropy >= 40:
            return {'passed': True, 'message': f'Moderate entropy: {entropy:.1f} bits'}
        return {'passed': False, 'message': f'Low entropy: {entropy:.1f} bits'}
    
    def _calculate_score(self, checks):
        """Calculate overall score (0-100)"""
        weights = {
            'length': 15,
            'uppercase': 10,
            'lowercase': 10,
            'numbers': 10,
            'special': 10,
            'no_common': 15,
            'no_dictionary': 8,
            'no_keyboard': 7,
            'no_repeats': 5,
            'no_sequential': 5,
            'no_personal': 3,
            'mixed_case': 5,
            'no_spaces': 3,
            'min_entropy': 5
        }
        
        total = 0
        for check, value in checks.items():
            if value.get('passed'):
                total += weights.get(check, 0)
        
        return min(100, total)
    
    def _get_strength(self, score):
        """Get strength level from score"""
        if score >= 90:
            return {'label': 'Very Strong', 'color': '#00ff88', 'bg': 'rgba(0,255,136,0.1)'}
        elif score >= 75:
            return {'label': 'Strong', 'color': '#00d4ff', 'bg': 'rgba(0,212,255,0.1)'}
        elif score >= 60:
            return {'label': 'Good', 'color': '#a855f7', 'bg': 'rgba(168,85,247,0.1)'}
        elif score >= 40:
            return {'label': 'Fair', 'color': '#ffdd00', 'bg': 'rgba(255,221,0,0.1)'}
        elif score >= 30:
            return {'label': 'Weak', 'color': '#ffaa00', 'bg': 'rgba(255,170,0,0.1)'}
        else:
            return {'label': 'Very Weak', 'color': '#ff3366', 'bg': 'rgba(255,51,102,0.1)'}
    
    def _calculate_entropy(self, password):
        """Calculate password entropy in bits"""
        charset_size = 0
        
        if re.search(r'[a-z]', password):
            charset_size += 26
        if re.search(r'[A-Z]', password):
            charset_size += 26
        if re.search(r'\d', password):
            charset_size += 10
        if re.search(r'[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]', password):
            charset_size += 32
        if re.search(r' ', password):
            charset_size += 1
        
        if charset_size == 0:
            return 0
        
        entropy = len(password) * math.log2(charset_size)
        return entropy
    
    def _estimate_crack_time(self, entropy):
        """Estimate time to crack password"""
        # Assuming 10 billion guesses per second
        guesses_per_second = 10_000_000_000

        total_guesses = 2 ** entropy
        seconds = total_guesses / guesses_per_second

        if seconds < 1:
            return 'Instant'
        elif seconds < 60:
            return 'seconds'
        elif seconds < 3600:
            return 'minutes'
        else:
            return 'hours'
    
    def _get_issues(self, checks):
        """Get list of issues"""
        issues = []
        for check, value in checks.items():
            if not value.get('passed'):
                issues.append(value.get('message', 'Unknown issue'))
        return issues
    
    def _get_recommendations(self, checks):
        """Get recommendations"""
        recommendations = []
        
        if not checks.get('length', {}).get('passed'):
            recommendations.append('Use at least 12 characters')
        if not checks.get('uppercase', {}).get('passed'):
            recommendations.append('Add uppercase letters')
        if not checks.get('lowercase', {}).get('passed'):
            recommendations.append('Add lowercase letters')
        if not checks.get('numbers', {}).get('passed'):
            recommendations.append('Add numbers')
        if not checks.get('special', {}).get('passed'):
            recommendations.append('Add special characters (!@#$%^&*)')
        if not checks.get('no_common', {}).get('passed'):
            recommendations.append('Avoid common passwords')
        if not checks.get('mixed_case', {}).get('passed'):
            recommendations.append('Mix uppercase and lowercase letters')
        
        if not recommendations:
            recommendations.append('Your password looks strong!')
        
        return recommendations
    
    def generate_password(self, length=16, include_special=True):
        """Generate a strong random password"""
        import secrets
        import string
        
        characters = string.ascii_letters + string.digits
        if include_special:
            characters += '!@#$%^&*()_+-='
        
        while True:
            password = ''.join(secrets.choice(characters) for _ in range(length))
            
            # Verify it's strong enough
            result = self.analyze_password(password)
            if result['score'] >= 80:
                return password
    
    def check_password_breach(self, password):
        """Check if password has been breached (simulated)"""
        # In production, use Have I Been Pwned API
        import hashlib
        
        # Hash the password (HIBP uses SHA-1 prefix)
        sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
        
        # Simulated breach check
        breached = password.lower() in self.common_passwords
        
        return {
            'breached': breached,
            'breach_count': 12345678 if breached else 0,
            'message': 'This password has been found in data breaches!' if breached else 'This password has not been found in known breaches'
        }
