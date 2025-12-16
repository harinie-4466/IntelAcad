"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  FileUp,
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  Eye,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  User,
  Linkedin,
  Github,
  Globe,
  Search,
  Edit,
  Heart,
  Languages,
  Trophy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { ATSChecker } from "@/components/ats-checker"

function ResumeBuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const mode = searchParams.get("mode") || "create"

  const [showUploadModal, setShowUploadModal] = useState(mode === "upload")
  const [isParsing, setIsParsing] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renameResumeId, setRenameResumeId] = useState<number | null>(null)
  const [newResumeName, setNewResumeName] = useState("")
  const [viewOnlyResume, setViewOnlyResume] = useState<any>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // State for validation errors

  const [activeTab, setActiveTab] = useState("templates")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("classic")
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [resumeName, setResumeName] = useState("")
  const [deleteResumeId, setDeleteResumeId] = useState<number | null>(null)
  const [editingSection, setEditingSection] = useState<{ [key: string]: boolean }>({})

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    // Experience
    experiences: [
      {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    // Education
    education: [
      {
        id: Date.now(),
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ],
    // Skills
    skills: [] as string[],
    skillInput: "",
    // Projects
    projects: [
      {
        id: Date.now(),
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ],
    // Certifications
    certifications: [
      {
        id: Date.now(),
        name: "",
        issuer: "",
        date: "",
        link: "",
      },
    ],
    awards: [
      {
        id: Date.now(),
        title: "",
        issuer: "",
        date: "",
        description: "",
      },
    ],
    hobbies: [] as string[],
    hobbyInput: "",
    languages: [
      {
        id: Date.now(),
        language: "",
        proficiency: "",
      },
    ],
  })

  // Load saved resumes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedResumes")
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedResumes(Array.isArray(parsed) ? parsed : [])
      } else {
        setSavedResumes([])
      }
    } catch (error) {
      console.error("Error loading saved resumes:", error)
      setSavedResumes([])
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setIsParsing(true)
      setUploadedFile(file)

      setTimeout(() => {
        // Simulate parsing and autofill data
        setFormData({
          ...formData,
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary: "Experienced software engineer with 5+ years of experience in full-stack development.",
        })

        setIsParsing(false)
        setShowUploadModal(false)
        toast({
          title: "Resume parsed successfully",
          description: "Your information has been extracted and filled in the form",
        })
        setActiveTab("templates")
      }, 2000)
    }
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "fullName":
        if (!/^[a-zA-Z\s]+$/.test(value) && value.trim() !== "") {
          newErrors[name] = "Name can only contain letters and spaces"
        } else {
          delete newErrors[name]
        }
        break
      case "email":
        if (value.trim() !== "" && !value.includes("@")) {
          newErrors[name] = "Email must contain @"
        } else if (value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = "Please enter a valid email address"
        } else {
          delete newErrors[name]
        }
        break
      case "phone":
        if (!/^[0-9+\-\s()]+$/.test(value) && value.trim() !== "") {
          newErrors[name] = "Phone can only contain numbers, +, -, (), and spaces"
        } else {
          delete newErrors[name]
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    validateField(field, value)
  }

  // Add experience
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...(prev.experiences || []),
        {
          id: Date.now(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  // Remove experience
  const removeExperience = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((exp) => exp.id !== id),
    }))
  }

  // Update experience
  const updateExperience = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  // Add education
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: Date.now(),
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    }))
  }

  // Remove education
  const removeEducation = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((edu) => edu.id !== id),
    }))
  }

  // Update education
  const updateEducation = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  // Add skill
  const addSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), prev.skillInput.trim()],
        skillInput: "",
      }))
    }
  }

  // Remove skill
  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index),
    }))
  }

  // Add project
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: Date.now(),
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    }))
  }

  // Remove project
  const removeProject = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((proj) => proj.id !== id),
    }))
  }

  // Update project
  const updateProject = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    }))
  }

  // Add certification
  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          id: Date.now(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    }))
  }

  // Remove certification
  const removeCertification = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((cert) => cert.id !== id),
    }))
  }

  // Update certification
  const updateCertification = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }))
  }

  const addAward = () => {
    setFormData((prev) => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        {
          id: Date.now(),
          title: "",
          issuer: "",
          date: "",
          description: "",
        },
      ],
    }))
  }

  const removeAward = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      awards: (prev.awards || []).filter((award) => award.id !== id),
    }))
  }

  const updateAward = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      awards: (prev.awards || []).map((award) => (award.id === id ? { ...award, [field]: value } : award)),
    }))
  }

  const addHobby = () => {
    if (formData.hobbyInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), prev.hobbyInput.trim()],
        hobbyInput: "",
      }))
    }
  }

  const removeHobby = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: (prev.hobbies || []).filter((_, i) => i !== index),
    }))
  }

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          id: Date.now(),
          language: "",
          proficiency: "",
        },
      ],
    }))
  }

  const removeLanguage = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((lang) => lang.id !== id),
    }))
  }

  const updateLanguage = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      languages: (prev.languages || []).map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    }))
  }

  // Save draft resume
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now(),
      ...formData,
      template: selectedTemplate,
      isDraft: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [...(savedResumes || []), draft]
    setSavedResumes(updated)
    localStorage.setItem("savedResumes", JSON.stringify(updated))

    toast({
      title: "Draft saved",
      description: "Your resume draft has been saved successfully",
    })
  }

  const handleSaveResume = () => {
    setShowSaveDialog(true)
  }

  const confirmSaveResume = () => {
    const resume = {
      id: Date.now(),
      ...formData,
      resumeName: resumeName || formData.fullName || "Untitled Resume",
      template: selectedTemplate,
      isDraft: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [...(savedResumes || []), resume]
    setSavedResumes(updated)
    localStorage.setItem("savedResumes", JSON.stringify(updated))

    toast({
      title: "Resume saved",
      description: `"${resume.resumeName}" has been saved successfully`,
    })

    setShowSaveDialog(false)
    setResumeName("")
  }

  // Download resume as PDF
  const handleDownloadPDF = async () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before downloading",
        variant: "destructive",
      })
      return
    }

    setErrors({})
    toast({
      title: "Downloading resume",
      description: "Your resume is being prepared for download",
    })

    try {
      // Find the live preview element
      const element = document.querySelector(".border-2.rounded-lg.overflow-hidden")
      if (!element) {
        toast({
          title: "Error",
          description: "Unable to find resume preview",
          variant: "destructive",
        })
        return
      }

      // Wait for any images to load
      await new Promise((resolve) => setTimeout(resolve, 300))

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${formData.fullName || "resume"}-${new Date().toISOString().split("T")[0]}.pdf`)

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      })
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete saved resume
  const confirmDeleteResume = () => {
    if (deleteResumeId) {
      const updated = (savedResumes || []).filter((resume) => resume.id !== deleteResumeId)
      setSavedResumes(updated)
      localStorage.setItem("savedResumes", JSON.stringify(updated))
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted",
      })
      setDeleteResumeId(null)
    }
  }

  // Load resume for editing
  const loadResume = (resume: any) => {
    setFormData(resume)
    setSelectedTemplate(resume.template)
    setActiveTab("details")
    toast({
      title: "Resume loaded",
      description: "You can now edit your resume",
    })
  }

  const handleTemplateEdit = (templateId: string) => {
    setSelectedTemplate(templateId)
    setActiveTab("details")
  }

  // Updated template options
  const templates = [
    { id: "classic", name: "Classic Professional", description: "Traditional and professional" },
    { id: "modern", name: "Modern Minimalist", description: "Clean and contemporary" },
    { id: "executive", name: "Executive", description: "Bold and sophisticated" },
  ]

  const filteredResumes = (savedResumes || []).filter((resume) =>
    (resume.resumeName || resume.fullName || "Untitled Resume").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const renderClassicPreview = () => (
    <div className="bg-white p-8 min-h-[600px]">
      <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.fullName || "Your Name"}</h2>
        <div className="text-sm text-gray-600 space-y-1">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
          {formData.linkedin && <p>{formData.linkedin}</p>}
        </div>
      </div>

      {formData.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Professional Summary</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{formData.summary}</p>
        </div>
      )}

      {(formData.experiences || []).some((exp) => exp.title || exp.company) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Work Experience
          </h3>
          {(formData.experiences || []).map(
            (exp) =>
              (exp.title || exp.company) && (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900">{exp.company}</p>
                    <p className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm italic mb-2">{exp.title}</p>
                  {exp.description && (
                    <ul className="text-gray-600 text-sm space-y-1 ml-4">
                      {exp.description.split("\n").map((line, i) => (
                        <li key={i} className="list-disc">
                          {line.replace(/^[•-]\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
          )}
        </div>
      )}

      {(formData.education || []).some((edu) => edu.degree || edu.institution) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">Education</h3>
          {(formData.education || []).map(
            (edu) =>
              (edu.degree || edu.institution) && (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{edu.degree}</p>
                      <p className="text-gray-700 text-sm">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      )}

      {(formData.awards || []).some((award) => award.title) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Achievements/Awards
          </h3>
          {(formData.awards || []).map(
            (award) =>
              award.title && (
                <div key={award.id} className="mb-2">
                  <p className="font-semibold text-gray-900 text-sm">{award.title}</p>
                  {award.description && <p className="text-gray-600 text-sm">{award.description}</p>}
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )

  const renderModernPreview = () => (
    <div className="bg-white p-8 min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-1">
          {formData.fullName || "MORGAN HEMAN"}
        </h2>
        <div className="text-xs text-gray-600 space-y-0.5">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.linkedin && <p>{formData.linkedin}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-6">
          {formData.summary && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Name Marketing</h3>
              <p className="text-xs text-gray-700 leading-relaxed">{formData.summary}</p>
            </div>
          )}

          {(formData.experiences || []).some((exp) => exp.title || exp.company) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Experience</h3>
              {(formData.experiences || []).map(
                (exp) =>
                  (exp.title || exp.company) && (
                    <div key={exp.id} className="mb-4">
                      <p className="font-bold text-gray-900 text-xs uppercase">{exp.company}</p>
                      <p className="text-gray-700 text-xs italic mb-1">{exp.title}</p>
                      <p className="text-gray-500 text-xs mb-2">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                      {exp.description && <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>}
                    </div>
                  ),
              )}
            </div>
          )}

          {(formData.projects || []).some((proj) => proj.name) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Other Projects</h3>
              {(formData.projects || []).map(
                (proj) =>
                  proj.name && (
                    <div key={proj.id} className="mb-3">
                      <p className="font-bold text-gray-900 text-xs">{proj.name}</p>
                      {proj.description && <p className="text-xs text-gray-600">{proj.description}</p>}
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {(formData.education || []).some((edu) => edu.degree || edu.institution) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h3>
              {(formData.education || []).map(
                (edu) =>
                  (edu.degree || edu.institution) && (
                    <div key={edu.id} className="mb-3">
                      <p className="font-semibold text-gray-900 text-xs">{edu.degree}</p>
                      <p className="text-gray-700 text-xs">{edu.institution}</p>
                      <p className="text-gray-500 text-xs">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  ),
              )}
            </div>
          )}

          {(formData.awards || []).some((award) => award.title) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Awards</h3>
              {(formData.awards || []).map(
                (award) =>
                  award.title && (
                    <div key={award.id} className="mb-2">
                      <p className="text-xs text-gray-900 font-semibold">{award.title}</p>
                      <p className="text-xs text-gray-600">{award.issuer}</p>
                    </div>
                  ),
              )}
            </div>
          )}

          {(formData.languages || []).some((lang) => lang.language) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Language Skills</h3>
              {(formData.languages || []).map(
                (lang) =>
                  lang.language && (
                    <div key={lang.id} className="mb-2">
                      <p className="text-xs text-gray-900">
                        {lang.language} - {lang.proficiency}
                      </p>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderExecutivePreview = () => (
    <div className="bg-white p-6 min-h-[600px] text-xs">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.fullName || "Your Name"}</h2>
        <div className="text-xs text-gray-600">
          {formData.email && <span>{formData.email} | </span>}
          {formData.phone && <span>{formData.phone} | </span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>

      {formData.summary && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Professional Summary</h3>
          <p className="text-xs text-gray-700 leading-tight">{formData.summary}</p>
        </div>
      )}

      {(formData.education || []).some((edu) => edu.degree || edu.institution) && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Education</h3>
          {(formData.education || []).map(
            (edu) =>
              (edu.degree || edu.institution) && (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-gray-900 text-xs">
                    {edu.institution} - {edu.degree}
                  </p>
                  <p className="text-xs text-gray-600">
                    {edu.startDate} - {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                  </p>
                </div>
              ),
          )}
        </div>
      )}

      {(formData.experiences || []).some((exp) => exp.title || exp.company) && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Experience</h3>
          {(formData.experiences || []).map(
            (exp) =>
              (exp.title || exp.company) && (
                <div key={exp.id} className="mb-3">
                  <p className="font-semibold text-gray-900 text-xs">
                    {exp.company} - {exp.title}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  {exp.description && (
                    <ul className="text-xs text-gray-700 space-y-0.5 ml-3">
                      {exp.description.split("\n").map((line, i) => (
                        <li key={i} className="list-disc leading-tight">
                          {line.replace(/^[•-]\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
          )}
        </div>
      )}

      {(formData.projects || []).some((proj) => proj.name) && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Projects</h3>
          {(formData.projects || []).map(
            (proj) =>
              proj.name && (
                <div key={proj.id} className="mb-2">
                  <p className="font-semibold text-gray-900 text-xs">{proj.name}</p>
                  {proj.description && <p className="text-xs text-gray-700 leading-tight">{proj.description}</p>}
                  {proj.technologies && <p className="text-xs text-gray-600">Technologies: {proj.technologies}</p>}
                </div>
              ),
          )}
        </div>
      )}

      {(formData.skills || []).length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Skills</h3>
          <p className="text-xs text-gray-700">{(formData.skills || []).join(", ")}</p>
        </div>
      )}

      {(formData.certifications || []).some((cert) => cert.name) && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">Certifications</h3>
          {(formData.certifications || []).map(
            (cert) =>
              cert.name && (
                <p key={cert.id} className="text-xs text-gray-700">
                  {cert.name} - {cert.issuer} ({cert.date})
                </p>
              ),
          )}
        </div>
      )}
    </div>
  )

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "classic":
        return renderClassicPreview()
      case "modern":
        return renderModernPreview()
      case "executive":
        return renderExecutivePreview()
      default:
        return renderClassicPreview()
    }
  }

  const confirmRename = () => {
    if (renameResumeId !== null && newResumeName.trim()) {
      const updatedResumes = savedResumes.map((resume) =>
        resume.id === renameResumeId ? { ...resume, resumeName: newResumeName.trim() } : resume,
      )
      setSavedResumes(updatedResumes)
      localStorage.setItem("savedResumes", JSON.stringify(updatedResumes))
      toast({
        title: "Resume Renamed",
        description: `"${newResumeName.trim()}" has been successfully renamed.`,
      })
      setRenameResumeId(null)
      setNewResumeName("")
      setShowRenameDialog(false)
    } else {
      toast({
        title: "Rename Failed",
        description: "Please enter a valid resume name.",
        variant: "destructive",
      })
    }
  }

  const handleRenameResume = (id: number, currentName: string) => {
    setRenameResumeId(id)
    setNewResumeName(currentName)
    setShowRenameDialog(true)
  }

  const handleViewResume = (resume: any) => {
    setViewOnlyResume(resume)
    setShowViewDialog(true)
  }

  const handleDownloadResume = async (resume: any) => {
    toast({
      title: "Downloading Resume",
      description: `Preparing "${resume.resumeName || resume.fullName || "Resume"}" for download.`,
    })

    try {
      // Create a completely isolated container with explicit styles
      const tempContainer = document.createElement("div")
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        background: #ffffff;
        color: #000000;
        font-family: Arial, sans-serif;
      `
      document.body.appendChild(tempContainer)

      // Create the resume preview element with all explicit inline styles
      const previewElement = document.createElement("div")
      previewElement.style.cssText = `
        background: #ffffff;
        width: 800px;
        min-height: 600px;
        color: #000000;
        font-family: Arial, sans-serif;
      `

      // Render based on template type with explicit hex colors only
      if (resume.template === "classic") {
        previewElement.innerHTML = `
          <div style="background: #ffffff; padding: 32px; color: #000000; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #d1d5db; padding-bottom: 16px;">
              <h2 style="font-size: 28px; font-weight: bold; color: #111827; margin: 0 0 8px 0; font-family: Arial, sans-serif;">${resume.fullName || "Your Name"}</h2>
              <div style="font-size: 14px; color: #6b7280; font-family: Arial, sans-serif;">
                ${resume.email ? `<p style="margin: 4px 0; color: #6b7280;">${resume.email}</p>` : ""}
                ${resume.phone ? `<p style="margin: 4px 0; color: #6b7280;">${resume.phone}</p>` : ""}
                ${resume.location ? `<p style="margin: 4px 0; color: #6b7280;">${resume.location}</p>` : ""}
                ${resume.linkedin ? `<p style="margin: 4px 0; color: #6b7280;">${resume.linkedin}</p>` : ""}
              </div>
            </div>
            ${
              resume.summary
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 8px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Professional Summary</h3>
                <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">${resume.summary}</p>
              </div>
            `
                : ""
            }
            ${
              (resume.experiences || []).some((exp: any) => exp.title || exp.company)
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Work Experience</h3>
                ${(resume.experiences || [])
                  .map((exp: any) =>
                    exp.title || exp.company
                      ? `
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <p style="font-weight: 600; color: #111827; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">${exp.company || ""}</p>
                      <p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, sans-serif;">${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}</p>
                    </div>
                    <p style="color: #374151; font-size: 13px; font-style: italic; margin: 0 0 8px 0; font-family: Arial, sans-serif;">${exp.title || ""}</p>
                    ${exp.description ? `<p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; font-family: Arial, sans-serif;">${exp.description.replace(/\n/g, "<br>")}</p>` : ""}
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.education || []).some((edu: any) => edu.degree || edu.institution)
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Education</h3>
                ${(resume.education || [])
                  .map((edu: any) =>
                    edu.degree || edu.institution
                      ? `
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                      <div>
                        <p style="font-weight: 600; color: #111827; font-size: 14px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${edu.degree || ""}</p>
                        <p style="color: #374151; font-size: 13px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${edu.institution || ""}</p>
                        ${edu.gpa ? `<p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, sans-serif;">GPA: ${edu.gpa}</p>` : ""}
                      </div>
                      <p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, sans-serif;">${edu.startDate || ""} - ${edu.endDate || ""}</p>
                    </div>
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.skills || []).length > 0
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Skills</h3>
                <p style="color: #374151; font-size: 13px; margin: 0; font-family: Arial, sans-serif;">${(resume.skills || []).join(", ")}</p>
              </div>
            `
                : ""
            }
            ${
              (resume.projects || []).some((proj: any) => proj.name)
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Projects</h3>
                ${(resume.projects || [])
                  .map((proj: any) =>
                    proj.name
                      ? `
                  <div style="margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #111827; font-size: 14px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${proj.name}</p>
                    ${proj.description ? `<p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${proj.description}</p>` : ""}
                    ${proj.technologies ? `<p style="color: #6b7280; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">Technologies: ${proj.technologies}</p>` : ""}
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.certifications || []).some((cert: any) => cert.name)
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Certifications</h3>
                ${(resume.certifications || [])
                  .map((cert: any) =>
                    cert.name
                      ? `
                  <p style="color: #374151; font-size: 13px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${cert.name} - ${cert.issuer || ""} ${cert.date ? `(${cert.date})` : ""}</p>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.awards || []).some((award: any) => award.title)
                ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-family: Arial, sans-serif;">Achievements/Awards</h3>
                ${(resume.awards || [])
                  .map((award: any) =>
                    award.title
                      ? `
                  <div style="margin-bottom: 8px;">
                    <p style="font-weight: 600; color: #111827; font-size: 13px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${award.title}</p>
                    ${award.description ? `<p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, sans-serif;">${award.description}</p>` : ""}
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        `
      } else if (resume.template === "modern") {
        previewElement.innerHTML = `
          <div style="background: #ffffff; padding: 32px; color: #000000; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 24px; font-weight: bold; color: #111827; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${resume.fullName || "Your Name"}</h2>
              <div style="font-size: 12px; color: #6b7280; font-family: Arial, sans-serif;">
                ${resume.email ? `<p style="margin: 2px 0; color: #6b7280;">${resume.email}</p>` : ""}
                ${resume.phone ? `<p style="margin: 2px 0; color: #6b7280;">${resume.phone}</p>` : ""}
                ${resume.linkedin ? `<p style="margin: 2px 0; color: #6b7280;">${resume.linkedin}</p>` : ""}
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
              <div>
                ${
                  resume.summary
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Profile</h3>
                    <p style="font-size: 12px; color: #374151; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">${resume.summary}</p>
                  </div>
                `
                    : ""
                }
                ${
                  (resume.experiences || []).some((exp: any) => exp.title || exp.company)
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Experience</h3>
                    ${(resume.experiences || [])
                      .map((exp: any) =>
                        exp.title || exp.company
                          ? `
                      <div style="margin-bottom: 16px;">
                        <p style="font-weight: bold; color: #111827; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${exp.company || ""}</p>
                        <p style="color: #374151; font-size: 12px; font-style: italic; margin: 4px 0; font-family: Arial, sans-serif;">${exp.title || ""}</p>
                        <p style="color: #6b7280; font-size: 11px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}</p>
                        ${exp.description ? `<p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0; font-family: Arial, sans-serif;">${exp.description}</p>` : ""}
                      </div>
                    `
                          : "",
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
                ${
                  (resume.projects || []).some((proj: any) => proj.name)
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Projects</h3>
                    ${(resume.projects || [])
                      .map((proj: any) =>
                        proj.name
                          ? `
                      <div style="margin-bottom: 12px;">
                        <p style="font-weight: bold; color: #111827; font-size: 12px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${proj.name}</p>
                        ${proj.description ? `<p style="font-size: 12px; color: #6b7280; margin: 0; font-family: Arial, sans-serif;">${proj.description}</p>` : ""}
                      </div>
                    `
                          : "",
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
              <div>
                ${
                  (resume.education || []).some((edu: any) => edu.degree || edu.institution)
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Education</h3>
                    ${(resume.education || [])
                      .map((edu: any) =>
                        edu.degree || edu.institution
                          ? `
                      <div style="margin-bottom: 12px;">
                        <p style="font-weight: 600; color: #111827; font-size: 12px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${edu.degree || ""}</p>
                        <p style="color: #374151; font-size: 11px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${edu.institution || ""}</p>
                        <p style="color: #6b7280; font-size: 11px; margin: 0; font-family: Arial, sans-serif;">${edu.startDate || ""} - ${edu.endDate || ""}</p>
                      </div>
                    `
                          : "",
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
                ${
                  (resume.skills || []).length > 0
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Skills</h3>
                    <p style="font-size: 11px; color: #374151; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">${(resume.skills || []).join(", ")}</p>
                  </div>
                `
                    : ""
                }
                ${
                  (resume.languages || []).some((lang: any) => lang.language)
                    ? `
                  <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">Languages</h3>
                    ${(resume.languages || [])
                      .map((lang: any) =>
                        lang.language
                          ? `
                      <p style="font-size: 11px; color: #111827; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${lang.language} - ${lang.proficiency || ""}</p>
                    `
                          : "",
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        `
      } else {
        // Executive template
        previewElement.innerHTML = `
          <div style="background: #ffffff; padding: 24px; font-size: 12px; color: #000000; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 16px;">
              <h2 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${resume.fullName || "Your Name"}</h2>
              <div style="font-size: 12px; color: #6b7280; font-family: Arial, sans-serif;">
                ${resume.email ? `${resume.email} | ` : ""}${resume.phone ? `${resume.phone} | ` : ""}${resume.location || ""}
              </div>
            </div>
            ${
              resume.summary
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Professional Summary</h3>
                <p style="font-size: 12px; color: #374151; line-height: 1.4; margin: 0; font-family: Arial, sans-serif;">${resume.summary}</p>
              </div>
            `
                : ""
            }
            ${
              (resume.education || []).some((edu: any) => edu.degree || edu.institution)
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Education</h3>
                ${(resume.education || [])
                  .map((edu: any) =>
                    edu.degree || edu.institution
                      ? `
                  <div style="margin-bottom: 8px;">
                    <p style="font-weight: 600; color: #111827; font-size: 12px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${edu.institution || ""} - ${edu.degree || ""}</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 0; font-family: Arial, sans-serif;">${edu.startDate || ""} - ${edu.endDate || ""} ${edu.gpa ? `| GPA: ${edu.gpa}` : ""}</p>
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.experiences || []).some((exp: any) => exp.title || exp.company)
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Experience</h3>
                ${(resume.experiences || [])
                  .map((exp: any) =>
                    exp.title || exp.company
                      ? `
                  <div style="margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #111827; font-size: 12px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${exp.company || ""} - ${exp.title || ""}</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}</p>
                    ${exp.description ? `<p style="font-size: 12px; color: #374151; line-height: 1.4; margin: 0; font-family: Arial, sans-serif;">${exp.description.replace(/\n/g, "<br>")}</p>` : ""}
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.projects || []).some((proj: any) => proj.name)
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Projects</h3>
                ${(resume.projects || [])
                  .map((proj: any) =>
                    proj.name
                      ? `
                  <div style="margin-bottom: 8px;">
                    <p style="font-weight: 600; color: #111827; font-size: 12px; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${proj.name}</p>
                    ${proj.description ? `<p style="font-size: 12px; color: #374151; line-height: 1.4; margin: 0 0 4px 0; font-family: Arial, sans-serif;">${proj.description}</p>` : ""}
                    ${proj.technologies ? `<p style="font-size: 11px; color: #6b7280; margin: 0; font-family: Arial, sans-serif;">Technologies: ${proj.technologies}</p>` : ""}
                  </div>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              (resume.skills || []).length > 0
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Skills</h3>
                <p style="font-size: 12px; color: #374151; margin: 0; font-family: Arial, sans-serif;">${(resume.skills || []).join(", ")}</p>
              </div>
            `
                : ""
            }
            ${
              (resume.certifications || []).some((cert: any) => cert.name)
                ? `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 4px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Certifications</h3>
                ${(resume.certifications || [])
                  .map((cert: any) =>
                    cert.name
                      ? `
                  <p style="font-size: 12px; color: #374151; margin: 0 0 2px 0; font-family: Arial, sans-serif;">${cert.name} - ${cert.issuer || ""} (${cert.date || ""})</p>
                `
                      : "",
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        `
      }

      tempContainer.appendChild(previewElement)

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Capture with html2canvas with explicit options to avoid CSS inheritance
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        foreignObjectRendering: false,
        removeContainer: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${resume.resumeName || resume.fullName || "resume"}-${new Date().toISOString().split("T")[0]}.pdf`)

      // Clean up
      document.body.removeChild(tempContainer)

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      })
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadResumeHTML = async (resume: any) => {
    toast({
      title: "Downloading Resume",
      description: `Preparing "${resume.resumeName || resume.fullName || "Resume"}" for download.`,
    })

    try {
      // Create a temporary element to render the resume
      const tempDiv = document.createElement("div")
      tempDiv.style.position = "absolute"
      tempDiv.style.left = "-9999px"
      tempDiv.style.width = "800px"
      tempDiv.style.background = "white"
      document.body.appendChild(tempDiv)

      // Render the resume based on template
      const resumeHTML = `
        <div style="background: white; padding: 32px; width: 800px;">
          ${
            resume.template === "classic"
              ? renderClassicPreviewHTML(resume)
              : resume.template === "modern"
                ? renderModernPreviewHTML(resume)
                : renderExecutivePreviewHTML(resume)
          }
        </div>
      `
      tempDiv.innerHTML = resumeHTML

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500))

      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${resume.resumeName || resume.fullName || "resume"}-${new Date().toISOString().split("T")[0]}.pdf`)

      document.body.removeChild(tempDiv)

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      })
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper functions to render HTML for PDF generation
  const renderClassicPreviewHTML = (data: any) => {
    return `
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #d1d5db; padding-bottom: 16px;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">${data.fullName || "Your Name"}</h2>
        <div style="font-size: 12px; color: #6b7280;">
          ${data.email ? `<p>${data.email}</p>` : ""}
          ${data.phone ? `<p>${data.phone}</p>` : ""}
          ${data.location ? `<p>${data.location}</p>` : ""}
        </div>
      </div>
      ${
        data.summary
          ? `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Professional Summary</h3>
          <p style="font-size: 12px; color: #374151;">${data.summary}</p>
        </div>
      `
          : ""
      }
    `
  }

  const renderModernPreviewHTML = (data: any) => {
    return `<div>${data.fullName || "Your Name"}</div>`
  }

  const renderExecutivePreviewHTML = (data: any) => {
    return `<div>${data.fullName || "Your Name"}</div>`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <StudentHeader />

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Upload Your Resume</DialogTitle>
            <DialogDescription className="text-base">
              Upload your existing resume and we'll automatically extract the information
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {isParsing ? (
              <div className="flex flex-col items-center justify-center py-12">
                {uploadedFile && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-cyan-200 w-full">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-cyan-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-800 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Parsing resume...</p>
                <p className="text-sm text-gray-500 mt-2">Extracting your information</p>
              </div>
            ) : (
              <>
                <input
                  id="resume-upload-modal"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload-modal"
                  className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-cyan-800 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 text-gray-400 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <FileUp className="h-8 w-8" />
                    </div>
                    <p className="text-lg text-gray-700 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, DOCX, or TXT (Max 5MB)</p>
                  </div>
                </label>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => document.getElementById("resume-upload-modal")?.click()}
                    className="bg-black hover:bg-gray-800 text-white px-8"
                  >
                    Choose File
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
            <DialogDescription>Give your resume a name to save it</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resume-name">Resume Name</Label>
            <Input
              id="resume-name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder={formData.fullName ? `${formData.fullName} Resume` : "My Resume"}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSaveResume} className="bg-cyan-800 hover:bg-cyan-700">
              Save Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>Enter a new name for your resume</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-resume-name">Resume Name</Label>
            <Input
              id="new-resume-name"
              value={newResumeName}
              onChange={(e) => setNewResumeName(e.target.value)}
              placeholder="Enter new name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename} className="bg-cyan-800 hover:bg-cyan-700">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewOnlyResume?.resumeName || viewOnlyResume?.fullName || "Resume"}</DialogTitle>
          </DialogHeader>
          <div className="border-2 rounded-lg overflow-hidden">
            {viewOnlyResume && (
              <div className="bg-white p-8">
                {/* Render preview based on template */}
                {viewOnlyResume.template === "classic" && renderClassicPreview()}
                {viewOnlyResume.template === "modern" && renderModernPreview()}
                {viewOnlyResume.template === "executive" && renderExecutivePreview()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteResumeId !== null} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResume} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            {activeTab === "details" && (
              <div className="flex gap-3">
                <Button onClick={handleSaveResume} variant="outline" className="gap-2 bg-white">
                  <Save className="h-4 w-4" />
                  Save Resume
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-cyan-800 hover:bg-cyan-700 gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger
                value="templates"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-800 data-[state=active]:bg-transparent px-6 py-3"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-800 data-[state=active]:bg-transparent px-6 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="my-resumes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-800 data-[state=active]:bg-transparent px-6 py-3"
              >
                My Resumes
              </TabsTrigger>
              <TabsTrigger
                value="ats-checker"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-800 data-[state=active]:bg-transparent px-6 py-3"
              >
                ATS Checker
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
                <p className="text-gray-600">Select a template and preview your resume</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`transition-all hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "border-4 border-cyan-800 shadow-lg"
                        : "border-2 hover:border-cyan-600"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="bg-gray-100 h-64 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={`/images/resume-templates/${template.id}.png`}
                          alt={template.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <Button
                        onClick={() => handleTemplateEdit(template.id)}
                        className="w-full bg-cyan-800 hover:bg-cyan-700 gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit with this Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Details Tab - Updated to split layout with form on left and preview on right */}
            <TabsContent value="details" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Side - Form */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className={errors.fullName ? "border-red-500" : ""}
                          />
                          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            placeholder="linkedin.com/in/johndoe"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="github"
                            value={formData.github}
                            onChange={(e) => handleInputChange("github", e.target.value)}
                            placeholder="github.com/johndoe"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portfolio Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="portfolio"
                            value={formData.portfolio}
                            onChange={(e) => handleInputChange("portfolio", e.target.value)}
                            placeholder="johndoe.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={formData.summary}
                          onChange={(e) => handleInputChange("summary", e.target.value)}
                          placeholder="A brief summary of your professional background and career goals..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Work Experience
                        </CardTitle>
                        <Button onClick={addExperience} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.experiences || []).map((exp, index) => (
                        <div key={exp.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-4 pr-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Job Title *</Label>
                                <Input
                                  value={exp.title}
                                  onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                  placeholder="Software Engineer"
                                />
                              </div>
                              <div>
                                <Label>Company *</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                  placeholder="Google"
                                />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                  placeholder="Mountain View, CA"
                                />
                              </div>
                              <div>
                                <Label>Start Date *</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                  disabled={exp.current}
                                />
                              </div>
                              <div className="flex items-center pt-6">
                                <input
                                  type="checkbox"
                                  id={`current-${exp.id}`}
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                                  className="mr-2"
                                />
                                <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                                  Currently working here
                                </Label>
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 30%"
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Education
                        </CardTitle>
                        <Button onClick={addEducation} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.education || []).map((edu) => (
                        <div key={edu.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-4 pr-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Degree *</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                  placeholder="Bachelor of Science in Computer Science"
                                />
                              </div>
                              <div>
                                <Label>Institution *</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                  placeholder="Stanford University"
                                />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                  placeholder="Stanford, CA"
                                />
                              </div>
                              <div>
                                <Label>GPA</Label>
                                <Input
                                  value={edu.gpa}
                                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                                  placeholder="3.8/4.0"
                                />
                              </div>
                              <div>
                                <Label>Start Date *</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>End Date *</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={formData.skillInput}
                          onChange={(e) => handleInputChange("skillInput", e.target.value)}
                          placeholder="Add a skill (e.g., JavaScript, Python, React)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button onClick={addSkill} type="button" className="bg-black hover:bg-gray-800">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.skills || []).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                            {skill}
                            <button
                              onClick={() => removeSkill(index)}
                              className="ml-2 text-gray-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Projects
                        </CardTitle>
                        <Button onClick={addProject} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.projects || []).map((proj) => (
                        <div key={proj.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeProject(proj.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-4 pr-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Project Name *</Label>
                                <Input
                                  value={proj.name}
                                  onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                  placeholder="E-commerce Platform"
                                />
                              </div>
                              <div>
                                <Label>Technologies</Label>
                                <Input
                                  value={proj.technologies}
                                  onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                placeholder="Describe your project and your contributions..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Project Link</Label>
                              <Input
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Certifications */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certifications
                        </CardTitle>
                        <Button onClick={addCertification} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.certifications || []).map((cert) => (
                        <div key={cert.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeCertification(cert.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-4 pr-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Certification Name *</Label>
                                <Input
                                  value={cert.name}
                                  onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                                  placeholder="AWS Certified Solutions Architect"
                                />
                              </div>
                              <div>
                                <Label>Issuing Organization *</Label>
                                <Input
                                  value={cert.issuer}
                                  onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                                  placeholder="Amazon Web Services"
                                />
                              </div>
                              <div>
                                <Label>Date Obtained</Label>
                                <Input
                                  type="month"
                                  value={cert.date}
                                  onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Credential Link</Label>
                                <Input
                                  value={cert.link}
                                  onChange={(e) => updateCertification(cert.id, "link", e.target.value)}
                                  placeholder="https://credential-url.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Awards & Achievements
                        </CardTitle>
                        <Button onClick={addAward} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.awards || []).map((award) => (
                        <div key={award.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeAward(award.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-4 pr-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Award Title *</Label>
                                <Input
                                  value={award.title}
                                  onChange={(e) => updateAward(award.id, "title", e.target.value)}
                                  placeholder="Employee of the Year"
                                />
                              </div>
                              <div>
                                <Label>Issuing Organization</Label>
                                <Input
                                  value={award.issuer}
                                  onChange={(e) => updateAward(award.id, "issuer", e.target.value)}
                                  placeholder="Company Name"
                                />
                              </div>
                              <div>
                                <Label>Date Received</Label>
                                <Input
                                  type="month"
                                  value={award.date}
                                  onChange={(e) => updateAward(award.id, "date", e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={award.description}
                                onChange={(e) => updateAward(award.id, "description", e.target.value)}
                                placeholder="Brief description of the award..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="h-5 w-5" />
                          Languages
                        </CardTitle>
                        <Button onClick={addLanguage} size="sm" className="bg-black hover:bg-gray-800 gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(formData.languages || []).map((lang) => (
                        <div key={lang.id} className="border-2 rounded-lg p-4 relative">
                          <Button
                            onClick={() => removeLanguage(lang.id)}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid md:grid-cols-2 gap-4 pr-8">
                            <div>
                              <Label>Language *</Label>
                              <Input
                                value={lang.language}
                                onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                                placeholder="English"
                              />
                            </div>
                            <div>
                              <Label>Proficiency Level *</Label>
                              <Input
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                                placeholder="Native / Fluent / Intermediate / Basic"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Hobbies & Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={formData.hobbyInput}
                          onChange={(e) => handleInputChange("hobbyInput", e.target.value)}
                          placeholder="Add a hobby (e.g., Photography, Hiking, Reading)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addHobby()
                            }
                          }}
                        />
                        <Button onClick={addHobby} type="button" className="bg-black hover:bg-gray-800">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.hobbies || []).map((hobby, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                            {hobby}
                            <button
                              onClick={() => removeHobby(index)}
                              className="ml-2 text-gray-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Live Preview */}
                <div className="lg:sticky lg:top-8 h-fit">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle>Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 rounded-lg overflow-hidden">{renderPreview()}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* My Resumes Tab - Updated with search bar and improved card layout */}
            <TabsContent value="my-resumes" className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Resume Versions</h2>
                <p className="text-gray-600">View and manage all your created resumes</p>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resumes..."
                    className="pl-10 py-6 text-base"
                  />
                </div>
              </div>

              {!filteredResumes || filteredResumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? "No resumes found matching your search" : "No saved resumes yet"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setActiveTab("details")} variant="outline">
                      Create Your First Resume
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {(filteredResumes || []).map((resume) => (
                    <Card key={resume.id} className="border-2 hover:shadow-lg transition-all overflow-hidden relative">
                      <Button
                        onClick={() => setDeleteResumeId(resume.id)}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-0">
                        <div className="bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
                          <img
                            src={`/images/resume-templates/${resume.template || "classic"}.png`}
                            alt={resume.resumeName || resume.fullName || "Resume"}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="p-6">
                          <h3
                            className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-cyan-600 transition-colors"
                            onClick={() =>
                              handleRenameResume(resume.id, resume.resumeName || resume.fullName || "Untitled Resume")
                            }
                          >
                            {resume.resumeName || resume.fullName || "Untitled"} Resume
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Last edited: {getRelativeTime(resume.updatedAt || resume.createdAt)}
                          </p>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewResume(resume)}
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              onClick={() => loadResume(resume)}
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDownloadResume(resume)}
                              size="sm"
                              className="flex-1 gap-1 bg-cyan-800 hover:bg-cyan-700"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="ats-checker" className="mt-8">
              <ATSChecker />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResumeBuilderContent />
    </Suspense>
  )
}
