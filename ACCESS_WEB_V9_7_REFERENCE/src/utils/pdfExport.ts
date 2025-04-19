import jsPDF from 'jspdf';
import type { TestResult } from '../types';

export async function exportToPDF(results: TestResult) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yOffset = 20;

  // Add title and timestamp
  pdf.setFontSize(20);
  pdf.text('Accessibility Test Report', 20, yOffset);
  
  yOffset += 15;
  pdf.setFontSize(12);
  pdf.text(`URL: ${results.url}`, 20, yOffset);
  
  yOffset += 8;
  pdf.text(`Test Date: ${new Date(results.timestamp).toLocaleString()}`, 20, yOffset);

  // Add summary
  yOffset += 15;
  pdf.setFontSize(16);
  pdf.text('Summary', 20, yOffset);
  
  yOffset += 10;
  pdf.setFontSize(12);
  const summary = [
    `Critical Issues: ${results.summary.critical}`,
    `Serious Issues: ${results.summary.serious}`,
    `Moderate Issues: ${results.summary.moderate}`,
    `Minor Issues: ${results.summary.minor}`,
    `Passed Tests: ${results.summary.passes}`,
    `Warnings: ${results.summary.warnings}`
  ];

  summary.forEach(line => {
    pdf.text(line, 25, yOffset);
    yOffset += 7;
  });

  // Add issues section
  if (results.issues.length > 0) {
    yOffset += 10;
    pdf.setFontSize(16);
    pdf.text('Issues Found', 20, yOffset);
    
    results.issues.forEach(issue => {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      yOffset += 10;
      pdf.setFontSize(14);
      // Wrap long descriptions
      const description = pdf.splitTextToSize(issue.description, pageWidth - 40);
      pdf.text(description, 25, yOffset);
      yOffset += (description.length * 7);
      
      pdf.setFontSize(12);
      pdf.text(`Impact: ${issue.impact}`, 30, yOffset);
      
      if (issue.wcagCriteria?.length) {
        yOffset += 7;
        pdf.text(`WCAG Criteria: ${issue.wcagCriteria.join(', ')}`, 30, yOffset);
      }

      if (issue.nodes.length) {
        yOffset += 7;
        pdf.text('Affected Elements:', 30, yOffset);
        issue.nodes.forEach(node => {
          yOffset += 7;
          // Wrap long element paths
          const lines = pdf.splitTextToSize(`• ${node}`, pageWidth - 70);
          pdf.text(lines, 35, yOffset);
          yOffset += (lines.length - 1) * 7;
        });
      }

      yOffset += 10;
    });
  }

  // Generate filename from URL
  const urlForFilename = results.url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .slice(0, 50);
  
  // Save the PDF
  pdf.save(`accessibility-report-${urlForFilename}-${new Date().toISOString().split('T')[0]}.pdf`);
}