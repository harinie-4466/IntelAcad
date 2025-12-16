"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { X, Home, Briefcase, PlusCircle, Users, FileText, LogOut, Menu } from "lucide-react"
import Image from "next/image"

export default function CreateInternship() {
  const router = useRouter()
  const [skills, setSkills] = useState<string[]>(["React", "Python", "Cloud"])
  const [newSkill, setNewSkill] = useState("")
  const [selectionSteps, setSelectionSteps] = useState<string[]>(["e.g., Test + Interview"])
  const [newStep, setNewStep] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

 const [formData, setFormData] = useState({
  companyName: "",
  hrName: "",
  hrEmail: "",
  companyWebsite: "",
  hrMobile: "",
  companyLocation: "",
  city: "",
  internshipTitle: "",
  description: "",      // ✅ Added
  duration: "1",
  durationUnit: "Weeks",
  positions: "3",
  deadline: "",
  deadlineType: "Hybrid",
  stipendType: "Paid",
  stipendAmount: "",    // ✅ Added
  eligibility: "",
  perks: "",
});


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateURL = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-+$$$$]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "companyName":
        if (!value.trim()) error = "Company name is required"
        else if (value.trim().length < 2) error = "Company name must be at least 2 characters"
        break
      case "hrName":
        if (!value.trim()) error = "HR name is required"
        else if (value.trim().length < 2) error = "HR name must be at least 2 characters"
        break
      case "hrEmail":
        if (!value.trim()) error = "HR email is required"
        else if (!validateEmail(value)) error = "Please enter a valid email address"
        break
      case "companyWebsite":
        if (!value.trim()) error = "Company website is required"
        else if (!validateURL(value)) error = "Please enter a valid URL (e.g., https://example.com)"
        break
      case "hrMobile":
        if (!value.trim()) error = "HR mobile is required"
        else if (!validatePhone(value)) error = "Please enter a valid phone number (at least 10 digits)"
        break
      case "companyLocation":
        if (!value.trim()) error = "Company location is required"
        break
      case "city":
        if (!value.trim()) error = "City is required"
        break
      case "internshipTitle":
        if (!value.trim()) error = "Internship title is required"
        else if (value.trim().length < 10) error = "Please provide a detailed description (at least 10 characters)"
        break
      case "duration":
        if (!value || Number.parseInt(value) < 1) error = "Duration must be at least 1"
        break
      case "positions":
        if (!value || Number.parseInt(value) < 1) error = "Number of positions must be at least 1"
        break
      case "deadline":
        if (!value) error = "Application deadline is required"
        else {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (selectedDate < today) error = "Deadline must be a future date"
        }
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return error === ""
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const addSelectionStep = () => {
    if (newStep.trim()) {
      setSelectionSteps([...selectionSteps, newStep.trim()])
      setNewStep("")
    }
  }

  const removeSelectionStep = (index: number) => {
    setSelectionSteps(selectionSteps.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const fieldsToValidate = [
    "companyName",
    "hrName",
    "hrEmail",
    "companyWebsite",
    "hrMobile",
    "companyLocation",
    "city",
    "internshipTitle",
    "duration",
    "positions",
    "deadline",
  ];

  let hasErrors = false;
  const newErrors: Record<string, string> = {};

  fieldsToValidate.forEach((field) => {
    const value = formData[field as keyof typeof formData];
    if (!validateField(field, String(value))) {
      hasErrors = true;
    }
  });

  if (skills.length === 0) {
    newErrors.skills = "Please add at least one required skill";
    hasErrors = true;
  }

  if (selectionSteps.length === 0) {
    newErrors.selectionSteps = "Please add at least one selection step";
    hasErrors = true;
  }

  if (hasErrors || Object.keys(errors).some((key) => errors[key])) {
    setErrors({ ...errors, ...newErrors });
    const firstErrorField = document.querySelector('[data-error="true"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // ✅ Build payload for backend
  const payload = {
    companyName: formData.companyName,
    hrName: formData.hrName,
    hrEmail: formData.hrEmail,
    companyWebsite: formData.companyWebsite,
    hrMobile: formData.hrMobile,
    companyLocation: formData.companyLocation,
    city: formData.city,
    internshipTitle: formData.internshipTitle,
    description: formData.description,
    skills,
    duration: formData.duration,
    durationUnit: formData.durationUnit,
    positions: formData.positions,
    deadline: formData.deadline,
    deadlineType: formData.deadlineType,
    selectionProcess: selectionSteps,
    stipendType: formData.stipendType,
    stipendAmount: formData.stipendAmount,
    eligibility: formData.eligibility,
    perks: formData.perks,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/postings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create internship posting");
    }

    // ✅ Redirect to internship list after successful creation
    router.push("/company/internships");
  } catch (err: any) {
    console.error("Error creating internship:", err);
    alert("Failed to save internship. Please try again.");
  }
};

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-cyan-800 text-white flex-col">
        <div className="p-6 border-b border-cyan-700">
          <Link href="/company" className="flex items-center">
            <Image
              src="/IntelAcad.png" 
              alt="IntelAcad"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/company/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/company/internships"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Internships</span>
          </Link>
          <Link
            href="/company/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Post Internship</span>
          </Link>
          <Link
            href="/company/applicants"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Applicants</span>
          </Link>
          <Link
            href="/company/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-cyan-700">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-cyan-800 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

          {/* Compact Sidebar */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-cyan-800 text-white flex flex-col shadow-2xl">
            <div className="p-4 border-b border-cyan-700">
              <Link href="/company" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/intelacad-logo.png"
                  alt="IntelAcad"
                  width={120}
                  height={32}
                  className="object-contain brightness-0 invert"
                />
              </Link>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <Link
                href="/company/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </Link>
              <Link
                href="/company/internships"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">Internships</span>
              </Link>
              <Link
                href="/company/create"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="font-medium">Post Internship</span>
              </Link>
              <Link
                href="/company/applicants"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Applicants</span>
              </Link>
              <Link
                href="/company/reports"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </Link>
            </nav>

            <div className="p-3 border-t border-cyan-700">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left text-sm">
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-lg border-slate-200">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="mb-10">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Post a New Internship</h1>
                  <div className="w-32 h-1 bg-cyan-800 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>

                    <div className="space-y-6">
                      {/* Row 1: Company Name and Website */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="companyName"
                            placeholder="Enter company name"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.companyName}
                            className={`h-11 ${errors.companyName ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Website <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="companyWebsite"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.companyWebsite}
                            className={`h-11 ${errors.companyWebsite ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.companyWebsite && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyWebsite}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: HR Name and Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            HR / Contact Person Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="hrName"
                            placeholder="Enter HR name"
                            value={formData.hrName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.hrName}
                            className={`h-11 ${errors.hrName ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.hrName && <p className="text-red-500 text-sm mt-1">{errors.hrName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            HR Email <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="hrEmail"
                            type="email"
                            placeholder="hr@example.com"
                            value={formData.hrEmail}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.hrEmail}
                            className={`h-11 ${errors.hrEmail ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.hrEmail && <p className="text-red-500 text-sm mt-1">{errors.hrEmail}</p>}
                        </div>
                      </div>

                      {/* Row 3: HR Mobile and Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            HR Mobile <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="hrMobile"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.hrMobile}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.hrMobile}
                            className={`h-11 ${errors.hrMobile ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.hrMobile && <p className="text-red-500 text-sm mt-1">{errors.hrMobile}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Location <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="companyLocation"
                            placeholder="Enter location"
                            value={formData.companyLocation}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            data-error={!!errors.companyLocation}
                            className={`h-11 ${errors.companyLocation ? "border-red-500 focus:ring-red-500" : ""}`}
                          />
                          {errors.companyLocation && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 4: City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City, State, Country <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="city"
                          placeholder="e.g., San Francisco, CA, USA"
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          data-error={!!errors.city}
                          className={`h-11 ${errors.city ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Internship Details</h2>
                      <div className="w-32 h-1 bg-cyan-800 rounded-full"></div>
                    </div>

                    <div className="space-y-6">
                      {/* Internship Title */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Internship Title / Role <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          name="internshipTitle"
                          placeholder="Describe the role, responsibilities, and expectations..."
                          value={formData.internshipTitle}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          data-error={!!errors.internshipTitle}
                          className={`min-h-[100px] resize-none ${errors.internshipTitle ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.internshipTitle && (
                          <p className="text-red-500 text-sm mt-1">{errors.internshipTitle}</p>
                        )}
                      </div>

                      {/* Two Column Layout for Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Required Skills */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Required Skills <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                              {skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-800 text-white rounded-full text-sm font-medium"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="hover:bg-cyan-900 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                className="h-11"
                              />
                              <Button type="button" onClick={addSkill} className="bg-cyan-800 hover:bg-cyan-900 px-6">
                                Add
                              </Button>
                            </div>
                            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                          </div>

                          {/* Duration */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Duration <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                              <Input
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                data-error={!!errors.duration}
                                className={`w-24 h-11 ${errors.duration ? "border-red-500 focus:ring-red-500" : ""}`}
                                required
                                min="1"
                              />
                              <select
                                name="durationUnit"
                                value={formData.durationUnit}
                                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                className="flex-1 h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
                              >
                                <option>Weeks</option>
                                <option>Months</option>
                              </select>
                            </div>
                            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                          </div>

                          {/* Number of Positions */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Number of Positions <span className="text-red-500">*</span>
                            </label>
                            <Input
                              name="positions"
                              type="number"
                              value={formData.positions}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              data-error={!!errors.positions}
                              className={`h-11 ${errors.positions ? "border-red-500 focus:ring-red-500" : ""}`}
                              required
                              min="1"
                              placeholder="e.g., 3"
                            />
                            {errors.positions && <p className="text-red-500 text-sm mt-1">{errors.positions}</p>}
                          </div>

                          {/* Application Deadline */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Application Deadline <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                              <Input
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                data-error={!!errors.deadline}
                                className={`flex-1 h-11 ${errors.deadline ? "border-red-500 focus:ring-red-500" : ""}`}
                                required
                              />
                              <select
                                name="deadlineType"
                                value={formData.deadlineType}
                                onChange={(e) => setFormData({ ...formData, deadlineType: e.target.value })}
                                className="h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
                              >
                                <option>Hybrid</option>
                                <option>Remote</option>
                                <option>On-site</option>
                              </select>
                            </div>
                            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Stipend / Pay */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Stipend / Pay</label>
                            <div className="flex gap-3 mb-4">
                              {["Paid", "Unpaid", "Variable"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, stipendType: type })}
                                  className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all ${
                                    formData.stipendType === type
                                      ? "bg-cyan-800 text-white shadow-md"
                                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                            <Input placeholder="Enter stipend details (optional)" className="h-11" />
                          </div>

                          {/* Eligibility Criteria */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Eligibility Criteria
                            </label>
                            <Textarea
                              name="eligibility"
                              placeholder="e.g., Year of study, minimum CGPA, prerequisites..."
                              value={formData.eligibility}
                              onChange={handleInputChange}
                              className="min-h-[100px] resize-none"
                            />
                          </div>

                          {/* Perks & Benefits */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Perks & Benefits</label>
                            <Textarea
                              name="perks"
                              placeholder="e.g., Certificate, PPO opportunity, flexible hours, mentorship..."
                              value={formData.perks}
                              onChange={handleInputChange}
                              className="min-h-[100px] resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Selection Process - Full Width */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Selection Process <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3 mb-3">
                          {selectionSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-cyan-800 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                              </div>
                              <Input value={step} readOnly className="flex-1 h-11 bg-slate-50" />
                              <button
                                type="button"
                                onClick={() => removeSelectionStep(index)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            placeholder="Add a selection step (e.g., Technical Test, HR Interview)"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSelectionStep())}
                            className="h-11"
                          />
                          <Button
                            type="button"
                            onClick={addSelectionStep}
                            className="bg-cyan-800 hover:bg-cyan-900 px-6"
                          >
                            Add
                          </Button>
                        </div>
                        {errors.selectionSteps && <p className="text-red-500 text-sm mt-1">{errors.selectionSteps}</p>}
                      </div>
                    </div>
                  </section>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      className="bg-cyan-800 hover:bg-cyan-900 text-white px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Create Internship
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
