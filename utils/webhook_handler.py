"""
PhishGuard AI - Webhook Handler
Send notifications to external services via webhooks
"""

import requests
import json
import hashlib
import hmac
from datetime import datetime

class WebhookHandler:
    def __init__(self):
        self.webhooks = []
    
    def add_webhook(self, url, events, secret=None, name="Custom Webhook"):
        """Register a new webhook"""
        webhook = {
            'id': hashlib.md5(url.encode()).hexdigest()[:12],
            'url': url,
            'events': events,
            'secret': secret,
            'name': name,
            'created_at': datetime.now().isoformat(),
            'active': True
        }
        self.webhooks.append(webhook)
        return webhook
    
    def remove_webhook(self, webhook_id):
        """Remove a webhook"""
        self.webhooks = [w for w in self.webhooks if w['id'] != webhook_id]
    
    def _generate_signature(self, payload, secret):
        """Generate HMAC signature for webhook"""
        if not secret:
            return None
        signature = hmac.new(
            secret.encode(),
            json.dumps(payload).encode(),
            hashlib.sha256
        ).hexdigest()
        return f"sha256={signature}"
    
    def send_webhook(self, webhook_id, event_type, payload):
        """Send webhook notification"""
        webhook = next((w for w in self.webhooks if w['id'] == webhook_id), None)
        if not webhook or not webhook['active']:
            return False, "Webhook not found or inactive"
        
        # Check if event is subscribed
        if '*' not in webhook['events'] and event_type not in webhook['events']:
            return False, "Event not subscribed"
        
        # Prepare payload
        data = {
            'event': event_type,
            'timestamp': datetime.now().isoformat(),
            'data': payload
        }
        
        # Add signature if secret exists
        headers = {
            'Content-Type': 'application/json',
            'X-PhishGuard-Event': event_type,
            'X-PhishGuard-Delivery': webhook['id']
        }
        
        signature = self._generate_signature(data, webhook.get('secret'))
        if signature:
            headers['X-PhishGuard-Signature'] = signature
        
        try:
            response = requests.post(
                webhook['url'],
                json=data,
                headers=headers,
                timeout=10
            )
            
            return response.ok, f"HTTP {response.status_code}"
            
        except Exception as e:
            return False, str(e)
    
    def send_scan_complete(self, scan_result):
        """Send scan complete notification to all subscribed webhooks"""
        results = []
        for webhook in self.webhooks:
            success, message = self.send_webhook(
                webhook['id'],
                'scan.complete',
                scan_result
            )
            results.append({
                'webhook_id': webhook['id'],
                'success': success,
                'message': message
            })
        return results
    
    def send_threat_detected(self, threat_data):
        """Send threat detected notification"""
        results = []
        for webhook in self.webhooks:
            if threat_data.get('risk_score', 0) > 60:  # Only high-risk threats
                success, message = self.send_webhook(
                    webhook['id'],
                    'threat.detected',
                    threat_data
                )
                results.append({
                    'webhook_id': webhook['id'],
                    'success': success,
                    'message': message
                })
        return results
    
    def send_batch_complete(self, batch_results):
        """Send batch scan complete notification"""
        results = []
        for webhook in self.webhooks:
            success, message = self.send_webhook(
                webhook['id'],
                'batch.complete',
                batch_results
            )
            results.append({
                'webhook_id': webhook['id'],
                'success': success,
                'message': message
            })
        return results


# Pre-built webhook integrations

class SlackWebhook:
    """Slack webhook integration"""
    
    @staticmethod
    def send_alert(webhook_url, scan_result):
        risk_score = scan_result['risk_score']
        category = scan_result['category']
        url = scan_result['url']
        
        if risk_score <= 20:
            color = "#00ff88"
            emoji = "✅"
        elif risk_score <= 40:
            color = "#00d4ff"
            emoji = "ℹ️"
        elif risk_score <= 60:
            color = "#ffdd00"
            emoji = "⚠️"
        elif risk_score <= 80:
            color = "#ffaa00"
            emoji = "🔶"
        else:
            color = "#ff3366"
            emoji = "🚨"
        
        payload = {
            "attachments": [{
                "color": color,
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": f"{emoji} PhishGuard Security Alert"
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {"type": "mrkdwn", "text": f"*Risk Score:*\n{risk_score}/100"},
                            {"type": "mrkdwn", "text": f"*Category:*\n{category}"}
                        ]
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*URL:*\n```{url}```"
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [{
                            "type": "button",
                            "text": {"type": "plain_text", "text": "View Report"},
                            "url": f"https://phishguard.ai/scan/{scan_result.get('id', '')}",
                            "style": "primary"
                        }]
                    }
                ]
            }]
        }
        
        response = requests.post(webhook_url, json=payload)
        return response.ok


class DiscordWebhook:
    """Discord webhook integration"""
    
    @staticmethod
    def send_alert(webhook_url, scan_result):
        risk_score = scan_result['risk_score']
        category = scan_result['category']
        url = scan_result['url']
        
        if risk_score <= 20:
            color = 0x00ff88
        elif risk_score <= 40:
            color = 0x00d4ff
        elif risk_score <= 60:
            color = 0xffdd00
        elif risk_score <= 80:
            color = 0xffaa00
        else:
            color = 0xff3366
        
        embed = {
            "embeds": [{
                "title": "🛡️ PhishGuard Security Alert",
                "color": color,
                "fields": [
                    {"name": "Risk Score", "value": f"{risk_score}/100", "inline": True},
                    {"name": "Category", "value": category, "inline": True},
                    {"name": "URL", "value": f"```{url}```", "inline": False}
                ],
                "footer": {"text": "PhishGuard AI"},
                "timestamp": datetime.now().isoformat()
            }]
        }
        
        response = requests.post(webhook_url, json=embed)
        return response.ok


class TeamsWebhook:
    """Microsoft Teams webhook integration"""
    
    @staticmethod
    def send_alert(webhook_url, scan_result):
        risk_score = scan_result['risk_score']
        category = scan_result['category']
        url = scan_result['url']
        
        if risk_score <= 20:
            theme_color = "00ff88"
        elif risk_score <= 40:
            theme_color = "00d4ff"
        elif risk_score <= 60:
            theme_color = "ffdd00"
        elif risk_score <= 80:
            theme_color = "ffaa00"
        else:
            theme_color = "ff3366"
        
        payload = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": theme_color,
            "summary": f"PhishGuard Alert: {category}",
            "sections": [{
                "activityTitle": "🛡️ PhishGuard Security Alert",
                "facts": [
                    {"name": "Risk Score", "value": f"{risk_score}/100"},
                    {"name": "Category", "value": category},
                    {"name": "URL", "value": url}
                ],
                "markdown": True
            }],
            "potentialAction": [{
                "@type": "OpenUri",
                "name": "View Report",
                "targets": [{
                    "os": "default",
                    "uri": f"https://phishguard.ai/scan/{scan_result.get('id', '')}"
                }]
            }]
        }
        
        response = requests.post(webhook_url, json=payload)
        return response.ok


class TelegramBot:
    """Telegram bot webhook integration"""
    
    @staticmethod
    def send_alert(bot_token, chat_id, scan_result):
        risk_score = scan_result['risk_score']
        category = scan_result['category']
        url = scan_result['url']
        
        if risk_score <= 20:
            emoji = "✅"
        elif risk_score <= 40:
            emoji = "ℹ️"
        elif risk_score <= 60:
            emoji = "⚠️"
        elif risk_score <= 80:
            emoji = "🔶"
        else:
            emoji = "🚨"
        
        message = f"""
{emoji} *PhishGuard Security Alert*

*Risk Score:* `{risk_score}/100`
*Category:* {category}

*URL:* `{url}`

[View Full Report](https://phishguard.ai/scan/{scan_result.get('id', '')})
        """
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": True
        }
        
        response = requests.post(url, json=payload)
        return response.ok
