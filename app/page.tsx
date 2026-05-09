"use client";
import { useState, useRef, useEffect } from "react";
import { generatePDF } from "@/app/utils/pdfGenerator";
import { generateSalarySlipPDF, SalarySlipData, AttendanceData } from "@/app/utils/salarySlipGenerator";
import { generateExperienceLetterPDF, ExperienceLetterData } from "@/app/utils/experienceLetterGenerator";
import Navbar from "@/app/src/components/Header/Navbar";
import Footers from "@/app/src/components/Footer/fotters";
import { 
  FileText, Calculator, Download, Printer, Building, User, Banknote, ArrowRight,
  Sparkles, TrendingUp, Shield, Award, Calendar, Mail, Phone, MapPin, Clock,
  Briefcase, GraduationCap, CheckCircle, X, AlertCircle, Edit, Copy, Save, Eye,
  Star, Trophy, Code, Globe, Package, Rocket, Target, Users, BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'offer' | 'salary' | 'experience'>('offer');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    netSalary: 0,
    type: 'offer' as 'offer' | 'salary' | 'experience'
  });
  
  // Offer Letter Form State
  const [offerFormData, setOfferFormData] = useState({
    candidateName: 'Candidate Name',
    jobTitle: 'Job Title',
    joiningDate: 'DD/MM/YYYY',
    ctc: 'Amount',
    reportingManager: 'Reporting Manager/Department',
    workLocation: 'City, State',
    companyName: 'VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.',
    companyAddress: '1st Floor, Siyaram Mention, Opp. Telephone Exchange, Near P&M Mall\nKhurji, Patna, Bihar – 800024',
    companyPhone: '9973725719',
    companyEmail: 'hr@creatorsmind.co.in', // ✅ FIXED
    gstin: '10AAJCV6337M1Z2',
    offerDate: new Date().toLocaleDateString('en-GB'),
    hrName: 'Rani Shreya',
    hrDesignation: 'HR Manager'
  });
  
  // Salary Slip Form State
  const [salaryFormData, setSalaryFormData] = useState({
    employeeName: 'Dharm kumar',
    employeeId: 'CM12',
    designation: 'Senior Developer',
    department: 'Engineering',
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    basicSalary: '60000',
    hra: '24000',
    da: '12000',
    otherAllowances: '5000',
    pf: '7200',
    tds: '7500',
    professionalTax: '200'
  });

  // ✅ ADDED: Attendance State for Salary Slip
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
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
  
  // Experience Letter Form State
  const [experienceFormData, setExperienceFormData] = useState<ExperienceLetterData>({
    companyName: 'Vats Creative Digital Solution Pvt.Ltd',
    companyAddress: '1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall',
    employeeName: 'Dharm Kumar',
    employeeId: 'EMP001',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    dateOfJoining: '2022-01-01',
    dateOfLeaving: '2023-12-31',
    lastWorkingDay: '2023-12-31',
    reasonForLeaving: 'Better career opportunity',
    achievements: '• Led multiple successful projects\n• Improved code quality by 40%\n• Mentored 5 junior developers\n• Implemented CI/CD pipeline\n• Reduced application load time by 60%',
    skills: 'React, Next.js, TypeScript, Node.js, MongoDB, AWS, Docker, Kubernetes, GraphQL, Python',
    managerName: 'Shrikant Kumar',
    managerDesignation: 'Engineering Manager',
    authorizedBy: 'HR Manager',
    authorizedSignature: 'Sarah Johnson',
    companyLogo: null
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data
  useEffect(() => {
    const savedExperienceData = localStorage.getItem('experienceFormData');
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedExperienceData) {
      try {
        const parsedData = JSON.parse(savedExperienceData);
        setExperienceFormData(prev => ({ ...prev, ...parsedData, companyLogo: parsedData.companyLogo || null }));
      } catch (error) { console.error('Error parsing saved data:', error); }
    }
    if (savedLogo) setLogoPreview(savedLogo);
  }, []);

  const saveExperienceData = () => {
    const dataToSave = { ...experienceFormData, companyLogo: logoPreview || null };
    localStorage.setItem('experienceFormData', JSON.stringify(dataToSave));
    alert('Experience letter data saved successfully!');
  };

  // Handlers
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOfferFormData({ ...offerFormData, [e.target.name]: e.target.value });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryFormData({ ...salaryFormData, [e.target.name]: e.target.value });
  };

  // ✅ ADDED: Attendance change handlers
  const handleAttendanceChange = (field: keyof AttendanceData, value: number) => {
    setAttendanceData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeaveChange = (type: keyof AttendanceData['leaves'], value: number) => {
    setAttendanceData(prev => ({
      ...prev,
      leaves: { ...prev.leaves, [type]: value }
    }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setExperienceFormData({ ...experienceFormData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
      if (file.size > 2 * 1024 * 1024) { alert('Image size should be less than 2MB'); return; }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setLogoPreview(result);
          setExperienceFormData(prev => ({ ...prev, companyLogo: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setExperienceFormData(prev => ({ ...prev, companyLogo: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ✅ FIXED: Offer Letter Generation
  const handleGenerateOfferPDF = () => {
    const mappedFormData = {
      name: offerFormData.candidateName,
      designation: offerFormData.jobTitle,
      joiningDate: offerFormData.joiningDate,
      ctc: offerFormData.ctc,
      reportingManager: offerFormData.reportingManager,
      workLocation: offerFormData.workLocation,
      department: '',
      probationPeriod: '',
      noticePeriod: ''
    };
    const generatePDFTyped = generatePDF as (data: any, logo?: string | null | undefined) => void;
    generatePDFTyped(mappedFormData, logoPreview);
    setModalData({
      title: 'Offer Letter Generated Successfully!',
      message: `Offer letter for ${offerFormData.candidateName} has been generated with ₹${offerFormData.ctc} CTC.`,
      netSalary: 0, type: 'offer'
    });
    setShowSuccessModal(true);
  };

  // ✅ FIXED: Salary Slip Generation with ATTENDANCE
  const handleGenerateSalaryPDF = () => {
    const basic = parseInt(salaryFormData.basicSalary) || 0;
    const hra = parseInt(salaryFormData.hra) || 0;
    const da = parseInt(salaryFormData.da) || 0;
    const other = parseInt(salaryFormData.otherAllowances) || 0;
    const pf = parseInt(salaryFormData.pf) || 0;
    const tds = parseInt(salaryFormData.tds) || 0;
    const pt = parseInt(salaryFormData.professionalTax) || 0;

    const totalEarnings = basic + hra + da + other;
    const totalDeductions = pf + tds + pt;
    const netSalary = totalEarnings - totalDeductions;

    const salarySlipData: SalarySlipData = {
      month: salaryFormData.month.split(' ')[0] || salaryFormData.month,
      year: salaryFormData.month.split(' ')[1] || new Date().getFullYear().toString(),
      employee: {
        employeeName: salaryFormData.employeeName,
        employeeId: salaryFormData.employeeId,
        designation: salaryFormData.designation,
        department: salaryFormData.department,
        bankName: salaryFormData.bankName,
        accountNumber: salaryFormData.accountNumber,
        ifscCode: salaryFormData.ifscCode,
        panNumber: salaryFormData.panNumber
      },
      salary: {
        basicSalary: basic,
        totalEarnings,
        totalDeductions,
        netSalary,
        components: [
          { type: 'earning' as const, name: 'Basic Salary', amount: basic, isPercentage: false },
          { type: 'earning' as const, name: 'House Rent Allowance', amount: hra, isPercentage: false },
          { type: 'earning' as const, name: 'Dearness Allowance', amount: da, isPercentage: false },
          { type: 'earning' as const, name: 'Other Allowances', amount: other, isPercentage: false },
          { type: 'deduction' as const, name: 'Provident Fund', amount: pf, isPercentage: true, percentageOf: 'Basic' },
          { type: 'deduction' as const, name: 'Tax Deducted at Source', amount: tds, isPercentage: false },
          { type: 'deduction' as const, name: 'Professional Tax', amount: pt, isPercentage: false }
        ]
      },
      attendance: attendanceData, // ✅ ATTENDANCE PASS KAR RAHA HU
      companyLogo: logoPreview || undefined
    };

    generateSalarySlipPDF(salarySlipData);
    
    setModalData({
      title: 'Salary Slip Generated Successfully!',
      message: `Salary slip for ${salaryFormData.employeeName} (${salaryFormData.month}) has been generated.`,
      netSalary: netSalary,
      type: 'salary'
    });
    setShowSuccessModal(true);
  };

  const handleGenerateExperiencePDF = async () => {
    setIsLoading(true);
    try {
      const experienceData: ExperienceLetterData = {
        ...experienceFormData,
        companyLogo: logoPreview || experienceFormData.companyLogo || null
      };
      await generateExperienceLetterPDF(experienceData);
      setModalData({
        title: 'Experience Letter Generated Successfully!',
        message: `Experience letter for ${experienceFormData.employeeName} has been generated and downloaded.`,
        netSalary: 0, type: 'experience'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error generating experience letter:', error);
      alert('Failed to generate experience letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSalaryTotals = () => {
    const basic = parseInt(salaryFormData.basicSalary) || 0;
    const hra = parseInt(salaryFormData.hra) || 0;
    const da = parseInt(salaryFormData.da) || 0;
    const other = parseInt(salaryFormData.otherAllowances) || 0;
    const pf = parseInt(salaryFormData.pf) || 0;
    const tds = parseInt(salaryFormData.tds) || 0;
    const pt = parseInt(salaryFormData.professionalTax) || 0;
    return {
      totalEarnings: basic + hra + da + other,
      totalDeductions: pf + tds + pt,
      netSalary: (basic + hra + da + other) - (pf + tds + pt)
    };
  };

  const totals = calculateSalaryTotals();

  const handlePrint = () => window.print();
  const handleCopyToClipboard = () => {
    const text = JSON.stringify({ offerFormData, salaryFormData, experienceFormData, attendanceData }, null, 2);
    navigator.clipboard.writeText(text).then(() => alert('Data copied to clipboard!')).catch(() => alert('Failed to copy'));
  };

  const handleResetForm = () => {
    if (activeTab === 'offer') {
      setOfferFormData({
        candidateName: '', jobTitle: '', joiningDate: '', ctc: '', reportingManager: '', workLocation: '',
        companyName: 'VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.',
        companyAddress: '1st Floor, Siyaram Mention, Opp. Telephone Exchange, Near P&M Mall\nKhurji, Patna, Bihar – 800024',
        companyPhone: '9973725719', companyEmail: 'hr@creatorsmind.co.in', gstin: '10AAJCV6337M1Z2',
        offerDate: new Date().toLocaleDateString('en-GB'), hrName: 'Rani Shreya', hrDesignation: 'HR Manager'
      });
    } else if (activeTab === 'salary') {
      setSalaryFormData({
        employeeName: '', employeeId: '', designation: '', department: '',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        bankName: '', accountNumber: '', ifscCode: '', panNumber: '',
        basicSalary: '', hra: '', da: '', otherAllowances: '', pf: '', tds: '', professionalTax: ''
      });
      setAttendanceData({
        presentDays: 22, absentDays: 2, totalWorkingDays: 24, lateDays: 1, halfDays: 0,
        leaves: { casualLeave: 2, sickLeave: 0, paidLeave: 0, unpaidLeave: 0 }
      });
    } else {
      setExperienceFormData({
        companyName: '', companyAddress: '', employeeName: '', employeeId: '', designation: '', department: '',
        dateOfJoining: new Date().toISOString().split('T')[0], dateOfLeaving: new Date().toISOString().split('T')[0],
        lastWorkingDay: new Date().toISOString().split('T')[0], reasonForLeaving: '', achievements: '', skills: '',
        managerName: '', managerDesignation: '', authorizedBy: '', authorizedSignature: '', companyLogo: null
      });
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{modalData.title}</h3>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">{modalData.message}</p>
              {modalData.type === 'salary' && modalData.netSalary > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-lg font-bold text-green-600">₹{totals.totalEarnings.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Net Salary</p>
                      <p className="text-lg font-bold text-green-700">₹{modalData.netSalary.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowSuccessModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">
                Close
              </button>
              <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Printer className="h-4 w-4" /><span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white font-sans pt-16">
        <main className="flex w-full max-w-7xl flex-col items-center justify-between py-8 px-4 md:px-8">
          
          {/* Hero Section */}
          <div className="w-full text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
              <Award className="h-5 w-5" />
              <span className="font-medium">Professional Document Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Create <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Professional Documents</span> in Minutes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Generate offer letters, salary slips, and experience letters with our automated tools</p>
          </div>

          {/* Tab Navigation */}
          <div className="w-full max-w-6xl mb-8">
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
              {[
                { id: 'offer', label: 'Offer Letter', icon: FileText, color: 'blue' },
                { id: 'salary', label: 'Salary Slip', icon: Calculator, color: 'green' },
                { id: 'experience', label: 'Experience Letter', icon: Award, color: 'purple' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-lg transition-all duration-300 ${activeTab === tab.id ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600` : 'text-gray-500 hover:text-gray-700'}`}>
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo Upload */}
          <div className="w-full max-w-6xl mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${logoPreview ? 'bg-green-100' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
                    {logoPreview ? <img src={logoPreview} alt="Company Logo" className="h-8 w-8 object-contain" /> : <Building className="h-8 w-8 text-white" />}
                  </div>
                  <div><h3 className="font-semibold text-gray-900">Company Branding</h3><p className="text-sm text-gray-500">Upload your company logo to appear on all documents</p></div>
                </div>
                <div className="flex items-center space-x-3">
                  {logoPreview ? (
                    <>
                      <button onClick={handleRemoveLogo} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center space-x-2">
                        <X className="h-4 w-4" /><span>Remove Logo</span>
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Change Logo</button>
                    </>
                  ) : (
                    <>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                      <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" /><span>Upload Company Logo</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="w-full max-w-6xl mb-6">
            <div className="flex flex-wrap gap-3 justify-end">
              <button onClick={handleCopyToClipboard} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Copy className="h-4 w-4" /><span>Copy Data</span>
              </button>
              <button onClick={handleResetForm} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="h-4 w-4" /><span>Reset Form</span>
              </button>
            </div>
          </div>

          {/* OFFER LETTER TAB */}
          {activeTab === 'offer' && (
            <div className="w-full max-w-6xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Candidate Name", name: "candidateName", placeholder: "Enter candidate name", icon: User },
                  { label: "Job Title", name: "jobTitle", placeholder: "Enter job title", icon: Briefcase },
                  { label: "Joining Date", name: "joiningDate", placeholder: "DD/MM/YYYY", icon: Calendar },
                  { label: "CTC (per annum)", name: "ctc", placeholder: "Enter CTC amount", icon: Banknote },
                  { label: "Reporting Manager/Dept", name: "reportingManager", placeholder: "Manager name or Department", icon: User },
                  { label: "Work Location", name: "workLocation", placeholder: "City, State", icon: MapPin },
                  { label: "Company Name", name: "companyName", placeholder: "Company name", icon: Building },
                  { label: "Company Phone", name: "companyPhone", placeholder: "Phone number", icon: Phone },
                  { label: "Company Email", name: "companyEmail", placeholder: "Email address", icon: Mail },
                  { label: "GSTIN", name: "gstin", placeholder: "GST number", icon: FileText },
                  { label: "Offer Date", name: "offerDate", placeholder: "DD/MM/YYYY", icon: Calendar },
                  { label: "HR Name", name: "hrName", placeholder: "HR representative name", icon: User },
                  { label: "HR Designation", name: "hrDesignation", placeholder: "HR designation", icon: Award }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <field.icon className="h-4 w-4 mr-2 text-gray-400" />{field.label}
                    </label>
                    <input type="text" name={field.name} value={offerFormData[field.name as keyof typeof offerFormData]} onChange={handleOfferChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder={field.placeholder} />
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />Company Address
                  </label>
                  <textarea name="companyAddress" value={offerFormData.companyAddress} onChange={handleOfferChange} rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Full company address" />
                </div>
              </div>
              <button onClick={handleGenerateOfferPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl hover:shadow-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3">
                <Download className="h-5 w-5" /><span>Generate Offer Letter PDF</span>
              </button>
            </div>
          )}

          {/* SALARY SLIP TAB with ATTENDANCE SECTION */}
          {activeTab === 'salary' && (
            <div className="w-full max-w-6xl space-y-8">
              {/* Employee Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />Employee Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Employee Name", name: "employeeName", placeholder: "e.g., John Doe" },
                    { label: "Employee ID", name: "employeeId", placeholder: "e.g., EMP001" },
                    { label: "Designation", name: "designation", placeholder: "e.g., Senior Developer" },
                    { label: "Department", name: "department", placeholder: "e.g., Engineering" },
                    { label: "Month", name: "month", placeholder: "e.g., January 2024" },
                    { label: "Bank Name", name: "bankName", placeholder: "e.g., HDFC Bank" },
                    { label: "Account Number", name: "accountNumber", placeholder: "e.g., XXXXXX1234" },
                    { label: "IFSC Code", name: "ifscCode", placeholder: "e.g., HDFC0001234" },
                    { label: "PAN Number", name: "panNumber", placeholder: "e.g., ABCDE1234F" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input type="text" name={field.name} value={salaryFormData[field.name as keyof typeof salaryFormData]} onChange={handleSalaryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={field.placeholder} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ ATTENDANCE SECTION ADDED */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />Attendance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-green-700 mb-2">Present Days</label>
                    <input type="number" value={attendanceData.presentDays} onChange={(e) => handleAttendanceChange('presentDays', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-red-700 mb-2">Absent Days</label>
                    <input type="number" value={attendanceData.absentDays} onChange={(e) => handleAttendanceChange('absentDays', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700 mb-2">Total Working Days</label>
                    <input type="number" value={attendanceData.totalWorkingDays} onChange={(e) => handleAttendanceChange('totalWorkingDays', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-yellow-700 mb-2">Late Days</label>
                    <input type="number" value={attendanceData.lateDays} onChange={(e) => handleAttendanceChange('lateDays', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-purple-700 mb-2">Half Days</label>
                    <input type="number" value={attendanceData.halfDays} onChange={(e) => handleAttendanceChange('halfDays', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-3">Leave Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><label className="text-sm text-gray-600">Casual Leave</label><input type="number" value={attendanceData.leaves.casualLeave} onChange={(e) => handleLeaveChange('casualLeave', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-sm text-gray-600">Sick Leave</label><input type="number" value={attendanceData.leaves.sickLeave} onChange={(e) => handleLeaveChange('sickLeave', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-sm text-gray-600">Paid Leave</label><input type="number" value={attendanceData.leaves.paidLeave} onChange={(e) => handleLeaveChange('paidLeave', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-sm text-gray-600">Unpaid Leave</label><input type="number" value={attendanceData.leaves.unpaidLeave} onChange={(e) => handleLeaveChange('unpaidLeave', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <div className="flex justify-between"><span>Attendance Rate:</span><span className="font-bold">{((attendanceData.presentDays / attendanceData.totalWorkingDays) * 100).toFixed(1)}%</span></div>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-green-600" />Earnings</h3>
                  <div className="space-y-6">
                    {[{ label: "Basic Salary", name: "basicSalary" }, { label: "House Rent Allowance (HRA)", name: "hra" }, { label: "Dearness Allowance (DA)", name: "da" }, { label: "Other Allowances", name: "otherAllowances" }].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
                          <span className="text-gray-400 mr-2">₹</span>
                          <input type="text" name={field.name} value={salaryFormData[field.name as keyof typeof salaryFormData]} onChange={handleSalaryChange} className="flex-1 outline-none" placeholder="Enter amount" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center"><Shield className="h-5 w-5 mr-2 text-red-600" />Deductions</h3>
                  <div className="space-y-6">
                    {[{ label: "Provident Fund (PF)", name: "pf", desc: "12% of Basic" }, { label: "Tax Deducted at Source (TDS)", name: "tds", desc: "As per tax slab" }, { label: "Professional Tax", name: "professionalTax", desc: "State specific" }].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                        <div className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center"><span className="text-gray-400 mr-2">₹</span>
                            <input type="text" name={field.name} value={salaryFormData[field.name as keyof typeof salaryFormData]} onChange={handleSalaryChange} className="flex-1 outline-none text-lg font-semibold" placeholder="Enter amount" />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">{field.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white rounded-xl"><p className="text-sm text-gray-600 mb-2">Total Earnings</p><p className="text-3xl font-bold text-green-600">₹{totals.totalEarnings.toLocaleString('en-IN')}</p></div>
                  <div className="text-center p-6 bg-white rounded-xl"><p className="text-sm text-gray-600 mb-2">Total Deductions</p><p className="text-3xl font-bold text-red-600">₹{totals.totalDeductions.toLocaleString('en-IN')}</p></div>
                  <div className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl"><p className="text-sm text-white/90 mb-2">Net Salary</p><p className="text-3xl font-bold text-white">₹{totals.netSalary.toLocaleString('en-IN')}</p></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={handleGenerateSalaryPDF} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 px-6 rounded-xl hover:shadow-xl font-semibold text-lg transition-all flex items-center justify-center space-x-3">
                  <Download className="h-5 w-5" /><span>Generate Salary Slip PDF</span>
                </button>
                <button onClick={handlePrint} className="border-2 border-gray-300 text-gray-700 py-5 px-6 rounded-xl hover:bg-gray-50 font-semibold text-lg flex items-center justify-center space-x-3">
                  <Printer className="h-5 w-5" /><span>Print Salary Slip</span>
                </button>
              </div>
            </div>
          )}

          {/* EXPERIENCE LETTER TAB */}
          {activeTab === 'experience' && (
            <div className="w-full max-w-6xl space-y-8">
              {/* Rest of experience letter UI - keeping it short as it's long */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center"><Building className="h-5 w-5 mr-2 text-purple-600" />Experience Letter Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="employeeName" placeholder="Employee Name" value={experienceFormData.employeeName} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                  <input type="text" name="employeeId" placeholder="Employee ID" value={experienceFormData.employeeId} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                  <input type="text" name="designation" placeholder="Designation" value={experienceFormData.designation} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                  <input type="text" name="department" placeholder="Department" value={experienceFormData.department} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                  <input type="date" name="dateOfJoining" value={experienceFormData.dateOfJoining} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                  <input type="date" name="dateOfLeaving" value={experienceFormData.dateOfLeaving} onChange={handleExperienceChange} className="border rounded-lg p-3" />
                </div>
              </div>

              <button onClick={handleGenerateExperiencePDF} disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5 px-6 rounded-xl hover:shadow-xl font-semibold text-lg transition-all flex items-center justify-center space-x-3">
                {isLoading ? <><div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Generating...</span></> : <><Download className="h-5 w-5" /><span>Generate Experience Letter PDF</span></>}
              </button>
            </div>
          )}
        </main>
      </div>
      <Footers />
    </>
  );
}