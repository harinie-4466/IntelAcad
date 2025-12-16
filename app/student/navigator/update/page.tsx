"use client"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export default function UpdateJourney() {
  const router = useRouter()
  const { toast } = useToast()
  const [isFirstSetup, setIsFirstSetup] = useState(false)

  // Form state
  const [careerGoal, setCareerGoal] = useState("")
  const [targetExams, setTargetExams] = useState("")
  const [domains, setDomains] = useState<string[]>([])
  const [customDomain, setCustomDomain] = useState("")
  const [academicStage, setAcademicStage] = useState("")
  const [shortTermGoals, setShortTermGoals] = useState("")
  const [learningModes, setLearningModes] = useState<string[]>([])
  const [skillLevel, setSkillLevel] = useState("intermediate")
  const [commitmentHours, setCommitmentHours] = useState([10])
  const [visionStatement, setVisionStatement] = useState("")
  const [coursesCompleted, setCoursesCompleted] = useState<string[]>([])
  const [customCourse, setCustomCourse] = useState("")

  const domainOptions = [
    "AI & Machine Learning",
    "Web Development",
    "Data Science",
    "Mobile Development",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "Blockchain",
  ]

  const learningModeOptions = [
    { id: "self-paced", label: "Self-paced" },
    { id: "mentor-guided", label: "Mentor-guided" },
    { id: "team-based", label: "Team-based" },
    { id: "project-oriented", label: "Project-oriented" },
  ]

  const courseOptions = [
    "HTML & CSS Basics",
    "JavaScript Fundamentals",
    "Git & Version Control",
    "Responsive Design",
    "React.js Essentials",
    "State Management (Redux)",
    "Next.js Framework",
    "TypeScript",
    "Node.js & Express",
    "RESTful APIs",
    "Database Design (SQL)",
    "Authentication & Security",
    "Python Programming",
    "Data Structures & Algorithms",
    "Machine Learning Basics",
    "Docker & Containerization",
    "AWS Cloud Services",
    "System Design",
  ]

  // Load existing journey data
  useEffect(() => {
    const load = async () => {
      if (typeof window === 'undefined') return
      const token = localStorage.getItem('token')
      if (!token) {
        setIsFirstSetup(true)
        return
      }

      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
        const res = await fetch(`${base}/api/journey`, { headers: { Authorization: `Bearer ${token}` } })
        const json = await res.json()
        const data = json.journeyData || json.journey || {}
        // support older localStorage shape
        const merged = { ...(data || {}), ...(json.journeyDataByStream ? { journeyDataByStream: json.journeyDataByStream } : {}) }

        if (Object.keys(merged).length === 0) {
          setIsFirstSetup(true)
          return
        }

        setCareerGoal(merged.careerGoal || '')
        setTargetExams(merged.targetExams || '')
        setDomains(merged.domains || [])
        setAcademicStage(merged.academicStage || '')
        setShortTermGoals(merged.shortTermGoals || '')
        setLearningModes(merged.learningModes || [])
        setSkillLevel(merged.skillLevel || 'intermediate')
        setCommitmentHours([merged.commitmentHours || 10])
        setVisionStatement(merged.visionStatement || '')
        setCoursesCompleted(merged.coursesCompleted || [])
        setIsFirstSetup(false)
      } catch (e) {
        console.error('[update] load journey failed', e)
        setIsFirstSetup(true)
      }
    }

    load()
  }, [])

  const handleDomainToggle = (domain: string) => {
    setDomains((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]))
  }

  const handleAddCustomDomain = () => {
    if (customDomain.trim() && !domains.includes(customDomain.trim())) {
      setDomains((prev) => [...prev, customDomain.trim()])
      setCustomDomain("")
    }
  }

  const handleRemoveDomain = (domain: string) => {
    setDomains((prev) => prev.filter((d) => d !== domain))
  }

  const handleCourseToggle = (course: string) => {
    setCoursesCompleted((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const handleAddCustomCourse = () => {
    if (customCourse.trim() && !coursesCompleted.includes(customCourse.trim())) {
      setCoursesCompleted((prev) => [...prev, customCourse.trim()])
      setCustomCourse("")
    }
  }

  const handleRemoveCourse = (course: string) => {
    setCoursesCompleted((prev) => prev.filter((c) => c !== course))
  }

  const handleSubmit = () => {
    const journeyData = {
      careerGoal,
      targetExams,
      domains,
      academicStage,
      shortTermGoals,
      learningModes,
      skillLevel,
      commitmentHours: commitmentHours[0],
      visionStatement,
      coursesCompleted,
    }

    // save to backend
    const save = async () => {
      try {
        const token = localStorage.getItem('token')
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
        await fetch(`${base}/api/journey`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({ navigatorJourneyComplete: true, journeyData }),
        })
        toast({
          title: isFirstSetup ? 'Journey Created!' : 'Journey Updated!',
          description: isFirstSetup
            ? "Your personalized roadmap has been created successfully."
            : "Your personalized roadmap has been updated successfully.",
        })
        router.push('/student/navigator/dashboard')
      } catch (e) {
        console.error('[update] save failed', e)
        toast({ title: 'Save failed', description: 'Could not save your journey. Try again later.' })
      }
    }

    save()
  }

  const handleLearningModeToggle = (modeId: string) => {
    setLearningModes((prev) => (prev.includes(modeId) ? prev.filter((mode) => mode !== modeId) : [...prev, modeId]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isFirstSetup ? "Setup Your Journey" : "Update Your Profile"}
            </h1>
            <p className="text-gray-600">
              {isFirstSetup ? "Define your goals and preferences to get started" : "Modify your goals and preferences"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Journey Settings</CardTitle>
              <CardDescription>
                {isFirstSetup ? "Set up" : "Update"} your career aspirations and learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Career Goals */}
              <div className="space-y-3">
                <Label>Career Goal</Label>
                <RadioGroup value={careerGoal} onValueChange={setCareerGoal}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="job" id="job" />
                    <Label htmlFor="job" className="font-normal cursor-pointer">
                      Job / Placements
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="higher-studies" id="higher-studies" />
                    <Label htmlFor="higher-studies" className="font-normal cursor-pointer">
                      Higher Studies (PG)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entrepreneurship" id="entrepreneurship" />
                    <Label htmlFor="entrepreneurship" className="font-normal cursor-pointer">
                      Entrepreneurship
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-decided" id="not-decided" />
                    <Label htmlFor="not-decided" className="font-normal cursor-pointer">
                      Not Decided Yet
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {careerGoal === "higher-studies" && (
                <div className="space-y-2">
                  <Label htmlFor="target-exams">Target Exam Names</Label>
                  <Input
                    id="target-exams"
                    placeholder="e.g., GATE, GRE, CAT"
                    value={targetExams}
                    onChange={(e) => setTargetExams(e.target.value)}
                  />
                </div>
              )}

              {/* Domains */}
              <div className="space-y-3">
                <Label>Preferred Domain / Field of Interest</Label>
                <div className="grid grid-cols-2 gap-3">
                  {domainOptions.map((domain) => (
                    <div
                      key={domain}
                      onClick={() => handleDomainToggle(domain)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        domains.includes(domain)
                          ? "border-cyan-800 bg-cyan-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{domain}</span>
                    </div>
                  ))}
                </div>

                {/* Custom Domain Input */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="custom-domain">Add Custom Domain</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-domain"
                      placeholder="Enter custom domain (e.g., IoT, Robotics)"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomDomain()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCustomDomain} className="bg-cyan-800 hover:bg-cyan-700">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Domains with Delete Functionality */}
                {domains.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Selected Domains ({domains.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <Badge key={domain} className="bg-cyan-800 hover:bg-cyan-700 pr-1 flex items-center gap-1">
                          {domain}
                          <button
                            type="button"
                            onClick={() => handleRemoveDomain(domain)}
                            className="ml-1 hover:bg-cyan-900 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Courses Completed */}
              <div className="space-y-3">
                <Label>Courses Completed</Label>
                <p className="text-sm text-gray-600">
                  Select the courses you've completed to update your roadmap progress
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {courseOptions.map((course) => (
                    <div
                      key={course}
                      onClick={() => handleCourseToggle(course)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        coursesCompleted.includes(course)
                          ? "border-cyan-800 bg-cyan-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            coursesCompleted.includes(course) ? "border-cyan-800 bg-cyan-800" : "border-gray-300"
                          }`}
                        >
                          {coursesCompleted.includes(course) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium">{course}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Course Input */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="custom-course">Add Custom Course</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-course"
                      placeholder="Enter course name (e.g., Advanced React Patterns)"
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomCourse()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCustomCourse} className="bg-cyan-800 hover:bg-cyan-700">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Courses with Delete Functionality */}
                {coursesCompleted.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Completed Courses ({coursesCompleted.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {coursesCompleted.map((course) => (
                        <Badge key={course} className="bg-green-600 hover:bg-green-700 pr-1 flex items-center gap-1">
                          {course}
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course)}
                            className="ml-1 hover:bg-green-800 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Stage */}
              <div className="space-y-2">
                <Label htmlFor="academic-stage">Current Academic Stage</Label>
                <Select value={academicStage} onValueChange={setAcademicStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st-year">1st Year</SelectItem>
                    <SelectItem value="2nd-year">2nd Year</SelectItem>
                    <SelectItem value="3rd-year">3rd Year</SelectItem>
                    <SelectItem value="4th-year">4th Year</SelectItem>
                    <SelectItem value="completed">Completed UG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Short Term Goals */}
              <div className="space-y-2">
                <Label htmlFor="short-term-goals">Short-Term Goals (Next 6-12 months)</Label>
                <Textarea
                  id="short-term-goals"
                  placeholder="What do you want to achieve in the next 6-12 months?"
                  rows={4}
                  value={shortTermGoals}
                  onChange={(e) => setShortTermGoals(e.target.value)}
                />
              </div>

              {/* Learning Modes */}
              <div className="space-y-3">
                <Label>Preferred Learning Mode</Label>
                <div className="space-y-2">
                  {learningModeOptions.map((mode) => (
                    <div key={mode.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={mode.id}
                        checked={learningModes.includes(mode.id)}
                        onCheckedChange={() => handleLearningModeToggle(mode.id)}
                      />
                      <Label htmlFor={mode.id} className="font-normal cursor-pointer">
                        {mode.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-3">
                <Label>Skill Level Assessment</Label>
                <RadioGroup value={skillLevel} onValueChange={setSkillLevel}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="font-normal cursor-pointer">
                      Beginner - Just starting out
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="font-normal cursor-pointer">
                      Intermediate - Have some experience
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="font-normal cursor-pointer">
                      Advanced - Proficient and experienced
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Commitment Hours */}
              <div className="space-y-3">
                <Label>Commitment Hours per Week: {commitmentHours[0]} hours</Label>
                <Slider
                  value={commitmentHours}
                  onValueChange={setCommitmentHours}
                  min={1}
                  max={40}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Vision Statement */}
              <div className="space-y-2">
                <Label htmlFor="vision">Expected Outcome / Vision Statement</Label>
                <Textarea
                  id="vision"
                  placeholder="Describe where you see yourself in the next 2-3 years..."
                  rows={5}
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {!isFirstSetup && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/student/navigator/dashboard")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="button" onClick={handleSubmit} className="flex-1 bg-cyan-800 hover:bg-cyan-700">
                  {isFirstSetup ? "Create Journey" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
