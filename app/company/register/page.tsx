"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Upload, X, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ValidationErrors {
  companyName?: string
  hrName?: string
  companyWebsite?: string
  hrEmail?: string
  companyUrl?: string
  hrMobile?: string
  companyLocation?: string
  password?: string
  confirmPassword?: string
}

export default function CompanyRegister() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [industryTags, setIndustryTags] = useState<string[]>(["Software Development", "Marketing", "Finance"])
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    companyName: "",
    hrName: "",
    companyWebsite: "",
    hrEmail: "",
    companyUrl: "",
    hrMobile: "",
    companyLocation: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateURL = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)"
    }
    return undefined
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "companyName":
        return value.trim() === "" ? "Company name is required" : undefined
      case "hrName":
        return value.trim() === "" ? "HR name is required" : undefined
      case "companyWebsite":
        if (value.trim() === "") return "Company website is required"
        return !validateURL(value) ? "Please enter a valid URL" : undefined
      case "hrEmail":
        if (value.trim() === "") return "HR email is required"
        return !validateEmail(value) ? "Please enter a valid email address" : undefined
      case "companyUrl":
        if (value.trim() === "") return "Company URL is required"
        return !validateURL(value) ? "Please enter a valid URL" : undefined
      case "hrMobile":
        if (value.trim() === "") return "HR mobile is required"
        return !validatePhone(value) ? "Please enter a valid phone number" : undefined
      case "companyLocation":
        return value.trim() === "" ? "Company location is required" : undefined
      case "password":
        return validatePassword(value)
      case "confirmPassword":
        if (value.trim() === "") return "Please confirm your password"
        return value !== formData.password ? "Passwords do not match" : undefined
      default:
        return undefined
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Validate on change if field has been touched
    if (touched[id]) {
      const error = validateField(id, value)
      setErrors((prev) => ({ ...prev, [id]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))
    const error = validateField(id, value)
    setErrors((prev) => ({ ...prev, [id]: error }))
  }

  const removeTag = (tagToRemove: string) => {
    setIndustryTags(industryTags.filter((tag) => tag !== tagToRemove))
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      if (!industryTags.includes(newTag.trim())) {
        setIndustryTags([...industryTags, newTag.trim()])
      }
      setNewTag("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: ValidationErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof ValidationErrors] = error
      }
    })

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0]
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    // If validation passes, proceed with registration
    router.push("/company/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-800/20 py-12 px-4">
      <Card className="max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center">
            <Link href="/company" className="flex items-center">
              <Image src="/intelacad-logo.png" alt="IntelAcad" width={160} height={70} className="object-contain" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Company Account</h1>
            <div className="w-24 h-1 bg-cyan-800 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Company Name"
                    className={`h-12 ${errors.companyName && touched.companyName ? "border-red-500" : ""}`}
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.companyName && touched.companyName && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrName">
                    HR / Contact Person Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hrName"
                    placeholder="HR / Contact Person Name"
                    className={`h-12 ${errors.hrName && touched.hrName ? "border-red-500" : ""}`}
                    value={formData.hrName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.hrName && touched.hrName && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.hrName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">
                    Company Website <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyWebsite"
                    placeholder="https://example.com"
                    className={`h-12 ${errors.companyWebsite && touched.companyWebsite ? "border-red-500" : ""}`}
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.companyWebsite && touched.companyWebsite && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyWebsite}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrEmail">
                    HR Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hrEmail"
                    type="email"
                    placeholder="hr@company.com"
                    className={`h-12 ${errors.hrEmail && touched.hrEmail ? "border-red-500" : ""}`}
                    value={formData.hrEmail}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.hrEmail && touched.hrEmail && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.hrEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyUrl">
                    Company URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyUrl"
                    placeholder="https://company.com"
                    className={`h-12 ${errors.companyUrl && touched.companyUrl ? "border-red-500" : ""}`}
                    value={formData.companyUrl}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.companyUrl && touched.companyUrl && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyUrl}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrMobile">
                    HR Mobile <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hrMobile"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className={`h-12 ${errors.hrMobile && touched.hrMobile ? "border-red-500" : ""}`}
                    value={formData.hrMobile}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.hrMobile && touched.hrMobile && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.hrMobile}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyLocation">
                    Company Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyLocation"
                    placeholder="City, Country"
                    className={`h-12 ${errors.companyLocation && touched.companyLocation ? "border-red-500" : ""}`}
                    value={formData.companyLocation}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.companyLocation && touched.companyLocation && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyLocation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`h-12 pr-10 ${errors.password && touched.password ? "border-red-500" : ""}`}
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must be 8+ characters with uppercase, lowercase, number, and special character
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`h-12 pr-10 ${errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-800 hover:text-cyan-900"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Industry Tags Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Industry Tags</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {industryTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-cyan-800 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-cyan-900 rounded-full p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="Type and press Enter to add tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={addTag}
                className="h-12"
              />
            </div>

            {/* Company Logo Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Logo</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-800 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-14 bg-cyan-800 hover:bg-cyan-900 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
