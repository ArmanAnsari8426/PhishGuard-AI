"""
PhishGuard AI - PDF Report Generator
Generate professional PDF reports for scan results
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from datetime import datetime
import io
import base64

def generate_pdf_report(scan_data):
    """Generate PDF report from scan data"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    elements = []
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#00d4ff'),
        spaceAfter=30,
        alignment=1
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#00d4ff'),
        spaceAfter=12,
        spaceBefore=20
    )
    
    # Title
    elements.append(Paragraph("PhishGuard AI", title_style))
    elements.append(Paragraph("Phishing Detection Report", styles['Heading2']))
    elements.append(Spacer(1, 20))
    
    # Report metadata
    report_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    elements.append(Paragraph(f"<b>Report ID:</b> {scan_data.get('id', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Generated:</b> {report_date}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # URL Section
    elements.append(Paragraph("Target URL", heading_style))
    elements.append(Paragraph(f"<font color='#0066cc'>{scan_data.get('url', 'N/A')}</font>", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Risk Assessment
    elements.append(Paragraph("Risk Assessment", heading_style))
    risk_score = scan_data.get('risk_score', 0)
    category = scan_data.get('category', 'Unknown')
    
    risk_color = '#00ff88' if risk_score <= 20 else '#00d4ff' if risk_score <= 40 else '#ffdd00' if risk_score <= 60 else '#ffaa00' if risk_score <= 80 else '#ff3366'
    
    risk_data = [
        ['Risk Score', f"{risk_score}/100"],
        ['Category', category],
        ['Status', 'SAFE' if risk_score <= 40 else 'WARNING' if risk_score <= 60 else 'DANGEROUS']
    ]
    
    risk_table = Table(risk_data, colWidths=[2*inch, 3*inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    elements.append(risk_table)
    elements.append(Spacer(1, 20))
    
    # URL Analysis Features
    elements.append(Paragraph("URL Analysis Features", heading_style))
    features = scan_data.get('features', {})
    
    features_data = []
    feature_mapping = [
        ('url_length', 'URL Length'),
        ('dot_count', 'Dot Count'),
        ('hyphen_count', 'Hyphen Count'),
        ('has_at', 'Has @ Symbol'),
        ('has_https', 'HTTPS Available'),
        ('path_length', 'Path Length'),
        ('query_length', 'Query Length'),
        ('subdomain_count', 'Subdomain Count'),
        ('ip_address', 'IP Address'),
        ('tiny_url', 'Tiny URL'),
        ('has_port', 'Has Port'),
        ('suspicious_keywords', 'Suspicious Keywords'),
        ('brand_impersonation', 'Brand Impersonation')
    ]
    
    for key, label in feature_mapping:
        if key in features:
            value = features[key]
            if isinstance(value, bool):
                value = 'Yes' if value else 'No'
            features_data.append([label, str(value)])
    
    if features_data:
        features_table = Table(features_data, colWidths=[2.5*inch, 2.5*inch])
        features_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0e0e0')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(features_table)
        elements.append(Spacer(1, 20))
    
    # VirusTotal Intelligence
    elements.append(Paragraph("VirusTotal Intelligence", heading_style))
    vt = scan_data.get('virus_total', {})
    
    vt_data = [
        ['Reputation Score', f"{vt.get('reputation', 0)}/100"],
        ['Detections', f"{vt.get('detections', 0)}/{vt.get('total_engines', 0)}"],
        ['Status', 'Safe' if vt.get('detections', 0) == 0 else 'Flagged']
    ]
    
    vt_table = Table(vt_data, colWidths=[2*inch, 3*inch])
    vt_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    elements.append(vt_table)
    elements.append(Spacer(1, 20))
    
    # WHOIS Information
    elements.append(Paragraph("WHOIS Information", heading_style))
    whois = scan_data.get('whois', {})
    
    whois_data = [
        ['Registrar', str(whois.get('registrar', 'N/A'))],
        ['Creation Date', str(whois.get('creation_date', 'N/A'))],
        ['Expiration Date', str(whois.get('expiration_date', 'N/A'))],
        ['Country', str(whois.get('country', 'N/A'))]
    ]
    
    whois_table = Table(whois_data, colWidths=[2*inch, 3*inch])
    whois_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    elements.append(whois_table)
    elements.append(Spacer(1, 20))
    
    # SSL Certificate
    elements.append(Paragraph("SSL Certificate", heading_style))
    ssl_info = scan_data.get('ssl_info', {})
    
    ssl_data = [
        ['Valid', 'Yes' if ssl_info.get('valid') else 'No'],
        ['Issuer', str(ssl_info.get('issuer', 'N/A'))],
        ['Valid From', str(ssl_info.get('valid_from', 'N/A'))],
        ['Valid To', str(ssl_info.get('valid_to', 'N/A'))],
        ['Days Until Expiry', str(ssl_info.get('days_until_expiry', 'N/A'))]
    ]
    
    ssl_table = Table(ssl_data, colWidths=[2*inch, 3*inch])
    ssl_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    elements.append(ssl_table)
    elements.append(Spacer(1, 20))
    
    # Recommendations
    elements.append(Paragraph("Recommendations", heading_style))
    recommendations = scan_data.get('recommendations', [])
    
    for i, rec in enumerate(recommendations, 1):
        elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
    
    elements.append(Spacer(1, 30))
    
    # Footer
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("<i>Generated by PhishGuard AI - Advanced Phishing Detection Platform</i>", styles['Italic']))
    
    # Build PDF
    doc.build(elements)
    
    # Get PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    # Convert to base64
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
    
    return pdf_base64


def save_pdf_report(scan_data, filename):
    """Save PDF report to file"""
    pdf_base64 = generate_pdf_report(scan_data)
    pdf_bytes = base64.b64decode(pdf_base64)
    
    with open(filename, 'wb') as f:
        f.write(pdf_bytes)
    
    return filename
