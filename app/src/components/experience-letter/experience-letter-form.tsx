// app/src/components/experience-letter/experience-letter-form.tsx
"use client";

import { useState, useRef } from "react";
import { 
  Award, 
  User, 
  Building, 
  Calendar, 
  GraduationCap, 
  Download, 
  Printer,
  FileText,
  Sparkles,
  Copy,
  RotateCcw,
  Save,
  Layout,
  CheckCircle,
  ChevronDown,
  Eye,
  X,
  FileCode,
  Briefcase,
  TrendingUp,
  FileSignature
} from 'lucide-react';
import { generateExperienceLetterPDF, ExperienceLetterData, experienceTemplates } from "@/app/utils/experienceLetterGenerator";

interface ExperienceFormData extends Omit<ExperienceLetterData, 'companyLogo'> {}

export default function ExperienceLetterForm({ companyLogo }: { companyLogo: string | null }) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    companyName: 'VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD',
    companyAddress: '1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall',
    employeeName: 'Dharm Kumar',
    employeeId: 'CM12',
    designation: 'Senior Developer',
    department: 'Engineering',
    dateOfJoining: '12 March 2022',
    dateOfLeaving: '15 March 2024',
    lastWorkingDay: '15 March 2024',
    reasonForLeaving: 'Career growth opportunity and personal development',
    achievements: '• Successfully led development of 3 major features\n• Improved application performance by 40%\n• Mentored 2 junior developers\n• Received "Employee of the Quarter" award\n• Implemented CI/CD pipeline reducing deployment time by 70%',
    skills: 'React, Next.js, TypeScript, Node.js, MongoDB, AWS, Docker, Git, Agile Methodologies',
    managerName: 'Priya Verma',
    managerDesignation: 'Engineering Manager',
    authorizedBy: 'Amit Khanna',
    authorizedSignature: 'A. Khanna'
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (templateKey: keyof typeof experienceTemplates) => {
    const template = experienceTemplates[templateKey];
    setFormData(prev => ({
      ...prev,
      achievements: template.achievements,
      skills: template.skills
    }));
    setShowTemplates(false);
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    const experienceData: ExperienceLetterData = {
      ...formData,
      companyLogo
    };

    setTimeout(() => {
      generateExperienceLetterPDF(experienceData);
      setIsGenerating(false);
      
      // Show success animation
      const btn = document.getElementById('generate-btn');
      if (btn) {
        btn.classList.add('bg-green-600');
        setTimeout(() => {
          btn.classList.remove('bg-green-600');
        }, 1000);
      }
    }, 500);
  };

  const handleResetForm = () => {
    setFormData({
      companyName: 'VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD',
      companyAddress: '1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall',
      employeeName: '',
      employeeId: '',
      designation: '',
      department: '',
      dateOfJoining: '',
      dateOfLeaving: '',
      lastWorkingDay: '',
      reasonForLeaving: '',
      achievements: '',
      skills: '',
      managerName: '',
      managerDesignation: '',
      authorizedBy: '',
      authorizedSignature: ''
    });
  };

  const handleCopyToClipboard = () => {
    const text = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(text);
    
    // Show feedback
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '<CheckCircle className="h-4 w-4" /> Copied!';
      setTimeout(() => {
        btn.innerHTML = original;
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header - Same as Salary Slip */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileSignature className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Professional Experience Letter Generator</h1>
              <p className="text-indigo-100 mt-1">Create compliant experience certificates for employees</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              id="copy-btn"
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Company & Employee Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Building className="h-5 w-5 mr-2 text-indigo-600" />
              Company Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Company name is pre-filled for VATS CREATIVE</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter company address"
                />
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</p>
                    <p className="text-sm text-blue-700 mt-1">GSTIN: 10A0CV6337M1Z2 | Phone: 9973725719</p>
                    <p className="text-sm text-blue-700">Email: support@creatorsmind.co.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              Employee Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Employee Name', name: 'employeeName', placeholder: 'Full Name', icon: User },
                { label: 'Employee ID', name: 'employeeId', placeholder: 'CM12', icon: FileText },
                { label: 'Designation', name: 'designation', placeholder: 'Senior Developer', icon: Briefcase },
                { label: 'Department', name: 'department', placeholder: 'Engineering', icon: Building },
                { label: 'Date of Joining', name: 'dateOfJoining', placeholder: '12 March 2022', icon: Calendar },
                { label: 'Date of Leaving', name: 'dateOfLeaving', placeholder: '15 March 2024', icon: Calendar },
                { label: 'Last Working Day', name: 'lastWorkingDay', placeholder: '15 March 2024', icon: Calendar },
                { label: 'Reason for Leaving', name: 'reasonForLeaving', placeholder: 'Career growth opportunity', icon: TrendingUp },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <field.icon className="h-4 w-4 mr-2 text-gray-500" />
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name as keyof ExperienceFormData]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Skills Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4 md:mb-0">
                <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                Professional Details
              </h3>
              
              <div className="relative">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center space-x-2 text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Layout className="h-4 w-4" />
                  <span>Quick Templates</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                </button>
                
                {showTemplates && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                    {Object.entries(experienceTemplates).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => handleTemplateSelect(key as keyof typeof experienceTemplates)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Click to apply template</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-600" />
                    Key Achievements
                  </span>
                  <span className="text-gray-500 text-sm font-normal">(One per line, use • for bullet points)</span>
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-mono text-sm"
                  placeholder="• Successfully led development of 3 major features\n• Improved application performance by 40%\n• Mentored 2 junior developers..."
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formData.achievements.split('\n').length} bullet points
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">
                    Pro tip: Use specific metrics and numbers
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-600" />
                  Skills Acquired & Demonstrated
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                  placeholder="React, Next.js, TypeScript, Node.js, MongoDB, AWS, Docker, Git, Agile Methodologies..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, index) => (
                    skill.trim() && (
                      <span key={index} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                        {skill.trim()}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Authorization Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Authorization & Signatures</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Manager's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Designation
                  </label>
                  <input
                    type="text"
                    name="managerDesignation"
                    value={formData.managerDesignation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., Engineering Manager"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized By
                  </label>
                  <input
                    type="text"
                    name="authorizedBy"
                    value={formData.authorizedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., HR Manager"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Signature
                  </label>
                  <input
                    type="text"
                    name="authorizedSignature"
                    value={formData.authorizedSignature}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Signature name"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Note:</span> Signatures will appear in the PDF as provided. 
                    Ensure names match official records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-8">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Live Preview
            </h3>
            
            <div className="space-y-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-gray-900 text-lg">{formData.employeeName}</div>
                  <div className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    {formData.employeeId}
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">{formData.designation}</div>
                <div className="text-xs text-gray-500 mb-3">{formData.department}</div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formData.dateOfJoining} to {formData.dateOfLeaving}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-600" />
                    Top 3 Achievements:
                  </div>
                  <ul className="space-y-1">
                    {formData.achievements.split('\n').slice(0, 3).map((line, index) => (
                      line.trim() && (
                        <li key={index} className="flex items-start text-xs">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{line.replace('•', '').trim()}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center text-sm text-gray-600">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Preview updates in real-time as you type
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate & Export</h3>
            
            <div className="space-y-4">
              <button
                id="generate-btn"
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center space-x-3 ${
                  isGenerating 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                } text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 group`}
              >
                {isGenerating ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6 group-hover:animate-bounce" />
                    <div className="text-left">
                      <span className="font-bold text-lg block">Download PDF</span>
                      <span className="text-indigo-100 text-sm">Professional experience letter</span>
                    </div>
                  </>
                )}
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Printer className="h-5 w-5" />
                <div className="text-left">
                  <span className="font-semibold block">Print Copy</span>
                  <span className="text-gray-500 text-sm">Print for physical records</span>
                </div>
              </button>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleResetForm}
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="font-medium">Reset Form</span>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.setItem('experienceTemplate', JSON.stringify(formData));
                    alert('Template saved successfully!');
                  }}
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span className="font-medium">Save Template</span>
                </button>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Pro Tips
              </h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Use bullet points for better readability
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Include specific metrics and achievements
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Keep dates in consistent format
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Use positive language throughout
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Templates Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Templates</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.softwareEngineer.achievements,
                    skills: experienceTemplates.softwareEngineer.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all hover:shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <FileCode className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="font-bold text-gray-900">Software Engineer</div>
                </div>
                <div className="text-sm text-gray-600">Perfect for tech roles with coding achievements</div>
              </button>
              
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.seniorDeveloper.achievements,
                    skills: experienceTemplates.seniorDeveloper.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all hover:shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                  <div className="font-bold text-gray-900">Senior Developer</div>
                </div>
                <div className="text-sm text-gray-600">For experienced developers with leadership</div>
              </button>
              
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.teamLead.achievements,
                    skills: experienceTemplates.teamLead.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all hover:shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                  <div className="font-bold text-gray-900">Team Lead</div>
                </div>
                <div className="text-sm text-gray-600">Ideal for leadership and management roles</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Experience Letter Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8">
              {/* Preview Content */}
              <div className="border-2 border-gray-300 rounded-lg p-8 bg-white shadow-inner">
                {/* Company Header Preview */}
                <div className="bg-indigo-700 text-white p-6 rounded-t-lg mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</div>
                    <div className="text-sm opacity-90">1st Floor, Siyaram Mention, Opposite Telephone Exchange, Near P&M Mall</div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-xl font-bold text-gray-900 mb-2">EXPERIENCE CERTIFICATE</div>
                  <div className="text-gray-600">For the period of {formData.dateOfJoining} to {formData.dateOfLeaving}</div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700">
                    This is to certify that <strong>{formData.employeeName}</strong> (Employee ID: {formData.employeeId}) 
                    was employed with <strong>VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</strong> as a <strong>{formData.designation}</strong> 
                    in the <strong>{formData.department}</strong> department.
                  </p>
                  
                  <p className="text-gray-700">
                    Served from <strong>{formData.dateOfJoining}</strong> to <strong>{formData.dateOfLeaving}</strong>.
                    {formData.reasonForLeaving && ` The reason for leaving is ${formData.reasonForLeaving}.`}
                  </p>
                  
                  <div>
                    <strong className="text-gray-900">Key Achievements:</strong>
                    <div className="mt-2 text-gray-700 whitespace-pre-line">
                      {formData.achievements}
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-900">Skills Acquired:</strong>
                    <div className="mt-2 text-gray-700">{formData.skills}</div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="font-bold text-gray-900">{formData.managerName}</div>
                        <div className="text-gray-600">{formData.managerDesignation}</div>
                        <div className="text-gray-500 text-sm mt-2">VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</div>
                        <div className="mt-4 pt-2 border-t border-gray-300">
                          <div className="text-xs text-gray-500">Signature: __________________</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formData.authorizedBy}</div>
                        <div className="text-gray-600">Authorized Signatory</div>
                        <div className="text-gray-500 text-sm mt-2">VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD</div>
                        <div className="mt-4 pt-2 border-t border-gray-300">
                          <div className="text-xs text-gray-500">Signature & Stamp: _______________</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  Generate PDF Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}