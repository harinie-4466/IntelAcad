"use client"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, MapPin, Calendar, Award, Briefcase, Edit, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"


export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  // Generate academic progress data based on form inputs
  const generateAcademicProgressData = () => {
    if (!profile) return []
    
    const currentYear = parseInt(profile.year) || 1
    const totalCourses = profile.completedCourses?.length || 0
    const totalSkills = profile.technicalSkills?.length || 0
    const totalProjects = profile.completedProjects?.length || 0
    const currentCgpa = parseFloat(profile.cgpa) || 0
    
    // Generate data for each year up to current year
    const data: Array<{year: string, courses: number, skills: number, projects: number, cgpa: number}> = []
    for (let year = 1; year <= Math.min(currentYear, 4); year++) {
      const yearMultiplier = year / currentYear
      const coursesThisYear: number = Math.round(totalCourses * yearMultiplier) - (data.length > 0 ? data[data.length - 1].courses : 0)
      const skillsThisYear: number = Math.round(totalSkills * yearMultiplier) - (data.length > 0 ? data[data.length - 1].skills : 0)
      const projectsThisYear = year === currentYear ? totalProjects : 0
      const cgpaThisYear = Math.max(7, currentCgpa - (currentYear - year) * 0.3)
      
      data.push({
        year: `Year ${year}`,
        courses: Math.max(0, coursesThisYear),
        skills: Math.max(0, skillsThisYear),
        projects: projectsThisYear,
        cgpa: parseFloat(cgpaThisYear.toFixed(1))
      })
    }
    
    return data
  }

  // Generate skills distribution data
  const generateSkillsDistributionData = () => {
    if (!profile?.technicalSkills) return []
    
    const skills = profile.technicalSkills
    const colors = ['#0891b2', '#9333ea', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#be185d', '#0d9488']
    
    return skills.map((skill: string, index: number) => ({
      name: skill,
      value: 1,
      fill: colors[index % colors.length]
    }))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json().catch(() => ({})) : Promise.reject('no-profile'))
      .then((data) => {
        const fetched = data.profile || {}
        // Normalize expected arrays/numeric fields from server response
        fetched.technicalSkills = Array.isArray(fetched.technicalSkills) ? fetched.technicalSkills : []
        fetched.completedProjects = Array.isArray(fetched.completedProjects) ? fetched.completedProjects : []
        fetched.projectsCompleted = (fetched.completedProjects || []).length
        setProfile(fetched)
      })
      .catch(() => {
        // fallback: try to load a local profile saved by the dashboard update flow
        try {
          const raw = localStorage.getItem('profile')
          if (raw) {
            const local = JSON.parse(raw)
            // ensure numeric summary exists
            const profileFromLocal = {
              ...local,
              projectsCompleted: (local.completedProjects && local.completedProjects.length) || (local.projectsCompleted ?? 0),
              technicalSkills: local.technicalSkills || []
            }
            setProfile(profileFromLocal)
            return
          }
        } catch (e) {
          // ignore and leave profile null
        }
      })
  }, [])

  // Listen for explicit profile updates from other parts of the app (dashboard)
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('profile')
        if (!raw) return
        const local = JSON.parse(raw)
        setProfile((prev: any) => {
          if (!prev) {
            return {
              ...local,
              technicalSkills: Array.isArray(local.technicalSkills) ? local.technicalSkills : [],
              completedProjects: Array.isArray(local.completedProjects) ? local.completedProjects : [],
              projectsCompleted: (local.completedProjects && local.completedProjects.length) || (local.projectsCompleted ?? 0),
            }
          }
          // merge arrays without overwriting server-provided fields
          const mergedSkills = Array.from(new Set([...(prev.technicalSkills || []), ...(local.technicalSkills || [])]))
          const mergedProjects = Array.from(new Set([...(prev.completedProjects || []), ...(local.completedProjects || [])]))
          return { ...prev, technicalSkills: mergedSkills, completedProjects: mergedProjects, projectsCompleted: mergedProjects.length }
        })
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('profile-updated', handler)
    return () => window.removeEventListener('profile-updated', handler)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/landing")} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile?.avatar || "/placeholder-user.jpg"} alt={profile?.name || "Student"} />
                  <AvatarFallback className="text-2xl bg-cyan-100 text-cyan-800">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "JD"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name || 'John Doe'}</h1>
                      <p className="text-gray-600 mb-3">
                        {profile?.branch && profile?.year 
                          ? `${profile.branch.toUpperCase()} - ${profile.year} Year` 
                          : 'B.Tech Computer Science Engineering - 3rd Year'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(profile?.technicalSkills) && profile.technicalSkills.length > 0 ? (
                          profile.technicalSkills.slice(0, 3).map((s: string) => (
                            <Badge key={s} className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">{s}</Badge>
                          ))
                        ) : null}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/student/profile/update")}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Update Profile
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{profile?.email || 'john.doe@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{profile?.contactNumber || profile?.phone || '+1 (234) 567-8900'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-cyan-800" />
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Overall Progress</span>
                          <span className="text-sm font-semibold">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">✓ Basic Information</span>
                          <span className="text-green-600">Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">✓ Skills & Interests</span>
                          <span className="text-green-600">Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">○ Resume Upload</span>
                          <span className="text-orange-600">Pending</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Projects Completed</span>
                        <span className="font-semibold text-lg">{profile?.projectsCompleted ?? 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Certifications</span>
                        <span className="font-semibold text-lg">{(profile?.certificationsFileNames && profile.certificationsFileNames.length) || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Internship Applications</span>
                        <span className="font-semibold text-lg">{profile?.internshipApplications ?? 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mock Tests Taken</span>
                        <span className="font-semibold text-lg">{profile?.mockTestsTaken ?? 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Summary</CardTitle>
                  <CardDescription>Your current academic status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-cyan-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Current CGPA</span>
                        <span className="text-2xl font-bold text-cyan-800">{profile?.cgpa || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total Skills</span>
                        <span className="text-2xl font-bold text-purple-800">{(profile?.technicalSkills && profile.technicalSkills.length) || (profile?.skills && profile.skills.length) || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress Visualization</CardTitle>
                  <CardDescription>Your progress across years based on completed courses, skills, and projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateAcademicProgressData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="year" 
                          stroke="#6b7280" 
                          style={{ fontSize: "12px" }} 
                        />
                        <YAxis yAxisId="left" stroke="#0891b2" style={{ fontSize: "12px" }} />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#9333ea"
                          style={{ fontSize: "12px" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar yAxisId="left" dataKey="courses" fill="#0891b2" name="Courses" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="left" dataKey="skills" fill="#9333ea" name="Skills" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="projects" fill="#059669" name="Projects" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-800">
                        {(profile?.completedCourses && profile.completedCourses.length) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Courses</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-800">
                        {(profile?.technicalSkills && profile.technicalSkills.length) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Skills</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">
                        {(profile?.completedProjects && profile.completedProjects.length) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Projects</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-800">
                        {profile?.year || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Current Year</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                  <CardDescription>Your academic background information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Branch</span>
                        <span className="text-gray-600">{profile?.branch?.toUpperCase() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Year of Study</span>
                        <span className="text-gray-600">{profile?.year ? `${profile.year} Year` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Roll Number</span>
                        <span className="text-gray-600">{profile?.rollNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Completed Courses</span>
                        <span className="text-gray-600">{(profile?.completedCourses && profile.completedCourses.length) || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Courses</CardTitle>
                  <CardDescription>Courses you have completed during your academic journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.completedCourses && profile.completedCourses.length > 0) ? (
                      profile.completedCourses.map((course: string, index: number) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 bg-green-50 text-green-800 border-green-200">
                          {course}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No completed courses added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>Your technical skills and their distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {(profile?.technicalSkills && profile.technicalSkills.length > 0) ? (
                    <div className="space-y-6">
                      {/* Skills as badges */}
                      <div className="flex flex-wrap gap-2">
                        {profile.technicalSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="px-3 py-1 bg-cyan-50 text-cyan-800 border-cyan-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Skills distribution pie chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={generateSkillsDistributionData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name }) => name}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {generateSkillsDistributionData().map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No technical skills added yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Career Interests</CardTitle>
                  <CardDescription>Areas of technology that interest you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.careerInterests && profile.careerInterests.length > 0) ? (
                      profile.careerInterests.map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-800 border-blue-200">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No career interests added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.certificationsFileNames && profile.certificationsFileNames.length > 0 ? (
                      profile.certificationsFileNames.map((name: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="p-2 bg-cyan-100 rounded">
                            <Award className="h-6 w-6 text-cyan-800" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{name}</h4>
                            <p className="text-sm text-gray-600">Uploaded document</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No certifications uploaded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed Projects</CardTitle>
                  <CardDescription>Projects you have worked on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(profile?.completedProjects && profile.completedProjects.length > 0) ? (
                      profile.completedProjects.map((project: any, index: number) => {
                        // Support projects represented as either string titles or objects with fields.
                        const isStringProject = typeof project === 'string'
                        const projectName = isStringProject ? project : (project?.name || 'Untitled Project')
                        const projectDescription = isStringProject ? '' : (project?.description || '')

                        // Ensure technologies is a string/array before splitting. Support array or comma-separated string.
                        let rawTech: any = ''
                        if (isStringProject) {
                          rawTech = ''
                        } else {
                          // project is an object here
                          rawTech = project?.technologies ?? project?.techList ?? ''
                        }
                        let techList: string[] = []
                        if (Array.isArray(rawTech)) {
                          techList = rawTech.map(String)
                        } else if (typeof rawTech === 'string') {
                          techList = rawTech.length > 0 ? rawTech.split(',').map(t => t.trim()).filter(Boolean) : []
                        }

                        return (
                          <div key={index} className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">{projectName}</h4>
                            {projectDescription ? (
                              <p className="text-sm text-gray-600 mb-3">{projectDescription}</p>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                              {techList.length > 0 ? techList.map((tech: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              )) : (
                                <Badge variant="outline" className="text-xs">No technologies listed</Badge>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No projects added yet. Complete your profile setup to add projects.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
