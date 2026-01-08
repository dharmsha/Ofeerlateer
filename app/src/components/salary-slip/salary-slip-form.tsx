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
  Save
} from 'lucide-react';
import { generateSalarySlipPDF } from "@/app/utils/salarySlipGenerator";

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
}

interface SalaryData {
  basicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  components: SalaryComponent[];
}

export default function SalarySlipForm() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [employee, setEmployee] = useState<EmployeeData>({
    employeeName: 'Dharm Kumar',
    employeeId: 'CM12',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F'
  });

  const [salary, setSalary] = useState<SalaryData>({
    basicSalary: 60000,
    totalEarnings: 85000,
    totalDeductions: 15000,
    netSalary: 70000,
    components: [
      { type: 'earning', name: 'Basic Salary', amount: 60000, isPercentage: false },
      { type: 'earning', name: 'House Rent Allowance', amount: 12000, isPercentage: false },
      { type: 'earning', name: 'Special Allowance', amount: 8000, isPercentage: false },
      { type: 'earning', name: 'Performance Bonus', amount: 5000, isPercentage: false },
      { type: 'deduction', name: 'Provident Fund', amount: 7200, isPercentage: true, percentageOf: 'Basic' },
      { type: 'deduction', name: 'Professional Tax', amount: 200, isPercentage: false },
      { type: 'deduction', name: 'TDS', amount: 7600, isPercentage: false },
    ]
  });

  const [newComponent, setNewComponent] = useState<Omit<SalaryComponent, 'amount'>>({
    type: 'earning',
    name: '',
    isPercentage: false,
    percentageOf: 'Basic'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // Handle employee data changes
  const handleEmployeeChange = (field: keyof EmployeeData, value: string) => {
    setEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle salary component changes
  const handleComponentChange = (index: number, field: keyof SalaryComponent, value: any) => {
    const updatedComponents = [...salary.components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    
    // Recalculate totals
    const totalEarnings = updatedComponents
      .filter(c => c.type === 'earning')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDeductions = updatedComponents
      .filter(c => c.type === 'deduction')
      .reduce((sum, c) => sum + c.amount, 0);
    
    setSalary(prev => ({
      ...prev,
      components: updatedComponents,
      totalEarnings,
      totalDeductions,
      netSalary: totalEarnings - totalDeductions
    }));
  };

  // Add new component
  const handleAddComponent = () => {
    if (!newComponent.name) return;

    const amount = newComponent.isPercentage 
      ? (salary.basicSalary * parseFloat(prompt('Enter percentage:') || '0')) / 100
      : parseFloat(prompt('Enter amount:') || '0');

    const updatedComponents = [
      ...salary.components,
      { ...newComponent, amount }
    ];

    // Recalculate totals
    const totalEarnings = updatedComponents
      .filter(c => c.type === 'earning')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDeductions = updatedComponents
      .filter(c => c.type === 'deduction')
      .reduce((sum, c) => sum + c.amount, 0);

    setSalary(prev => ({
      ...prev,
      components: updatedComponents,
      totalEarnings,
      totalDeductions,
      netSalary: totalEarnings - totalDeductions
    }));

    setNewComponent({
      type: 'earning',
      name: '',
      isPercentage: false,
      percentageOf: 'Basic'
    });
  };

  // Remove component
  const handleRemoveComponent = (index: number) => {
    const updatedComponents = salary.components.filter((_, i) => i !== index);
    
    const totalEarnings = updatedComponents
      .filter(c => c.type === 'earning')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDeductions = updatedComponents
      .filter(c => c.type === 'deduction')
      .reduce((sum, c) => sum + c.amount, 0);

    setSalary(prev => ({
      ...prev,
      components: updatedComponents,
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

  // Generate PDF
  const handleGeneratePDF = () => {
    generateSalarySlipPDF({
      month: currentMonth,
      employee,
      salary,
      companyLogo
    });
  };

  // Preview salary slip
  const handlePreview = () => {
    alert('Preview functionality would open a modal with PDF preview');
  };

  // Save as template
  const handleSaveTemplate = () => {
    const template = {
      month: currentMonth,
      employee,
      salary,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('salarySlipTemplate', JSON.stringify(template));
    alert('Template saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Salary Slip Generator</h1>
              <p className="text-blue-100">Generate professional salary slips in minutes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSaveTemplate}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Template</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Employee Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Logo & Month */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Details</h3>
                <div className="flex items-center space-x-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {companyLogo ? (
                      <img src={companyLogo} alt="Company Logo" className="h-16 w-16 object-contain" />
                    ) : (
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload Logo</p>
                      </div>
                    )}
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
                      className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer block text-center mt-2"
                    >
                      {companyLogo ? 'Change' : 'Upload'}
                    </label>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">VATS CREATIVE DIGITAL SOLUTIONS PVT.LTD</p>
                    <p className="text-sm text-gray-500">opposite Telephone Exchange, Near P&M Mall</p>
                    <p className="text-sm text-gray-500">GSTIN: 10AAJCV6337M1Z2</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Month</h3>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="bg-transparent text-lg font-semibold text-gray-900 text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Employee Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Employee Name', field: 'employeeName', icon: User },
                { label: 'Employee ID', field: 'employeeId', icon: FileText },
                { label: 'Designation', field: 'designation', icon: Building },
                { label: 'Department', field: 'department', icon: Building },
                { label: 'Bank Name', field: 'bankName', icon: Banknote },
                { label: 'Account Number', field: 'accountNumber', icon: FileText },
                { label: 'IFSC Code', field: 'ifscCode', icon: FileText },
                { label: 'PAN Number', field: 'panNumber', icon: FileText },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.label}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                    <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={employee[item.field as keyof EmployeeData]}
                      onChange={(e) => handleEmployeeChange(item.field as keyof EmployeeData, e.target.value)}
                      className="flex-1 outline-none text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Components */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                Salary Components
              </h3>
              
              <div className="flex space-x-3">
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                  Earnings: ₹{salary.totalEarnings.toLocaleString()}
                </div>
                <div className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-sm font-medium">
                  Deductions: ₹{salary.totalDeductions.toLocaleString()}
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                  Net: ₹{salary.netSalary.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Earnings Table */}
            <div className="mb-8">
              <h4 className="font-semibold text-green-700 mb-4">Earnings</h4>
              <div className="space-y-3">
                {salary.components
                  .filter(c => c.type === 'earning')
                  .map((component, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Percent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{component.name}</p>
                          <p className="text-sm text-gray-500">
                            {component.isPercentage 
                              ? `${(component.amount / salary.basicSalary * 100).toFixed(1)}% of Basic`
                              : 'Fixed Amount'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{component.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveComponent(
                            salary.components.findIndex(c => 
                              c.name === component.name && c.type === component.type
                            )
                          )}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Deductions Table */}
            <div>
              <h4 className="font-semibold text-red-700 mb-4">Deductions</h4>
              <div className="space-y-3">
                {salary.components
                  .filter(c => c.type === 'deduction')
                  .map((component, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Percent className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{component.name}</p>
                          <p className="text-sm text-gray-500">
                            {component.isPercentage 
                              ? `${(component.amount / salary.basicSalary * 100).toFixed(1)}% of Basic`
                              : 'Fixed Amount'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{component.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveComponent(
                            salary.components.findIndex(c => 
                              c.name === component.name && c.type === component.type
                            )
                          )}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Add New Component */}
            <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Add New Component</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newComponent.type}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, type: e.target.value as 'earning' | 'deduction' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
                  <input
                    type="text"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Travel Allowance"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleAddComponent}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Component</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-semibold text-gray-900">₹{salary.basicSalary.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-semibold text-green-600">+ ₹{salary.totalEarnings.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-semibold text-red-600">- ₹{salary.totalDeductions.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Net Salary</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{salary.netSalary.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  In words: {numberToWords(salary.netSalary)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleGeneratePDF}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span className="font-semibold">Download Salary Slip (PDF)</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span className="font-semibold">Print Salary Slip</span>
              </button>
              
              <button
                onClick={() => alert('Share functionality')}
                className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span className="font-semibold">Share with Employee</span>
              </button>
            </div>
            
            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Quick Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All amounts are in Indian Rupees (₹)</li>
                <li>• PF is calculated as 12% of Basic Salary</li>
                <li>• Professional tax varies by state</li>
                <li>• TDS is calculated based on tax slabs</li>
              </ul>
            </div>
          </div>

          {/* Recent Templates */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Templates</h3>
            
            <div className="space-y-3">
              {['January 2024', 'December 2023', 'November 2023'].map((month) => (
                <div key={month} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{month}</p>
                      <p className="text-sm text-gray-500">Software Engineering</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert number to words
function numberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  
  const b = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy',
    'Eighty', 'Ninety'
  ];

  if (num === 0) return 'Zero';
  
  let words = '';
  
  // Crores
  if (Math.floor(num / 10000000) > 0) {
    words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  
  // Lakhs
  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  
  // Thousands
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  // Hundreds
  if (Math.floor(num / 100) > 0) {
    words += numberToWords(Math.floor(num / 100)) + ' Hundred ';
    num %= 100;
  }
  
  if (num > 0) {
    if (num < 20) {
      words += a[num];
    } else {
      words += b[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += ' ' + a[num % 10];
      }
    }
  }
  
  return words.trim() + ' Rupees Only';
}