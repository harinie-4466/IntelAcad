"use client"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Footer } from "@/components/footer"
import { CheckCircle2, Circle, Clock, ArrowLeft, Layers, TrendingUp, Smartphone, Server } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function CareerStreamRoadmap() {
  const router = useRouter()
  const params = useParams()
  const streamId = params.id as string

  const streamData: Record<string, any> = {
    fullstack: {
      name: "Full Stack Development",
      icon: Layers,
      color: "cyan",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800",
      progress: 65,
      description: "Master both frontend and backend technologies",
      roadmap: [
        {
          phase: "Foundation",
          status: "completed",
          items: [
            { name: "HTML & CSS Basics", completed: true, duration: "2 weeks" },
            { name: "JavaScript Fundamentals", completed: true, duration: "3 weeks" },
            { name: "Git & Version Control", completed: true, duration: "1 week" },
            { name: "Responsive Design", completed: true, duration: "2 weeks" },
          ],
        },
        {
          phase: "Frontend Development",
          status: "in-progress",
          items: [
            { name: "React.js Essentials", completed: true, duration: "4 weeks" },
            { name: "State Management (Redux)", completed: true, duration: "2 weeks" },
            { name: "Next.js Framework", completed: false, duration: "3 weeks", current: true, progress: 60 },
            { name: "TypeScript", completed: false, duration: "2 weeks" },
          ],
        },
        {
          phase: "Backend Development",
          status: "upcoming",
          items: [
            { name: "Node.js & Express", completed: false, duration: "4 weeks" },
            { name: "RESTful APIs", completed: false, duration: "3 weeks" },
            { name: "Database Design (SQL)", completed: false, duration: "3 weeks" },
            { name: "Authentication & Security", completed: false, duration: "2 weeks" },
          ],
        },
        {
          phase: "Advanced Topics",
          status: "upcoming",
          items: [
            { name: "Microservices Architecture", completed: false, duration: "4 weeks" },
            { name: "Docker & Containerization", completed: false, duration: "3 weeks" },
            { name: "AWS Cloud Services", completed: false, duration: "4 weeks" },
            { name: "System Design", completed: false, duration: "5 weeks" },
          ],
        },
      ],
    },
    "ai-ml": {
      name: "AI & Machine Learning",
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      progress: 45,
      description: "Dive into artificial intelligence and data science",
      roadmap: [
        {
          phase: "Mathematics Foundation",
          status: "completed",
          items: [
            { name: "Linear Algebra", completed: true, duration: "3 weeks" },
            { name: "Calculus & Optimization", completed: true, duration: "3 weeks" },
            { name: "Probability & Statistics", completed: true, duration: "4 weeks" },
          ],
        },
        {
          phase: "Programming & Tools",
          status: "in-progress",
          items: [
            { name: "Python for Data Science", completed: true, duration: "3 weeks" },
            { name: "NumPy & Pandas", completed: true, duration: "2 weeks" },
            { name: "Data Visualization", completed: false, duration: "2 weeks", current: true, progress: 45 },
            { name: "Jupyter Notebooks", completed: false, duration: "1 week" },
          ],
        },
        {
          phase: "Machine Learning",
          status: "upcoming",
          items: [
            { name: "Supervised Learning", completed: false, duration: "4 weeks" },
            { name: "Unsupervised Learning", completed: false, duration: "3 weeks" },
            { name: "Model Evaluation", completed: false, duration: "2 weeks" },
            { name: "Feature Engineering", completed: false, duration: "3 weeks" },
          ],
        },
        {
          phase: "Deep Learning & AI",
          status: "upcoming",
          items: [
            { name: "Neural Networks", completed: false, duration: "4 weeks" },
            { name: "TensorFlow & PyTorch", completed: false, duration: "5 weeks" },
            { name: "Computer Vision", completed: false, duration: "4 weeks" },
            { name: "Natural Language Processing", completed: false, duration: "5 weeks" },
          ],
        },
      ],
    },
    mobile: {
      name: "Mobile Development",
      icon: Smartphone,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      progress: 30,
      description: "Build native and cross-platform mobile apps",
      roadmap: [
        {
          phase: "Mobile Fundamentals",
          status: "completed",
          items: [
            { name: "Mobile UI/UX Principles", completed: true, duration: "2 weeks" },
            { name: "JavaScript/TypeScript", completed: true, duration: "3 weeks" },
            { name: "Mobile Design Patterns", completed: true, duration: "2 weeks" },
          ],
        },
        {
          phase: "React Native",
          status: "in-progress",
          items: [
            { name: "React Native Basics", completed: true, duration: "3 weeks" },
            { name: "Navigation & Routing", completed: false, duration: "2 weeks", current: true, progress: 30 },
            { name: "State Management", completed: false, duration: "2 weeks" },
            { name: "Native Modules", completed: false, duration: "3 weeks" },
          ],
        },
        {
          phase: "Advanced Mobile",
          status: "upcoming",
          items: [
            { name: "Push Notifications", completed: false, duration: "2 weeks" },
            { name: "Offline Storage", completed: false, duration: "2 weeks" },
            { name: "Camera & Media", completed: false, duration: "3 weeks" },
            { name: "Performance Optimization", completed: false, duration: "3 weeks" },
          ],
        },
        {
          phase: "Deployment & Testing",
          status: "upcoming",
          items: [
            { name: "App Store Deployment", completed: false, duration: "2 weeks" },
            { name: "Testing & Debugging", completed: false, duration: "3 weeks" },
            { name: "CI/CD for Mobile", completed: false, duration: "2 weeks" },
            { name: "Analytics & Monitoring", completed: false, duration: "2 weeks" },
          ],
        },
      ],
    },
    devops: {
      name: "DevOps & Cloud",
      icon: Server,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      progress: 20,
      description: "Learn deployment, CI/CD, and cloud infrastructure",
      roadmap: [
        {
          phase: "Linux & Networking",
          status: "in-progress",
          items: [
            { name: "Linux Command Line", completed: true, duration: "2 weeks" },
            { name: "Shell Scripting", completed: false, duration: "2 weeks", current: true, progress: 20 },
            { name: "Networking Basics", completed: false, duration: "2 weeks" },
            { name: "Security Fundamentals", completed: false, duration: "2 weeks" },
          ],
        },
        {
          phase: "Version Control & CI/CD",
          status: "upcoming",
          items: [
            { name: "Git Advanced", completed: false, duration: "2 weeks" },
            { name: "GitHub Actions", completed: false, duration: "2 weeks" },
            { name: "Jenkins", completed: false, duration: "3 weeks" },
            { name: "GitLab CI", completed: false, duration: "2 weeks" },
          ],
        },
        {
          phase: "Containerization",
          status: "upcoming",
          items: [
            { name: "Docker Fundamentals", completed: false, duration: "3 weeks" },
            { name: "Docker Compose", completed: false, duration: "2 weeks" },
            { name: "Kubernetes Basics", completed: false, duration: "4 weeks" },
            { name: "Helm Charts", completed: false, duration: "2 weeks" },
          ],
        },
        {
          phase: "Cloud Platforms",
          status: "upcoming",
          items: [
            { name: "AWS Core Services", completed: false, duration: "4 weeks" },
            { name: "Infrastructure as Code", completed: false, duration: "3 weeks" },
            { name: "Monitoring & Logging", completed: false, duration: "3 weeks" },
            { name: "Cloud Security", completed: false, duration: "3 weeks" },
          ],
        },
      ],
    },
  }

  const stream = streamData[streamId]

  if (!stream) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <StudentHeader />
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Stream Not Found</h1>
            <Button onClick={() => router.push("/student/navigator/dashboard")}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const Icon = stream.icon

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/navigator/dashboard")}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 ${stream.bgColor} rounded-lg`}>
                <Icon className={`h-8 w-8 ${stream.textColor}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{stream.name}</h1>
                <p className="text-gray-600">{stream.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-gray-900">{stream.progress}%</span>
              </div>
              <Progress value={stream.progress} className="h-3" />
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
              <CardDescription>Your personalized path with milestones and timelines</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {stream.roadmap.map((phase: any, phaseIndex: number) => (
                  <div key={phaseIndex} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`${getStatusColor(phase.status)} px-3 py-1 font-medium`}>
                        {phase.status === "completed" && "✓ Completed"}
                        {phase.status === "in-progress" && "⏵ In Progress"}
                        {phase.status === "upcoming" && "⏵ Upcoming"}
                      </Badge>
                      <h3 className="text-lg font-bold text-gray-900">{phase.phase}</h3>
                    </div>

                    <div className="ml-4 space-y-2">
                      {phase.items.map((item: any, itemIndex: number) => (
                        <div
                          key={itemIndex}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            item.current
                              ? "border-cyan-500 bg-cyan-50"
                              : item.completed
                                ? "border-gray-200 bg-white"
                                : "border-gray-200 bg-white"
                          } hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div>
                              {item.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : item.current ? (
                                <Clock className="h-5 w-5 text-cyan-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-medium ${item.current ? "text-cyan-900" : item.completed ? "text-gray-700" : "text-gray-600"}`}
                              >
                                {item.name}
                              </h4>
                              {item.current && item.progress && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-gray-600">Current Progress</span>
                                    <span className="text-xs font-semibold text-cyan-800">{item.progress}%</span>
                                  </div>
                                  <Progress value={item.progress} className="h-1.5" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{item.duration}</span>
                          </div>
                          {item.current && (
                            <Button size="sm" className="ml-4 bg-cyan-800 hover:bg-cyan-700">
                              Continue Learning
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {phaseIndex < stream.roadmap.length - 1 && <div className="ml-6 my-4 h-6 w-0.5 bg-gray-300"></div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
