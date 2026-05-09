// app/utils/experienceLetterGenerator.ts
import { jsPDF } from 'jspdf';

export interface ExperienceLetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  lastWorkingDay: string;
  reasonForLeaving: string;
  achievements: string;
  skills: string;
  managerName: string;
  managerDesignation: string;
  authorizedBy: string;
  authorizedSignature: string;
  companyLogo?: string | null;
}

export function generateExperienceLetterPDF(data: ExperienceLetterData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Validate required data
      const requiredFields = [
        'companyName',
        'employeeName',
        'designation',
        'department',
        'dateOfJoining',
        'dateOfLeaving'
      ];

      for (const field of requiredFields) {
        if (!data[field as keyof ExperienceLetterData]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Current position tracker
      let currentY = margin;
      
      // 1. COMPANY HEADER (Professional Design like Salary Slip)
      // Company header background
      doc.setFillColor(41, 128, 185); // Blue background
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Add company logo on LEFT side
      let logoWidth = 0;
      if (data.companyLogo) {
        try {
          if (data.companyLogo.startsWith('data:image')) {
            // Logo on left side
            doc.addImage(data.companyLogo, 'PNG', margin, 10, 30, 25);
            logoWidth = 40; // Space taken by logo
          }
        } catch (error) {
          console.warn('Logo could not be added:', error);
        }
      }
      
      // Company Name (Centered)
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD', pageWidth / 2, 20, { align: 'center' });
      
      // Company Details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall', 
               pageWidth / 2, 28, { align: 'center' });
      doc.text('GSTIN: 10AAJCV6337M1Z2 | Phone: 9973725719 | Email: hr@creatorsmind.co.in', 
               pageWidth / 2, 34, { align: 'center' });
      
      // 2. DOCUMENT TITLE SECTION
      currentY = 55;
      const titleY = currentY;
      
      // Title box with background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, titleY, contentWidth, 20, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, titleY, contentWidth, 20, 'S');
      
      // Document Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 51, 51);
      doc.text('EXPERIENCE CERTIFICATE', pageWidth / 2, titleY + 8, { align: 'center' });
      
      // Document subtitle
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`For the period of ${data.dateOfJoining} to ${data.dateOfLeaving}`, 
               pageWidth / 2, titleY + 15, { align: 'center' });
      
      currentY = titleY + 25;
      
      // 3. EMPLOYEE DETAILS SECTION (Two Columns Format)
      const empY = currentY;
      
      // Section Title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('EMPLOYEE DETAILS', margin + 5, empY + 5);
      
      // Employee Details Box
      const empBoxY = empY + 10;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(margin, empBoxY, contentWidth, 40, 'FD');
      
      // Details in 2 columns - EXACT SAME FORMAT AS SALARY SLIP
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      
      // Column positions
      const col1X = margin + 10;
      const col2X = margin + contentWidth / 2;
      let detailY = empBoxY + 10;
      
      // Row 1
      doc.text(`Name: ${data.employeeName}`, col1X, detailY);
      doc.text(`Employee ID: ${data.employeeId}`, col2X, detailY);
      
      // Row 2
      detailY += 7;
      doc.text(`Designation: ${data.designation}`, col1X, detailY);
      doc.text(`Department: ${data.department}`, col2X, detailY);
      
      // Row 3
      detailY += 7;
      doc.text(`Date of Joining: ${data.dateOfJoining}`, col1X, detailY);
      doc.text(`Date of Leaving: ${data.dateOfLeaving}`, col2X, detailY);
      
      // Row 4
      detailY += 7;
      doc.text(`Last Working Day: ${data.lastWorkingDay}`, col1X, detailY);
      if (data.reasonForLeaving) {
        doc.text(`Reason for Leaving: ${data.reasonForLeaving}`, col2X, detailY);
      }
      
      currentY = empBoxY + 45;
      
      // 4. REFERENCE AND DATE
      const refY = currentY;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      const refNumber = `Ref No.: EXP/${data.employeeId}/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      doc.text(refNumber, margin, refY);
      
      const formattedDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      doc.text(`Date: ${formattedDate}`, pageWidth - margin, refY, { align: 'right' });
      
      currentY = refY + 10;
      
      // 5. MAIN CONTENT SECTION
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      
      // Salutation
      doc.text('To Whom It May Concern,', margin, currentY);
      currentY += 10;
      
      // Paragraph 1
      const para1 = `This is to certify that ${data.employeeName} (Employee ID: ${data.employeeId}) was employed with ${data.companyName} as a ${data.designation} in the ${data.department} department.`;
      const para1Lines = splitTextIntoLines(doc, para1, contentWidth);
      para1Lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      currentY += 3;
      
      // Paragraph 2
      const para2 = `${data.employeeName.split(' ')[0]} served our organization from ${data.dateOfJoining} to ${data.dateOfLeaving}.`;
      const para2Lines = splitTextIntoLines(doc, para2, contentWidth);
      para2Lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      currentY += 3;
      
      // Reason for leaving if provided
      if (data.reasonForLeaving) {
        const para3 = `The reason for leaving is ${data.reasonForLeaving}.`;
        const para3Lines = splitTextIntoLines(doc, para3, contentWidth);
        para3Lines.forEach(line => {
          doc.text(line, margin, currentY);
          currentY += 5;
        });
        currentY += 3;
      }
      
      currentY += 5;
      
      // 6. ACHIEVEMENTS SECTION
      if (data.achievements && data.achievements.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.text('Key Achievements & Contributions:', margin, currentY);
        currentY += 7;
        
        doc.setFont('helvetica', 'normal');
        const achievements = data.achievements.split('\n').filter(a => a.trim());
        achievements.forEach((achievement, index) => {
          const bullet = '•';
          const text = achievement.trim();
          const maxWidth = contentWidth - 10;
          const lines = splitTextIntoLines(doc, text, maxWidth);
          
          lines.forEach((line, lineIndex) => {
            const prefix = lineIndex === 0 ? `${bullet} ` : '  ';
            doc.text(prefix + line, margin + 5, currentY);
            currentY += 5;
          });
          
          if (index < achievements.length - 1) {
            currentY += 2;
          }
        });
        
        currentY += 5;
      }
      
      // 7. SKILLS SECTION
      if (data.skills && data.skills.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.text('Skills Demonstrated:', margin, currentY);
        currentY += 7;
        
        doc.setFont('helvetica', 'normal');
        const skills = data.skills.split(',').map(s => s.trim()).filter(s => s);
        
        // Simple listing instead of badges for better PDF compatibility
        const skillsText = skills.join(', ');
        const skillsLines = splitTextIntoLines(doc, skillsText, contentWidth);
        skillsLines.forEach(line => {
          doc.text(line, margin, currentY);
          currentY += 5;
        });
        
        currentY += 5;
      }
      
      // 8. CLOSING PARAGRAPHS
      currentY += 5;
      
      const closing1 = `During the employment period, ${data.employeeName.split(' ')[0]} demonstrated excellent professional conduct and performed duties with utmost sincerity and dedication.`;
      const closing1Lines = splitTextIntoLines(doc, closing1, contentWidth);
      closing1Lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      
      currentY += 3;
      
      const closing2 = `We wish ${data.employeeName.split(' ')[0]} all the very best for future endeavors and are confident that the skills and experience gained here will be valuable in all future pursuits.`;
      const closing2Lines = splitTextIntoLines(doc, closing2, contentWidth);
      closing2Lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      
      currentY += 3;
      
      const closing3 = `This certificate is issued upon request and without any obligation on the part of ${data.companyName}.`;
      const closing3Lines = splitTextIntoLines(doc, closing3, contentWidth);
      closing3Lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      
      currentY += 10;
      
      // 9. SIGNATURE SECTION
      // Check if we need new page
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = margin;
      }
      
      // Left signature (Manager)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(41, 128, 185);
      doc.text('Sincerely,', margin, currentY);
      
      doc.setFontSize(12);
      doc.text(data.managerName, margin, currentY + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(data.managerDesignation, margin, currentY + 16);
      doc.text(data.companyName, margin, currentY + 22);
      
      // Signature line
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY + 28, margin + 70, currentY + 28);
      doc.setFontSize(8);
      doc.text('Signature', margin + 25, currentY + 32);
      
      // Right signature (Authorized)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(41, 128, 185);
      doc.text('Authorized By:', pageWidth - margin - 70, currentY);
      
      doc.setFontSize(12);
      doc.text(data.authorizedBy, pageWidth - margin - 70, currentY + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Authorized Signatory', pageWidth - margin - 70, currentY + 16);
      doc.text(data.companyName, pageWidth - margin - 70, currentY + 22);
      
      // Signature line
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(pageWidth - margin - 70, currentY + 28, pageWidth - margin, currentY + 28);
      doc.setFontSize(8);
      doc.text('Signature & Stamp', pageWidth - margin - 55, currentY + 32);
      
      // 10. FOOTER
      const footerY = pageHeight - 20;
      
      // Footer separator
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      
      doc.text(
        'This is a computer generated document and does not require physical signature.',
        pageWidth / 2,
        footerY - 5,
        { align: 'center' }
      );
      
      doc.text(
        'For verification, please contact HR Department | Email: hr@vatscreative.com | Phone: 9973725719',
        pageWidth / 2,
        footerY,
        { align: 'center' }
      );
      
      // Save the PDF
      const fileName = `Experience_Letter_${data.employeeName.replace(/\s+/g, '_')}_${data.employeeId}.pdf`;
      doc.save(fileName);
      
      resolve(true);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  });
}

// Helper function to split text into lines
function splitTextIntoLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  try {
    return doc.splitTextToSize(text, maxWidth);
  } catch (error) {
    // Fallback to simple splitting
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
}

// Enhanced templates with better formatting
export const experienceTemplates = {
  softwareEngineer: {
    name: "Software Engineer",
    achievements: `• Successfully led development of 3 major features
• Improved application performance by 40%
• Mentored 2 junior developers
• Received 'Employee of the Quarter' award
• Implemented CI/CD pipeline reducing deployment time by 70%`,
    skills: "React, Next.js, TypeScript, Node.js, MongoDB, AWS, Docker, Git, Agile Methodologies, REST APIs"
  },
  
  seniorDeveloper: {
    name: "Senior Developer",
    achievements: `• Led a team of 5 developers on critical projects
• Architected scalable solutions serving 100K+ users
• Reduced system latency by 60%
• Implemented best practices improving code quality
• Trained junior team members on advanced concepts`,
    skills: "System Design, Microservices, Cloud Architecture, DevOps, Database Optimization, Team Leadership"
  },
  
  teamLead: {
    name: "Team Lead",
    achievements: `• Managed team of 8 developers
• Successfully delivered 12 projects on time
• Improved team productivity by 45%
• Implemented Agile methodologies
• Maintained 95% client satisfaction rate`,
    skills: "Project Management, Agile/Scrum, Team Building, Client Communication, Risk Management"
  }
};

// Generate sample data for testing
export function generateSampleData(): ExperienceLetterData {
  const joiningDate = new Date();
  joiningDate.setFullYear(joiningDate.getFullYear() - 2);
  
  const leavingDate = new Date();
  
  return {
    companyName: "VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD",
    companyAddress: "1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall",
    employeeName: "Rahul Sharma",
    employeeId: "CM12",
    designation: "Senior Software Engineer",
    department: "Engineering",
    dateOfJoining: joiningDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    dateOfLeaving: leavingDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    lastWorkingDay: leavingDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    reasonForLeaving: "Career growth opportunity and personal development",
    achievements: experienceTemplates.seniorDeveloper.achievements,
    skills: experienceTemplates.seniorDeveloper.skills,
    managerName: "Priya Verma",
    managerDesignation: "Engineering Manager",
    authorizedBy: "Amit Khanna",
    authorizedSignature: "A. Khanna",
    companyLogo: null
  };
}

// Test function
export function testExperienceLetter() {
  const sampleData = generateSampleData();
  return generateExperienceLetterPDF(sampleData);
}