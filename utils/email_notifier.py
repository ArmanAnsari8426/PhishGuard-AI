"""
PhishGuard AI - Email Notification System
Send phishing alerts and reports via email
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
from datetime import datetime

class EmailNotifier:
    def __init__(self):
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.smtp_user = os.getenv('SMTP_USER')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.sender_name = "PhishGuard AI"
    
    def _create_connection(self):
        """Create SMTP connection"""
        if not self.smtp_user or not self.smtp_password:
            raise ValueError("SMTP credentials not configured")
        
        server = smtplib.SMTP(self.smtp_host, self.smtp_port)
        server.starttls()
        server.login(self.smtp_user, self.smtp_password)
        return server
    
    def send_scan_alert(self, recipient_email, scan_result):
        """Send scan result alert email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"🛡️ PhishGuard Alert: {scan_result['category']} Detected"
            msg['From'] = f"{self.sender_name} <{self.smtp_user}>"
            msg['To'] = recipient_email
            
            risk_score = scan_result['risk_score']
            category = scan_result['category']
            url = scan_result['url']
            
            # Risk color
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
            
            # HTML email template
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #0a0e1a; color: #e2e8f0; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; padding: 30px 0; border-bottom: 1px solid #1e3a5f; }}
                    .logo {{ font-size: 32px; font-weight: bold; color: #00d4ff; }}
                    .alert-box {{ background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid {color}; }}
                    .risk-score {{ font-size: 48px; font-weight: bold; color: {color}; text-align: center; }}
                    .category {{ text-align: center; color: {color}; font-size: 18px; font-weight: 600; }}
                    .url-box {{ background: #111827; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; color: #00d4ff; margin: 15px 0; }}
                    .feature-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }}
                    .feature {{ background: #111827; padding: 10px; border-radius: 6px; }}
                    .feature-label {{ color: #94a3b8; font-size: 12px; }}
                    .feature-value {{ color: #e2e8f0; font-weight: 600; }}
                    .button {{ display: block; background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; text-align: center; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }}
                    .footer {{ text-align: center; color: #64748b; font-size: 12px; padding-top: 20px; border-top: 1px solid #1e3a5f; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🛡️ PhishGuard AI</div>
                        <p style="color: #94a3b8;">Security Alert Notification</p>
                    </div>
                    
                    <div class="alert-box">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="font-size: 48px;">{emoji}</span>
                        </div>
                        <div class="risk-score">{risk_score}</div>
                        <div class="category">{category}</div>
                    </div>
                    
                    <div class="url-box">
                        🔗 {url}
                    </div>
                    
                    <div class="feature-grid">
                        <div class="feature">
                            <div class="feature-label">Risk Score</div>
                            <div class="feature-value" style="color: {color};">{risk_score}/100</div>
                        </div>
                        <div class="feature">
                            <div class="feature-label">Category</div>
                            <div class="feature-value">{category}</div>
                        </div>
                        <div class="feature">
                            <div class="feature-label">HTTPS</div>
                            <div class="feature-value">{"Yes" if scan_result.get('features', {}).get('has_https') else "No"}</div>
                        </div>
                        <div class="feature">
                            <div class="feature-label">SSL Valid</div>
                            <div class="feature-value">{"Yes" if scan_result.get('ssl_info', {}).get('valid') else "No"}</div>
                        </div>
                    </div>
                    
                    <div style="background: #111827; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #00d4ff; margin: 0 0 10px 0;">📋 Recommendations</h3>
                        <ul style="color: #94a3b8; margin: 0; padding-left: 20px;">
                            {"".join(f"<li>{rec}</li>" for rec in scan_result.get('recommendations', []))}
                        </ul>
                    </div>
                    
                    <a href="https://phishguard.ai/scan/{scan_result['id']}" class="button">
                        View Full Report
                    </a>
                    
                    <div class="footer">
                        <p>🛡️ PhishGuard AI - Advanced Phishing Detection Platform</p>
                        <p>This email was sent to {recipient_email} because you have alerts enabled.</p>
                        <p><a href="https://phishguard.ai/settings" style="color: #00d4ff;">Manage Email Preferences</a></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text fallback
            text_content = f"""
            PhishGuard AI - Security Alert
            
            Risk Score: {risk_score}/100
            Category: {category}
            URL: {url}
            
            Recommendations:
            {chr(10).join(f"- {rec}" for rec in scan_result.get('recommendations', []))}
            
            View Full Report: https://phishguard.ai/scan/{scan_result['id']}
            
            ---
            PhishGuard AI - Advanced Phishing Detection Platform
            """
            
            msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))
            
            with self._create_connection() as server:
                server.send_message(msg)
            
            return True, "Email sent successfully"
            
        except Exception as e:
            return False, str(e)
    
    def send_weekly_report(self, recipient_email, user_stats, top_threats):
        """Send weekly security report"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"📊 Weekly Security Report - {datetime.now().strftime('%B %d, %Y')}"
            msg['From'] = f"{self.sender_name} <{self.smtp_user}>"
            msg['To'] = recipient_email
            
            total_scans = user_stats.get('total', 0)
            threats_found = user_stats.get('suspicious', 0) + user_stats.get('high_risk', 0) + user_stats.get('phishing', 0)
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #0a0e1a; color: #e2e8f0; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; padding: 30px 0; }}
                    .stats-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }}
                    .stat-card {{ background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; }}
                    .stat-value {{ font-size: 32px; font-weight: bold; color: #00d4ff; }}
                    .stat-label {{ color: #94a3b8; font-size: 12px; margin-top: 5px; }}
                    .threat-list {{ background: #111827; border-radius: 12px; padding: 20px; margin: 20px 0; }}
                    .threat-item {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1e3a5f; }}
                    .threat-item:last-child {{ border-bottom: none; }}
                    .button {{ display: block; background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; text-align: center; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div style="font-size: 48px;">📊</div>
                        <h1 style="color: #00d4ff;">Weekly Security Report</h1>
                        <p style="color: #94a3b8;">{datetime.now().strftime('%B %d, %Y')}</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">{total_scans}</div>
                            <div class="stat-label">Total Scans</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color: #00ff88;">{user_stats.get('safe', 0)}</div>
                            <div class="stat-label">Safe URLs</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color: #ff3366;">{threats_found}</div>
                            <div class="stat-label">Threats Found</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color: #ffdd00;">{user_stats.get('average_risk_score', 0)}</div>
                            <div class="stat-label">Avg Risk Score</div>
                        </div>
                    </div>
                    
                    <div class="threat-list">
                        <h3 style="color: #ff3366; margin: 0 0 15px 0;">🚨 Top Threats This Week</h3>
                        {"".join(f'''
                        <div class="threat-item">
                            <span style="font-family: monospace; font-size: 12px; color: #94a3b8; word-break: break-all;">{t['url'][:50]}...</span>
                            <span style="color: {"#ff3366" if t['risk_score'] > 60 else "#ffdd00"}; font-weight: 600;">{t['risk_score']}</span>
                        </div>
                        ''' for t in top_threats[:5]) if top_threats else '<p style="color: #94a3b8;">No threats detected this week! 🎉</p>'}
                    </div>
                    
                    <a href="https://phishguard.ai/analytics" class="button">
                        View Detailed Analytics
                    </a>
                    
                    <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
                        <p>🛡️ PhishGuard AI - Keeping you safe online</p>
                        <p><a href="https://phishguard.ai/settings" style="color: #00d4ff;">Unsubscribe</a></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_content, 'html'))
            
            with self._create_connection() as server:
                server.send_message(msg)
            
            return True, "Weekly report sent"
            
        except Exception as e:
            return False, str(e)
    
    def send_domain_expiry_alert(self, recipient_email, domain_info):
        """Send domain expiry warning"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"⏰ Domain Expiry Alert: {domain_info['domain']}"
            msg['From'] = f"{self.sender_name} <{self.smtp_user}>"
            msg['To'] = recipient_email
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #0a0e1a; color: #e2e8f0; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .alert-box {{ background: rgba(255, 170, 0, 0.1); border: 1px solid rgba(255, 170, 0, 0.3); border-radius: 12px; padding: 20px; text-align: center; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="alert-box">
                        <div style="font-size: 48px;">⏰</div>
                        <h2 style="color: #ffaa00;">Domain Expiring Soon</h2>
                        <p style="font-size: 24px; color: #ffaa00; font-weight: bold;">{domain_info['domain']}</p>
                        <p style="color: #94a3b8;">Expires in {domain_info['days_until_expiry']} days</p>
                        <p style="color: #94a3b8;">Expiration Date: {domain_info['expiration_date']}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_content, 'html'))
            
            with self._create_connection() as server:
                server.send_message(msg)
            
            return True, "Domain expiry alert sent"
            
        except Exception as e:
            return False, str(e)
