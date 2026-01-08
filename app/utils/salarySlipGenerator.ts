// app/utils/salarySlipGenerator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the types properly
declare global {
  interface jsPDFWithPlugin extends jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable?: {
      finalY: number;
    };
  }
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
    const doc = new jsPDF() as jsPDFWithPlugin;
    
    // Add company logo if exists
    if (data.companyLogo) {
      try {
        doc.addImage(data.companyLogo, 'PNG', 15, 15, 40, 40);
      } catch (error) {
        console.warn('Could not add logo:', error);
      }
    }
    
    // Company Info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS Pvt. Ltd', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('1 ST Floor, Siyaram Mention,opposite Telephone Exchange, Near P&M Mall ', 105, 32, { align: 'center' });
    doc.text('GSTIN: 10A0CV6337M1Z2', 105, 37, { align: 'center' });
    doc.text('9973725719 support@creatorsmind.co.in', 105, 42, { align: 'center' });
    
    // Salary Slip Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', 105, 55, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`For the month of ${data.month}`, 105, 62, { align: 'center' });
    
    // Employee Details Box
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 70, 180, 30, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYEE DETAILS', 20, 78);
    
    doc.setFont('helvetica', 'normal');
    let yPos = 85;
    const col1 = 20;
    const col3 = 100;
    
    doc.text(`Name: ${data.employee.employeeName}`, col1, yPos);
    doc.text(`Employee ID: ${data.employee.employeeId}`, col3, yPos);
    
    yPos += 6;
    doc.text(`Designation: ${data.employee.designation}`, col1, yPos);
    doc.text(`Department: ${data.employee.department}`, col3, yPos);
    
    yPos += 6;
    doc.text(`Bank: ${data.employee.bankName}`, col1, yPos);
    doc.text(`Account No: ${data.employee.accountNumber}`, col3, yPos);
    
    yPos += 6;
    doc.text(`IFSC Code: ${data.employee.ifscCode}`, col1, yPos);
    doc.text(`PAN: ${data.employee.panNumber}`, col3, yPos);
    
    // Earnings Table
    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 20, yPos);
    
    const earnings = data.salary.components.filter(c => c.type === 'earning');
    const earningsData = earnings.map(earning => [
      earning.name,
      earning.isPercentage ? `${(earning.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `₹${earning.amount.toLocaleString('en-IN')}`
    ]);
    
    earningsData.push(['Total Earnings', '', `₹${data.salary.totalEarnings.toLocaleString('en-IN')}`]);
    
    // Use autoTable function directly
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Particulars', 'Percentage', 'Amount (₹)']],
      body: earningsData,
      theme: 'grid',
      headStyles: { 
        fillColor: [46, 125, 50],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        textColor: [0, 0, 0]
      },
      margin: { left: 15, right: 15 }
    });
    
    // Deductions Table
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 50;
    doc.setFont('helvetica', 'bold');
    doc.text('DEDUCTIONS', 20, finalY);
    
    const deductions = data.salary.components.filter(c => c.type === 'deduction');
    const deductionsData = deductions.map(deduction => [
      deduction.name,
      deduction.isPercentage ? `${(deduction.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `₹${deduction.amount.toLocaleString('en-IN')}`
    ]);
    
    deductionsData.push(['Total Deductions', '', `₹${data.salary.totalDeductions.toLocaleString('en-IN')}`]);
    
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Particulars', 'Percentage', 'Amount (₹)']],
      body: deductionsData,
      theme: 'grid',
      headStyles: { 
        fillColor: [198, 40, 40],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        textColor: [0, 0, 0]
      },
      margin: { left: 15, right: 15 }
    });
    
    // Net Salary Summary
    const netSalaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : finalY + 50;
    doc.setFillColor(220, 237, 200);
    doc.rect(15, netSalaryY, 180, 20, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('NET SALARY PAYABLE:', 25, netSalaryY + 8);
    doc.text(`₹${data.salary.netSalary.toLocaleString('en-IN')}`, 160, netSalaryY + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`(In words: ${numberToWords(data.salary.netSalary)})`, 25, netSalaryY + 15);
    
    // Footer
    const footerY = netSalaryY + 30;
    doc.setFontSize(8);
    doc.text('This is a computer generated document and does not require signature.', 105, footerY, { align: 'center' });
    
    doc.text('For any queries, contact HR Department at hr@techcorp.com', 105, footerY + 5, { align: 'center' });
    
    // Save the PDF
    doc.save(`Salary_Slip_${data.employee.employeeName.replace(/\s+/g, '_')}_${data.month.replace(/\s+/g, '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating salary slip PDF:', error);
    
    // Fallback: Create a simple PDF without tables
    try {
      const simpleDoc = new jsPDF();
      simpleDoc.text('Salary Slip', 20, 20);
      simpleDoc.text(`Employee: ${data.employee.employeeName}`, 20, 30);
      simpleDoc.text(`Month: ${data.month}`, 20, 40);
      simpleDoc.text(`Net Salary: ₹${data.salary.netSalary}`, 20, 50);
      simpleDoc.save(`Salary_Slip_${data.employee.employeeName}_${data.month}.pdf`);
    } catch (fallbackError) {
      console.error('Fallback PDF generation also failed:', fallbackError);
    }
    
    return false;
  }
}

// Helper function for number to words
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convert(num: number): string {
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convert(num % 100) : '');
    if (num < 100000) {
      return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + convert(num % 1000) : '');
    }
    if (num < 10000000) {
      return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + convert(num % 100000) : '');
    }
    return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + convert(num % 10000000) : '');
  }
  
  return convert(Math.floor(num)) + ' Rupees Only';
}