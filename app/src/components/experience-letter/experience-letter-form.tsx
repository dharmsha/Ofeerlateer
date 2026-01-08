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
  LayoutTemplate, // ✅ Correct icon name
  CheckCircle,
  ChevronDown,
  Eye,
  X,
  FileCode,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { generateExperienceLetterPDF, ExperienceLetterData, experienceTemplates } from "@/app/utils/experienceLetterGenerator";

interface ExperienceFormData extends Omit<ExperienceLetterData, 'companyLogo'> {}

export default function ExperienceLetterForm({ companyLogo }: { companyLogo: string | null }) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    companyName: 'VATS CREATIVE DIGITAL SOLUTIONS Pvt. Ltd',
    companyAddress: '1 ST Floor, Siyaram Mention,opposite Telephone Exchange, Near P&M Mall ',
    employeeName: 'Dharm Kumar',
    employeeId: 'EMP001',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    dateOfJoining: '01-01-2022',
    dateOfLeaving: '31-12-2023',
    lastWorkingDay: '31-12-2023',
    reasonForLeaving: 'Better career opportunity',
    achievements: '• Successfully led development of 3 major features\n• Improved application performance by 40%\n• Mentored 2 junior developers\n• Received "Employee of the Quarter" award',
    skills: 'React, Next.js, TypeScript, Node.js, MongoDB, AWS, Git, Agile Methodologies',
    managerName: 'Shrikant Kumar',
    managerDesignation: 'Engineering Manager',
    authorizedBy: 'HR Manager',
    authorizedSignature: 'Shrikant Kumar'
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
      companyName: '',
      companyAddress: '',
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Experience Letter Generator</h1>
              <p className="text-purple-100">Create professional experience letters in minutes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" /> {/* ✅ Changed from FileText */}
              <span>Preview</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              id="copy-btn"
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
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
              <Building className="h-5 w-5 mr-2 text-purple-600" />
              Company Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter company address"
                />
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Employee Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Employee Name', name: 'employeeName', placeholder: 'Full Name' },
                { label: 'Employee ID', name: 'employeeId', placeholder: 'EMP001' },
                { label: 'Designation', name: 'designation', placeholder: 'Job Title' },
                { label: 'Department', name: 'department', placeholder: 'Department' },
                { label: 'Date of Joining', name: 'dateOfJoining', placeholder: 'DD-MM-YYYY' },
                { label: 'Date of Leaving', name: 'dateOfLeaving', placeholder: 'DD-MM-YYYY' },
                { label: 'Last Working Day', name: 'lastWorkingDay', placeholder: 'DD-MM-YYYY' },
                { label: 'Reason for Leaving', name: 'reasonForLeaving', placeholder: 'Reason for leaving' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name as keyof ExperienceFormData]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Skills Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
              Professional Details
            </h3>
            
            {/* Template Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Quick Templates</h4>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-800"
                >
                  <LayoutTemplate className="h-4 w-4" /> {/* ✅ Changed from Template */}
                  <span>Select Template</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {showTemplates && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 animate-fadeIn">
                  {Object.entries(experienceTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleTemplateSelect(key as keyof typeof experienceTemplates)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                      <div className="text-xs text-gray-500">Click to apply template</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievements
                  <span className="text-gray-500 text-sm ml-2">(One per line, use • for bullet points)</span>
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  placeholder="Enter key achievements and contributions..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Acquired
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  placeholder="Enter skills and technologies learned..."
                />
              </div>
            </div>
          </div>

          {/* Authorization Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Authorization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Name
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Manager's name"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Manager's designation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorized By
                </label>
                <input
                  type="text"
                  name="authorizedBy"
                  value={formData.authorizedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Name for signature"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-8">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Preview</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{formData.employeeName}</div>
                  <div className="text-sm text-gray-500">{formData.employeeId}</div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{formData.designation}</div>
                <div className="text-xs text-gray-500">{formData.department}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {formData.dateOfJoining} - {formData.dateOfLeaving}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">Highlights:</div>
                <ul className="space-y-1">
                  {formData.achievements.split('\n').slice(0, 3).map((line, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-xs">{line.replace('•', '').trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Real-time preview updates as you type
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
            
            <div className="space-y-4">
              <button
                id="generate-btn"
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center space-x-3 ${
                  isGenerating 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                } text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                {isGenerating ? (
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
                onClick={() => window.print()}
                className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span>Print Experience Letter</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleResetForm}
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Form</span>
                </button>
                
                <button
                  onClick={() => {/* Save functionality */}}
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </div>
            
            {/* Tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">💡 Pro Tips</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Use bullet points (•) for achievements
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Include specific metrics and numbers
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Keep language professional and positive
                </li>
              </ul>
            </div>
          </div>

          {/* Template Examples */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Examples</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.softwareEngineer.achievements,
                    skills: experienceTemplates.softwareEngineer.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <FileCode className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="font-medium text-gray-900">Software Engineer</div>
                </div>
                <div className="text-sm text-gray-600">Perfect for tech roles with coding achievements</div>
              </button>
              
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.marketingManager.achievements,
                    skills: experienceTemplates.marketingManager.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <div className="font-medium text-gray-900">Marketing Manager</div>
                </div>
                <div className="text-sm text-gray-600">Great for marketing and campaign roles</div>
              </button>
              
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    achievements: experienceTemplates.salesExecutive.achievements,
                    skills: experienceTemplates.salesExecutive.skills
                  }));
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <Briefcase className="h-5 w-5 text-orange-600 mr-2" />
                  <div className="font-medium text-gray-900">Sales Executive</div>
                </div>
                <div className="text-sm text-gray-600">Ideal for sales and business development roles</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Experience Letter Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" /> {/* ✅ Changed from ✕ to X icon */}
              </button>
            </div>
            
            <div className="p-8">
              {/* Preview Content */}
              <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
                <div className="text-center mb-8">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{formData.companyName}</div>
                  <div className="text-gray-600">{formData.companyAddress}</div>
                  <div className="h-px bg-gradient-to-r from-purple-500 to-pink-500 my-6"></div>
                  <div className="text-xl font-bold text-gray-900">EXPERIENCE CERTIFICATE</div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700">
                    This is to certify that <strong>{formData.employeeName}</strong> (Employee ID: {formData.employeeId}) 
                    was employed with <strong>{formData.companyName}</strong> as a <strong>{formData.designation}</strong> 
                    in the <strong>{formData.department}</strong> department.
                  </p>
                  
                  <p className="text-gray-700">
                    Served from <strong>{formData.dateOfJoining}</strong> to <strong>{formData.dateOfLeaving}</strong>.
                  </p>
                  
                  {formData.reasonForLeaving && (
                    <p className="text-gray-700">
                      Reason for leaving: {formData.reasonForLeaving}
                    </p>
                  )}
                  
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
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{formData.managerName}</div>
                        <div className="text-gray-600">{formData.managerDesignation}</div>
                        <div className="text-gray-500 text-sm">{formData.companyName}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formData.authorizedBy}</div>
                        <div className="text-gray-600">Authorized Signatory</div>
                        <div className="text-gray-500 text-sm mt-4">Signature: _______________</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}