"use client"

import type React from "react"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Upload, X, ArrowLeft, ArrowRight, FileText, Download, Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function InternshipApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>(["React.js", "Node.js"])
  const [newSkill, setNewSkill] = useState("")
  const [editingSkill, setEditingSkill] = useState<{ index: number; value: string } | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [certifications, setCertifications] = useState<File[]>([])
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false)
  const [customSkillValue, setCustomSkillValue] = useState("")
  const [languages, setLanguages] = useState<string[]>(["English", "Telugu", "Tamil", "Hindi"])
  const [newLanguage, setNewLanguage] = useState("")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [workExperiences, setWorkExperiences] = useState<
    Array<{
      company: string
      role: string
      duration: string
      description: string
    }>
  >([])
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  })

  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const internshipId = searchParams.get("id")

  const predefinedSkills = [
    "React.js",
    "Node.js",
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "Go",
    "PHP",
    "R",
    "HTML",
    "CSS",
    "MongoDB",
    "SQL",
    "Git",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "TensorFlow",
    "PyTorch",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "C",
    "C++",
    "C#",
    "Ruby",
    "Rust",
    "Scala",
    "Haskell",
  ]

  const predefinedLanguages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Urdu",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    university: "",
    course: "",
    specialisation: "",
    yearOfGraduation: "",
    cgpa: "",
    linkedin: "",
    github: "",
  })

  const handleAddSkill = (skill?: string) => {
    const skillToAdd = skill || newSkill.trim()
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd])
      setNewSkill("")
      setShowSkillDropdown(false)
      toast({
        title: "Skill added",
        description: `${skillToAdd} has been added to your skillset`,
      })
    }
  }

  const handleAddCustomSkill = () => {
    const skillToAdd = customSkillValue.trim()
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd])
      setCustomSkillValue("")
      setShowCustomSkillInput(false)
      toast({
        title: "Skill added",
        description: `${skillToAdd} has been added to your skillset`,
      })
    }
  }

  const handleAddLanguage = (language?: string) => {
    const languageToAdd = language || newLanguage.trim()
    if (languageToAdd && !languages.includes(languageToAdd)) {
      setLanguages([...languages, languageToAdd])
      setNewLanguage("")
      setShowLanguageDropdown(false)
      toast({
        title: "Language added",
        description: `${languageToAdd} has been added to your languages`,
      })
    }
  }

  const handleRemoveLanguage = (language: string) => {
    setLanguages(languages.filter((l) => l !== language))
    toast({
      title: "Language removed",
      description: `${language} has been removed`,
    })
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
    toast({
      title: "Skill removed",
      description: `${skill} has been removed from your skillset`,
    })
  }

  const handleEditSkill = (index: number) => {
    setEditingSkill({ index, value: skills[index] })
  }

  const handleSaveSkill = () => {
    if (editingSkill && editingSkill.value.trim()) {
      const newSkills = [...skills]
      newSkills[editingSkill.index] = editingSkill.value.trim()
      setSkills(newSkills)
      setEditingSkill(null)
      toast({
        title: "Skill updated",
        description: "Your skill has been successfully updated",
      })
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setResume(file)
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded",
      })
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
    }
  }

  const handleDownloadResume = () => {
    if (resume) {
      const url = URL.createObjectURL(resume)
      const a = document.createElement("a")
      a.href = url
      a.download = resume.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Download started",
        description: "Your resume is being downloaded",
      })
    }
  }

  const handleDeleteResume = () => {
    setResume(null)
    toast({
      title: "Resume deleted",
      description: "Your resume has been removed",
    })
  }

  const handleCertificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      toast({
        title: "Some files skipped",
        description: "Only PDF files are allowed",
        variant: "destructive",
      })
    }

    setCertifications([...certifications, ...pdfFiles])
    if (pdfFiles.length > 0) {
      toast({
        title: "Certifications uploaded",
        description: `${pdfFiles.length} certification(s) added`,
      })
    }
  }

  const handleDeleteCertification = (index: number) => {
    const deletedCert = certifications[index]
    setCertifications(certifications.filter((_, i) => i !== index))
    toast({
      title: "Certification deleted",
      description: `${deletedCert.name} has been removed`,
    })
  }

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.role && newExperience.duration) {
      setWorkExperiences([...workExperiences, newExperience])
      setNewExperience({ company: "", role: "", duration: "", description: "" })
      setShowAddExperience(false)
      toast({
        title: "Experience added",
        description: "Work experience has been added to your application",
      })
    }
  }

  const handleRemoveExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index))
    toast({
      title: "Experience removed",
      description: "Work experience has been removed",
    })
  }

  const handleEditExperience = (index: number) => {
    setEditingExperience(index)
    setNewExperience(workExperiences[index])
    setShowAddExperience(true)
  }

  const handleSaveEditedExperience = () => {
    if (editingExperience !== null && newExperience.company && newExperience.role && newExperience.duration) {
      const updated = [...workExperiences]
      updated[editingExperience] = newExperience
      setWorkExperiences(updated)
      setNewExperience({ company: "", role: "", duration: "", description: "" })
      setShowAddExperience(false)
      setEditingExperience(null)
      toast({
        title: "Experience updated",
        description: "Work experience has been successfully updated",
      })
    }
  }

  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      // Validate full name
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        newErrors.fullName = "Please enter your full name (at least 2 characters)"
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email || !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address (e.g., name@example.com)"
      }

      if (!formData.mobile || formData.mobile.trim() === "") {
        newErrors.mobile = "Please enter your mobile number"
      }

      // Validate date of birth (must be in the past)
      if (!formData.dob) {
        newErrors.dob = "Please select your date of birth"
      } else {
        const dobDate = new Date(formData.dob)
        const today = new Date()
        if (dobDate >= today) {
          newErrors.dob = "Date of birth must be in the past"
        }
      }

      // Validate address
      if (!formData.address || formData.address.trim().length < 10) {
        newErrors.address = "Please enter your complete contact address (at least 10 characters)"
      }

      // Validate university
      if (!formData.university || formData.university.trim().length < 3) {
        newErrors.university = "Please enter your university name"
      }

      // Validate course
      if (!formData.course) {
        newErrors.course = "Please select your course"
      }

      // Validate specialisation
      if (!formData.specialisation || formData.specialisation.trim().length < 2) {
        newErrors.specialisation = "Please enter your specialisation"
      }

      // Validate year of graduation
      if (!formData.yearOfGraduation) {
        newErrors.yearOfGraduation = "Please select your year of graduation"
      }

      // Validate CGPA
      if (!formData.cgpa) {
        newErrors.cgpa = "Please enter your CGPA or percentage"
      } else {
        const cgpaValue = Number.parseFloat(formData.cgpa)
        if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 100) {
          newErrors.cgpa = "Please enter a valid CGPA (0-10) or percentage (0-100)"
        }
      }

      // Validate LinkedIn URL if provided
      if (formData.linkedin) {
        const urlRegex = /^https?:\/\/.+\..+/
        if (!urlRegex.test(formData.linkedin)) {
          newErrors.linkedin = "Please enter a valid URL (e.g., https://linkedin.com/in/yourprofile)"
        }
      }

      // Validate GitHub URL if provided
      if (formData.github) {
        const urlRegex = /^https?:\/\/.+\..+/
        if (!urlRegex.test(formData.github)) {
          newErrors.github = "Please enter a valid URL (e.g., https://github.com/yourusername)"
        }
      }

      // Validate resume
      if (!resume) {
        newErrors.resume = "Please upload your resume"
      }

      // Validate skills
      if (skills.length === 0) {
        newErrors.skills = "Please add at least one skill"
      }

      // Validate languages
      if (languages.length === 0) {
        newErrors.languages = "Please add at least one language"
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form before proceeding",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep(2)
  }

  const handleSubmit = async () => {
  try {
    setIsSubmitting(true);

    const payload = {
      internshipId: internshipId || "",
      internshipTitle: "Internship Title", // replace with actual value if available
      companyName: "Intel Corporation", // or dynamic value
      userId: "student123", // replace with actual logged-in user id

      // Personal info
      fullName: formData.fullName,
      emailAddress: formData.email,
      mobileNumber: formData.mobile,
      dateOfBirth: new Date(formData.dob),
      contactAddress: formData.address,

      // Academic info
      university: formData.university,
      course: formData.course,
      specialization: formData.specialisation,
      yearOfGraduation: Number(formData.yearOfGraduation),
      cgpa: Number(formData.cgpa),
      languages,
      skills,

      // Professional info
      workExperience: workExperiences.map((exp) => ({
        title: exp.role,
        companyName: exp.company,
        duration: exp.duration,
        description: exp.description,
      })),
      linkedInUrl: formData.linkedin,
      githubUrl: formData.github,

      // File placeholders
      resumePath: resume ? resume.name : "",
      certificationPaths: certifications.map((c) => c.name),
    };

    const res = await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      toast({
        title: "Application submitted!",
        description: "Your application has been successfully saved to MongoDB.",
      });
      setCurrentStep(3);
      setTimeout(() => router.push("/student/internships?tab=applications"), 2000);
    } else {
      throw new Error(result.message || "Failed to submit application");
    }
  } catch (err: any) {
    const errorMessage =
      err instanceof Error ? err.message : "Something went wrong while submitting the application.";
    toast({
      title: "Submission Failed",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const filteredSkills = predefinedSkills.filter(
    (skill) => skill.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(skill),
  )

  const filteredLanguages = predefinedLanguages.filter(
    (language) => language.toLowerCase().includes(newLanguage.toLowerCase()) && !languages.includes(language),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[
                { step: 1, label: "Fill Details" },
                { step: 2, label: "Preview" },
                { step: 3, label: "Submit" },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= item.step ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > item.step ? <CheckCircle2 className="h-6 w-6" /> : item.step}
                    </div>
                    <span className="text-sm mt-2 font-medium">{item.label}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-24 h-1 mx-2 ${currentStep > item.step ? "bg-cyan-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Fill Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Internship Application Form</CardTitle>
                <CardDescription>Fill in your details to apply for this internship</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value })
                          if (errors.fullName) {
                            setErrors({ ...errors, fullName: "" })
                          }
                        }}
                        placeholder="Enter your full name"
                        required
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          if (errors.email) {
                            setErrors({ ...errors, email: "" })
                          }
                        }}
                        placeholder="your.email@example.com"
                        required
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        onChange={(e) => {
                          setFormData({ ...formData, mobile: e.target.value })
                          if (errors.mobile) {
                            setErrors({ ...errors, mobile: "" })
                          }
                        }}
                        required
                        className={errors.mobile ? "border-red-500" : ""}
                      />
                      {errors.mobile && <p className="text-sm text-red-600">{errors.mobile}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => {
                          setFormData({ ...formData, dob: e.target.value })
                          if (errors.dob) {
                            setErrors({ ...errors, dob: "" })
                          }
                        }}
                        required
                        className={errors.dob ? "border-red-500" : ""}
                      />
                      {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Contact Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value })
                        if (errors.address) {
                          setErrors({ ...errors, address: "" })
                        }
                      }}
                      rows={3}
                      required
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="university">University / College Name *</Label>
                    <Input
                      id="university"
                      placeholder="Enter your university name"
                      value={formData.university}
                      onChange={(e) => {
                        setFormData({ ...formData, university: e.target.value })
                        if (errors.university) {
                          setErrors({ ...errors, university: "" })
                        }
                      }}
                      required
                      className={errors.university ? "border-red-500" : ""}
                    />
                    {errors.university && <p className="text-sm text-red-600">{errors.university}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="course">Course *</Label>
                      <Select
                        value={formData.course}
                        onValueChange={(value) => {
                          setFormData({ ...formData, course: value })
                          if (errors.course) {
                            setErrors({ ...errors, course: "" })
                          }
                        }}
                      >
                        <SelectTrigger className={errors.course ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btech">B.Tech</SelectItem>
                          <SelectItem value="mtech">M.Tech</SelectItem>
                          <SelectItem value="bsc">B.Sc</SelectItem>
                          <SelectItem value="msc">M.Sc</SelectItem>
                          <SelectItem value="bca">BCA</SelectItem>
                          <SelectItem value="mca">MCA</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.course && <p className="text-sm text-red-600">{errors.course}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialisation">Specialisation / Major *</Label>
                      <Input
                        id="specialisation"
                        placeholder="e.g., Computer Science"
                        value={formData.specialisation}
                        onChange={(e) => {
                          setFormData({ ...formData, specialisation: e.target.value })
                          if (errors.specialisation) {
                            setErrors({ ...errors, specialisation: "" })
                          }
                        }}
                        required
                        className={errors.specialisation ? "border-red-500" : ""}
                      />
                      {errors.specialisation && <p className="text-sm text-red-600">{errors.specialisation}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearOfGraduation">Year of Graduation *</Label>
                      <Select
                        value={formData.yearOfGraduation}
                        onValueChange={(value) => {
                          setFormData({ ...formData, yearOfGraduation: value })
                          if (errors.yearOfGraduation) {
                            setErrors({ ...errors, yearOfGraduation: "" })
                          }
                        }}
                      >
                        <SelectTrigger className={errors.yearOfGraduation ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2024, 2025, 2026, 2027, 2028].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.yearOfGraduation && <p className="text-sm text-red-600">{errors.yearOfGraduation}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA / Percentage *</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 8.5 or 85"
                        value={formData.cgpa}
                        onChange={(e) => {
                          setFormData({ ...formData, cgpa: e.target.value })
                          if (errors.cgpa) {
                            setErrors({ ...errors, cgpa: "" })
                          }
                        }}
                        required
                        className={errors.cgpa ? "border-red-500" : ""}
                      />
                      {errors.cgpa && <p className="text-sm text-red-600">{errors.cgpa}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Languages Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Languages</h3>
                    <div className="space-y-2">
                      <Label>Languages Known *</Label>
                      <div className="relative">
                        <Input
                          placeholder="Search and select languages..."
                          value={newLanguage}
                          onChange={(e) => {
                            setNewLanguage(e.target.value)
                            setShowLanguageDropdown(true)
                          }}
                          onFocus={() => setShowLanguageDropdown(true)}
                        />
                        {showLanguageDropdown && filteredLanguages.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredLanguages.map((language) => (
                              <button
                                key={language}
                                type="button"
                                onClick={() => handleAddLanguage(language)}
                                className="w-full text-left px-4 py-2 hover:bg-cyan-50 transition-colors"
                              >
                                {language}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {languages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Selected Languages:</p>
                          <div className="flex flex-wrap gap-2">
                            {languages.map((language, index) => (
                              <Badge
                                key={index}
                                className="text-sm py-1.5 px-3 bg-cyan-50 text-cyan-700 border border-cyan-200"
                              >
                                {language}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLanguage(language)}
                                  className="ml-2 hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.languages && <p className="text-sm text-red-600">{errors.languages}</p>}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Skills</h3>
                    <div className="space-y-2">
                      <Label>Skillset *</Label>
                      <div className="relative">
                        <Input
                          placeholder="Search and select skills..."
                          value={newSkill}
                          onChange={(e) => {
                            setNewSkill(e.target.value)
                            setShowSkillDropdown(true)
                          }}
                          onFocus={() => setShowSkillDropdown(true)}
                          className="pr-20"
                        />
                        {showSkillDropdown && filteredSkills.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredSkills.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleAddSkill(skill)}
                                className="w-full text-left px-4 py-2 hover:bg-cyan-50 transition-colors"
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCustomSkillInput(!showCustomSkillInput)}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        + Add Custom Skill
                      </button>

                      {showCustomSkillInput && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <Input
                            placeholder="Enter custom skill (e.g., Haskell)"
                            value={customSkillValue}
                            onChange={(e) => setCustomSkillValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddCustomSkill()
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCustomSkill}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowCustomSkillInput(false)
                              setCustomSkillValue("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}

                      {skills.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <div key={index}>
                                {editingSkill?.index === index ? (
                                  <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-md px-3 py-1">
                                    <Input
                                      value={editingSkill.value}
                                      onChange={(e) => setEditingSkill({ ...editingSkill, value: e.target.value })}
                                      className="h-6 w-32 text-sm"
                                      autoFocus
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={handleSaveSkill}
                                      className="h-6 px-2 bg-green-600 hover:bg-green-700"
                                    >
                                      Save
                                    </Button>
                                  </div>
                                ) : (
                                  <Badge className="text-sm py-1.5 px-3 bg-cyan-50 text-cyan-700 border border-cyan-200">
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => handleEditSkill(index)}
                                      className="ml-2 hover:text-cyan-900"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSkill(skill)}
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Certifications</h3>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Upload Certifications (PDFs) - Optional</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="certifications"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={handleCertificationUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => document.getElementById("certifications")?.click()}
                          className="bg-cyan-600 text-white hover:bg-cyan-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Certifications
                        </Button>
                        <span className="text-sm text-gray-500">Select multiple PDF files</span>
                      </div>

                      {certifications.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Certifications:</p>
                          <div className="space-y-2">
                            {certifications.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-100 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-red-600" />
                                  <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCertification(index)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Work Experience (Optional)</h3>
                    <div className="space-y-2">
                      <Label>Previous Internships or Work Experience</Label>

                      {workExperiences.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {workExperiences.map((exp, index) => (
                            <Card key={index} className="bg-cyan-50 border-cyan-200">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-bold text-base">{exp.role}</h4>
                                    <p className="text-sm text-gray-700 font-medium">{exp.company}</p>
                                    <p className="text-xs text-gray-600 mt-1">Duration: {exp.duration}</p>
                                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditExperience(index)}
                                      className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveExperience(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {!showAddExperience ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddExperience(true)}
                          className="w-full border-dashed border-2 border-cyan-300 hover:bg-cyan-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Work Experience
                        </Button>
                      ) : (
                        <Card className="border-2 border-cyan-200">
                          <CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="exp-company">Company Name *</Label>
                                <Input
                                  id="exp-company"
                                  placeholder="e.g., Google"
                                  value={newExperience.company}
                                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="exp-role">Role *</Label>
                                <Input
                                  id="exp-role"
                                  placeholder="e.g., Software Intern"
                                  value={newExperience.role}
                                  onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="exp-duration">Duration *</Label>
                              <Input
                                id="exp-duration"
                                placeholder="e.g., 3 months (Jan 2024 - Mar 2024)"
                                value={newExperience.duration}
                                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="exp-description">Description (Optional)</Label>
                              <Textarea
                                id="exp-description"
                                placeholder="Briefly describe your responsibilities and achievements..."
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                onClick={editingExperience !== null ? handleSaveEditedExperience : handleAddExperience}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                              >
                                {editingExperience !== null ? "Update Experience" : "Add Experience"}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowAddExperience(false)
                                  setEditingExperience(null)
                                  setNewExperience({ company: "", role: "", duration: "", description: "" })
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn / Portfolio URL (Optional)</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => {
                          setFormData({ ...formData, linkedin: e.target.value })
                          if (errors.linkedin) {
                            setErrors({ ...errors, linkedin: "" })
                          }
                        }}
                        className={errors.linkedin ? "border-red-500" : ""}
                      />
                      {errors.linkedin && <p className="text-sm text-red-600">{errors.linkedin}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub / Project Links (Optional)</Label>
                      <Input
                        id="github"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={formData.github}
                        onChange={(e) => {
                          setFormData({ ...formData, github: e.target.value })
                          if (errors.github) {
                            setErrors({ ...errors, github: "" })
                          }
                        }}
                        className={errors.github ? "border-red-500" : ""}
                      />
                      {errors.github && <p className="text-sm text-red-600">{errors.github}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Resume Upload * </h3>
                  <div className="space-y-2">
                    {!resume ? (
                      <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center bg-cyan-50/30">
                        <input id="resume" type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                        <label htmlFor="resume" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-3 text-cyan-600" />
                          <p className="text-cyan-600 font-medium mb-1">Click to upload your resume (PDF only)</p>
                          <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
                        </label>
                      </div>
                    ) : (
                      <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-10 w-10 text-red-600" />
                            <div>
                              <p className="font-semibold text-gray-900">{resume.name}</p>
                              <p className="text-sm text-gray-600">{(resume.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleDownloadResume}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button type="button" variant="destructive" size="sm" onClick={handleDeleteResume}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {errors.resume && <p className="text-sm text-red-600">{errors.resume}</p>}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Preview */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Your Application</CardTitle>
                <CardDescription>Review your details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-semibold">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mobile</p>
                      <p className="font-semibold">{formData.mobile}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date of Birth</p>
                      <p className="font-semibold">{formData.dob}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Address</p>
                      <p className="font-semibold">{formData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">University</p>
                      <p className="font-semibold">{formData.university}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Course</p>
                      <p className="font-semibold">{formData.course}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Specialisation</p>
                      <p className="font-semibold">{formData.specialisation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Year of Graduation</p>
                      <p className="font-semibold">{formData.yearOfGraduation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">CGPA</p>
                      <p className="font-semibold">{formData.cgpa}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {workExperiences.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Work Experience</h3>
                    <div className="space-y-3">
                      {workExperiences.map((exp, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold">{exp.role}</h4>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(formData.linkedin || formData.github) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Links</h3>
                    <div className="space-y-2 text-sm">
                      {formData.linkedin && (
                        <div>
                          <p className="text-gray-600">LinkedIn</p>
                          <a
                            href={formData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline"
                          >
                            {formData.linkedin}
                          </a>
                        </div>
                      )}
                      {formData.github && (
                        <div>
                          <p className="text-gray-600">GitHub</p>
                          <a
                            href={formData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline"
                          >
                            {formData.github}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>
                  <div className="text-sm">
                    <p className="text-gray-600">Resume</p>
                    <p className="font-semibold">{resume?.name}</p>
                  </div>
                  {certifications.length > 0 && (
                    <div className="text-sm">
                      <p className="text-gray-600">Certifications</p>
                      <ul className="list-disc list-inside">
                        {certifications.map((file, index) => (
                          <li key={index} className="font-semibold">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p className="text-gray-600 mb-8">
                  Your application has been successfully submitted. You will be redirected to the internships page.
                </p>
                <Button onClick={() => router.push("/student/internships")} className="bg-cyan-600 hover:bg-cyan-700">
                  Go to Internships
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
