"use client";

import { useState, useRef } from "react";
import { generatePDF } from "@/app/utils/pdfGenerator";

type FormDataType = {
  name: string;
  designation: string;
  joiningDate: string;
  ctc: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "Dharam Kumar",
    designation: "Mern Developer",
    joiningDate: "17-04-2025",
    ctc: "1,32,000",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ❇️ FIXED: Type added
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ❇️ FIXED: Type added
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogo(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGeneratePDF = () => {
    generatePDF(formData, logoPreview);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Header */}
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-4">
            Offer Letter Generator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Create professional offer letters instantly
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full space-y-6">

          {/* Logo Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              {logoPreview ? (
                <div className="text-center">
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="mx-auto h-20 w-20 object-contain mb-4"
                  />
                  <p className="text-sm text-green-600 mb-2">
                    Logo uploaded successfully!
                  </p>
                  <button
                    onClick={handleRemoveLogo}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Click to upload company logo</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />

              {!logoPreview && (
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Choose Logo
                </label>
              )}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter employee name"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter designation"
              />
            </div>
          </div>

          {/* Date + CTC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Joining Date
              </label>
              <input
                type="text"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="DD-MM-YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTC (per annum)
              </label>
              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter CTC amount"
              />
            </div>
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700"
          >
            Generate Offer Letter PDF
          </button>
        </div>

        {/* Info */}
        <div className="w-full mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong>{" "}
            {logoPreview
              ? "Logo will appear on every page of the PDF."
              : "Upload a company logo for the PDF."}
          </p>
        </div>
      </main>
    </div>
  );
}
