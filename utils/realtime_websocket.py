"""
PhishGuard AI - Real-time WebSocket Notifications
Live updates and notifications via WebSocket
"""

import json
from datetime import datetime
from collections import defaultdict

class WebSocketManager:
    """Manage WebSocket connections and broadcasts"""
    
    def __init__(self):
        self.connections = {}
        self.channels = defaultdict(set)
        self.message_history = []
    
    def connect(self, user_id, connection_id):
        """Register a new WebSocket connection"""
        self.connections[connection_id] = {
            'user_id': user_id,
            'connected_at': datetime.now().isoformat(),
            'subscriptions': []
        }
        return connection_id
    
    def disconnect(self, connection_id):
        """Remove WebSocket connection"""
        if connection_id in self.connections:
            conn = self.connections[connection_id]
            # Remove from all channels
            for channel in conn.get('subscriptions', []):
                self.channels[channel].discard(connection_id)
            del self.connections[connection_id]
    
    def subscribe(self, connection_id, channel):
        """Subscribe to a channel"""
        if connection_id in self.connections:
            self.channels[channel].add(connection_id)
            self.connections[connection_id]['subscriptions'].append(channel)
            return True
        return False
    
    def unsubscribe(self, connection_id, channel):
        """Unsubscribe from a channel"""
        if connection_id in self.connections:
            self.channels[channel].discard(connection_id)
            if channel in self.connections[connection_id]['subscriptions']:
                self.connections[connection_id]['subscriptions'].remove(channel)
            return True
        return False
    
    def broadcast(self, channel, message):
        """Broadcast message to all subscribers of a channel"""
        subscribers = self.channels.get(channel, set())
        
        broadcast_data = {
            'channel': channel,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        
        self.message_history.append(broadcast_data)
        
        # Keep only last 1000 messages
        if len(self.message_history) > 1000:
            self.message_history = self.message_history[-1000:]
        
        return {
            'channel': channel,
            'subscribers': len(subscribers),
            'message': message
        }
    
    def send_to_user(self, user_id, message):
        """Send message to specific user"""
        user_connections = [
            conn_id for conn_id, conn in self.connections.items()
            if conn['user_id'] == user_id
        ]
        
        return {
            'user_id': user_id,
            'connections': len(user_connections),
            'message': message
        }
    
    def get_active_connections(self):
        """Get count of active connections"""
        return len(self.connections)
    
    def get_channel_subscribers(self, channel):
        """Get subscribers of a channel"""
        return len(self.channels.get(channel, set()))
    
    def get_user_connections(self, user_id):
        """Get connections for a user"""
        return [
            conn_id for conn_id, conn in self.connections.items()
            if conn['user_id'] == user_id
        ]


class NotificationService:
    """Real-time notification service"""
    
    def __init__(self, ws_manager):
        self.ws = ws_manager
        self.notifications = {}
        self.user_preferences = {}
    
    def send_scan_notification(self, user_id, scan_result):
        """Send scan completion notification"""
        notification = {
            'type': 'scan_complete',
            'title': 'Scan Complete',
            'message': f"URL scan completed: {scan_result.get('category', 'Unknown')}",
            'data': {
                'url': scan_result.get('url'),
                'risk_score': scan_result.get('risk_score'),
                'category': scan_result.get('category')
            },
            'timestamp': datetime.now().isoformat()
        }
        
        self._store_notification(user_id, notification)
        self.ws.send_to_user(user_id, notification)
        
        # Also broadcast to user's channel
        self.ws.broadcast(f'user:{user_id}:scans', notification)
    
    def send_threat_alert(self, user_id, threat_data):
        """Send threat detection alert"""
        notification = {
            'type': 'threat_detected',
            'title': '⚠️ Threat Detected',
            'message': f"High-risk threat detected: {threat_data.get('category', 'Unknown')}",
            'severity': 'high' if threat_data.get('risk_score', 0) > 70 else 'medium',
            'data': threat_data,
            'timestamp': datetime.now().isoformat()
        }
        
        self._store_notification(user_id, notification)
        self.ws.send_to_user(user_id, notification)
        self.ws.broadcast(f'user:{user_id}:threats', notification)
    
    def send_team_notification(self, team_id, message, sender=None):
        """Send notification to all team members"""
        notification = {
            'type': 'team_notification',
            'title': 'Team Notification',
            'message': message,
            'sender': sender,
            'timestamp': datetime.now().isoformat()
        }
        
        self.ws.broadcast(f'team:{team_id}', notification)
    
    def send_system_alert(self, message, severity='info'):
        """Send system-wide alert"""
        notification = {
            'type': 'system_alert',
            'title': 'System Alert',
            'message': message,
            'severity': severity,
            'timestamp': datetime.now().isoformat()
        }
        
        self.ws.broadcast('system', notification)
    
    def send_batch_progress(self, user_id, batch_id, progress):
        """Send batch scan progress update"""
        notification = {
            'type': 'batch_progress',
            'title': 'Batch Scan Progress',
            'data': {
                'batch_id': batch_id,
                'completed': progress.get('completed', 0),
                'total': progress.get('total', 0),
                'percentage': progress.get('percentage', 0)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        self.ws.send_to_user(user_id, notification)
    
    def send_domain_alert(self, user_id, domain, alert_type, details):
        """Send domain monitoring alert"""
        notification = {
            'type': 'domain_alert',
            'title': f'Domain Alert: {alert_type}',
            'message': f'Alert for domain {domain}: {alert_type}',
            'data': {
                'domain': domain,
                'alert_type': alert_type,
                'details': details
            },
            'severity': 'high' if 'critical' in alert_type.lower() else 'medium',
            'timestamp': datetime.now().isoformat()
        }
        
        self._store_notification(user_id, notification)
        self.ws.send_to_user(user_id, notification)
    
    def send_breach_alert(self, user_id, breach_data):
        """Send data breach alert"""
        notification = {
            'type': 'breach_alert',
            'title': '🚨 Data Breach Detected',
            'message': f"Your data may have been exposed in: {breach_data.get('breach_name', 'Unknown')}",
            'severity': 'critical',
            'data': breach_data,
            'timestamp': datetime.now().isoformat()
        }
        
        self._store_notification(user_id, notification)
        self.ws.send_to_user(user_id, notification)
    
    def get_user_notifications(self, user_id, unread_only=False):
        """Get notifications for user"""
        user_notifs = self.notifications.get(user_id, [])
        
        if unread_only:
            user_notifs = [n for n in user_notifs if not n.get('read')]
        
        return user_notifs[-50:]  # Return last 50
    
    def mark_read(self, user_id, notification_id):
        """Mark notification as read"""
        if user_id in self.notifications:
            for notif in self.notifications[user_id]:
                if notif.get('id') == notification_id:
                    notif['read'] = True
                    return True
        return False
    
    def mark_all_read(self, user_id):
        """Mark all notifications as read"""
        if user_id in self.notifications:
            for notif in self.notifications[user_id]:
                notif['read'] = True
            return True
        return False
    
    def delete_notification(self, user_id, notification_id):
        """Delete a notification"""
        if user_id in self.notifications:
            self.notifications[user_id] = [
                n for n in self.notifications[user_id] if n.get('id') != notification_id
            ]
            return True
        return False
    
    def get_unread_count(self, user_id):
        """Get count of unread notifications"""
        user_notifs = self.notifications.get(user_id, [])
        return sum(1 for n in user_notifs if not n.get('read'))
    
    def update_preferences(self, user_id, preferences):
        """Update notification preferences"""
        self.user_preferences[user_id] = preferences
        return True
    
    def get_preferences(self, user_id):
        """Get notification preferences"""
        return self.user_preferences.get(user_id, {
            'email_notifications': True,
            'push_notifications': True,
            'scan_complete': True,
            'threat_alerts': True,
            'team_updates': True,
            'weekly_report': True
        })
    
    def _store_notification(self, user_id, notification):
        """Store notification"""
        if user_id not in self.notifications:
            self.notifications[user_id] = []
        
        notification['id'] = f"notif_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(self.notifications[user_id])}"
        notification['read'] = False
        
        self.notifications[user_id].append(notification)
        
        # Keep only last 100 notifications per user
        if len(self.notifications[user_id]) > 100:
            self.notifications[user_id] = self.notifications[user_id][-100:]


class LiveFeed:
    """Real-time security event feed"""
    
    def __init__(self, ws_manager):
        self.ws = ws_manager
        self.events = []
        self.max_events = 500
    
    def add_event(self, event_type, data, severity='info'):
        """Add event to live feed"""
        event = {
            'id': len(self.events) + 1,
            'type': event_type,
            'data': data,
            'severity': severity,
            'timestamp': datetime.now().isoformat()
        }
        
        self.events.append(event)
        
        # Keep only max events
        if len(self.events) > self.max_events:
            self.events = self.events[-self.max_events:]
        
        # Broadcast to live feed channel
        self.ws.broadcast('live_feed', event)
        
        return event
    
    def get_events(self, limit=50, event_type=None, severity=None):
        """Get recent events"""
        events = self.events
        
        if event_type:
            events = [e for e in events if e['type'] == event_type]
        
        if severity:
            events = [e for e in events if e['severity'] == severity]
        
        return events[-limit:]
    
    def get_event_stats(self):
        """Get event statistics"""
        from collections import Counter
        
        type_counts = Counter(e['type'] for e in self.events)
        severity_counts = Counter(e['severity'] for e in self.events)
        
        return {
            'total_events': len(self.events),
            'by_type': dict(type_counts),
            'by_severity': dict(severity_counts),
            'last_hour': len([e for e in self.events 
                            if (datetime.now() - datetime.fromisoformat(e['timestamp'])).seconds < 3600])
        }
