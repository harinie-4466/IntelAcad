"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { User, GraduationCap, Code, Target, Upload, Plus, X, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProfileSetup() {
  const router = useRouter()
  const { toast } = useToast()

  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([])
  const [careerInterests, setCareerInterests] = useState<string[]>([])
  const [completedProjects, setCompletedProjects] = useState<Array<{name: string, description: string, technologies: string}>>([])
  const [customSkill, setCustomSkill] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [newProject, setNewProject] = useState({name: "", description: "", technologies: ""})

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

  const handleAddProject = () => {
    if (newProject.name.trim() && newProject.description.trim() && newProject.technologies.trim()) {
      setCompletedProjects([...completedProjects, { ...newProject }])
      setNewProject({ name: "", description: "", technologies: "" })
    }
  }

  const handleRemoveProject = (index: number) => {
    setCompletedProjects(completedProjects.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const profileData = {
      name: formData.get("name"),
      email: formData.get("email"),
      rollNumber: formData.get("rollNumber"),
      contactNumber: formData.get("contactNumber"),
      branch: formData.get("branch"),
      year: formData.get("year"),
      cgpa: formData.get("cgpa"),
      completedCourses,
      technicalSkills,
      careerInterests,
      completedProjects,
      careerBio: formData.get("careerBio"),
      profileCompleted: true,
    }

    // Send profile to backend
    const token = localStorage.getItem('token')
    if (!token) {
      toast({ title: 'Not authenticated', description: 'Please login first', variant: 'destructive' })
      router.push('/login')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save profile')
        return res.json()
      })
      .then(() => {
        toast({ title: 'Profile Created!', description: 'Your profile has been successfully set up.' })
  // Navigate to view profile page so user can see their profile
  router.push('/student/profile')
      })
      .catch((err) => {
        console.error(err)
        toast({ title: 'Save failed', description: 'Unable to save profile', variant: 'destructive' })
      })
  }

  const filteredSkills = skills.filter((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Setup</h1>
          <p className="text-gray-600">Help us understand your academic journey and career aspirations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-600" />
                <CardTitle>Basic Information</CardTitle>
              </div>
              <CardDescription>Tell us about yourself and your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" placeholder="your.email@domain.com" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number / Student ID</Label>
                  <Input id="rollNumber" name="rollNumber" placeholder="Enter your roll number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" placeholder="+91 9876543210" />
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
              <CardDescription>Share your academic background and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Select name="branch" required>
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
                  <Select name="year" required>
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
                  <Input id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="8.5" />
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
              <CardDescription>Select your technical skills, search, add custom ones, edit, or delete</CardDescription>
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
              <CardDescription>What areas of technology interest you the most?</CardDescription>
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
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-cyan-600" />
                <CardTitle>Completed Projects</CardTitle>
              </div>
              <CardDescription>Add projects you have worked on to showcase your skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectTechnologies">Technologies Used</Label>
                    <Input
                      id="projectTechnologies"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project, its features, and your role..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddProject}
                  variant="outline"
                  className="w-full md:w-auto"
                  disabled={!newProject.name.trim() || !newProject.description.trim() || !newProject.technologies.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {completedProjects.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <Label>Added Projects ({completedProjects.length})</Label>
                  <div className="space-y-3">
                    {completedProjects.map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{project.name}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProject(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.split(',').map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="bg-cyan-800 hover:bg-cyan-700 px-12">
              Start Your Journey
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
