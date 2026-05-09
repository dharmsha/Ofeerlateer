// app/utils/salarySlipGenerator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export interface AttendanceData {
  presentDays: number;
  absentDays: number;
  totalWorkingDays: number;
  lateDays: number;
  halfDays: number;
  leaves: {
    casualLeave: number;
    sickLeave: number;
    paidLeave: number;
    unpaidLeave: number;
  };
}

export interface SalarySlipData {
  month: string;
  year: string;
  employee: {
    employeeName: string;
    employeeId: string;
    designation: string;
    department: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    panNumber: string;
    uanNumber?: string;
    esiNumber?: string;
    joiningDate?: string;
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
  attendance: AttendanceData;
  companyLogo?: string | null;
  digitalSignature?: {
    image: string;
    name: string;
    designation: string;
  } | null;
}

export function generateSalarySlipPDF(data: SalarySlipData) {
  try {
    console.log("📄 Generating PDF with attendance:", data.attendance);
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    const centerX = pageWidth / 2;
    
    const colors = {
      primary: [41, 128, 185],
      secondary: [46, 125, 50],
      accent: [198, 40, 40],
      warning: [245, 124, 0],
      lightGray: [250, 250, 250],
      darkGray: [51, 51, 51],
      white: [255, 255, 255]
    };
    
    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    if (data.companyLogo) {
      try {
        doc.addImage(data.companyLogo, 'PNG', margin, 8, 35, 29);
      } catch (error) {}
    }
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', centerX, 18, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall', centerX, 26, { align: 'center' });
    doc.text('GSTIN: 10AAJCV6337M1Z2 | Phone: 9973725719 | Email: hr@creatorsmind.co.in', centerX, 32, { align: 'center' });
    
    // Title
    const titleY = 50;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, titleY, contentWidth, 20, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, titleY, contentWidth, 20, 'S');
    
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', centerX, titleY + 8, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`For the month of ${data.month.toUpperCase()} ${data.year}`, centerX, titleY + 15, { align: 'center' });
    
    // EMPLOYEE DETAILS
    const empY = titleY + 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('EMPLOYEE DETAILS', margin + 5, empY + 5);
    
    const empBoxY = empY + 10;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, empBoxY, contentWidth, 45, 'FD');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    
    const col1X = margin + 10;
    const col2X = margin + contentWidth / 3;
    const col3X = margin + (2 * contentWidth / 3);
    let currentY = empBoxY + 10;
    
    doc.text(`Name: ${data.employee.employeeName}`, col1X, currentY);
    doc.text(`Employee ID: ${data.employee.employeeId}`, col2X, currentY);
    doc.text(`Joining Date: ${data.employee.joiningDate || 'N/A'}`, col3X, currentY);
    
    currentY += 7;
    doc.text(`Designation: ${data.employee.designation}`, col1X, currentY);
    doc.text(`Department: ${data.employee.department}`, col2X, currentY);
    doc.text(`UAN: ${data.employee.uanNumber || 'N/A'}`, col3X, currentY);
    
    currentY += 7;
    doc.text(`Bank: ${data.employee.bankName}`, col1X, currentY);
    doc.text(`Account No: ${data.employee.accountNumber}`, col2X, currentY);
    doc.text(`ESI No: ${data.employee.esiNumber || 'N/A'}`, col3X, currentY);
    
    currentY += 7;
    doc.text(`IFSC Code: ${data.employee.ifscCode}`, col1X, currentY);
    doc.text(`PAN: ${data.employee.panNumber}`, col2X, currentY);
    
    // ATTENDANCE SUMMARY SECTION
    const attendanceY = empBoxY + 50;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 124, 0);
    doc.text('ATTENDANCE SUMMARY', margin + 5, attendanceY + 5);
    
    const attendanceBoxY = attendanceY + 10;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, attendanceBoxY, contentWidth, 45, 'FD');
    
    const att = data.attendance;
    const totalDays = att.totalWorkingDays;
    const presentPercent = totalDays > 0 ? (att.presentDays / totalDays) * 100 : 0;
    const absentPercent = totalDays > 0 ? (att.absentDays / totalDays) * 100 : 0;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let attY = attendanceBoxY + 10;
    
    doc.text(`Total Working Days: ${totalDays}`, col1X, attY);
    doc.text(`Present: ${att.presentDays} (${presentPercent.toFixed(1)}%)`, col2X, attY);
    doc.text(`Absent: ${att.absentDays} (${absentPercent.toFixed(1)}%)`, col3X, attY);
    
    attY += 7;
    doc.text(`Late Days: ${att.lateDays}`, col1X, attY);
    doc.text(`Half Days: ${att.halfDays}`, col2X, attY);
    
    attY += 7;
    doc.setTextColor(46, 125, 50);
    doc.text(`Casual Leave: ${att.leaves.casualLeave}`, col1X, attY);
    doc.text(`Sick Leave: ${att.leaves.sickLeave}`, col2X, attY);
    doc.text(`Paid Leave: ${att.leaves.paidLeave}`, col3X, attY);
    
    attY += 7;
    doc.setTextColor(198, 40, 40);
    doc.text(`Unpaid Leave: ${att.leaves.unpaidLeave}`, col1X, attY);
    
    doc.setTextColor(51, 51, 51);
    
    // SALARY ADJUSTMENTS
    const perDaySalary = totalDays > 0 ? data.salary.basicSalary / totalDays : 0;
    const leaveDeduction = att.leaves.unpaidLeave * perDaySalary;
    const lateDeduction = att.lateDays * (perDaySalary / 8);
    
    let attendanceBonus = 0;
    if (att.absentDays === 0 && att.lateDays === 0) {
      attendanceBonus = data.salary.basicSalary * 0.05;
    } else if (att.presentDays === totalDays && att.lateDays <= 2) {
      attendanceBonus = data.salary.basicSalary * 0.02;
    }
    
    // EARNINGS SECTION
    const earningsY = attendanceBoxY + 50;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('EARNINGS', margin + 5, earningsY);
    
    const earnings = [...data.salary.components.filter(c => c.type === 'earning')];
    if (attendanceBonus > 0) {
      earnings.push({
        type: 'earning',
        name: 'Attendance Bonus',
        amount: attendanceBonus,
        isPercentage: false
      });
    }
    
    const earningsData = earnings.map(earning => [
      earning.name,
      earning.isPercentage ? `${(earning.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `Rs. ${formatIndianNumber(earning.amount)}`
    ]);
    
    const totalEarningsWithBonus = data.salary.totalEarnings + attendanceBonus;
    earningsData.push(['Total Earnings', '', `Rs. ${formatIndianNumber(totalEarningsWithBonus)}`]);
    
    autoTable(doc, {
      startY: earningsY + 5,
      head: [['Particulars', 'Percentage', 'Amount']],
      body: earningsData,
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40, halign: 'center' }, 2: { cellWidth: 50, halign: 'right' } },
      margin: { left: margin, right: margin }
    });
    
    // DEDUCTIONS SECTION
    const deductionsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : earningsY + 50;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(198, 40, 40);
    doc.text('DEDUCTIONS', margin + 5, deductionsY);
    
    const deductions = [...data.salary.components.filter(c => c.type === 'deduction')];
    if (leaveDeduction > 0) {
      deductions.push({ type: 'deduction', name: 'Leave Deduction (Unpaid)', amount: leaveDeduction, isPercentage: false });
    }
    if (lateDeduction > 0) {
      deductions.push({ type: 'deduction', name: 'Late Coming Deduction', amount: lateDeduction, isPercentage: false });
    }
    
    const deductionsData = deductions.map(deduction => [
      deduction.name,
      deduction.isPercentage ? `${(deduction.amount / data.salary.basicSalary * 100).toFixed(1)}%` : '-',
      `Rs. ${formatIndianNumber(deduction.amount)}`
    ]);
    
    const totalDeductionsWithAdjustments = data.salary.totalDeductions + leaveDeduction + lateDeduction;
    deductionsData.push(['Total Deductions', '', `Rs. ${formatIndianNumber(totalDeductionsWithAdjustments)}`]);
    
    autoTable(doc, {
      startY: deductionsY + 5,
      head: [['Particulars', 'Percentage', 'Amount']],
      body: deductionsData,
      theme: 'grid',
      headStyles: { fillColor: [198, 40, 40], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40, halign: 'center' }, 2: { cellWidth: 50, halign: 'right' } },
      margin: { left: margin, right: margin }
    });
    
    // NET SALARY
    const netSalaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : deductionsY + 50;
    const finalNetSalary = totalEarningsWithBonus - totalDeductionsWithAdjustments;
    
    doc.setFillColor(220, 237, 200);
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(1);
    doc.rect(margin, netSalaryY, contentWidth, 25, 'FD');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('NET SALARY PAYABLE:', margin + 10, netSalaryY + 10);
    
    doc.setFontSize(16);
    doc.setTextColor(46, 125, 50);
    doc.text(`Rs. ${formatIndianNumber(finalNetSalary)}`, margin + contentWidth - 10, netSalaryY + 10, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(51, 51, 51);
    doc.text(`(In words: ${numberToWords(finalNetSalary)})`, margin + 10, netSalaryY + 20);
    
    // Signature
    const signatureY = netSalaryY + 35;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, signatureY, margin + contentWidth, signatureY);
    
    if (data.digitalSignature) {
      try {
        doc.addImage(data.digitalSignature.image, 'PNG', margin + contentWidth - 80, signatureY + 5, 60, 30);
        doc.setFontSize(8);
        doc.text(`Digitally signed by: ${data.digitalSignature.name}`, margin + contentWidth - 70, signatureY + 15);
        doc.text(`Designation: ${data.digitalSignature.designation}`, margin + contentWidth - 70, signatureY + 22);
      } catch (error) {}
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('HR Digital Signature', margin + contentWidth - 80, signatureY + 18);
    }
    
    // Footer
    const footerY = signatureY + 40;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    // doc.text('This is a computer generated salary slip.', centerX, footerY, { align: 'center' });
  //  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, centerX, footerY + 6, { align: 'center' });
    
    const fileName = `Salary_Slip_${data.employee.employeeName.replace(/\s+/g, '_')}_${data.month}_${data.year}.pdf`;
    doc.save(fileName);
    
    alert('✅ PDF Generated Successfully with Attendance Summary!');
    return true;
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error generating PDF: ' + error);
    return false;
  }
}

function formatIndianNumber(amount: number): string {
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// FIXED: Completely rewritten numberToWords function to avoid infinite recursion
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  if (isNaN(num) || !isFinite(num)) return 'Invalid Amount';
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 20) {
      return ones[n];
    }
    
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      if (one === 0) {
        return tens[ten];
      }
      return tens[ten] + ' ' + ones[one];
    }
    
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    if (remainder === 0) {
      return ones[hundred] + ' Hundred';
    }
    return ones[hundred] + ' Hundred ' + convertLessThanThousand(remainder);
  }
  
  function convertToWords(n: number): string {
    if (n === 0) return '';
    
    if (n < 1000) {
      return convertLessThanThousand(n);
    }
    
    if (n < 100000) {
      const thousand = Math.floor(n / 1000);
      const remainder = n % 1000;
      if (remainder === 0) {
        return convertLessThanThousand(thousand) + ' Thousand';
      }
      return convertLessThanThousand(thousand) + ' Thousand ' + convertLessThanThousand(remainder);
    }
    
    if (n < 10000000) {
      const lakh = Math.floor(n / 100000);
      const remainder = n % 100000;
      if (remainder === 0) {
        return convertLessThanThousand(lakh) + ' Lakh';
      }
      return convertLessThanThousand(lakh) + ' Lakh ' + convertToWords(remainder);
    }
    
    const crore = Math.floor(n / 10000000);
    const remainder = n % 10000000;
    if (remainder === 0) {
      return convertLessThanThousand(crore) + ' Crore';
    }
    return convertLessThanThousand(crore) + ' Crore ' + convertToWords(remainder);
  }
  
  let result = convertToWords(rupees);
  result += rupees === 1 ? ' Rupee' : ' Rupees';
  
  if (paise > 0) {
    result += ' and ' + convertLessThanThousand(paise) + (paise === 1 ? ' Paise' : ' Paise');
  }
  
  return result + ' Only';
}