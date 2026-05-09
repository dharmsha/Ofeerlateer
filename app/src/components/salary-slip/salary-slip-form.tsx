// app/src/components/salary-slip/salary-slip-form.tsx
"use client";

import { useState, useRef } from "react";
import { 
  Calculator, 
  Download, 
  FileText, 
  Printer, 
  Share2, 
  Calendar,
  Building,
  User,
  Banknote,
  Percent,
  Plus,
  Trash2,
  Eye,
  Save,
  IndianRupee,
  Briefcase,
  CreditCard,
  Hash,
  Mail,
  Phone,
  Users,
  Clock,
  CalendarDays,
  Signature,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { generateSalarySlipPDF, AttendanceData } from "@/app/utils/salarySlipGenerator";

interface SalaryComponent {
  type: 'earning' | 'deduction';
  name: string;
  amount: number;
  isPercentage: boolean;
  percentageOf?: string;
}

interface EmployeeData {
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
}

interface SalaryData {
  basicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  components: SalaryComponent[];
}

interface DigitalSignature {
  image: string;
  name: string;
  designation: string;
}

export default function SalarySlipForm() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [employee, setEmployee] = useState<EmployeeData>({
    employeeName: 'Dharm Kumar',
    employeeId: 'CM12',
    designation: 'Senior Developer',
    department: 'Engineering',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '123456789012',
    esiNumber: 'ES123456789',
    joiningDate: '01-01-2020'
  });

  const [salary, setSalary] = useState<SalaryData>({
    basicSalary: 60000,
    totalEarnings: 101000,
    totalDeductions: 15000,
    netSalary: 86000,
    components: [
      { type: 'earning', name: 'Basic Salary', amount: 60000, isPercentage: false },
      { type: 'earning', name: 'House Rent Allowance', amount: 24000, isPercentage: false },
      { type: 'earning', name: 'Dearness Allowance', amount: 12000, isPercentage: false },
      { type: 'earning', name: 'Other Allowances', amount: 5000, isPercentage: false },
      { type: 'deduction', name: 'Provident Fund', amount: 7200, isPercentage: true },
      { type: 'deduction', name: 'Professional Tax', amount: 200, isPercentage: false },
      { type: 'deduction', name: 'TDS', amount: 7600, isPercentage: false },
    ]
  });

  const [attendance, setAttendance] = useState<AttendanceData>({
    presentDays: 22,
    absentDays: 2,
    totalWorkingDays: 24,
    lateDays: 1,
    halfDays: 0,
    leaves: {
      casualLeave: 2,
      sickLeave: 0,
      paidLeave: 0,
      unpaidLeave: 0
    }
  });

  const [digitalSignature, setDigitalSignature] = useState<DigitalSignature | null>(null);
  const [newComponent, setNewComponent] = useState<Omit<SalaryComponent, 'amount'>>({
    type: 'earning',
    name: '',
    isPercentage: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'employee' | 'attendance' | 'salary'>('attendance'); // Default to attendance tab
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState('Rani Shreya');
  const [signatureDesignation, setSignatureDesignation] = useState('HR Manager');

  // Handle employee data changes
  const handleEmployeeChange = (field: keyof EmployeeData, value: string) => {
    setEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle attendance changes
  const handleAttendanceChange = (field: keyof AttendanceData, value: number) => {
    setAttendance(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaveChange = (type: keyof AttendanceData['leaves'], value: number) => {
    setAttendance(prev => ({
      ...prev,
      leaves: {
        ...prev.leaves,
        [type]: value
      }
    }));
  };

  // Auto-calculate present + absent = total working days
  const updatePresentDays = (present: number) => {
    setAttendance(prev => ({
      ...prev,
      presentDays: present,
      absentDays: prev.totalWorkingDays - present
    }));
  };

  const updateAbsentDays = (absent: number) => {
    setAttendance(prev => ({
      ...prev,
      absentDays: absent,
      presentDays: prev.totalWorkingDays - absent
    }));
  };

  const updateTotalWorkingDays = (total: number) => {
    setAttendance(prev => ({
      ...prev,
      totalWorkingDays: total,
      absentDays: total - prev.presentDays
    }));
  };

  // Handle salary component changes
  const handleComponentChange = (index: number, field: keyof SalaryComponent, value: any) => {
    const updatedComponents = [...salary.components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    recalculateTotals(updatedComponents);
  };

  // Add new component
  const handleAddComponent = () => {
    if (!newComponent.name.trim()) {
      alert('Please enter component name');
      return;
    }

    const amountInput = prompt('Enter amount:');
    if (!amountInput) return;

    const amount = parseFloat(amountInput);
    if (isNaN(amount)) {
      alert('Please enter a valid number');
      return;
    }

    const updatedComponents = [
      ...salary.components,
      { ...newComponent, amount }
    ];

    recalculateTotals(updatedComponents);

    setNewComponent({
      type: 'earning',
      name: '',
      isPercentage: false,
    });
  };

  // Remove component
  const handleRemoveComponent = (index: number) => {
    const updatedComponents = salary.components.filter((_, i) => i !== index);
    recalculateTotals(updatedComponents);
  };

  // Recalculate all totals
  const recalculateTotals = (components: SalaryComponent[]) => {
    const totalEarnings = components
      .filter(c => c.type === 'earning')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDeductions = components
      .filter(c => c.type === 'deduction')
      .reduce((sum, c) => sum + c.amount, 0);

    setSalary(prev => ({
      ...prev,
      components,
      totalEarnings,
      totalDeductions,
      netSalary: totalEarnings - totalDeductions
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDigitalSignature({
          image: e.target?.result as string,
          name: signatureName || 'HR Manager',
          designation: signatureDesignation
        });
        setShowSignatureModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate PDF - Passing complete data including attendance
  const handleGeneratePDF = () => {
    generateSalarySlipPDF({
      month: currentMonth,
      year: currentYear,
      employee: {
        ...employee,
        uanNumber: employee.uanNumber,
        esiNumber: employee.esiNumber,
        joiningDate: employee.joiningDate
      },
      salary,
      attendance,
      companyLogo,
      digitalSignature
    });
  };

  // Format currency with ₹ symbol
  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get attendance performance status
  const getAttendanceStatus = () => {
    const attendanceRate = (attendance.presentDays / attendance.totalWorkingDays) * 100;
    if (attendanceRate >= 95) return { text: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: CheckCircle, message: 'Perfect attendance! Keep it up!' };
    if (attendanceRate >= 85) return { text: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: CheckCircle, message: 'Good attendance record' };
    if (attendanceRate >= 75) return { text: 'Satisfactory', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: AlertCircle, message: 'Needs improvement in attendance' };
    return { text: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: XCircle, message: 'Please improve your attendance' };
  };

  // Calculate attendance bonus info
  const getAttendanceBonusInfo = () => {
    const perDaySalary = salary.basicSalary / attendance.totalWorkingDays;
    let bonusAmount = 0;
    let bonusMessage = '';
    
    if (attendance.absentDays === 0 && attendance.lateDays === 0) {
      bonusAmount = salary.basicSalary * 0.05;
      bonusMessage = '5% Attendance Bonus for Perfect Attendance! 🎉';
    } else if (attendance.presentDays === attendance.totalWorkingDays && attendance.lateDays <= 2) {
      bonusAmount = salary.basicSalary * 0.02;
      bonusMessage = '2% Attendance Bonus for Full Attendance! 👍';
    } else {
      bonusMessage = 'No attendance bonus this month';
    }
    
    return { bonusAmount, bonusMessage };
  };

  // Calculate leave deduction
  const getLeaveDeduction = () => {
    const perDaySalary = salary.basicSalary / attendance.totalWorkingDays;
    return attendance.leaves.unpaidLeave * perDaySalary;
  };

  // Calculate late deduction
  const getLateDeduction = () => {
    const perDaySalary = salary.basicSalary / attendance.totalWorkingDays;
    return attendance.lateDays * (perDaySalary / 8);
  };

  const status = getAttendanceStatus();
  const bonusInfo = getAttendanceBonusInfo();
  const leaveDeduction = getLeaveDeduction();
  const lateDeduction = getLateDeduction();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IndianRupee className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Professional Salary Slip Generator</h1>
              <p className="text-indigo-100 mt-1">Generate compliant salary slips with attendance & digital signature</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSignatureModal(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Signature className="h-4 w-4" />
              <span>Add Signature</span>
            </button>
            <button
              onClick={() => {
                const template = { month: currentMonth, year: currentYear, employee, salary, attendance };
                localStorage.setItem('salaryTemplate', JSON.stringify(template));
                alert('Template saved successfully!');
              }}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {[
          { id: 'employee', label: 'Employee Details', icon: User, color: 'indigo' },
          { id: 'attendance', label: 'Attendance & Leave', icon: CalendarDays, color: 'orange' },
          { id: 'salary', label: 'Salary Components', icon: Calculator, color: 'green' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg transition-all ${
              activeTab === tab.id
                ? `bg-white text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* ATTENDANCE SUMMARY TAB - Fully Featured */}
          {activeTab === 'attendance' && (
            <>
              {/* Attendance Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Activity className="h-6 w-6 mr-2 text-orange-600" />
                    Attendance Summary
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}>
                    {status.text}
                  </div>
                </div>

                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <status.icon className={`h-8 w-8 ${status.color}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Attendance Status</p>
                        <p className={`text-xl font-bold ${status.color}`}>{status.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{status.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {((attendance.presentDays / attendance.totalWorkingDays) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendance Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <label className="block text-sm font-medium text-green-700 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Present Days
                    </label>
                    <input
                      type="number"
                      value={attendance.presentDays}
                      onChange={(e) => updatePresentDays(parseInt(e.target.value) || 0)}
                      className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-lg font-semibold"
                    />
                    <p className="text-xs text-green-600 mt-2">✓ Present days this month</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <label className="block text-sm font-medium text-red-700 mb-2 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Absent Days
                    </label>
                    <input
                      type="number"
                      value={attendance.absentDays}
                      onChange={(e) => updateAbsentDays(parseInt(e.target.value) || 0)}
                      className="w-full border border-red-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-lg font-semibold"
                    />
                    <p className="text-xs text-red-600 mt-2">✗  this month</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Total Working Days
                    </label>
                    <input
                      type="number"
                      value={attendance.totalWorkingDays}
                      onChange={(e) => updateTotalWorkingDays(parseInt(e.target.value) || 0)}
                      className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-semibold"
                    />
                    <p className="text-xs text-blue-600 mt-2">📅 Total working days in month</p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Late Days
                    </label>
                    <input
                      type="number"
                      value={attendance.lateDays}
                      onChange={(e) => handleAttendanceChange('lateDays', parseInt(e.target.value) || 0)}
                      className="w-full border border-yellow-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-semibold"
                    />
                    <p className="text-xs text-yellow-600 mt-2">⏰ Days with late arrival</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Half Days
                    </label>
                    <input
                      type="number"
                      value={attendance.halfDays}
                      onChange={(e) => handleAttendanceChange('halfDays', parseInt(e.target.value) || 0)}
                      className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold"
                    />
                    <p className="text-xs text-purple-600 mt-2">🌓 Half working days</p>
                  </div>
                </div>

                {/* Leave Details Section */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Leave Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <label className="block text-sm font-medium text-blue-700 mb-2">🏖️ Casual Leave</label>
                      <input
                        type="number"
                        value={attendance.leaves.casualLeave}
                        onChange={(e) => handleLeaveChange('casualLeave', parseInt(e.target.value) || 0)}
                        className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-blue-600 mt-2">Casual leaves taken</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <label className="block text-sm font-medium text-green-700 mb-2">🤒 Sick Leave</label>
                      <input
                        type="number"
                        value={attendance.leaves.sickLeave}
                        onChange={(e) => handleLeaveChange('sickLeave', parseInt(e.target.value) || 0)}
                        className="w-full border border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <p className="text-xs text-green-600 mt-2">Medical leaves taken</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <label className="block text-sm font-medium text-purple-700 mb-2">💰 Paid Leave</label>
                      <input
                        type="number"
                        value={attendance.leaves.paidLeave}
                        onChange={(e) => handleLeaveChange('paidLeave', parseInt(e.target.value) || 0)}
                        className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <p className="text-xs text-purple-600 mt-2">Earned leaves taken</p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <label className="block text-sm font-medium text-red-700 mb-2">⚠️ Unpaid Leave</label>
                      <input
                        type="number"
                        value={attendance.leaves.unpaidLeave}
                        onChange={(e) => handleLeaveChange('unpaidLeave', parseInt(e.target.value) || 0)}
                        className="w-full border border-red-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      <p className="text-xs text-red-600 mt-2">Salary will be deducted</p>
                    </div>
                  </div>
                </div>

                {/* Attendance Impact Summary */}
                <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2" />
                    Attendance Impact on Salary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Day Salary:</span>
                      <span className="font-semibold">{formatCurrency(salary.basicSalary / attendance.totalWorkingDays)}</span>
                    </div>
                    {leaveDeduction > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Unpaid Leave Deduction:</span>
                        <span className="font-semibold">- {formatCurrency(leaveDeduction)}</span>
                      </div>
                    )}
                    {lateDeduction > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Late Coming Deduction:</span>
                        <span className="font-semibold">- {formatCurrency(lateDeduction)}</span>
                      </div>
                    )}
                    {bonusInfo.bonusAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{bonusInfo.bonusMessage}</span>
                        <span className="font-semibold">+ {formatCurrency(bonusInfo.bonusAmount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Net Impact:</span>
                      <span className={bonusInfo.bonusAmount - leaveDeduction - lateDeduction >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(bonusInfo.bonusAmount - leaveDeduction - lateDeduction)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Employee Details Tab */}
          {activeTab === 'employee' && (
            <>
              {/* Company Logo & Month */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-indigo-600" />
                      Company Details
                    </h3>
                    <div className="flex items-start space-x-6">
                      <div className="relative group">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors cursor-pointer">
                          {companyLogo ? (
                            <img src={companyLogo} alt="Company Logo" className="h-20 w-20 object-contain" />
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Company Logo</p>
                              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="company-logo"
                        />
                        <label
                          htmlFor="company-logo"
                          className="block text-center text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer mt-2"
                        >
                          {companyLogo ? 'Change Logo' : 'Upload Logo'}
                        </label>
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-2">
                          <p className="text-xl font-bold text-gray-900">VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</p>
                          <p className="text-sm text-gray-600 mt-1">1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center text-sm">
                            <Hash className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">GSTIN: <span className="font-medium">10AAJCV6337M1Z2</span></span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">Phone: <span className="font-medium">9973725719</span></span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">Email: <span className="font-medium">support@creatorsmind.co.in</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:pl-6 md:border-l md:border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                      Salary Month
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Month"
                      />
                      <input
                        type="text"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="w-24 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Year"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Details Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600" />
                  Employee Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Employee Name', field: 'employeeName', icon: User, required: true },
                    { label: 'Employee ID', field: 'employeeId', icon: Hash, required: true },
                    { label: 'Designation', field: 'designation', icon: Briefcase, required: true },
                    { label: 'Department', field: 'department', icon: Building, required: true },
                    { label: 'Joining Date', field: 'joiningDate', icon: Calendar, required: false },
                    { label: 'Bank Name', field: 'bankName', icon: Banknote, required: true },
                    { label: 'Account Number', field: 'accountNumber', icon: CreditCard, required: true },
                    { label: 'IFSC Code', field: 'ifscCode', icon: FileText, required: true },
                    { label: 'PAN Number', field: 'panNumber', icon: FileText, required: true },
                    { label: 'UAN Number', field: 'uanNumber', icon: Hash, required: false },
                    { label: 'ESI Number', field: 'esiNumber', icon: Hash, required: false },
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                          {item.label}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                      </label>
                      <input
                        type="text"
                        value={employee[item.field as keyof EmployeeData] || ''}
                        onChange={(e) => handleEmployeeChange(item.field as keyof EmployeeData, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Salary Components Tab */}
          {activeTab === 'salary' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4 md:mb-0">
                  <Calculator className="h-5 w-5 mr-2 text-green-600" />
                  Salary Components
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg">
                    <div className="text-sm font-medium">Total Earnings</div>
                    <div className="text-lg font-bold">{formatCurrency(salary.totalEarnings)}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg">
                    <div className="text-sm font-medium">Total Deductions</div>
                    <div className="text-lg font-bold">{formatCurrency(salary.totalDeductions)}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg">
                    <div className="text-sm font-medium">Net Salary</div>
                    <div className="text-lg font-bold">{formatCurrency(salary.netSalary)}</div>
                  </div>
                </div>
              </div>

              {/* Basic Salary Input */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (Base Amount)</label>
                <input
                  type="number"
                  value={salary.basicSalary}
                  onChange={(e) => setSalary(prev => ({ ...prev, basicSalary: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">This is the base salary for percentage calculations</p>
              </div>

              {/* Earnings Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-green-700 text-lg flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                    </div>
                    Earnings
                  </h4>
                  <span className="text-sm text-gray-500">
                    {salary.components.filter(c => c.type === 'earning').length} components
                  </span>
                </div>
                
                <div className="space-y-3">
                  {salary.components
                    .filter(c => c.type === 'earning')
                    .map((component, index) => {
                      const originalIndex = salary.components.findIndex(c => c.name === component.name && c.type === component.type);
                      return (
                        <div key={index} className="flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-lg hover:bg-green-100 transition-colors">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Percent className="h-5 w-5 text-green-700" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{component.name}</p>
                              <p className="text-xs text-gray-500">Amount</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="number"
                              value={component.amount}
                              onChange={(e) => {
                                const newComponents = [...salary.components];
                                newComponents[originalIndex].amount = parseInt(e.target.value) || 0;
                                recalculateTotals(newComponents);
                              }}
                              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <button
                              onClick={() => handleRemoveComponent(originalIndex)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Deductions Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-red-700 text-lg flex items-center">
                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                      <IndianRupee className="h-4 w-4 text-red-600" />
                    </div>
                    Deductions
                  </h4>
                  <span className="text-sm text-gray-500">
                    {salary.components.filter(c => c.type === 'deduction').length} components
                  </span>
                </div>
                
                <div className="space-y-3">
                  {salary.components
                    .filter(c => c.type === 'deduction')
                    .map((component, index) => {
                      const originalIndex = salary.components.findIndex(c => c.name === component.name && c.type === component.type);
                      return (
                        <div key={index} className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-lg hover:bg-red-100 transition-colors">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <Percent className="h-5 w-5 text-red-700" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{component.name}</p>
                              <p className="text-xs text-gray-500">Amount</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="number"
                              value={component.amount}
                              onChange={(e) => {
                                const newComponents = [...salary.components];
                                newComponents[originalIndex].amount = parseInt(e.target.value) || 0;
                                recalculateTotals(newComponents);
                              }}
                              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-red-500 outline-none"
                            />
                            <button
                              onClick={() => handleRemoveComponent(originalIndex)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Add New Component */}
              <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Add New Salary Component</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newComponent.type}
                      onChange={(e) => setNewComponent(prev => ({ ...prev, type: e.target.value as 'earning' | 'deduction' }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="earning">Earning (+)</option>
                      <option value="deduction">Deduction (-)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
                    <input
                      type="text"
                      value={newComponent.name}
                      onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Travel Allowance, Medical Allowance, etc."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleAddComponent}
                      disabled={!newComponent.name.trim()}
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newComponent.isPercentage}
                      onChange={(e) => setNewComponent(prev => ({ ...prev, isPercentage: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Calculate as percentage of Basic Salary</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-8">
          {/* Salary Summary Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
              Salary Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">Basic Salary:</span>
                <span className="font-bold text-gray-900">{formatCurrency(salary.basicSalary)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-green-600 font-medium">Total Earnings:</span>
                <span className="font-bold text-green-600">+ {formatCurrency(salary.totalEarnings)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-red-600 font-medium">Total Deductions:</span>
                <span className="font-bold text-red-600">- {formatCurrency(salary.totalDeductions)}</span>
              </div>
              
              <div className="pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-gray-900">Net Salary Payable:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(salary.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate & Export</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleGeneratePDF}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span className="font-semibold">Download Salary Slip PDF</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>

          {/* Digital Signature Status */}
          <div className={`rounded-2xl shadow-lg p-6 border ${digitalSignature ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Signature className="h-5 w-5 mr-2 text-indigo-600" />
              Digital Signature
            </h3>
            
            {digitalSignature ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Signed by:</p>
                    <p className="font-semibold text-gray-900">{digitalSignature.name}</p>
                    <p className="text-xs text-gray-600">{digitalSignature.designation}</p>
                  </div>
                  <img src={digitalSignature.image} alt="Signature" className="h-12 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setDigitalSignature(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove Signature
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Signature className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">No digital signature added</p>
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  + Add Digital Signature
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-indigo-600" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {salary.components.filter(c => c.type === 'earning').length}
                </div>
                <div className="text-xs text-green-600">Earnings</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {salary.components.filter(c => c.type === 'deduction').length}
                </div>
                <div className="text-xs text-red-600">Deductions</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {attendance.presentDays}
                </div>
                <div className="text-xs text-blue-600">Present Days</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-700">
                  {((attendance.presentDays / attendance.totalWorkingDays) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-orange-600">Attendance %</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Digital Signature</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signatory Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="e.g., Rani Shreya"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={signatureDesignation}
                  onChange={(e) => setSignatureDesignation(e.target.value)}
                  placeholder="e.g., HR Manager"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Image</label>
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Upload a clear signature image (PNG, JPG)</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}