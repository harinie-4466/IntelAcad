"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { User, GraduationCap, Code, Target, Upload, Plus, FileText, X, Pencil } from "lucide-react"
import { StudentHeader } from "@/components/student-header"
import { Badge } from "@/components/ui/badge"

export default function ProfileUpdate() {
  const router = useRouter()
  const { toast } = useToast()

  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([])
  const [careerInterests, setCareerInterests] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [certificationsFiles, setCertificationsFiles] = useState<File[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    // Load authoritative profile from backend when available
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json().catch(() => ({})) : Promise.reject('no-profile')))
      .then((data) => {
        const profileData = data.profile || {}
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          rollNumber: profileData.rollNumber || "",
          contactNumber: profileData.contactNumber || "",
          branch: profileData.branch || "",
          year: profileData.year || "",
          cgpa: profileData.cgpa || "",
          careerBio: profileData.careerBio || profileData.bio || "",
        })
        setCompletedCourses(profileData.completedCourses || [])
        setTechnicalSkills(profileData.technicalSkills || profileData.skills || [])
        setCareerInterests(profileData.careerInterests || [])
      })
      .catch(() => {
        // no-op; user can fill the form manually
      })
  }, [])

  const courses = [
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Technologies",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Mobile Computing",
    "Cloud Computing",
  ]

  const skills = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "React",
    "Node.js",
    "HTML/CSS",
    "SQL",
    "MongoDB",
    "Git",
    "Docker",
    "AWS",
    "Machine Learning",
    "Data Analysis",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Cybersecurity",
  ]

  const interests = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
    "UI/UX Design",
    "Research",
    "Entrepreneurship",
    "Product Management",
    "Software Testing",
    "Blockchain",
  ]

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    contactNumber: "",
    branch: "",
    year: "",
    cgpa: "",
    careerBio: "",
  })

  const filteredSkills = skills.filter((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleCourse = (course: string) => {
    setCompletedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const toggleSkill = (skill: string) => {
    setTechnicalSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const toggleInterest = (interest: string) => {
    setCareerInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !technicalSkills.includes(customSkill.trim())) {
      setTechnicalSkills([...technicalSkills, customSkill.trim()])
      setCustomSkill("")
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleCertificationsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificationsFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const profileData = {
      ...formData,
      completedCourses,
      technicalSkills,
      careerInterests,
      resumeFileName: resumeFile?.name || null,
      certificationsFileNames: certificationsFiles.map((f) => f.name),
      profileCompleted: true,
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast({ title: "Not authenticated", description: "Please login and try again." })
      router.push('/login')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save profile')
        return res.json()
      })
      .then(() => {
        toast({ title: 'Profile Updated!', description: 'Your profile has been successfully updated.' })
        router.push('/student/profile')
      })
      .catch(() => {
        toast({ title: 'Save failed', description: 'Unable to save profile. Try again later.' })
      })
  }

  const handleCancel = () => {
    router.push("/student/profile")
  }

  const removeSkill = (skill: string) => {
    setTechnicalSkills((prev) => prev.filter((s) => s !== skill))
  }

  const startEditSkill = (skill: string) => {
    setEditingSkill(skill)
    setEditValue(skill)
  }

  const saveEditSkill = () => {
    if (editValue.trim() && editingSkill) {
      setTechnicalSkills((prev) => prev.map((s) => (s === editingSkill ? editValue.trim() : s)))
      setEditingSkill(null)
      setEditValue("")
    }
  }

  const cancelEditSkill = () => {
    setEditingSkill(null)
    setEditValue("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Profile</h1>
            <p className="text-gray-600">Modify your academic journey and career information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Basic Information</CardTitle>
                </div>
                <CardDescription>Update your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number / Student ID</Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      placeholder="Enter your roll number"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="+91 9876543210"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <Button type="button" variant="outline" className="w-full md:w-auto bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Academic Details</CardTitle>
                </div>
                <CardDescription>Update your academic background and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Select
                      name="branch"
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cse">Computer Science Engineering</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                        <SelectItem value="eee">Electrical & Electronics</SelectItem>
                        <SelectItem value="mech">Mechanical Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study *</Label>
                    <Select
                      name="year"
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA / GPA</Label>
                    <Input
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="8.5"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Completed Courses</Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {courses.map((course) => (
                      <div key={course} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Checkbox
                          id={course}
                          checked={completedCourses.includes(course)}
                          onCheckedChange={() => toggleCourse(course)}
                        />
                        <label
                          htmlFor={course}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {course}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Skills & Expertise</CardTitle>
                </div>
                <CardDescription>Update your technical skills, search, edit, or delete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchSkills">Search Skills</Label>
                  <Input
                    id="searchSkills"
                    placeholder="Search available skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Available Skills</Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {filteredSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Checkbox
                          id={skill}
                          checked={technicalSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                  {filteredSkills.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No skills found matching your search.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customSkill">Add Custom Skill</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customSkill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Enter a custom skill"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomSkill()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCustomSkill} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {technicalSkills.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Selected Skills ({technicalSkills.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {technicalSkills.map((skill) => (
                        <div key={skill}>
                          {editingSkill === skill ? (
                            <div className="flex items-center gap-1 bg-cyan-50 border border-cyan-200 rounded-md px-2 py-1">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-6 w-32 text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    saveEditSkill()
                                  } else if (e.key === "Escape") {
                                    cancelEditSkill()
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={saveEditSkill}
                              >
                                <span className="text-xs">✓</span>
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={cancelEditSkill}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="secondary" className="gap-2 pr-1 bg-cyan-50 text-cyan-900 border-cyan-200">
                              <span>{skill}</span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => startEditSkill(skill)}
                                  className="hover:bg-cyan-200 rounded p-0.5"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="hover:bg-cyan-200 rounded p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Career Interests</CardTitle>
                </div>
                <CardDescription>Update your areas of interest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2 p-2 border rounded-md">
                      <Checkbox
                        id={interest}
                        checked={careerInterests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      <label
                        htmlFor={interest}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerBio">Career Aspirations / Bio</Label>
                  <Textarea
                    id="careerBio"
                    name="careerBio"
                    placeholder="Tell us about your career goals and aspirations..."
                    rows={4}
                    className="resize-none"
                    value={formData.careerBio}
                    onChange={(e) => setFormData({ ...formData, careerBio: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Documents</CardTitle>
                </div>
                <CardDescription>Upload your resume and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Add Resume</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="cursor-pointer"
                    />
                    {resumeFile && <span className="text-sm text-gray-600">Selected: {resumeFile.name}</span>}
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Add Certifications</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="certifications"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleCertificationsUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {certificationsFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Selected files:</p>
                      <ul className="text-xs text-gray-500 list-disc list-inside">
                        {certificationsFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB each)</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button type="button" variant="outline" onClick={handleCancel} size="lg" className="px-12 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" size="lg" className="bg-cyan-800 hover:bg-cyan-700 px-12">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
