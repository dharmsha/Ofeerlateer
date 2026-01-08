// app/experience-letter/page.tsx
"use client";

import { useState, useRef } from "react";
import ExperienceLetterForm from "@/app/src/components/experience-letter/experience-letter-form";
import Navbar from "@/app/src/components/Header/Navbar";
import Fotters from "@/app/src/components/Footer/fotters";
import { 
  Award,
  Building,
  Sparkles,
  FileText,
  Users,
  Shield,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ExperienceLetterPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4">
              <Award className="h-5 w-5" />
              <span className="font-medium">Experience Letter Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Professional Experience Letters</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate detailed experience certificates with achievements, skills, and professional formatting
            </p>
          </div>

          {/* Logo Upload Section */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${logoPreview ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'}`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-8 w-8" />
                    ) : (
                      <Building className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Logo</h3>
                    <p className="text-sm text-gray-500">
                      {logoPreview ? 'Logo uploaded successfully!' : 'Upload company logo for professional branding'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {logoPreview ? (
                    <>
                      <button
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove Logo
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
                        className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Upload Company Logo</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <ExperienceLetterForm companyLogo={logoPreview} />

          {/* Features Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-b from-white to-purple-50 rounded-2xl border border-purple-100">
                <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Templates</h3>
                <p className="text-gray-600">
                  Pre-designed templates for different roles and industries
                </p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-b from-white to-blue-50 rounded-2xl border border-blue-100">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">HR Approved</h3>
                <p className="text-gray-600">
                  Content format approved by HR professionals and recruiters
                </p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-b from-white to-green-50 rounded-2xl border border-green-100">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy First</h3>
                <p className="text-gray-600">
                  Your data never leaves your device. Complete privacy guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Fotters />
    </>
  );
}