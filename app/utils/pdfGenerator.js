import jsPDF from 'jspdf';

export const generatePDF = (formData, logoImage = null) => {
  const doc = new jsPDF();
  
  // Page settings
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Function to add header with logo
  const addHeader = () => {
    if (logoImage) {
      try {
        let imageFormat = 'PNG';
        if (logoImage.startsWith('data:image/jpeg') || logoImage.startsWith('data:image/jpg')) {
          imageFormat = 'JPEG';
        } else if (logoImage.startsWith('data:image/png')) {
          imageFormat = 'PNG';
        }
        
        doc.addImage(logoImage, imageFormat, margin, 8, 30, 30);
        
        const companyStartX = margin + 38;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', companyStartX, 18);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('1st Floor, Siyaram Mention, Opp. Telephone Exchange, Near P&M Mall', companyStartX, 25);
        doc.text('Khurji, Patna, Bihar – 800024', companyStartX, 30);
        doc.text(' 9973725719 |  hr@creatorsmind.co.in', companyStartX, 35);
        doc.text('GSTIN: 10AAJCV6337M1Z2', companyStartX, 40);
      } catch (error) {
        console.log('Logo error:', error);
        addFallbackHeader();
      }
    } else {
      addFallbackHeader();
    }
    
    doc.line(10, 48, pageWidth - 10, 48);
    return 58;
  };

  const addFallbackHeader = () => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('1st Floor, Siyaram Mention, Opp. Telephone Exchange, Near P&M Mall', pageWidth / 2, 25, { align: 'center' });
    doc.text('Khurji, Patna, Bihar – 800024', pageWidth / 2, 30, { align: 'center' });
    doc.text(' 9973725719 | ✉ hr@creatorsmind.co.in', pageWidth / 2, 35, { align: 'center' });
    doc.text('GSTIN: 10AAJCV6337M1Z2', pageWidth / 2, 40, { align: 'center' });
    doc.line(10, 48, pageWidth - 10, 48);
    return 58;
  };

  const addText = (text, y, isBold = false, fontSize = 10) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    return y + (lines.length * 6);
  };

  // Start building PDF
  yPosition = addHeader();
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFER LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  const today = new Date().toLocaleDateString('en-GB');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${today}`, margin, yPosition);
  yPosition += 12;

  // To
  doc.text(`To,`, margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(`${formData.name}`, margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.designation}`, margin, yPosition);
  yPosition += 12;

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.text(`Subject: Offer of Employment`, margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  // Letter body
  yPosition = addText(`Dear ${formData.name},`, yPosition, false, 10);
  yPosition += 5;

  yPosition = addText(`We are pleased to offer you the position of "${formData.designation}" at VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD. We believe your skills and experience will be a valuable addition to our organization.`, yPosition, false, 10);
  yPosition += 8;

  // Terms section
  doc.setFont('helvetica', 'bold');
  doc.text('Terms of Employment:', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');

  const terms = [
  `1. Date of Joining: ${formData.joiningDate}`,
  `2. Annual CTC: Rs. ${formData.ctc} per annum`,
  `3. Reporting Manager: ${formData.reportingManager}`,
  `4. Work Location: ${formData.workLocation}`,
  `5. Probation Period: 3 months`,
  `6. Notice Period: 15 working days`,
  `7. Working Hours: 10:00 AM - 7:00 PM (Tuesday to Sunday)`,
  `8. Leave Policy: As per company policy`
];

  terms.forEach(term => {
    yPosition = addText(term, yPosition, false, 9);
    yPosition += 4;
  });

  yPosition += 8;

  yPosition = addText(`Your appointment will be subject to the rules and regulations of the company as amended from time to time. During the probation period, your performance will be reviewed, and upon successful completion, you will be confirmed in service.`, yPosition, false, 9);
  yPosition += 8;

  yPosition = addText(`Please confirm your acceptance of this offer by signing the duplicate copy of this letter and returning it to us within 2 days.`, yPosition, false, 9);
  yPosition += 15;

  // Signature section
  doc.setFont('helvetica', 'bold');
  doc.text('For VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', margin, yPosition);
  yPosition += 15;
  
  doc.line(margin, yPosition, margin + 60, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Rani Shreya', margin, yPosition);
  yPosition += 5;
  doc.setFontSize(8);
  doc.text('HR Manager', margin, yPosition);
  yPosition += 15;

  // Check if we need a new page for acceptance section
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Employee acceptance
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Acceptance:', margin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`I, ${formData.name}, accept the terms and conditions of this offer letter.`, margin, yPosition);
  yPosition += 15;
  
  doc.line(margin, yPosition, margin + 70, yPosition);
  yPosition += 6;
  doc.setFontSize(9);
  doc.text('Signature', margin, yPosition);
  yPosition += 10;
  
  doc.line(margin + 80, yPosition - 10, margin + 150, yPosition - 10);
  doc.text('Date', margin + 80, yPosition - 2);

  // Save the PDF
  doc.save(`Offer_Letter_${formData.name.replace(/\s+/g, '_')}.pdf`);
};