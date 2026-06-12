"""
PhishGuard AI Configuration
"""

import os

# Server Configuration
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 5000))
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Database Configuration
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///database/phishguard.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'phishguard-secret-key-change-in-production')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', 86400))  # 24 hours

# VirusTotal API
VIRUSTOTAL_API_KEY = os.getenv('VIRUSTOTAL_API_KEY', '')

# Rate Limiting
RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT', '200 per day, 50 per hour')

# Security
CSRF_ENABLED = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# File Uploads
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'csv', 'json', 'pdf'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

# ML Model
MODEL_PATH = os.getenv('MODEL_PATH', 'model/phishing_model.pkl')

# Logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = os.getenv('LOG_FILE', 'logs/phishguard.log')
