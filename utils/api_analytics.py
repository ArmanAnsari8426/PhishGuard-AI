"""
PhishGuard AI - API Analytics & Rate Limiting
Track API usage and enforce rate limits
"""

from datetime import datetime, timedelta
from collections import defaultdict
import hashlib

class APIAnalytics:
    """Track API usage analytics"""
    
    def __init__(self):
        self.api_calls = []
        self.user_usage = defaultdict(list)
        self.endpoint_stats = defaultdict(lambda: {'count': 0, 'errors': 0, 'avg_time': 0})
    
    def track_call(self, user_id, endpoint, method, status_code, response_time, ip_address=None):
        """Track API call"""
        call = {
            'id': len(self.api_calls) + 1,
            'user_id': user_id,
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'response_time': response_time,
            'ip_address': ip_address,
            'timestamp': datetime.now().isoformat()
        }
        
        self.api_calls.append(call)
        self.user_usage[user_id].append(call)
        
        # Update endpoint stats
        stats = self.endpoint_stats[endpoint]
        stats['count'] += 1
        if status_code >= 400:
            stats['errors'] += 1
        stats['avg_time'] = (stats['avg_time'] * (stats['count'] - 1) + response_time) / stats['count']
        
        return call
    
    def get_user_usage(self, user_id, period=30):
        """Get user API usage"""
        cutoff = datetime.now() - timedelta(days=period)
        user_calls = [c for c in self.user_usage.get(user_id, []) 
                     if datetime.fromisoformat(c['timestamp']) > cutoff]
        
        total_calls = len(user_calls)
        total_errors = sum(1 for c in user_calls if c['status_code'] >= 400)
        avg_response_time = sum(c['response_time'] for c in user_calls) / max(total_calls, 1)
        
        # Daily breakdown
        daily = defaultdict(int)
        for call in user_calls:
            day = datetime.fromisoformat(call['timestamp']).strftime('%Y-%m-%d')
            daily[day] += 1
        
        # Endpoint breakdown
        endpoints = defaultdict(int)
        for call in user_calls:
            endpoints[call['endpoint']] += 1
        
        return {
            'user_id': user_id,
            'period_days': period,
            'total_calls': total_calls,
            'total_errors': total_errors,
            'error_rate': (total_errors / max(total_calls, 1)) * 100,
            'avg_response_time_ms': round(avg_response_time, 2),
            'daily_usage': dict(daily),
            'top_endpoints': dict(sorted(endpoints.items(), key=lambda x: x[1], reverse=True)[:10]),
            'calls_per_day': round(total_calls / period, 2)
        }
    
    def get_endpoint_stats(self, endpoint=None):
        """Get endpoint statistics"""
        if endpoint:
            return {endpoint: self.endpoint_stats[endpoint]}
        return dict(self.endpoint_stats)
    
    def get_global_stats(self, period=30):
        """Get global API statistics"""
        cutoff = datetime.now() - timedelta(days=period)
        recent_calls = [c for c in self.api_calls 
                       if datetime.fromisoformat(c['timestamp']) > cutoff]
        
        total_calls = len(recent_calls)
        total_errors = sum(1 for c in recent_calls if c['status_code'] >= 400)
        avg_response = sum(c['response_time'] for c in recent_calls) / max(total_calls, 1)
        
        active_users = len(set(c['user_id'] for c in recent_calls))
        
        # Hourly distribution
        hourly = defaultdict(int)
        for call in recent_calls:
            hour = datetime.fromisoformat(call['timestamp']).hour
            hourly[hour] += 1
        
        return {
            'total_calls': total_calls,
            'total_errors': total_errors,
            'error_rate': (total_errors / max(total_calls, 1)) * 100,
            'avg_response_time_ms': round(avg_response, 2),
            'active_users': active_users,
            'calls_per_day': round(total_calls / period, 2),
            'peak_hour': max(hourly.items(), key=lambda x: x[1])[0] if hourly else 0,
            'hourly_distribution': dict(hourly)
        }


class RateLimiter:
    """API rate limiting"""
    
    def __init__(self):
        self.limits = {
            'free': {'requests_per_minute': 10, 'requests_per_hour': 200, 'requests_per_day': 1000},
            'pro': {'requests_per_minute': 60, 'requests_per_hour': 1000, 'requests_per_day': 10000},
            'enterprise': {'requests_per_minute': 300, 'requests_per_hour': 5000, 'requests_per_day': 100000}
        }
        self.usage = defaultdict(lambda: {'minute': 0, 'hour': 0, 'day': 0, 'last_reset': datetime.now()})
    
    def check_rate_limit(self, user_id, plan='free'):
        """Check if user has exceeded rate limit"""
        limits = self.limits.get(plan, self.limits['free'])
        user_usage = self.usage[user_id]
        
        self._reset_if_needed(user_usage)
        
        if user_usage['minute'] >= limits['requests_per_minute']:
            return False, 'Rate limit exceeded (per minute)'
        if user_usage['hour'] >= limits['requests_per_hour']:
            return False, 'Rate limit exceeded (per hour)'
        if user_usage['day'] >= limits['requests_per_day']:
            return False, 'Rate limit exceeded (per day)'
        
        return True, None
    
    def increment_usage(self, user_id):
        """Increment usage counter"""
        self.usage[user_id]['minute'] += 1
        self.usage[user_id]['hour'] += 1
        self.usage[user_id]['day'] += 1
    
    def get_usage(self, user_id, plan='free'):
        """Get current usage"""
        limits = self.limits.get(plan, self.limits['free'])
        user_usage = self.usage[user_id]
        
        self._reset_if_needed(user_usage)
        
        return {
            'minute': {'used': user_usage['minute'], 'limit': limits['requests_per_minute']},
            'hour': {'used': user_usage['hour'], 'limit': limits['requests_per_hour']},
            'day': {'used': user_usage['day'], 'limit': limits['requests_per_day']},
            'reset_at': user_usage['last_reset'].isoformat()
        }
    
    def reset_usage(self, user_id):
        """Reset user usage"""
        self.usage[user_id] = {'minute': 0, 'hour': 0, 'day': 0, 'last_reset': datetime.now()}
    
    def _reset_if_needed(self, user_usage):
        """Reset counters if time window has passed"""
        now = datetime.now()
        
        if now - user_usage['last_reset'] > timedelta(minutes=1):
            user_usage['minute'] = 0
        
        if now - user_usage['last_reset'] > timedelta(hours=1):
            user_usage['hour'] = 0
        
        if now - user_usage['last_reset'] > timedelta(days=1):
            user_usage['day'] = 0
            user_usage['last_reset'] = now
    
    def set_custom_limit(self, plan, limits):
        """Set custom rate limits for a plan"""
        self.limits[plan] = limits
    
    def get_rate_limit_headers(self, user_id, plan='free'):
        """Get rate limit headers for response"""
        usage = self.get_usage(user_id, plan)
        
        return {
            'X-RateLimit-Limit-Minute': usage['minute']['limit'],
            'X-RateLimit-Remaining-Minute': usage['minute']['limit'] - usage['minute']['used'],
            'X-RateLimit-Reset': usage['reset_at']
        }


class APIKeyManager:
    """Manage API keys"""
    
    def __init__(self):
        self.api_keys = {}
    
    def generate_key(self, user_id, name, permissions=None):
        """Generate new API key"""
        key = f"pg_{hashlib.sha256(f'{user_id}:{datetime.now()}'.encode()).hexdigest()[:32]}"
        
        api_key = {
            'id': hashlib.md5(key.encode()).hexdigest()[:12],
            'user_id': user_id,
            'name': name,
            'key': key,
            'key_hash': hashlib.sha256(key.encode()).hexdigest(),
            'permissions': permissions or ['read'],
            'created_at': datetime.now().isoformat(),
            'last_used': None,
            'active': True
        }
        
        self.api_keys[api_key['id']] = api_key
        return api_key
    
    def validate_key(self, key):
        """Validate API key"""
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        
        for api_key in self.api_keys.values():
            if api_key['key_hash'] == key_hash and api_key['active']:
                api_key['last_used'] = datetime.now().isoformat()
                return api_key
        
        return None
    
    def revoke_key(self, key_id, user_id):
        """Revoke API key"""
        api_key = self.api_keys.get(key_id)
        if api_key and api_key['user_id'] == user_id:
            api_key['active'] = False
            return True
        return False
    
    def get_user_keys(self, user_id):
        """Get all API keys for user"""
        return [k for k in self.api_keys.values() if k['user_id'] == user_id]
    
    def delete_key(self, key_id, user_id):
        """Delete API key"""
        api_key = self.api_keys.get(key_id)
        if api_key and api_key['user_id'] == user_id:
            del self.api_keys[key_id]
            return True
        return False
