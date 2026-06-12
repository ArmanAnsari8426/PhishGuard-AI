import jsPDF from 'jspdf';
import type { ScanResult } from './urlAnalyzer';

export function generatePDF(result: ScanResult): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PhishGuard AI', 20, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Phishing Detection Report', 20, 38);
  
  // Report metadata
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(result.timestamp).toLocaleString()}`, pageWidth - 20, 20, { align: 'right' });
  doc.text(`Report ID: ${result.id}`, pageWidth - 20, 28, { align: 'right' });
  
  let y = 65;
  
  // URL Section
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Target URL', 20, y);
  y += 10;
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 5, pageWidth - 40, 12, 'F');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(result.url, 25, y + 2);
  y += 20;
  
  // Risk Score
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Assessment', 20, y);
  y += 10;
  
  const scoreColor = result.riskScore <= 20 ? [0, 255, 136] : 
                     result.riskScore <= 40 ? [0, 212, 255] :
                     result.riskScore <= 60 ? [255, 221, 0] :
                     result.riskScore <= 80 ? [255, 170, 0] : [255, 51, 102];
  
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(20, y - 5, 60, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.riskScore}`, 35, y + 12);
  doc.setFontSize(10);
  doc.text('/ 100', 55, y + 12);
  
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(result.category, 90, y + 8);
  y += 35;
  
  // Features
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.text('URL Analysis Features', 20, y);
  y += 10;
  
  const features = [
    ['URL Length', `${result.features.urlLength} characters`],
    ['Dot Count', `${result.features.dotCount}`],
    ['Hyphen Count', `${result.features.hyphenCount}`],
    ['Has @ Symbol', result.features.hasAtSymbol ? 'Yes' : 'No'],
    ['HTTPS Available', result.features.hasHTTPS ? 'Yes' : 'No'],
    ['SSL Valid', result.features.sslValid ? 'Yes' : 'No'],
    ['Domain Age', `${result.features.domainAge} days`],
    ['Domain Expiry', `${result.features.domainExpiry} days`],
    ['Subdomain Count', `${result.features.subdomainCount}`],
    ['Redirect Count', `${result.features.redirectCount}`],
    ['IP Address', result.features.ipAddress ? 'Yes' : 'No'],
    ['Has Port', result.features.hasPort ? 'Yes' : 'No'],
  ];
  
  doc.setFontSize(10);
  features.forEach(([label, value], i) => {
    const rowY = y + (i * 8);
    if (rowY > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, rowY);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 80, rowY);
  });
  y += features.length * 8 + 15;
  
  // VirusTotal
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VirusTotal Intelligence', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Reputation Score:', 20, y);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.virusTotal.reputation}/100`, 80, y);
  y += 8;
  
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Detections:', 20, y);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.virusTotal.detections}/${result.virusTotal.totalEngines} engines`, 80, y);
  y += 12;
  
  // WHOIS
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('WHOIS Information', 20, y);
  y += 10;
  
  const whoisData = [
    ['Registrar', result.whois.registrar],
    ['Created', result.whois.created],
    ['Expires', result.whois.expires],
    ['Updated', result.whois.updated],
    ['Country', result.whois.country],
  ];
  
  doc.setFontSize(10);
  whoisData.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 80, y);
    y += 8;
  });
  y += 10;
  
  // SSL
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SSL Certificate', 20, y);
  y += 10;
  
  const sslData = [
    ['Issuer', result.ssl.issuer],
    ['Valid From', result.ssl.validFrom],
    ['Valid To', result.ssl.validTo],
    ['Cipher', result.ssl.cipher],
    ['Protocol', result.ssl.protocol],
  ];
  
  doc.setFontSize(10);
  sslData.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 80, y);
    y += 8;
  });
  y += 15;
  
  // Recommendations
  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  result.recommendations.forEach((rec, i) => {
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - 50);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 4;
  });
  
  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(10, 14, 26);
    doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, 'F');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`PhishGuard AI - Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
  }
  
  return doc;
}

export function downloadPDF(result: ScanResult) {
  const doc = generatePDF(result);
  doc.save(`phishguard-report-${result.id}.pdf`);
}
