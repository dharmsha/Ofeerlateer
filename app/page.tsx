"use client";
import { useState, useRef, useEffect } from "react";
import { generatePDF } from "@/app/utils/pdfGenerator";
import { generateSalarySlipPDF, SalarySlipData } from "@/app/utils/salarySlipGenerator";
import { generateExperienceLetterPDF, ExperienceLetterData } from "@/app/utils/experienceLetterGenerator";
import Navbar from "@/app/src/components/Header/Navbar";
import Footers from "@/app/src/components/Footer/fotters";
import { 
  FileText, 
  Calculator, 
  Download, 
  Printer,
  Building,
  User,
  Banknote,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  CheckCircle,
  X,
  AlertCircle,
  Edit,
  Copy,
  Save,
  Eye,
  Star,
  Trophy,
  Code,
  Globe,
  Package,
  Rocket,
  Target,
  Users,
  BookOpen
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
  
  // Offer Letter Form State (updated to match the new template)
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
    companyEmail: 'support@creatorsmind.co.in',
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

  // Add achievement templates
  const achievementTemplates = [
    {
      title: 'Technical Achievements',
      achievements: [
        'Led the development of a scalable microservices architecture',
        'Improved application performance by 40% through code optimization',
        'Implemented CI/CD pipeline reducing deployment time by 70%',
        'Migrated legacy system to modern tech stack',
        'Reduced server costs by 30% through infrastructure optimization'
      ]
    },
    {
      title: 'Leadership Achievements',
      achievements: [
        'Mentored 5 junior developers who were promoted within a year',
        'Led a team of 8 developers on multiple successful projects',
        'Conducted weekly knowledge sharing sessions',
        'Improved team productivity by 25% through process improvements',
        'Received "Employee of the Year" award in 2022'
      ]
    },
    {
      title: 'Project Achievements',
      achievements: [
        'Successfully delivered 15+ projects with 100% client satisfaction',
        'Increased application user base by 200% over 2 years',
        'Reduced bug reports by 60% through improved testing practices',
        'Implemented automated testing saving 20 hours/week of manual testing',
        'Led migration to cloud infrastructure with 99.9% uptime'
      ]
    }
  ];

  // Add skill categories
  const skillCategories = [
    {
      title: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux', 'GraphQL']
    },
    {
      title: 'Backend',
      skills: ['Node.js', 'Python', 'Express.js', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes']
    },
    {
      title: 'Tools & Others',
      skills: ['Git', 'AWS', 'CI/CD', 'Jest', 'Webpack', 'Agile/Scrum', 'Figma', 'Jira']
    }
  ];
  
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedExperienceData = localStorage.getItem('experienceFormData');
    const savedLogo = localStorage.getItem('companyLogo');

    if (savedExperienceData) {
      try {
        const parsedData = JSON.parse(savedExperienceData);
        setExperienceFormData(prev => ({
          ...prev,
          ...parsedData,
          companyLogo: parsedData.companyLogo || null
        }));
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    if (savedLogo) setLogoPreview(savedLogo);
  }, []);

  // Save experience form data
  const saveExperienceData = () => {
    const dataToSave = {
      ...experienceFormData,
      companyLogo: logoPreview || null
    };
    localStorage.setItem('experienceFormData', JSON.stringify(dataToSave));
    alert('Experience letter data saved successfully!');
  };

  // Common handlers
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOfferFormData({
      ...offerFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryFormData({
      ...salaryFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperienceFormData({
      ...experienceFormData,
      [name]: value
    });
  };

  // Add skill handler
  const handleAddSkill = (skill: string) => {
    const currentSkills = experienceFormData.skills ? experienceFormData.skills.split(', ') : [];
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].filter(Boolean);
      setExperienceFormData({
        ...experienceFormData,
        skills: newSkills.join(', ')
      });
    }
  };

  // Remove skill handler
  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = experienceFormData.skills.split(', ').filter(skill => skill.trim() !== skillToRemove);
    setExperienceFormData({
      ...experienceFormData,
      skills: currentSkills.join(', ')
    });
  };

  // Add achievement from template
  const handleAddAchievement = (achievement: string) => {
    const currentAchievements = experienceFormData.achievements || '';
    const newAchievements = currentAchievements 
      ? `${currentAchievements}\n• ${achievement}`
      : `• ${achievement}`;
    setExperienceFormData({
      ...experienceFormData,
      achievements: newAchievements
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setLogoPreview(result);
          setExperienceFormData(prev => ({
            ...prev,
            companyLogo: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setExperienceFormData(prev => ({
      ...prev,
      companyLogo: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // FIXED: Map the offer form data to what pdfGenerator.js expects
  const handleGenerateOfferPDF = () => {
    // Map the new form fields to the expected format
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
      netSalary: 0,
      type: 'offer'
    });
    setShowSuccessModal(true);
  };

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
      month: salaryFormData.month,
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
        netSalary: 0,
        type: 'experience'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error generating experience letter:', error);
      alert('Failed to generate experience letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEmploymentDuration = () => {
    try {
      const start = new Date(experienceFormData.dateOfJoining);
      const end = new Date(experienceFormData.dateOfLeaving);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid dates';
      }
      
      const years = end.getFullYear() - start.getFullYear();
      const months = end.getMonth() - start.getMonth();
      const days = end.getDate() - start.getDate();
      
      let duration = '';
      
      if (years > 0) {
        duration += `${years} year${years > 1 ? 's' : ''}`;
        if (months > 0) {
          duration += ` ${months} month${months > 1 ? 's' : ''}`;
        }
      } else if (months > 0) {
        duration += `${months} month${months > 1 ? 's' : ''}`;
        if (days > 0) {
          duration += ` ${days} day${days > 1 ? 's' : ''}`;
        }
      } else if (days > 0) {
        duration += `${days} day${days > 1 ? 's' : ''}`;
      } else {
        duration = 'Less than a day';
      }
      
      return duration.trim();
    } catch (error) {
      return 'Error calculating duration';
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

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    const text = JSON.stringify({
      offerFormData,
      salaryFormData,
      experienceFormData
    }, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      alert('Data copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy data to clipboard');
    });
  };

  const handleResetForm = () => {
    if (activeTab === 'offer') {
      setOfferFormData({
        candidateName: '',
        jobTitle: '',
        joiningDate: '',
        ctc: '',
        reportingManager: '',
        workLocation: '',
        companyName: 'VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.',
        companyAddress: '1st Floor, Siyaram Mention, Opp. Telephone Exchange, Near P&M Mall\nKhurji, Patna, Bihar – 800024',
        companyPhone: '9973725719',
        companyEmail: 'support@creatorsmind.co.in',
        gstin: '10AAJCV6337M1Z2',
        offerDate: new Date().toLocaleDateString('en-GB'),
        hrName: 'Rani Shreya',
        hrDesignation: 'HR Manager'
      });
    } else if (activeTab === 'salary') {
      setSalaryFormData({
        employeeName: '',
        employeeId: '',
        designation: '',
        department: '',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        panNumber: '',
        basicSalary: '',
        hra: '',
        da: '',
        otherAllowances: '',
        pf: '',
        tds: '',
        professionalTax: ''
      });
    } else {
      setExperienceFormData({
        companyName: '',
        companyAddress: '',
        employeeName: '',
        employeeId: '',
        designation: '',
        department: '',
        dateOfJoining: new Date().toISOString().split('T')[0],
        dateOfLeaving: new Date().toISOString().split('T')[0],
        lastWorkingDay: new Date().toISOString().split('T')[0],
        reasonForLeaving: '',
        achievements: '',
        skills: '',
        managerName: '',
        managerDesignation: '',
        authorizedBy: '',
        authorizedSignature: '',
        companyLogo: null
      });
    }
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
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
              <button 
                onClick={() => setShowSuccessModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close modal"
              >
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
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>Document has been downloaded. Check your downloads folder.</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate offer letters, salary slips, and experience letters with our automated tools
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">10,000+</div>
              <div className="text-sm text-gray-600">Documents Generated</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">4.9★</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">2.5min</div>
              <div className="text-sm text-gray-600">Average Time Saved</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="w-full max-w-6xl mb-8">
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
              {[
                { id: 'offer', label: 'Offer Letter', icon: FileText, color: 'blue' },
                { id: 'salary', label: 'Salary Slip', icon: Calculator, color: 'green' },
                { id: 'experience', label: 'Experience Letter', icon: Award, color: 'purple' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-lg transition-all duration-300 ${activeTab === tab.id 
                    ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600` 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="w-full max-w-6xl mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${logoPreview ? 'bg-green-100' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Company Logo" className="h-8 w-8 object-contain" />
                    ) : (
                      <Building className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Branding</h3>
                    <p className="text-sm text-gray-500">
                      Upload your company logo to appear on all documents
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {logoPreview ? (
                    <>
                      <button
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove Logo</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Change Logo
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Upload Company Logo</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              {logoPreview && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Logo will appear on all generated documents
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="w-full max-w-6xl mb-6">
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Data</span>
              </button>
              <button
                onClick={handleResetForm}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Reset Form</span>
              </button>
            </div>
          </div>

          {/* Main Content - Offer Letter */}
          {activeTab === 'offer' && (
            <div className="w-full max-w-6xl space-y-8">
              {/* Offer Form */}
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
                  <div key={field.name} className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <field.icon className="h-4 w-4 mr-2 text-gray-400" />
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={offerFormData[field.name as keyof typeof offerFormData]}
                      onChange={handleOfferChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Company Address
                  </label>
                  <textarea
                    name="companyAddress"
                    value={offerFormData.companyAddress}
                    onChange={handleOfferChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Full company address"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateOfferPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/30 font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3"
              >
                <Download className="h-5 w-5" />
                <span>Generate Offer Letter PDF</span>
              </button>
            </div>
          )}

          {/* Main Content - Salary Slip */}
          {activeTab === 'salary' && (
            <div className="w-full max-w-6xl space-y-8">
              {/* Employee Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Employee Details
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={salaryFormData[field.name as keyof typeof salaryFormData]}
                        onChange={handleSalaryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earnings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Earnings
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Basic Salary", name: "basicSalary", placeholder: "e.g., 60000" },
                      { label: "House Rent Allowance (HRA)", name: "hra", placeholder: "e.g., 24000" },
                      { label: "Dearness Allowance (DA)", name: "da", placeholder: "e.g., 12000" },
                      { label: "Other Allowances", name: "otherAllowances", placeholder: "e.g., 5000" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
                          <span className="text-gray-400 mr-2">₹</span>
                          <input
                            type="text"
                            name={field.name}
                            value={salaryFormData[field.name as keyof typeof salaryFormData]}
                            onChange={handleSalaryChange}
                            className="flex-1 outline-none"
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Deductions
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Provident Fund (PF)", name: "pf", placeholder: "e.g., 7200", desc: "12% of Basic" },
                      { label: "Tax Deducted at Source (TDS)", name: "tds", placeholder: "e.g., 7500", desc: "As per tax slab" },
                      { label: "Professional Tax", name: "professionalTax", placeholder: "e.g., 200", desc: "State specific" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">₹</span>
                            <input
                              type="text"
                              name={field.name}
                              value={salaryFormData[field.name as keyof typeof salaryFormData]}
                              onChange={handleSalaryChange}
                              className="flex-1 outline-none text-lg font-semibold"
                              placeholder={field.placeholder}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">{field.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">₹{totals.totalEarnings.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Total Deductions</p>
                    <p className="text-3xl font-bold text-red-600">₹{totals.totalDeductions.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <p className="text-sm text-white/90 mb-2">Net Salary</p>
                    <p className="text-3xl font-bold text-white">₹{totals.netSalary.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-white/80 mt-2">After all deductions</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={handleGenerateSalaryPDF}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 px-6 rounded-xl hover:shadow-xl hover:shadow-green-500/25 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Download className="h-5 w-5" />
                  <span>Generate Salary Slip PDF</span>
                </button>
                
                <button
                  onClick={handlePrint}
                  className="border-2 border-gray-300 text-gray-700 py-5 px-6 rounded-xl hover:bg-gray-50 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Printer className="h-5 w-5" />
                  <span>Print Salary Slip</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content - Experience Letter */}
          {activeTab === 'experience' && (
            <div className="w-full max-w-6xl space-y-8">
              {/* Employment Duration Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Employment Duration</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{calculateEmploymentDuration()}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDisplayDate(experienceFormData.dateOfJoining)} - {formatDisplayDate(experienceFormData.dateOfLeaving)}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Key Skills</h4>
                    </div>
                    <p className="text-lg font-semibold text-blue-700">
                      {experienceFormData.skills.split(', ').filter(Boolean).length} Skills
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {experienceFormData.skills.split(', ').filter(Boolean).slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {experienceFormData.skills.split(', ').filter(Boolean).length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{experienceFormData.skills.split(', ').filter(Boolean).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Star className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Status</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="font-semibold text-green-700">Ready to Generate</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      All required fields are filled
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-purple-600" />
                    Company Details
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    Required
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={experienceFormData.companyName}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="e.g., TechCorp Solutions Pvt. Ltd."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address *
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={experienceFormData.companyAddress}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Full address with city, state, and pin code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Employee Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Employee Name *", name: "employeeName", placeholder: "Full Name", type: "text" },
                    { label: "Employee ID *", name: "employeeId", placeholder: "EMP001", type: "text" },
                    { label: "Designation *", name: "designation", placeholder: "Job Title", type: "text" },
                    { label: "Department *", name: "department", placeholder: "Department", type: "text" },
                    { label: "Date of Joining *", name: "dateOfJoining", type: "date" },
                    { label: "Date of Leaving *", name: "dateOfLeaving", type: "date" },
                    { label: "Last Working Day *", name: "lastWorkingDay", type: "date" },
                    { label: "Manager Name *", name: "managerName", placeholder: "Manager's Name", type: "text" },
                    { label: "Manager Designation *", name: "managerDesignation", placeholder: "Manager's Title", type: "text" },
                    { label: "Reason for Leaving", name: "reasonForLeaving", placeholder: "e.g., Better opportunity", type: "text" },
                    { label: "Authorized By *", name: "authorizedBy", placeholder: "e.g., HR Manager", type: "text" },
                    { label: "Authorized Signature *", name: "authorizedSignature", placeholder: "Name for signature", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={experienceFormData[field.name as keyof typeof experienceFormData] || ''}
                        onChange={handleExperienceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder={field.placeholder}
                        required={field.label.includes('*')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section with Quick Add */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-green-600" />
                    Skills & Technologies
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {experienceFormData.skills.split(', ').filter(Boolean).length} skills added
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Skills (Click to remove)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experienceFormData.skills.split(', ').filter(Boolean).map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveSkill(skill)}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-colors"
                      >
                        <span>{skill}</span>
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {experienceFormData.skills.split(', ').filter(Boolean).length === 0 && (
                      <p className="text-gray-500 italic">No skills added yet. Add skills from the templates below.</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <textarea
                      name="skills"
                      value={experienceFormData.skills}
                      onChange={handleExperienceChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Add skills separated by commas, or click on skills below..."
                    />
                    <div className="absolute right-3 top-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Skill Templates */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Quick Add Skills by Category:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {skillCategories.map((category, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          {category.title}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, skillIdx) => (
                            <button
                              key={skillIdx}
                              onClick={() => handleAddSkill(skill)}
                              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                    Key Achievements & Contributions
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                    Highly Recommended
                  </span>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Describe major achievements (one per line, use • for bullets)
                  </label>
                  <textarea
                    name="achievements"
                    value={experienceFormData.achievements}
                    onChange={handleExperienceChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all font-mono"
                    placeholder="• Led development of new features...
• Improved performance by 40%...
• Mentored junior team members..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Tip: Start each achievement with • for better formatting
                  </p>
                </div>
                
                {/* Achievement Templates */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Achievement Templates:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievementTemplates.map((template, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          {template.title}
                        </h5>
                        <div className="space-y-2">
                          {template.achievements.map((achievement, achievementIdx) => (
                            <button
                              key={achievementIdx}
                              onClick={() => handleAddAchievement(achievement)}
                              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                              <div className="flex items-start space-x-2">
                                <Rocket className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                  {achievement}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final Action Buttons */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center p-6 bg-white rounded-xl border border-purple-200">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Document Status</p>
                    <p className="text-lg font-bold text-purple-600">Ready to Generate</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl border border-blue-200">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Employment Period</p>
                    <p className="text-lg font-bold text-blue-600">{calculateEmploymentDuration()}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-white/90 mb-2">Professional Document</p>
                    <p className="text-lg font-bold text-white">Experience Letter</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={saveExperienceData}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Save form data"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Draft</span>
                    </button>
                    <button
                      onClick={() => {
                        const text = JSON.stringify(experienceFormData, null, 2);
                        navigator.clipboard.writeText(text).then(() => {
                          alert('Experience data copied to clipboard!');
                        });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Data</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        const previewData = {
                          type: 'experience',
                          data: experienceFormData,
                          logo: logoPreview,
                          duration: calculateEmploymentDuration()
                        };
                        localStorage.setItem('documentPreview', JSON.stringify(previewData));
                        window.open('/preview', '_blank');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <button
                    onClick={handleGenerateExperiencePDF}
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5 px-6 rounded-xl hover:shadow-xl hover:shadow-purple-500/25 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>Generate Experience Letter PDF</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleResetForm}
                    className="border-2 border-red-300 text-red-600 py-5 px-6 rounded-xl hover:bg-red-50 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Reset Experience Form</span>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Tip for Best Results:</p>
                      <p className="text-sm text-blue-600">
                        Add specific achievements with measurable results (e.g., "Improved performance by 40%", "Increased revenue by ₹50L"). 
                        This makes your experience letter more impactful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="w-full max-w-6xl mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">Complete HR document solution with professional templates and easy customization</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Offer Letters",
                  description: "Create professional offer letters with company branding and legal compliance",
                  features: ["Custom templates", "Company branding", "Legal compliance", "Easy editing"],
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Calculator,
                  title: "Salary Slips",
                  description: "Generate detailed salary slips with automatic calculations and tax compliance",
                  features: ["Auto calculations", "Tax compliance", "Multiple formats", "Print ready"],
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Award,
                  title: "Experience Letters",
                  description: "Create professional experience letters with detailed achievements and skills",
                  features: ["Detailed templates", "Achievements section", "Skills listing", "Professional format"],
                  color: "from-purple-500 to-pink-500"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-4xl mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">Ready to Streamline Your HR Documents?</h3>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of companies using our platform to create professional documents in minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/templates" 
                  className="inline-flex items-center justify-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Explore All Templates</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => alert('Demo scheduled! We will contact you soon.')}
                  className="inline-flex items-center justify-center space-x-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <span>Schedule a Demo</span>
                  <Phone className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footers />
    </>
  );
}