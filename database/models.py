"""
PhishGuard AI - Database Models
SQLite for development, PostgreSQL for production
"""

import sqlite3
import os
import json
from datetime import datetime

class Database:
    def __init__(self, db_path='database/phishguard.db'):
        self.db_path = db_path
        self._ensure_db_directory()
    
    def _ensure_db_directory(self):
        """Ensure database directory exists"""
        directory = os.path.dirname(self.db_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
    
    def _get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_db(self):
        """Initialize database tables"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                scan_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Scans table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scans (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                url TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                category TEXT NOT NULL,
                features TEXT,
                virus_total TEXT,
                whois TEXT,
                ssl_info TEXT,
                recommendations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Blocked domains table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blocked_domains (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                domain TEXT UNIQUE NOT NULL,
                blocked_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # API keys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_keys (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                key_hash TEXT NOT NULL,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_used TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_user(self, name, email, password):
        """Create a new user"""
        import uuid
        user_id = str(uuid.uuid4())
        conn = self._get_connection()
        cursor = conn.cursor()
        
        role = 'admin' if 'admin' in email else 'user'
        
        cursor.execute('''
            INSERT INTO users (id, name, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, name, email, password, role))
        
        conn.commit()
        conn.close()
        return user_id
    
    def get_user_by_email(self, email):
        """Get user by email"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    
    def create_scan(self, user_id, url, risk_score, category, features, virus_total, whois, ssl_info, recommendations):
        """Create a new scan record"""
        import uuid
        scan_id = str(uuid.uuid4())
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO scans (id, user_id, url, risk_score, category, features, virus_total, whois, ssl_info, recommendations)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (scan_id, user_id, url, risk_score, category,
              json.dumps(features), json.dumps(virus_total),
              json.dumps(whois), json.dumps(ssl_info),
              json.dumps(recommendations)))
        
        # Update user scan count
        cursor.execute('''
            UPDATE users SET scan_count = scan_count + 1 WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        conn.close()
        return scan_id
    
    def get_user_scans(self, user_id, page=1, limit=50, category=None):
        """Get scans for a user"""
        offset = (page - 1) * limit
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if category:
            cursor.execute('''
                SELECT * FROM scans WHERE user_id = ? AND category = ?
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            ''', (user_id, category, limit, offset))
        else:
            cursor.execute('''
                SELECT * FROM scans WHERE user_id = ?
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            ''', (user_id, limit, offset))
        
        scans = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # Parse JSON fields
        for scan in scans:
            scan['features'] = json.loads(scan['features']) if scan['features'] else {}
            scan['virus_total'] = json.loads(scan['virus_total']) if scan['virus_total'] else {}
            scan['whois'] = json.loads(scan['whois']) if scan['whois'] else {}
            scan['ssl_info'] = json.loads(scan['ssl_info']) if scan['ssl_info'] else {}
            scan['recommendations'] = json.loads(scan['recommendations']) if scan['recommendations'] else []
        
        return scans
    
    def get_scan_by_id(self, scan_id):
        """Get scan by ID"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM scans WHERE id = ?', (scan_id,))
        scan = cursor.fetchone()
        conn.close()
        
        if scan:
            scan = dict(scan)
            scan['features'] = json.loads(scan['features']) if scan['features'] else {}
            scan['virus_total'] = json.loads(scan['virus_total']) if scan['virus_total'] else {}
            scan['whois'] = json.loads(scan['whois']) if scan['whois'] else {}
            scan['ssl_info'] = json.loads(scan['ssl_info']) if scan['ssl_info'] else {}
            scan['recommendations'] = json.loads(scan['recommendations']) if scan['recommendations'] else []
            return scan
        return None
    
    def delete_scan(self, scan_id):
        """Delete a scan"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM scans WHERE id = ?', (scan_id,))
        conn.commit()
        conn.close()
    
    def get_user_stats(self, user_id):
        """Get statistics for a user"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) as total FROM scans WHERE user_id = ?', (user_id,))
        total = cursor.fetchone()['total']
        
        cursor.execute('SELECT category, COUNT(*) as count FROM scans WHERE user_id = ? GROUP BY category', (user_id,))
        categories = {row['category']: row['count'] for row in cursor.fetchall()}
        
        cursor.execute('SELECT AVG(risk_score) as avg_score FROM scans WHERE user_id = ?', (user_id,))
        avg_score = cursor.fetchone()['avg_score'] or 0
        
        conn.close()
        
        return {
            'total': total,
            'safe': categories.get('Safe', 0),
            'low_risk': categories.get('Low Risk', 0),
            'suspicious': categories.get('Suspicious', 0),
            'high_risk': categories.get('High Risk', 0),
            'phishing': categories.get('Phishing', 0),
            'average_risk_score': round(avg_score, 2)
        }
    
    def get_all_users(self):
        """Get all users (admin only)"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, email, role, scan_count, created_at FROM users ORDER BY created_at DESC')
        users = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return users
    
    def delete_user(self, user_id):
        """Delete a user and all their scans"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
    
    def get_all_scans(self, page=1, limit=100):
        """Get all scans (admin only)"""
        offset = (page - 1) * limit
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT s.*, u.name as user_name, u.email as user_email
            FROM scans s
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
            LIMIT ? OFFSET ?
        ''', (limit, offset))
        scans = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        for scan in scans:
            scan['features'] = json.loads(scan['features']) if scan['features'] else {}
            scan['virus_total'] = json.loads(scan['virus_total']) if scan['virus_total'] else {}
            scan['whois'] = json.loads(scan['whois']) if scan['whois'] else {}
            scan['ssl_info'] = json.loads(scan['ssl_info']) if scan['ssl_info'] else {}
            scan['recommendations'] = json.loads(scan['recommendations']) if scan['recommendations'] else []
        
        return scans
    
    def block_domain(self, domain):
        """Block a domain"""
        conn = self._get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO blocked_domains (domain) VALUES (?)', (domain,))
            conn.commit()
        except sqlite3.IntegrityError:
            pass
        conn.close()
    
    def unblock_domain(self, domain):
        """Unblock a domain"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM blocked_domains WHERE domain = ?', (domain,))
        conn.commit()
        conn.close()
    
    def get_blocked_domains(self):
        """Get all blocked domains"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT domain FROM blocked_domains ORDER BY created_at DESC')
        domains = [row['domain'] for row in cursor.fetchall()]
        conn.close()
        return domains
    
    def is_domain_blocked(self, domain):
        """Check if domain is blocked"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) as count FROM blocked_domains WHERE domain = ?', (domain,))
        count = cursor.fetchone()['count']
        conn.close()
        return count > 0
    
    def get_admin_stats(self):
        """Get admin statistics"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) as total FROM users')
        total_users = cursor.fetchone()['total']
        
        cursor.execute('SELECT COUNT(*) as total FROM scans')
        total_scans = cursor.fetchone()['total']
        
        cursor.execute('SELECT category, COUNT(*) as count FROM scans GROUP BY category')
        categories = {row['category']: row['count'] for row in cursor.fetchall()}
        
        cursor.execute('SELECT COUNT(*) as total FROM blocked_domains')
        blocked_count = cursor.fetchone()['total']
        
        conn.close()
        
        return {
            'total_users': total_users,
            'total_scans': total_scans,
            'blocked_domains': blocked_count,
            'safe': categories.get('Safe', 0),
            'low_risk': categories.get('Low Risk', 0),
            'suspicious': categories.get('Suspicious', 0),
            'high_risk': categories.get('High Risk', 0),
            'phishing': categories.get('Phishing', 0)
        }
