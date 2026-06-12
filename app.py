"""
PhishGuard AI - Flask Backend Application
Advanced Phishing Website Detection Platform
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
import re
import socket
import ssl
import whois
import requests
import pickle
import numpy as np
from functools import wraps

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configuration
app.config.from_pyfile('config.py', silent=True)

# CORS
CORS(app, resources={
    r"/api/*": {"origins": "*"},
    r"/static/*": {"origins": "*"}
})

# Rate Limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# JWT Secret Key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'phishguard-secret-key-change-in-production')

# Database
import sqlite3
from database.models import Database

db = Database()

# Initialize database
def init_db():
    with app.app_context():
        db.init_db()

# Load ML Model
def load_model():
    try:
        with open('model/phishing_model.pkl', 'rb') as f:
            return pickle.load(f)
    except:
        return None

model = load_model()

# JWT Token Required Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.get_user_by_id(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Admin Required Decorator
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admin access required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# ============ API ROUTES ============

@app.route('/api/register', methods=['POST'])
@limiter.limit("10 per minute")
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required!'}), 400
    
    if db.get_user_by_email(email):
        return jsonify({'message': 'Email already exists!'}), 400
    
    hashed_password = generate_password_hash(password)
    user_id = db.create_user(name, email, hashed_password)
    
    return jsonify({
        'message': 'User registered successfully!',
        'user': {
            'id': user_id,
            'name': name,
            'email': email,
            'role': 'user'
        }
    }), 201

@app.route('/api/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400
    
    user = db.get_user_by_email(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password!'}), 401
    
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200

@app.route('/api/scan', methods=['POST'])
@token_required
@limiter.limit("30 per minute")
def scan_url(current_user):
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'message': 'URL is required!'}), 400
    
    # Analyze URL
    result = analyze_url(url)
    
    # Save scan to history
    scan_id = db.create_scan(
        user_id=current_user['id'],
        url=url,
        risk_score=result['risk_score'],
        category=result['category'],
        features=result['features'],
        virus_total=result['virus_total'],
        whois=result['whois'],
        ssl_info=result['ssl'],
        recommendations=result['recommendations']
    )
    
    result['id'] = scan_id
    result['timestamp'] = datetime.utcnow().isoformat()
    
    return jsonify(result), 200

@app.route('/api/history', methods=['GET'])
@token_required
def get_history(current_user):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 50, type=int)
    category = request.args.get('category')
    
    scans = db.get_user_scans(current_user['id'], page, limit, category)
    
    return jsonify({
        'scans': scans,
        'page': page,
        'limit': limit
    }), 200

@app.route('/api/history/<scan_id>', methods=['GET'])
@token_required
def get_scan_detail(current_user, scan_id):
    scan = db.get_scan_by_id(scan_id)
    if not scan or scan['user_id'] != current_user['id']:
        return jsonify({'message': 'Scan not found!'}), 404
    
    return jsonify(scan), 200

@app.route('/api/history/<scan_id>', methods=['DELETE'])
@token_required
def delete_scan(current_user, scan_id):
    scan = db.get_scan_by_id(scan_id)
    if not scan or scan['user_id'] != current_user['id']:
        return jsonify({'message': 'Scan not found!'}), 404
    
    db.delete_scan(scan_id)
    return jsonify({'message': 'Scan deleted successfully!'}), 200

@app.route('/api/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    stats = db.get_user_stats(current_user['id'])
    return jsonify(stats), 200

@app.route('/api/report/<scan_id>', methods=['GET'])
@token_required
def generate_report(current_user, scan_id):
    scan = db.get_scan_by_id(scan_id)
    if not scan or scan['user_id'] != current_user['id']:
        return jsonify({'message': 'Scan not found!'}), 404
    
    from utils.pdf_generator import generate_pdf_report
    pdf_data = generate_pdf_report(scan)
    
    return jsonify({
        'pdf': pdf_data,
        'scan_id': scan_id
    }), 200

# ============ ADMIN ROUTES ============

@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    users = db.get_all_users()
    return jsonify({'users': users}), 200

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, user_id):
    if user_id == current_user['id']:
        return jsonify({'message': 'Cannot delete your own account!'}), 400
    
    db.delete_user(user_id)
    return jsonify({'message': 'User deleted successfully!'}), 200

@app.route('/api/admin/scans', methods=['GET'])
@token_required
@admin_required
def get_all_scans(current_user):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 100, type=int)
    
    scans = db.get_all_scans(page, limit)
    return jsonify({
        'scans': scans,
        'page': page,
        'limit': limit
    }), 200

@app.route('/api/admin/block-domain', methods=['POST'])
@token_required
@admin_required
def block_domain(current_user):
    data = request.get_json()
    domain = data.get('domain')
    
    if not domain:
        return jsonify({'message': 'Domain is required!'}), 400
    
    db.block_domain(domain)
    return jsonify({'message': 'Domain blocked successfully!'}), 200

@app.route('/api/admin/unblock-domain', methods=['POST'])
@token_required
@admin_required
def unblock_domain(current_user):
    data = request.get_json()
    domain = data.get('domain')
    
    if not domain:
        return jsonify({'message': 'Domain is required!'}), 400
    
    db.unblock_domain(domain)
    return jsonify({'message': 'Domain unblocked successfully!'}), 200

@app.route('/api/admin/stats', methods=['GET'])
@token_required
@admin_required
def get_admin_stats(current_user):
    stats = db.get_admin_stats()
    return jsonify(stats), 200

# ============ URL ANALYSIS ============

def extract_features(url):
    """Extract features from URL for phishing detection"""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        hostname = parsed.hostname or parsed.netloc
        path = parsed.path
        query = parsed.query
        
        # URL-based features
        url_length = len(url)
        dot_count = url.count('.')
        hyphen_count = url.count('-')
        has_at = 1 if '@' in url else 0
        has_https = 1 if parsed.scheme == 'https' else 0
        path_length = len(path)
        query_length = len(query)
        
        # Domain features
        subdomains = hostname.split('.') if hostname else []
        subdomain_count = len(subdomains) - 2 if len(subdomains) > 2 else 0
        
        # Check for IP address
        ip_address = 1 if re.match(r'^\d+\.\d+\.\d+\.\d+$', hostname or '') else 0
        
        # Check for tiny URL
        tiny_url = 1 if len(hostname or '') < 10 else 0
        
        # Check for port
        has_port = 1 if ':' in (hostname or '') else 0
        
        # Suspicious keywords
        suspicious_keywords = [
            'login', 'signin', 'verify', 'account', 'update', 'confirm', 'secure',
            'banking', 'password', 'credential', 'authenticate', 'validation',
            'suspend', 'limited', 'access', 'security', 'alert', 'warning',
            'free', 'gift', 'prize', 'winner', 'lottery', 'claim',
            'urgent', 'immediate', 'action-required'
        ]
        suspicious_count = sum(1 for kw in suspicious_keywords if kw in url.lower())
        
        # Brand impersonation
        brands = ['paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon',
                 'netflix', 'spotify', 'instagram', 'twitter', 'linkedin',
                 'chase', 'bankofamerica', 'wellsfargo', 'citi', 'amex']
        brand_impersonation = sum(1 for brand in brands if brand in (hostname or '').lower())
        
        return {
            'url_length': url_length,
            'dot_count': dot_count,
            'hyphen_count': hyphen_count,
            'has_at': has_at,
            'has_https': has_https,
            'path_length': path_length,
            'query_length': query_length,
            'subdomain_count': subdomain_count,
            'ip_address': ip_address,
            'tiny_url': tiny_url,
            'has_port': has_port,
            'suspicious_keywords': suspicious_count,
            'brand_impersonation': brand_impersonation
        }
    except Exception as e:
        print(f"Error extracting features: {e}")
        return {}


def check_ssl_certificate(hostname):
    """Check SSL certificate validity"""
    try:
        context = ssl.create_default_context()
        conn = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=hostname
        )
        conn.connect((hostname, 443))
        cert = conn.getpeercert()
        conn.close()
        
        return {
            'valid': True,
            'issuer': dict(x[0] for x in cert.get('issuer', [])),
            'subject': dict(x[0] for x in cert.get('subject', [])),
            'version': cert.get('version'),
            'serialNumber': cert.get('serialNumber'),
            'notBefore': cert.get('notBefore'),
            'notAfter': cert.get('notAfter')
        }
    except Exception as e:
        return {
            'valid': False,
            'error': str(e)
        }


def get_whois_info(domain):
    """Get WHOIS information for domain"""
    try:
        w = whois.whois(domain)
        return {
            'registrar': w.registrar if hasattr(w, 'registrar') else 'N/A',
            'creation_date': str(w.creation_date) if hasattr(w, 'creation_date') else 'N/A',
            'expiration_date': str(w.expiration_date) if hasattr(w, 'expiration_date') else 'N/A',
            'updated_date': str(w.updated_date) if hasattr(w, 'updated_date') else 'N/A',
            'country': w.country if hasattr(w, 'country') else 'N/A'
        }
    except Exception as e:
        return {
            'error': str(e)
        }


def check_virustotal(url):
    """Check URL with VirusTotal API"""
    api_key = os.getenv('VIRUSTOTAL_API_KEY')
    if not api_key:
        return {
            'reputation': 0,
            'detections': 0,
            'total_engines': 0,
            'details': ['VirusTotal API key not configured']
        }
    
    try:
        headers = {
            'x-apikey': api_key
        }
        response = requests.get(f'https://www.virustotal.com/api/v3/urls/{url}', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return {
                'reputation': data.get('data', {}).get('attributes', {}).get('reputation', 0),
                'detections': data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {}).get('malicious', 0),
                'total_engines': data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {}).get('total', 0),
                'details': [f"Detected by {data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {}).get('malicious', 0)} engines"]
            }
    except Exception as e:
        pass
    
    return {
        'reputation': 0,
        'detections': 0,
        'total_engines': 0,
        'details': ['VirusTotal check failed']
    }


def analyze_url(url):
    """Main URL analysis function"""
    try:
        features = extract_features(url)
        
        # SSL Check
        hostname = url.split('//')[-1].split('/')[0].split('?')[0].split(':')[0]
        ssl_info = check_ssl_certificate(hostname)
        
        # WHOIS Check
        whois_info = get_whois_info(hostname)
        
        # VirusTotal Check
        vt_info = check_virustotal(url)
        
        # Domain age calculation
        try:
            domain_age = (datetime.now() - datetime.strptime(whois_info.get('creation_date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d')).days
        except:
            domain_age = 0
        
        # Calculate risk score
        risk_score = calculate_risk_score(features, ssl_info, whois_info, domain_age)
        
        # Determine category
        category = get_category(risk_score)
        
        # Generate recommendations
        recommendations = generate_recommendations(features, ssl_info, risk_score)
        
        return {
            'url': url,
            'risk_score': risk_score,
            'category': category,
            'features': features,
            'virus_total': vt_info,
            'whois': whois_info,
            'ssl': ssl_info,
            'recommendations': recommendations
        }
    except Exception as e:
        return {
            'url': url,
            'risk_score': 85,
            'category': 'High Risk',
            'features': {},
            'virus_total': {'error': str(e)},
            'whois': {'error': str(e)},
            'ssl': {'error': str(e)},
            'recommendations': ['Invalid URL format', 'Do not proceed with this URL']
        }


def calculate_risk_score(features, ssl_info, whois_info, domain_age):
    """Calculate risk score based on extracted features"""
    score = 0
    
    # URL-based scoring
    if features.get('url_length', 0) > 75:
        score += 10
    if features.get('dot_count', 0) > 3:
        score += 10
    if features.get('hyphen_count', 0) > 2:
        score += 8
    if features.get('has_at', 0) == 1:
        score += 15
    if features.get('has_https', 0) == 0:
        score += 15
    if features.get('ip_address', 0) == 1:
        score += 20
    if features.get('tiny_url', 0) == 1:
        score += 10
    if features.get('has_port', 0) == 1:
        score += 5
    if features.get('subdomain_count', 0) > 2:
        score += 10
    if features.get('suspicious_keywords', 0) > 0:
        score += features.get('suspicious_keywords', 0) * 3
    if features.get('brand_impersonation', 0) > 0:
        score += features.get('brand_impersonation', 0) * 15
    
    # SSL-based scoring
    if not ssl_info.get('valid', False):
        score += 10
    
    # Domain-based scoring
    if domain_age < 90:
        score += 15
    
    return min(100, max(0, score))


def get_category(score):
    """Get category based on risk score"""
    if score <= 20:
        return 'Safe'
    elif score <= 40:
        return 'Low Risk'
    elif score <= 60:
        return 'Suspicious'
    elif score <= 80:
        return 'High Risk'
    else:
        return 'Phishing'


def generate_recommendations(features, ssl_info, risk_score):
    """Generate security recommendations"""
    recommendations = []
    
    if not features.get('has_https', 0):
        recommendations.append('Enable HTTPS for secure communication')
    if not ssl_info.get('valid', False):
        recommendations.append('Renew or fix SSL certificate')
    if features.get('suspicious_keywords', 0) > 0:
        recommendations.append('Remove suspicious keywords from URL')
    if features.get('brand_impersonation', 0) > 0:
        recommendations.append('Avoid brand impersonation in domain name')
    if features.get('has_at', 0) == 1:
        recommendations.append('Remove @ symbol from URL')
    if features.get('ip_address', 0) == 1:
        recommendations.append('Use domain name instead of IP address')
    if features.get('subdomain_count', 0) > 2:
        recommendations.append('Reduce excessive subdomains')
    
    if not recommendations:
        recommendations = ['URL appears safe - maintain current security practices']
    
    return recommendations


# ============ WEB ROUTES ============

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/login')
def login_page():
    return render_template('login.html')


@app.route('/register')
def register_page():
    return render_template('register.html')


@app.route('/scan')
def scan_page():
    return render_template('scan.html')


@app.route('/history')
def history_page():
    return render_template('history.html')


@app.route('/report/<scan_id>')
def report_page(scan_id):
    return render_template('report.html', scan_id=scan_id)


@app.route('/admin')
def admin_page():
    return render_template('admin.html')


@app.route('/api')
def api_docs():
    return jsonify({
        'message': 'PhishGuard AI API',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/register': 'Register a new user',
            'POST /api/login': 'Login and get JWT token',
            'POST /api/scan': 'Scan a URL (requires auth)',
            'GET /api/history': 'Get scan history (requires auth)',
            'GET /api/history/<id>': 'Get specific scan (requires auth)',
            'DELETE /api/history/<id>': 'Delete a scan (requires auth)',
            'GET /api/stats': 'Get user statistics (requires auth)',
            'GET /api/report/<id>': 'Generate PDF report (requires auth)',
            'GET /api/admin/users': 'Get all users (admin only)',
            'DELETE /api/admin/users/<id>': 'Delete user (admin only)',
            'GET /api/admin/scans': 'Get all scans (admin only)',
            'POST /api/admin/block-domain': 'Block a domain (admin only)',
            'POST /api/admin/unblock-domain': 'Unblock a domain (admin only)',
            'GET /api/admin/stats': 'Get admin statistics (admin only)'
        }
    }), 200


# ============ MAIN ============

if __name__ == '__main__':
    init_db()
    print("PhishGuard AI Backend Started")
    print("=" * 50)
    print(f"Server: http://{app.config.get('HOST', '0.0.0.0')}:{app.config.get('PORT', 5000)}")
    print("=" * 50)
    app.run(host=app.config.get('HOST', '0.0.0.0'), port=app.config.get('PORT', 5000), debug=app.config.get('DEBUG', False))
