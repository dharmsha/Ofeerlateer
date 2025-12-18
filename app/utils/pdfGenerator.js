import jsPDF from 'jspdf';

export const generatePDF = (formData, logoImage = null) => {
  const doc = new jsPDF();
  
  // Page settings
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Function to add header with logo to each page
  const addHeader = () => {
    // Add logo on left side if available - Better positioning
    if (logoImage) {
      try {
        // Get image format from data URL
        let imageFormat = 'PNG';
        if (logoImage.startsWith('data:image/jpeg') || logoImage.startsWith('data:image/jpg')) {
          imageFormat = 'JPEG';
        } else if (logoImage.startsWith('data:image/png')) {
          imageFormat = 'PNG';
        }
        
        // Add logo with better positioning - top left corner
        doc.addImage(logoImage, imageFormat, margin, 8, 35, 35); // Increased size and better position
        
        // Adjust company details to not overlap with logo
        const companyStartX = margin + 45; // Start company text after logo
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT.LTD', companyStartX, 15, { align: 'left' });
        
        doc.setFontSize(9); // Slightly smaller to fit better
        doc.setFont('helvetica', 'normal');
        doc.text('1 ST Floor, Siyaram Mention, ', companyStartX, 22, { align: 'left' });
        doc.text('opposite Telephone Exchange, Near P&M Mall ', companyStartX, 27, { align: 'left' });
        doc.text('Khurji, Patna, Bihar 800010', companyStartX, 32, { align: 'left' });
        doc.text('9973725719 support@creatorsmind.co.in', companyStartX, 37, { align: 'left' });
        doc.text('GSTIN: 10AAJCV6337M1Z2', companyStartX, 42, { align: 'left' });
        
      } catch (error) {
        console.log('Logo could not be added:', error);
        // Fallback to original header without logo
        addFallbackHeader();
      }
    } else {
      // Original header without logo
      addFallbackHeader();
    }
    
    doc.line(10, 50, pageWidth - 10, 50); // Moved line down to accommodate logo
    return 55; // Increased return position
  };

  // Fallback header when no logo or logo fails
  const addFallbackHeader = () => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS Pvt. Ltd', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('1 ST Floor, Siyaram Mention,opposite Telephone Exchange, Near P&M Mall ', pageWidth / 2, 22, { align: 'center' });
    doc.text('Khurji, Patna, Bihar 800024', pageWidth / 2, 27, { align: 'center' });
    doc.text(' 9973725719 support@creatorsmind.co.in', pageWidth / 2, 32, { align: 'center' });
    doc.text('GSTIN: 10A0CV6337M1Z2', pageWidth / 2, 37, { align: 'center' });
    
    doc.line(10, 42, pageWidth - 10, 42);
    return 45;
  };

  // Function to add text with proper line breaking
  const addText = (text, y, isBold = false) => {
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    return y + (lines.length * 7);
  };

  // Function to add section title
  const addSection = (title, y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin, y);
    return y + 10;
  };

  // ========== PAGE 1 ==========
  yPosition = addHeader();
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFER LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mr/Mrs. ${formData.name},`, margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'bold');
  doc.text(formData.name, margin, yPosition);
  yPosition += 7;
  doc.text(formData.designation, margin, yPosition);
  yPosition += 15;

  const page1Text = `Congratulations! for making a right decision and choosing Vats Creative Digital Solutions Private Limited. (Creators mind) as your employer.

We are pleased to welcome you at Vats Creative Digital Solutions as a part of ${formData.designation} Team as on ${formData.joiningDate} under the following mentioned terms –`;
  
  yPosition = addText(page1Text, yPosition);
  yPosition += 10;

  // Position Section
  yPosition = addSection('1. Position', yPosition);
  const positionText = `You will be employed at Vats Creative Digital Solutions under the position of ${formData.designation}, in addition to your usual duties, you will also perform, observe and conform to such directions and instructions assigned or communicated to you by Vats Creative Digital Solutions. As a member of an organization that practices flexibility and continuous improvement in work processes and practices, Vats Creative Digital Solutions may from time to time change your duties and responsibilities at its sole discretion.`;
  
  yPosition = addText(positionText, yPosition);

  // ========== PAGE 2 ==========
  doc.addPage();
  yPosition = addHeader();

  // Location Section
  yPosition = addSection('2.0 Location', yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  yPosition = addText('1.1 You will be based at the company\'s office in Patna, Bihar, India.', yPosition);
  yPosition += 5;

  const locationText = `1.2 Vats Creative Digital Solutions reserves the right to transfer you at any time to any other location in India or abroad, and/or to a branch office, subsidiary, affiliate Vats Creative Digital Solutions, department or establishment of Vats Creative Digital Solutions, whether in existence on the date of this letter or established or acquired later, provided that the terms and conditions of your employment set forth herein are not adversely affected by such transfer. Vats Creative Digital Solutions further reserves the right, subject to applicable laws, to transfer your employment to any other Vats Creative Digital Solutions or legal entity, as part of any transfer of relevant business of Vats Creative Digital Solutions or as part of any restructuring or amalgamation or re-organization plan implemented by Vats Creative Digital Solutions or by which Vats Creative Digital Solutions is bound.`;
  
  yPosition = addText(locationText, yPosition);

  // ========== PAGE 3 ==========
  doc.addPage();
  yPosition = addHeader();

  // Compensation and Benefits
  yPosition = addSection('2. Compensation and Benefits', yPosition);
  yPosition += 5;

  const compensationText1 = `3.1. Your gross compensation shall be as set out in Annexure A annexed hereto and will be subject to all statutory deductions that the company is required to make.`;
  yPosition = addText(compensationText1, yPosition);
  yPosition += 8;

  const compensationText2 = `3.2. You will be reimbursed for out-of-pocket expenses directly incurred in connection with the performance of your duties and responsibilities on behalf of Vats Creative Digital Solutions, as per company's Reimbursement Policy.`;
  yPosition = addText(compensationText2, yPosition);
  yPosition += 15;

  // Leave Section
  yPosition = addSection('3. Leave', yPosition);
  yPosition += 5;
  yPosition = addText('You will be entitled to paid leaves as per Vats Creative Digital Solutions\'s leave policy.', yPosition);
  yPosition += 15;

  // Working Hours Section
  yPosition = addSection('4. Working Hours', yPosition);
  yPosition += 5;
  const workingHoursText = `Your working hours will be 10:00 A.M. – 07:00 P.M. from Monday to Saturday. Your daily check-in and check-out time would be measured by Biometric machine in the office and attendance will be measured as per the Company's attendance policy.`;
  yPosition = addText(workingHoursText, yPosition);

  // ========== PAGE 4 ==========
  doc.addPage();
  yPosition = addHeader();

  // Notice Period Section
  yPosition = addSection('5. Notice Period', yPosition);
  yPosition += 5;

  const noticeText1 = `5.1 Under resignation from the services of Vats Creative Digital Solutions, you will have to serve a Notice Period of 15 working days from the date of resignation.`;
  yPosition = addText(noticeText1, yPosition);
  yPosition += 8;

  const noticeText2 = `5.2 During the Notice period, Company will hold onto your 15 days salary. Hence, the Company will hold onto your 15 days salary from the first month during the Notice Period. On successful completion of your Notice Period, the company will clear this amount on your last day of employment.`;
  yPosition = addText(noticeText2, yPosition);

  // ========== PAGE 5 ==========
  doc.addPage();
  yPosition = addHeader();

  const noticeText3 = `5.3 Your dues will be cleared on your last day of employment at Vats Creative Digital Solutions. In case of termination, this clause shall not be applicable. For termination of employment, please refer clause 7.`;
  yPosition = addText(noticeText3, yPosition);
  yPosition += 15;

  const noticeText4 = `5.4 During the probation period which is the first 6 months from the date of your joining, notice period would be of 15 days only from either party (Company OR Employee).`;
  yPosition = addText(noticeText4, yPosition);
  yPosition += 20;

  // Termination Section
  yPosition = addSection('6. Termination of Employment', yPosition);
  yPosition += 5;

  const terminationText1 = `7.1. Upon confirmation of your services, either party may terminate employment with Vats Creative Digital Solutions at any time by giving a notice period of a decided timeline at the time of confirmation in writing (or by paying equivalent Basic Salary in lieu thereof) and without assigning any reasons therefor. Notwithstanding the foregoing, if you (i) engage in misconduct related to Vats Creative Digital Solutions or your employment, including but not limited to any breach of the terms of this letter or (ii) are convicted for any criminal offence during the tenure of your service with Vats Creative Digital Solutions by a court of law, Vats Creative Digital Solutions may terminate your employment immediately, without any prior notice and without payment of any additional amounts. The termination will not affect the rights and remedies that Vats Creative Digital Solutions may have under any laws, rules and regulations for the time being in force.`;
  
  yPosition = addText(terminationText1, yPosition);

  // ========== PAGE 6 ==========
  doc.addPage();
  yPosition = addHeader();

  const terminationText2 = `7.2. Vats Creative Digital Solutions reserves the right to pay or recover the relevant amounts from you in lieu of notice. In the event you serve notice of termination, Vats Creative Digital Solutions may at its option, relieve you from the date as Vats Creative Digital Solutions may deem fit even before the expiration of the notice period without incurring any obligations to pay any amounts for the unexpired notice period.`;
  yPosition = addText(terminationText2, yPosition);
  yPosition += 15;

  const terminationText3 = `7.3. In the event, you serve notice of termination and you are in the middle of an assignment, Vats Creative Digital Solutions may require you to complete all operative parts of the assignment, before agreeing to relieve you from the services, even if such completion extends beyond the notice period. In such a case, Vats Creative Digital Solutions will pay you the salary on the existing terms and conditions up to the date of relieving you from Vats Creative Digital Solutions.`;
  yPosition = addText(terminationText3, yPosition);
  yPosition += 15;

  const terminationText4 = `7.4. Upon termination, you will immediately return to Vats Creative Digital Solutions any and all documents, manuals, data, records, confidential information, intellectual property, material, equipment and other property belonging to Vats Creative Digital Solutions that may be entrusted to and/or placed in your possession by virtue of and/or during the course of your employment with Vats Creative Digital Solutions, without making any copies thereof and/or extracts therefrom. You will also deliver to Vats Creative Digital Solutions immediately all notes, analysis, summaries and working papers relating thereto. Vats Creative Digital Solutions will settle your dues, if any, and issue a relieving letter to you on the last day of your employment.`;
  yPosition = addText(terminationText4, yPosition);

  // ========== PAGE 7 ==========
  doc.addPage();
  yPosition = addHeader();

  // Obligations Section
  yPosition = addSection('7. Obligations of Employee', yPosition);
  yPosition += 5;

  const obligationsText1 = `7.1 You will abide by all Company's rules, regulations, policies and procedures framed by Vats Creative Digital Solutions from time to time and applicable to your position, which rules, regulations, policies and procedures shall be deemed to be a part of this offer letter as if they are specifically incorporated in this offer letter.`;
  yPosition = addText(obligationsText1, yPosition);
  yPosition += 8;

  const obligationsText2 = `Such rules, regulations may include without limitation matters of attendance, conduct, behavior, discipline, working hours, leave, holidays and other applicable benefits. You will take steps to be aware of Company's rules, regulations, policies and procedures and ignorance of any of them shall not excuse any contravention of the terms of this letter.`;
  yPosition = addText(obligationsText2, yPosition);
  yPosition += 15;

  const obligationsText3 = `1.1 During the period of your employment with Vats Creative Digital Solutions, you will exclusively serve Vats Creative Digital Solutions.`;
  yPosition = addText(obligationsText3, yPosition);
  yPosition += 8;

  const obligationsText4 = `1.2 You will not engage or become interested, directly or indirectly, without prior written consent of Vats Creative Digital Solutions in that behalf, with or without remuneration, in any trade, business, occupation, employment, service or calling whatsoever nor will undertake any activities which are or will be contrary to or conflict with interests of Vats Creative Digital Solutions and/or your duties and obligations hereunder; and Shall perform your duties and responsibilities with diligence and devotion and shall direct your best efforts to promote the interests of Vats Creative Digital Solutions and its operations and all the activities to the extent permitted by law.`;
  yPosition = addText(obligationsText4, yPosition);

  // ========== PAGE 8 ==========
  doc.addPage();
  yPosition = addHeader();

  const obligationsText5 = `1.3 During the term of your employment with Vats Creative Digital Solutions and thereafter, you shall not (a) solicit for a competitor of Vats Creative Digital Solutions or attempt to gain the business of Vats Creative Digital Solutions for a competitor of Vats Creative Digital Solutions, or for yourself or any other purpose or reason, any customer of Vats Creative Digital Solutions that you solicited or served or about which you learned confidential information during your employment with Vats Creative Digital Solutions, or (b) solicit or encourage, or cause others to solicit or encourage, any employees or consultants, or collaborators of Vats Creative Digital Solutions to terminate their employment or engagement with Vats Creative Digital Solutions.`;
  yPosition = addText(obligationsText5, yPosition);
  yPosition += 20;

  // Miscellaneous Section
  yPosition = addSection('2. Miscellaneous', yPosition);
  yPosition += 5;

  const miscText1 = `2.1 This letter is governed by the laws of India. It is agreed that any disputes of whatsoever nature between you and Vats Creative Digital Solutions will be subject to the exclusive jurisdiction of the courts of Noida, India whether they be civil courts, labour courts, industrial tribunals, or any other courts or authority or whatsoever nature.`;
  yPosition = addText(miscText1, yPosition);
  yPosition += 15;

  const miscText2 = `2.2 The terms of this letter are strictly confidential between you and Vats Creative Digital Solutions and any breach of this confidence will be viewed with utmost seriousness and amount to misconduct.`;
  yPosition = addText(miscText2, yPosition);

  // ========== PAGE 9 ==========
  doc.addPage();
  yPosition = addHeader();

  const trainingText = `2.3 Your training period is stipulated to be 1 months. Your performance will be assessed by your supervisor after the 1 months and can be extended further based on your performance during the training period.`;
  yPosition = addText(trainingText, yPosition);
  yPosition += 15;

  const probationText = `9.3 During the probation period which is the first 6 months from the date of your joining, notice period would be of 1 week only from either party (Company OR Employee).`;
  yPosition = addText(probationText, yPosition);
  yPosition += 20;

  // Appraisal Section
  yPosition = addSection('3. Appraisal', yPosition);
  yPosition += 5;

  const appraisalText1 = `3.1 Your salary will be revised annually based on your performance.`;
  yPosition = addText(appraisalText1, yPosition);
  yPosition += 8;

  const appraisalText2 = `3.2 The company will review your performance every six months. You can gain one of the following ratings:`;
  yPosition = addText(appraisalText2, yPosition);
  yPosition += 8;

  doc.text('A - Excellent', margin + 10, yPosition);
  yPosition += 7;
  doc.text('B - Good', margin + 10, yPosition);
  yPosition += 7;
  doc.text('C - Average', margin + 10, yPosition);
  yPosition += 7;
  doc.text('D - Poor', margin + 10, yPosition);
  yPosition += 15;

  const appraisalText3 = `3.3 Your appraisal will be decided based upon the bands you have received in your performance review.`;
  yPosition = addText(appraisalText3, yPosition);

  // ========== PAGE 10 ==========
  doc.addPage();
  yPosition = addHeader();

  // Acknowledgement Section
  doc.setFont('helvetica', 'bold');
  doc.text('ACKNOWLEDGEMENT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  const acknowledgementText = `If the terms and conditions of this letter are acceptable to you, please confirm your acceptance to Vats Creative Digital Solutions within 2 days from the date of this letter.

We look forward to your contribution at Vats Creative Digital Solutions.

Yours sincerely,

For Vats Creative Digital Solutions Private Limited.`;
  
  yPosition = addText(acknowledgementText, yPosition);
  yPosition += 20;

  // Employee signature section
  doc.line(margin, yPosition, margin + 80, yPosition);
  yPosition += 10;
  doc.text(formData.name, margin, yPosition);
  yPosition += 7;
  doc.text(formData.designation, margin, yPosition);
  yPosition += 20;

  const finalText = `I confirm that I have read, understood and accept the terms of this offer letter and its attachments.  

Signature of the Employee  

Dated: ______  

Annexure A:

Your Cost to the Company (CTC) would be Rs. ${formData.ctc}/- per annum. Kindly refer to the attached Annexure I for detailed salary structure.`;
  
  yPosition = addText(finalText, yPosition);

  // Save the PDF
  doc.save(`Offer_Letter_${formData.name.replace(/\s+/g, '_')}.pdf`);
};