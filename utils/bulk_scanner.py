"""
PhishGuard AI - Bulk URL Scanner
Scan multiple URLs simultaneously
"""

import concurrent.futures
from datetime import datetime
import uuid
from utils.feature_extractor import extract_features
from utils.ssl_checker import check_ssl_certificate
from utils.reputation_checker import check_virustotal, get_reputation_score
import time

class BulkScanner:
    def __init__(self, max_workers=10):
        self.max_workers = max_workers
        self.batch_jobs = {}
    
    def create_batch(self, urls, user_id):
        """Create a new batch scan job"""
        batch_id = str(uuid.uuid4())
        
        job = {
            'id': batch_id,
            'user_id': user_id,
            'urls': urls,
            'total': len(urls),
            'completed': 0,
            'failed': 0,
            'results': [],
            'status': 'processing',
            'created_at': datetime.now().isoformat(),
            'started_at': datetime.now().isoformat(),
            'completed_at': None
        }
        
        self.batch_jobs[batch_id] = job
        return batch_id
    
    def _scan_single_url(self, url):
        """Scan a single URL"""
        start_time = time.time()
        
        try:
            # Extract features
            features = extract_features(url)
            
            # Check SSL
            ssl_info = None
            if url.startswith('https'):
                from urllib.parse import urlparse
                hostname = urlparse(url).hostname
                ssl_info = check_ssl_certificate(hostname)
            
            # Check VirusTotal (simplified for demo)
            virus_total = {
                'reputation': max(0, 100 - (features.get('suspicious_keywords', 0) * 20)),
                'detections': features.get('suspicious_keywords', 0),
                'total_engines': 70,
                'available': True
            }
            
            # Calculate risk score
            risk_score = self._calculate_risk_score(features)
            
            # Determine category
            category = self._get_category(risk_score)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(features, risk_score)
            
            scan_time = time.time() - start_time
            
            return {
                'url': url,
                'success': True,
                'risk_score': risk_score,
                'category': category,
                'features': features,
                'ssl_info': ssl_info,
                'virus_total': virus_total,
                'recommendations': recommendations,
                'scan_time': round(scan_time * 1000, 2)  # milliseconds
            }
            
        except Exception as e:
            scan_time = time.time() - start_time
            return {
                'url': url,
                'success': False,
                'error': str(e),
                'risk_score': 0,
                'category': 'Error',
                'scan_time': round(scan_time * 1000, 2)
            }
    
    def _calculate_risk_score(self, features):
        """Calculate risk score from features"""
        if not features:
            return 50
        
        score = 0
        
        if features.get('url_length', 0) > 75:
            score += 15
        if features.get('dot_count', 0) > 3:
            score += 10
        if features.get('hyphen_count', 0) > 2:
            score += 8
        if features.get('has_at', 0):
            score += 15
        if not features.get('has_https', 0):
            score += 20
        if features.get('ip_address', 0):
            score += 20
        if features.get('tiny_url', 0):
            score += 10
        if features.get('suspicious_keywords', 0) > 0:
            score += features['suspicious_keywords'] * 5
        if features.get('brand_impersonation', 0) > 0:
            score += features['brand_impersonation'] * 15
        
        return min(100, score)
    
    def _get_category(self, risk_score):
        """Get category from risk score"""
        if risk_score <= 20:
            return 'Safe'
        elif risk_score <= 40:
            return 'Low Risk'
        elif risk_score <= 60:
            return 'Suspicious'
        elif risk_score <= 80:
            return 'High Risk'
        else:
            return 'Phishing'
    
    def _generate_recommendations(self, features, risk_score):
        """Generate recommendations based on scan"""
        recommendations = []
        
        if not features.get('has_https'):
            recommendations.append('Enable HTTPS for secure connection')
        
        if features.get('suspicious_keywords', 0) > 0:
            recommendations.append('URL contains suspicious keywords')
        
        if features.get('brand_impersonation', 0) > 0:
            recommendations.append('Possible brand impersonation detected')
        
        if features.get('ip_address'):
            recommendations.append('Using IP address instead of domain name')
        
        if features.get('url_length', 0) > 75:
            recommendations.append('URL is unusually long')
        
        if risk_score <= 20:
            recommendations.append('URL appears safe')
        
        return recommendations
    
    def scan_batch(self, batch_id):
        """Execute batch scan with parallel processing"""
        job = self.batch_jobs.get(batch_id)
        if not job:
            return None
        
        urls = job['urls']
        results = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_url = {executor.submit(self._scan_single_url, url): url for url in urls}
            
            for future in concurrent.futures.as_completed(future_to_url):
                result = future.result()
                results.append(result)
                
                # Update job progress
                job['completed'] += 1
                if not result['success']:
                    job['failed'] += 1
                job['results'] = results
        
        # Complete the job
        job['status'] = 'completed'
        job['completed_at'] = datetime.now().isoformat()
        
        # Generate summary
        job['summary'] = self._generate_summary(results)
        
        return job
    
    def _generate_summary(self, results):
        """Generate batch scan summary"""
        total = len(results)
        successful = sum(1 for r in results if r['success'])
        failed = total - successful
        
        categories = {}
        for r in results:
            if r['success']:
                cat = r['category']
                categories[cat] = categories.get(cat, 0) + 1
        
        risk_scores = [r['risk_score'] for r in results if r['success']]
        avg_risk = sum(risk_scores) / len(risk_scores) if risk_scores else 0
        max_risk = max(risk_scores) if risk_scores else 0
        min_risk = min(risk_scores) if risk_scores else 0
        
        scan_times = [r['scan_time'] for r in results]
        avg_time = sum(scan_times) / len(scan_times) if scan_times else 0
        
        return {
            'total': total,
            'successful': successful,
            'failed': failed,
            'categories': categories,
            'average_risk_score': round(avg_risk, 2),
            'max_risk_score': max_risk,
            'min_risk_score': min_risk,
            'average_scan_time': round(avg_time, 2)
        }
    
    def get_job(self, batch_id):
        """Get batch job status"""
        return self.batch_jobs.get(batch_id)
    
    def get_top_threats(self, batch_id, limit=10):
        """Get top threats from batch scan"""
        job = self.batch_jobs.get(batch_id)
        if not job:
            return []
        
        threats = [r for r in job['results'] if r['success'] and r['risk_score'] > 40]
        threats.sort(key=lambda x: x['risk_score'], reverse=True)
        
        return threats[:limit]
    
    def export_results(self, batch_id, format='json'):
        """Export batch results"""
        job = self.batch_jobs.get(batch_id)
        if not job:
            return None
        
        if format == 'json':
            return job
        
        elif format == 'csv':
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(['URL', 'Risk Score', 'Category', 'HTTPS', 'SSL Valid', 'Scan Time (ms)'])
            
            for result in job['results']:
                if result['success']:
                    writer.writerow([
                        result['url'],
                        result['risk_score'],
                        result['category'],
                        result['features'].get('has_https', False),
                        result.get('ssl_info', {}).get('valid', False),
                        result['scan_time']
                    ])
            
            return output.getvalue()
        
        return None


# URL Queue for scheduled scans
class URLQueue:
    """Queue for managing scheduled scans"""
    
    def __init__(self):
        self.queues = {}  # user_id -> list of URLs
    
    def add_to_queue(self, user_id, urls):
        """Add URLs to user's queue"""
        if user_id not in self.queues:
            self.queues[user_id] = []
        
        for url in urls:
            if url not in [u['url'] for u in self.queues[user_id]]:
                self.queues[user_id].append({
                    'url': url,
                    'added_at': datetime.now().isoformat(),
                    'scanned': False
                })
    
    def get_pending(self, user_id):
        """Get pending URLs for user"""
        return [u for u in self.queues.get(user_id, []) if not u['scanned']]
    
    def mark_scanned(self, user_id, url):
        """Mark URL as scanned"""
        if user_id in self.queues:
            for u in self.queues[user_id]:
                if u['url'] == url:
                    u['scanned'] = True
                    u['scanned_at'] = datetime.now().isoformat()
    
    def clear_completed(self, user_id):
        """Clear completed scans from queue"""
        if user_id in self.queues:
            self.queues[user_id] = [u for u in self.queues[user_id] if not u['scanned']]
    
    def remove_url(self, user_id, url):
        """Remove URL from queue"""
        if user_id in self.queues:
            self.queues[user_id] = [u for u in self.queues[user_id] if u['url'] != url]
