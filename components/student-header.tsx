"use client"
import { Bell, User, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export function StudentHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/landing" className="flex items-center">
            <Image src="/intelacad-logo.png" alt="IntelAcad" width={140} height={20} className="object-contain" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/student/navigator/intro"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Journey Navigator
            </Link>
            <Link
              href="/student/certifications"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Certifications
            </Link>
            <Link
              href="/student/internships"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Internships
            </Link>
            <Link
              href="/student/resume"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Resume Builder
            </Link>
            <Link
              href="/student/assessments"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Assessments
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="p-2 hover:bg-muted/50 rounded cursor-pointer">
                        <p className="text-sm font-medium">New internship match</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="p-2 hover:bg-muted/50 rounded cursor-pointer">
                        <p className="text-sm font-medium">Application status updated</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
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
                      <Link href="/student/profile" className="block text-sm hover:text-primary transition-colors">
                        View Profile
                      </Link>
                      <Link href="/student/settings" className="block text-sm hover:text-primary transition-colors">
                        Settings
                      </Link>
                      <Link href="/login" className="block text-sm text-red-600 hover:text-red-700 transition-colors">
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
