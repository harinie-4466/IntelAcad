"use client"

import { useRouter } from "next/navigation"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle2,
  Circle,
  Clock,
  Code,
  Database,
  Edit,
  Briefcase,
  Layers,
  TrendingUp,
  Smartphone,
  Server,
  X,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface Skill {
  id: string
  name: string
  level: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string
}

interface JourneyData {
  coursesCompleted: string[]
  learningGoal: string
  skills: Skill[]
  projects: Project[]
  targetDate: string
  notes: string
}

export default function NavigatorDashboard() {
  const { toast } = useToast()
  const [selectedStream, setSelectedStream] = useState("fullstack")
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [displayedStreams, setDisplayedStreams] = useState<typeof streams | null>(null)
  const [personalizedRoadmap, setPersonalizedRoadmap] = useState<any | null>(null)
  const [submissionSummary, setSubmissionSummary] = useState<any | null>(null)
  
  useEffect(() => {
    // Load persisted submission summary so it's always displayed even after reloads
    try {
      const raw = localStorage.getItem('journeySubmissionSummary')
      if (raw) setSubmissionSummary(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  // The display summary is only populated when the user submits the update form.
  // If `submissionSummary` is null, the UI should show empty/nil placeholders.
  const displaySummary = submissionSummary ?? {
    stream: null,
    learningGoal: null,
    skills: [],
    projects: [],
    targetDate: null,
    notes: null,
    submittedAt: null,
  }

  const [journeyData, setJourneyData] = useState<Record<string, JourneyData>>({
    fullstack: { coursesCompleted: [], learningGoal: "", skills: [], projects: [], targetDate: "", notes: "" },
    "ai-ml": { coursesCompleted: [], learningGoal: "", skills: [], projects: [], targetDate: "", notes: "" },
    mobile: { coursesCompleted: [], learningGoal: "", skills: [], projects: [], targetDate: "", notes: "" },
    devops: { coursesCompleted: [], learningGoal: "", skills: [], projects: [], targetDate: "", notes: "" },
  })

  const [customCourse, setCustomCourse] = useState("")

  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" })
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showSkillDialog, setShowSkillDialog] = useState(false)

  const [newProject, setNewProject] = useState({ name: "", description: "", technologies: "" })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)

  const router = useRouter()

  // Helper functions for journey data
  const saveJourneyData = (data: Record<string, JourneyData>) => {
    setJourneyData(data)
    try {
      localStorage.setItem('journeyDataByStream', JSON.stringify(data))
    } catch (e) {
      // ignore
    }
  }

  const handleSaveJourney = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to save your journey data.",
          variant: "destructive"
        })
        return
      }

      const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
      const response = await fetch(`${base}/api/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          navigatorJourneyComplete: true, 
          journeyData: {}, 
          journeyDataByStream: journeyData 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save journey data')
      }

      // build a compact summary of the submitted data for UI feedback
      const streamData = journeyData[selectedStream] || { coursesCompleted: [], learningGoal: '', skills: [], projects: [], targetDate: '', notes: '' }
      const summary = {
        stream: selectedStream,
        learningGoal: streamData.learningGoal,
        skills: streamData.skills || [],
        projects: streamData.projects || [],
        targetDate: streamData.targetDate,
        notes: streamData.notes,
        submittedAt: new Date().toISOString(),
      }

      setSubmissionSummary(summary)

      // persist the summary so it's always visible and updates on subsequent saves
      try {
        localStorage.setItem('journeySubmissionSummary', JSON.stringify(summary))
      } catch (e) {
        console.warn('Failed to persist journey submission summary', e)
      }

      // NOTE: we intentionally DO NOT persist skills/projects into a local 'profile' fallback here.
      // Profile updates should come from the dedicated Profile Setup / Update forms so the user's
      // profile only contains projects/skills they explicitly submit there.

      toast({
        title: "Journey Updated!",
        description: "Your journey data has been saved successfully.",
      })
    } catch (error) {
      console.error('Journey save failed:', error)
      toast({
        title: "Save Failed",
        description: "Unable to save your journey data. Please try again.",
        variant: "destructive"
      })
    }
  }

  // ref to the update form container so we can scroll to it when the button is clicked
  const updateFormRef = useRef<HTMLDivElement | null>(null)

  const handleToggleUpdateForm = () => {
    if (!showUpdateForm) {
      setShowUpdateForm(true)
      // scroll after a tick to allow the form to render
      setTimeout(() => {
        try {
          updateFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch (e) {
          // ignore
        }
      }, 80)
    } else {
      setShowUpdateForm(false)
    }
  }


  const streams = [
    {
      id: "fullstack",
      name: "Full Stack Development",
      icon: Layers,
      color: "cyan",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800",
      progress: 65,
      description: "Master both frontend and backend technologies",
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      progress: 45,
      description: "Dive into artificial intelligence and data science",
    },
    {
      id: "mobile",
      name: "Mobile Development",
      icon: Smartphone,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      progress: 30,
      description: "Build native and cross-platform mobile apps",
    },
    {
      id: "devops",
      name: "DevOps & Cloud",
      icon: Server,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      progress: 20,
      description: "Learn deployment, CI/CD, and cloud infrastructure",
    },
  ]

  // Note: roadmaps are now generated server-side and returned via GET /api/journey as `personalizedRoadmap`.

  const courseOptionsByStream: Record<string, string[]> = {
    fullstack: [
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
    ],
    "ai-ml": [
      "Python Programming",
      "Mathematics for ML",
      "Statistics & Probability",
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
      "Neural Networks",
      "CNNs & Computer Vision",
      "RNNs & NLP",
      "Reinforcement Learning",
      "Transformers & LLMs",
      "MLOps & Deployment",
    ],
    mobile: [
      "Mobile UI/UX Principles",
      "React Native Basics",
      "State Management",
      "iOS Development (Swift)",
      "Android Development (Kotlin)",
      "Mobile Performance",
      "Push Notifications",
      "App Store Deployment",
    ],
    devops: [
      "Linux Fundamentals",
      "Networking Basics",
      "Shell Scripting",
      "Git & GitHub Actions",
      "Jenkins",
      "Docker",
      "AWS Services",
      "Kubernetes",
      "Terraform",
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in-progress":
        return "text-cyan-600 bg-cyan-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  useEffect(() => {
    const load = async () => {
      if (typeof window === 'undefined') return
      const token = localStorage.getItem('token')
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
      if (token) {
        try {
          const res = await fetch(`${base}/api/journey`, { headers: { Authorization: `Bearer ${token}` } })
          if (res.ok) {
            const json = await res.json()
            // Merge server journeyDataByStream with any locally persisted selections so
            // local checkbox toggles are not lost when the server returns a base object.
            const serverData = json.journeyDataByStream || (json.journey && json.journey.journeyDataByStream) || null
            if (serverData) {
              try {
                const localRaw = localStorage.getItem('journeyDataByStream')
                const localData = localRaw ? JSON.parse(localRaw) : {}
                const merged: Record<string, any> = { ...serverData }
                // shallow merge per stream, prefer local coursesCompleted when present
                for (const key of Object.keys(localData)) {
                  merged[key] = merged[key] || {}
                  merged[key].coursesCompleted = Array.isArray(localData[key].coursesCompleted) && localData[key].coursesCompleted.length > 0 ? localData[key].coursesCompleted : (merged[key].coursesCompleted || [])
                  merged[key].skills = Array.isArray(localData[key].skills) && localData[key].skills.length > 0 ? localData[key].skills : (merged[key].skills || [])
                  merged[key].projects = Array.isArray(localData[key].projects) && localData[key].projects.length > 0 ? localData[key].projects : (merged[key].projects || [])
                }
                setJourneyData(merged)
                // persist merged to local so toggles reflect immediately
                try { localStorage.setItem('journeyDataByStream', JSON.stringify(merged)) } catch(e) {}
              } catch (e) {
                setJourneyData(serverData)
              }
            } else if (json.journey && json.journey.journeyDataByStream) {
              setJourneyData(json.journey.journeyDataByStream)
            }
            // personalized roadmap from server
            if (json.personalizedRoadmap) {
              setPersonalizedRoadmap(json.personalizedRoadmap)
              const keys = Object.keys(json.personalizedRoadmap.streams || {})
              const filtered = streams.filter((s) => keys.includes(s.id))
              setDisplayedStreams(filtered.length ? filtered : streams)
              setSelectedStream((prev) => (keys.includes(prev) ? prev : (filtered[0]?.id || prev)))
            }
            return
          }
        } catch (e) {
          console.error('[dashboard] load journey from API failed', e)
        }
      }

      // fallback to localStorage for older clients
      const saved = localStorage.getItem('journeyDataByStream')
      if (saved) setJourneyData(JSON.parse(saved))
      const pr = localStorage.getItem('personalizedRoadmap')
      if (pr) {
        try {
          const parsed = JSON.parse(pr)
          setPersonalizedRoadmap(parsed)
          const streamKeys = Object.keys(parsed.streams || {})
          const filtered = streams.filter((s) => streamKeys.includes(s.id))
          setDisplayedStreams(filtered.length ? filtered : streams)
        } catch (e) {
          console.warn('Failed to parse local personalizedRoadmap', e)
          setDisplayedStreams(streams)
        }
      } else {
        setDisplayedStreams(streams)
      }
      
      // Load personalized roadmap and restrict displayed streams if present
      try {
        const pr = localStorage.getItem('personalizedRoadmap')
        if (pr) {
          const parsed = JSON.parse(pr)
          setPersonalizedRoadmap(parsed)
          const streamKeys = Object.keys(parsed.streams || {})
          // Map keys to stream definitions from `streams` constant
          const filtered = streams.filter((s) => streamKeys.includes(s.id))
          if (filtered.length > 0) {
            setDisplayedStreams(filtered)
            setSelectedStream((prev) => (streamKeys.includes(prev) ? prev : filtered[0].id))
          } else {
            // fallback: show original streams array
            setDisplayedStreams(streams)
          }
        } else {
          setDisplayedStreams(streams)
        }
      } catch (e) {
        console.warn('Failed to parse personalizedRoadmap from localStorage', e)
        setDisplayedStreams(streams)
      }
    }

    load()
  }, [])



  const handleAddCustomCourse = () => {
    if (customCourse.trim() && !journeyData[selectedStream].coursesCompleted.includes(customCourse.trim())) {
      const currentData = journeyData[selectedStream]
      saveJourneyData({
        ...journeyData,
        [selectedStream]: {
          ...currentData,
          coursesCompleted: [...currentData.coursesCompleted, customCourse.trim()],
        },
      })
      setCustomCourse("")
      // update stream progress
      setDisplayedStreams(prev => prev ? prev.map(s => s.id === selectedStream ? { ...s, progress: computeStreamProgress(selectedStream, [...currentData.coursesCompleted, customCourse.trim()]) } : s) : prev)
    }
  }

  const handleRemoveCourse = (course: string) => {
    const currentData = journeyData[selectedStream]
    saveJourneyData({
      ...journeyData,
      [selectedStream]: {
        ...currentData,
        coursesCompleted: currentData.coursesCompleted.filter((c) => c !== course),
      },
    })
    // update stream progress
    setDisplayedStreams(prev => prev ? prev.map(s => s.id === selectedStream ? { ...s, progress: computeStreamProgress(selectedStream, currentData.coursesCompleted.filter((c) => c !== course)) } : s) : prev)
  }

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const currentData = journeyData[selectedStream]
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
      }
      saveJourneyData({
        ...journeyData,
        [selectedStream]: {
          ...currentData,
          skills: [...currentData.skills, skill],
        },
      })
      setNewSkill({ name: "", level: "Beginner" })
      setShowSkillDialog(false)
      // Do NOT persist dashboard-added skills into a local `profile` fallback here.
      // Profile should only be updated by the Profile Setup / Update forms.
      toast({ title: "Skill Added", description: "Your skill has been added successfully." })
    }
  }

  const handleEditSkill = () => {
    if (editingSkill && editingSkill.name.trim()) {
      const currentData = journeyData[selectedStream]
      saveJourneyData({
        ...journeyData,
        [selectedStream]: {
          ...currentData,
          skills: currentData.skills.map((s) => (s.id === editingSkill.id ? editingSkill : s)),
        },
      })
      setEditingSkill(null)
      setShowSkillDialog(false)
      // Do NOT persist dashboard-edited skills into a local `profile` fallback here.
      toast({ title: "Skill Updated", description: "Your skill has been updated successfully." })
    }
  }

  const handleDeleteSkill = (id: string) => {
    const currentData = journeyData[selectedStream]
    saveJourneyData({
      ...journeyData,
      [selectedStream]: {
        ...currentData,
        skills: currentData.skills.filter((s) => s.id !== id),
      },
    })
    // Do NOT remove skills from the local profile here; profile changes should
    // only come from explicit Profile Setup / Update flows.
    toast({ title: "Skill Deleted", description: "Your skill has been removed." })
  }

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      const currentData = journeyData[selectedStream]
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        technologies: newProject.technologies.trim(),
      }
      saveJourneyData({
        ...journeyData,
        [selectedStream]: {
          ...currentData,
          projects: [...currentData.projects, project],
        },
      })
      setNewProject({ name: "", description: "", technologies: "" })
      setShowProjectDialog(false)
      // Do NOT persist dashboard-added projects into a local `profile` fallback here.
      toast({ title: "Project Added", description: "Your project has been added successfully." })
      // updating displayed stream progress isn't directly tied to projects, but persist data
      setDisplayedStreams(prev => prev ? prev.map(s => s.id === selectedStream ? { ...s } : s) : prev)
    }
  }

  const handleEditProject = () => {
    if (editingProject && editingProject.name.trim()) {
      const currentData = journeyData[selectedStream]
      saveJourneyData({
        ...journeyData,
        [selectedStream]: {
          ...currentData,
          projects: currentData.projects.map((p) => (p.id === editingProject.id ? editingProject : p)),
        },
      })
      setEditingProject(null)
      setShowProjectDialog(false)
      // Do NOT persist dashboard-edited projects into a local `profile` fallback here.
      toast({ title: "Project Updated", description: "Your project has been updated successfully." })
    }
  }

  const handleDeleteProject = (id: string) => {
    const currentData = journeyData[selectedStream]
    saveJourneyData({
      ...journeyData,
      [selectedStream]: {
        ...currentData,
        projects: currentData.projects.filter((p) => p.id !== id),
      },
    })
    // Do NOT remove projects from the local profile here; profile changes should
    // only come from explicit Profile Setup / Update flows.
    toast({ title: "Project Deleted", description: "Your project has been removed." })
    setDisplayedStreams(prev => prev ? prev.map(s => s.id === selectedStream ? { ...s } : s) : prev)
  }

  const computeStreamProgress = (streamId: string, completedCourses: string[]) => {
    const total = (courseOptionsByStream[streamId] || []).length || ((displayRoadmap && displayRoadmap.courses && displayRoadmap.courses.length) || 0)
    if (!total) return 0
    const completed = completedCourses ? completedCourses.length : 0
    return Math.round((completed / total) * 100)
  }

  // Recompute and update displayed stream progress whenever journeyData changes (checkbox toggle, add/remove)
  useEffect(() => {
    if (!displayedStreams) return
    setDisplayedStreams(prev => prev ? prev.map(s => ({
      ...s,
      progress: computeStreamProgress(s.id, journeyData[s.id]?.coursesCompleted || [])
    })) : prev)
  }, [journeyData])


  const activeStreams = displayedStreams || streams
  const selectedStreamData = activeStreams.find((s) => s.id === selectedStream) || activeStreams[0]

  // Derive a usable roadmap structure from the server-provided `personalizedRoadmap`.
  // Older code referenced a `roadmaps` constant which was removed; build a safe
  // fallback so the UI doesn't crash if fields are missing.
  const currentRoadmap = ((): any[] => {
    try {
      const prs = personalizedRoadmap?.streams?.[selectedStream]
      if (!prs || !prs.phases) return []
      return prs.phases.map((p: any) => {
        const items = (p.items || p.courses || []).map((it: any) => {
          if (typeof it === 'string') {
            return {
              name: it,
              duration: '',
              completed: currentJourneyData.coursesCompleted?.includes?.(it) || false,
              current: false,
              progress: 0,
            }
          }
          return {
            name: it.name || it.title || 'Untitled',
            duration: it.duration || '',
            completed: !!it.completed,
            current: !!it.current,
            progress: it.progress || 0,
            ...it,
          }
        })

        return {
          phase: p.phase || p.title || 'Phase',
          status: p.status || 'upcoming',
          items,
        }
      })
    } catch (e) {
      console.warn('Failed to derive currentRoadmap from personalizedRoadmap', e)
      return []
    }
  })()

  // Build a simple fallback roadmap from our predefined course lists for the stream
  const buildFallbackRoadmap = (streamId: string) => {
    const courses = courseOptionsByStream[streamId] || []
    const foundation = courses.slice(0, Math.max(2, Math.floor(courses.length * 0.2)))
    const core = courses.slice(foundation.length, Math.min(courses.length, foundation.length + Math.max(3, Math.floor(courses.length * 0.6))))
    const advanced = courses.slice(foundation.length + core.length, foundation.length + core.length + 3)
    const projects = ['Capstone Project', 'Interview Prep & Mock Interviews']

    return {
      phases: [
        { phase: 'Foundation', items: foundation, status: 'completed' },
        { phase: 'Core Skills', items: core, status: 'in-progress' },
        { phase: 'Advanced Topics', items: advanced, status: 'upcoming' },
        { phase: 'Projects & Prep', items: projects, status: 'upcoming' },
      ],
      courses,
    }
  }

  // Use server roadmap if available, otherwise fallback to predefined roadmap per stream
  const displayRoadmap = (personalizedRoadmap && personalizedRoadmap.streams && personalizedRoadmap.streams[selectedStream])
    ? personalizedRoadmap.streams[selectedStream]
    : buildFallbackRoadmap(selectedStream)
  const currentCourseOptions = courseOptionsByStream[selectedStream] || []
  const currentJourneyData = journeyData[selectedStream] || { coursesCompleted: [], learningGoal: "", skills: [], projects: [], targetDate: "", notes: "" }
  
  // Define course options for each stream
  const courseOptions: Record<string, string[]> = {
    fullstack: ["HTML/CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "SQL", "Git"],
    "ai-ml": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Analysis", "Statistics", "Linear Algebra"],
    mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX", "App Store Guidelines", "REST APIs", "Firebase"],
    devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Shell Scripting", "Monitoring", "Infrastructure as Code"]
  }
  
  const currentCourseOptionsFromSetup = courseOptions[selectedStream] || []
  
  const handleCourseToggle = (course: string) => {
    // Build updated journeyData and persist via saveJourneyData (which also writes localStorage)
    setJourneyData(prev => {
      const prevList = prev[selectedStream]?.coursesCompleted || []
      const newList = prevList.includes(course) ? prevList.filter(c => c !== course) : [...prevList, course]
      const updated = {
        ...prev,
        [selectedStream]: {
          ...prev[selectedStream],
          coursesCompleted: newList,
        }
      }
      // persist via helper
      saveJourneyData(updated)

      // update displayed stream progress
      setDisplayedStreams(ds => ds ? ds.map(s => s.id === selectedStream ? { ...s, progress: computeStreamProgress(selectedStream, newList) } : s) : ds)

      return updated
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Journey Navigator</h1>
            <p className="text-gray-600">Track your progress and plan your learning path</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Career Streams</CardTitle>
              <CardDescription>Choose and track multiple career paths simultaneously</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {(activeStreams || []).map((stream) => {
                  const Icon = stream.icon
                  const isSelected = selectedStream === stream.id
                  return (
                    <div
                      key={stream.id}
                      onClick={() => setSelectedStream(stream.id)}
                      className={`p-6 border-2 rounded-lg hover:shadow-lg transition-all cursor-pointer ${
                        isSelected ? "border-cyan-800 bg-cyan-50 shadow-md" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 ${stream.bgColor} rounded-lg`}>
                          <Icon className={`h-6 w-6 ${stream.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{stream.name}</h3>
                          <p className="text-sm text-gray-600">{stream.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{stream.progress ?? 0}%</span>
                        </div>
                        <Progress value={stream.progress ?? 0} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          
          {/* Personalized Roadmap Card: shows courses and phases for the selected stream */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Personalized Roadmap</CardTitle>
                  <CardDescription>Recommendations based on your journey setup</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleToggleUpdateForm}
                    className="flex items-center gap-2 opacity-100 text-cyan-800 border border-gray-200"
                  >
                    {showUpdateForm ? <ChevronUp className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {showUpdateForm ? "Hide Form" : "Update My Journey"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedStreamData?.name || 'Selected Stream'}</h3>
                  <Badge className="bg-cyan-100 text-cyan-800">Based on your inputs</Badge>
                </div>

                {/* Render phases from displayRoadmap */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {(displayRoadmap?.phases || []).map((p: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-50 text-cyan-700 font-semibold">{idx + 1}</div>
                            <h4 className="font-semibold">{p.phase}</h4>
                          </div>
                          <span className="text-sm text-gray-500">{p.items?.length || 0} items</span>
                        </div>
                        <ul className="space-y-1">
                          {p.items?.map((it: any, i: number) => (
                            <li key={i} className="flex items-center justify-between text-sm py-1">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={currentJourneyData.coursesCompleted.includes(typeof it === 'string' ? it : it.name)}
                                  onChange={() => handleCourseToggle(typeof it === 'string' ? it : it.name)}
                                />
                                <span className="truncate">{typeof it === 'string' ? it : it.name}</span>
                              </div>
                              <span className="text-xs text-gray-400">{i === 0 ? 'Suggested start' : ''}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Overall course list and progress */}
                  <div>
                    <h4 className="font-semibold mb-3">All Recommended Courses</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {(displayRoadmap?.courses || []).map((course: string) => (
                        <div key={course} className="p-3 border rounded-md flex items-center justify-between bg-white">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={currentJourneyData.coursesCompleted.includes(course)}
                              onChange={() => handleCourseToggle(course)}
                            />
                            <div className="text-sm">{course}</div>
                          </div>
                          <div className="text-xs text-gray-500">{currentJourneyData.coursesCompleted.includes(course) ? 'Done' : 'Pending'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Title, subtitle and update button removed per user request */}

          {showUpdateForm && (
            <div ref={updateFormRef}>
              <Card className="mb-8">
              <CardHeader>
                <CardTitle>Update {selectedStreamData?.name} Journey</CardTitle>
                <CardDescription>Track your progress with comprehensive journey details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="learning-goal" className="text-base font-semibold">
                    1. Current Learning Goal
                  </Label>
                  <Input
                    id="learning-goal"
                    placeholder="e.g., Master React and build 3 projects"
                    value={currentJourneyData.learningGoal ?? ''}
                    onChange={(e) =>
                      saveJourneyData({
                        ...journeyData,
                        [selectedStream]: { ...currentJourneyData, learningGoal: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">2. Skills Acquired</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setEditingSkill(null)
                        setNewSkill({ name: "", level: "Beginner" })
                        setShowSkillDialog(true)
                      }}
                      className="bg-cyan-800 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                  {currentJourneyData.skills.length > 0 ? (
                    <div className="grid gap-3">
                      {currentJourneyData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-gray-600">Level: {skill.level}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSkill(skill)
                                setShowSkillDialog(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No skills added yet</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">3. Projects Completed</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setEditingProject(null)
                        setNewProject({ name: "", description: "", technologies: "" })
                        setShowProjectDialog(true)
                      }}
                      className="bg-cyan-800 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Project
                    </Button>
                  </div>
                  {currentJourneyData.projects.length > 0 ? (
                    <div className="grid gap-3">
                      {currentJourneyData.projects.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProject(project)
                                  setShowProjectDialog(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          <p className="text-sm">
                            <span className="font-medium">Technologies:</span> {project.technologies}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No projects added yet</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="target-date" className="text-base font-semibold">
                    4. Target Completion Date
                  </Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={currentJourneyData.targetDate ?? ''}
                    onChange={(e) =>
                      saveJourneyData({
                        ...journeyData,
                        [selectedStream]: { ...currentJourneyData, targetDate: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-semibold">
                    5. Notes & Reflections
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes, reflections, or challenges you're facing..."
                    rows={4}
                    value={currentJourneyData.notes ?? ''}
                    onChange={(e) =>
                      saveJourneyData({
                        ...journeyData,
                        [selectedStream]: { ...currentJourneyData, notes: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowUpdateForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSaveJourney} className="flex-1 bg-cyan-800 hover:bg-cyan-700">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
            )}

            {submissionSummary && (
              <Card className="mb-8 border-2 border-dashed border-cyan-100 bg-white">
                <CardHeader>
                  <CardTitle>Latest Update Summary</CardTitle>
                  <CardDescription>Shows the most recent journey inputs you submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600"><strong>Stream</strong></div>
                      <div className="text-lg font-semibold">{displaySummary.stream || '—'}</div>

                      <div className="text-sm text-gray-600 mt-3"><strong>Learning Goal</strong></div>
                      <div className="text-base">{displaySummary.learningGoal || '—'}</div>

                      <div className="text-sm text-gray-600 mt-3"><strong>Target Date</strong></div>
                      <div className="text-base">{displaySummary.targetDate || '—'}</div>

                      <div className="text-sm text-gray-600 mt-3"><strong>Notes</strong></div>
                      <div className="text-base text-gray-700">{displaySummary.notes || '—'}</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600"><strong>Skills added</strong></div>
                        {displaySummary.skills && displaySummary.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {displaySummary.skills.map((s: any, i: number) => (
                              <Badge key={i} className="bg-cyan-100 text-cyan-800">{s.name || s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mt-2">No skills added</div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-gray-600"><strong>Projects added</strong></div>
                        {displaySummary.projects && displaySummary.projects.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {displaySummary.projects.map((p: any, i: number) => (
                              <Badge key={i} className="bg-green-50 text-green-800">{p.name || p}</Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mt-2">No projects added</div>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 mt-4">Last submitted: {displaySummary.submittedAt ? new Date(displaySummary.submittedAt).toLocaleString() : '—'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                <DialogDescription>
                  {editingSkill ? "Update your skill details" : "Add a new skill to your profile"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    placeholder="e.g., React.js"
                    value={editingSkill ? (editingSkill.name ?? '') : (newSkill.name ?? '')}
                    onChange={(e) =>
                      editingSkill
                        ? setEditingSkill({ ...editingSkill, name: e.target.value })
                        : setNewSkill({ ...newSkill, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Proficiency Level</Label>
                  <select
                    id="skill-level"
                    className="w-full p-2 border rounded-md"
                    value={editingSkill ? (editingSkill.level ?? 'Beginner') : (newSkill.level ?? 'Beginner')}
                    onChange={(e) =>
                      editingSkill
                        ? setEditingSkill({ ...editingSkill, level: e.target.value })
                        : setNewSkill({ ...newSkill, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowSkillDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={editingSkill ? handleEditSkill : handleAddSkill}
                  className="bg-cyan-800 hover:bg-cyan-700"
                >
                  {editingSkill ? "Update" : "Add"} Skill
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                <DialogDescription>
                  {editingProject ? "Update your project details" : "Add a new project to showcase your work"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., E-commerce Website"
                    value={editingProject ? (editingProject.name ?? '') : (newProject.name ?? '')}
                    onChange={(e) =>
                      editingProject
                        ? setEditingProject({ ...editingProject, name: e.target.value })
                        : setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Brief description of the project..."
                    rows={3}
                    value={editingProject ? (editingProject.description ?? '') : (newProject.description ?? '')}
                    onChange={(e) =>
                      editingProject
                        ? setEditingProject({ ...editingProject, description: e.target.value })
                        : setNewProject({ ...newProject, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-technologies">Technologies Used</Label>
                  <Input
                    id="project-technologies"
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={editingProject ? (editingProject.technologies ?? '') : (newProject.technologies ?? '')}
                    onChange={(e) =>
                      editingProject
                        ? setEditingProject({ ...editingProject, technologies: e.target.value })
                        : setNewProject({ ...newProject, technologies: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowProjectDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={editingProject ? handleEditProject : handleAddProject}
                  className="bg-cyan-800 hover:bg-cyan-700"
                >
                  {editingProject ? "Update" : "Add"} Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>  
        </div>
      </main>

      <Footer />
    </div>
  )
}
