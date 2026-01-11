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
  Phone
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
    designation: 'Senior Developer',
    department: 'Engineering',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F'
  });

  // Salary state को ये update करो
const [salary, setSalary] = useState<SalaryData>({
  basicSalary: 60000,
  totalEarnings: 101000, // ये सही करो - 60,000 + 24,000 + 12,000 + 5,000 = 101,000
  totalDeductions: 15000, // 7,200 + 200 + 7,600 = 15,000
  netSalary: 86000, // 101,000 - 15,000 = 86,000
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

  const [newComponent, setNewComponent] = useState<Omit<SalaryComponent, 'amount'>>({
    type: 'earning',
    name: '',
    isPercentage: false,
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

  // Generate PDF
  const handleGeneratePDF = () => {
    generateSalarySlipPDF({
      month: currentMonth,
      employee,
      salary,
      companyLogo
    });
  };

  // Format currency with ₹ symbol
  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

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
              <p className="text-indigo-100 mt-1">Generate compliant salary slips with Indian Rupee (₹) formatting</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => alert('Preview functionality')}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => {
                const template = { month: currentMonth, employee, salary };
                localStorage.setItem('salaryTemplate', JSON.stringify(template));
                alert('Template saved!');
              }}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Employee Details */}
        <div className="lg:col-span-2 space-y-8">
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
                          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
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
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3 w-64">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="flex-1 bg-transparent text-lg font-semibold text-gray-900 outline-none"
                    placeholder="Month Year"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              Employee Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Employee Name', field: 'employeeName', icon: User },
                { label: 'Employee ID', field: 'employeeId', icon: Hash },
                { label: 'Designation', field: 'designation', icon: Briefcase },
                { label: 'Department', field: 'department', icon: Building },
                { label: 'Bank Name', field: 'bankName', icon: Banknote },
                { label: 'Account Number', field: 'accountNumber', icon: CreditCard },
                { label: 'IFSC Code', field: 'ifscCode', icon: FileText },
                { label: 'PAN Number', field: 'panNumber', icon: FileText },
              ].map((item) => (
                <div key={item.field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                      {item.label}
                    </div>
                  </label>
                  <input
                    type="text"
                    value={employee[item.field as keyof EmployeeData]}
                    onChange={(e) => handleEmployeeChange(item.field as keyof EmployeeData, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Salary Components */}
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

            {/* Earnings Section */}
            <div className="mb-10">
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
                  .map((component, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Percent className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{component.name}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            {component.isPercentage ? (
                              <>
                                <Percent className="h-3 w-3 mr-1" />
                                {(component.amount / salary.basicSalary * 100).toFixed(1)}% of Basic
                              </>
                            ) : (
                              'Fixed Amount'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(component.amount)}
                        </span>
                        <button
                          onClick={() => handleRemoveComponent(
                            salary.components.findIndex(c => 
                              c.name === component.name && c.type === component.type
                            )
                          )}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove component"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Deductions Section */}
            <div>
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
                  .map((component, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Percent className="h-6 w-6 text-red-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{component.name}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            {component.isPercentage ? (
                              <>
                                <Percent className="h-3 w-3 mr-1" />
                                {(component.amount / salary.basicSalary * 100).toFixed(1)}% of Basic
                              </>
                            ) : (
                              'Fixed Amount'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(component.amount)}
                        </span>
                        <button
                          onClick={() => handleRemoveComponent(
                            salary.components.findIndex(c => 
                              c.name === component.name && c.type === component.type
                            )
                          )}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove component"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Add New Component */}
            <div className="mt-10 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-6 text-lg">Add New Salary Component</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newComponent.type}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, type: e.target.value as 'earning' | 'deduction' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleAddComponent}
                    disabled={!newComponent.name.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Add Component</span>
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
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
              Salary Summary
            </h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div className="space-y-1">
                  <span className="text-gray-600 block">Basic Salary</span>
                  <span className="text-xs text-gray-500">Foundation of salary structure</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{formatCurrency(salary.basicSalary)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div className="space-y-1">
                  <span className="text-green-600 font-medium block">Total Earnings</span>
                  <span className="text-xs text-gray-500">Sum of all allowances</span>
                </div>
                <span className="font-bold text-green-600 text-xl">+ {formatCurrency(salary.totalEarnings)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div className="space-y-1">
                  <span className="text-red-600 font-medium block">Total Deductions</span>
                  <span className="text-xs text-gray-500">Taxes & contributions</span>
                </div>
                <span className="font-bold text-red-600 text-xl">- {formatCurrency(salary.totalDeductions)}</span>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-gray-900">Net Salary Payable</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(salary.netSalary)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                  <span className="font-medium text-indigo-800 block mb-1">In words:</span>
                  {numberToWords(salary.netSalary)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate & Export</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleGeneratePDF}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
              >
                <Download className="h-6 w-6 group-hover:animate-bounce" />
                <div className="text-left">
                  <span className="font-bold text-lg block">Download PDF</span>
                  <span className="text-indigo-100 text-sm">Professional salary slip with ₹ formatting</span>
                </div>
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
              
              <button
                onClick={() => {
                  const slipData = { month: currentMonth, employee, salary };
                  navigator.clipboard.writeText(JSON.stringify(slipData, null, 2));
                  alert('Salary slip data copied to clipboard!');
                }}
                className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <div className="text-left">
                  <span className="font-semibold block">Share Data</span>
                  <span className="text-gray-500 text-sm">Copy as JSON/Email</span>
                </div>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Quick Stats
              </h4>
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
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Compliance Tips
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">₹</span>
                </div>
                <p className="text-sm text-amber-700">All amounts must include Indian Rupee symbol (₹)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">%</span>
                </div>
                <p className="text-sm text-amber-700">PF is 12% of Basic + DA (if applicable)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">📋</span>
                </div>
                <p className="text-sm text-amber-700">Include PAN, Bank details for compliance</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">🔒</span>
                </div>
                <p className="text-sm text-amber-700">Mask sensitive info (Account number: XXXX1234)</p>
              </div>
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

  if (num === 0) return 'Zero Rupees Only';
  
  // Separate rupees and paise
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let words = '';
  
  // Convert rupees
  let n = rupees;
  
  // Crores
  if (Math.floor(n / 10000000) > 0) {
    words += numberToWords(Math.floor(n / 10000000)) + ' Crore ';
    n %= 10000000;
  }
  
  // Lakhs
  if (Math.floor(n / 100000) > 0) {
    words += numberToWords(Math.floor(n / 100000)) + ' Lakh ';
    n %= 100000;
  }
  
  // Thousands
  if (Math.floor(n / 1000) > 0) {
    words += numberToWords(Math.floor(n / 1000)) + ' Thousand ';
    n %= 1000;
  }
  
  // Hundreds
  if (Math.floor(n / 100) > 0) {
    words += numberToWords(Math.floor(n / 100)) + ' Hundred ';
    n %= 100;
  }
  
  // Tens and Ones
  if (n > 0) {
    if (n < 20) {
      words += a[n];
    } else {
      words += b[Math.floor(n / 10)];
      if (n % 10 > 0) {
        words += ' ' + a[n % 10];
      }
    }
  }
  
  // Add "Rupees" if there are rupees
  if (rupees > 0) {
    words += ' Rupee' + (rupees === 1 ? '' : 's');
  }
  
  // Add paise if exists
  if (paise > 0) {
    if (words) words += ' and ';
    if (paise < 20) {
      words += a[paise] + ' Paise';
    } else {
      words += b[Math.floor(paise / 10)];
      if (paise % 10 > 0) {
        words += ' ' + a[paise % 10] + ' Paise';
      } else {
        words += ' Paise';
      }
    }
  }
  
  return words.trim() + ' Only';
}