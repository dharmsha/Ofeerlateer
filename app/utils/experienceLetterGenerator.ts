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

interface Position {
  x: number;
  y: number;
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

      // Initialize PDF with error handling
      let doc: jsPDF;
      try {
        doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
      } catch (error) {
        throw new Error('Failed to initialize PDF document');
      }
      
      // Set document properties
      doc.setProperties({
        title: `Experience Letter - ${data.employeeName}`,
        subject: 'Experience Certificate',
        author: data.companyName,
        keywords: 'experience, letter, certificate, employment',
        creator: 'Professional Doc Generator'
      });
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add subtle background color
      doc.setFillColor(250, 250, 252);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Draw border
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
      
      // Current position tracker
      let currentY = margin;
      
      // Header Section
      const renderHeader = () => {
        // Add company logo if exists and valid
        if (data.companyLogo) {
          try {
            // Basic validation for logo
            if (data.companyLogo.startsWith('data:image')) {
              doc.addImage(data.companyLogo, 'PNG', margin, currentY, 40, 20);
              currentY += 25;
            }
          } catch (error) {
            console.warn('Logo could not be added:', error);
          }
        }
        
        // Company Name
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138); // Blue-900
        const companyNameX = data.companyLogo ? margin + 45 : margin;
        doc.text(data.companyName.toUpperCase(), companyNameX, currentY);
        
        // Company Address
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // Slate-600
        const addressLines = splitTextIntoLines(doc, data.companyAddress, contentWidth - (data.companyLogo ? 45 : 0));
        addressLines.forEach((line, index) => {
          doc.text(line, companyNameX, currentY + 8 + (index * 5));
        });
        
        currentY += addressLines.length * 5 + 15;
        
        // Decorative line
        doc.setDrawColor(59, 130, 246); // Blue-500
        doc.setLineWidth(1);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      };
      
      renderHeader();
      
      // Title Section
      const renderTitle = () => {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text('EXPERIENCE CERTIFICATE', pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
        
        // Title underline
        doc.setDrawColor(99, 102, 241); // Indigo-500
        doc.setLineWidth(0.8);
        doc.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
        currentY += 15;
      };
      
      renderTitle();
      
      // Reference and Date
      const renderReference = () => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        
        const refNumber = `Ref: EXP/${data.employeeId}/${new Date().getFullYear()}`;
        doc.text(refNumber, margin, currentY);
        
        const formattedDate = new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        doc.text(`Date: ${formattedDate}`, pageWidth - margin, currentY, { align: 'right' });
        
        currentY += 12;
      };
      
      renderReference();
      
      // Employee Info Table
      const renderEmployeeInfo = () => {
        const infoData = [
          ['Employee Name', data.employeeName],
          ['Employee ID', data.employeeId],
          ['Designation', data.designation],
          ['Department', data.department],
          ['Date of Joining', data.dateOfJoining],
          ['Date of Leaving', data.dateOfLeaving],
          ['Last Working Day', data.lastWorkingDay]
        ];
        
        // Draw table background
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, contentWidth, infoData.length * 8 + 10, 'F');
        
        // Draw table border
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.rect(margin, currentY, contentWidth, infoData.length * 8 + 10);
        
        // Add table header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138);
        doc.text('EMPLOYEE INFORMATION', pageWidth / 2, currentY + 7, { align: 'center' });
        currentY += 12;
        
        // Draw table rows
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        infoData.forEach(([label, value], index) => {
          const yPos = currentY + (index * 8);
          
          // Draw row separator
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.2);
          doc.line(margin, yPos, pageWidth - margin, yPos);
          
          // Label (bold)
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text(`${label}:`, margin + 5, yPos + 6);
          
          // Value
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          const maxValueWidth = contentWidth - 60;
          const valueLines = splitTextIntoLines(doc, value, maxValueWidth);
          
          valueLines.forEach((line, lineIndex) => {
            doc.text(line, margin + 50, yPos + 6 + (lineIndex * 5));
          });
          
          if (valueLines.length > 1) {
            currentY += (valueLines.length - 1) * 5;
          }
        });
        
        currentY += infoData.length * 8 + 10;
      };
      
      renderEmployeeInfo();
      
      // Content Section
      const renderContent = () => {
        // Salutation
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text('To Whom It May Concern,', margin, currentY);
        currentY += 10;
        
        // Main content paragraphs
        const paragraphs = [
          `This is to certify that ${data.employeeName} (Employee ID: ${data.employeeId}) was employed with ${data.companyName} as a ${data.designation} in the ${data.department} department.`,
          `${data.employeeName.split(' ')[0]} served our organization from ${data.dateOfJoining} to ${data.dateOfLeaving}. The last working day was ${data.lastWorkingDay}.`,
          data.reasonForLeaving ? `The reason for leaving is ${data.reasonForLeaving}.` : null,
          '',
          'During the tenure, the following contributions were made:',
          ''
        ].filter(p => p !== null);
        
        paragraphs.forEach(paragraph => {
          if (paragraph === '') {
            currentY += 5;
            return;
          }
          
          const lines = splitTextIntoLines(doc, paragraph, contentWidth);
          lines.forEach(line => {
            doc.text(line, margin, currentY);
            currentY += 5;
          });
          currentY += 3;
        });
        
        // Achievements
        if (data.achievements.trim()) {
          doc.setFont('helvetica', 'bold');
          doc.text('Key Achievements:', margin, currentY);
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
        
        // Skills
        if (data.skills.trim()) {
          doc.setFont('helvetica', 'bold');
          doc.text('Skills Demonstrated:', margin, currentY);
          currentY += 7;
          
          doc.setFont('helvetica', 'normal');
          const skills = data.skills.split(',').map(s => s.trim()).filter(s => s);
          const skillsPerLine = 3;
          const skillWidth = contentWidth / skillsPerLine - 5;
          
          for (let i = 0; i < skills.length; i += skillsPerLine) {
            const lineSkills = skills.slice(i, i + skillsPerLine);
            let xPos = margin;
            
            lineSkills.forEach(skill => {
              // Draw skill badge
              doc.setFillColor(239, 246, 255);
              doc.setDrawColor(59, 130, 246);
              doc.roundedRect(xPos, currentY - 4, skillWidth, 6, 2, 2, 'F');
              doc.roundedRect(xPos, currentY - 4, skillWidth, 6, 2, 2, 'S');
              
              // Skill text
              doc.setFontSize(8);
              doc.setTextColor(30, 64, 175);
              const skillText = truncateText(doc, skill, skillWidth - 6);
              doc.text(skillText, xPos + 3, currentY);
              doc.setFontSize(10);
              doc.setTextColor(15, 23, 42);
              
              xPos += skillWidth + 5;
            });
            
            currentY += 8;
          }
          
          currentY += 5;
        }
        
        // Closing paragraphs
        const closingParagraphs = [
          '',
          `During the employment period, ${data.employeeName.split(' ')[0]} demonstrated excellent professional conduct and performed duties with utmost sincerity and dedication.`,
          '',
          `We wish ${data.employeeName.split(' ')[0]} all the very best for future endeavors and are confident that the skills and experience gained here will be valuable in all future pursuits.`,
          '',
          `This certificate is issued upon request and without any obligation on the part of ${data.companyName}.`
        ];
        
        closingParagraphs.forEach(paragraph => {
          if (paragraph === '') {
            currentY += 5;
            return;
          }
          
          const lines = splitTextIntoLines(doc, paragraph, contentWidth);
          lines.forEach(line => {
            doc.text(line, margin, currentY);
            currentY += 5;
          });
        });
      };
      
      renderContent();
      
      // Ensure we have enough space for signature section
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = margin;
      } else {
        currentY += 15;
      }
      
      // Signature Section
      const renderSignature = () => {
        // Left signature (Manager)
        const leftSignatureY = currentY;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138);
        doc.text('Sincerely,', margin, leftSignatureY);
        
        doc.setFontSize(12);
        doc.text(data.managerName, margin, leftSignatureY + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(data.managerDesignation, margin, leftSignatureY + 16);
        doc.text(data.companyName, margin, leftSignatureY + 22);
        
        // Signature line
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.3);
        doc.line(margin, leftSignatureY + 28, margin + 70, leftSignatureY + 28);
        doc.setFontSize(8);
        doc.text('Signature', margin + 25, leftSignatureY + 32);
        
        // Right signature (Authorized)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138);
        doc.text('Authorized By:', pageWidth - margin - 70, leftSignatureY);
        
        doc.setFontSize(12);
        doc.text(data.authorizedBy, pageWidth - margin - 70, leftSignatureY + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('Authorized Signatory', pageWidth - margin - 70, leftSignatureY + 16);
        doc.text(data.companyName, pageWidth - margin - 70, leftSignatureY + 22);
        
        // Signature line
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.3);
        doc.line(pageWidth - margin - 70, leftSignatureY + 28, pageWidth - margin, leftSignatureY + 28);
        doc.setFontSize(8);
        doc.text('Signature & Stamp', pageWidth - margin - 55, leftSignatureY + 32);
        
        currentY = leftSignatureY + 40;
      };
      
      renderSignature();
      
      // Footer
      const renderFooter = () => {
        const footerY = pageHeight - 20;
        
        // Footer separator
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        
        doc.text(
          'This is a computer generated document and does not require physical signature.',
          pageWidth / 2,
          footerY - 5,
          { align: 'center' }
        );
        
        doc.text(
          'For verification, please contact HR Department',
          pageWidth / 2,
          footerY,
          { align: 'center' }
        );
        
        // Page number
        doc.text(
          'Page 1 of 1',
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      };
      
      renderFooter();
      
      // Save the PDF
      const fileName = `Experience_Letter_${data.employeeName.replace(/\s+/g, '_')}_${data.employeeId}.pdf`
        .replace(/[^\w\s.-]/gi, '') // Remove special characters
        .slice(0, 100); // Limit filename length
      
      try {
        doc.save(fileName);
        resolve(true);
      } catch (error) {
        throw new Error('Failed to save PDF file');
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error instanceof Error ? error : new Error('Unknown error occurred'));
      return false;
    }
  });
}

// Helper function to split text into lines
function splitTextIntoLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  try {
    return doc.splitTextToSize(text, maxWidth);
  } catch (error) {
    // Fallback to simple splitting if jsPDF fails
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

// Helper function to truncate text to fit width
function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) {
    return text;
  }
  
  let truncated = text;
  while (truncated.length > 3 && doc.getTextWidth(truncated + '...') > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  
  return truncated + '...';
}

// Enhanced templates with better formatting
export const experienceTemplates = {
  softwareEngineer: {
    name: "Software Engineer",
    achievements: "• Successfully led development of 3 major features\n• Improved application performance by 40%\n• Mentored 2 junior developers\n• Received 'Employee of the Quarter' award\n• Implemented CI/CD pipeline reducing deployment time by 70%",
    skills: "React, Next.js, TypeScript, Node.js, MongoDB, AWS, Docker, Git, Agile Methodologies, REST APIs"
  },
  
  marketingManager: {
    name: "Marketing Manager",
    achievements: "• Increased brand awareness by 60%\n• Generated ₹50L+ in revenue through campaigns\n• Built team of 5 marketing professionals\n• Won 'Best Campaign' award 2023\n• Reduced customer acquisition cost by 30%",
    skills: "Digital Marketing, SEO, Social Media Management, Content Strategy, Google Analytics, Team Leadership, Budget Management"
  },
  
  salesExecutive: {
    name: "Sales Executive",
    achievements: "• Exceeded sales targets by 150% for 3 consecutive quarters\n• Acquired 50+ new enterprise clients\n• Maintained 95% client retention rate\n• Top performer in North region\n• Generated ₹2Cr+ in annual revenue",
    skills: "Sales Strategy, Client Relationship Management, Negotiation, CRM Software, Market Analysis, Presentation Skills"
  },
  
  projectManager: {
    name: "Project Manager",
    achievements: "• Successfully delivered 8 projects on time and under budget\n• Managed team of 12 developers\n• Improved project delivery efficiency by 35%\n• Reduced project risks by implementing new processes\n• Maintained 98% client satisfaction rate",
    skills: "Project Management, Agile/Scrum, Risk Management, Stakeholder Communication, JIRA, Team Leadership"
  },
  
  hrManager: {
    name: "HR Manager",
    achievements: "• Reduced employee turnover by 25%\n• Implemented new HRMS system\n• Conducted 50+ successful recruitments\n• Improved employee satisfaction score from 75% to 92%\n• Developed new training programs",
    skills: "Talent Acquisition, Employee Relations, Performance Management, HR Policies, Training & Development, Compliance"
  }
};

// Validation function for data
export function validateExperienceLetterData(data: Partial<ExperienceLetterData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const requiredFields: (keyof ExperienceLetterData)[] = [
    'companyName',
    'employeeName',
    'employeeId',
    'designation',
    'department',
    'dateOfJoining',
    'dateOfLeaving',
    'lastWorkingDay',
    'managerName',
    'managerDesignation',
    'authorizedBy'
  ];

  requiredFields.forEach(field => {
    if (!data[field] || String(data[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Date validation
  if (data.dateOfJoining && data.dateOfLeaving) {
    const joiningDate = new Date(data.dateOfJoining);
    const leavingDate = new Date(data.dateOfLeaving);
    
    if (joiningDate > leavingDate) {
      errors.push('Date of joining cannot be after date of leaving');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate sample data for testing
export function generateSampleData(): ExperienceLetterData {
  const joiningDate = new Date();
  joiningDate.setFullYear(joiningDate.getFullYear() - 2);
  
  const leavingDate = new Date();
  
  return {
    companyName: "VATS CREATIVE DIGITAL SOLUTIONS Pvt. Ltd",
    companyAddress: "",
    employeeName: "Rahul Sharma",
    employeeId: "TS2021-045",
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
    reasonForLeaving: "Career growth opportunity",
    achievements: experienceTemplates.softwareEngineer.achievements,
    skills: experienceTemplates.softwareEngineer.skills,
    managerName: "Priya Verma",
    managerDesignation: "Engineering Manager",
    authorizedBy: "Amit Khanna",
    authorizedSignature: "A. Khanna",
    companyLogo: null
  };
}

// Preview function (returns data URL instead of downloading)
export async function previewExperienceLetterPDF(data: ExperienceLetterData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const clonedData = { ...data };
      const tempDoc = new jsPDF();
      
      // Similar generation logic but return data URL
      // ... (Same generation logic as above but without doc.save())
      
      tempDoc.text('Experience Letter Preview', 20, 20);
      tempDoc.text(`Name: ${clonedData.employeeName}`, 20, 30);
      tempDoc.text(`Designation: ${clonedData.designation}`, 20, 40);
      
      const dataUrl = tempDoc.output('dataurlstring');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}