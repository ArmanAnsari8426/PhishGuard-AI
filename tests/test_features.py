"""
PhishGuard AI - Unit Tests
Test all utilities and functions
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.feature_extractor import extract_features, extract_domain_features
from utils.password_analyzer import PasswordAnalyzer
from utils.qr_scanner import QRScanner

class TestFeatureExtractor(unittest.TestCase):
    """Test URL feature extraction"""
    
    def test_safe_url_features(self):
        """Test features extraction for safe URL"""
        features = extract_features('https://www.google.com')
        self.assertIsNotNone(features)
        self.assertEqual(features['has_https'], 1)
        self.assertEqual(features['url_length'], 22)
    
    def test_suspicious_url_features(self):
        """Test features extraction for suspicious URL"""
        features = extract_features('http://suspicious-bank-login.tk/verify')
        self.assertIsNotNone(features)
        self.assertEqual(features['has_https'], 0)
        self.assertGreater(features['suspicious_keywords'], 0)
    
    def test_ip_address_detection(self):
        """Test IP address detection"""
        features = extract_features('http://192.168.1.1/login')
        self.assertIsNotNone(features)
        self.assertEqual(features['ip_address'], 1)
    
    def test_brand_impersonation_detection(self):
        """Test brand impersonation detection"""
        features = extract_features('https://paypal-secure-login.tk/verify')
        self.assertIsNotNone(features)
        self.assertGreater(features['brand_impersonation'], 0)
    
    def test_domain_features(self):
        """Test domain feature extraction"""
        features = extract_domain_features('suspicious.tk')
        self.assertIsNotNone(features)
        self.assertEqual(features['suspicious_tld'], 1)


class TestPasswordAnalyzer(unittest.TestCase):
    """Test password strength analysis"""
    
    def setUp(self):
        self.analyzer = PasswordAnalyzer()
    
    def test_weak_password(self):
        """Test weak password detection"""
        result = self.analyzer.analyze_password('123456')
        self.assertLess(result['score'], 40)
        self.assertEqual(result['strength'], 'Very Weak')
    
    def test_strong_password(self):
        """Test strong password detection"""
        result = self.analyzer.analyze_password('MyStr0ng!P@ssw0rd#2024')
        self.assertGreater(result['score'], 70)
        self.assertIn(result['strength'], ['Strong', 'Very Strong'])
    
    def test_common_password_detection(self):
        """Test common password detection"""
        result = self.analyzer.analyze_password('password')
        self.assertLess(result['score'], 30)
        self.assertTrue(any('common' in issue.lower() for issue in result['issues']))
    
    def test_empty_password(self):
        """Test empty password handling"""
        result = self.analyzer.analyze_password('')
        self.assertEqual(result['score'], 0)
        self.assertEqual(result['strength'], 'None')
    
    def test_entropy_calculation(self):
        """Test entropy calculation"""
        result = self.analyzer.analyze_password('abcdefgh')
        self.assertGreater(result['entropy'], 0)
    
    def test_crack_time_estimation(self):
        """Test crack time estimation"""
        result = self.analyzer.analyze_password('password')
        self.assertIn(result['crack_time'], ['Instant', 'seconds', 'minutes'])
    
    def test_password_generation(self):
        """Test password generation"""
        password = self.analyzer.generate_password(16)
        self.assertEqual(len(password), 16)
        result = self.analyzer.analyze_password(password)
        self.assertGreater(result['score'], 70)
    
    def test_recommendations_generation(self):
        """Test recommendations generation"""
        result = self.analyzer.analyze_password('abc')
        self.assertGreater(len(result['recommendations']), 0)


class TestQRScanner(unittest.TestCase):
    """Test QR code scanning"""
    
    def test_url_analysis(self):
        """Test URL analysis from QR content"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('https://google.com')
        self.assertEqual(result['type'], 'url')
        self.assertIsNotNone(result['analysis'])
    
    def test_email_analysis(self):
        """Test email analysis from QR content"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('mailto:test@example.com')
        self.assertEqual(result['type'], 'email')
        self.assertIsNotNone(result['analysis'])
    
    def test_wifi_analysis(self):
        """Test WiFi analysis from QR content"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('WIFI:S:MyNetwork;T:WPA;P:password123;;')
        self.assertEqual(result['type'], 'wifi')
        self.assertEqual(result['analysis']['ssid'], 'MyNetwork')
    
    def test_suspicious_url_detection(self):
        """Test suspicious URL detection"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('http://192.168.1.1/login')
        self.assertTrue(result['suspicious'])
    
    def test_text_content(self):
        """Test plain text content"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('Hello World')
        self.assertEqual(result['type'], 'text')
    
    def test_phone_number_analysis(self):
        """Test phone number analysis"""
        scanner = QRScanner()
        result = scanner.analyze_qr_content('tel:+1234567890')
        self.assertEqual(result['type'], 'phone')
        self.assertTrue(result['analysis']['valid'])


class TestDatabaseModels(unittest.TestCase):
    """Test database operations"""
    
    def setUp(self):
        from database.models import Database
        self.db = Database('test.db')
        self.db.init_db()
    
    def tearDown(self):
        import os
        if os.path.exists('test.db'):
            os.remove('test.db')
    
    def test_user_creation(self):
        """Test user creation"""
        user_id = self.db.create_user('Test User', 'test@test.com', 'password123')
        self.assertIsNotNone(user_id)
        
        user = self.db.get_user_by_email('test@test.com')
        self.assertIsNotNone(user)
        self.assertEqual(user['name'], 'Test User')
    
    def test_scan_creation(self):
        """Test scan creation"""
        user_id = self.db.create_user('Test User', 'test@test.com', 'password123')
        scan_id = self.db.create_scan(
            user_id=user_id,
            url='https://example.com',
            risk_score=15,
            category='Safe',
            features={'has_https': 1},
            virus_total={},
            whois={},
            ssl_info={},
            recommendations=['URL appears safe']
        )
        self.assertIsNotNone(scan_id)
    
    def test_blocked_domains(self):
        """Test domain blocking"""
        self.db.block_domain('malicious.com')
        self.assertTrue(self.db.is_domain_blocked('malicious.com'))
        
        self.db.unblock_domain('malicious.com')
        self.assertFalse(self.db.is_domain_blocked('malicious.com'))


if __name__ == '__main__':
    unittest.main()
