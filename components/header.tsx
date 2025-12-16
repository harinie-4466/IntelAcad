"use client"

import { Button } from "@/components/ui/button"
import { User, ChevronDown, Bell } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/landing" className="flex items-center">
            <Image src="/intelacad-logo.png" alt="IntelAcad" width={140} height={60} className="object-contain" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/student/navigator" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              Journey Navigator
            </Link>
            <Link
              href="/student/certifications"
              className="text-muted-foreground hover:text-cyan-800 transition-colors"
            >
              Certifications
            </Link>
            <Link href="/student/internships" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              Internships
            </Link>
            <Link href="/student/resume" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              Resume Builder
            </Link>
            <Link href="/student/assessments" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              Assessments
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-cyan-800 transition-colors">
              Contact
            </Link>
          </nav>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50">
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                        <p className="text-xs text-muted-foreground mt-1">B.Tech CSE - 3rd Year</p>
                      </div>
                      <div className="border-t pt-3 space-y-2">
                        <Link
                          href="/student/profile"
                          className="block text-sm hover:text-primary transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem("isLoggedIn")
                            setIsLoggedIn(false)
                            setIsProfileOpen(false)
                            window.location.href = "/landing"
                          }}
                          className="block w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-cyan-800 hover:bg-cyan-700 text-white">Login / Register</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
