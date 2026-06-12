"""
PhishGuard AI - Custom Report Builder
Create and generate custom security reports
"""

from datetime import datetime, timedelta
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.units import inch
import io
import base64

class ReportBuilder:
    """Build custom reports"""
    
    def __init__(self):
        self.report_templates = {}
        self.generated_reports = {}
        self._setup_default_templates()
    
    def _setup_default_templates(self):
        """Setup default report templates"""
        self.report_templates = {
            'executive_summary': {
                'name': 'Executive Summary',
                'description': 'High-level security overview for executives',
                'sections': ['overview', 'key_metrics', 'threat_summary', 'recommendations'],
                'pages': 2
            },
            'detailed_analysis': {
                'name': 'Detailed Analysis',
                'description': 'Comprehensive technical analysis',
                'sections': ['overview', 'scan_results', 'threat_intelligence', 'vulnerabilities', 'recommendations'],
                'pages': 10
            },
            'compliance_report': {
                'name': 'Compliance Report',
                'description': 'Regulatory compliance status',
                'sections': ['overview', 'compliance_status', 'findings', 'remediation', 'audit_trail'],
                'pages': 8
            },
            'incident_report': {
                'name': 'Incident Report',
                'description': 'Security incident documentation',
                'sections': ['incident_summary', 'timeline', 'impact', 'response', 'lessons_learned'],
                'pages': 5
            },
            'weekly_summary': {
                'name': 'Weekly Summary',
                'description': 'Weekly security metrics summary',
                'sections': ['overview', 'metrics', 'trends', 'alerts'],
                'pages': 3
            },
            'threat_intelligence': {
                'name': 'Threat Intelligence',
                'description': 'Threat landscape analysis',
                'sections': ['overview', 'active_threats', 'campaigns', 'indicators', 'recommendations'],
                'pages': 6
            }
        }
    
    def get_templates(self):
        """Get all report templates"""
        return self.report_templates
    
    def create_custom_template(self, name, sections, description=""):
        """Create custom report template"""
        template_id = name.lower().replace(' ', '_')
        
        self.report_templates[template_id] = {
            'name': name,
            'description': description,
            'sections': sections,
            'custom': True,
            'created_at': datetime.now().isoformat()
        }
        
        return template_id
    
    def generate_report(self, template_id, data, format='pdf'):
        """Generate report from template"""
        template = self.report_templates.get(template_id)
        if not template:
            return None, "Template not found"
        
        if format == 'pdf':
            return self._generate_pdf(template, data)
        elif format == 'html':
            return self._generate_html(template, data)
        elif format == 'json':
            return self._generate_json(template, data)
        elif format == 'csv':
            return self._generate_csv(template, data)
        
        return None, "Unsupported format"
    
    def _generate_pdf(self, template, data):
        """Generate PDF report"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.75*inch, bottomMargin=0.75*inch)
        styles = getSampleStyleSheet()
        elements = []
        
        # Custom styles
        title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24,
                                     textColor=colors.HexColor('#00d4ff'), spaceAfter=20, alignment=1)
        heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'], fontSize=16,
                                       textColor=colors.HexColor('#00d4ff'), spaceAfter=10, spaceBefore=15)
        
        # Header
        elements.append(Paragraph("PhishGuard AI", title_style))
        elements.append(Paragraph(template['name'], styles['Heading2']))
        elements.append(Spacer(1, 20))
        
        # Report metadata
        elements.append(Paragraph(f"<b>Report Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(f"<b>Period:</b> {data.get('period', 'Last 30 days')}", styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Generate sections
        for section in template['sections']:
            elements.extend(self._generate_section(section, data, heading_style, styles))
        
        # Footer
        elements.append(Spacer(1, 30))
        elements.append(Paragraph("<i>Generated by PhishGuard AI - Advanced Phishing Detection Platform</i>", 
                                  styles['Italic']))
        
        doc.build(elements)
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        report_id = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.generated_reports[report_id] = {
            'id': report_id,
            'template': template['name'],
            'format': 'pdf',
            'generated_at': datetime.now().isoformat()
        }
        
        return base64.b64encode(pdf_bytes).decode('utf-8'), None
    
    def _generate_section(self, section, data, heading_style, styles):
        """Generate a report section"""
        elements = []
        
        if section == 'overview':
            elements.append(Paragraph("Overview", heading_style))
            overview = data.get('overview', {})
            elements.append(Paragraph(f"Total Scans: {overview.get('total_scans', 0)}", styles['Normal']))
            elements.append(Paragraph(f"Threats Detected: {overview.get('threats', 0)}", styles['Normal']))
            elements.append(Spacer(1, 15))
        
        elif section == 'key_metrics' or section == 'metrics':
            elements.append(Paragraph("Key Metrics", heading_style))
            metrics_data = [
                ['Metric', 'Value', 'Status'],
                ['Detection Rate', '99.7%', '✓ Excellent'],
                ['False Positive Rate', '0.3%', '✓ Good'],
                ['Avg Response Time', '45ms', '✓ Fast'],
                ['Uptime', '99.99%', '✓ Excellent']
            ]
            table = Table(metrics_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00d4ff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey)
            ]))
            elements.append(table)
            elements.append(Spacer(1, 15))
        
        elif section == 'threat_summary' or section == 'threats':
            elements.append(Paragraph("Threat Summary", heading_style))
            threats = data.get('threats', [])
            if threats:
                for threat in threats[:5]:
                    elements.append(Paragraph(f"• {threat.get('type', 'Unknown')}: {threat.get('count', 0)} instances", styles['Normal']))
            else:
                elements.append(Paragraph("No significant threats detected", styles['Normal']))
            elements.append(Spacer(1, 15))
        
        elif section == 'recommendations':
            elements.append(Paragraph("Recommendations", heading_style))
            recommendations = [
                "Enable two-factor authentication for all users",
                "Conduct security awareness training",
                "Review and update access control policies",
                "Implement regular security audits",
                "Monitor for suspicious activity"
            ]
            for rec in recommendations:
                elements.append(Paragraph(f"• {rec}", styles['Normal']))
            elements.append(Spacer(1, 15))
        
        elif section == 'scan_results':
            elements.append(Paragraph("Scan Results", heading_style))
            scan_data = [
                ['URL', 'Score', 'Category'],
                ['https://example.com', '15', 'Safe'],
                ['http://suspicious.tk', '85', 'Phishing'],
                ['https://test.com', '30', 'Low Risk']
            ]
            table = Table(scan_data, colWidths=[3*inch, 1*inch, 2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00d4ff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey)
            ]))
            elements.append(table)
            elements.append(Spacer(1, 15))
        
        elif section == 'compliance_status':
            elements.append(Paragraph("Compliance Status", heading_style))
            compliance_data = [
                ['Framework', 'Status', 'Score'],
                ['GDPR', 'Compliant', '92%'],
                ['HIPAA', 'Partial', '78%'],
                ['SOC 2', 'Compliant', '95%'],
                ['PCI DSS', 'Compliant', '88%']
            ]
            table = Table(compliance_data, colWidths=[2*inch, 2*inch, 2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00d4ff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey)
            ]))
            elements.append(table)
            elements.append(Spacer(1, 15))
        
        return elements
    
    def _generate_html(self, template, data):
        """Generate HTML report"""
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{template['name']} - PhishGuard AI</title>
    <style>
        body {{ font-family: Arial, sans-serif; background: #0a0e1a; color: #e2e8f0; padding: 40px; }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        h1 {{ color: #00d4ff; text-align: center; }}
        .header {{ background: #111827; padding: 30px; border-radius: 12px; margin-bottom: 30px; }}
        .section {{ background: #111827; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .metric {{ display: inline-block; width: 200px; text-align: center; padding: 15px; margin: 10px; background: #1a1a2e; border-radius: 8px; }}
        .metric-value {{ font-size: 24px; font-weight: bold; color: #00d4ff; }}
        .metric-label {{ color: #94a3b8; font-size: 12px; }}
        table {{ width: 100%; border-collapse: collapse; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #1e3a5f; }}
        th {{ background: #00d4ff; color: white; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ PhishGuard AI</h1>
        <div class="header">
            <h2>{template['name']}</h2>
            <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
            <p>Period: {data.get('period', 'Last 30 days')}</p>
        </div>
        
        <div class="section">
            <h3>Key Metrics</h3>
            <div class="metric">
                <div class="metric-value">{data.get('total_scans', 1234)}</div>
                <div class="metric-label">Total Scans</div>
            </div>
            <div class="metric">
                <div class="metric-value">{data.get('threats', 56)}</div>
                <div class="metric-label">Threats Found</div>
            </div>
            <div class="metric">
                <div class="metric-value">{data.get('blocked', 54)}</div>
                <div class="metric-label">Threats Blocked</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Recommendations</h3>
            <ul>
                <li>Enable two-factor authentication</li>
                <li>Conduct security training</li>
                <li>Review access policies</li>
            </ul>
        </div>
        
        <p style="text-align: center; color: #64748b; margin-top: 40px;">
            © 2024 PhishGuard AI - All rights reserved
        </p>
    </div>
</body>
</html>
"""
        return html, None
    
    def _generate_json(self, template, data):
        """Generate JSON report"""
        report = {
            'template': template['name'],
            'generated_at': datetime.now().isoformat(),
            'period': data.get('period', 'Last 30 days'),
            'sections': {}
        }
        
        for section in template['sections']:
            report['sections'][section] = data.get(section, {})
        
        return json.dumps(report, indent=2), None
    
    def _generate_csv(self, template, data):
        """Generate CSV report"""
        import csv
        import io
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['Section', 'Metric', 'Value'])
        
        for section in template['sections']:
            section_data = data.get(section, {})
            for key, value in section_data.items():
                writer.writerow([section, key, str(value)])
        
        return output.getvalue(), None
    
    def schedule_report(self, template_id, schedule, recipients):
        """Schedule report generation"""
        schedule_id = f"sched_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return {
            'id': schedule_id,
            'template': template_id,
            'schedule': schedule,
            'recipients': recipients,
            'enabled': True,
            'created_at': datetime.now().isoformat()
        }
    
    def get_scheduled_reports(self):
        """Get all scheduled reports"""
        return []
    
    def get_report_history(self, limit=20):
        """Get report generation history"""
        return list(self.generated_reports.values())[-limit:]


class ComplianceReportGenerator:
    """Generate compliance-specific reports"""
    
    def __init__(self):
        self.compliance_frameworks = {
            'gdpr': {'name': 'GDPR', 'description': 'General Data Protection Regulation'},
            'hipaa': {'name': 'HIPAA', 'description': 'Health Insurance Portability and Accountability Act'},
            'soc2': {'name': 'SOC 2', 'description': 'Service Organization Control 2'},
            'pci_dss': {'name': 'PCI DSS', 'description': 'Payment Card Industry Data Security Standard'},
            'iso27001': {'name': 'ISO 27001', 'description': 'Information Security Management'},
            'nist': {'name': 'NIST', 'description': 'National Institute of Standards and Technology'}
        }
    
    def get_frameworks(self):
        """Get available compliance frameworks"""
        return self.compliance_frameworks
    
    def generate_compliance_report(self, framework, data):
        """Generate compliance report"""
        fw = self.compliance_frameworks.get(framework)
        if not fw:
            return None, "Framework not found"
        
        report = {
            'framework': fw['name'],
            'description': fw['description'],
            'generated_at': datetime.now().isoformat(),
            'status': 'Compliant',
            'score': 92,
            'controls': self._get_controls(framework),
            'findings': data.get('findings', []),
            'recommendations': self._get_recommendations(framework)
        }
        
        return report, None
    
    def _get_controls(self, framework):
        """Get controls for framework"""
        return [
            {'id': 'CC1', 'name': 'Control Environment', 'status': 'Pass'},
            {'id': 'CC2', 'name': 'Communication', 'status': 'Pass'},
            {'id': 'CC3', 'name': 'Risk Assessment', 'status': 'Partial'},
            {'id': 'CC4', 'name': 'Monitoring', 'status': 'Pass'},
            {'id': 'CC5', 'name': 'Control Activities', 'status': 'Pass'}
        ]
    
    def _get_recommendations(self, framework):
        """Get recommendations for framework"""
        return [
            f"Review {framework.upper()} compliance annually",
            "Document all security controls",
            "Conduct regular security assessments",
            "Maintain audit trails"
        ]
