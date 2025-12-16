"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    const profile = localStorage.getItem("studentProfile")
    if (profile) {
      const profileData = JSON.parse(profile)
      setProfileCompleted(profileData.profileCompleted === true)
    }
  }, [])

  const handleStartJourney = () => {
    if (!isLoggedIn) {
      // Store the intended destination
      localStorage.setItem("redirectAfterLogin", "/student/profile/setup")
      router.push("/login")
    } else if (profileCompleted) {
      router.push("/student/journey")
    } else {
      router.push("/student/profile/setup")
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/40 to-purple-100/30" />

      {/* Decorative elements for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-8 text-cyan-600">
            Where Streams meet Strategies
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
            Get personalized career guidance, skill roadmaps, and industry insights tailored for Computer Science
            students with our intelligent platform.
          </p>

          <div className="flex justify-center mb-16">
            <Button
              size="lg"
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-10 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              onClick={handleStartJourney}
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
