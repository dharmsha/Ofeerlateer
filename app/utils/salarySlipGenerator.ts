// app/utils/salarySlipGenerator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the types properly
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export interface SalarySlipData {
  month: string;
  employee: {
    employeeName: string;
    employeeId: string;
    designation: string;
    department: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    panNumber: string;
  };
  salary: {
    basicSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
    components: Array<{
      type: 'earning' | 'deduction';
      name: string;
      amount: number;
      isPercentage: boolean;
      percentageOf?: string;
    }>;
  };
  companyLogo?: string | null;
}

export function generateSalarySlipPDF(data: SalarySlipData) {
  try {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Page setup
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    const centerX = pageWidth / 2;
    
    // Professional colors
    const colors = {
      primary: [41, 128, 185] as [number, number, number],    // Blue
      secondary: [46, 125, 50] as [number, number, number],   // Green
      accent: [198, 40, 40] as [number, number, number],      // Red
      lightGray: [250, 250, 250] as [number, number, number],
      darkGray: [51, 51, 51] as [number, number, number],
      white: [255, 255, 255] as [number, number, number]
    };
    
    // 1. COMPANY HEADER
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Company Logo
    if (data.companyLogo) {
      try {
        doc.addImage(data.companyLogo, 'PNG', margin, 10, 30, 25);
      } catch (error) {
        console.warn('Logo error:', error);
      }
    }
    
    // Company Name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD', centerX, 20, { align: 'center' });
    
    // Company Details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall', 
             centerX, 28, { align: 'center' });
    doc.text('GSTIN: 10A0CV6337M1Z2 | Phone: 9973725719 | Email: support@creatorsmind.co.in', 
             centerX, 34, { align: 'center' });
    
    // 2. SALARY SLIP TITLE
    const titleY = 50;
    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.rect(margin, titleY, contentWidth, 20, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, titleY, contentWidth, 20, 'S');
    
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', centerX, titleY + 8, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`For the month of ${data.month.toUpperCase()}`, centerX, titleY + 15, { align: 'center' });
    
    // 3. EMPLOYEE DETAILS SECTION - EXACT FORMAT
    const empY = titleY + 25;
    
    // Section Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('EMPLOYEE DETAILS', margin + 5, empY + 5);
    
    // Employee Details Box
    const empBoxY = empY + 10;
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, empBoxY, contentWidth, 35, 'FD');
    
    // Details in 2 columns - EXACT FORMAT जैसा आप चाहते हैं
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    
    // Column positions
    const col1X = margin + 10;
    const col2X = margin + contentWidth / 2;
    let currentY = empBoxY + 10;
    
    // Row 1
    doc.text(`Name: ${data.employee.employeeName}`, col1X, currentY);
    doc.text(`Employee ID: ${data.employee.employeeId}`, col2X, currentY);
    
    // Row 2
    currentY += 7;
    doc.text(`Designation: ${data.employee.designation}`, col1X, currentY);
    doc.text(`Department: ${data.employee.department}`, col2X, currentY);
    
    // Row 3
    currentY += 7;
    doc.text(`Bank: ${data.employee.bankName}`, col1X, currentY);
    doc.text(`Account No: ${data.employee.accountNumber}`, col2X, currentY);
    
    // Row 4
    currentY += 7;
    doc.text(`IFSC Code: ${data.employee.ifscCode}`, col1X, currentY);
    doc.text(`PAN: ${data.employee.panNumber}`, col2X, currentY);
    
    // 4. EARNINGS SECTION
    const earningsY = empBoxY + 40;
    
    // Earnings Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('EARNINGS', margin + 5, earningsY);
    
    // Earnings Table Data - NOW USING "Rs." INSTEAD OF "₹"
    const earnings = data.salary.components.filter(c => c.type === 'earning');
    const earningsData = earnings.map(earning => [
      earning.name,
      earning.isPercentage ? `${(earning.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `Rs. ${formatIndianNumber(earning.amount)}`
    ]);
    
    // Add Total Earnings row with "Rs."
    earningsData.push(['Total Earnings', '', `Rs. ${formatIndianNumber(data.salary.totalEarnings)}`]);
    
    // Generate Table
    autoTable(doc, {
      startY: earningsY + 5,
      head: [['Particulars', 'Percentage', 'Amount']],
      body: earningsData,
      theme: 'grid',
      headStyles: { 
        fillColor: colors.secondary,
        textColor: colors.white,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        fontSize: 9, 
        cellPadding: 3,
        textColor: colors.darkGray,
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin },
      styles: {
        overflow: 'linebreak',
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      }
    });
    
    // 5. DEDUCTIONS SECTION
    const deductionsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : earningsY + 50;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text('DEDUCTIONS', margin + 5, deductionsY);
    
    const deductions = data.salary.components.filter(c => c.type === 'deduction');
    const deductionsData = deductions.map(deduction => [
      deduction.name,
      deduction.isPercentage ? `${(deduction.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `Rs. ${formatIndianNumber(deduction.amount)}`
    ]);
    
    deductionsData.push(['Total Deductions', '', `Rs. ${formatIndianNumber(data.salary.totalDeductions)}`]);
    
    autoTable(doc, {
      startY: deductionsY + 5,
      head: [['Particulars', 'Percentage', 'Amount']],
      body: deductionsData,
      theme: 'grid',
      headStyles: { 
        fillColor: colors.accent,
        textColor: colors.white,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        fontSize: 9, 
        cellPadding: 3,
        textColor: colors.darkGray,
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin },
      styles: {
        overflow: 'linebreak',
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      }
    });
    
    // 6. NET SALARY SECTION
    const netSalaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : deductionsY + 50;
    
    // Background for net salary
    doc.setFillColor(220, 237, 200);
    doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setLineWidth(1);
    doc.rect(margin, netSalaryY, contentWidth, 25, 'FD');
    
    // Net Salary Text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.text('NET SALARY PAYABLE:', margin + 10, netSalaryY + 10);
    
    // Net Salary Amount with "Rs."
    doc.setFontSize(16);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(`Rs. ${formatIndianNumber(data.salary.netSalary)}`, 
             margin + contentWidth - 10, netSalaryY + 10, { align: 'right' });
    
    // Amount in Words
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.text(`(In words: ${numberToWords(data.salary.netSalary)})`, 
             margin + 10, netSalaryY + 20);
    
    // 7. FOOTER
    const footerY = netSalaryY + 35;
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, margin + contentWidth, footerY);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    doc.text('This is a computer generated document and does not require signature.', 
             centerX, footerY + 6, { align: 'center' });
    
    doc.text('For any queries, contact HR Department at hr@vatscreative.com', 
             centerX, footerY + 12, { align: 'center' });
    
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 
             centerX, footerY + 18, { align: 'center' });
    
    // 8. SAVE PDF
    const fileName = `Salary_Slip_${data.employee.employeeName.replace(/\s+/g, '_')}_${data.month.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    console.log('✅ PDF generated successfully with Rs. symbol!');
    return true;
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    
    // Fallback simple PDF with "Rs."
    try {
      const simpleDoc = new jsPDF();
      simpleDoc.setFontSize(16);
      simpleDoc.setFont('helvetica', 'bold');
      simpleDoc.text('SALARY SLIP', 20, 20);
      
      simpleDoc.setFontSize(12);
      simpleDoc.setFont('helvetica', 'normal');
      simpleDoc.text(`Employee: ${data.employee.employeeName}`, 20, 40);
      simpleDoc.text(`Month: ${data.month}`, 20, 50);
      simpleDoc.text(`Net Salary: Rs. ${formatIndianNumber(data.salary.netSalary)}`, 20, 60);
      
      simpleDoc.save(`Salary_Slip_${data.employee.employeeName}_${data.month}.pdf`);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
    }
    
    return false;
  }
}

// Helper function to format Indian number with commas
function formatIndianNumber(amount: number): string {
  // Format in Indian style: 1,00,000.00
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Improved number to words function
function numberToWords(num: number): string {
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  if (rupees === 0 && paise === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convert(n: number): string {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 100000) {
      const thousand = Math.floor(n / 1000);
      const remainder = n % 1000;
      return convert(thousand) + ' Thousand' + (remainder !== 0 ? ' ' + convert(remainder) : '');
    }
    if (n < 10000000) {
      const lakh = Math.floor(n / 100000);
      const remainder = n % 100000;
      return convert(lakh) + ' Lakh' + (remainder !== 0 ? ' ' + convert(remainder) : '');
    }
    const crore = Math.floor(n / 10000000);
    const remainder = n % 10000000;
    return convert(crore) + ' Crore' + (remainder !== 0 ? ' ' + convert(remainder) : '');
  }
  
  let result = '';
  
  if (rupees > 0) {
    result = convert(rupees) + ' Rupee' + (rupees === 1 ? '' : 's');
  }
  
  if (paise > 0) {
    if (rupees > 0) result += ' and ';
    result += convert(paise) + ' Paise';
  }
  
  return result + ' Only';
}

// Test function
export function testSalarySlip() {
  const testData: SalarySlipData = {
    month: "March 2024",
    employee: {
      employeeName: "Dharm Kumar",
      employeeId: "CM12",
      designation: "Senior Developer",
      department: "Engineering",
      bankName: "HDFC Bank",
      accountNumber: "XXXXXX1234",
      ifscCode: "HDFC0001234",
      panNumber: "ABCDE1234F"
    },
    salary: {
      basicSalary: 60000,
      totalEarnings: 101000, // 60,000 + 24,000 + 12,000 + 5,000
      totalDeductions: 15000, // 7,200 + 200 + 7,600
      netSalary: 86000, // 101,000 - 15,000
      components: [
        { type: 'earning', name: 'Basic Salary', amount: 60000, isPercentage: false },
        { type: 'earning', name: 'House Rent Allowance', amount: 24000, isPercentage: false },
        { type: 'earning', name: 'Dearness Allowance', amount: 12000, isPercentage: false },
        { type: 'earning', name: 'Other Allowances', amount: 5000, isPercentage: false },
        { type: 'deduction', name: 'Provident Fund', amount: 7200, isPercentage: true },
        { type: 'deduction', name: 'Professional Tax', amount: 200, isPercentage: false },
        { type: 'deduction', name: 'TDS', amount: 7600, isPercentage: false },
      ]
    },
    companyLogo: null
  };
  
  return generateSalarySlipPDF(testData);
}