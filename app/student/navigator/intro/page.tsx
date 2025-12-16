"use client"

import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Target, TrendingUp, Award, Lightbulb, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function NavigatorIntro() {
  const router = useRouter()
  const [isJourneySetup, setIsJourneySetup] = useState(false)
  const [isProfileCompleted, setIsProfileCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (typeof window === "undefined") return

      // try backend first
  const token = localStorage.getItem('token')
  if (token) {
        try {
          const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
          const res = await fetch(`${base}/api/journey`, { headers: { Authorization: `Bearer ${token}` } })
          if (res.ok) {
            const json = await res.json()
            setIsJourneySetup(!!json.navigatorJourneyComplete || (json.journeyData && Object.keys(json.journeyData).length > 0))
          } else {
            // fallback to localStorage
            const journeyData = localStorage.getItem('journeyData')
            setIsJourneySetup(!!journeyData)
          }
        } catch (e) {
          const journeyData = localStorage.getItem('journeyData')
          setIsJourneySetup(!!journeyData)
        }
      } else {
        const journeyData = localStorage.getItem('journeyData')
        setIsJourneySetup(!!journeyData)
      }

      // reuse token variable
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          setIsProfileCompleted(false)
          setIsLoading(false)
          return
        }

        const data = await res.json().catch(() => ({}))
        const profile = data.profile || {}
        setIsProfileCompleted(profile.profileCompleted === true)
      } catch (err) {
        // on error, fall back to not completed
        setIsProfileCompleted(false)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleButtonClick = () => {
    if (!isProfileCompleted) {
      // First time - go to navigator setup
      router.push("/student/navigator/setup")
    } else if (isJourneySetup) {
      // Profile completed and journey setup - continue to dashboard
      router.push("/student/navigator/dashboard")
    } else {
      // Profile completed but journey not setup - go to journey setup
      router.push("/student/navigator/setup")
    }
  }

  const getButtonText = () => {
    if (isLoading) return "Loading..."
    if (!isProfileCompleted) return "Start Your Journey"
    return isJourneySetup ? "Continue Journey" : "Start Your Journey"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex flex-col">
      <StudentHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Personalized Academic and Career Roadmap</h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                The Journey Navigator uses AI to guide you from enrollment to placement. Define your goals, track your
                progress, and get personalized recommendations based on your unique profile.
              </p>
              <Button
                size="lg"
                onClick={handleButtonClick}
                disabled={isLoading}
                className="bg-cyan-800 hover:bg-cyan-700 text-white px-8 py-6 text-lg"
              >
                {getButtonText()}
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-cyan-100 rounded-lg">
                      <Target className="h-6 w-6 text-cyan-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Goal-Oriented Planning</h3>
                      <p className="text-gray-600 mb-4">
                        Set clear career objectives and get a customized roadmap tailored to your aspirations.
                      </p>
                    </div>
                  </div>
                  {/* Added benefits list */}
                  <div className="ml-14 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span>Define short-term and long-term career goals</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span>Get semester-wise action plans</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span>Align academics with industry requirements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
                      <p className="text-gray-600 mb-4">
                        Monitor your learning journey with visual timelines and milestone achievements.
                      </p>
                    </div>
                  </div>
                  {/* Added benefits list */}
                  <div className="ml-14 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Visual dashboards for CGPA and skill growth</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Track certifications and project completions</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Celebrate achievements with milestone badges</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Award className="h-6 w-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Personalized Recommendations</h3>
                      <p className="text-gray-600 mb-4">
                        Receive AI-powered suggestions for courses, certifications, and skill development.
                      </p>
                    </div>
                  </div>
                  {/* Added benefits list */}
                  <div className="ml-14 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Course suggestions based on your interests</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Industry-relevant certification paths</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Project ideas matching your skill level</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-green-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Adaptive Learning Paths</h3>
                      <p className="text-gray-600 mb-4">
                        Your roadmap evolves with you, adjusting to your progress and changing interests.
                      </p>
                    </div>
                  </div>
                  {/* Added benefits list */}
                  <div className="ml-14 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dynamic roadmap updates based on progress</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Flexible paths for changing career interests</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Smart adjustments for skill gaps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-20 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get started with your personalized journey in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Set Your Goals</h3>
                  <p className="text-gray-600 text-sm">
                    Tell us about your career aspirations, interests, and target companies
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Get Your Roadmap</h3>
                  <p className="text-gray-600 text-sm">
                    Receive a personalized semester-wise plan with courses, skills, and milestones
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Track & Achieve</h3>
                  <p className="text-gray-600 text-sm">
                    Monitor progress, complete milestones, and adapt your path as you grow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

       

  <TestimonialsSection />
      </main>

      <Footer />
    </div>
  )
}
