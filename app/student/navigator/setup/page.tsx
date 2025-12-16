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
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function NavigatorSetup() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 4

  // Form state
  const [careerGoal, setCareerGoal] = useState("")
  const [targetExams, setTargetExams] = useState("")
  const [domains, setDomains] = useState<string[]>([])
  const [academicStage, setAcademicStage] = useState("")
  const [shortTermGoals, setShortTermGoals] = useState("")
  const [learningModes, setLearningModes] = useState<string[]>([])
  const [skillLevel, setSkillLevel] = useState("intermediate")
  const [commitmentHours, setCommitmentHours] = useState([10])
  const [visionStatement, setVisionStatement] = useState("")

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

  const handleDomainToggle = (domain: string) => {
    setDomains((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]))
  }

  const handleLearningModeToggle = (mode: string) => {
    setLearningModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
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
    }

    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      setIsSubmitting(false)
      toast({
        title: "Authentication Required",
        description: "Please login to save your journey setup.",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
      // Send inputs to server and let server generate/persist personalizedRoadmap (optionally via Deepseek)
      const journeyInput = { careerGoal, targetExams, domains, academicStage, shortTermGoals, learningModes, skillLevel, commitmentHours: commitmentHours[0], visionStatement }
      const response = await fetch(`${base}/api/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          navigatorJourneyComplete: true, 
          journeyData, 
          journeyDataByStream: {},
          journeyInput,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save journey setup')
      }

      const result = await response.json()
      console.log('Journey setup saved successfully:', result)

      toast({
        title: "Journey Setup Complete!",
        description: "Your personalized roadmap will be generated and available in your dashboard shortly.",
      })

      // Navigate to navigator dashboard after successful setup
      router.push("/student/navigator/dashboard")
    } catch (error) {
      console.error('Journey setup failed:', error)
      toast({
        title: "Setup Failed",
        description: "Unable to save your journey setup. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Journey</h1>
            <p className="text-gray-600 mb-4">Tell us about your goals and preferences</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">
                Step {step} of {totalSteps}
              </span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Career Goals & Interests"}
                {step === 2 && "Academic Stage & Learning Preferences"}
                {step === 3 && "Skill Level & Commitment"}
                {step === 4 && "Vision & Summary"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Define your career aspirations and areas of interest"}
                {step === 2 && "Tell us about your current stage and how you prefer to learn"}
                {step === 3 && "Assess your current skill level and time availability"}
                {step === 4 && "Share your vision and review your journey setup"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Career Goals */}
              {step === 1 && (
                <>
                  <div className="space-y-3">
                    <Label>Career Goal *</Label>
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

                  {careerGoal === "not-decided" && (
                    <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <p className="text-sm text-cyan-800 mb-2">
                        Not sure about your career path? Take our "Find My Path" quiz to discover your strengths and
                        interests.
                      </p>
                      <Button variant="outline" size="sm" className="bg-white">
                        Take Quiz
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Preferred Domain / Field of Interest *</Label>
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
                    {domains.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {domains.map((domain) => (
                          <Badge key={domain} className="bg-cyan-800">
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Academic Stage & Learning */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="academic-stage">Current Academic Stage *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="short-term-goals">Short-Term Goals (Next 6-12 months) *</Label>
                    <Textarea
                      id="short-term-goals"
                      placeholder="What do you want to achieve in the next 6-12 months?"
                      rows={4}
                      value={shortTermGoals}
                      onChange={(e) => setShortTermGoals(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred Learning Mode *</Label>
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
                </>
              )}

              {/* Step 3: Skill Level & Commitment */}
              {step === 3 && (
                <>
                  <div className="space-y-3">
                    <Label>Skill Level Assessment *</Label>
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
                    <p className="text-sm text-gray-500">How many hours per week can you dedicate to learning?</p>
                  </div>
                </>
              )}

              {/* Step 4: Vision & Summary */}
              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vision">Expected Outcome / Vision Statement *</Label>
                    <Textarea
                      id="vision"
                      placeholder="Describe where you see yourself in the next 2-3 years..."
                      rows={5}
                      value={visionStatement}
                      onChange={(e) => setVisionStatement(e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h4 className="font-semibold">Journey Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Career Goal:</span>{" "}
                        <span className="font-medium">{careerGoal || "Not set"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Domains:</span>{" "}
                        <span className="font-medium">{domains.join(", ") || "None selected"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Academic Stage:</span>{" "}
                        <span className="font-medium">{academicStage || "Not set"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Skill Level:</span>{" "}
                        <span className="font-medium capitalize">{skillLevel}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Weekly Commitment:</span>{" "}
                        <span className="font-medium">{commitmentHours[0]} hours</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-cyan-800 hover:bg-cyan-700"
                    disabled={
                      (step === 1 && (!careerGoal || domains.length === 0)) ||
                      (step === 2 && (!academicStage || !shortTermGoals || learningModes.length === 0))
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-cyan-800 hover:bg-cyan-700"
                    disabled={!visionStatement || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
